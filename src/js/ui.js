// Handles all UI event listeners and solver controls

(function(){
  const homeScreen = document.getElementById('homeScreen');
  const gameContainer = document.getElementById('gameContainer');
  const gridEl = document.getElementById('grid');
  const startBtn = document.getElementById('startBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModal = document.getElementById('closeModal');
  const solveBtn = document.getElementById('solveBtn');
  const controls = document.getElementById('controls');

  document.querySelectorAll('[data-mode]').forEach(el=>{
    el.addEventListener('click', ()=>{
      currentMode = el.dataset.mode;
      const idx = ['easy','normal','hard'].indexOf(currentMode);
      toggleSlider.style.left = `${idx*33.3333}%`;
    });
  });

  startBtn.addEventListener('click', ()=>{
    homeScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    createGrid(modes[currentMode].size);
  });

  closeModal.addEventListener('click', ()=>{ modalOverlay.style.display = 'none'; });

  gridEl.addEventListener('click', e=>{
    const tile = e.target.closest('.tile');
    if(!tile) return;
    if(tryMove(tile) && isSolved(tiles)){
      modalOverlay.style.display = 'flex';
      updateProgressBar();
    }
  });

  window.addEventListener('resize', ()=>{
    tiles.forEach(num=>{
      if(num===null) return;
      const tile = [...gridEl.children].find(t=>+t.dataset.number===num);
      if(!tile) return;
      const {x,y} = getTranslate(+tile.dataset.position);
      tile.style.transform = `translate(${x}px,${y}px)`;
    });
  });

  solveBtn.addEventListener('click', function(){
    if(solverLogic.isRunning()) return;
    solveBtn.disabled = true;
    gridEl.style.pointerEvents = 'none';
    solverLogic.startSolver(
      function solved(){
        solveBtn.disabled = false;
        gridEl.style.pointerEvents = '';
        if(isSolved(tiles)) modalOverlay.style.display = 'flex';
        updateProgressBar();
      },
      function fail(data){
        solveBtn.disabled = false;
        gridEl.style.pointerEvents = '';
        let msg = 'Solver failed or timed out.';
        if(data && data.method){
          if(data.method.startsWith('4x4_stage1_fail')) msg="৪×৪ puzzle: ১-৬ tile stage-এ আটকে গেছে!";
          else if(data.method.startsWith('4x4_stage2_fail')) msg="৪×৪ puzzle: শেষ stage-এ আটকে গেছে!";
          else if(data.method.startsWith('5x5_stage1_fail')) msg="৫×৫ puzzle: ১ম ১২টা tile stage-এ আটকে গেছে!";
          else if(data.method.startsWith('5x5_stage2_fail')) msg="৫×৫ puzzle: শেষ stage-এ আটকে গেছে!";
          else msg = 'Solver could not finish (method: '+data.method+').';
        }
        alert(msg);
      },
      ()=>tiles.slice(),
      ()=>size,
      isSolved,
      tryMove
    );
  });
  window.addEventListener('keydown', (e)=>{
    if((e.key === 'b' || e.key === 'B') && !gameContainer.classList.contains('hidden')) solveBtn.click();
    if(e.key === 'Escape' && solverLogic.isRunning()) solverLogic.stopSolverNow();
  });
  window.addEventListener('beforeunload', ()=>{ solverLogic.stopSolverNow(); });

  // Typing effect for bot thinking status
  (function(){
    const subTextEl = document.getElementById('thinking-subtext');
    const messages = [
  
      'Evaluating heuristics...',
      'Running IDA* algorithm...',
      'Performing Monte-Carlo simulations...',
      'Checking board states...',
      'Detecting chains and loops...',
      'Applying corner and edge heuristics...',
      'calculating...',
      'Generating probabilistic outcomes...',
      'Optimizing move selection...',
    
      'Updating strategy matrix...',
      'Preparing final move...',
      'Almost done...',
      'Move ready to execute!'
      
    ];
    let idx = 0;
    function typeEffect(text, element, delay=40) {
      return new Promise((resolve) => {
        element.textContent = '';
        let i = 0;
        function typeChar() {
          if(i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, delay);
          } else {
            setTimeout(resolve, 1100);
          }
        }
        typeChar();
      });
    }
    async function loopMessages() {
      while(true) {
        await typeEffect(messages[idx], subTextEl);
        idx = (idx + 1) % messages.length;
      }
    }
    loopMessages();
  })();
})();
