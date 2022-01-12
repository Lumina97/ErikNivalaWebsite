// Reddit Server Requests
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
     loader.style.opacity = 0;
})


async function SendImageGatheringRequest() {
    const subreddit = document.getElementById('subredditToSearch').value;
    const amount = document.getElementById('SearchAmount').value;
    const filterList = document.getElementById('FilterUnorderedList');

    var filters = {};
    for(let i = 0 ; i < filterList.childElementCount; i++)
    {
        filters[i] = filterList.childNodes[i].innerText;
    }    

    loader.style.opacity = 100;
    
    const sendData = { subreddit, amount, filters };
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
            loader.style.opacity = 0;
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

window.onload = function () {
    const node = document.getElementById("TitleFilters");
    if (node) {
        node.addEventListener('keyup', function (event) {
            if (event.key === "Enter") {
                AddFilterToList();
            }
        });
    }
    else {
        console.log('NEIN!!');
    }
}

function AddFilterToList()
{
    const listElement = document.getElementById("FilterUnorderedList");
    const FilterInputField = document.getElementById("TitleFilters");

    
    if (FilterInputField.value == "") return;
    
    console.log('Adding to list: ' + FilterInputField.value);
    var li = document.createElement("li");
    li.innerText = FilterInputField.value;
    listElement.appendChild(li);
    FilterInputField.value = null;
}

async function ClearFilters()
{
    const listElement = document.getElementById("FilterUnorderedList");
    listElement.innerHTML = "";
}