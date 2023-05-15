// Requiring express to handle routing
const express = require("express");
const bodyParser = require('body-parser');

// The fileUpload npm package for handling
// file upload functionality
const fileUpload = require("express-fileupload");
const { spawn } = require('child_process');
// const io = require('socket.io')(server);
 

// Creating app
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/output"));

// Passing fileUpload as a middleware
app.use(fileUpload());

const fs = require('fs');

// const upload = multer({ storage: multer.memoryStorage() });

// Initialize an empty buffer to hold the image data
let imageData = Buffer.from([]);
// uploaded path and the buffer of the uploaded image
let uploadedFile;
let imgFileBuffer = Buffer.alloc(1024); // Initializes a buffer of size 1024 bytes with zeroes

let uploadPath;
var x, y;


// API endpoint to check status of imageData variable
app.get('/image-status', (req, res) => {
    if (imageData.length > 0) {
        res.status(200).json({ status: 'ready' });
    } else {
        res.status(200).json({ status: 'not-ready' });
    }
});


// to handle the post req of the nash coordinates
app.post("/sharp", function (req, res) {

    // Spawn a child process that runs our Python script
    const pythonProcess = spawn('python3', ['./filters/sharpen.py', ' - '], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.stdin.on('close', () => {
       console.log('Write operation completed successfully');
    });

    // Sending image, x, and y as buffers to reSize.py
    pythonProcess.stdin.write(imgFileBuffer);
    
    pythonProcess.stdin.on('error', (err) => {
        console.error('Error while writing to Python process:', err);
    });
    
    pythonProcess.stdin.end();

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });


    // Handle the output of the Python script
    pythonProcess.stdout.on('data', (data) => {

        // Do something with the output of the Python script
        imageData = Buffer.concat([imageData, data]);
        console.log("Image filtered successfully");

        imgFileBuffer = imageData;

        fs.writeFile('./output/output.jpg', imageData, (err) => {
            if (err) throw err;
        });
    });

    // Handle any errors that occur during image processing
    pythonProcess.on('error', (err) => {
        // Handle the error here
        console.error(`Python script error: ${err}`);
    });

    // Handle the completion of image processing
    pythonProcess.on('close', (code) => {
        // Handle the completion here
        res.sendFile(__dirname + "/options.html");
        console.log('Image saved to file');
        console.log(`Python script exited with code ${code}`);
    });

    imageData = Buffer.from([]);

    // res.sendFile(__dirname + "/options.html");
});


// to handle the post req of the nash coordinates
app.post("/gray", function (req, res) {

    // Spawn a child process that runs our Python script
    const pythonProcess = spawn('python3', ['./filters/gray.py', ' - '], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.stdin.on('close', () => {
       console.log('Write operation completed successfully');
    });

    // Sending image, x, and y as buffers to reSize.py
    pythonProcess.stdin.write(imgFileBuffer);
    
    pythonProcess.stdin.on('error', (err) => {
        console.error('Error while writing to Python process:', err);
    });
    
    pythonProcess.stdin.end();

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });


    // Handle the output of the Python script
    pythonProcess.stdout.on('data', (data) => {

        // Do something with the output of the Python script
        imageData = Buffer.concat([imageData, data]);
        console.log("Image filtered successfully");

        imgFileBuffer = imageData;

        fs.writeFile('./output/output.jpg', imageData, (err) => {
            if (err) throw err;
        });
    });

    // Handle any errors that occur during image processing
    pythonProcess.on('error', (err) => {
        // Handle the error here
        console.error(`Python script error: ${err}`);
    });

    // Handle the completion of image processing
    pythonProcess.on('close', (code) => {
        // Handle the completion here
        res.sendFile(__dirname + "/options.html");
        console.log('Image saved to file');
        console.log(`Python script exited with code ${code}`);
    });

    imageData = Buffer.from([]);

    // res.sendFile(__dirname + "/options.html");
});


// to handle the post req of the resize coordinates
app.post("/resize", function (req, res) {
    x = req.body.x;
    y = req.body.y;
    console.log("x - " + x);
    console.log("y - " + y);
    
    // Spawn a child process that runs our Python script
    const pythonProcess = spawn('python3', ['./resize/reSize.py', ' - '], {
        stdio: ['pipe', 'pipe', 'pipe']
    });


    pythonProcess.stdin.on('close', () => {
       console.log('Write operation completed successfully');
    });

    var intBufX = Buffer.alloc(4);
    intBufX.writeInt32LE(x);
    var intBufY = Buffer.alloc(4);
    intBufY.writeInt32LE(y);

    // Sending image, x, and y as buffers to reSize.py
    pythonProcess.stdin.write(imgFileBuffer);
    pythonProcess.stdin.write(intBufX);
    pythonProcess.stdin.write(intBufY);
    
    pythonProcess.stdin.on('error', (err) => {
        console.error('Error while writing to Python process:', err);
    });
    
    pythonProcess.stdin.end();


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });


    // Handle the output of the Python script
    pythonProcess.stdout.on('data', (data) => {

        // Do something with the output of the Python script
        // console.log(`Python script output: `);
        imageData = Buffer.concat([imageData, data]);
        console.log("Image resized successfully");

        imgFileBuffer = imageData;

        fs.writeFile('./output/output.jpg', imageData, (err) => {
            if (err) throw err;
            res.sendFile(__dirname + "/options.html");
            console.log('Image saved to file');
        });
    });

    // Handle any errors that occur during image processing
    pythonProcess.on('error', (err) => {
        // Handle the error here
        console.error(`Python script error: ${err}`);
    });

    // Handle the completion of image processing
    pythonProcess.on('close', (code) => {
        // Handle the completion here
        console.log(`Python script exited with code ${code}`);
    });

    imageData = Buffer.from([]);

    // res.sendFile(__dirname + "/options.html");
});


