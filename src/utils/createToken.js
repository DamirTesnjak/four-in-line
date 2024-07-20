export function createToken(row, column, player) {
    const newTokenContainer = document.createElement("div");
    newTokenContainer.id = `playerTokenContainer${row}Column${column}`;
    newTokenContainer.style.position = "absolute";
    newTokenContainer.style.width = "100px";                   /* the div size */
    newTokenContainer.style.height = "100px";
    newTokenContainer.style.top = `${23}px`;
    newTokenContainer.style.left = `${column * 100}px`;                  /* the div size */
    newTokenContainer.style.overflow = "hidden";
    newTokenContainer.style.zIndex = 0;

    const gameDisplayContainer = document.getElementById("gameDisplayContainer");
    gameDisplayContainer.appendChild(newTokenContainer);

    // create player or AI token
    const newToken = document.createElement("div");
    newToken.id = `playerTokenRow${row}Column${column}`;
    newToken.style.width = '80px';
    newToken.style.height = '80px';
    newToken.style.backgroundColor = player ? "red" : "yellow";
    newToken.style.borderRadius = '50%';
    newToken.style.border = "50px solid white";
    newToken.style.margin = "-40px";
    newToken.style.zIndex = 0;

    const playerTokenContainer = document.getElementById(`playerTokenContainer${row}Column${column}`);
    playerTokenContainer.appendChild(newToken);

    setTimeout(() => {
        newTokenContainer.style.visibility = "visible";
        newTokenContainer.style.top = `${(6 - row) * 100 + 23}px`;
        newTokenContainer.style.left = `${column * 100}px`;
    }, 1000);

}