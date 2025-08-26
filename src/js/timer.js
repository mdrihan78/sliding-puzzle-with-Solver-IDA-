// Timer and Shuffle Logic

window.timerLogic = (() => {
  const timerWrap = document.getElementById('timer-wrap');
  const timerValue = document.getElementById('timer-value');
  const shuffleBtn = document.getElementById('shuffleBtn');
  let timer = null, timerCount = 10;

  function resetTimer() {
    stopTimer();
    timerCount = 10;
    timerValue.textContent = timerCount;
    shuffleBtn.style.display = 'none';
    timerWrap.style.color = '#b5bcc6';
    timer = setInterval(()=>{
      timerCount--;
      timerValue.textContent = timerCount;
      if(timerCount<=0) {
        stopTimer();
        timerWrap.style.color = '#fa4664';
        shuffleBtn.style.display = '';
      }
    }, 1000);
  }
  function stopTimer() {
    if(timer!==null) { clearInterval(timer); timer=null; }
  }
  shuffleBtn.addEventListener('click', ()=>{
    const puzzleGame = window.puzzleGame;
    puzzleGame.shuffleTiles(puzzleGame.getTiles(), puzzleGame.getGridSize());
    puzzleGame.renderGrid();
    resetTimer();
  });

  // Expose API
  return {
    resetTimer,
    stopTimer
  };
})();
