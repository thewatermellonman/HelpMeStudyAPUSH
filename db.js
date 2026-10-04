const DB_NAME = 'apush-notes';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

let dbPromise = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = IDBCursor.openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectstorenames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keypath: 'id'
                    });
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
    return db.getallfromindex(STORE_NAME, 'by-unit', Number(unitnumber));
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
    return db.getall(STORE_NAME);
}