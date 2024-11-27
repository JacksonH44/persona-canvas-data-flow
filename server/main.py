from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from pocketbase import PocketBase
from llm import LLM

app = FastAPI()

# Configure CORS to allow access from all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pocketbase URL and admin credentials
POCKETBASE_URL = "http://127.0.0.1:8090"
SOURCE_COLLECTION = "source"
PERSONA_COLLECTION = "persona"

client = PocketBase(POCKETBASE_URL)
llm = LLM()

# Define a Pydantic model for the sticky note
class StickyNote(BaseModel):
    content: str

class Persona(BaseModel):
    type: str
    name: str
    age: str
    location: str
    occupation: str
    status: str
    education: str
    motivations: str
    goals: str
    frustrations: str
    story: str

# Helper function to determine which fields of a persona to update
def extract_fields_updated_from_source(persona):
    updated_fields = []
    
    # Extract fields from bio_data
    for field, field_data in persona.get("detail", {}).get("bio_data", {}).items():
        if field_data.get("updated") == "source":
            updated_fields.append(field)
    
    # Extract block titles from blocks
    for block in persona.get("detail", {}).get("blocks", []):
        if block.get("updated") == "source":
            updated_fields.append(block.get("title"))
    
    return updated_fields

# Helper function to add a sticky note to Pocketbase
def add_sticky_to_pocketbase(content: str):
    url = f"{POCKETBASE_URL}/api/collections/{SOURCE_COLLECTION}/records"
    headers = {"Content-Type": "application/json"}
    
    # Construct the data payload
    data = {
        "content": content
    }

    # Send POST request to Pocketbase
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
    return response.json()

# Helper function to add a sticky note to Pocketbase
async def add_persona_to_pocketbase(persona):
    url = f"{POCKETBASE_URL}/api/collections/{PERSONA_COLLECTION}/records"
    headers = {"Content-Type": "application/json"}

    # Make all other personas inactive
    await make_personas_inactive()
    
    # Construct the data payload
    data = {
        "type": persona["type"],
        "name": persona["name"],
        "age": persona["age"],
        "location": persona["location"],
        "occupation": persona["occupation"],
        "status": persona["status"],
        "education": persona["education"],
        "motivation": persona["motivations"],
        "frustration": persona["frustrations"],
        "goal": persona["goals"],
        "story": persona["story"],
        "active": persona["active"]
    }

    # Send POST request to Pocketbase
    response = requests.post(url, json=data, headers=headers)
    data = response.json()
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
    return response.json()

async def get_all_personas():
    try:
        # Make a GET request to the Pocketbase API to fetch all records in the "persona" collection
        response = requests.get(f"{POCKETBASE_URL}/api/collections/{PERSONA_COLLECTION}/records")
        response.raise_for_status()

        data = response.json()
        return data["items"]
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stickies: {e}")
    
async def make_personas_inactive(id: str = None):
    """Make all personas except for the one with id inactive"""
    all_personas = await get_all_personas()
    for persona in all_personas:
        if persona["id"] != id:
            persona["active"] = False
            client.collection("persona").update(persona["id"], persona)


# Endpoint to receive POST request from Figma plugin
@app.post("/sticky/")
async def create_sticky(sticky: StickyNote):
    try:
        result = add_sticky_to_pocketbase(sticky.content)
        return {"message": "Sticky note added successfully", "data": result}
    except HTTPException as e:
        return {"error": str(e)}
    
@app.post("/create_persona/")
async def create_persona_from_source(stickies: list[StickyNote]):
    try:
        contents = [sticky.content for sticky in stickies]
        contents = " NOTE: ".join(contents)
        
        persona = llm.create_persona(contents)
        persona["active"] = True
        response = await add_persona_to_pocketbase(persona)
        
        return { "persona": persona, "id": response["id"] }
    except HTTPException as e:
        return {"error": str(e)} 
    
@app.patch("/persona/{id}")
async def update_persona_from_widget(id: str, persona: dict):
    updated_persona = llm.update_persona_from_widget(persona)
    updated_persona["active"] = True
    await make_personas_inactive(id)
    client.collection("persona").update(id, updated_persona)
    
    return { "persona": updated_persona }
    
# Endpoint to retrieve all stickies
@app.get("/stickies/")
async def get_all_stickies():
    try:
        # Make a GET request to the Pocketbase API to fetch all records in the "stickies" collection
        response = requests.get(f"{POCKETBASE_URL}/api/collections/{SOURCE_COLLECTION}/records")
        response.raise_for_status()
    
        return response.json()
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stickies: {e}")
    
@app.get("/persona/")
async def get_persona():
    try:
        # Make a GET request to the Pocketbase API to fetch all records in the "persona" collection
        response = requests.get(f"{POCKETBASE_URL}/api/collections/{SOURCE_COLLECTION}/records")
        response.raise_for_status()

        data = response.json()
        contents = [item['content'] for item in data.get('items', [])]
        content_string = " NOTE: ".join(contents)

        persona = llm.create_persona(content_string)
        add_persona_to_pocketbase(persona)

        return persona
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stickies: {e}")


# Root route
@app.get("/")
async def root():
    return {"message": "Welcome to the Sticky Note API"}
