import os
from dotenv import load_dotenv
from groq import Groq
import json

def create_persona(stickies):
    load_dotenv()

    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": 
                """
                You are an expert in UX design and prompt engineering.
                As input you will take in a prompt, and you will improve the prompt
                to make it more accurate and suitable as an LLM system message
                to help create a user persona.
                """
            },
            {
                "role": "user",
                "content": 
                """
                Improve the following prompt:
                You are an expert in UX design.
                You take as input a series of user notes in the form
                NOTE: <message> and output a specific user persona from those notes
                in JSON format. Your response should be in the JSON format
                {
                    type: one of "primary", "secondary", "served", or "anti",
                    name: string,
                    age: string,
                    location: string
                    occupation: string
                    status: "married" or "single",
                    education: string,
                    motivations: 2 or 3 sentences,
                    goals: 2 or 3 sentences,
                    frustrations: 2 or 3 sentences,
                    story: 2 or 3 sentences
                }
                And the input as a user message is a paragraph where each sentence starts 
                with NOTE: <message> where <message> is something that has been written on 
                the sticky
                """,
            }
        ],
        model="llama-3.1-70b-versatile",
    )

    refined_prompt = chat_completion.choices[0].message.content

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": refined_prompt
            },
            {
                "role": "user",
                "content": stickies
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={ "type": "json_object" }
    )

    persona = chat_completion.choices[0].message.content
    return json.loads(persona)
