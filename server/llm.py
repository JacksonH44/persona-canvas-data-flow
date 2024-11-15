import os
from dotenv import load_dotenv
from groq import Groq
import json

class LLM:
  previous_source = ""
  client = None

  def __init__(self):
    load_dotenv()

    self.client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

  def create_persona(self, stickies):
    chat_completion = self.client.chat.completions.create(
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
                the sticky. Your response should be very specific in terms of name, age, location,
                occupation, and education.
                """,
            }
        ],
        model="llama-3.1-70b-versatile",
    )

    refined_prompt = chat_completion.choices[0].message.content

    chat_completion = self.client.chat.completions.create(
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

    # Add the stickies used as the previous source
    self.previous_source = stickies
    return json.loads(persona)
  
  def update_persona_from_source(self, new_sticky: str, persona):
    chat_completion = self.client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """You are an expert in UX design and prompt engineering.
                As input you will take in a user persona and two lists of sticky notes,
                specified as old and new. The user persona was based on the old sticky notes.
                Update the user persona based on the new sticky notes, preserving as much of
                the old user persona as you can. Sticky input is in the form: the input as a user message is a paragraph where each sentence starts 
                with NOTE: <message> where <message> is something that has been written on 
                the sticky. The user persona you will receive will be in the format:
                bio_data: {
                    type: one of "primary", "secondary", "served", or "anti",
                    name: string,
                    age: string,
                    location: string
                    occupation: string
                    status: "married" or "single",
                    education: string,
                },
                blocks: [
                  {
                    title: 'Motivation',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                  {
                    title: 'Goal',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                  {
                    title: 'Frustration',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                  {
                    title: 'Story',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                ]
                with each entry to a bio_data field in the format: {
                  value: <content>
                  updated: one of "source" or "widget"
                }
                and each entry in the blocks field in the format: {
                  title: <title>,
                  detail: detail,
                  updated: "source" or "widget"
                }
                Update only the fields and blocks that have "source" as their "updated". Change only
                "value" fields.
                """
            },
            {
                "role": "user",
                "content": f"""The old stickies are: {self.previous_source}. The new stickies
                are {new_sticky}. The user persona is {persona["detail"]}.""" + """Your response
                should be in the JSON format:
                bio_data: {
                    type: one of "primary", "secondary", "served", or "anti",
                    name: string,
                    age: string,
                    location: string
                    occupation: string
                    status: "married" or "single",
                    education: string,
                },
                blocks: [
                  {
                    title: 'Motivation',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                  {
                    title: 'Goal',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                  {
                    title: 'Frustration',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                  {
                    title: 'Story',
                    detail: <detail>,
                    updated: "source" or "widget"
                  },
                ]
                with each entry to a bio_data field in the format: {
                  value: <content>
                  updated: one of "source" or "widget"
                }
                and each entry in the blocks field in the format: {
                  title: <title>,
                  detail: detail,
                  updated: "source" or "widget"
                }
                Do not update any fields or blocks that have "widget" as the updated value.
                Output your response in JSON format."""
            }
        ],
        model="llama-3.1-8b-instant",
        response_format={ "type": "json_object" }
    )
    updated_persona = chat_completion.choices[0].message.content
    return json.loads(updated_persona)
