/**
 * A method of DOM manipulation to create a token to be displayed on screen.
 * 
 * @param {number} column - The index of item in array of columns.
 * @param {number} row - The index of item in array of rows.
 * @param {string} player - True - human player, false - AI player.
 */

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
    newTokenContainer.style.transform = 'translateY(0px)';
    newTokenContainer.style.transition = 'all .3s ease-in';

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
        newTokenContainer.style.left = `${column * 100}px`;
        newTokenContainer.style.transform = `translateY(${(6 - row) * 100}px)`;
        newTokenContainer.style.transition = 'all .3s ease-in';
    }, 1000);

}