# Tic Tac Together

A two-player tic-tac-toe game built with HTML, CSS, and plain JavaScript. Open `index.html` in a browser, enter names (optional), and select **Start game**. Players alternate turns; **Restart game** resets the board. Names can be changed between rounds.

## Organization

- `Gameboard`: a module that stores the board array and validates placements.
- `createPlayer`: a factory for immutable player objects.
- `Game`: a module that controls turns, all eight winning lines, ties, and resets.
- `DisplayController`: a module that renders state and handles DOM events.

The modules use closures to keep their state private. Game rules have no DOM dependency, so you can play through the browser console:

```js
Game.start('Ada', 'Lin');
Game.play(0); // X at top left; positions run from 0 to 8
Game.play(4); // O at center
Game.getState();
```

Console calls do not render the UI; reload the page before returning to interactive play. No build tools or installation required. Google Fonts are optional; system fonts provide fallbacks.
