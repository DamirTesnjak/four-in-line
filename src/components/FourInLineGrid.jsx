import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import { Circle } from './Circle';
import { generateRowsArr } from "../utils/generateRowsArr";
import { generateColumnsArr } from "../utils/generateColumnsArr";
import { generateDiagonalsArr } from "../utils/generateDiagonalsArr";
import { createToken } from '../utils/createToken';
import { scanDiagonalsGrid } from '../utils/scanDiagonalsGrid';
import { scanRows } from '../utils/scanRows';
import { scanColumns } from '../utils/scanColumns';
import { addToken } from '../utils/addToken';
import { updateDiagonalArr } from '../utils/updateDiagonalArr';

import "./GameGrid.css";
import "./Buttons.css";
import "./Messages.css";

function generateDisplayGrid(rows, columns) {
    const rowArr = generateRowsArr(rows, columns)
        .reverse();
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
    const numRows = 6;
    const numColumns = 7;
    const rowArr = generateRowsArr(numRows, numColumns);
    const columnsArr = generateColumnsArr(numRows, numColumns);
    const diagonalsBLTR = generateDiagonalsArr(numRows, numColumns, "BLTR");
    const diagonalsBRTL = generateDiagonalsArr(numRows, numColumns, "BRTL");

    const initState = {
        player: false,                    // true - human player, false - AI
        endgameMessage: '',       // message and the end of a game
        possibleSolutions: [], // list of possible grid coordinates for AI to fill for a possible win
        checkForWinner: false,    // true - check for a winner, false - do not check for a winner
        winner: false,                    // true - we have a winner
        randomPlayer: false,
        rowsGrid: rowArr,
        columnsGrid: columnsArr,
        diagonalsBLTRGrid: diagonalsBLTR,
        diagonalsBRTLGrid: diagonalsBRTL,
        scannedGrid: false,
    }

    const [appState, setAppState] = useState(initState);

    const playerFourInLines = useMemo(() => ["PPP#", "PP#P", "P#PP", "#PPP"], []);
    const aIFourInLines = useMemo(() => ["AAA#", "AA#A", "A#AA", "#AAA"], []);

    const {
        player,                    // true - human player, false - AI
        endgameMessage,       // message and the end of a game
        possibleSolutions, // list of possible grid coordinates for AI to fill for a possible win
        checkForWinner,    // true - check for a winner, false - do not check for a winner
        winner,                    // true - we have a winner
        randomPlayer,
        rowsGrid,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        scannedGrid,
    } = appState;

    const args = useMemo(() => ({
        createToken,
        appState,
        setAppState,
        updateDiagonalArr,
        playerFourInLines,
        aIFourInLines,
    }), [
        appState,
        setAppState,
        playerFourInLines,
        aIFourInLines,
    ]);

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
                                disabled={!player || winner}
                                onClick={() => addToken({
                                    column: index,
                                    ...args,
                                })}
                            >
                                {`Column ${index + 1}`}
                            </button>
                        )
                    })
                }
            </div>
        )
    }

    useEffect(() => {
        // random selecting which player starts:
        // - human player
        // - AI
        if (!randomPlayer) {
            function getRandomInt() {
                return Math.floor(Math.random() * 2);
            }
            const randomNumber = getRandomInt();
            setAppState({
                ...appState,
                player: !(randomNumber === 0),
                randomPlayer: true,
            });
        }

        // start scanning the grid, to get pontential solution for the
        // win of AI
        if (
            randomPlayer
            && !winner 
            && !player
            && !scannedGrid
        ) {
            console.log('scanning')
            setTimeout(() => {
                setAppState({
                    ...appState,
                    possibleSolutions: [
                        ...scanDiagonalsGrid({ ...args }),
                        ...scanColumns({ ...args }),
                        ...scanRows({ ...args }),
                    ],
                    scannedGrid: true,
                });
            }, 1000);
        }

        // updating game grid with the resut of a previous scan
        if (randomPlayer
            && !winner 
            && !player
            && scannedGrid
            && !checkForWinner
        ) {
            console.log('updating')
            if (possibleSolutions.length === 0) {
                function getRandomInt() {
                    return Math.floor(Math.random() * (numColumns));
                }
                setTimeout(() => {
                    addToken({
                        column: getRandomInt(),
                        ...args,
                    });
                }, 2000);
            }
            if (!player && possibleSolutions.length > 0) {
                function getRandomPSI() {
                    return Math.floor(Math.random() * (possibleSolutions.length));
                }

                const pSI = getRandomPSI();
                const pS = possibleSolutions[pSI];

                const rowIndex = pS.rowIndex;
                const columnIndex = pS.columnIndex;

                const diagonalsBLTRGridCopy = [...diagonalsBLTRGrid];
                const diagonalsBRTLGridCopy = [...diagonalsBRTLGrid];
                const rowsGridCopy = [...rowsGrid];
                const columnsGridCopy = [...columnsGrid];


                const updateddDiagonalsBLTRGrid = updateDiagonalArr(diagonalsBLTRGridCopy, rowIndex, columnIndex);
                const updatedDiagonalsBRTLGrid = updateDiagonalArr(diagonalsBRTLGridCopy, rowIndex, columnIndex);

                rowsGridCopy[rowIndex][columnIndex][`row${rowIndex}column${columnIndex}`] = "A";
                columnsGridCopy[columnIndex][rowIndex][`row${rowIndex}column${columnIndex}`] = "A";
                createToken(rowIndex, columnIndex, player);

                setAppState({
                    ...appState,
                    rowsGrid: rowsGridCopy,
                    columnsGrid: columnsGridCopy,
                    diagonalsBLTRGrid: updateddDiagonalsBLTRGrid,
                    diagonalsBRTLGrid: updatedDiagonalsBRTLGrid,
                    player: true,
                    checkForWinner: true,
                });
            }
        }

        // checking for the winner
        if (randomPlayer
            && !winner 
            && scannedGrid
            && checkForWinner
        ) {
            console.log('checking for a winner');
            const lines = [
                ...rowsGrid,
                ...columnsGrid,
                ...diagonalsBLTRGrid,
                ...diagonalsBRTLGrid,
            ];
            let line = 0;
            for (line; line < lines.length; line++) {
                const tokens = lines[line].map((item) => Object.values(item)[0])
                    .join("");
                if (tokens.includes("PPPP")) {
                    setAppState({
                        ...appState,
                        endgameMessage: "Player wins!",
                        winner: true,
                        
                    })
                    break;
                }
                if (tokens.includes("AAAA")) {
                    setAppState({
                        ...appState,
                        endgameMessage: "AI wins!",
                        winner: true,
                    });
                    break;
                }
                if (!tokens.includes("AAAA") || !tokens.includes("PPPP")) {
                    setAppState({
                        ...appState,
                        checkForWinner: false,
                        possibleSolutions: [],
                        scannedGrid: false,
                    });
                }
            }
        }

    }, [appState,
        args, 
        checkForWinner,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        player,
        possibleSolutions,
        randomPlayer,
        rowsGrid,
        scannedGrid,
        winner,
    ])

    return (
        <div
            id="gameDisplayContainer"
            className='game-display-container'
        >
            <div className='game-title'>
             Four in line
            </div>
            <div className='center-message'>
            {!winner && `${player ? "PLAYER" : "AI"} turn!`}
            </div>
            <div className='center-message'>
                {endgameMessage}
            </div>
            {generateDisplayGrid(numRows, numColumns)}
            {generateInputTockenButtons(numColumns)}
        </div>
    )
}