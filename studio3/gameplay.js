(function(){
    "use strict";
    console.log("running js");

    const playerName = sessionStorage.getItem("playerName");
    const selectedAvatar = sessionStorage.getItem("selectedAvatar");

    let gameOn = true;
    let playerWin = 0;

    let round = 1;

    // back button allows user to return to their page
    const back = document.getElementById("backbtn");
    back.addEventListener("click", function() {
        window.location.href = "index.html";
    })

    // same avatar array
    const avatarArray = [
        "images/moth.PNG",
        "images/fish-left.PNG",
        "images/lizard-left.PNG"
    ];

    // user scoreBoard array
    const avatarScoreArray = [
        "images/moth-opponent.png",
        "images/opponent-fish.png",
        "images/lizard-opponent.png"
    ];
    
    // enemy avatar array
    const enemyArray = [
        "images/moth.png",
        "images/fish-right.PNG",
        "images/lizard-right.PNG"
    ];

    // enemy scoreBoard array
    const enemyScoreArray = [
        "images/user-moth.png",
        "images/user-fish.png",
        "images/lizard-user.png"
    ];

    // array of possible cards user can choose from
    const cardArray = [
        "images/air.png",
        "images/fire.png",
        "images/water.png"
    ];
    
    // array of cards user selected/losing cards
    const selectedArray = [
        "images/lose-air.png",
        "images/lose-fire.png",
        "images/lose-water.png"
    ];

    // array for winning cards
    const winArray = [
        "images/air-win.png",
        "images/fire-win.png",
        "images/water-win.png"
    ];

    const selectedAvatarIndex = parseInt(selectedAvatar, 10);
    const user = document.getElementById("user");
    const userScore = document.getElementById("me");

    // load user avatar pick
    user.src = avatarArray[selectedAvatarIndex];
    userScore.src = avatarScoreArray[selectedAvatarIndex];

    // randomized opponent avatar
    const enemyIndex = Math.floor(Math.random() * 3);
    const opp = document.getElementById("opponent");
    const oppScoreBoard = document.getElementById("opp");

    opp.src = enemyArray[enemyIndex];
    oppScoreBoard.src = enemyScoreArray[enemyIndex];

    // load username
    const myName = document.getElementById("myname");
    myName.textContent = playerName;

    // load a random selection of cards
    let optionsArray = []
    const options = document.getElementsByClassName("option");

    for (let i = 0; i < options.length; i++) {
        optionsArray.push(options[i])
    };

    // initialize player and opp's picks
    let playerPick;
    let oppPick;

    // playable row const
    const playable = document.getElementsByClassName("player");

    // initialize index array
    let playableArray = [];

    let numberSelected = 0;

    let selectedIndex = [];

    function cardLoad() {
        // Remove any existing event listeners to avoid duplicates
        optionsArray.forEach(option => {
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
        });

        // Update optionsArray after replacing nodes
        const options = document.getElementsByClassName("option");
        optionsArray = Array.from(options);

        for (let i = 0; i < optionsArray.length; i++) {
            const cardIndex = Math.floor(Math.random() * 3);
            optionsArray[i].src = cardArray[cardIndex];

            optionsArray[i].addEventListener("click", function () {
                if (numberSelected >= 3) return; // Prevent selecting more than 3 cards

                // Find the clicked card's index
                const index = Array.from(options).indexOf(optionsArray[i]);

                if (!selectedIndex.includes(index)) {
                    selectedIndex.push(index);
                    numberSelected++;

                    // Replace clicked card with greyed out card
                    optionsArray[i].src = selectedArray[cardIndex];

                    // Push the card onto the playable deck
                    playableArray.push(cardArray[cardIndex]);
                    playable[numberSelected - 1].src = playableArray[numberSelected - 1];
                }
            });
        }
    }
    
    if (round === 1) {
        cardLoad();
    }

    const submit = document.getElementById("submit");

    // for when the player is ready to play
    submit.addEventListener("click", () => {
        if (numberSelected === 3) {
            oppMove();
        }
    });

    const oppChoice = document.getElementsByClassName("oppmove");

    let revealNum;
    let player;
    let opponent;

    // initialize score count
    let myCount = 0;
    let oppCount = 0;

    // randomly select opponents cards
    function oppMove() {
        for (let i = 0; i < oppChoice.length; i++) {
            
            setTimeout(() => {
                const oppIndex = Math.floor(Math.random() * 3);

                // store the indices of each player pick
                playerPick = cardArray.indexOf(playableArray[i]);
                oppPick = oppIndex;

                revealNum = i + 1;

                player = document.getElementById(`player${revealNum}`);
                opponent = document.getElementById(`opp${revealNum}`);

                oppChoice[i].src = cardArray[oppIndex];
                winLose();

                // check if player turn is over
                if (i === oppChoice.length - 1) {
                    setTimeout(() => {
                         // end game once one player reaches 100 points

                        if (myCount >= 100 && oppCount < 100) {
                            console.log("game over! you won");
                            playerWin = 1;
                            endGame();
                        }

                        if (oppCount >= 100 && myCount < 100) {
                            console.log("game over! opponent won");
                            playerWin = 2;
                            endGame();
                        }

                        if (myCount >= 100 && oppCount >= 100) {
                            console.log("game over! you tied!");
                            playerWin = 3;
                            endGame();
                        }

                        nextRound();
                        newTurn();
                    }, 2500);
                }

            }, i * 1000);
        }
    }

    // comparison function to determine who wins or loses
    function winLose() {

        if (playerPick === oppPick) {
            console.log("It's a tie!");
            myCount = myCount + 5;
            oppCount = oppCount + 5;
            updateScore();
        } else if (
            (playerPick === 0 && oppPick === 2) ||
            (playerPick === 1 && oppPick === 0) ||
            (playerPick === 2 && oppPick === 1) ) {
                console.log("You win!");
                setTimeout(() => {
                    player.src = winArray[playerPick];
                    opponent.src = selectedArray[oppPick];
                }, 500);
                myCount = myCount + 10;    
                updateScore();
                console.log(myCount, oppCount);
                
        } else {
            console.log("Opponent wins!");
            setTimeout(() => {
                player.src = selectedArray[playerPick];
                opponent.src = winArray[oppPick];
            }, 600);
            oppCount = oppCount + 10;
            updateScore();
            console.log(myCount, oppCount);
        }   
    }

    const myScore = document.getElementById("myscore");
    const oppScore = document.getElementById("enemyscore");

    // function for displaying score with leading 0's if necessary
    function formatScore(score) {
        return String(score).padStart(3, "0");
    }
    
    // function for updating score
    function updateScore() {
        myScore.textContent = formatScore(myCount);
        oppScore.textContent = formatScore(oppCount);
    }

    // function for new turn
    function newTurn() {
        for (let i = 0; i < oppChoice.length; i++) {
            oppChoice[i].src = "images/default-card.png";
        }

        for (let i = 0; i < playable.length; i++) {
            playable[i].src = "images/default-card.png";
        }

        drawNew();
    }

    // allow user to draw from deck
    const deck = document.getElementById("draw");

    function drawNew() {
        // highlight deck for user to click
        deck.src = "images/deck-ready.png"
        deck.style.cursor = "pointer";
        decklabel.style.cursor = "pointer";

        numberSelected = 0;

        deck.addEventListener("click", function handleClick() {

            for (let i = 0; i < selectedIndex.length; i++) {
                const redraw = Math.floor(Math.random() * 3);
                optionsArray[selectedIndex[i]].src = cardArray[redraw];
            }

            deck.src = "images/deck.png";
            deck.removeEventListener("click", handleClick)
            deck.style.cursor = "auto";
            decklabel.style.cursor = "auto";

            resetArrays();

        });
    }

    function resetArrays() {
        playableArray  = [];
        selectedIndex = [];
        cardLoad();
    }

    // set next round
    const currentRound = document.getElementById("round");

    function nextRound() {
        round++;
        currentRound.textContent = `ROUND ${round}`;
    }

    // function to end the game

    const greyedOut = document.getElementById("greyout");
    const win = document.getElementById("win");
    const lose = document.getElementById("lose");
    const tie = document.getElementById("tie");

   function endGame() {
        greyedOut.style.display = "block";

        if (playerWin === 1) {
            win.style.display = "block";
            lose.style.display = "none";
            tie.style.display = "none";
        } else if (playerWin === 2){
            lose.style.display = "block";
            win.style.display = "none";
            tie.style.display = "none";
        } else if (playerWin === 3) {
            lose.style.display = "none";
            win.style.display = "none";
            tie.style.display = "block";
        }
   }

}());