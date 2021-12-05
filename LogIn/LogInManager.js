const { Console } = require('console');
const { copyFile } = require('fs');
const Datastore = require('nedb');

const database = new Datastore('LogInData.db');
database.loadDatabase();


async function CreateAccount(username, password) {
    return new Promise(async function (resolve, reject) {
        await database.find({ Username: username }, async function (err, docs) {
            if (docs.length > 0 &&  docs[0].Username == username) {
                console.log("Username already exists!");
                reject("Username already exists!");
                return;
            }
            else if (err != null) {
                console.log("There was an error searching the database for the username! - LogInManager.js\n " + err);
                reject(err);
                return;
            }

            else {
                const data = { 'Username': username, 'Password': password };
                database.insert(data);
                resolve("Sucessfully created account!");
                return;
            }
        })
    })
}



async function ValidateLogin(username, password) {
    return new Promise(async function (resolve, reject) {

        await database.find({ Username: username, Password: password }, async function (err, docs) {
            if (docs != null && docs.length > 0) {
                console.log(docs[0].Username);
                console.log("matching username");
                resolve('true');
                return;
            }

            if (err != null) {
                console.log("There has been an error retrieving log in information from the database. -LoginManager.js\n " + err);
                reject(err);
                return;
            }

            const text ="Username or password are wrong.";
            console.log(text);
            reject(text);
        });
    });

}


module.exports =
{

    CreateNewAccount: async function (username, password) {
        return new Promise(async function (resolve, reject) {
            await CreateAccount(username, password)
                .then((result) => {
                    console.log("sucessfully added new account!");
                    resolve(result);
                })
                .catch((err) => {
                    console.log("Error Creating account! - LogInManager.js \n" + err);
                    reject(err);
                })
        })
    },

    ValidateLogInInformation: async function (username, password) {
        return new Promise(async function (resolve, reject) {

            await ValidateLogin(username, password)
                .then((result) => {
                    console.log("Resolving log in: " + result);
                    resolve(result);
                    return;
                })
                .catch(((err) => {
                    if (err) {
                        console.log("There has been an error with the log in. - LogInManager.js\n " + err);
                        reject(err);
                        return;
                    }
                }))
        })
    }

}