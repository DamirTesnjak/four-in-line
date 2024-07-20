/* eslint-disable no-throw-literal */
export function checkGridForWinner(args) {
    const {
        rowsGrid,
        columnsGrid,
        diagonalsBLTRGrid,
        diagonalsBRTLGrid,
        stopGame,
    } = args;
    const lines = [
        ...rowsGrid,
        ...columnsGrid,
        ...diagonalsBLTRGrid,
        ...diagonalsBRTLGrid,
    ];

    let line = 0;
    for(line; line < lines.length; line++) {
        const tokens = lines[line].map((item) => Object.values(item)[0])
            .join("");
        if (tokens.includes("PPPP")) {
            stopGame(true);
            throw "Player wins!";
        }
        if (tokens.includes("AAAA")) {
            stopGame(true);
            throw "AI wins!"
        }
    }
    return "There is no winner!";
}
