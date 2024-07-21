/* eslint-disable no-throw-literal */
export function checkGridForWinner(args) {
    const {
        rowsGrid,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        setEndgameMessage,
    } = args;
    const lines = [
        ...rowsGrid,
        ...columnsGrid,
        ...diagonalsBLTRGrid,
        ...diagonalsBRTLGrid,
    ];

    const diagonalsBLTR = diagonalsBLTRGrid[2].map((item) => Object.values(item)[0])
            .join("");
            console.log("diagonalsBLTRGrid", diagonalsBLTR);

    const diagonalsBRTL = diagonalsBLTRGrid[2].map((item) => Object.values(item)[0])
        .join("");
    console.log("diagonalsBRTL", diagonalsBRTL);

    let line = 0;
    for(line; line < lines.length; line++) {
        const tokens = lines[line].map((item) => Object.values(item)[0])
            .join("");
        if (tokens.includes("PPPP")) {
            setEndgameMessage("Player wins!");
            return;
        }
        if (tokens.includes("AAAA")) {
            setEndgameMessage("AI wins!");
            return;
        }
    }
    return;
}
