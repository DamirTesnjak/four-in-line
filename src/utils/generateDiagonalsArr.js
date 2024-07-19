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