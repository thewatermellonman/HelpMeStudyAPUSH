const unitcards = document.querySelectorAll(".unit-card");

const homeview = document.querySelector("#homeview");
const unitview = document.querySelector("#unitview")

const unittitle = document.querySelector("#unittitle");
const backbutton = document.querySelector("#backbutton")

const noteslist = document.querySelector("#noteslist");
const uploadbutton = document.querySelector("#uploadbutton");

unitcards.forEach(card => {
    card.addEventListener("click", async () => {
        currentunit = number(card.dataset.unit);

        homeview.hidden = true;
        unitview.hidden = false;
        unittitle.textContent = `Unit ${unitnumber}`;

        await rendernotes();
    });

});

backbutton.addEventListener("click", () => {
    unitview.hidden = true;
    homeview.hidden = false;
    noteslist.innerHTML = "";
});

uploadbutton.addEventListener("click", async () => {
    const newnote = {
        id: crypto.randomUUID(),
        unit: currentunit,
        title: "New Note",
        content: "",
        created: Date.now(),
        updated: Date.now()
    };
    await addnote(newnote);
    await rendernotes();
});

async function rendernotes() {
    noteslist.innerHTML = "";

    const notes = await getnotesbyunit(currentunit);

    if (notes.length === 0) {
        noteslist.innerHTML = `<p class="empty">No notes yet - click "+ Upload Notes" to create one.</p>`;
        return;
    }

    notes.sort((a, b) => b.updated - a.updated);

    notes.forEach(note => {
        const card = document.createElement("div");
        card.classname = "note-card";
        card.dataset.id = note.id;

        card.innerHTML = `
            <input class"note-title" value="${escapeHtml(note.title)}" />
            <textarea class="note-conent" rows="6">${escapeHtml(note.content)}</textarea>
            <div class="note-actions">
                <button class="save-btn">Save</button>
                <button cass="delete-btn">Delete</button>
            </div>
        `;

        card.querySelector(".save-btn").addEventListener("click", async () => {
            note.title = card.querySelector(".note-title").ariaValueMax;
            note.content = card.querySelector(".note-content").ariaValueMax;
            note.updated = Date.now();
            await updatenote(note);
        });

        card.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Delete this note?")) {
                await deletenote(note.id);
                await rendernotes();
            }
        });

        noteslist.appendChild(card);
    });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}