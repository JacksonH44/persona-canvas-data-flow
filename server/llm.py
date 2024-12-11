import os
from dotenv import load_dotenv
from groq import Groq
import json

class LLM:
  client = None
  history = []

  def __init__(self):
    load_dotenv()

    self.client = Groq(
        api_key=os.environ.get("GROQ_API_KEY")
    )

  def find_updated_fields(self, persona_detail):
    """Find all fields of a persona that were updated by the widget."""
    updated_bios = {key: value['value'] for key, value in persona_detail["bio_data"].items() if value.get('updated') == 'widget'}
    updated_blocks = [{'title': block['title'], 'detail': block['detail']} for block in persona_detail["blocks"] if block.get('updated') == 'widget']
    return updated_bios, updated_blocks

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
                # Instruction
                Improve the following prompt:
                You are an expert in UX design.
                You take as input a series of user notes in the form
                NOTE: <message> and output a specific user persona from those notes
                in JSON format. Your response should be in the JSON format
                # Output Format
                {
                    type: "Primary" | "Secondary" | "Served" | "Anti",
                    name: string,
                    age: number,
                    location: string
                    occupation: string
                    status: "Married" | "Single",
                    education: "High School", "Bachelors" | "Masters" | "PhD",
                    motivations: 2 or 3 sentence string,
                    goals: 2 or 3 sentence string,
                    frustrations: 2 or 3 sentence string,
                    story: 2 or 3 sentence string
                }
                # Input format
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

    return json.loads(persona)
  
  def update_persona_from_widget(self, persona):
    # Find which fields in the bios section and blocks section need to be updated
    updated_bios, _ = self.find_updated_fields(persona["detail"])

    # Update other bio fields
    bio_update_system_message = {
      "role": "system",
      "content": """
      # Instruction
      You are an expert in UX design. Given new bio fields, update name, age, location,
      occupation, status, education to be consistent with the new bio field. Keep the changes
      minimal.
      # Example
      Age changes from 17 to 30, update status to "Married", keep all other bio fields the same.
      # Output
      Output your answer in the following JSON format:
      {
        type: "Primary" | "Secondary" | "Served" | "Anti",
        name: string,
        age: number,
        location: string
        occupation: string
        status: "Married" | "Single",
        education: "High School" | "Bachelors" | "Masters" | "PhD"
      }
      """
    }
    self.history.append(bio_update_system_message)
    self.history.append({ "role": "user", "content": str(updated_bios) })
    bio_completion = self.client.chat.completions.create(
      messages=self.history,
      model="llama-3.1-70b-versatile",
      response_format={ "type": "json_object" }
    )
    completion = bio_completion.choices[0].message.content
    self.history.append({ "role": "assistant", "content": completion })

    # Update blocks
    block_update_system_message = {
      "role": "system",
      "content": """
      # Instruction
      You are an expert in UX design. Given updated fields in a user
      persona, update motivations, goals, frustrations, story fields to be consistent
      with new bio data. Keep the changes minimal and do not change the essence of the 
      persona.
      Output your response in the following JSON output format:
      # Example Output
      {
        motivations: 2 or 3 sentence string,
        goals: 2 or 3 sentence string,
        frustrations: 2 or 3 sentence string,
        story: 2 or 3 sentence string
      }
      """
    }
    self.history.append(block_update_system_message)
    self.history.append({ "role": "user", "content": str(updated_bios) })
    bio_completion = self.client.chat.completions.create(
      messages=self.history,
      model="llama-3.1-70b-versatile",
      response_format={ "type": "json_object" }
    )
    completion = bio_completion.choices[0].message.content
    self.history.append({ "role": "assistant", "content": completion })
    
    final_msg = {
      "role": "user",
      "content": """
      # Instruction
      Output the most updated version of the full persona
      # Output format
      Output your answer in JSON format:
      {
        type: "Primary" | "Secondary" | "Served" | "Anti",
        name: string,
        age: number,
        location: string
        occupation: string
        status: "Married" | "Single",
        education: "High School" | "Bachelors" | "Masters" | "PhD",
        motivations: 2 or 3 sentence string,
        goals: 2 or 3 sentence string,
        frustrations: 2 or 3 sentence string,
        story: 2 or 3 sentence string
      }
      """
    }
    self.history.append(final_msg)
    final_chat = self.client.chat.completions.create(
      messages=self.history,
      model="llama-3.1-8b-instant",
      response_format={ "type": "json_object" }
    )
    final_completion = final_chat.choices[0].message.content
    self.history.append({ "role": "assistant", "content": final_completion })
    return json.loads(final_completion)
  
  def generate_user_stories(self, persona, product_description):
    sys_msg = {
      "role": "system",
      "content": """
      # Overview
      You are an expert in UX design and user studies. As input you will
      receive a User Persona and a product description. Output a 3-5 specific
      user stories in first person point of view of the user persona and introduce
      who the persona is. Each user story should be orthogonal to each other. 
      Each user story should be 1 to 2 sentences.
      # Chain of Thought
      Who am I? (who)
      What do I want from this product? (what)
      Why do I want this from this product? (why)
      # User Persona Input Format
      {
        type: "Primary" | "Secondary" | "Served" | "Anti",
        name: string,
        age: number,
        location: string
        occupation: string
        status: "Married" | "Single",
        education: "High School" | "Bachelors" | "Masters" | "PhD",
        motivations: 2 or 3 sentence string,
        goals: 2 or 3 sentence string,
        frustrations: 2 or 3 sentence string,
        story: 2 or 3 sentence string
      }
      # Product description input format
      2 or 3 sentence string
      # Output Format
      You should generate a response in JSON format as follows:
      {
        user: string (persona name),
        stories: [
          3 to 5 strings
        ]    
      }
      """
    }
    user_content = "# User Persona:\n" + str(persona) + \
      "\n# Product Description\n" + product_description
    product_msg = {
      "role": "user",
      "content": user_content
    }
    self.history.append(sys_msg)
    self.history.append(product_msg)
    
    chat = self.client.chat.completions.create(
      messages=self.history,
      model="llama-3.1-70b-versatile",
      response_format={ "type": "json_object" }
    )
    completion = json.loads(chat.choices[0].message.content)
    self.history.append({ "role": "assistant", "content": str(completion) })
    
    return completion
