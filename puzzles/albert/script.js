document.addEventListener('DOMContentLoaded', () => {
    const puzzlePieces = document.getElementById('puzzle-pieces');
    const puzzleBoard = document.getElementById('puzzle-board');
    const pieces = [];
    const orderedPieces = [];
    const board = Array(54).fill(null);

    // Create puzzle pieces
    for (let i = 0; i < 54; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundPosition = `${-(i % 9) * 50}px ${-Math.floor(i / 9) * 50}px`;
        piece.dataset.index = i;
        piece.id = `piece-${i}`;
        pieces.push(piece);
        orderedPieces.push(piece.cloneNode(true));
        puzzlePieces.appendChild(piece);
    }

    // Shuffle pieces
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        puzzlePieces.appendChild(pieces[i]);
    }

    // Create puzzle board slots
    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.dataset.index = i;
        puzzleBoard.appendChild(slot);
    }

    // Add drag and drop functionality
    pieces.forEach(piece => {
        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);
    });

    document.querySelectorAll('.puzzle-slot').forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', drop);
    });

    puzzlePieces.addEventListener('dragover', dragOver);
    puzzlePieces.addEventListener('drop', dropBack);

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.dataTransfer.effectAllowed = 'move';
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function drop(e) {
        e.preventDefault();
        const piece = document.getElementById(e.dataTransfer.getData('text'));
        if (!piece) return;

        const slot = e.target.closest('.puzzle-slot');
        if (!slot) return;

        const slotIndex = parseInt(slot.dataset.index);

        // Remove the piece from its current location
        if (piece.parentElement) {
            piece.parentElement.removeChild(piece);
        }

        // Place the piece in the new slot
        slot.appendChild(piece);
        board[slotIndex] = piece;

        // Check if the piece is in the correct position
        if (parseInt(piece.dataset.index) === slotIndex) {
            piece.classList.add('correct');
        } else {
            piece.classList.remove('correct');
        }

        checkWin();
    }

    function dropBack(e) {
        e.preventDefault();
        const piece = document.getElementById(e.dataTransfer.getData('text'));
        if (!piece) return;

        // Remove the piece from its current location in the board
        if (piece.parentElement && piece.parentElement.classList.contains('puzzle-slot')) {
            const slotIndex = parseInt(piece.parentElement.dataset.index);
            board[slotIndex] = null;
        }

        // Move the piece back to the puzzle pieces container
        puzzlePieces.appendChild(piece);
        piece.classList.remove('correct');
    }

    function checkWin() {
        if (board.every((piece, index) => piece && parseInt(piece.dataset.index) === index)) {
            alert('Congratulations! You solved the puzzle!');
        }
    }

    // Add solve button functionality
    const solveButton = document.getElementById('solve-button');
    solveButton.addEventListener('click', solvePuzzle);

    function solvePuzzle() {
        // Clear the puzzle pieces container
        puzzlePieces.innerHTML = '';

        // Place each piece in its correct position on the board
        for (let i = 0; i < 54; i++) {
            const piece = orderedPieces[i].cloneNode(true);
            const slot = document.querySelector(`.puzzle-slot[data-index="${i}"]`);
            
            // Remove any existing piece from the slot
            if (slot.firstChild) {
                slot.removeChild(slot.firstChild);
            }

            // Place the piece in the correct slot
            slot.appendChild(piece);
            board[i] = piece;

            // Mark the piece as correct
            piece.classList.add('correct');

            // Add drag functionality to the new piece
            piece.draggable = true;
            piece.addEventListener('dragstart', dragStart);
        }

        // Check for win
        checkWin();
    }
});
