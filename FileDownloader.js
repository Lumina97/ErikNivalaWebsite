const fs = require('fs');
const https = require('https');
const http = require('http');


//=====================FILE DOWNLOAD======================

async function DownloadFilesFromLinks(links) {

    return new Promise(async function (resolve, reject) {

        if (typeof links !== 'undefined') {

            console.log("have image links");
            console.log("Starting download...");

            //======================DOWNLOAD FILES
            for (i = 0; i < links.length; i++) {
                if (links[i].includes('https')) {
                    console.log("Starting HTTPS Download...");
                    await DownloadHTTPSFile(links[i]);
                }
                else if (links[i].includes('http')) {
                    console.log("Starting HTTP Download...");
                    await DownloadHTTPFile(links[i]);
                }
            }
        }
        else {
            console.log("Error With image links! - Filedownloader.js - DownloadFilesFromLinks()")
            reject(false);
            return;
        }

        resolve(true);
    });
}

async function DownloadHTTPSFile(link) {

    console.log("HTTPS DOWNLOAD: " + link);
    const baseDest = "D:\\Dev\\WebDev\\RedditImageData\\" + SubRedditToScan;
    const fileLocationarray = link.split("/");
    const fileLocation = fileLocationarray[fileLocationarray.length - 1];
    console.log("file location: " + fileLocation);

    console.log("Checking file directory...");


    if (fs.existsSync(baseDest) == false) {
        await fs.mkdir(baseDest, { recursive: true }, (error) => {

            if (error) {
                console.log("error creating directory! : " + error);
            }
            else
                console.log("Created directory: " + baseDest);
        });
    }
    let dest = baseDest + "/" + fileLocation;

    const req = https.get(link, function (res) {
        const filestream = fs.createWriteStream(dest);
        res.pipe(filestream);

        //handle filestream write errors
        filestream.on("error", function (error) {
            console.log("Error downloading file: ");
            console.log(error);
        })

        // done downloading
        filestream.on("finish", function () {
            filestream.close();
            console.log("Downloaded: " + fileLocation);
        })
    })
    //handle https download errors
    req.on("error", function (error) {
        console.log("Error downloading file");
        console.log(error);
    })
}

async function DownloadHTTPFile(link) {
    const baseDest = "D:\\Dev\\WebDev\\RedditImageData\\" + SubRedditToScan;
    const fileLocationarray = link.split("/");
    const fileLocation = fileLocationarray[fileLocationarray.length - 1];

    let dest = baseDest + "/" + fileLocation;

    if (fs.existsSync(baseDest) == false) {
        await fs.mkdir(baseDest, { recursive: true }, () => {
            console.log("Created directory: " + baseDest);

            fs.on('error', function (err) {
                console.log('Error  making directory: ' + err);
            })

        });
    }
    const req = http.get(link, function (res) {
        const filestream = fs.createWriteStream(dest);
        res.pipe(filestream);

        //handle filestream write errors
        filestream.on("error", function (error) {
            console.log("Error downloading file: ");
            console.log(error);
        })

        // done downloading
        filestream.on("finish", function () {
            filestream.close();
            console.log("Downloaded: " + fileLocation);
        })
    })
    //handle https download errors
    req.on("error", function (error) {
        console.log("Error downloading file");
        console.log(error);
    })
}

module.exports = {

    DownloadFilesFromLinks : async function (fileLinks) {
        
        return new Promise(async function (resolve, reject) {
            await DownloadFilesFromLinks(fileLinks)
                .catch((err) => {
                    if (err) console.log("Error downloading file! :" + err);
                    reject(false);
                })
                .then(() => {
                    console.log("Sucessfully downloaded files from links!");
                    //TODO: Return a zip file to download/send to the user!
                    resolve(true);
                })
        })
    }
}