/* eslint-disable no-throw-literal */
// scans diagonals for probable future solutions, e.g. player has in diagonal tokens:
// P#PP, while P is player's token and # is an empty slot,
// and tries to prevent player to win a game, by inserting AI's token
// or to for AI to win

export function scanDiagonalsGrid(args) {
    const {
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
    } = args;

    const scanningSettings = [
        {
            direction: "BLTR", // direction of scanning diagonals, bottom-left-top-right
        },
        {
            direction: "BRTL", // direction of scanning diagonals, bottom-right-top-left
        },
    ];

    const columnsGridCopy = [...columnsGrid];
    const rowsGridCopy = [...rowsGrid];

    let scanIndex = 0;
    for (scanIndex; scanIndex < scanningSettings.length; scanIndex++) {
        const scanSetting = scanningSettings[scanIndex];
        const direction = scanSetting.direction;
        const diagonals =
            direction === "BLTR" ? diagonalsBLTRGrid : diagonalsBRTLGrid;
        const diagonalsCopy = [...diagonals];

        let dIndex = 0; // diagonal index
        for (dIndex; dIndex < diagonals.length; dIndex++) {
            const diagonal = diagonals[dIndex];

            // diagonal's tokens
            const dTokens = Object.values(diagonal)
                .map((token) => Object.values(token)[0])
                .join("");

            // possible solution before last token for the player win
            const psltr = [...aIFourInLines, ...playerFourInLines];

            let psltrIndex = 0;

            for (psltrIndex; psltrIndex < psltr.length; psltrIndex++) {
                const psltrItem = psltr[psltrIndex];
                // if possible solution before last token for the player win
                // corespond "row" and "column" indexes in a grid
                if (dTokens.includes(psltrItem)) {
                    const solutionIndex = dTokens.split("").reverse().indexOf("#");

                    const targetDiagonal = diagonalsCopy[dIndex].reverse();

                    // diagonal in which possible solution exists
                    const dTarget = targetDiagonal[solutionIndex];
                    const dTargetKey = Object.keys(dTarget)[0];

                    // row, column game grid coordinates
                    const dItemCR = dTargetKey
                        .replace("row", "")
                        .replace("column", ",")
                        .split(",");

                    const dRow = Number(dItemCR[0]); // row coordinate of diagonal's token
                    const dColumn = Number(dItemCR[1]); // column coordinate of diagonal's token

                    let colIndex = 0;
                    for (colIndex; colIndex < dRow; colIndex++) {
                        //checks if a column is filled up to targeted slot
                        if (
                            columnsGridCopy[dColumn][colIndex][
                            `row${colIndex}column${dColumn}`
                            ] === "#"
                        ) {
                            rowsGridCopy[colIndex][dColumn][
                                `row${colIndex}column${dColumn}`
                            ] = "A";
                            setRowsGrid(rowsGridCopy);

                            columnsGridCopy[dColumn][colIndex][
                                `row${colIndex}column${dColumn}`
                            ] = "A";
                            setColumnsGrid(columnsGridCopy);
                            createToken(colIndex, dColumn, player);
                            setPlayer(true);
                            throw "line found";
                        }
                    }

                    // inserting AI token in targeted slot, updating row, columns and diagonals arrays
                    diagonalsCopy[dIndex][solutionIndex][`row${dRow}column${dColumn}`] =
                        "A";
                    setDiagonalsBLTR(diagonalsCopy);

                    rowsGridCopy[dRow][dColumn][`row${dRow}column${dColumn}`] = "A";
                    setRowsGrid(rowsGridCopy);

                    columnsGridCopy[dColumn][dRow][`row${dRow}column${dColumn}`] = "A";
                    setColumnsGrid(columnsGridCopy);

                    createToken(dRow, dColumn, player);
                    setPlayer(true);
                    throw "line found";
                }
            }
        }
    }
}
