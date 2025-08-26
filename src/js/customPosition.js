// Handles the custom position modal and tile assignment

const customPositionBtn = document.getElementById('customPositionBtn');
const customPositionModal = document.getElementById('custom-position-modal');
const tileValueSelect = document.getElementById('tile-value');
const tileRowSelect = document.getElementById('tile-row');
const tileColSelect = document.getElementById('tile-col');
const applyCustomPositionBtn = document.getElementById('applyCustomPositionBtn');
const closeCustomPositionBtn = document.getElementById('closeCustomPositionBtn');

function fillSelectors(size, tiles) {
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
  const idx = row*size+col;
  let newTiles = tiles.slice();
  if(tileNum===0) {
    let prevIdx = newTiles.indexOf(null);
    if(prevIdx!==-1 && prevIdx!==idx) newTiles[prevIdx]=newTiles[idx];
    newTiles[idx]=null;
  } else {
    let prevIdx = newTiles.indexOf(tileNum);
    if(prevIdx!==-1 && prevIdx!==idx) newTiles[prevIdx]=newTiles[idx];
    newTiles[idx]=tileNum;
    let nulls = newTiles.reduce((a,x,i)=>x===null?[...a,i]:a,[]);
    if(nulls.length>1) {
      for(let i=1;i<nulls.length;i++) newTiles[nulls[i]]=i;
    }
  }
  let nums = newTiles.filter(x=>x!==null);
  let uniq = new Set(nums);
  if(nums.length !== uniq.size){
    alert('Duplicate tile numbers are not allowed!');
    return;
  }
  if(newTiles.filter(x=>x===null).length!==1){
    alert('Exactly one empty tile must be present!');
    return;
  }
  tiles = newTiles.slice();
  emptyIndex = tiles.indexOf(null);
  gridEl.innerHTML = '';
  for(let i=0; i<tiles.length; i++){
    const num = tiles[i];
    if(num===null) continue;
    const tile = document.createElement('div');
    tile.className = 'tile';
    if(currentMode==='hard') tile.classList.add('hard');
    tile.textContent = num;
    const {x,y} = getTranslate(i);
    tile.style.transform = `translate(${x}px,${y}px)`;
    tile.dataset.number = num;
    tile.dataset.position = i;
    gridEl.appendChild(tile);
  }
  updateProgressBar();
  closeModal();
});
