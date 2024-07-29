# Four in line game

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Before running the , in your terminar ran `npm install`, after the process is finished run `npm start`. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Some notes to consider
Game is designed in a way that when is fake "AI" turn, the "AI" scans the whole game grid for a possible human player win in next round. If it founds it, "AI" puts in a proper column its yellow token, trying to prevent human player to win a game. The player's tokens are colored red.
<br><br>
After the game finishes please refresh the page for a new game. Have a fun playing the game.
<br><br>
The game is pure frontend app, written with React library.