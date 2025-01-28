

// Создадим места, куда может упасть пазл

var puzzleGrid = document.querySelector(".puzzle-container");
var baseGridPuzzle = document.querySelector(".puzzle-grid-item");

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 6; j++) {
    let newGridPuzzle = baseGridPuzzle.cloneNode(true);
    puzzleGrid.appendChild(newGridPuzzle);
  }
}
baseGridPuzzle.style.display = "None";

// Создадим части пазла

var basePuzzleItem = document.querySelector(".puzzle-item");
var leftContainer = document.querySelector(".left-container");

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 6; j++) {
    let newPuzzleItem = basePuzzleItem.cloneNode(true);
    
    newPuzzleItem.style.backgroundPosition = `${i*50}px ${j*50}px`;
    newPuzzleItem.style.left = `${Math.floor(Math.random()*450)}px`;
    newPuzzleItem.style.top = `${Math.floor(300+Math.random()*300)}px`;
    
    dragElement(newPuzzleItem);
    
    leftContainer.appendChild(newPuzzleItem);
  }
}

basePuzzleItem.style.display = "None";

// Зададим функция для передвижения частей

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement(e) {
    document.onmouseup = null;
    document.onmousemove = null;
    let gridItems = document.querySelectorAll(".puzzle-grid-item");
    gridItems.forEach((gridItem) => {
      let boundingBox = gridItem.getBoundingClientRect();
      let leftPadding = leftContainer.getBoundingClientRect();
      if (boundingBox.top <= e.clientY && boundingBox.left <= e.clientX && boundingBox.right >= e.clientX && boundingBox.bottom >= e.clientY) {
        elmnt.style.top = boundingBox.top + "px";
        elmnt.style.left = (boundingBox.left - leftPadding.left) + "px";
      }
    });
  }
}