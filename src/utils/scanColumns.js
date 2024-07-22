/* eslint-disable no-throw-literal */
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
                possibleSolutions.push({
                    rowIndex: emptyIndex + lineIndex,
                    columnIndex: column
                });
            }
        }
    }
    return possibleSolutions;
}