// Hobby Section

const inputBar = document.getElementById("hobbies-bar");
const hobbiesExpBar = document.getElementById("hobbies-exp-bar");
const hobbiesBtn = document.getElementById("hobbies-btn");

// need to add a localstorage

// AG-Grid

const gridOptions = {
    rowData:[],
    columnDefs: [
        {field: "hobby", filter: true, flex: 3, resizable: false},
        {field: "esperienza", filter: true, flex: 2, resizable: false},
        {field: "",
            cellRenderer: function (params) {
                // btn container
                let div = document.createElement("div");
                div.classList.add("grid-btn-container");

                // edit btn
                let editBtn = document.createElement("button");
                editBtn.innerHTML = `<img src="img/edit-icon.svg" alt="edit hobby icon">`;
                editBtn.classList.add("btn");
                editBtn.classList.add("btn-success");
                editBtn.classList.add("rounded-circle");

                editBtn.addEventListener("click", () => {
                    const modal = document.createElement("div");
                    modal.classList.add("modal");
                    modal.setAttribute("tabindex", "-1");
                    modal.setAttribute("id", "hobby-editing");
                    modal.innerHTML = `
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title">Modifica</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="removeModal('hobby-editing')"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row g-3">
                                    <div class="col-8 form-floating">
                                        <input class="form-control" type="text" name="hobby-edit" id="hobby-edit" value="${params.node.data.hobby}">
                                        <label for="hobby-edit" class="floating-label" style="color: rgb(33, 37, 41);">Hobby</label>
                                    </div>
                                    <div class="col-8 form-floating">
                                        <input class="form-control" type="text" name="exp-edit" id="exp-edit" value="${params.node.data.esperienza}">
                                        <label for="exp-edit" class="floating-label" style="color: rgb(33, 37, 41);">Esperienza</label>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">                 
                                <button type="button" class="btn btn-primary" id="save-btn" data-bs-dismiss="modal">Salva</button>
                            </div>
                        </div>
                    </div>
                    `;

                    document.body.appendChild(modal)
                    let bootstrapModal = new bootstrap.Modal(modal);
                    bootstrapModal.show();

                    // save btn
                    const saveBtn = document.getElementById("save-btn");
                    saveBtn.addEventListener("click", () => {
                        let newInput = document.getElementById("hobby-edit");
                        let newExp = document.getElementById("exp-edit");
                        let oldHobbyName = params.node.data.hobby;

                        if (newInput.value !== "") {
                            params.node.data.hobby = newInput.value;
                        }

                        if (newExp.value !== "") {
                            params.node.data.esperienza = newExp.value;
                        }
                        let newHobby = {
                            hobby: params.node.data.hobby,
                            esperienza: params.node.data.esperienza
                        }

                        editHobby(oldHobbyName, newHobby);
                        removeModal("hobby-editing");
                        gridOptions.api.refreshCells();
                    })
                })


                // delete btn
                let deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = "X";
                deleteBtn.classList.add("btn");
                deleteBtn.classList.add("btn-danger");
                deleteBtn.classList.add("rounded-circle");

                deleteBtn.addEventListener("click",  () => {
                    gridOptions.rowData = gridOptions.rowData.filter(row => Object.keys(row).some(key => row[key] !== params.node.data[key]));

                    deleteHobby(params.node.data.hobby);
                    gridOptions.api.applyTransaction({
                        remove: [params.node.data]
                    });
                })

                div.appendChild(editBtn);
                div.appendChild(deleteBtn);
                return div;
            },
            flex: 1,
            resizable: false
        }
    ],
    onGridReady: (params) => {
        gridOptions.api = params.api;
    },
    onFirstDataRendered: (params) => {
        gridOptions.api = params.api;
    }
}

// Hobby APIs Calls

// GET - Initial Grid
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch("http://localhost:3000/hobby-list");
    const json = await response.json();
    let array = []
    json.forEach(item => {
        array.push(item);
    })

    gridOptions.rowData = array;
    const myGridElement = document.querySelector('#myGrid');
    agGrid.createGrid(myGridElement, gridOptions);
})

// POST - Add Hobby
async function addHobby(newHobby){
    const response = await fetch("http://localhost:3000/new-hobby", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHobby)
    })
}

// DELETE - Delete Hobby
async function deleteHobby(deleteItem){
    const response = await fetch(`http://localhost:3000/delete-hobby/${encodeURIComponent(deleteItem)}`, {
        method: 'DELETE'
    })
}

// PUT - Edit Hobby
async function editHobby(oldHobby, newHobby){
    const response = await fetch(`http://localhost:3000/edit-hobby/${encodeURIComponent(oldHobby)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHobby)
    })
}




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
    addHobby({hobby: inputBar.value, esperienza: expValue});
    gridOptions.rowData.push({hobby: inputBar.value, esperienza: expValue});
    gridOptions.api.applyTransaction({ add: [newHobby] });

    inputBar.value = "";
    hobbiesExpBar.value = 0;
})

// Delete the row
function deleteRow(params){

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
    modal.setAttribute("id", "history-log")
    modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content bg-dark text-white">
            <div class="modal-header border-secondary">
                <h1 class="modal-title">Storico</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onclick="removeModal('history-log')"></button>
            </div>
            <div class="modal-body">
                <ul> ${displayHistory(json.history)} </ul>
            </div>
            <div class="modal-footer border-secondary">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="removeModal('history-log')" ">Close</button>
            </div>
        </div>
    </div>`;

    document.body.appendChild(modal)
    let bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// remove modal function
function removeModal(modalId){
    let modalToRemove = document.getElementById(`${modalId}`);
    modalToRemove.remove();
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