import os
from dotenv import load_dotenv
from groq import Groq
import json

class LLM:
  previous_persona = ""
  client = None

  def __init__(self):
    load_dotenv()

    self.client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )
    self.history = []

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
    self.history.append({"role": "system", "content": refined_prompt})
    self.history.append({"role": "user", "content": stickies})

    persona = chat_completion.choices[0].message.content
    self.history.append({"role": "assistant", "content": persona})

    # Add the stickies used as the previous source
    self.previous_persona = persona
    return json.loads(persona)
  
  def update_persona_from_widget(self, persona):
    # chat_completion = self.client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "system",
    #             "content": """You are an expert in UX design. Given a user persona, update it
    #             so that each field is consistent with all other fields. You will be given a
    #             persona in JSON format as follows this example:
    #             bio_data: {
    #                 type: { value: one of "primary", "secondary", "served", or "anti", updated: "widget" or "source" },
    #                 name: { value: string, updated: "widget" or "source" },
    #                 age: { value: string, updated: "widget" or "source" },
    #                 location: { value: string, updated: "widget" or "source" }
    #                 occupation: { value: string, updated: "widget" or "source" }
    #                 status: { value: "married" or "single", updated: "widget" or "source" },
    #                 education: { value: string, updated: "widget" or "source" },
    #             },
    #             blocks: [
    #               {
    #                 title: 'Motivation',
    #                 detail: <detail>,
    #                 updated: "source" or "widget"
    #               },
    #               {
    #                 title: 'Goal',
    #                 detail: <detail>,
    #                 updated: "source" or "widget"
    #               },
    #               {
    #                 title: 'Frustration',
    #                 detail: <detail>,
    #                 updated: "source" or "widget"
    #               },
    #               {
    #                 title: 'Story',
    #                 detail: <detail>,
    #                 updated: "source" or "widget"
    #               },
    #             ]
    #             with each entry to a bio_data field in the format: {
    #               value: <content>
    #               updated: one of "source" or "widget"
    #             }
    #             and each entry in the blocks field in the format: {
    #               title: <title>,
    #               detail: detail,
    #               updated: "source" or "widget"
    #             }
    #             Only change type, name, age, location, occupation, education if their "updated" field is
    #             source. Only change the "detail" field of blocks if their "updated" field is "source"
    #             """
    #         },
    #         {
    #             "role": "user",
    #             "content": f'{persona["detail"]}'
    #         }
    #     ],
    #     model="llama-3.1-70b-versatile",
    #     response_format={ "type": "json_object" }
    # )
    current_msg = {
      "role": "user",
      "content": "what have we talked about in our conversation so far?"
    }
    self.history.append(current_msg)
    
    chat_completion = self.client.chat.completions.create(
      messages=self.history,
      model="llama-3.1-70b-versatile"
    )
    updated_persona = chat_completion.choices[0].message.content
    print(updated_persona)
    # self.previous_persona = updated_persona
    # return json.loads(updated_persona)

