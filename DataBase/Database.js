const Datastore = require('nedb');

const database = new Datastore('LogInData.db');
database.loadDatabase();

async function FindUser(username)
{
    return new Promise(async function(resolve, reject) 
    {
        console.log('Looking for username');
        await database.find({ "Username": username}, async function(err,docs) {
            if(docs.length > 0 && docs[0].Username == username) {
                console.log('User exists!');
                const User = {'Username' : docs[0].Username, 'Password': docs[0].Password};
                resolve(User);
                return;
            }
            else if(err != null) {
                console.log('Error while accessing database: ' +err);
                reject( new Error(err));
                return;
            }
            else{
                console.log('User does not exist!');
                reject('User does not exist');
                return;
            }
        })
    });
}

async function AddUser(username, password)
{
    return new Promise( async function(resolve, reject) {
        await FindUser()
        .then((result) => {
            const error = 'User already exists!'
            console.log(error + '\n');
            reject(error);
            return;
        })
        .catch((error) => {
            if(error instanceof Error )
            {
                console.log(error + '\n');
                reject(error);
                return;
            }
            else
            {
                console.log('Adding user to database!');
                const data = { 'Username' : username, 'Password' : password};
                database.insert(data);
                resolve('Added user!');
            }
        })
    });
}



module.exports = 
{
    FindUserInDatabase: async function (username)
    {
        return new Promise(async function(resolve,reject){
            await FindUser(username)
            .then((result) => {
                console.log('Found user:');
                resolve(result);
                return;
            })
            .catch((error) => {
                reject(error);
                return;
            });
        })
    },

    AddUserToDatabase: async function(username, password) {
        return new Promise(async function(resolve,reject){
            await AddUser(username,password)
            .then((result)=> {
                console.log(result);
                resolve(result);
                return;
            })
            .catch((error) => {
                console.log(error);
                reject(error);
                return;           
            })
        })
    }
}