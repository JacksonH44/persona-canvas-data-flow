const { widget } = figma;
const { AutoLayout, useSyncedState, Text, Input, Rectangle } = widget;

import { Face } from "./face";

interface Sticky {
  content: string;
}

interface Persona {
  id: string;
  content: string;
}

interface PersonaData {
  type: string;
  name: string;
  age: string;
  location: string;
  occupation: string;
  status: string;
  education: string;
  motivations: string;
  goals: string;
  frustrations: string;
  story: string;
}

function Persona() {
  // const [personaData, setPersonaData] = useSyncedState<Persona[]>("data", []);
  const [widgetSize, setWidgetSize] = useSyncedState<string>("size", "L");

  const [personaData, setPersonaData] = useSyncedState<PersonaData>("personaData", {
    type: "secondary",
    name: "Alex",
    age: "20-25",
    location: "Europe or Americas with high French proficiency",
    occupation: "Student or professional athlete",
    status: "single",
    education: "High school or college",
    motivations: "I want to communicate effectively with French-speaking teammates...",
    goals: "I aim to reach an A2 level in French within the next 6 months...",
    frustrations: "I feel frustrated when I have to rely on memorization of phrases...",
    story: "As a sports enthusiast, I have the opportunity to travel and compete internationally..."
  });

  async function fetchPersonaData() {
    try {
      const response = await fetch("http://localhost:8000/stickies/")
      const data = await response.json();
      const contents = data.items.map((s: Sticky) => {
        return { id: "", content: s.content }
      })
      setPersonaData(contents)
    } catch (error) {
      console.error("Error fetching personas:", error)
    }
  }

  // async function pushPersonaData() {
  //   for (const data of personaData) {
  //     await pushOnePersona(data)
  //   }
  //   setPersonaData(personaData)
  // }

  async function pushOnePersona(persona: Persona) {
    try {
      const response = await fetch("http://localhost:8000/persona/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: persona.content }),
      });

  
      if (response.ok) {
        const responseData = await response.json()
        persona.id = responseData.data.id
        console.log("Persona data added successfully!");
      } else {
        console.error("Failed to add persona data:", response.statusText);
      }
    } catch (e) {
      console.log("error: ", e)
    }
  }

  // async function updatePersonaData() {
  //   try {
  //     for (const persona of personaData) {
  //       const response = await fetch(`http://localhost:8000/persona/${persona.id}`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ content: `CHANGED: ${persona.content}` }),
  //       });
    
  //       if (response.ok) {
  //         console.log("Persona data updated successfully!");
  //       } else {
  //         console.error("Failed to update persona data:", response.statusText);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating persona data:", error);
  //   }
  // }

  // Determine how many items to show
  // const itemsToShow = widgetSize == "S" ? personaData.slice(0, 3) : personaData;

  return (
    <AutoLayout
      direction="horizontal"
      padding={16}
      spacing={16}
      fill="#F8F9FA"
      cornerRadius={16}
      stroke="#AB47BC"
      strokeWidth={2}
      width={600}
    >
      {/* Left Section: Avatar and Basic Details */}
      <AutoLayout direction="vertical" spacing={12} width={200}>
        {/* Header with Avatar */}
        <AutoLayout direction="horizontal" spacing={16} verticalAlignItems="center">
          <Face></Face>
          <Text fontSize={20} fontWeight="bold">Persona</Text>
        </AutoLayout>

        {/* Basic Details */}
        <AutoLayout direction="vertical" spacing={4} padding={{ top: 12, bottom: 12 }}>
          <Text fontWeight="bold">Type</Text>
          <Text>{personaData.type}</Text>
          <Text fontWeight="bold">Name</Text>
          <Text>{personaData.name}</Text>
          <Text fontWeight="bold">Age</Text>
          <Text>{personaData.age}</Text>
          <Text fontWeight="bold">Location</Text>
          <Text>{personaData.location}</Text>
          <Text fontWeight="bold">Occupation</Text>
          <Text>{personaData.occupation}</Text>
          <Text fontWeight="bold">Status (Married or Single)</Text>
          <Text>{personaData.status}</Text>
          <Text fontWeight="bold">Education</Text>
          <Text>{personaData.education}</Text>
        </AutoLayout>
      </AutoLayout>

      {/* Right Section: Motivations, Goals, Frustrations, and Story */}
      <AutoLayout direction="vertical" spacing={12} width="fill-parent">
        <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
          <Text fontWeight="bold">Motivations</Text>
          <Text width="fill-parent">{personaData.motivations}</Text>
        </AutoLayout>

        <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
          <Text fontWeight="bold">Goals</Text>
          <Text width="fill-parent">{personaData.goals}</Text>
        </AutoLayout>

        <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
          <Text fontWeight="bold">Frustrations</Text>
          <Text width="fill-parent">{personaData.frustrations}</Text>
        </AutoLayout>

        <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
          <Text fontWeight="bold">Story</Text>
          <Text width="fill-parent">{personaData.story}</Text>
        </AutoLayout>

        {/* "Button" to Update Data */}
        <AutoLayout
          onClick={() => console.log("clicked")}
          padding={{ vertical: 10, horizontal: 20 }}
          fill="#42A5F5"
          cornerRadius={8}
          width="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text fontSize={16} fill="#FFFFFF" fontWeight="bold">Update Data</Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Persona);
