# Tic-tac-toe pseudocode

## Board positions

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

## Gameboard — store and protect the board data

```text
CREATE one Gameboard module by immediately running its outer function
  CREATE a private array containing nine empty strings

  DEFINE getBoard
    RETURN a copy of the board array

  DEFINE reset
    REPLACE the board array with nine empty strings

  DEFINE placeMark(position, mark)
    IF position is not an integer, is outside 0–8,
       the square is occupied, OR mark is not X or O
      RETURN false

    STORE mark in the board array at position
    RETURN true

  EXPOSE getBoard, reset, and placeMark
```

## Player factory — create each player

```text
DEFINE createPlayer(name, mark)
  CREATE an object containing name and mark
  FREEZE the object so its properties cannot be changed
  RETURN the object
```

## Game — manage the rules and turns

```text
CREATE one Game module by immediately running its outer function
  STORE all eight winning combinations
    Three rows, three columns, and two diagonals
  CREATE two default players: Player one as X, Player two as O
  SET current player index to 0
  SET phase to ready
  SET winning line to an empty array

  DEFINE getState
    RETURN an object containing
      A copy of the board from Gameboard
      A copy of the players array
      The current player object
      The current phase
      A copy of the winning line array

  DEFINE start(first name, second name)
    REMOVE surrounding spaces from each name
    USE default names if the trimmed names are empty
    CREATE new player objects with those names and marks X and O
    ASK Gameboard to reset
    SET current player index to 0 so X starts
    SET phase to playing
    CLEAR the winning line
    RETURN the current state

  DEFINE play(position)
    IF phase is not playing
      RETURN false without attempting a placement

    ASK Gameboard to place the current player's mark at position
    IF placement fails
      RETURN false

    READ the updated board
    FIND the first winning combination whose three positions
      all contain the current player's mark
    STORE that combination, or an empty array if none matches

    IF a winning line exists
      SET phase to won
      KEEP the current player as the winner
    ELSE IF every board position contains a mark
      SET phase to tied
    ELSE
      SWITCH current player index between 0 and 1

    RETURN the current state object

  EXPOSE start, play, and getState
```

## DisplayController — connect game data to the HTML

```text
CREATE one DisplayController module by immediately running its outer function

  DEFINE initialize
    FIND the HTML board, form, name inputs, status, note, and start button

    FOR each position from 0 through 8
      CREATE a regular button that does not submit the form
      GIVE it the CSS class cell
      REGISTER a click callback that remembers this position
        CALL Game.play with this position
        IF it returns a state object rather than false
          CALL render
      APPEND the button to the HTML board
      KEEP its reference in the buttons array

    DEFINE render
      READ the current state from Game
      CHECK whether the phase is playing

      FOR each HTML button and its position
        READ the mark at that position in the state board
        DISPLAY the mark as the button's text
        SET its data-mark attribute so CSS can style the mark
        DISABLE it if the game is not playing OR the square is occupied
        ADD the winner class if its position belongs to the winning line
          OTHERWISE remove that class
        SET a screen-reader label describing its row, column, and contents

      FOR each player card
        ADD the active class only if the game is playing
          AND that player has the current turn
        OTHERWISE remove the active class

      IF phase is not ready
        IF phase is won
          SHOW the winner's name
        ELSE IF phase is tied
          SHOW the tie message
        ELSE
          SHOW whose turn it is

        IF playing
          SHOW instructions for placing the current player's mark
        ELSE
          SHOW an invitation to play again

        CHANGE the start button text to Restart game

      DISABLE name inputs while playing
      ENABLE name inputs before play and after the round ends

    REGISTER a form submission callback
      PREVENT the browser's default form navigation or reload
      CALL Game.start with the values from both name inputs
      CALL render
      MOVE keyboard focus to the first board button

    CALL render once to display the initial ready state

  EXPOSE initialize
```

## Application startup

```text
IF a browser document exists
  CALL DisplayController.initialize
```

The outer IIFEs run immediately to create the modules. Methods such as
`start`, `play`, and `initialize` run only when called. Event callbacks run
when their registered events happen.

## Follow one move

```text
PLAYER clicks the center button
  → Its callback calls Game.play(4)
  → Game asks Gameboard.placeMark(4, current player's mark)
  → Gameboard stores X or O in its private array at index 4
  → Game checks for a win or tie and switches turns if play continues
  → Game returns a state object (truthy), not the boolean true
  → The click callback calls render
  → render reads the state and updates the HTML buttons and messages
```

The Gameboard array stores strings. The DisplayController buttons array stores
HTML elements. They are separate arrays connected by matching positions.
The board is stored in memory; reloading the page clears the game.
