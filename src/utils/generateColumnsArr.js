/**
 * Creates an array of columns, where each item is an individual column as array of objects.
 * Each object holds a coordinate of token slot as key and its value.
 * Each column has [column.length] number of coordinates.
 * Value # means an empty slot for a token.
 * 
 * @param {number} rows - The number of rows in grid.
 * @param {number} columns - The number of columns in grid.
 */

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