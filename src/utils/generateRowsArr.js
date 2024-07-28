/**
 * Creates an array of rows, where each item is an individual row as array of objects.
 * Each object holds a coordinate of token slots as key and its value.
 * Each row has [row.length] number of coordinates.
 * Value # means an empty slot for a token.
 * 
 * @param {number} rows - The number of rows in grid.
 * @param {number} columns - The number of columns in grid.
 */

export function generateRowsArr(rows, columns) {
    const rowsArr = [];
    let i = 0;
    for(i; i < rows; i++) {
        const row = [];
        let k = 0;
        for(k; k < columns; k++) {
            row.push({[`row${i}column${k}`]: '#'});
        }
        rowsArr.push(row);
    };
    return rowsArr;
}