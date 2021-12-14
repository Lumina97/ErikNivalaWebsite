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
    const data = response.json().then(async function (result) {
        console.log(result);
        if (result.ERROR) {
            console.log("ERROR:" + result.ERROR);
            return;
        }

        console.log('Sending path to download!');
        await DownloadFile(result);
    });
}

async function DownloadFile(filepath) {
    const options = {
        method: 'POST',
        body: JSON.stringify(filepath),
        headers: { 'Content-Type': 'application/json' }
    };
    console.log('Sent download request!');
    const response = await fetch('/download', options);
    console.log(response.body);
}


async function LogOutBTN () {
    const options =
    {
        method: 'GET'
    };
    const response = await fetch('/LogOut', options);
    console.log(response);
    location.href= '/';
}