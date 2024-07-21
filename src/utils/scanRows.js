/* eslint-disable no-throw-literal */
// scans rows for probable future solutions, e.g. player has in a row tokens:
// P#PP, while P is player's token and # is an empty slot,
// and tries to prevent player to win a game, by inserting AI's token
// or to for AI to win

import { createToken } from "./createToken.js";
export function scanRows(args) {
    const {
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        columnsGrid,
        rowsGrid,
        playerFourInLines,
        aIFourInLines,
        setRowsGrid,
        setColumnsGrid,
        setDiagonalsBLTR,
        setPlayer,
        updateDiagonalArr,
        setDiagonalsBRTL,
        player,
    } = args;

    const columnsGridCopy = [...columnsGrid];
    const rowsGridCopy = [...rowsGrid];
    const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
    const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

    let rowIndex = 0;
    for (rowIndex; rowIndex < rowsGrid.length; rowIndex++) {
        const rTokens = Object.values(rowsGrid[rowIndex])
            .map((token) => Object.values(token)[0])
            .join("");

        // eslint-disable-next-line no-loop-func
        // possible solution before last token for the player win
        const psltr = [...aIFourInLines, ...playerFourInLines];

        let psltrIndex = 0;
        for (psltrIndex; psltrIndex < psltr.length; psltrIndex++) {
            const psltrItem = psltr[psltrIndex];
            if (rTokens.includes(psltrItem)) {
                const rIndex = rTokens.indexOf(psltrItem);
                const solutionIndex = psltrItem.indexOf("#");
                const column = rIndex + solutionIndex;
                columnsGridCopy[column][solutionIndex][`row${psltrIndex}column${column}`] = "A";
                setColumnsGrid(columnsGridCopy);

                rowsGridCopy[rowIndex][column][`row${rowIndex}column${column}`] = "A";
                setRowsGrid(rowsGridCopy);

                updateDiagonalArr(diagonalsBLTRGridCopy, rowIndex, column, player);
                setDiagonalsBLTR(diagonalsBLTRGridCopy);
                updateDiagonalArr(diagonalsBRTLGridCopy, rowIndex, column, player);
                setDiagonalsBRTL(diagonalsBRTLGridCopy);
                createToken(rowIndex, column, player);
                setPlayer(true);
                throw "line found";
            }
        }
    };

}
