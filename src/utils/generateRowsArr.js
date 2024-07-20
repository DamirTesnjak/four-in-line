// generates "empty" rows array of game grid.
// # - empty slot/position

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