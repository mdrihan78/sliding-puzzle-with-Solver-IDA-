// Main UI event listeners: mode, start, modal, solver, keyboard, resize

(function(){
  const puzzleGame = window.puzzleGame;
  const solverLogic = window.solverLogic;
  const homeScreen = document.getElementById('homeScreen');
  const gameContainer = document.getElementById('gameContainer');
  const gridEl = document.getElementById('grid');
  const startBtn = document.getElementById('startBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModal = document.getElementById('closeModal');
  const solveBtn = document.getElementById('solveBtn');
  const controls = document.getElementById('controls');
  // Mode Switch
  document.querySelectorAll('[data-mode]').forEach(el=>{
    el.addEventListener('click', ()=>{
      puzzleGame.setMode(el.dataset.mode);
    });
  });
  // Start Button
  startBtn.addEventListener('click', ()=>{
    homeScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    puzzleGame.createGrid(puzzleGame.modes[puzzleGame.getState().currentMode||'easy'].size);
  });
  // Modal
  closeModal.addEventListener('click', ()=>{ modalOverlay.style.display = 'none'; });
  // Tile Click
  gridEl.addEventListener('click', e=>{
    const tile = e.target.closest('.tile');
    if(!tile) return;
    if(puzzleGame.tryMove(tile) && puzzleGame.isSolved(puzzleGame.getTiles())){
      modalOverlay.style.display = 'flex';
      puzzleGame.updateProgressBar();
    }
  });
  // Resize
  window.addEventListener('resize', ()=>{
    puzzleGame.renderGrid();
  });
  // Solver logic
  solveBtn.addEventListener('click', function(){
    if(solverLogic.isRunning()) return;
    solveBtn.disabled = true;
    gridEl.style.pointerEvents = 'none';
    solverLogic.startSolver(
      function solved(){
        solveBtn.disabled = false;
        gridEl.style.pointerEvents = '';
        if(puzzleGame.isSolved(puzzleGame.getTiles())) modalOverlay.style.display = 'flex';
        puzzleGame.updateProgressBar();
      },
      function fail(data){
        solveBtn.disabled = false;
        gridEl.style.pointerEvents = '';
        let msg = 'Solver failed or timed out.';
        if(data && data.method){
          if(data.method.startsWith('4x4_stage1_fail')) msg="4x4 puzzle: got stuck in stage 1!";
          else if(data.method.startsWith('4x4_stage2_fail')) msg="4x4 puzzle: got stuck in the final stage!";
          else if(data.method.startsWith('5x5_stage1_fail')) msg="5x5 puzzle: got stuck in the first 12-tile stage!";
          else if(data.method.startsWith('5x5_stage2_fail')) msg="5x5 puzzle: got stuck in the final stage!";
          else msg = 'Solver could not finish (method: '+data.method+').';
        }
        alert(msg);
      },
      puzzleGame.getTiles,
      puzzleGame.getGridSize,
      puzzleGame.isSolved,
      puzzleGame.tryMove
    );
  });
  window.addEventListener('keydown', (e)=>{
    if((e.key === 'b' || e.key === 'B') && !gameContainer.classList.contains('hidden')) solveBtn.click();
    if(e.key === 'Escape' && solverLogic.isRunning()) solverLogic.stopSolverNow();
  });
  window.addEventListener('beforeunload', ()=>{ solverLogic.stopSolverNow(); });
})();
