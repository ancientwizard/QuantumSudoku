var numSelected = null;
var tileSelected = null;

var errors = 0;

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
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
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
        if(this.innerText != ""){
            return;
        }
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id){
            this.innerText = numSelected.id;
        }
        else{
            errors += 1;
            document.getElementById("errors").innerText = "Errors: " + errors;
        }
    }
}

var playButton = true;

function timer(){
    var sec = 0;
    var min = 0;
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

function play() {
    playIcon = document.getElementById('play');
    pauseIcon = document.getElementById('pause');

    if (playButton){
        playButton = false;
        playIcon.classList.remove('button-clicked');
        pauseIcon.classList.remove('button-unclicked');
        playIcon.classList.add('button-unclicked');
        pauseIcon.classList.add('button-clicked');
    }
    else{
        playButton = true;
        playIcon.classList.remove('button-unclicked');
        pauseIcon.classList.remove('button-clicked');
        playIcon.classList.add('button-clicked');
        pauseIcon.classList.add('button-unclicked');
    }
    console.log(playButton);

    /*
    if (numSelected != null){
         numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
    */
}