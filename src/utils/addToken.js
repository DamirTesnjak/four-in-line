// adds players's token into choosen column
export function addToken(args) {
    const {
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        columnsGrid,
        rowsGrid,
        setRowsGrid,
        setColumnsGrid,
        setDiagonalsBLTR,
        createToken,
        setPlayer,
        player,
        updateDiagonalArr,
        setDiagonalsBRTL,
        column,
    } = args;

    const columnsGridCopy = [...columnsGrid];
    const rowsGridCopy = [...rowsGrid];
    const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
    const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

    let row = 0;
    for (row; row < columnsGrid.length; row++) {
        if (columnsGrid[column][row] && columnsGrid[column][row][`row${row}column${column}`] === '#') {
            break;
        }
    }

    if (columnsGridCopy.length - 1 >= row) {
        // P - player
        // A - "artificial inteligence"
        // updating columns array
        columnsGridCopy[column][row][`row${row}column${column}`] = player ? 'P' : 'A';
        setColumnsGrid(columnsGridCopy);

        // updating rows array
        rowsGridCopy[row][column][`row${row}column${column}`] = player ? 'P' : 'A';
        setRowsGrid(rowsGridCopy);

        // updating diagonals
        updateDiagonalArr(diagonalsBLTRGridCopy, row, column);
        setDiagonalsBLTR(diagonalsBLTRGridCopy);

        updateDiagonalArr(diagonalsBRTLGridCopy, row, column);
        setDiagonalsBRTL(diagonalsBRTLGridCopy);

        createToken(row, column, player);

        setPlayer(!player);
    }
};