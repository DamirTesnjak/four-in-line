/* eslint-disable no-throw-literal */
/* eslint-disable no-throw-literal */
/**
 * Scans diagonals for "AAA#", "PPP#" etc.
 * - A - AI token
 * - P - human player token
 * - # - empty slot
 * 
 * @param {object} args - Object as an argument of a function.
 * @param {object} args.appState - Object that holds the state of all variables.
 * @param {object} args.appState - Object that holds the state of all variables.
 * @param {array} args.playerFourInLines - ["PPP#", "PP#P", "P#PP", "#PPP"],
 * @param {array} args.aIFourInLines - ["AAA#", "AA#A", "A#AA", "#AAA"],
 */

export function scanDiagonalsGrid(args) {
    const {
        playerFourInLines,
        aIFourInLines,
        appState,
    } = args;

    const {
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
    } = appState

    const scanningSettings = [
        {
            direction: "BLTR", // direction of scanning diagonals, bottom-left-top-right
        },
        {
            direction: "BRTL", // direction of scanning diagonals, bottom-right-top-left
        },
    ];

    const columnsGridCopy = [...columnsGrid];

    const possibleSolutions = [];

    let scanIndex = 0;

    for (scanIndex; scanIndex < scanningSettings.length; scanIndex++) {
        const scanSetting = scanningSettings[scanIndex];
        const direction = scanSetting.direction;
        const diagonals =
            direction === "BLTR" ? diagonalsBLTRGrid : diagonalsBRTLGrid;
        const diagonalsCopy = [...diagonals];

        let dIndex = 0; // diagonal index
        loopDiagonals:
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
                // corresponds "row" and "column" indexes in a grid
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
                            // eslint-disable-next-line no-loop-func
                            setTimeout(() => {
                                possibleSolutions.push({
                                    rowIndex: colIndex,
                                    columnIndex: dColumn
                                });
                            }, 1000);
                            break loopDiagonals;
                        } 
                    }
                    setTimeout(() => {
                        possibleSolutions.push({
                            rowIndex: dRow,
                            columnIndex: dColumn
                        });
                    }, 1000);
                    break loopDiagonals;
                }
            }
        }
    }
    return possibleSolutions;
}
