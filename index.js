const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser").urlencoded({
    extended:false
});
const os = require("os");

const app = express();

app.use(cors());
app.use(body_parser);

const port = 3001;

var minecraftServerProcess = null;

app.get("/", (req, res) => {
    console.log("caca");
})

app.get("/start", (req, res) => {
    console.log("caca tout mou");
    let spawn = require('child_process').spawn;

    minecraftServerProcess = spawn('java', [
        '-Xmx13G',
        '-jar',
        'server.jar',
        'nogui'
    ]);

    minecraftServerProcess.stdout.on('data', log);
    minecraftServerProcess.stderr.on('data', log);



});

app.get('/command', (req, res) => {
    const command = req.query.command;
    console.log(req);
    minecraftServerProcess.stdin.write(command+'\n');

    const buffer = [];
    const collector = function(data) {
        data = data.toString();
        buffer.push(data.split(']: ')[1]);
    };
    minecraftServerProcess.stdout.on('data', collector);
    setTimeout(function() {
        minecraftServerProcess.stdout.removeListener('data', collector);
        res.send(buffer.join(''));
    }, 250);
})

app.get('/sysinfo', (req, res) => {
    const freeMemory = os.freemem() / 1024 / 1024;
    const memory = os.totalmem() / 1024 / 1024;
    res.json({
        "freeMem" : freeMemory,
        "memory" : memory
    })
});

app.get("/players", async (req, res) => {
    const response = await fetch("https://api.mcstatus.io/v2/status/java/185.172.57.22");
    const data = await response.json()
    res.json(data);
});

function log(data) {
    process.stdout.write(data.toString());
}

app.listen(port, () => {
    console.log("App launched");
})
