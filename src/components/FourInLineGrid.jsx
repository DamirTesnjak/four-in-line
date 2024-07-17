import { useCallback, useEffect, useState } from 'react';

import { Circle } from './Circle';
import { generateRowsArr } from "../utils/generateRowsArr";
import { generateColumnsArr } from "../utils/generateColumnsArr";

import "./Row.css";

function generateDiagonals(columns, direction) {
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
            diagonal.push({ [`row${x}column${y}`]: '#' });
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

function createToken(row, column, player) {
    const newTokenContainer = document.createElement("div");
    newTokenContainer.id = `playerTokenContainer${row}Column${column}`;
    newTokenContainer.style.position = "absolute";
    newTokenContainer.style.width = "100px";                   /* the div size */
    newTokenContainer.style.height = "100px";
    newTokenContainer.style.top = `${6 * 100 + 23}px`;
    newTokenContainer.style.left = `${column * 100}px`;                  /* the div size */
    newTokenContainer.style.overflow = "hidden";
    newTokenContainer.style.zIndex = 0;

    const gameDisplayContainer = document.getElementById("gameDisplayContainer");
    gameDisplayContainer.appendChild(newTokenContainer);

    // create player or AI token
    const newToken = document.createElement("div");
    newToken.id = `playerTokenRow${row}Column${column}`;
    newToken.style.width = '80px';
    newToken.style.height = '80px';
    newToken.style.backgroundColor = player ? "red" : "yellow";
    newToken.style.borderRadius = '50%';
    newToken.style.border = "50px solid white";
    newToken.style.margin = "-40px";
    newToken.style.zIndex = 0;

    const playerTokenContainer = document.getElementById(`playerTokenContainer${row}Column${column}`);
    playerTokenContainer.appendChild(newToken);

    console.log(`row${row}column${column}`)
    setTimeout(() => {
        newTokenContainer.style.visibility = "visible";
        newTokenContainer.style.top = `${row * 100 + 23}px`;
        newTokenContainer.style.left = `${column * 100}px`;
    }, 1000);

}

export function FourInLineGrid() {
    const [numRows, setNumRow] = useState(6);
    const [numColumns, setNumColumns] = useState(7);
    const [player, setPlayer] = useState(false);

    const rowArr = generateRowsArr(numRows, numColumns);
    const columnsArr = generateColumnsArr(numRows, numColumns);
    const diagonalsBLTR = generateDiagonals(numColumns, "BLTR");
    const diagonalsBRTL = generateDiagonals(numColumns, "BRTL");

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
            if (columnsGrid[column][row][`row${row}column${column}`] === '#') {
                break;
            }
        }

        if (columnsGridCopy.length - 1 >= row) {
            // P - player, A - "artificial inteligence"
            // updating columns array
            columnsGridCopy[column][row][`row${row}column${column}`] = player ? 'P' : 'A';
            console.log('columnsGridCopy', columnsGridCopy);
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

        function scanRows() {
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
            const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

            rowsGrid.every((row, rowIndex) => {
                const arrTokens = Object.values(row)
                    .map((token) => Object.values(token)[0])
                    .join("");

                // eslint-disable-next-line no-loop-func
                const lines = player ? playerFourInLines : aIFourInLines;

                lines.every((fourInLine, index) => {
                    if (arrTokens.includes(fourInLine)) {
                        const lineIndex = arrTokens.indexOf(fourInLine);
                        const emptyIndex = fourInLine.indexOf("#");
                        const column = lineIndex + emptyIndex;
                        columnsGridCopy[column][emptyIndex][`row${index}column${column}`] = player ? 'P' : 'A';
                        setColumnsGrid(columnsGridCopy);

                        rowsGridCopy[rowIndex][column][`row${rowIndex}column${column}`] = player ? 'P' : 'A';
                        setRowsGrid(rowsGridCopy);

                        updateDiagonalArr(diagonalsBLTRGridCopy, row, column);
                        setDiagonalsBLTR(diagonalsBLTRGridCopy);

                        updateDiagonalArr(diagonalsBRTLGridCopy, row, column);
                        setDiagonalsBRTL(diagonalsBRTLGridCopy);

                        setTimeout(() => {
                            createToken(rowIndex, column, player);
                        }, 2000);

                        setPlayer(true);
                        return false
                    }
                    return true;
                })
                return true;
            })
        }

        function scanColumns() {
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
            const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

            let column = 0;
            for (column; column < columnsGrid.length; column++) {
                const arrTokens = Object.values(columnsGrid[column])
                    .map((token) => Object.values(token)[0])
                    .join("");

                
                const substring = "PPP#";
                if (arrTokens.includes(substring)) {
                    const lineIndex = arrTokens.indexOf(substring);
                    const emptyIndex = substring.indexOf("#");
                    columnsGridCopy[column][emptyIndex + lineIndex][`row${emptyIndex + lineIndex}column${column}`] = player ? 'P' : 'A';
                    console.log('columnsGridCopy', columnsGridCopy);
                    setColumnsGrid(columnsGridCopy);

                    rowsGridCopy[emptyIndex + lineIndex][column][`row${emptyIndex + lineIndex}column${column}`] = player ? 'P' : 'A';
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

        function scanDiagonalsGrid(direction) {
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
                let result = false;

                // eslint-disable-next-line no-loop-func
                const lines = player ? playerFourInLines : aIFourInLines;
                // eslint-disable-next-line no-loop-func
                lines.every((fourInLine, index) => {
                    result = arrTokens.includes(fourInLine);
                    // console.log('arrTokens', arrTokens);
                    if (result) {
                        const lineIndex = arrTokens.indexOf(fourInLine);
                        const emptyIndex = lineIndex.indexOf("#");

                        if (direction === "BLTR") {
                            const row = index - lineIndex - emptyIndex;
                            const column = lineIndex + emptyIndex;
                            diagonalsCopy[diagonalIndex][emptyIndex][`row${row}column${column}`] = player ? 'P' : 'A';
                            setDiagonalsBLTR(diagonalsCopy);

                            rowsGridCopy[row][column][`row${row}column${column}`] = player ? 'P' : 'A';
                            setRowsGrid(rowsGridCopy);

                            columnsGridCopy[column][row][`row${row}column${column}`] = player ? 'P' : 'A';
                            setColumnsGrid(columnsGridCopy);

                            createToken(row, column, player);

                            setPlayer(true);
                            return false;
                        }
                        if (direction === "BRTL") {
                            diagonalsCopy[diagonalIndex][emptyIndex][`row${numColumns - 1 - lineIndex - emptyIndex}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                            setDiagonalsBRTL(diagonalsCopy);

                            rowsGridCopy[numColumns - 1 - lineIndex - emptyIndex][index - lineIndex - emptyIndex][`row${numColumns - 1 - lineIndex - emptyIndex}column${index - lineIndex - emptyIndex}`] = player ? 'P' : 'A';
                            setRowsGrid(rowsGridCopy);

                            columnsGridCopy[index - lineIndex - emptyIndex][index - lineIndex - emptyIndex][`row${index - lineIndex - emptyIndex}column${index - lineIndex - emptyIndex}`] = player ? 'P' : 'A';
                            setColumnsGrid(columnsGridCopy);

                            createToken(numColumns - 1 - lineIndex - emptyIndex, lineIndex + emptyIndex, player);

                            setPlayer(true);
                            return false;
                        }
                    }
                    return true;
                })
                if (result) {
                    setPlayer(true);
                    return false;
                }
            }
            setPlayer(true);
        }

        let search = true;

        if (!player) {
            /*if (search) {
                search = scanDiagonalsGrid("BLTR");
                console.log('search0', search);
            }
            if (search) {
                search = scanDiagonalsGrid("BRTL");
                console.log('search1', search);
            } */
            if (search) {
                search = scanColumns();
                console.log('search2', search);
            }
            /* if (search) {
                search = scanRows();
                console.log('search3', search);
            } */
            if (!search) {
                console.log('search4', search);
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