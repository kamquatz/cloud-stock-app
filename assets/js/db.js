// Open a database and create an object store if it doesn't exist
function openDatabase(databaseName, version, objectStoreName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, version);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(objectStoreName)) {
                const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            resolve(db);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Add an item to the object store
function addItem(db, objectStoreName, item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readwrite');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.add(item);

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Get all items from the object store
function getAllItems(db, objectStoreName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);
        const items = [];

        objectStore.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };

        transaction.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Update an item in the object store
function updateItem(db, objectStoreName, item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readwrite');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.put(item);

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Delete an item from the object store by its ID
function deleteItem(db, objectStoreName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readwrite');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.delete(id);

        request.onsuccess = function(event) {
            resolve();
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Update an item in the object store by its ID
function updateItemById(db, objectStoreName, id, updatedData) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(objectStoreName, 'readwrite');
        const objectStore = transaction.objectStore(objectStoreName);

        // Get the item with the specified ID
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = function(event) {
            const existingItem = event.target.result;

            if (existingItem) {
                // Merge the existing data with the updated data
                const updatedItem = { ...existingItem, ...updatedData };

                // Update the item in the object store
                const updateRequest = objectStore.put(updatedItem);

                updateRequest.onsuccess = function(event) {
                    resolve(event.target.result);
                };

                updateRequest.onerror = function(event) {
                    reject(event.target.error);
                };
            } else {
                // Item with the specified ID was not found
                reject(new Error(`Item with ID ${id} not found.`));
            }
        };

        getRequest.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// ...

