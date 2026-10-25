const unitCards = document.querySelectorAll(".unit-card");

const homeView = document.querySelector("#homeview");
const unitView = document.querySelector("#unitview");

const unitTitle = document.querySelector("#unittitle");
const backButton = document.querySelector("#backbutton");

const notesList = document.querySelector("#noteslist");
const uploadButton = document.querySelector("#uploadbutton");

let currentunit = null;

unitCards.forEach(card => {
    card.addEventListener("click", async () => {
        currentunit = Number(card.dataset.unit);

        homeView.hidden = true;
        unitView.hidden = false;
        unitTitle.textContent = `Unit ${currentunit}`;

        await renderNotes();
    });

});

backButton.addEventListener("click", () => {
    unitView.hidden = true;
    homeView.hidden = false;
    notesList.innerHTML = "";
});

uploadButton.addEventListener("click", async () => {
    const newNote = {
        id: crypto.randomUUID(),
        unit: currentunit,
        title: "New Note",
        content: "",
        created: Date.now(),
        updated: Date.now()
    };
    await addnote(newNote);
    await renderNotes();
});

async function renderNotes() {
    notesList.innerHTML = "";

    const notes = await getnotesbyunit(currentunit);

    if (notes.length === 0) {
        notesList.innerHTML = `<p class="empty">No notes yet - click "+ Upload Notes" to create one.</p>`;
        return;
    }

    notes.sort((a, b) => b.updated - a.updated);

    notes.forEach(note => {
        const card = document.createElement("div");
        card.className = "note-card";
        card.dataset.id = note.id;

        card.innerHTML = `
            <input class="note-title" value="${escapeHtml(note.title)}" placeholder="Note title">
            <textarea class="note-content" rows="4" placeholder="Write your notes here...">${escapeHtml(note.content)}</textarea>
            <div class="note-actions">
                <button type="button" class="save-btn">Save</button>
                <button type="button" class="delete-btn">Delete</button>
            </div>
        `;

        card.querySelector(".save-btn").addEventListener("click", async () => {
            note.title = card.querySelector(".note-title").value;
            note.content = card.querySelector(".note-content").value;
            note.updated = Date.now();
            await updatenote(note);
        });

        card.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Delete this note?")) {
                await deletenote(note.id);
                await renderNotes();
            }
        });

        notesList.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}