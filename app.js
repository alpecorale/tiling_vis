const http = require('http');

const hostname = 'srv-hpc01';
const port = 3002;
// const port = 3451;

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



/*
* Multer temp Storage location 1
*/
const storageRawData = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./raw_data");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const RawData = multer({ storage: storageRawData });


// Get list of clean data files
app.get('/getCleanDataOptions', async (req, res) => {
    let options = []

    execPromise("cd public/clean_data; ls;").then(data => {
        options = data.stdout.split('\n')
        options.pop()
        options = options.map(x =>
            x.split('.')[0])
        res.send(options)
    })

})


/*
* Used for temporary attachment uploads (saves them in ./raw_data)
* adds them as an attachment to prexisting issue
* Need cronjob to clear directory periodically or after successfull upload
*/
app.post('/downloadRawData', RawData.any('files'), async (req, res, next) => {

    if (res.status(200)) {


        // await cleanData(req.files[0].path, req.body.format)

        console.log("Your file has been uploaded successfully.");
        console.log(req.files);

        res.json({ message: "Successfully uploaded files" });
        res.end();

        // use exec() or cron job to move file around cluster
        cleanData(req.files[0].path, req.body.format, req.body.clustering, req.body.density)

    }
    
    

})

async function cleanData(path, format, clustering, clusteringDensity) {

    console.log('inside clean data')
    // transform file to desired JS input type
    await execPromise("python python_scripts/main.py " + path + ' ' + format, (error, stdout, stderr) => {
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


    // yah the rm is working bc not returning promise correctly prbly

    // // remove raw file after transformation
    // await execPromise("rm " + path, (error, stdout, stderr) => {
    //     if (error) {
    //         console.log(`error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.log(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });

}






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

app.get('/info', (req, res) => {
    res.sendFile(__dirname + '/public/info.html');
    // res.send("starts new nodejs project")

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