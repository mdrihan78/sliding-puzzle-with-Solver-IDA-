// Solver logic: Uses Python Backend API for Sliding Puzzle

const API_URL = "https://sliding-puzzle-with-solver-ida-1.onrender.com/solve-puzzle";

let solverRunning = false;
let queuedMoves = [];

function startSolver(onSolved, onFail, getTiles, getSize, isSolved, tryMove) {
  if (solverRunning) return;
  solverRunning = true;
  const snapshot = getTiles().slice();
  const size = getSize();

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board: snapshot, size })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.solution || !Array.isArray(data.solution) || data.solution.length === 0) {
        solverRunning = false;
        if (typeof onFail === 'function') onFail({ method: "backend_fail", ...data });
        return;
      }
      applyMovesSequence(data.solution, onSolved, getTiles, isSolved, tryMove);
    })
    .catch(e => {
      solverRunning = false;
      if (typeof onFail === 'function') onFail({ method: "network_error", error: e.message });
    });
}

function stopSolverNow() {
  solverRunning = false;
  queuedMoves = [];
}

function applyMovesSequence(moves, onSolved, getTiles, isSolved, tryMove) {
  let i = 0;
  queuedMoves = moves;
  const delay = 340;
  function step() {
    if (i >= moves.length) {
      stopSolverNow();
      if (isSolved(getTiles())) if (typeof onSolved === 'function') onSolved();
      return;
    }
    const val = moves[i];
    const tile = [...gridEl.children].find(t => +t.dataset.number === val);
    if (tile) tryMove(tile);
    i++;
    updateProgressBar();
    setTimeout(step, delay);
  }
  setTimeout(step, 200);
}
function isRunning() { return solverRunning; }
window.solverLogic = {
  startSolver,
  stopSolverNow,
  isRunning
};
