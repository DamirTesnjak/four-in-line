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
    const [gameStopped, stopGame] = useState(false);
    const [randomizeStartPlayer, setRandomizeStartPlaxer] = useState(false);

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
        stopGame,
        gameStopped,
    }), [
        aIFourInLines,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        player,
        playerFourInLines,
        rowsGrid,
        stopGame,
        gameStopped,
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

    console.log('gameStopped', gameStopped);

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
            if (!player && !gameStopped) {
                try {
                    scanDiagonalsGrid({
                        direction: "BLTR",
                        scanOwnTokens: false,
                        ...args,
                    });
                    scanDiagonalsGrid({
                        direction: "BLTR",
                        scanOwnTokens: true,
                        ...args,
                    });
                    scanDiagonalsGrid({
                        direction: "BRTL",
                        scanOwnTokens: false,
                        ...args,
                    });
                    scanDiagonalsGrid({
                        direction: "BRTL",
                        scanOwnTokens: true,
                        ...args,
                    });
                    scanColumns({
                        scanOwnTokens: false,
                        ...args,
                    });
                    scanColumns({
                        scanOwnTokens: true,
                        ...args,
                    });
                    scanRows({
                        scanOwnTokens: false,
                        ...args,
                    });
                    scanRows({
                        scanOwnTokens: true,
                        ...args,
                    });
                    setTimeout(() => {
                        addToken({
                            column: getRandomInt(),
                            ...args,
                        });
                    }, 2000);
                } catch (e) {
                    console.log('e', e);
                    if (e === "line found" && e !== "AI wins!" && e !== "Player wins!") {
                        setTimeout(() => {
                            addToken({
                                column: getRandomInt(),
                                ...args,
                            });
                        }, 2000);
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
        gameStopped,
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
        </div>
    )
}