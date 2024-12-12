(function(){
    "use strict";
    console.log("running js");

    const playerName = sessionStorage.getItem("playerName");
    const selectedAvatar = sessionStorage.getItem("selectedAvatar");

    let gameOn = true;
    let playerWin = 0;

    let round = 1;
    
    // audio functions
    const clickSound = new Audio("audios/click.mp3");
    const clickLowSound = new Audio("audios/click-low.mp3");

    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play();
    }

    function playLowSound() {
        clickLowSound.currentTime = 0;
        clickLowSound.play();
    }

    const winAudio = new Audio("audios/you-win.wav");
    const tieAudio = new Audio("audios/you-tie.wav");
    const loseAudio = new Audio("audios/you-lose.mp3");

    function playWinAudio() {
        winAudio.currentTime = 0;
        winAudio.play();
    }

    function playTieAudio() {
        tieAudio.currentTime = 0;
        tieAudio.play();
    }

    function playLoseAudio() {
        loseAudio.currentTime = 0;
        loseAudio.play();
    }

    // back button allows user to return to their page
    const back = document.getElementById("backbtn");
    back.addEventListener("click", function() {
        playLowSound();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    })

    // same avatar array
    const avatarArray = [
        "images/moth.PNG",
        "images/fish-left.png",
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
        "images/moth.PNG",
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

    // tutorial array
    const tutorialArray = [
        "images/page-1.png",
        "images/page-2.png",
        "images/page-3.png",
        "images/page-4.png",
        "images/page-5.png",
    ]

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
    const oppName = document.getElementById("enemyname")

    opp.src = enemyArray[enemyIndex];
    oppScoreBoard.src = enemyScoreArray[enemyIndex];

    // change opponent's name
    if (enemyIndex === 0) {
        oppName.textContent = "Night Stalker";
    } else if (enemyIndex === 1) {
        oppName.textContent = "Great Splashini";
    } else {
        oppName.textContent = "Herald of Flames";
    }

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
                    playClickSound();
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
            playLowSound();
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
            myCount = myCount + 5;
            oppCount = oppCount + 5;
            updateScore();
        } else if (
            (playerPick === 0 && oppPick === 2) ||
            (playerPick === 1 && oppPick === 0) ||
            (playerPick === 2 && oppPick === 1) ) {
                setTimeout(() => {
                    player.src = winArray[playerPick];
                    opponent.src = selectedArray[oppPick];
                }, 500);
                myCount = myCount + 10;    
                updateScore();
                console.log(myCount, oppCount);
                
        } else {
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
    const deckImage = document.getElementById("draw-img");

    function drawNew() {
        // highlight deck for user to click
        deckImage.src = "images/deck-ready.png"
        deck.style.cursor = "pointer";

        numberSelected = 0;

        deck.addEventListener("click", function handleClick() {
            playLowSound();

            for (let i = 0; i < selectedIndex.length; i++) {
                const redraw = Math.floor(Math.random() * 3);
                optionsArray[selectedIndex[i]].src = cardArray[redraw];
            }

            deckImage.src = "images/deck.png";
            deck.removeEventListener("click", handleClick)
            deck.style.cursor = "auto";

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

    const backgroundMusic = document.getElementById("background-music");

   function endGame() {
        greyedOut.style.display = "block";
        backgroundMusic.pause();

        if (playerWin === 1) {
            playWinAudio();
            win.style.display = "block";
            lose.style.display = "none";
            tie.style.display = "none";
        } else if (playerWin === 2){
            playLoseAudio();
            lose.style.display = "block";
            win.style.display = "none";
            tie.style.display = "none";
        } else if (playerWin === 3) {
            playTieAudio();
            lose.style.display = "none";
            win.style.display = "none";
            tie.style.display = "block";
        }
   }

   // final addition: tutorial

   const goLeft = document.getElementById("go-left");
   const goRight = document.getElementById("go-right");
   const exitBtn = document.getElementById("exit");
   const overlay = document.getElementById("overlay");
   const currentSlide = document.getElementById("page");
   const tutorialBtn = document.getElementById("tutorial-btn");

   let currentIndex = 0;

   exitBtn.addEventListener("click", function() {
        playClickSound();
        overlay.style.display = "none";
   });

   goLeft.addEventListener("click", function() {
        if (currentIndex > 0) {
            playClickSound();
            currentIndex--;
            currentSlide.src = tutorialArray[currentIndex];
        }
   });

   goRight.addEventListener("click", function() {
        if (currentIndex < 4) {
            playClickSound();
            currentIndex++;
            currentSlide.src = tutorialArray[currentIndex];
        }
   })

   tutorialBtn.addEventListener("click", function() {
        playClickSound();
        overlay.style.display = "block";
   })

}());