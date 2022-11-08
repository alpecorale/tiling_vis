const http = require('http');

const hostname = 'srv-hpc01';
const port = 3002;

const express = require('express'),
    morgan = require('morgan'),
    app = express(),
    path = require('path'),
    bodyParser = require("body-parser"),
    multer = require("multer"),
    util = require('util'),
    cors = require('cors');
require('dotenv').config();
const fs = require('fs');
// const Blob = require('blob')


// Express App
let public_dir = path.join(__dirname, 'public');

const { response, request, application } = require("express");
const { type } = require('os');





app.use(cors({
    origin: "*",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// might need body parser
app.use(express.static('public'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
})

const { exec } = require("child_process");

exec("pwd", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});


const { spawn } = require("child_process");

// const ls = spawn("ls", ["-la"]);

// ls.stdout.on("data", data => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", data => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('error', (error) => {
//     console.log(`error: ${error.message}`);
// });

// ls.on("close", code => {
//     console.log(`child process exited with code ${code}`);
// });

const readFilePromise = util.promisify(fs.readFile)
const execPromise = util.promisify(exec)
const spawnPromise = util.promisify(spawn)




// good example for copy paste
app.get('/testServerNav', async (req, res) => {
    

    readFilePromise('/grid/home/nbourgeois/igv_data/summary/NT-10_summary.json')
        .then(data => {
            res.send(data)
        })


    // gets list of folders from a directory
    // let folders = []
    // execPromise("cd ../..; ls -d */;").then(data => {
    //     folders = data.stdout.split('\n')
    //     folders.pop() // rm last empty space
    //     res.send(folders)
    // })

})



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // res.send("starts new nodejs project")

})



app.listen(process.env.PORT || port, hostname, () => console.log("listening on port " + port));
// register view engine
// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     res.redirect('/index')
// })

// app.get('/index', async (req, res) => {
//     res.render('index')
// })