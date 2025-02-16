const express = require('express');
const app = express();
const path = require('path');
const ws = new WebSocket("ws://192.168.7.254/ws");
const fs = require('fs');

// APIs

// app.use(express.json());
app.use(express.static('page'));

// GET

app.get('/', function (req, res) {
    res.render("index.html");
})

// Realtime API
app.get('/realtime', async (req, res) => {
    let realtimeFile = JSON.parse(await readRealtime());
    const data = {
        realtime: realtimeFile
    };

    res.send(data);
})

// History API
app.get('/history', async (req, res) => {
    let historyFile = JSON.parse(await readHistory());
    const data = {
        history : historyFile
    };

    res.send(data);
})

app.listen(3000);
console.log("Server started on http://localhost:3000");

// WebSocket data collection

ws.onopen = () => {
    console.log('Connection opened');
}
ws.onmessage = async (event) => {
    console.log(JSON.parse(event.data));
    let date = new Date();
    let obj = JSON.parse(event.data)
    obj.time = date;
    let stringObj = JSON.stringify(obj);

    realtimeFs(stringObj);
    historyFs(obj);
}

async function readRealtime() {
    let file = fs.readFileSync('realtime.txt', 'utf8');
    return file
}

async function readHistory() {
    let file = fs.readFileSync('history.json', 'utf8');
    return file
}

function realtimeFs (wsData) {
    fs.writeFile("realtime.txt", wsData, "utf8", () => {})
}

function historyFs(wsData) {
    // let file = `${wsData} \n`
    //
    // fs.appendFile("history.txt", file, "utf8", () => {})
    fs.readFile("history.json", "utf8", (err, data) => {
        let array = JSON.parse(data);
        array.push(wsData);
        if (array.length > 30) {
            array.splice(0, 1);
        }
        fs.writeFile("history.json", JSON.stringify(array, null, 2), "utf8", () => {});
    })
}
