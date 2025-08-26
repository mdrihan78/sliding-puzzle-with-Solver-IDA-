// Manages game state, grid, tile movements, and progress

window.modes = { easy:{size:3, path:'easy'}, normal:{size:4, path:'normal'}, hard:{size:5, path:'hard'} };
window.currentMode = 'easy';
window.size = 3;
window.tiles = [];
window.emptyIndex = 0;

const gridEl = document.getElementById('grid');
const controls = document.getElementById('controls');
const progressBarWrap = document.getElementById('progressBarWrap');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const toggleSlider = document.getElementById('toggleSlider');
const homeScreen = document.getElementById('homeScreen');
const gameContainer = document.getElementById('gameContainer');

function getTranslate(index) {
  const row = Math.floor(index/size), col = index%size;
  const tileSize = gridEl.clientWidth/size;
  return { x: col*tileSize, y: row*tileSize };
}

function shuffleTiles(arr, s) {
  do {
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
  } while(!isSolvable(arr,s)||isSolved(arr));
}

function isSolvable(arr,s){
  let inv=0, flat=arr.filter(x=>x!==null);
  for(let i=0;i<flat.length;i++)
    for(let j=i+1;j<flat.length;j++)
      if(flat[i]>flat[j]) inv++;
  if(s%2) return inv%2===0;
  const er = Math.floor(arr.indexOf(null)/s);
  return er%2?inv%2===0:inv%2!==0;
}

function isSolved(arr){
  for(let i=0;i<arr.length-1;i++) if(arr[i]!==i+1) return false;
  return arr[arr.length-1]===null;
}

function tryMove(tile){
  const tilePos = +tile.dataset.position;
  const emptyPos = emptyIndex;
  const r1 = Math.floor(tilePos/size), c1 = tilePos%size;
  const r2 = Math.floor(emptyPos/size), c2 = emptyPos%size;
  const adj = (r1===r2 && Math.abs(c1-c2)===1) || (c1===c2 && Math.abs(r1-r2)===1);
  if(!adj) return false;
  [tiles[tilePos],tiles[emptyPos]]=[tiles[emptyPos],tiles[tilePos]];
  const {x,y} = getTranslate(emptyPos);
  tile.style.transform = `translate(${x}px,${y}px)`;
  tile.dataset.position = emptyPos;
  emptyIndex = tilePos;
  updateProgressBar();
  return true;
}

function createGrid(gridSize){
  size = gridSize;
  gridEl.style.setProperty('--grid-size', size);
  gridEl.innerHTML = '';
  tiles = Array.from({length:size*size-1},(_,i)=>i+1);
  tiles.push(null);
  shuffleTiles(tiles,size);
  emptyIndex = tiles.indexOf(null);
  tiles.forEach((num,i)=>{
    if(num===null) return;
    const tile = document.createElement('div');
    tile.className = 'tile';
    if(currentMode==='hard') tile.classList.add('hard');
    tile.textContent = num;
    const {x,y} = getTranslate(i);
    tile.style.transform = `translate(${x}px,${y}px)`;
    tile.dataset.number = num;
    tile.dataset.position = i;
    gridEl.appendChild(tile);
  });
  controls.style.display = 'flex';
  progressBarWrap.style.display = 'block';
  updateProgressBar();
}

function renderGrid() {
  gridEl.innerHTML = '';
  for(let i=0;i<tiles.length;i++) {
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
  emptyIndex = tiles.indexOf(null);
  updateProgressBar();
}

function calcProgress(arr, sz){
  if(sz===3) {
    let cnt=0;
    for(let i=0;i<8;i++) if(arr[i]===i+1) cnt++;
    return Math.round(cnt/8*100);
  }
  if(sz===4) {
    let cnt=0;
    for(let i=0;i<15;i++) if(arr[i]===i+1) cnt++;
    return Math.round(cnt/15*100);
  }
  if(sz===5){
    let stage1=0, total=0;
    const st1idx=[0,1,2,3,4,5,6,7,8,9,10,11];
    for(const i of st1idx) if(arr[i]===i+1) stage1++;
    for(let i=0;i<24;i++) if(arr[i]===i+1) total++;
    return Math.round((stage1/12*70)+(total/24*30));
  }
  return 0;
}

function updateProgressBar(){
  if(!tiles||!size) return;
  const perc = calcProgress(tiles,size);
  progressBar.style.width = perc+"%";
  progressText.textContent = perc+"% solved";
  if(perc===100) progressText.textContent = "🎉 Puzzle Solved!";
}
