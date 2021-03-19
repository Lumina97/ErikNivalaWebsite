const fs = require('fs');
const https = require('https');
const http = require('http');

const root = "D:\\Dev\\WebDev\\RedditImageData\\";
let ID;

//=====================FILE DOWNLOAD======================

async function DownloadFilesFromLinks(links) {

    return new Promise(async function (resolve, reject) {

        if (typeof links !== 'undefined') {

            console.log("have image links");
            console.log("Starting download...");

            //======================DOWNLOAD FILES
            for (let i = 0; i < links.length; i++) {
                if (links[i].includes('https')) {
                    console.log("Starting HTTPS Download...");
                    await DownloadHTTPSFile(links[i]);
                }
                else if (links[i].includes('http')) {
                    console.log("Starting HTTP Download...");
                    await DownloadHTTPFile(links[i]);
                }
            }
            resolve(true);
        }
        else {
            console.log("Error With image links! - Filedownloader.js - DownloadFilesFromLinks()")
            reject(false);
            return;
        }

    });
}

async function DownloadHTTPSFile(link) {

    return new Promise(async function (resolve, reject) {
        console.log("HTTPS DOWNLOAD: " + link);
        const baseDest = root + id + "\\" + SubRedditToScan;
        const fileLocationarray = link.split("/");
        const fileLocation = fileLocationarray[fileLocationarray.length - 1];
        console.log("file location: " + fileLocation);

        console.log("Checking file directory...");


        if (fs.existsSync(baseDest) == false) {
            await fs.mkdir(baseDest, { recursive: true }, (error) => {

                if (error) {
                    console.log("error creating directory! : " + error);
                    reject();

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
                reject();

            })

            // done downloading
            filestream.on("finish", function () {
                filestream.close();
                console.log("Downloaded: " + fileLocation);
                resolve();
            })
        })
        //handle https download errors
        req.on("error", function (error) {
            console.log("Error downloading file");
            console.log(error);
            reject();
        })
    })
}

async function DownloadHTTPFile(link) {

    return new Promise(async function (resolve, reject) {
        const baseDest = root + id + "\\" + SubRedditToScan;
        const fileLocationarray = link.split("/");
        const fileLocation = fileLocationarray[fileLocationarray.length - 1];

        let dest = baseDest + "/" + fileLocation;

        if (fs.existsSync(baseDest) == false) {
            await fs.mkdir(baseDest, { recursive: true }, (error) => {

                if (error) {
                    console.log("error creating directory! : " + error);
                    reject();
                }
                else
                    console.log("Created directory: " + baseDest);
            });
        }

        const req = http.get(link, function (res) {
            const filestream = fs.createWriteStream(dest);
            res.pipe(filestream);

            //handle filestream write errors
            filestream.on("error", function (error) {
                console.log("Error downloading file: ");
                console.log(error);
                reject();
            })

            // done downloading
            filestream.on("finish", function () {
                filestream.close();
                console.log("Downloaded: " + fileLocation);
                resolve();
            })
        })
        //handle https download errors
        req.on("error", function (error) {
            console.log("Error downloading file");
            console.log(error);
            reject();
        })
    })
}

module.exports = {
    DownloadFilesFromLinks: async function (fileLinks, user) {
        id = user;

        return new Promise(async function (resolve, reject) {

            console.log('=================================');
            console.log('======DownloadFilesFromLinks=====');
            console.log('=================================');
            console.log();

            await DownloadFilesFromLinks(fileLinks)
                .catch((err) => {
                    if (err) console.log("Error downloading file! :" + err);
                    reject(false);
                })
                .then(() => {
                    console.log("Sucessfully downloaded files from links!");
                    resolve(true);
                })
        })
    }
}