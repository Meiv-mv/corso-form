const inputBar = document.getElementById("hobbies-bar");
const hobbiesExpBar = document.getElementById("hobbies-exp-bar");
const hobbiesBtn = document.getElementById("hobbies-btn");
const hobbiesContainer = document.getElementById("hobbies-container");
let hobbiesList = [];

// need to add a localstorage

hobbiesBtn.addEventListener("click", (e) => {
    let expValue = "";
    let x = hobbiesExpBar.value;
    switch (true) {
        case (x < 5):
            expValue = "Zero Esperienza";
            break;
        case (x < 20):
            expValue = "Bassa";
            break;
        case (x < 40):
            expValue = "Base";
            break;
        case (x < 60):
            expValue = "Buona";
            break;
        case(x < 75):
            expValue = "Ottima";
            break;
        case (x <= 90):
            expValue = "Eccellente";
            break;
        case (x > 90):
            expValue = "Esperto";
            break;
        default:
            expValue = "none";
    }

    let hobby = {
        name: inputBar.value,
        exp: `${expValue}`
    }

    hobbiesList.push(hobby);
    inputBar.value = "";
    hobbiesExpBar.value = 50;
    hobbiesContainer.innerHTML = "";

    hobbiesList.forEach(item => {

        // Forse con i template literal viene piu' snello e pulito, da vedere

        let liEl = document.createElement("li");
        liEl.setAttribute("class", "hobby-item");
        let pEl = document.createElement("p");
        pEl.setAttribute("class", "h4");
        pEl.innerHTML = `${item.name}/`;
        let deleteBtnEl = document.createElement("button");
        deleteBtnEl.setAttribute("class", "btn btn-danger rounded-circle");
        deleteBtnEl.textContent = "x";
        let changeBtnEl = document.createElement("button");
        changeBtnEl.setAttribute("class", "btn btn-primary rounded");
        changeBtnEl.innerHTML = `Modifica`;
        let expEl = document.createElement("p");
        expEl.setAttribute("class", "h4");
        expEl.innerHTML = `Livello: ${item.exp}`;

        liEl.appendChild(changeBtnEl);
        liEl.appendChild(deleteBtnEl);
        liEl.appendChild(pEl);
        liEl.appendChild(expEl);
        hobbiesContainer.appendChild(liEl);
    })

    // Delete button function
    const deleteHobbiesBtn = document.querySelectorAll(".delete-btn")
    deleteHobbiesBtn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.target.closest("li").remove();
        })
    })

    // Modify hobby button function
    const changeHobbiesBtn = document.querySelectorAll(".change-btn");
    // const changeableHobbiesEl = document.querySelectorAll(".hobby-name");
    // for (let i = 0; i < changeHobbiesEl.length; i++) {
    //     changeHobbiesEl[i].addEventListener("click", (e) => {
    //         e.preventDefault();
    //         console.log("clicked");
    //         console.log(changeableHobbiesEl);
    //
    //         // change setting fuction
    //         function setChange(i){
    //             i.classList.add("hobby-changeable");
    //             i.setAttribute("contenteditable", "true");
    //         }
    //
    //         setChange(changeableHobbiesEl[i]);
    //         setChange(changeableHobbiesEl[i+1]);
    //
    //         changeHobbiesEl[i].classList.add("modify");
    //     })
    // }

    changeHobbiesBtn.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const paragraphValue = e.target.closest("li").querySelectorAll("p")
            console.log(paragraphValue);

            const input = document.createElement("input");
            input.type = "text";
            input.value = paragraphValue[0].innerHTML;
            input.setAttribute("class", "hobby-changeable")

            const inputExp = document.createElement("input");
            inputExp.type = "text";
            inputExp.value = paragraphValue[1].innerHTML;
            inputExp.setAttribute("class", "hobby-changeable")

            e.target.closest("li").appendChild(input);
            e.target.closest("li").appendChild(inputExp);
            btn.classList.add("modify");

            if(btn.classList[1] === "modify"){

            }
        })
    })
})

// Weather Section

const searchWeatherBar = document.getElementById("weather-bar");
const errorBox = document.getElementById("error-box");
const weatherInfoBox = document.getElementById("weather-information");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherDescription = document.getElementById("weather-description");

errorBox.style.display = "none";

function searchWeather() {
    const apiKey = "e22084dc16b09ad59917b9a99d7e29e6"
    let city = searchWeatherBar.value;

    if (searchWeatherBar.value === "") {
        return;
    }

    searchWeatherBar.value = "";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`)
        // .then(res => res.json())
    .then(async response => {

        let json = await response.json();

        if (json.cod !== 200){
            errorBox.style.display = "block";
            weatherInfoBox.style.display = "none";
        }
        else {
            weatherInfoBox.style.display = "block";
            errorBox.style.display = "none";

            cityName.innerHTML = city;
            temperature.innerHTML = `${parseInt(json.main.temp)}°C`;
            humidity.innerHTML = `${json.main.humidity}%`;
            windSpeed.innerHTML = `${json.wind.speed}m/s`;
            weatherDescription.innerHTML = json.weather[0].description;
        }
    })
}


