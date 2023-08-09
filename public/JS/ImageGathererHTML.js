window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    loader.style.opacity = 0;
})

function GetFiltersFromList() {
    var filterList = document.getElementById('FilterUnorderedList');
    var filters = {};
    for (let i = 0; i < filterList.childElementCount; i++) {
        filters[i] = filterList.childNodes[i].innerText;
    }
    return filters;
}

async function SendImageGatheringRequest() {
    var subreddit = document.getElementById('subredditToSearch').value;
    var amount = document.getElementById('SearchAmount').value;
    var errorTextbox = document.getElementById('ErrorText');

    //Get values fr
    errorTextbox.textContent = " ";

    var filters = GetFiltersFromList();
    loader.style.opacity = 100;

    const sendData = { subreddit, amount, filters };
    console.log(JSON.stringify(sendData));
    const options = {
        method: 'POST',
        body: JSON.stringify(sendData),
        headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/ImageLoader', options)
    response.json()
        .then(async function (result) {
            console.log(result);
            if (result !== undefined && result.ERROR) {
                errorTextbox.textContent = result.ERROR;
                return;
            }
            else {
                DownloadFile(result);
            }
        })
        .catch((error) => {
            errorTextbox.textContent = error;
            loader.style.opacity = 0;
            return;
        });
    loader.style.opacity = 0;
}

async function DownloadFile(filepath) {

    console.log("Sending DL request: " + filepath);
    const options = {
        method: 'POST',
        body: filepath,
        headers: { 'Content-Type': 'application/json' }
    };

    await fetch('/download', options)
        .then((result) => {
            window.open('/download');
        });
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

function AddFilterToList() {
    const listElement = document.getElementById("FilterUnorderedList");
    const FilterInputField = document.getElementById("TitleFilters");

    if (FilterInputField.value == "") return;

    var li = document.createElement("li");
    li.innerText = FilterInputField.value;
    listElement.appendChild(li);
    FilterInputField.value = null;
}

async function ClearFilters() {
    const listElement = document.getElementById("FilterUnorderedList");
    listElement.innerHTML = "";
}