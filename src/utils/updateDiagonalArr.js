export function updateDiagonalArr(diagonals, row, column, player) {
    const diagonalsCopy = [...diagonals];
    let diagonal = 0;

    diagonalsLoop:
    for (diagonal; diagonal < diagonalsCopy.length; diagonal++) {
        let diagonalItemIndex = 0;
        for (diagonalItemIndex; diagonalItemIndex < diagonalsCopy[diagonal].length; diagonalItemIndex++) {
            const diagonalKeys = Object.keys(diagonalsCopy[diagonal][diagonalItemIndex]);
            const index = diagonalKeys.indexOf(`row${row}column${column}`);
            if (index > -1) {
                diagonalsCopy[diagonal][diagonalItemIndex][`row${row}column${column}`] = player ? 'P' : 'A';
                break diagonalsLoop;
            }
        }
    }
    return diagonalsCopy;
};