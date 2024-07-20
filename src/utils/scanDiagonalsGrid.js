/* eslint-disable no-throw-literal */
// scans diagonals for probable future solutions, e.g. player has in diagonal tokens:
// P#PP, while P is player's token and # is an empty slot,
// and tries to prevent player to win a game, by inserting AI's token
// or to for AI to win

import { checkGridForWinner } from "./checkGridForWinner";

export function scanDiagonalsGrid(args) {
    const {
        direction,
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
        createToken,
        setPlayer,
        player,
    } = args

    const diagonals = direction === "BLTR" ? diagonalsBLTRGrid : diagonalsBRTLGrid;
    const diagonalsCopy = [...diagonals];
    const columnsGridCopy = [...columnsGrid];
    const rowsGridCopy = [...rowsGrid];
    let diagonalIndex = 0;

    loopDiagonals: // looping trouhgt diagonals
        for (
            diagonalIndex;
            diagonalIndex < diagonals.length;
            diagonalIndex++
        ) {
            const arrTokens = Object.values(diagonals[diagonalIndex])
                .map((token) => Object.values(token)[0])
                .join("");

            const lines = !scanOwnTokens ? playerFourInLines : aIFourInLines;

            let index = 0;

            for(index; index < lines.length; index++) {
                if(arrTokens.includes(!scanOwnTokens ? 'PPPP' : 'AAAA')) {
                    checkGridForWinner(args);
                    break loopDiagonals;
                }

                const fourInLine = lines[index];
                // if probable solution is detected, find the 
                // corespond "row" and "column" indexes in a grid
                if (arrTokens.includes(fourInLine)) {
                    const lineIndex = arrTokens.split('')
                        .reverse()
                        .indexOf("#");

                    const targetDiagonal = diagonalsCopy[diagonalIndex].reverse();
                    const diagonalItem = targetDiagonal[lineIndex];
                    const diagonalItemKey = Object.keys(diagonalItem)[0];

                    const diagonalItemCoordinates = diagonalItemKey.replace("row", "")
                        .replace("column", ",")
                        .split(",");
                    
                    const rowIndexFromDiagonal = Number(diagonalItemCoordinates[0]);
                    const columnIndexFromDiagonal = Number(diagonalItemCoordinates[1]);


                    let columnIndex = 0;
                    for (columnIndex; columnIndex < rowIndexFromDiagonal; columnIndex++) {

                        //checks if a column is filled up to targeted slot
                        if(columnsGridCopy[columnIndexFromDiagonal][columnIndex][`row${columnIndex}column${columnIndexFromDiagonal}`] === "#") {
                            rowsGridCopy[columnIndex][columnIndexFromDiagonal][`row${columnIndex}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                            setRowsGrid(rowsGridCopy);

                            columnsGridCopy[columnIndexFromDiagonal][columnIndex][`row${columnIndex}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                            setColumnsGrid(columnsGridCopy);
                            createToken(columnIndex, columnIndexFromDiagonal, player);
                            setPlayer(true);
                            throw "line found";
                        }
                    }

                    // inserting AI token in targeted slot, updating row, columns and diagonals arrays
                    diagonalsCopy[diagonalIndex][lineIndex][`row${rowIndexFromDiagonal}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                    setDiagonalsBLTR(diagonalsCopy);

                    rowsGridCopy[rowIndexFromDiagonal][columnIndexFromDiagonal][`row${rowIndexFromDiagonal}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                    setRowsGrid(rowsGridCopy);

                    columnsGridCopy[columnIndexFromDiagonal][rowIndexFromDiagonal][`row${rowIndexFromDiagonal}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                    setColumnsGrid(columnsGridCopy);

                    createToken(rowIndexFromDiagonal, columnIndexFromDiagonal, player);
                    setPlayer(true);
                    throw "line found";
                }
            }
        }
}