var angle;
// to handle the post req of the rotate
app.post("/rotate", function (req, res) {
    ang = req.body.degree;
    console.log("Angle - " + ang);

    // Spawn a child process that runs our Python script
    const pythonProcess = spawn('python3', ['./rotate/rotate.py', ' - '], {
        stdio: ['pipe', 'pipe', 'pipe']
    });


    pythonProcess.stdin.on('close', () => {
       console.log('Write operation completed successfully');
    });

    var intBufX = Buffer.alloc(4);
    intBufX.writeInt32LE(ang);

    // Sending image, x, and y as buffers to reSize.py
    pythonProcess.stdin.write(imgFileBuffer);
    pythonProcess.stdin.write(intBufX);
    
    pythonProcess.stdin.on('error', (err) => {
        console.error('Error while writing to Python process:', err);
    });
    
    pythonProcess.stdin.end();


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });


    // Handle the output of the Python script
    pythonProcess.stdout.on('data', (data) => {

        // Do something with the output of the Python script
        // console.log(`Python script output: `);
        imageData = Buffer.concat([imageData, data]);
        imgFileBuffer = imageData;

        console.log("Image rotated successfully");

        fs.writeFile('./output/output.jpg', imageData, (err) => {
            if (err) throw err;
            res.sendFile(__dirname + "/options.html");
            console.log('Image saved to file');
        });
    });

    // Handle any errors that occur during image processing
    pythonProcess.on('error', (err) => {
        // Handle the error here
        console.error(`Python script error: ${err}`);
    });

    // Handle the completion of image processing
    pythonProcess.on('close', (code) => {
        // Handle the completion here
        console.log(`Python script exited with code ${code}`);
    });
    imageData = Buffer.from([]);

    // res.sendFile(__dirname + "/options.html");
});


app.post("/scale", function (req, res) {
    scale = req.body.scaleFactor;
    console.log("Scale Factor - " + scale);

    // Spawn a child process that runs our Python script
    const pythonProcess = spawn('python3', ['./rotate/rotate.py', ' - '], {
        stdio: ['pipe', 'pipe', 'pipe']
    });


    pythonProcess.stdin.on('close', () => {
       console.log('Write operation completed successfully');
    });

    var intBufX = Buffer.alloc(4);
    intBufX.writeInt32LE(scale);

    // Sending image, x, and y as buffers to reSize.py
    pythonProcess.stdin.write(imgFileBuffer);
    pythonProcess.stdin.write(intBufX);
    
    pythonProcess.stdin.on('error', (err) => {
        console.error('Error while writing to Python process:', err);
    });
    
    pythonProcess.stdin.end();


    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
    });


    // Handle the output of the Python script
    pythonProcess.stdout.on('data', (data) => {

        // Do something with the output of the Python script
        imageData = Buffer.concat([imageData, data]);
        imgFileBuffer = imageData;

        fs.writeFile('./output/output.jpg', imageData, (err) => {
            if (err) throw err;
            res.sendFile(__dirname + "/options.html");
            console.log('Image saved to file');
        });
    });

    // Handle any errors that occur during image processing
    pythonProcess.on('error', (err) => {
        // Handle the error here
        console.error(`Python script error: ${err}`);
    });

    // Handle the completion of image processing
    pythonProcess.on('close', (code) => {
        // Handle the completion here
        console.log("Image scaled successfully");
        console.log(`Python script exited with code ${code}`);
    });
    imageData = Buffer.from([]);

    // res.sendFile(__dirname + "/options.html");
});


// For handling the upload request
app.post("/upload", function (req, res) {

    // When a file has been uploaded
    if (req.files && Object.keys(req.files).length !== 0) {
        
        // Uploaded path
        uploadedFile = req.files.uploadFile;

        // req.files.(filename_html).data = buffer of the uploaded file
        imgFileBuffer = uploadedFile.data;

        // Logging uploading file
        console.log(uploadedFile);

        // Upload path
        uploadPath = __dirname
            + "/uploads/" + uploadedFile.name;

        // To save the file using mv() function
        uploadedFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                res.send("Failed !!");
            }
            else {
                res.sendFile(__dirname + "/options.html");
            }
        });
    }
    else
        res.send("No file uploaded !!");
});


const testFolder = './output';

// To handle the download file request
app.get("/download", function (req, res) {
    
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
            // The res.download() talking file path to be downloaded
            res.download(__dirname + "/output/" + file, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
});



// GET request to the root of the app
app.get("/", function (req, res) {

    // Sending index.html file as response to the client
    res.sendFile(__dirname + "/upload.html");
    // res.sendFile(__dirname + "/options.html");
});



// Makes app listen to port 3000
app.listen(3000, function (req, res) {
    console.log("Started listening to port 3000");
});
