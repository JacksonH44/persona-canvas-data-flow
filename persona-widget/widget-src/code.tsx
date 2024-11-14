const { widget } = figma;
const { AutoLayout, useSyncedState, Text, useEffect, Input } = widget;

import { Face } from "./face";

interface Sticky {
  collectionId: string;
  collectionName: string;
  content: string;
}

interface Persona {
  id: string;
  content: string;
}

interface PersonaDataType {
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

import {
  Block, 
  PersonaManager,
  PersonaData,
  PersonaDetail,
  BioData
} from "../../Persona";

import {
  NoteData,
  NoteDetail
} from "../../DataSource";

const personaManager = new PersonaManager();

async function fetchStickies(): Promise<NoteData[]> {
  try {
    const response = await fetch("http://localhost:8000/stickies/");
    const data = await response.json();
    const details: NoteData[] = data.items.map((i: Sticky) => {
      return {
        id: i.collectionId,
        detail: {
          name: i.collectionName,
          content: i.content
        }
      }
    })
    return details
  } catch (error) {
    console.log("error fetching stickies.")
    return [];
  }
}

function Persona() {  
  const [bioData, setBioData] = useSyncedState<BioData | null>("bioData", null)
  const [blockData, setBlockData] = useSyncedState<Block[]>("blockData", [])

  async function fetchPersonaData() {
    try {
      const response = await fetch("http://localhost:8000/personas/")
      const data = await response.json();

      const bio = {
        type: data.type,
        name: data.name,
        age: data.age,
        location: data.location,
        occupation: data.occupation,
        status: data.status,
        education: data.education
      };
      const blocks: Block[] = [
        { title: "Motivation", detail: data.motivations },
        { title: "Goal", detail: data.goals },
        { title: "Frustration", detail: data.frustrations },
        { title: "Story", detail: data.story },
      ];

      setBioData(bio)
      setBlockData(blocks)
    } catch (error) {
      console.error("Error fetching personas:", error)
    }
  }

  function updateBlockDetail(index: number, newDetail: string) {
    const updatedBlocks = [...blockData];
    updatedBlocks[index] = { ...updatedBlocks[index], detail: newDetail };
    setBlockData(updatedBlocks);
  }  

  // useEffect(() => {
  //   console.log(blockData)
  // })

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
        {bioData && (
          <>
            <AutoLayout direction="vertical" spacing={4} padding={{ top: 12, bottom: 12 }}>
              <Text fontWeight="bold">Type</Text>
              <Input value={bioData.type} onTextEditEnd={(e) => setBioData({ ...bioData, type: e.characters })}></Input>
              <Text fontWeight="bold">Name</Text>
              <Input value={bioData.name} onTextEditEnd={(e) => setBioData({ ...bioData, name: e.characters })}></Input>
              <Text fontWeight="bold">Age</Text>
              <Input value={String(bioData.age)} onTextEditEnd={(e) => setBioData({ ...bioData, age: Number(e.characters) })}></Input>
              <Text fontWeight="bold">Location</Text>
              <Input value={bioData.location} onTextEditEnd={(e) => setBioData({ ...bioData, location: e.characters })}></Input>
              <Text fontWeight="bold">Occupation</Text>
              <Input value={bioData.occupation} onTextEditEnd={(e) => setBioData({ ...bioData, occupation: e.characters })}></Input>
              <Text fontWeight="bold">Status (Married or Single)</Text>
              <Input value={bioData.status} onTextEditEnd={(e) => setBioData({ ...bioData, status: e.characters })}></Input>
              <Text fontWeight="bold">Education</Text>
              <Input value={bioData.education} onTextEditEnd={(e) => setBioData({ ...bioData, education: e.characters })}></Input>
            </AutoLayout>
          </>
        )}
        
      </AutoLayout>

      {/* Right Section: Motivations, Goals, Frustrations, and Story */}
      <AutoLayout direction="vertical" spacing={12} width="fill-parent">
      {blockData.length === 4 && (
        <>
          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Motivations</Text>
            <Input value={blockData[0].detail} onTextEditEnd={(e) => updateBlockDetail(0, e.characters)} width="fill-parent" />
          </AutoLayout>

          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Goals</Text>
            <Input value={blockData[1].detail} onTextEditEnd={(e) => updateBlockDetail(1, e.characters)} width="fill-parent" />
          </AutoLayout>

          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Frustrations</Text>
            <Input value={blockData[2].detail} onTextEditEnd={(e) => updateBlockDetail(2, e.characters)} width="fill-parent" />
          </AutoLayout>

          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Story</Text>
            <Input value={blockData[3].detail} onTextEditEnd={(e) => updateBlockDetail(3, e.characters)} width="fill-parent" />
          </AutoLayout>
        </>
      )}

        {/* "Button" to Update Data */}
        <AutoLayout
          onClick={fetchPersonaData}
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
fetchStickies()
