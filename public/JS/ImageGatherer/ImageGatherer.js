const loader = document.getElementById("loader");
const imagePreview = document.getElementById("itemPreview");
const errorTextBox = document.getElementById("ErrorText");

const selectedItems = [];
loader.style.opacity = 0;
imagePreview.style.display = "none";

window.addEventListener("beforeunload", beforeUnload);

window.onload = function () {
  const node = document.getElementById("TitleFilters");
  if (node) {
    node.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        addFilterToList();
      }
    });
  }
};

function beforeUnload() {
  saveFavoritesCollection();
  saveCurrentMainCollection();
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setErrorText(message) {
  errorTextBox.textContent = message;
}

/*------------------------ Request Title filters*/
async function sendImageGatheringRequest() {
  const subreddit = document.getElementById("subredditToSearch").value;
  const amount = document.getElementById("SearchAmount").value;

  setErrorText(" ");

  let filters = getFiltersFromList();
  loader.style.opacity = 100;

  const sendData = { subreddit, amount, filters };
  const options = {
    method: "POST",
    body: JSON.stringify(sendData),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch("/ImageLoader", options);
  response
    .json()
    .then(async function (result) {
      const data = JSON.parse(result);
      await addLinksToMainCollection(data.links);
      await delay(+amount + 200);
      openCollection();
      saveCurrentMainCollection();
    })
    .catch((error) => {
      loader.style.opacity = 0;
      setErrorText(error);
      return;
    });
  loader.style.opacity = 0;
}

async function addLinksToMainCollection(links) {
  collectionData = [];
  return new Promise((res) => {
    links.forEach((link) => {
      const img = new Image();
      img.src = link[1]; //full size image
      img.onload = function () {
        const item = [
          link[0], //thumbnail
          link[1], //actual image
          { width: img.width, height: img.height }, //size data
        ];
        collectionData.push(item);
      };
    });
    res();
  });
}

function addFilterToList() {
  const listElement = document.getElementById("FilterUnorderedList");
  const FilterInputField = document.getElementById("TitleFilters");

  if (FilterInputField.value == "") return;

  var li = document.createElement("li");
  li.innerText = FilterInputField.value;
  listElement.appendChild(li);
  FilterInputField.value = null;
}

async function clearFilters() {
  const listElement = document.getElementById("FilterUnorderedList");
  listElement.innerHTML = "";
}

function getFiltersFromList() {
  var filterList = document.getElementById("FilterUnorderedList");
  var filters = [];
  for (let i = 0; i < filterList.childElementCount; i++) {
    filters[i] = filterList.childNodes[i].innerText;
  }
  return filters;
}

/*------------------------Button Functions */
function closePreview() {
  imagePreview.querySelector("img").src = " ";
  imagePreview.style.display = "none";
}

function downloadAll() {
  const links = wasFavoritesOpen
    ? favoriteCollectionData.map((item) => item[1])
    : collectionData.map((item) => item[1]);
  sendLinksToDownload(links);
}

function downloadSelected() {
  const links =
    selectedItems.length > 0 ? selectedItems.map((item) => item[1]) : undefined;
  links && sendLinksToDownload(links);
}

/*------------------------Download call */
async function sendLinksToDownload(links) {
  if (!links || links.length === 0) return;

  const options = {
    method: "POST",
    body: JSON.stringify({ links: links }),
    headers: { "Content-Type": "application/json" },
  };

  await fetch("/downloadFilesFromLinks", options).then((response) => {
    response.json().then(() => {
      DownloadFile();
    });
  });
}

async function DownloadFile() {
  const link = document.createElement("a");
  link.href = "/download";
  link.click();
}
