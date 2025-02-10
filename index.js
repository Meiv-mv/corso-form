const inputBar = document.getElementById("hobbies-bar");
const hobbiesExpBar = document.getElementById("hobbies-exp-bar");
const hobbiesBtn = document.getElementById("hobbies-btn");
// const hobbiesContainer = document.getElementById("hobbies-container");
let hobbiesList = [];

// need to add a localstorage

// AG-Grid

const gridOptions = {
    rowData:[
        {hobby: "Suonare la chitarra", esperienza: "Eccellente"},
        {hobby: "Cucinare", esperienza: "Buona"},
        {hobby: "Programmare", esperienza: "Base"}
    ],
    columnDefs: [
        {field: "hobby", editable: true, flex: 3},
        {field: "esperienza", editable: true, flex: 2},
        {field: "",
            cellRenderer: function () {
                let btn = document.createElement("button");
                btn.innerHTML = "Elimina";
                btn.classList.add("btn");
                btn.classList.add("btn-danger");
                btn.value = ``;

                btn.addEventListener("click", function (e) {
                    console.log("clicked");
                    deleteHobby();
                    deleteRow();
                    getSelectedRows();
                })

                return btn;
            },
            flex: 1
        }
    ],
    rowSelection: 'single',
    onGridReady: (params) => {
        gridOptions.api = params.api;
        gridOptions.columnApi = params.columnApi;
    }
}

const myGridElement = document.querySelector('#myGrid');
agGrid.createGrid(myGridElement, gridOptions);

// Hobby Section

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
    console.log(hobbiesList);
    console.log(gridOptions.rowData);

    function renderList() {
        inputBar.value = "";
        hobbiesExpBar.value = 50;
        myGridElement.innerHTML = "";
        let array = [];
        gridOptions.rowData = [];

        hobbiesList.forEach(hobby => {
            let hobbyItem = {
                hobby: hobby.name,
                esperienza: hobby.exp
            }

            array.push(hobbyItem);
        })

        gridOptions.rowData = array;
        agGrid.createGrid(myGridElement, gridOptions);
    }

    renderList();
})

// Delete the hobby from the array
function deleteHobby() {

}

// Delete the row
function deleteRow() {
    const selectedRow = gridOptions.api.getSelectedNodes()[0]
    if (selectedRow) {
        gridOptions.api.applyTransaction({ remove: [selectedRow.data] });
    }
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


