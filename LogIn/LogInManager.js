const Database = require('../DataBase/Database');

async function CreateAccount(username, password) {
    return new Promise(async function (resolve, reject) {
        await Database.AddUserToDatabase(username, password)
            .catch((error) => {
                console.log(error);
                reject(error);
                return;
            })
            .then((result) => {
                console.log(result);
                resolve(result);
                return;
            })
    })
}

async function ValidateLogin(username, password) {
    return new Promise(async function (resolve, reject) {

        await Database.FindUserInDatabase(username)
        .catch((error) =>{
            console.log('ERROR:' + error);
            reject(error);
            return;
        })
        .then((result) =>{
            if(result.Password == password)
            {
                console.log('Username and password match!');
                resolve(true);
                return;
            }
            else {
                const text = 'Username or password are wrong!';
                console.log(text);
                reject(text);
            }


        })       
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