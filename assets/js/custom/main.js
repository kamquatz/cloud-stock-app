async function main() {
    try {
        const db = await openDatabase('matrixStockApp', 1, 'config');

        const config = await getAllItems(db, 'config');

        console.log('Config:', config);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();