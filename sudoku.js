var numSelected = null;
var tileSelected = null;
var playButton = true;
var errors = 0;
var sec = 0;
var min = 0;
var completionStatus = {};
var percentageDone = 0;
var percentageShown = '0%';

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
]

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

window.onload = function() {
    timer();
    setGame();
    play();
}

function setGame() {
    for (let i = 1; i <= 9; i++){
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber)
        number.classList.add("number");
        document.getElementById("digits").appendChild(number)
    }

    for (let r = 0; r < 9; r++){
        for (let c = 0; c < 9; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-"){
                populateTracker(board[r][c]);
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
                tile.classList.add("noClick");
            }
            if (r == 2 || r == 5){
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5){
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber() {
    if (numSelected != null){
         numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        // if(this.innerText != ""){
        //     return;
        // }
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id){
            this.innerText = numSelected.id;
            this.classList.remove("number-incorrect");
            this.classList.add("noClick");
            updateTracker(solution[r][c]);
        }
        else{
            errors += 1;
            document.getElementById("errors").innerText = "Errors: " + errors;
            this.innerText = numSelected.id;
            this.classList.add("number-incorrect");
        }
    }
}


function timer(){
    var timer = setInterval(function(){
        if(playButton){
            sec++;
        }
        if (sec < 10) {
            if (min < 10) {
                document.getElementById('clock').innerHTML="0" + min + ":0" +sec;
            }
            else{
                document.getElementById('clock').innerHTML=min + ":0" +sec;
            }
        }
        else if (sec < 60){
            if (min < 10) {
                document.getElementById('clock').innerHTML="0" + min + ":" +sec;
            }
            else{
                document.getElementById('clock').innerHTML=min + ":" +sec;
            }
        }
        else{
            sec = 0;
            min++;
            if (min >= 60){
                clearInterval(timer);
            }
            else if (min < 10) {
                document.getElementById('clock').innerHTML="0" + min + ":0" +sec;
            }
            else{
                document.getElementById('clock').innerHTML=min + ":0" +sec;
            }
        }
    }, 1000);
}

function button(x){
    togglePlay(x);
    play();
}

function togglePlay(x){
    x.classList.toggle("fa-pause");
}

function play() {
    if (playButton){
        playButton = false;
    }
    else{
        playButton = true;
    }
}

function reset() {
    sec = 0;
    min = 0;
    document.getElementById('clock').innerHTML="0" + min + ":0" +sec;

    errors = 0;
    document.getElementById("errors").innerText = "Errors: " + errors;

}



function populateTracker(value) {
    if(value in completionStatus){
        completionStatus[value]++;
    }  
    else{
        completionStatus[value]=1;
    }
}

function updateTracker(value){
    // When a tile is completed and is correct then get that number and update the tracker
    // If that value is 9, then call dullNumber to hide it and make it unclickable
    // I also want to be able to track the overall completion status of the game
    if(value in completionStatus){
        completionStatus[value]++;
    }  
    else{
        completionStatus[value]=1;
    }

    const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);
    let sum = sumValues(completionStatus);
    percentageDone = sum/81;
    percentageShown =(sum/81).toFixed(2) + '%';
    console.log("sum: " + sum);
    console.log("percent: " + percentageDone);
    console.log("percent: " + percentageShown);
}

function dullNumber(){
    // All this will do is take a specific digit from the row and update the css
    // so that it can no longer be clicked on and its visibly complete

}