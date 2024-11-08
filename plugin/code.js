"use strict";
// figma.showUI(__html__);
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Function to gather all sticky notes
function getAllStickyNotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedNodes = figma.currentPage.selection;
        const stickyNotes = selectedNodes.filter((node) => node.type === "STICKY");
        return stickyNotes;
    });
}
// Function to send POST request
function postStickyNoteText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:8000/sticky/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: text }),
            });
            if (response.ok) {
                console.log("Sticky note added successfully!");
            }
            else {
                console.error("Failed to add sticky note:", response.statusText);
            }
        }
        catch (e) {
            console.log("error: ");
        }
    });
}
// Get all sticky notes and post them to the server
function syncStickyNotesToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const stickyNotes = yield getAllStickyNotes();
        for (const sticky of stickyNotes) {
            yield postStickyNoteText(sticky.text.characters);
        }
    });
}
// Invoke the sync function
syncStickyNotesToDatabase().then(() => {
    figma.closePlugin();
});
