// adds players's token into choosen column
export function addToken(args) {
    const {
        createToken,
        column,
        appState,
        setAppState,
        updateDiagonalArr
    } = args;

    const {
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        columnsGrid,
        rowsGrid,
        player,
    } = appState;

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

        // updating rows array
        rowsGridCopy[row][column][`row${row}column${column}`] = player ? 'P' : 'A';

        // updating diagonals
        const updateddDiagonalsBLTRGrid = updateDiagonalArr(diagonalsBLTRGridCopy, row, column, player);
        const updatedDiagonalsBRTLGrid = updateDiagonalArr(diagonalsBRTLGridCopy, row, column, player);
        createToken(row, column, player);

        setAppState({
            ...appState,
            rowsGrid: rowsGridCopy,
            columnsGrid: columnsGridCopy,
            diagonalsBLTRGrid: updateddDiagonalsBLTRGrid,
            diagonalsBRTLGrid: updatedDiagonalsBRTLGrid,
            player: !player,
            checkForWinner: true,
        });
    }
};