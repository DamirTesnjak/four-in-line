import { useCallback, useEffect, useState } from 'react';

import { Circle } from './Circle';
import { generateRowsArr } from "../utils/generateRowsArr";
import { generateColumnsArr } from "../utils/generateColumnsArr";
import { generateDiagonalsArr } from "../utils/generateDiagonalsArr";
import { createToken } from '../utils/createToken';

import "./Row.css";

function generateDisplayGrid(rows, columns) {
    const rowArr = generateRowsArr(rows, columns);
    return (
        <div className="game-grid">
            {
                rowArr.map((row, index) => {
                    return (
                        <div
                            id={`row${index}`}
                            key={index}
                            className="row"
                        >
                            {
                                row.map((_circle, indexCircle) => {
                                    return (
                                        <Circle
                                            id={`row${index}column${indexCircle}`}
                                            key={`row${index}column${indexCircle}`}
                                        />
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export function FourInLineGrid() {
    const [numRows, setNumRow] = useState(6);
    const [numColumns, setNumColumns] = useState(7);
    const [player, setPlayer] = useState(false);

    const rowArr = generateRowsArr(numRows, numColumns);
    const columnsArr = generateColumnsArr(numRows, numColumns);
    const diagonalsBLTR = generateDiagonalsArr(numRows, numColumns, "BLTR");
    const diagonalsBRTL = generateDiagonalsArr(numRows, numColumns, "BRTL");

    const [rowsGrid, setRowsGrid] = useState(rowArr);
    const [columnsGrid, setColumnsGrid] = useState(columnsArr);
    const [diagonalsBLTRGrid, setDiagonalsBLTR] = useState(diagonalsBLTR);
    const [diagonalsBRTLGrid, setDiagonalsBRTL] = useState(diagonalsBRTL);

    const updateDiagonalArr = useCallback((diagonals, row, column) => {
        const diagonalsCopy = [...diagonals];
        let diagonal = 0;
        for (diagonal; diagonal < diagonalsCopy.length; diagonal++) {
            let diagonalItemIndex = 0;
            for (diagonalItemIndex; diagonalItemIndex < diagonalsCopy[diagonal].length; diagonalItemIndex++) {
                const diagonalKeys = Object.keys(diagonalsCopy[diagonal][diagonalItemIndex]);
                const index = diagonalKeys.indexOf(`row${row}column${column}`);
                if (index > -1) {
                    diagonalsCopy[diagonal][diagonalItemIndex][`row${row}column${column}`] = player ? 'P' : 'A';
                    break;
                }
            }
        }
    }, [player]);

    // adding token into choosen column
    const addToken = useCallback((column) => {
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
            // P - player, A - "artificial inteligence"
            // updating columns array
            columnsGridCopy[column][row][`row${row}column${column}`] = player ? 'P' : 'A';
            setColumnsGrid(columnsGridCopy);

            // updating rows array
            rowsGridCopy[row][column][`row${row}column${column}`] = player ? 'P' : 'A';
            setRowsGrid(rowsGridCopy);

            updateDiagonalArr(diagonalsBLTRGridCopy, row, column);
            setDiagonalsBLTR(diagonalsBLTRGridCopy);

            updateDiagonalArr(diagonalsBRTLGridCopy, row, column);
            setDiagonalsBRTL(diagonalsBRTLGridCopy);

            createToken(row, column, player);

            setPlayer(!player);
        }
    }, [columnsGrid, diagonalsBLTRGrid, diagonalsBRTLGrid, player, rowsGrid, updateDiagonalArr]);

    function generateInputTockenButtons(columns) {
        const buttonsArr = [];
        let i = 0;
        for (i; i < columns; i++) {
            buttonsArr.push(`button${i}`);
        };
        return (
            <div className="buttons-container">
                {
                    buttonsArr.map((button, index) => {
                        return (
                            <button
                                id={button}
                                key={button}
                                className='button-input'
                                onClick={() => addToken(index)}
                            >
                                {`Column ${index}`}
                            </button>
                        )
                    })
                }
            </div>
        )
    }

    useEffect(() => {
        function getRandomInt() {
            return Math.floor(Math.random() * 2);
        }
        if (getRandomInt() === 0) {
            setPlayer(false);
        } else {
            setPlayer(true);
        }
    }, [])

    useEffect(() => {
        const playerFourInLines = ["PPP#", "PP#P", "P#PP", "#PPP"];
        const aIFourInLines = ["AAA#", "AA#A", "A#AA", "#AAA"];

        function getRandomInt() {
            return Math.floor(Math.random() * (numColumns));
        }

        function scanRows(scanOwnTokens) {
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
            const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

            rowsGrid.every((row, rowIndex) => {
                const arrTokens = Object.values(row)
                    .map((token) => Object.values(token)[0])
                    .join("");

                // eslint-disable-next-line no-loop-func
                const lines = !scanOwnTokens ? playerFourInLines : aIFourInLines;

                let index = 0;
                for(index; index < lines.length; index++) {
                    const fourInLine = lines[index];

                    if (arrTokens.includes(fourInLine)) {
                        const lineIndex = arrTokens.indexOf(fourInLine);
                        const emptyIndex = fourInLine.indexOf("#");
                        const column = lineIndex + emptyIndex;
                        columnsGridCopy[column][emptyIndex][`row${index}column${column}`] = !scanOwnTokens ? 'P' : 'A';
                        setColumnsGrid(columnsGridCopy);

                        rowsGridCopy[rowIndex][column][`row${rowIndex}column${column}`] = !scanOwnTokens ? 'P' : 'A';
                        setRowsGrid(rowsGridCopy);

                        updateDiagonalArr(diagonalsBLTRGridCopy, row, column);
                        setDiagonalsBLTR(diagonalsBLTRGridCopy);

                        updateDiagonalArr(diagonalsBRTLGridCopy, row, column);
                        setDiagonalsBRTL(diagonalsBRTLGridCopy);

                        setPlayer(true);
                        return false
                    }
                    return true;
                }
                return true;
            })
        }

        function scanColumns(scanOwnTokens) {
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
            const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

            let column = 0;
            for (column; column < columnsGrid.length; column++) {
                const arrTokens = Object.values(columnsGrid[column])
                    .map((token) => Object.values(token)[0])
                    .join("");

                
                const substring = !scanOwnTokens ? "PPP#" : "AAA#";
                if (arrTokens.includes(substring)) {
                    const lineIndex = arrTokens.indexOf(substring);
                    const emptyIndex = substring.indexOf("#");
                    columnsGridCopy[column][emptyIndex + lineIndex][`row${emptyIndex + lineIndex}column${column}`] = !scanOwnTokens ? 'P' : 'A';
                    setColumnsGrid(columnsGridCopy);

                    rowsGridCopy[emptyIndex + lineIndex][column][`row${emptyIndex + lineIndex}column${column}`] = !scanOwnTokens ? 'P' : 'A';
                    setRowsGrid(rowsGridCopy);

                    updateDiagonalArr(diagonalsBLTRGridCopy, emptyIndex, column);
                    setDiagonalsBLTR(diagonalsBLTRGridCopy);

                    updateDiagonalArr(diagonalsBRTLGridCopy, emptyIndex, column);
                    setDiagonalsBRTL(diagonalsBRTLGridCopy);

                    createToken(emptyIndex + lineIndex, column, player);

                    return true;
                }
            }
        }

        function scanDiagonalsGrid(direction, scanOwnTokens) {
            const diagonals = direction === "BLTR" ? diagonalsBLTRGrid : diagonalsBRTLGrid;
            const diagonalsCopy = [...diagonals];
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            let diagonalIndex = 0;
            for (
                diagonalIndex;
                diagonalIndex < diagonals.length;
                diagonalIndex++
            ) {
                const arrTokens = Object.values(diagonals[diagonalIndex])
                    .map((token) => Object.values(token)[0])
                    .join("");

                // eslint-disable-next-line no-loop-func
                const lines = !scanOwnTokens ? playerFourInLines : aIFourInLines;
                console.log('lines', lines);
                // eslint-disable-next-line no-loop-func

                let index = 0;
                for(index; index < lines.length; index++) {
                    const fourInLine = lines[index];
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
                            if(columnsGridCopy[columnIndexFromDiagonal][columnIndex][`row${columnIndex}column${columnIndexFromDiagonal}`] === "#") {
                                rowsGridCopy[columnIndex][columnIndexFromDiagonal][`row${columnIndex}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                                setRowsGrid(rowsGridCopy);

                                columnsGridCopy[columnIndexFromDiagonal][columnIndex][`row${columnIndex}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                                setColumnsGrid(columnsGridCopy);
                                createToken(columnIndex, columnIndexFromDiagonal, player);
                                setPlayer(true);
                                return true;
                            }
                        }
                        diagonalsCopy[diagonalIndex][lineIndex][`row${rowIndexFromDiagonal}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                        setDiagonalsBLTR(diagonalsCopy);

                        rowsGridCopy[rowIndexFromDiagonal][columnIndexFromDiagonal][`row${rowIndexFromDiagonal}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                        setRowsGrid(rowsGridCopy);

                        columnsGridCopy[columnIndexFromDiagonal][rowIndexFromDiagonal][`row${rowIndexFromDiagonal}column${columnIndexFromDiagonal}`] = !scanOwnTokens ? 'P' : 'A';
                        setColumnsGrid(columnsGridCopy);
                        createToken(rowIndexFromDiagonal, columnIndexFromDiagonal, player);
                        setPlayer(true);
                        return true;
                    }
                }
                // return true;
            }
            return true;
        }

        function checkGridForWinner() {
            const lines = [
                ...rowsGrid,
                ...columnsGrid,
                ...diagonalsBLTRGrid,
                ...diagonalsBRTLGrid,
            ];

            let line = 0;
            for(line; line < lines; line++) {
                const tokens = Object.values(line)
                    .map((item) => Object.values(item)[0])
                    .join("");
                if (player && tokens.includes("PPPP")) {
                    return "Player wins!"
                }
                if (!player && tokens.includes("AAAA")) {
                    return "AI wins!"
                }
            }
            return "There is no winner!";
        }

        let search = true;

        if (!player) {
            if (search) {
                search = scanDiagonalsGrid("BLTR", false);
                //search = scanDiagonalsGrid("BLTR", true);
                console.log('search0', search);
            }
            if (search) {
                // search = scanDiagonalsGrid("BRTL", false);
                // search = scanDiagonalsGrid("BRTL", true);

                // console.log('search1', search);
            }
            /*if (search) {
                search = scanColumns(false);
                search = scanColumns(true);
                console.log('search2', search);
            }
            if (search) {
                search = scanRows(false);
                search = scanRows(true);
                console.log('search3', search);
            } */
            if (search) {
                setTimeout(() => {
                    addToken(getRandomInt());
                }, 2000);
            }
        }
    }, [addToken, columnsGrid, diagonalsBLTRGrid, diagonalsBRTLGrid, numColumns, player, rowsGrid, updateDiagonalArr])

    return (
        <div
            id="gameDisplayContainer"
            className='game-display-container'
        >
            {generateInputTockenButtons(numColumns)}
            {generateDisplayGrid(numRows, numColumns)}
        </div>
    )
}