const express = require('express');
const app = express();
const path = require('path');
const ws = new WebSocket("ws://192.168.7.254/ws");
const fs = require('fs');
const nodemailer = require("nodemailer");
const multer = require('multer');
const transporter = require("nodemailer/lib/mailer");
const {request} = require("express");
const upload = multer();
require('dotenv').config();


app.use(express.static('page'));

// GET

app.get('/', function (req, res) {
    res.render("index.html");
})

// Realtime API
app.get('/realtime', async (req, res) => {
    let realtimeFile = await JSON.parse(fs.readFileSync('realtime.txt', 'utf8'));
    const data = {
        realtime: realtimeFile
    };

    res.send(data);
})

// History API
app.get('/history', async (req, res) => {
    let historyFile = await JSON.parse(fs.readFileSync('history.json', 'utf8'));
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

// WebSocket FS

function realtimeFs (wsData) {
    fs.writeFile("realtime.txt", wsData, "utf8", () => {})
}

function historyFs(wsData) {
    fs.readFile("history.json", "utf8", (err, data) => {
        let array = JSON.parse(data);
        array.push(wsData);
        if (array.length > 30) {
            array.splice(0, 1);
        }
        fs.writeFile("history.json", JSON.stringify(array, null, 2), "utf8", () => {});
    })
}

// Email send

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/email-contact', upload.none(), (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "programma.meiv@gmail.com",
            pass: process.env.GOOGLE_APP_PASS
        }
    })



    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         type: "OAuth2",
    //         user: "programma.meiv@gmail.com",
    //         clientId: "",
    //         clientSecret: "",
    //         refreshToken: ""
    //     }
    // })

    // L'email risulta mandata da me per me, ma se rispondo in teoria dovrebbe farmi rispondere all'email dell'utente
    // Qualcosa mi sono perso lungo il settaggio del controllo OAuth2 che è molto più sicuro che genrare una password per app

    let message = {
        from: 'programma.meiv@gmail.com',
        replyTo: req.body.email,
        to: "programma.meiv@gmail.com",
        subject: `${req.body.subject}`,
        text: JSON.stringify(req.body.message)
    }

    transporter.sendMail(message, (err, info) => {
        if (err) {
            return console.log(err);
        }
        console.log("Email sent:" + info.response);
    })

    res.send("Email sent");
})

// Hobby "database" method

// add hobby
app.post("/new-hobby", async (req, res) => {
    let newHobby =  await req.body;
    fs.readFile("hobby.json", "utf8", (err, data) => {
        let array = JSON.parse(data);
        array.push(newHobby);

        fs.writeFile("hobby.json", JSON.stringify(array, null, 2), "utf8", () => {});
    })
})

// delete hobby
app.delete("/delete-hobby/:name", async (req, res) => {
    let file = await req.params.name;
    fs.readFile("hobby.json", "utf8", (err, data) => {
        let array = JSON.parse(data);
        array = array.filter(item => item.hobby !== file);

        fs.writeFile("hobby.json", JSON.stringify(array, null, 2), "utf8", () => {});
    })
})

// edit hobby list
app.put("/edit-hobby/:name", async (req, res) => {
    let oldHobby = await req.params.name;
    let newHobby = await req.body;
    fs.readFile("hobby.json", "utf8", (err, data) => {
        let array = JSON.parse(data);
        let newArray = array.filter(item => item.hobby === oldHobby);
        array = array.filter(item => item.hobby !== oldHobby);

        newArray.forEach(item => {
            item.hobby = newHobby.hobby;
            item.esperienza = newHobby.esperienza;
            array.push(item);
        })

        fs.writeFile("hobby.json", JSON.stringify(array, null, 2), "utf8", () => {});
    })
})


// get hobby list
app.get("/hobby-list", async (req, res) => {
    let file = await JSON.parse(fs.readFileSync("hobby.json", "utf8"));
    res.send(file);
})
