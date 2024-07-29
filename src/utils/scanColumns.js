/* eslint-disable no-throw-literal */
/**
 * Scans columns for "AAA#" & "PPP#"
 * - A - AI token
 * - P - human player token
 * - # - empty slot
 * 
 * @param {object} args - Object as an argument of a function.
 * @param {object} args.appState - Object that holds the state of all variables.
 * @param {array} args.columnsGrid - Array of columns,
 */

export function scanColumns(args) {
    const {
        appState,
    } = args;

    const { columnsGrid } = appState;
    const possibleSolutions = [];

    let column = 0;
    for (column; column < columnsGrid.length; column++) {
        const cTokens = Object.values(columnsGrid[column])
            .map((token) => Object.values(token)[0])
            .join("");
        
        const psltr = ["AAA#", "PPP#"];

        let psltrIndex = 0;
        for (psltrIndex; psltrIndex < psltr.length; psltrIndex++) {
            const psltrItem = psltr[psltrIndex];
            if (cTokens.includes(psltrItem)) {
                const lineIndex = cTokens.indexOf(psltrItem);
                const emptyIndex = psltrItem.indexOf("#");
                // eslint-disable-next-line no-loop-func
                possibleSolutions.push({
                    rowIndex: emptyIndex + lineIndex,
                    columnIndex: column
                });
            }
        }
    }
    return possibleSolutions;
}