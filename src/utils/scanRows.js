/* eslint-disable no-throw-literal */
/**
 * Scans rows for "AAA#", "PPP#" etc.
 * - A - AI token
 * - P - human player token
 * - # - empty slot
 * 
 * @param {object} args - Object as an argument of a function.
 * @param {object} args.appState - Object that holds the state of all variables.
 * @param {array} args.playerFourInLines - ["PPP#", "PP#P", "P#PP", "#PPP"],
 * @param {array} args.aIFourInLines - ["AAA#", "AA#A", "A#AA", "#AAA"],
 */

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
                        // eslint-disable-next-line no-loop-func
                        setTimeout(() => {
                            possibleSolutions.push({
                                rowIndex: colIndex,
                                columnIndex: rColumn
                            });
                        }, 1000);
                        break loopRows;
                    }
                }
                // eslint-disable-next-line no-loop-func
                setTimeout(() => {
                    possibleSolutions.push({
                        rowIndex: rowIndex,
                        columnIndex: rColumn
                    });
                }, 1000);
            }
        }
    };
    return possibleSolutions;
}
