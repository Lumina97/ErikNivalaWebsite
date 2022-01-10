const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const root = path.join(__dirname, "Images");
path.normalize(root);

//=====================FILE DOWNLOAD======================

async function DownloadFilesFromLinks(links, ID) {

    return new Promise(async function (resolve, reject) {

        if (typeof links !== 'undefined') {

            console.log("have image links");
            console.log("Starting download...");
            
            //======================DOWNLOAD FILES
            for (let i = 0; i < links.length; i++) {
                if (links[i].includes('https')) {
                    console.log("Starting HTTPS Download...");
                    await DownloadHTTPSFile(links[i],ID)
                    .catch((err) => 
                    {
                        console.log('Error downloading file, \t'+err);
                        links[i] = null;
                    });
                }
                else if (links[i].includes('http')) {
                    console.log("Starting HTTP Download...");
                    await DownloadHTTPFile(links[i],ID)       
                    .catch((err) => 
                    {
                        console.log('Error downloading file, \t'+err);
                        links[i] = null;
                    });;
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

async function DownloadHTTPSFile(link, ID) {

    return new Promise(async function (resolve, reject) {
        console.log("HTTPS DOWNLOAD: " + link);
        const baseDest = path.join(root  + ID + SubRedditToScan);
        path.normalize(baseDest);

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
        let dest = path.join( baseDest + fileLocation);
        path.normalize(dest);
        

        const req = https.get(link, function (res) {
            const filestream = fs.createWriteStream(dest);
            res.pipe(filestream);

            //handle filestream write errors
            filestream.on("error", function (error) {
                console.log("Error downloading file: ");
                console.log(error);
                reject();
                return;
            })

            // done downloading
            filestream.on("finish", function () {
                filestream.close();
                console.log("Downloaded: " + fileLocation);
                resolve();
                return;
            })
        })
        //handle https download errors
        req.on("error", function (error) {
            console.log("Error downloading file");
            console.log(error);
            reject();
            return;
        })
    })
}

async function DownloadHTTPFile(link, ID) {

    return new Promise(async function (resolve, reject) {
        const baseDest = path.join( root + ID + SubRedditToScan);
        path.normalize(baseDest);
        
        const fileLocationarray = link.split("/");
        const fileLocation = fileLocationarray[fileLocationarray.length - 1];

        let dest = path.join( baseDest + fileLocation);
        path.normalize(dest);

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
    DownloadFilesFromLinks: async function (fileLinks, ID) {

        return new Promise(async function (resolve, reject) {

            console.log();
            console.log('===============================================');
            console.log('=============DownloadFilesFromLinks============');
            console.log('===============================================');
            console.log();

            await DownloadFilesFromLinks(fileLinks, ID)
                .catch((err) => {
                    if (err) console.log("Error downloading file! :" + err);
                    reject(false);
                })
                .then((result) => {
                    console.log("Sucessfully downloaded files from links!");
                    resolve(ID);
                })
        })
    }
}