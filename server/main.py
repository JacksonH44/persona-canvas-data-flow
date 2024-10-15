from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

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
COLLECTION_NAME = "source"

# Define a Pydantic model for the sticky note
class StickyNote(BaseModel):
    content: str

# Helper function to add a sticky note to Pocketbase
def add_sticky_to_pocketbase(content: str):
    url = f"{POCKETBASE_URL}/api/collections/{COLLECTION_NAME}/records"
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

# Endpoint to receive POST request from Figma plugin
@app.post("/sticky/")
async def create_sticky(sticky: StickyNote):
    try:
        result = add_sticky_to_pocketbase(sticky.content)
        return {"message": "Sticky note added successfully", "data": result}
    except HTTPException as e:
        return {"error": str(e)}

# Example root route
@app.get("/")
async def root():
    return {"message": "Welcome to the Sticky Note API"}
