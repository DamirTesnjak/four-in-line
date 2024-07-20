/* eslint-disable no-throw-literal */
import { checkGridForWinner } from "./checkGridForWinner";

export function scanColumns(args) {
    const {
        scanOwnTokens,
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
        const arrTokens = Object.values(columnsGrid[column])
            .map((token) => Object.values(token)[0])
            .join("");

        if(arrTokens.includes(!scanOwnTokens ? 'PPPP' : 'AAAA')) {
            checkGridForWinner(args);
            break;
        }

        const substring = !scanOwnTokens ? "PPP#" : "AAA#";
        if (arrTokens.includes(substring)) {
            const lineIndex = arrTokens.indexOf(substring);
            const emptyIndex = substring.indexOf("#");
            columnsGridCopy[column][emptyIndex + lineIndex][`row${emptyIndex + lineIndex}column${column}`] = !scanOwnTokens ? 'P' : 'A';
            setColumnsGrid(columnsGridCopy);

            rowsGridCopy[emptyIndex + lineIndex][column][`row${emptyIndex + lineIndex}column${column}`] = !scanOwnTokens ? 'P' : 'A';
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