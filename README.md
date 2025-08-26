# Sliding Puzzle Game (IDA* Hybrid Solver, Customization, and More!)

Welcome! This is a feature-rich, open-source sliding puzzle game supporting 3x3, 4x4, and 5x5 boards, a powerful hybrid IDA* solver, custom board configuration, and a modern UI.  
**Our vision:** Build the most advanced open-source sliding puzzle solver, with your help!

---

## 🎮 Features

- **Modern, responsive UI** – Built with Tailwind CSS and custom styles.
- **3x3 (Easy), 4x4 (Normal), 5x5 (Hard) modes** – Switch instantly.
- **Animated tiles** – Sleek transitions and hover effects.
- **Hybrid Puzzle Solver** –  
  - **3x3:** Classic IDA* (Iterative Deepening A*) algorithm.
  - **4x4:** Two-stage hybrid:
    - Stage 1: Places first 6 tiles efficiently (IDA* + BFS fallback if needed).
    - Stage 2: Solves the remaining tiles using IDA*.
  - **5x5:** Two-stage hybrid:
    - Stage 1: Places first 12 tiles (top rows and start of third row).
    - Stage 2: Solves the rest using IDA*.
- **Solver runs in Web Worker** – UI always stays responsive.
- **Progress bar** – See live completion percentage (custom computation for each mode).
- **Bot thinking animation** – Animated status while solving.
- **Set Custom Position** –  
  - Instantly place any number (or empty tile) at any cell.
  - Intuitive modal: select tile, row, and column from dropdowns (no manual typing).
  - Ensures only one empty space; prevents duplicates.
  - **Note:** Use `0` for empty.
- **Timer + Shuffle** –  
  - 10-second visible timer below the board.
  - When timer ends, a Shuffle button appears to reshuffle the board and restart timer.
- **Keyboard Shortcuts** –  
  - Press **B** to start the solver.
  - Press **ESC** to stop/cancel the solver.
- **Modal dialog** – Celebrates your win!
- **Footer instructions** – Clear troubleshooting and credits.

---

## 🧩 How 4x4 and 5x5 Solving Works

- **4×4:**  
  - **Stage 1:** Lock tiles 1–6 (by value, left-right, top-down) using IDA* search.  
    - If IDA* gets stuck, falls back to BFS to place the stuck tile.
  - **Stage 2:** Uses IDA* to solve the remaining tiles.
- **5×5:**  
  - **Stage 1:** Lock tiles 1–12 (first two rows and first two of the third row).
  - **Stage 2:** Uses IDA* on what's left.

This hybrid approach makes the solver much faster and more robust for larger boards.

---

## 📂 File Structure & Purpose

| Path                       | Description                                      |
|----------------------------|--------------------------------------------------|
| `public/index.html`        | Main entry, loads all assets and scripts         |
| `src/css/style.css`        | All CSS styles, layout, and component design     |
| `src/js/game.js`           | Game state, tile moves, rendering                |
| `src/js/solver.js`         | Solver worker, hybrid algorithms                 |
| `src/js/customPosition.js` | Custom position modal and logic                  |
| `src/js/timer.js`          | Timer and shuffle functionality                  |
| `src/js/ui.js`             | UI event listeners, mode switches, modal control |
| `README.md`                | Game info, features, usage, structure            |
| `CONTRIBUTING.md`          | Contribution guidelines                          |

---

## 🚀 Setup & Usage

1. **Clone the repository:**
    
2. **Open  in your browser.**
3. **Start playing!**  
   - Switch modes, shuffle, set custom positions, or let the bot solve.

*No build tools or server required — just open and play!*

---

## 🤝 Contributing

We welcome all contributions!  
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📢 Call for Contributors

We are looking for passionate contributors to:
- Optimize and enhance solver algorithms (IDA*, BFS, parallelization)
- Add new puzzle sizes, modes, or solver visualizations
- Improve accessibility, UI/UX, and animations
- Add tests and documentation
- Address bugs and suggest new features

**Let’s make this the most advanced open-source sliding puzzle solver together!**

---

## 📄 License

MIT License

Copyright (c) 2025 Rafsan1711

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
