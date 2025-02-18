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
const loadingBox = document.getElementById("loading-box");
const weatherInfoBox = document.getElementById("weather-information");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherDescription = document.getElementById("weather-description");
const apiKey = "e22084dc16b09ad59917b9a99d7e29e6"

loadingBox.style.display = "none";
errorBox.style.display = "none";
weatherInfoBox.style.display = "none";

async function searchWeather() {
    let city = searchWeatherBar.value;

    if (searchWeatherBar.value === "") {
        alert("Inserire il nome di una città!");
        return;
    }

    searchWeatherBar.value = "";
    loadingBox.style.display = "block";
    weatherInfoBox.style.display = "none";
    errorBox.style.display = "none";


    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`);
        let json = await response.json();

        if (!response.ok){
            throw new Error(response.statusText);
        } else{

            setTimeout(() => {
                weatherInfoBox.style.display = "block";
                errorBox.style.display = "none";
                loadingBox.style.display = "none";

                cityName.innerHTML = `Città: ${json.name}`;
                temperature.innerHTML = `Temperatura: ${parseInt(json.main.temp)}°C`;
                humidity.innerHTML = `Umidità: ${json.main.humidity}%`;
                windSpeed.innerHTML = `Vento: ${json.wind.speed}m/s`;
                weatherDescription.innerHTML = `Meteo: ${json.weather[0].description}`;
            }, 500)

            updateMap(json.coord.lat, json.coord.lon, json.name)
        }
    } catch (err){
        errorBox.style.display = "block";
        weatherInfoBox.style.display = "none";
        loadingBox.style.display = "none";
    }
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

// WebSocket Data

const realtimeEl = document.getElementById("realtime");
const realtimeBtn = document.getElementById("realtime-btn");
const stopRealtimeBtn = document.getElementById("stop-realtime-btn");
const realtimeUrl = "http://localhost:3000/realtime";
const historyUrl = "http://localhost:3000/history";
let stop = false;

stopRealtimeBtn.style.display = "none";

// realtime call

async function callRealtime(){
    if (stop) return;
    let response = await fetch(realtimeUrl);
    let json = await response.json();
    realtimeEl.innerHTML = `
    <p>Temperatura: ${parseInt(json.realtime.temperature)}°</p>
    <p>Umidità: ${parseInt(json.realtime.humidity)}%</p>
    <p>Pressione: ${parseInt(json.realtime.pressure)} hPA</p>
    <p>Data: ${json.realtime.time}</p>`;

    setTimeout(callRealtime, 30000);
}

realtimeBtn.addEventListener("click", () => {
    stop = false;
    callRealtime();
    stopRealtimeBtn.style.display = "";
    realtimeBtn.style.display = "none";
});

function stopRealtime(){
    stop = true;
    stopRealtimeBtn.style.display = "none";
    realtimeBtn.style.display = "";
}

stopRealtimeBtn.addEventListener("click", () => {
    stopRealtime();
})

// history call

async function callHistory() {
    let response = await fetch(historyUrl);
    let json = await response.json();
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.setAttribute("tabindex", "-1");
    modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content bg-dark text-white">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Storico</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul> ${displayHistory(json.history)} </ul>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>`;

    document.body.appendChild(modal)
    let bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

function displayHistory (array) {
    return array.map(item => `<li>Temperatura: ${item.temperature}°, Umidità: ${item.humidity}%, Pressione: ${item.pressure} hPA, Data: ${item.time}</li>`).join("");
}

// Contact form

const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    try {
        let response = await fetch('/email-contact', {
            method: 'POST',
            body: formData
        });

        if (response.ok){
            form.reset();
            alert('Messaggio inviato correttamente! Grazie per avermi contattato.');
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error(error);
        alert("Ops! C'è stato un errore durante l'invio del form, riprova più tardi.");
    }
})