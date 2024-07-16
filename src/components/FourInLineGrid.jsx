import { useCallback, useEffect, useState } from 'react';

import { Circle } from './Circle';
import { generateRowsArr } from "../utils/generateRowsArr";
import { generateColumnsArr } from "../utils/generateColumnsArr";

import "./Row.css";

function generateDiagonals(columns, direction) {
    const diagonals = [];
    const numOfDialogs = columns + (columns - 1);
    let i = 0;
    for(i; i < numOfDialogs; i++ ) {
        const diagonal = []; 
        let x = direction === "BLTR" ? i : columns - 1;
        let y = direction === "BLTR" ? 0 : i;
        let countItem = 0;
        for (
            countItem;
            countItem < columns;
            countItem++
        ) {
            diagonal.push({[`row${x}column${y}`]: '#'});
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

export function FourInLineGrid() {
    const [numRows, setNumRow] = useState(4);
    const [numColumns, setNumColumns] = useState(4);
    const [player, setPlayer] = useState(false);

    const rowArr = generateRowsArr(numRows, numColumns);
    const columnsArr = generateColumnsArr(numRows, numColumns);
    const diagonalsBLTR = generateDiagonals(numColumns, "BLTR");
    const diagonalsBRTL = generateDiagonals(numColumns, "BRTL");

    const [ rowsGrid, setRowsGrid ] = useState(rowArr);
    const [ columnsGrid, setColumnsGrid ] = useState(columnsArr);
    const [ diagonalsBLTRGrid, setDiagonalsBLTR ] = useState(diagonalsBLTR);
    const [ diagonalsBRTLGrid, setDiagonalsBRTL ] = useState(diagonalsBRTL);

    const updateDiagonalArr = useCallback((diagonals, row, column) => {
        const diagonalsCopy = [...diagonals];
        let diagonal = 0;
        for(diagonal; diagonal < diagonalsCopy.length; diagonal++) {
            let diagonalItemIndex = 0;
            for(diagonalItemIndex; diagonalItemIndex < diagonalsCopy[diagonal].length; diagonalItemIndex++) {
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
        for(row; row < columnsGrid.length; row++) {
            if(columnsGrid[column][row][`row${row}column${column}`] === '#') {
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
        const playerFourInLines = ["PPP#", "PP#P", "P#PP", "#PPP"];

        function getRandomInt() {
            return Math.floor(Math.random() * (numColumns));
        }

        function scanRows() {
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
            const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

            rowsGrid.every((row) => {
                const arrTokens = Object.values(row);
                let result = false;
    
                playerFourInLines.every((fourInLine, index) => {
                    result = arrTokens.includes(fourInLine);
                    if (result) {
                        const lineIndex = arrTokens.indexOf(fourInLine);
                        const emptyIndex = lineIndex.indexOf("#");
                        const column = lineIndex + emptyIndex;
                        columnsGridCopy[column][emptyIndex][`row${index}column${column}`] = player ? 'P' : 'A';
                        setColumnsGrid(columnsGridCopy);

                        rowsGridCopy[index][column][`row${index}column${column}`] = player ? 'P' : 'A';
                        setRowsGrid(rowsGridCopy);

                        updateDiagonalArr(diagonalsBLTRGridCopy, row, column);
                        setDiagonalsBLTR(diagonalsBLTRGridCopy);

                        updateDiagonalArr(diagonalsBRTLGridCopy, row, column);
                        setDiagonalsBRTL(diagonalsBRTLGridCopy);

                        setPlayer(true);
                        return false
                    }
                    return true;
                })
                if (result) {
                    return false;
                }
                return true;
            })
        }
    
        function scanColumns() {
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
            const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
            const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];

            let column = 0;
            let result = false;
            for(column; column < columnsGrid.length; column++) {
                const arrTokens = Object.values(columnsGrid[column]);
                result = arrTokens.includes("#PPP");
                if (result) {
                    const lineIndex = arrTokens.indexOf("#PPP");
                    const emptyIndex = lineIndex.indexOf("#");
                    columnsGridCopy[column][`row${emptyIndex}column${column}`] = player ? 'P' : 'A';
                    setColumnsGrid(columnsGridCopy);

                    rowsGridCopy[emptyIndex][`row${emptyIndex}column${column}`] = player ? 'P' : 'A';
                    setRowsGrid(rowsGridCopy);

                    updateDiagonalArr(diagonalsBLTRGridCopy, emptyIndex, column);
                    setDiagonalsBLTR(diagonalsBLTRGridCopy);

                    updateDiagonalArr(diagonalsBRTLGridCopy, emptyIndex, column);
                    setDiagonalsBRTL(diagonalsBRTLGridCopy);

                    setPlayer(true);
                    return false;
                }
            }
            return true;
        }
    
        function scanDiagonalsGrid(direction) {
            const diagonals = direction === "BLTR" ? diagonalsBLTRGrid : diagonalsBRTLGrid;
            const diagonalsCopy = [...diagonals];
            const columnsGridCopy = [...columnsGrid];
            const rowsGridCopy = [...rowsGrid];
    
            let diagonalIndex = 0;
            for(
                diagonalIndex;
                diagonalIndex < diagonals.length;
                diagonalIndex++
            ) {
                console.log('diagonals[diagonalIndex]', diagonals[diagonalIndex]);
                const arrTokens = Object.values(diagonals[diagonalIndex]);
                let result = false;
    
                // eslint-disable-next-line no-loop-func
                playerFourInLines.every((fourInLine, index) => {
                    result = arrTokens.includes(fourInLine);
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

                            setPlayer(true);
                            return false;  
                        }
                    }
                    return true;
                })
                if(result) {
                    setPlayer(true);
                    return false;
                }
                return true
            }
            setPlayer(true);
        }

        let search = true;
        
        if(!player) {
            if (search) {
                search = scanDiagonalsGrid("BLTR");
                console.log('search0', search);
            }
            if (search) {
                search = scanDiagonalsGrid("BRTL");
                console.log('search1', search);
            }
            if (search) {
                search = scanColumns();
                console.log('search2', search);
            }
            if (search) {
                search = scanRows();
                console.log('search3', search);
            }
            if(!search) {
                console.log('search4', search);
                addToken(getRandomInt());
            }
        }
    }, [addToken, columnsGrid, diagonalsBLTRGrid, diagonalsBRTLGrid, numColumns, player, rowsGrid, updateDiagonalArr])

    return (
        <div className='game-display-container'>
            {generateInputTockenButtons(numColumns)}
            {generateDisplayGrid(numRows, numColumns)}
        </div>
    )
}