const { widget } = figma;
const { AutoLayout, useSyncedState, Text, Input } = widget;

import { Face } from "./face";

interface Sticky {
  content: string;
}

interface Persona {
  id: string;
  content: string;
}

function Persona() {
  const [personaData, setPersonaData] = useSyncedState<Persona[]>("data", []);
  const [widgetSize, setWidgetSize] = useSyncedState<string>("size", "L");

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

  async function pushPersonaData() {
    for (const data of personaData) {
      await pushOnePersona(data)
    }
    console.log('Personas: ', personaData)
  }

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

  async function updatePersonaData() {
    try {
      for (let i = 0; i < personaData.length; i++) {
        const response = await fetch(`http://localhost:8000/persona/${i}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: personaData[i] }),
        });
    
        if (response.ok) {
          console.log("Persona data updated successfully!");
        } else {
          console.error("Failed to update persona data:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error updating persona data:", error);
    }
  }

  // Determine how many items to show
  const itemsToShow = widgetSize == "S" ? personaData.slice(0, 3) : personaData;

  return (
    <AutoLayout
      direction={widgetSize == "S" ? "vertical" : "horizontal"}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      padding={8}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
    >
      {/* Left side */}
      <AutoLayout
        direction="vertical" 
        horizontalAlignItems="center" 
        verticalAlignItems="center" 
        spacing={8} 
      >
        <Face />
        <AutoLayout
          width={200}
          height={50}
          fill="#007AFF"
          cornerRadius={8}
          onClick={fetchPersonaData}  // Fetch data when rectangle is clicked
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text fill="#FFFFFF" fontSize={16}>Fetch Data</Text>
        </AutoLayout>
        <AutoLayout
          width={200}
          height={50}
          fill="#007AFF"
          cornerRadius={8}
          onClick={pushPersonaData}  // Fetch data when rectangle is clicked
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text fill="#FFFFFF" fontSize={16}>Push Data</Text>
        </AutoLayout>
        <AutoLayout
          width={200}
          height={50}
          fill="#007AFF"
          cornerRadius={8}
          onClick={updatePersonaData}  // Fetch data when rectangle is clicked
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text fill="#FFFFFF" fontSize={16}>Update Data</Text>
        </AutoLayout>

        <AutoLayout direction="horizontal" spacing={4}>
          <AutoLayout
            width={50}
            height={30}
            fill={widgetSize === "L" ? "#007AFF" : "#CCCCCC"}
            cornerRadius={4}
            onClick={() => setWidgetSize("L")}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Text fill="#FFFFFF" fontSize={12}>L</Text>
          </AutoLayout>
          <AutoLayout
            width={50}
            height={30}
            fill={widgetSize === "S" ? "#007AFF" : "#CCCCCC"}
            cornerRadius={4}
            onClick={() => setWidgetSize("S")}
            horizontalAlignItems="center"
            verticalAlignItems="center"
          >
            <Text fill="#FFFFFF" fontSize={12}>S</Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      {/* Right side */}
      <AutoLayout
        direction="vertical" 
        horizontalAlignItems="start" 
        verticalAlignItems="start" 
        spacing={4} 
      >
        {itemsToShow.map((persona: Persona, index) => {
          return (
            <Input 
              key={index}
              value={persona.content}
              fill="#000000"
              fontSize={16}
              width={300}
              onTextEditEnd={(text) => {
                const updatedData = [...personaData];
                updatedData[index].content = text.characters;
                setPersonaData(updatedData);
              }}
            />
          )
        })}
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Persona);
