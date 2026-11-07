const Gameboard = (() => {
  let cells = Array(9).fill("");
  const getBoard = () => [...cells];
  const reset = () => {
    cells = Array(9).fill("");
  };
  const placeMark = (index, mark) => {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index > 8 ||
      cells[index] ||
      !["X", "O"].includes(mark)
    )
      return false;
    cells[index] = mark;
    return true;
  };
  return { getBoard, reset, placeMark };
})();

const createPlayer = (name, mark) => Object.freeze({ name, mark });

const Game = (() => {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let players = [
    createPlayer("Player one", "X"),
    createPlayer("Player two", "O"),
  ];
  let turn = 0;
  let phase = "ready";
  let winningLine = [];
  const getState = () => ({
    board: Gameboard.getBoard(),
    players: [...players],
    currentPlayer: players[turn],
    phase,
    winningLine: [...winningLine],
  });
  const start = (firstName = "", secondName = "") => {
    players = [
      createPlayer(firstName.trim() || "Player one", "X"),
      createPlayer(secondName.trim() || "Player two", "O"),
    ];
    Gameboard.reset();
    turn = 0;
    phase = "playing";
    winningLine = [];
    return getState();
  };
  const play = (index) => {
    if (phase !== "playing" || !Gameboard.placeMark(index, players[turn].mark))
      return false;
    const board = Gameboard.getBoard();
    winningLine =
      winningLines.find((line) =>
        line.every((cell) => board[cell] === players[turn].mark),
      ) || [];
    if (winningLine.length) phase = "won";
    else if (board.every(Boolean)) phase = "tied";
    else turn = 1 - turn;
    return getState();
  };
  return { start, play, getState };
})();

const DisplayController = (() => {
  const initialize = () => {
    const board = document.querySelector("#board");
    const form = document.querySelector("#player-form");
    const firstInput = document.querySelector("#player-x");
    const secondInput = document.querySelector("#player-o");
    const status = document.querySelector("#status");
    const note = document.querySelector("#turn-note");
    const startButton = document.querySelector("#start-button");
    const cells = Array.from({ length: 9 }, (_, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.addEventListener("click", () => {
        if (Game.play(index)) render();
      });
      board.append(cell);
      return cell;
    });
    const render = () => {
      const state = Game.getState();
      const playing = state.phase === "playing";
      cells.forEach((cell, index) => {
        const mark = state.board[index];
        cell.textContent = mark;
        cell.dataset.mark = mark;
        cell.disabled = !playing || Boolean(mark);
        cell.classList.toggle("winner", state.winningLine.includes(index));
        cell.setAttribute(
          "aria-label",
          `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ${mark || "empty"}`,
        );
      });
      ["X", "O"].forEach((mark) =>
        document
          .querySelector(`#${mark.toLowerCase()}-card`)
          .classList.toggle(
            "active",
            playing && state.currentPlayer.mark === mark,
          ),
      );
      if (state.phase !== "ready") {
        status.textContent =
          state.phase === "won"
            ? `${state.currentPlayer.name} wins!`
            : state.phase === "tied"
              ? "A tie. Well played, both of you!"
              : `${state.currentPlayer.name}’s turn`;
        note.textContent = playing
          ? `Place an ${state.currentPlayer.mark} in an empty square`
          : "Another round? Update your names or play again.";
        startButton.firstChild.textContent = "Restart game ";
      }
      playing
        ? (firstInput.disabled = secondInput.disabled = true)
        : (firstInput.disabled = secondInput.disabled = false);
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      Game.start(firstInput.value, secondInput.value);
      render();
      cells[0].focus();
    });
    render();
  };
  return { initialize };
})();

if (typeof document !== "undefined") DisplayController.initialize(); // updated tic-tac-toe game to use module pattern and IIFE, added accessibility features, and improved code structure
