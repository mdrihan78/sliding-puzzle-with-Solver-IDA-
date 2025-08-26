// Custom Position Modal Logic

window.customPositionLogic = (() => {
  const customPositionBtn = document.getElementById('customPositionBtn');
  const customPositionModal = document.getElementById('custom-position-modal');
  const tileValueSelect = document.getElementById('tile-value');
  const tileRowSelect = document.getElementById('tile-row');
  const tileColSelect = document.getElementById('tile-col');
  const applyCustomPositionBtn = document.getElementById('applyCustomPositionBtn');
  const closeCustomPositionBtn = document.getElementById('closeCustomPositionBtn');
  function fillSelectors(size, tiles) {
    // Tile numbers: 0 for empty, then 1..n
    tileValueSelect.innerHTML = '';
    const n = size*size-1;
    for (let t = 0; t <= n; ++t) {
      const opt = document.createElement('option');
      opt.value = t;
      opt.text = (t === 0 ? '0 (empty)' : t);
      tileValueSelect.appendChild(opt);
    }
    tileRowSelect.innerHTML = '';
    tileColSelect.innerHTML = '';
    for(let i=1;i<=size;i++){
      const optR = document.createElement('option');
      optR.value = i-1;
      optR.text = i;
      tileRowSelect.appendChild(optR);
      const optC = document.createElement('option');
      optC.value = i-1;
      optC.text = i;
      tileColSelect.appendChild(optC);
    }
    tileValueSelect.selectedIndex = 1;
    tileRowSelect.selectedIndex = 0;
    tileColSelect.selectedIndex = 0;
  }
  function openModal() {
    const size = window.puzzleGame.getGridSize();
    const tiles = window.puzzleGame.getTiles();
    fillSelectors(size, tiles);
    customPositionModal.style.display = 'flex';
  }
  function closeModal() {
    customPositionModal.style.display = 'none';
  }
  customPositionBtn.addEventListener('click', openModal);
  closeCustomPositionBtn.addEventListener('click', closeModal);
  customPositionModal.addEventListener('mousedown', function(e){
    if(e.target===customPositionModal) closeModal();
  });
  applyCustomPositionBtn.addEventListener('click', ()=>{
    const tileNum = +tileValueSelect.value;
    const row = +tileRowSelect.value, col = +tileColSelect.value;
    const size = window.puzzleGame.getGridSize();
    const idx = row*size+col;
    let tiles = window.puzzleGame.getTiles().slice();
    if(tileNum===0) {
      // Only one empty allowed
      let prevIdx = tiles.indexOf(null);
      if(prevIdx!==-1 && prevIdx!==idx) tiles[prevIdx]=tiles[idx];
      tiles[idx]=null;
    } else {
      // Remove previous occurrence of tileNum
      let prevIdx = tiles.indexOf(tileNum);
      if(prevIdx!==-1 && prevIdx!==idx) tiles[prevIdx]=tiles[idx];
      tiles[idx]=tileNum;
      // Remove duplicate empties
      let nulls = tiles.reduce((a,x,i)=>x===null?[...a,i]:a,[]);
      if(nulls.length>1) {
        for(let i=1;i<nulls.length;i++) tiles[nulls[i]]=i;
      }
    }
    window.puzzleGame.setState(tiles);
    closeModal();
  });
})();
