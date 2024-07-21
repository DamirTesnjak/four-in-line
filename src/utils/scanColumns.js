/* eslint-disable no-throw-literal */
export function scanColumns(args) {
    const {
        columnsGrid,
        rowsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        setColumnsGrid,
        setRowsGrid,
        updateDiagonalArr,
        setDiagonalsBLTR,
        setDiagonalsBRTL,
        createToken,
        player,
    } = args;

    const columnsGridCopy = [...columnsGrid];
    const rowsGridCopy = [...rowsGrid];
    const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
    const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

    let column = 0;
    for (column; column < columnsGrid.length; column++) {
        const cTokens = Object.values(columnsGrid[column])
            .map((token) => Object.values(token)[0])
            .join("");

        const psltr = ["AAA#", "PPP#"];

        let psltrIndex = 0;
        for (psltrIndex; psltrIndex < psltr.length; psltrIndex++) {
            const psltrItem = psltr[psltrIndex];
            if (cTokens.includes(psltrItem)) {
                const lineIndex = cTokens.indexOf(psltrItem);
                const emptyIndex = psltrItem.indexOf("#");
                columnsGridCopy[column][emptyIndex + lineIndex][`row${emptyIndex + lineIndex}column${column}`] = 'A';
                setColumnsGrid(columnsGridCopy);

                rowsGridCopy[emptyIndex + lineIndex][column][`row${emptyIndex + lineIndex}column${column}`] = 'A';
                setRowsGrid(rowsGridCopy);

                updateDiagonalArr(diagonalsBLTRGridCopy, emptyIndex, column, player);
                setDiagonalsBLTR(diagonalsBLTRGridCopy);
                updateDiagonalArr(diagonalsBRTLGridCopy, emptyIndex, column, player);
                setDiagonalsBRTL(diagonalsBRTLGridCopy);
                createToken(emptyIndex + lineIndex, column, player);
                throw "line found";
            }
        }
    }
}