/**
 * Creates an array of diagonals, where each item is an individual diagonal as array of objects.
 * Each object holds a coordinate of token slots as key and its value.
 * Each diagonal has [diagonal.length] number of coordinates.
 * Value # means an empty slot for a token.
 * 
 * @param {number} rows - The number of rows in grid.
 * @param {number} columns - The number of columns in grid.
 * @param {string} direction - BLTR - bottom-left-top-right, BRTL - bottom-right-top-left.
 */

export function generateDiagonalsArr(rows, columns, direction) {
    const diagonals = [];
    const numOfDialogs = columns + (columns - 1);
    let i = 0;
    for (i; i < numOfDialogs; i++) {
        const diagonal = [];
        let x = direction === "BLTR" ? i : columns - 1;
        let y = direction === "BLTR" ? 0 : i;
        let countItem = 0;
        for (
            countItem;
            countItem < columns;
            countItem++
        ) {
            if (x < rows && y < columns && y > -1 && x > -1) {
                diagonal.push({ [`row${x}column${y}`]: '#' });
            }
            if (direction === "BLTR") {
                x -= 1;
                y += 1;
            } else { // BRTL
                x -= 1;
                y -= 1;
            }
        }
        diagonals.push(diagonal);
    };
    return diagonals;
}