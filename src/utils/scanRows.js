/* eslint-disable no-throw-literal */
// scans rows for probable future solutions, e.g. player has in a row tokens:
// P#PP, while P is player's token and # is an empty slot,
// and tries to prevent player to win a game, by inserting AI's token
// or to for AI to win

export function scanRows(args) {
    const {
        playerFourInLines,
        aIFourInLines,
        appState,
    } = args;

    const {
        columnsGrid,
        rowsGrid,
    } = appState

    const possibleSolutions = [];
    const columnsGridCopy = [...columnsGrid];
    let rowIndex = 0;
    loopRows:
    for (rowIndex; rowIndex < rowsGrid.length; rowIndex++) {
        const rTokens = Object.values(rowsGrid[rowIndex])
            .map((token) => Object.values(token)[0])
            .join("");

        // eslint-disable-next-line no-loop-func
        // possible solution before last token for the player win
        const psltr = [...aIFourInLines, ...playerFourInLines];

        let psltrIndex = 0;
        for (psltrIndex; psltrIndex < psltr.length; psltrIndex++) {
            const psltrItem = psltr[psltrIndex];
            if (rTokens.includes(psltrItem)) {
                const rIndex = rTokens.indexOf(psltrItem);
                const solutionIndex = psltrItem.indexOf("#");
                const rColumn = rIndex + solutionIndex;

                let colIndex = 0;
                for (colIndex; colIndex < rColumn; colIndex++) {
                    //checks if a column is filled up to targeted slot
                    if (
                        columnsGridCopy[rColumn][colIndex][
                        `row${colIndex}column${rColumn}`
                        ] === "#"
                    ) {
                        possibleSolutions.push({
                            rowIndex: colIndex,
                            columnIndex: rColumn
                        });
                        break loopRows;
                    }
                }
                possibleSolutions.push({
                    rowIndex: rowIndex,
                    columnIndex: rColumn
                });
            }
        }
    };
    return possibleSolutions;
}
