import { openDB } from "idb";

export async function initIndexedDB() {
    return openDB("tireTrackerProDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("warehouse")) {
                db.createObjectStore("warehouse", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("queue")) {
                db.createObjectStore("queue", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("history")) {
                db.createObjectStore("history", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("historyQueue")) {
                db.createObjectStore("historyQueue", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "id" });
            }
            if (!db.objectStoreNames.contains("userQueue")) {
                db.createObjectStore("userQueue", { keyPath: "id" });
            }
        },
    });
}