const { widget } = figma;
const { AutoLayout, useSyncedState, Text } = widget;

import { Face } from "./face";

interface Sticky {
  content: string;
}

function Persona() {
  const [personaData, setPersonaData] = useSyncedState<string[]>("data", []);

  async function fetchPersonaData() {
    try {
      const response = await fetch("http://localhost:8000/stickies/")
      const data = await response.json();
      const contents = data.items.map((i: Sticky) => {
        return i.content
      })
      setPersonaData(contents)
      console.log(personaData)
    } catch (error) {
      console.error("Error fetching personas:", error)
    }
  }

  async function pushPersonaData() {
    for (const data in personaData) {
      await pushOnePersona(data)
    }
  }

  async function pushOnePersona(text: string) {
    try {
      const response = await fetch("http://localhost:8000/persona/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });
  
      if (response.ok) {
        console.log("Persona data added successfully!");
      } else {
        console.error("Failed to add persona data:", response.statusText);
      }
    } catch (e) {
      console.log("error: ", )
    }
  }

  return (
    <AutoLayout
      direction="horizontal"
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
      </AutoLayout>

      {/* Right side */}
      <AutoLayout
        direction="vertical" 
        horizontalAlignItems="start" 
        verticalAlignItems="start" 
        spacing={4} 
      >
        {personaData.map((content: string, index) => {
          return (
            <Text fontSize={16} key={index} fill="#000000">
              {content}
            </Text>
          )
        })}
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Persona);
