(function(){
    'use strict';
    console.log("running js");

    const formData = document.querySelectorAll("input[type=text]");

    // create const for each blank
    const noun1 = document.querySelectorAll(".noun1");
    const adj1 = document.getElementById("adj1");
    const adj2 = document.getElementById("adj2");
    const food = document.getElementById("food");
    const ingredient = document.getElementById("ingredient");
    const animal = document.getElementById("animal");
    const country = document.getElementById("country");
    const verb = document.getElementById("verb");
    const adj3 = document.getElementById("adj3");

    // run checks if submit button is clicked
    const btn = document.querySelector("button");
    btn.addEventListener("click", function(evt) {
        evt.preventDefault();
        processFormData(formData);
    });

    function processFormData(formData) {
        // create arrays for inputs and empty fields
        const words = [];
        const emptyFields = [];

        // get data for each word and push onto words array if value exists

        for (let i = 0; i < formData.length; i++) {
            const eachWord = formData[i];
            if (eachWord.value) {
                words.push(eachWord.value); 
            } else {
                emptyFields.push(i);
            }
        }

        // throw error if there are empty fields
        if (emptyFields.length > 0) {
            showErrors(formData, emptyFields);
        } else {
            makeMadLib(words);
            displayOverlay();
        }
    }

    // error display function
    function showErrors(formData, emptyFields) {
        if (emptyFields.length == 1) {
            alert(`Please fill out empty field ${emptyFields[0] + 1}.`)
        } else {
            alert(`Please fill out empty fields: ${emptyFields.map(n => n+1)}.`);
        }
        // highlight first empty field
        const errorId = formData[emptyFields[0]].id;
        document.querySelector(`#${errorId}`).focus();
    }

    // display madLib
    function makeMadLib(words) {
        for (let i = 0; i<noun1.length; i++) {
            noun1[i].innerHTML = words[0];
        }
        
        adj1.innerHTML = words[1];
        adj2.innerHTML = words[2];
        food.innerHTML = words[3];
        ingredient.innerHTML = words[4];
        animal.innerHTML = words[5];
        country.innerHTML = words[6];
        verb.innerHTML = words[7];
        adj3.innerHTML = words[8];

        handleVowels(formData);
    }

    // display overlay if madLib is valid
    function displayOverlay() {
        const overlay = document.getElementById("overlay");
        overlay.className = "showing";
    }
        
    // hide overlay when x is pressed
    const x = document.querySelector("h2") 
    x.addEventListener("click", function() {
        const overlay = document.getElementById("overlay");
        overlay.className = "hidden";

        // clear data whenever overlay is closed
        formData.forEach(input => {
            input.value = "";
        })
    });

    function handleVowels(formData) {
        // handle adjective beginning with a vowel
        const vowel = formData[8];
        const vowelValue = vowel.value;
        const vowelArray = vowelValue.split('');

        if (vowelArray[0].toLowerCase() === "a" || vowelArray[0].toLowerCase() === "e" || vowelArray[0].toLowerCase() === "i" || vowelArray[0].toLowerCase() === "o" || vowelArray[0].toLowerCase() === "u") {
            const vowelChange = document.getElementById("an");
            vowelChange.innerHTML = "an";
        } else {
            const vowelChange = document.getElementById("an");
            vowelChange.innerHTML = "a";
        }

    }

})();