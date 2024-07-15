export function generateColumnsArr(rows, columns) {
    const columnsArr = [];
    let i = 0;
    for(i; i < columns; i++) {
        const columnItems = [];
        let k = 0;
        for(k; k < rows; k++) {
            columnItems.push({[`row${k}column${i}`]: '#'});
        }
        columnsArr.push(columnItems);
    }
    return columnsArr;
}