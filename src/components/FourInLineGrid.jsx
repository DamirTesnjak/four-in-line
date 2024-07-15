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

    const addToken = useCallback((column) => {
        console.log('column', column);
        let index = 0;
        while (columnsGrid[column][`row${index}column${column}`] !== '#') {
            index += 1;
        }
        const columnsGridCopy = [...columnsGrid];
        const rowsGridCopy = [...rowsGrid];
    
        if (columnsGridCopy.length - 1 <= index) {
    
            // P - player, A - "artificial inteligence
            columnsGridCopy[column][`row${index}column${column}`] = player ? 'P' : 'A';
            rowsGridCopy[index][`row${column}column${index}`] = player ? 'P' : 'A';
            setColumnsGrid(columnsGridCopy);
            setRowsGrid(rowsGridCopy);
            setPlayer(!player);
        }
    }, [columnsGrid, player, rowsGrid]);

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
            rowsGrid.every((row) => {
                const arrTokens = Object.values(row);
                let result = false;
    
                playerFourInLines.every((fourInLine, index) => {
                    result = arrTokens.includes(fourInLine);
                    if (result) {
                        const lineIndex = arrTokens.indexOf(fourInLine);
                        const emptyIndex = lineIndex.indexOf("#");
                        columnsGridCopy[lineIndex + emptyIndex][`row${index}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                        rowsGridCopy[index][`row${index}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                        scanDiagonalsGrid("BLTR", numColumns);
                        scanDiagonalsGrid("BRTL", numColumns);
                        setRowsGrid(rowsGridCopy);
                        setColumnsGrid(columnsGridCopy);
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
            let column = 0;
            let result = false;
            for(column; column < columnsGrid.length; column++) {
                const arrTokens = Object.values(columnsGrid[column]);
                // first scenario xxx.
                result = arrTokens.includes("#PPP");
                if (result) {
                    const lineIndex = arrTokens.indexOf("#PPP");
                    const emptyIndex = lineIndex.indexOf("#");
                    columnsGridCopy[column][`row${emptyIndex}column${column}`] = player ? 'P' : 'A';
                    rowsGridCopy[emptyIndex][`row${emptyIndex}column${column}`] = player ? 'P' : 'A';
                    // scanDiagonalsGrid("BLTR", numColumns);
                    // scanDiagonalsGrid("BRTL", numColumns);
                    setRowsGrid(rowsGridCopy);
                    setColumnsGrid(columnsGridCopy);
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
                const arrTokens = Object.values(diagonals[diagonalIndex]);
                let result = false;
    
                // eslint-disable-next-line no-loop-func
                playerFourInLines.every((fourInLine, index) => {
                    result = arrTokens.includes(fourInLine);
                    if (result) {
                        const lineIndex = arrTokens.indexOf(fourInLine);
                        const emptyIndex = lineIndex.indexOf("#");
    
                        if (direction === "BLTR") {
                            diagonalsCopy[index][`row${index - lineIndex - emptyIndex}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                            rowsGridCopy[index - lineIndex - emptyIndex][`row${index - lineIndex - emptyIndex}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                            columnsGridCopy[lineIndex + emptyIndex][`row${index - lineIndex - emptyIndex}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                            setDiagonalsBLTR(diagonalsCopy);
                            setColumnsGrid(columnsGridCopy);
                            setRowsGrid(rowsGridCopy);
                            setPlayer(true);
                            return false;
                        }
                        if (direction === "BRTL") {
                            diagonalsCopy[index][`row${numColumns - 1 - lineIndex - emptyIndex}column${lineIndex + emptyIndex}`] = player ? 'P' : 'A';
                            rowsGridCopy[numColumns - 1 - lineIndex - emptyIndex][`row${numColumns - 1 - lineIndex - emptyIndex}column${index - lineIndex - emptyIndex}`] = player ? 'P' : 'A';
                            columnsGridCopy[index - lineIndex - emptyIndex][`row${index - lineIndex - emptyIndex}column${index - lineIndex - emptyIndex}`] = player ? 'P' : 'A';
                            setDiagonalsBRTL(diagonalsCopy);
                            setColumnsGrid(columnsGridCopy);
                            setRowsGrid(rowsGridCopy);
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
    }, [addToken, columnsGrid, diagonalsBLTRGrid, diagonalsBRTLGrid, numColumns, player, rowsGrid])

    console.log('test');

    return (
        <div className='game-display-container'>
            {generateInputTockenButtons(numColumns)}
            {generateDisplayGrid(numRows, numColumns)}
        </div>
    )
}