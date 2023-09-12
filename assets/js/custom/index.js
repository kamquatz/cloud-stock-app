async function main() {
    try {
        const db = await openDatabase('myDatabase', 1, 'items');
        
        const item1 = { name: 'Item 1' };
        const item2 = { name: 'Item 2' };

        const itemId1 = await addItem(db, 'items', item1);
        const itemId2 = await addItem(db, 'items', item2);

        console.log('Added items with IDs:', itemId1, itemId2);

        const allItems = await getAllItems(db, 'items');
        console.log('All items:', allItems);

        const updatedItem = { id: itemId1, name: 'Updated Item 1' };
        await updateItem(db, 'items', updatedItem);

        const updatedItems = await getAllItems(db, 'items');
        console.log('Updated items:', updatedItems);

        await deleteItem(db, 'items', itemId2);

        const remainingItems = await getAllItems(db, 'items');
        console.log('Remaining items:', remainingItems);

        // Assuming you've already opened the database and have a reference to it as 'db'

        // Define the ID of the item you want to update and the updated data
        const itemIdToUpdate = 1; // Change this to the ID you want to update
        const updatedData = { name: 'Updated Item Name' }; // Change this to your updated data

        // Update the item by ID
        updateItemById(db, 'items', itemIdToUpdate, updatedData)
            .then((updatedItemId) => {
                console.log(`Item with ID ${updatedItemId} updated successfully.`);
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });

            } catch (error) {
                console.error('Error:', error);
            }
}

main();
