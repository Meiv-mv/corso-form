// Hobby Section

const inputBar = document.getElementById("hobbies-bar");
const hobbiesExpBar = document.getElementById("hobbies-exp-bar");
const hobbiesBtn = document.getElementById("hobbies-btn");

// need to add a localstorage

// AG-Grid

const gridOptions = {
    rowData:[
        {hobby: "Suonare la chitarra", esperienza: "Eccellente"},
        {hobby: "Cucinare", esperienza: "Buona"},
        {hobby: "Programmare", esperienza: "Base"}
    ],
    columnDefs: [
        {field: "hobby", editable: true, filter: true, flex: 3},
        {field: "esperienza", editable: true, filter: true, flex: 2},
        {field: "",
            cellRenderer: function (params) {
                let btn = document.createElement("button");
                btn.innerHTML = "X";
                btn.classList.add("btn");
                btn.classList.add("btn-danger");
                btn.classList.add("rounded-circle");

                btn.addEventListener("click", function (e) {
                    deleteRow(params);
                })

                return btn;
            },
            flex: 1
        }
    ],
    onGridReady: (params) => {
        gridOptions.api = params.api;
    },
    onFirstDataRendered: (params) => {
        gridOptions.api = params.api;
    }
}

const myGridElement = document.querySelector('#myGrid');
agGrid.createGrid(myGridElement, gridOptions);

// Hobby Event Section

hobbiesBtn.addEventListener("click", (e) => {
    if (inputBar.value === ""){
        window.alert("Inserire un hobby!");
        return;
    }

    let expValue = "";
    let x = hobbiesExpBar.value;
    switch (true) {
        case (x == 0): expValue = "Neofita"; break;
        case (x == 1): expValue = "Bassa"; break;
        case (x == 2): expValue = "Base"; break;
        case (x == 3): expValue = "Buona"; break;
        case (x == 4): expValue = "Ottima"; break;
        case (x == 5): expValue = "Eccellente"; break;
        case (x == 6): expValue = "Esperto"; break;
        default: expValue = "Nessuna";
    }

    let newHobby = {hobby: inputBar.value, esperienza: expValue}
    gridOptions.rowData.push({hobby: inputBar.value, esperienza: expValue});
    gridOptions.api.applyTransaction({ add: [newHobby] });

    inputBar.value = "";
    hobbiesExpBar.value = 0;
})

// Delete the row
function deleteRow(params){
    gridOptions.rowData = gridOptions.rowData.filter(row => Object.keys(row).some(key => row[key] !== params.node.data[key]));

    gridOptions.api.applyTransaction({
        remove: [params.node.data]
    });
}

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
        alert("Inserire il nome di una città!");
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

            updateMap(json.coord.lat, json.coord.lon, city)
        }

    })
}

// Leaflet
let map ;
let marker ;

function initMap(lat, lon, cityName) {
    map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap contributors'}).addTo(map);

    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${cityName}</b>`)
        .openPopup();
}

initMap(40.8333, 14.25, "Napoli");

function updateMap(lat, lon, cityName) {
    map.setView([lat, lon], 13);

    marker.setLatLng([lat, lon])
        .setPopupContent(`<b>${cityName}</b>`)
        .openPopup();
}


