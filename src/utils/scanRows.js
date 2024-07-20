/* eslint-disable no-throw-literal */
// scans rows for probable future solutions, e.g. player has in a row tokens:
// P#PP, while P is player's token and # is an empty slot,
// and tries to prevent player to win a game, by inserting AI's token
// or to for AI to win

import { checkGridForWinner } from "./checkGridForWinner";

export function scanRows(args) {
    const {
        scanOwnTokens,
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

    loopRows: // loop rows
        for(rowIndex; rowIndex < rowsGrid.length; rowIndex++) {
            const arrTokens = Object.values(rowsGrid[rowIndex])
                .map((token) => Object.values(token)[0])
                .join("");

            // eslint-disable-next-line no-loop-func
            const lines = !scanOwnTokens ? playerFourInLines : aIFourInLines;

            let index = 0;
            for (index; index < lines.length; index++) {
                if(arrTokens.includes(!scanOwnTokens ? 'PPPP' : 'AAAA')) {
                    console.log("test");
                    checkGridForWinner(args);
                    break loopRows;
                }

                const fourInLine = lines[index];
                if (arrTokens.includes(fourInLine)) {
                    const lineIndex = arrTokens.indexOf(fourInLine);
                    const emptyIndex = fourInLine.indexOf("#");
                    const column = lineIndex + emptyIndex;
                    columnsGridCopy[column][emptyIndex][`row${index}column${column}`] =
                        !scanOwnTokens ? "P" : "A";
                    setColumnsGrid(columnsGridCopy);

                    rowsGridCopy[rowIndex][column][`row${rowIndex}column${column}`] =
                        !scanOwnTokens ? "P" : "A";
                    setRowsGrid(rowsGridCopy);

                    updateDiagonalArr(diagonalsBLTRGridCopy, rowIndex, column, player);
                    setDiagonalsBLTR(diagonalsBLTRGridCopy);
                    updateDiagonalArr(diagonalsBRTLGridCopy, rowIndex, column, player);
                    setDiagonalsBRTL(diagonalsBRTLGridCopy);
                    setPlayer(true);
                    throw "line found";
                }
            }
        };
}
