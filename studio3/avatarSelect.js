(function(){
    'use strict';
    console.log("running js");

    // js for index
    const avatar = document.querySelector("#avatar img");
    const left = document.getElementById("left");
    const right = document.getElementById("right");

    // array for different avatars
    const avatarArray = [
        "images/moth.PNG",
        "images/fish-right.PNG",
        "images/lizard-left.PNG"
    ];

    // keep track of avatar index
    let avatarIndex = 0;

    function updateAvatar() {
        avatar.src = avatarArray[avatarIndex];
    }

    left.addEventListener("click", function() {
        avatarIndex = (avatarIndex - 1 + avatarArray.length) % avatarArray.length;
        playClickSound();
        updateAvatar();
    });

    right.addEventListener("click", function() {
        avatarIndex = (avatarIndex + 1) % avatarArray.length;
        playClickSound();
        updateAvatar();
    });

    // form logic
    const form = document.getElementById("playerForm");
    const nameInput = document.getElementById("name");

    form.addEventListener("submit", function(evt) {
        evt.preventDefault();
        playLowSound();

        const playerName = nameInput.value;
        const errorMessageContainer = document.querySelector("#error-message");

        if (errorMessageContainer) {
            errorMessageContainer.innerHTML = '';
        }

        if (playerName) {
            sessionStorage.setItem("playerName", playerName); 
            sessionStorage.setItem("selectedAvatar", avatarIndex);

            setTimeout(() => {
                window.location.href = "gameplay.html";
            }, 500);

        } else {
            const form = document.getElementById("playerForm");
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "please enter a name.";
            //document.classList.add("#error-message");

            errorMessage.style.fontSize = "30px";
            errorMessage.style.lineHeight = "5px";
            form.style.lineHeight = "30px";

            errorMessageContainer.appendChild(errorMessage);
        }                                                                                                     

        
    })

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

}());