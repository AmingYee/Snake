"use strict";

window.addEventListener("load", start);

// ******** CONTROLLER ********
function start() {
    console.log(`Javascript kører`);

    document.addEventListener("keydown", keypress);
    spawnGoal()
    // start ticking
    tick();
}

function spawnGoal() {

    let goalRow = Math.floor(Math.random() * 10);
    let goalCol = Math.floor(Math.random() * 10);

    while (readFromCell(goalRow, goalCol) === 1) {
        goalRow = Math.floor(Math.random() * 10);
        goalCol = Math.floor(Math.random() * 10);
    }

    writeToCell(goalRow, goalCol, 2);
}
function keypress(event){
    switch (event.key) {
        case "ArrowUp":
            if (!controls.down) {
                controls.up = true;
                controls.down = false;
                controls.left = false;
                controls.right = false;
            }
            break;
        case "ArrowDown":
            if (!controls.up) {
                controls.down = true;
                controls.up = false;
                controls.left = false;
                controls.right = false;
            }
            break;
        case "ArrowLeft":
            if (!controls.right) {
                controls.left = true;
                controls.right = false;
                controls.up = false;
                controls.down = false;
            }
            break;
        case "ArrowRight":
            if (!controls.left) {
                controls.right = true;
                controls.left = false;
                controls.up = false;
                controls.down = false;
            }
            break;
    }
}

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}

function tick() {
    // setup next tick
    let direction = "right"
    setTimeout(tick, 500);

    for (const part of queue) {
        writeToCell(part.row, part.col, 0);
    }

    if (controls.right) {
        direction = "right"
    } else if (controls.left) {
        direction = "left"
    } else if (controls.up) {
        direction = "up"
    } else if (controls.down) {
        direction = "down"
    }

    switch (direction) {
        case "left":
            head.col--;
            if (head.col < 0) {
                head.col = 9;
            }
            break;
        case "right":
            head.col++;
            if (head.col > 9) {
                head.col = 0;
            }
            break;
        case "up":
            head.row--;
            if (head.row < 0) {
                head.row = 9;
            }
            break;
        case "down":
            head.row++;
            if (head.row > 9) {
                head.row = 0;
            }
            break;
    }

    for (let i = 0; i < queue.length; i++) {
        if (i === queue.length - 1) continue;

        if (head.row === queue[i].row && head.col === queue[i].col) {
            gameOver();
            return;
        }
    }

    queue.push({ row: head.row, col: head.col });

    if (readFromCell(head.row, head.col) === 2) {
        spawnGoal();
        writeToCell(head.row, head.col, 0);
    } else {
        const tail = queue.shift();
        writeToCell(tail.row, tail.col, 0);
    }

    for (const part of queue) {
        writeToCell(part.row, part.col, 1);
    }


    displayBoard();
}

function gameOver() {
    alert("Game Over!");
    location.reload();
}

// ******** MODEL ********
/*
const player = {
  row:5,
  col:5
}
*/
const queue = [
    {
        row:5,
        col:5
    },
    {
        row:5,
        col:6
    },
    {
        row:5,
        col:7
    }
]

const head = {
    row: queue[queue.length - 1].row,
    col: queue[queue.length - 1].col
};

const model = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function writeToCell(row, col, value) {
    model[row][col] = value;
}

function readFromCell(row, col) {
    return model[row][col];
}



// ******** VIEW ********

function displayBoard() {
    const cells = document.querySelectorAll("#grid .cell");
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const index = row * 10 + col;

            switch (readFromCell(row, col)) {
                case 0:
                    cells[index].classList.remove("player", "goal");
                    break;
                case 1: // Note: doesn't remove goal if previously set
                    cells[index].classList.add("player");
                    break;
                case 2: // Note: doesn't remove player if previously set
                    cells[index].classList.add("goal");
                    break;
            }
        }
    }
}
