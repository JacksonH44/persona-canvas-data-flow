from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from llm import create_persona

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
def add_persona_to_pocketbase(persona):
    url = f"{POCKETBASE_URL}/api/collections/{PERSONA_COLLECTION}/records"
    headers = {"Content-Type": "application/json"}
    
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
        "story": persona["story"]
    }

    # Send POST request to Pocketbase
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    
    return response.json()

# Endpoint to receive POST request from Figma plugin
@app.post("/sticky/")
async def create_sticky(sticky: StickyNote):
    try:
        result = add_sticky_to_pocketbase(sticky.content)
        return {"message": "Sticky note added successfully", "data": result}
    except HTTPException as e:
        return {"error": str(e)}
    
@app.post("/persona/")
async def post_persona(persona: Persona):
    try:
        result = add_persona_to_pocketbase(persona.content)
        return {"message": "Persona data added successfully", "data": result}
    except HTTPException as e:
        return {"error": str(e)}
    

@app.patch("/persona/{id}")
def update_persona(id: str, content: dict):
    try:
        # Construct the URL for the specific document in the Pocketbase collection
        url = f"{POCKETBASE_URL}/api/collections/{PERSONA_COLLECTION}/records/{id}"
        
        # Prepare the data to update
        update_data = {
            "content": content.get("content")
        }

        # Make a PATCH request to the Pocketbase API
        response = requests.patch(url, json=update_data)

        # Check if the request was successful
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())

        # Return a success message with the updated data
        return {"message": "Persona updated successfully", "data": response.json()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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
    
@app.get("/personas/")
async def get_all_personas():
    try:
        # Make a GET request to the Pocketbase API to fetch all records in the "persona" collection
        response = requests.get(f"{POCKETBASE_URL}/api/collections/{SOURCE_COLLECTION}/records")
        response.raise_for_status()

        data = response.json()
        contents = [item['content'] for item in data.get('items', [])]
        content_string = " NOTE: ".join(contents)

        persona = create_persona(content_string)
        add_persona_to_pocketbase(persona)

        return persona
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stickies: {e}")


# Root route
@app.get("/")
async def root():
    return {"message": "Welcome to the Sticky Note API"}
