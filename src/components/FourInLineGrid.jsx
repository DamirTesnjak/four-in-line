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
import { checkGridForWinner } from "../utils/checkGridForWinner";

import "./Row.css";

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
    const [player, setPlayer] = useState(false);
    const [randomizeStartPlayer, setRandomizeStartPlaxer] = useState(false);
    const [endgameMessage, setEndgameMessage] = useState('');

    const rowArr = generateRowsArr(numRows, numColumns);
    const columnsArr = generateColumnsArr(numRows, numColumns);
    const diagonalsBLTR = generateDiagonalsArr(numRows, numColumns, "BLTR");
    const diagonalsBRTL = generateDiagonalsArr(numRows, numColumns, "BRTL");

    const [rowsGrid, setRowsGrid] = useState(rowArr);
    const [columnsGrid, setColumnsGrid] = useState(columnsArr);
    const [diagonalsBLTRGrid, setDiagonalsBLTR] = useState(diagonalsBLTR);
    const [diagonalsBRTLGrid, setDiagonalsBRTL] = useState(diagonalsBRTL);

    const playerFourInLines = useMemo(() => ["PPP#", "PP#P", "P#PP", "#PPP"], []);
    const aIFourInLines = useMemo(() => ["AAA#", "AA#A", "A#AA", "#AAA"], []);

    const args = useMemo(() => ({
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
        updateDiagonalArr,
        setDiagonalsBRTL,
        setEndgameMessage,
    }), [
        aIFourInLines,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        player,
        playerFourInLines,
        rowsGrid,
        setEndgameMessage,
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
                                disabled={!player}
                                onClick={() => addToken({
                                    column: index,
                                    ...args,
                                })}
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
        setRandomizeStartPlaxer(true);
    }, [])

    useEffect(() => {
        if (randomizeStartPlayer) {

            function getRandomInt() {
                return Math.floor(Math.random() * (numColumns));
            }
            if (!player) {
                try {
                    scanRows({ ...args });
                    scanColumns({ ...args });
                    // scanDiagonalsGrid({ ...args });
                    setTimeout(() => {
                        addToken({
                            column: getRandomInt(),
                            ...args,
                        });
                    }, 2000);
                } catch (e) {
                    console.log('e', e);
                    if(e === "line found" && e !== "AI wins!" && e !== "Player wins!") {
                        checkGridForWinner(args);
                    }
                    if (e === "AI wins!" || e === "Player wins!") {
                        // we use try ... catch method to break chain of functions
                        // if we find a winner
                        console.log("Stopping the game! Winner found!");
                    }
                }
            }
        }
    }, [
        args,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        numColumns,
        player,
        randomizeStartPlayer,
        rowsGrid,
    ])

    return (
        <div
            id="gameDisplayContainer"
            className='game-display-container'
        >
            {generateInputTockenButtons(numColumns)}
            {generateDisplayGrid(numRows, numColumns)}
            {`${player ? "PLAYER" : "AI"} turn!`}
            {endgameMessage}
        </div>
    )
}