figma.showUI(__html__);

// Function to gather all sticky notes
async function getAllStickyNotes() {
  await figma.loadAllPagesAsync();
  const stickyNotes = figma.root.findAll((node) => node.type === "STICKY");
  return stickyNotes as StickyNode[];
}

// Function to send POST request
async function postStickyNoteText(text: string) {
  try {  
    const response = await fetch("http://localhost:8000/sticky/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text }),
    });

    if (response.ok) {
      console.log("Sticky note added successfully!");
    } else {
      console.error("Failed to add sticky note:", response.statusText);
    }
  } catch (e) {
    console.log("error: ", e)
  }
}

// Get all sticky notes and post them to the server
async function syncStickyNotesToDatabase() {
  const stickyNotes = await getAllStickyNotes();
  for (const sticky of stickyNotes) {
    await postStickyNoteText(sticky.text.characters)
  }
}

// Invoke the sync function
syncStickyNotesToDatabase().then(() => {
  figma.closePlugin();
});
