import Sprite from "./sprite.js"

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

let scrollPosition = 0;
const scrollSpeed = 40;

const PLAYER_WIDTH = 144;
const PLAYER_HEIGHT = 288;

let player = null;

function createSprites() {
    player = new Sprite(context, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function setScreen() {
    createSprites();

    let imagesLoaded = 0;

    player.stillImages.concat(player.walkRight, player.walkLeft, player.lookAt).forEach((img) => {
        img.onload = () => {
            imagesLoaded += 1;
            if (imagesLoaded === 8) {
                startAnimation();
            }
        };
    });
}

// keydown listener for animation state
window.addEventListener("keydown", (evt) => {
    if (evt.key === "d" || evt.key === "ArrowRight") {
        scrollPosition += scrollSpeed;
        const museum = document.getElementById("museum-container");
        museum.scrollLeft = scrollPosition;
        player.setState("walkRight");
    } else if (evt.key === "a" || evt.key === "ArrowLeft") {
        scrollPosition -= scrollSpeed;
        const museum = document.getElementById("museum-container");
        museum.scrollLeft = scrollPosition;
        player.setState("walkLeft");
    }
});

// keyup listener for standing still
window.addEventListener("keyup", (evt) => {
    if ((evt.key === "d" || evt.key === "ArrowRight") && player.state === "walkRight"
        || (evt.key === "a" || evt.key === "ArrowLeft") && player.state === "walkLeft") {
        player.setState("still");
    }
});

function draw() {
    context.clearRect(0,0, canvas.width, canvas.height);
    player.draw();
}

function startAnimation() {
    setInterval(() => {
        player.toggleImage();
        draw();
    }, 500);
}

setScreen();

// function to show overlay if clicked
let pictures = document.getElementsByClassName("picture");
let overlays = document.getElementsByClassName("overlay");
let layers = document.getElementsByClassName("layer");

for (let i=0; i < overlays.length; i++) {
    pictures[i].addEventListener("click", function() {
        player.setState("lookAt");

        // delay the overlay popping up
        setTimeout(function() {
            overlays[i].style.display = "block";
            layers[i].style.display = "block";
        }, 1500);
    });
}


let sections = document.querySelectorAll("section");

// function to allow scroll through overlay
sections.forEach( section => {
    let scrollContainer = section.querySelector(".slides");
    let nextBtn = section.getElementsByClassName("right-btn");
    let backBtn = section.getElementsByClassName("left-btn");

    // turn off manual scrolling
    if (scrollContainer) {
        scrollContainer.addEventListener("wheel", e => e.preventDefault());
        scrollContainer.addEventListener("touchmove", e => e.preventDefault());
    }

    for (let i = 0; i < nextBtn.length; i++) {
        nextBtn[i].addEventListener("click", function() {
            if (scrollContainer) {
                scrollContainer.style.scrollBehavior = "smooth";
                scrollContainer.scrollLeft += 1160;
            }
        });
    }

    for (let i = 0; i < backBtn.length; i++) {
        backBtn[i].addEventListener("click", function() {
            scrollContainer.style.scrollBehavior = "smooth";
            scrollContainer.scrollLeft -= 1160;
        });
    }

})


// function to exit out of the overlay]
const exit = document.getElementsByClassName("exit-button");
for (let i=0; i < exit.length; i++) {
    exit[i].addEventListener("click", function() {
        overlays[i].style.display = "none";
        layers[i].style.display = "none";
    });
}
