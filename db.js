const DB_NAME = 'apush-notes';
const DB_VERSION = 2;
const STORE_NAME = 'notes';

let dbPromise = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = idb.openDB(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion, newVersion, transaction) {
                let store;

                if(db.objectStoreNames.contains(STORE_NAME)) {
                    store = transaction.objectStore(STORE_NAME);
                } else {
                    store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id'
                    });
                }

                if (!store.indexNames.contains('by-unit')) {
                    store.createIndex('by-unit', 'unit');
                }
            }
        }).catch(error => {
            dbPromise = null;
            throw error;
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