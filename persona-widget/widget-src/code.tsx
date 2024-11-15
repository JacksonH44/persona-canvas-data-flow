const { widget } = figma;
const { AutoLayout, useSyncedState, Text, useEffect, Input } = widget;

import { Face } from "./face";

interface Sticky {
  collectionId: string;
  collectionName: string;
  content: string;
}

import {
  Block, 
  BioData,
  PersonaData,
  PersonaDetail
} from "../../Persona";

import {
  NoteData,
} from "../../DataSource";

const Orange = "#FFA500"
const Blue = "#0000FF"

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
  const [bioData, setBioData] = useSyncedState<BioData | null>("bioData", null);
  const [blockData, setBlockData] = useSyncedState<Block[]>("blockData", []);
  const [persona, setPersona] = useSyncedState<PersonaData | null>("persona", null);

  async function updateFromSource() {
    const stickies = await fetchStickies();
    const stickyArray = stickies.map((s) => {
      return { content: s.detail.content }
    });
    if (persona) {
      console.log("updating from source...");
    } else {
      const response = await fetch("http://localhost:8000/create_persona/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(stickyArray)
      })
      const data = await response.json();
      const persona = data.persona;

      const bio: BioData = {
        type: { value: persona.type, updated: "source" },
        name: { value: persona.name, updated: "source" },
        age: { value: persona.age, updated: "source" },
        location: { value: persona.location, updated: "source" },
        occupation: { value: persona.occupation, updated: "source" },
        status: { value: persona.status, updated: "source" },
        education: { value: persona.education, updated: "source" }
      };

      const blocks: Block[] = [
        { title: "Motivation", detail: persona.motivations, updated: "source" },
        { title: "Goal", detail: persona.goals, updated: "source" },
        { title: "Frustration", detail: persona.frustrations, updated: "source" },
        { title: "Story", detail: persona.story, updated: "source" },
      ];
    
      setBioData(bio);
      setBlockData(blocks);
      const detail = new PersonaDetail(bio, blocks);
      setPersona(new PersonaData(data.id, detail));
    }
  }

  async function updateFromWidget() {
    if (persona && bioData) {
      const response = await fetch(`http://localhost:8000/persona/${persona.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: bioData.type.value,
          name: bioData.name.value,
          age: bioData.age.value,
          location: bioData.location.value,
          occupation: bioData.occupation.value,
          status: bioData.status.value,
          education: bioData.education.value,
          motivations: blockData[0].detail,
          goals: blockData[1].detail,
          frustrations: blockData[2].detail,
          story: blockData[3].detail
        })
      })
    }
  }

  function updateBlockDetail(index: number, newDetail: string) {
    const updatedBlocks = [...blockData];
    updatedBlocks[index] = { ...updatedBlocks[index], detail: newDetail, updated: "widget" };
    setBlockData(updatedBlocks);
  }

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
              <Input 
                value={bioData.type.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, type: { value: e.characters, updated: "widget" } })}
                fill={bioData.type.updated === "source" ? Orange : Blue}
              ></Input>
              <Text fontWeight="bold">Name</Text>
              <Input 
                value={bioData.name.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, name: { value: e.characters, updated: "widget" } })}
                fill={bioData.name.updated === "source" ? Orange : Blue}
              ></Input>
              <Text fontWeight="bold">Age</Text>
              <Input 
                value={bioData.age.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, age: { value: e.characters, updated: "widget" } })}
                fill={bioData.age.updated === "source" ? Orange : Blue}
              ></Input>
              <Text fontWeight="bold">Location</Text>
              <Input 
                value={bioData.location.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, location: { value: e.characters, updated: "widget" } })}
                fill={bioData.location.updated === "source" ? Orange : Blue}
              ></Input>
              <Text fontWeight="bold">Occupation</Text>
              <Input 
                value={bioData.occupation.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, occupation: { value: e.characters, updated: "widget" } })}
                fill={bioData.occupation.updated === "source" ? Orange : Blue}
              ></Input>
              <Text fontWeight="bold">Status (Married or Single)</Text>
              <Input 
                value={bioData.status.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, status: { value: e.characters, updated: "widget" } })}
                fill={bioData.status.updated === "source" ? Orange : Blue}
              ></Input>
              <Text fontWeight="bold">Education</Text>
              <Input 
                value={bioData.education.value} 
                onTextEditEnd={(e) => setBioData({ ...bioData, education: { value: e.characters, updated: "widget" } })}
                fill={bioData.education.updated === "source" ? Orange : Blue}
              ></Input>
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
            <Input 
              value={blockData[0].detail} 
              onTextEditEnd={(e) => updateBlockDetail(0, e.characters)} 
              width="fill-parent" 
              fill={blockData[0].updated === "source" ? Orange : Blue}
            />
          </AutoLayout>

          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Goals</Text>
            <Input 
              value={blockData[1].detail} 
              onTextEditEnd={(e) => updateBlockDetail(1, e.characters)} 
              width="fill-parent"
              fill={blockData[1].updated === "source" ? Orange : Blue}
            />
          </AutoLayout>

          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Frustrations</Text>
            <Input 
              value={blockData[2].detail} 
              onTextEditEnd={(e) => updateBlockDetail(2, e.characters)} 
              width="fill-parent"
              fill={blockData[2].updated === "source" ? Orange : Blue}
            />
          </AutoLayout>

          <AutoLayout direction="vertical" padding={12} spacing={8} fill="#FFFFFF" cornerRadius={8} width="fill-parent">
            <Text fontWeight="bold">Story</Text>
            <Input 
              value={blockData[3].detail} 
              onTextEditEnd={(e) => updateBlockDetail(3, e.characters)} 
              width="fill-parent"
              fill={blockData[3].updated === "source" ? Orange : Blue} 
            />
          </AutoLayout>
        </>
      )}

        {/* "Button" to Update Data */}
        <AutoLayout
          onClick={updateFromSource}
          padding={{ vertical: 10, horizontal: 20 }}
          fill="#42A5F5"
          cornerRadius={8}
          width="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text fontSize={16} fill="#FFFFFF" fontWeight="bold">Update From Source</Text>
        </AutoLayout>
        {blockData.length == 4 && (
          <>
            <AutoLayout
              onClick={updateFromWidget}
              padding={{ vertical: 10, horizontal: 20 }}
              fill="#42A5F5"
              cornerRadius={8}
              width="fill-parent"
              horizontalAlignItems="center"
              verticalAlignItems="center"
            >
              <Text fontSize={16} fill="#FFFFFF" fontWeight="bold">Update From Widget</Text>
            </AutoLayout>
          </>
        )}
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Persona);
