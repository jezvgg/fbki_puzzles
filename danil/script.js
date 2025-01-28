const imageUrl = 'image.jpg'; 
const puzzleWidth = 450;
const puzzleHeight = 300;
const pieceWidth = 50;
const pieceHeight = 50;
const cols = 9;
const rows = 6;

let pieces = [];
let targets = [];


document.getElementById('hintImage').src = imageUrl;

function createPuzzlePieces() {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {

                
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.style.backgroundImage = `url(${imageUrl})`;
                piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
                piece.dataset.row = row;
                piece.dataset.col = col;

                
                piece.draggable = true;
                piece.addEventListener('dragstart', dragStart);
                pieces.push(piece);

   
                
                const target = document.createElement('div');
                target.className = 'puzzle-target';
                target.style.left = (col * pieceWidth) + 'px';
                target.style.top = (row * pieceHeight) + 'px';
                target.dataset.row = row;
                target.dataset.col = col;
                target.addEventListener('dragover', dragOver);
                target.addEventListener('drop', drop);
                targets.push(target);
            }
        }

     
        
        pieces.sort(() => Math.random() - 0.5);

       
        
        pieces.forEach(piece => piecesContainer.appendChild(piece));
        targets.forEach(target => puzzleContainer.appendChild(target));
    };
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', 
        JSON.stringify({
            row: e.target.dataset.row,
            col: e.target.dataset.col
        })
    );
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const target = e.target.classList.contains('puzzle-target') ? e.target : e.target.parentElement;
    if (!target.classList.contains('puzzle-target')) return;

    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

 
    
    if (data.row === target.dataset.row && data.col === target.dataset.col) {
        const piece = document.querySelector(
            `.puzzle-piece[data-row="${data.row}"][data-col="${data.col}"]`
        );
        
     
        
        if (!target.hasChildNodes()) {
            piece.style.position = 'relative';
            piece.style.left = '0';
            piece.style.top = '0';
            target.appendChild(piece);
            
        
            
            checkCompletion();
        }
    }
}

function checkCompletion() {
    const placedPieces = document.querySelectorAll('.puzzle-container .puzzle-piece');
    if (placedPieces.length === rows * cols) {
        setTimeout(() => {
            alert('Поздравляем! Вы собрали пазл!');
        }, 100);
    }
}

const piecesContainer = document.getElementById('piecesContainer');
const puzzleContainer = document.getElementById('puzzleContainer');

createPuzzlePieces();