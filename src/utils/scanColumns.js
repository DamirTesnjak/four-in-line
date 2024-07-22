/* eslint-disable no-throw-literal */
export function scanColumns(args) {
    const {
        appState,
        setAppState,
    } = args;

    const { columnsGrid, possibleSolutions } = appState;

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
                console.log('test');
                const lineIndex = cTokens.indexOf(psltrItem);
                const emptyIndex = psltrItem.indexOf("#");
                setAppState({
                    ...appState,
                    possibleSolutions: [
                        ...possibleSolutions,
                        ...[{
                            rowIndex: emptyIndex + lineIndex,
                            columnIndex: column
                        }]
                    ],
                });
            }
        }
    }
}