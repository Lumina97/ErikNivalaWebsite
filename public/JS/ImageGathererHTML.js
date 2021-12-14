// Reddit Server Requests
async function SendImageGatheringRequest() {
    const subreddit = document.getElementById('subredditToSearch').value;
    const amount = document.getElementById('SearchAmount').value;

    const sendData = { subreddit, amount };
    console.log("Sending data: " + JSON.stringify(sendData));
    const options = {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/ImageLoader', options);
    const data = response.json()
        .catch((error) => {
            console.log('ERROR:' + error);
            return;
        })
        .then(async function (result) {
            console.log(result);
            if (result.ERROR) {
                console.log("ERROR:" + result.ERROR);
                return;
            }
            DownloadFile(result);
        });

}

async function DownloadFile(filepath) {

    const options = {
        method: 'POST',
        body: filepath,
        headers: { 'Content-Type': 'application/json' }
    };

    console.log('Sent download request to path: ' + filepath);
    const response = await fetch('/download', options)
        .then((result) => {
            window.open('/download');
        });

    console.log(response);   
}


async function LogOutBTN() {
    const options =
    {
        method: 'GET'
    };
    const response = await fetch('/LogOut', options);
    console.log(response);
    location.href = '/';
}