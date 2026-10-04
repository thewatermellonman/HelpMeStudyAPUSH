const DB_NAME = 'apush-notes';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

let dbPromise = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = idb.openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id'
                    });

                    store.createIndex('by-unit', 'unit');
                }
            }
        });
    }
    return dbPromise;
}

async function addnote(note) {
    const db = await getDB();
    return db.add(STORE_NAME, note);
}

async function getnotesbyunit(unitnumber) {
    const db = await getDB();
    return db.getAllFromIndex(STORE_NAME, 'by-unit', Number(unitnumber));
}

async function updatenote(note) {
    const db = await getDB();
    return db.put(STORE_NAME, note);
}

async function deletenote(id) {
    const db = await getDB();
    return db.delete(STORE_NAME, id);
}

async function getallnotes() {
    const db = await getDB();
    return db.getAll(STORE_NAME);
}