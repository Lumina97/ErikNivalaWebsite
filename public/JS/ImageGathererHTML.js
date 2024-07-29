const collectionModal = document.getElementById("ImageDisplayModal");
const loader = document.getElementById("loader");
const imagePreview = document.getElementById("itemPreview");
const errorTextBox = document.getElementById("ErrorText");
const modalMainCollectionButton = document.getElementById(
  "modalMainCollectionButton"
);
const modalFavCollectionButton = document.getElementById(
  "modalFavCollectionButton"
);
const collectionStorageKey = "collection";
const favoritesStorageKey = "favorites";
const selectedItems = [];

let collectionData = [];
let favoriteCollectionData = [];
let wasFavoritesOpen = false;

loader.style.opacity = 0;
collectionModal.style.display = "none";
imagePreview.style.display = "none";

loadLastMainCollection();
loadFavoritesCollection();
window.addEventListener("beforeunload", beforeUnload);

function beforeUnload() {
  saveFavoritesCollection();
  saveCurrentMainCollection();
}

function GetFiltersFromList() {
  var filterList = document.getElementById("FilterUnorderedList");
  var filters = {};
  for (let i = 0; i < filterList.childElementCount; i++) {
    filters[i] = filterList.childNodes[i].innerText;
  }
  return filters;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setErrorText(message) {
  errorTextBox.textContent = message;
}

function saveCurrentMainCollection() {
  if (!collectionData) return;
  localStorage.removeItem(collectionStorageKey);
  localStorage.setItem(collectionStorageKey, JSON.stringify(collectionData));
}

function loadLastMainCollection() {
  try {
    if (localStorage.getItem(collectionStorageKey) !== null) {
      collectionData = JSON.parse(localStorage.getItem(collectionStorageKey));
    }
  } catch (error) {
    console.error(error);
  }
}

function saveFavoritesCollection() {
  if (localStorage.getItem(favoritesStorageKey) !== null) {
    const tempArray = JSON.parse(localStorage.getItem(favoritesStorageKey));
    tempArray.forEach((element) => {
      if (!favoriteCollectionData.some((item) => item[0] === element[0]))
        favoriteCollectionData.push(element);
    });
  }
  localStorage.setItem(
    favoritesStorageKey,
    JSON.stringify(favoriteCollectionData)
  );
}

function loadFavoritesCollection() {
  try {
    if (localStorage.getItem(favoritesStorageKey) !== null) {
      favoriteCollectionData = JSON.parse(
        localStorage.getItem(favoritesStorageKey)
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function sendImageGatheringRequest() {
  const subreddit = document.getElementById("subredditToSearch").value;
  const amount = document.getElementById("SearchAmount").value;

  setErrorText(" ");

  let filters = GetFiltersFromList();
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
      await delay(amount);
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
    links.forEach((links) => {
      const img = new Image();
      img.src = links[1]; //full size image
      img.onload = function () {
        const item = [
          links[0], //thumbnail
          links[1], //actual image
          { width: img.width, height: img.height }, //size data
        ];
        if (!favoriteCollectionData.includes(item)) collectionData.push(item);
      };
    });
    res();
  });
}

function addItemToFavorites(item) {
  const index = favoriteCollectionData.indexOf(item);
  if (index === -1) {
    favoriteCollectionData.push(item);
  }
}

function removeItemFromFavorites(item) {
  const index = favoriteCollectionData.indexOf(item);
  if (index !== -1) {
    favoriteCollectionData.splice(index, 1);
  }
}

function addItemToMainCollection(item) {
  const index = collectionData.indexOf(item);
  if (index === -1) {
    collectionData.push(item);
  }
}

function removeItemFromMainCollection(item) {
  const index = collectionData.indexOf(item);
  if (index !== -1) {
    collectionData.splice(index, 1);
  }
}

async function createCollectionHTMLItems(collectionList) {
  selectedItems.length = 0;
  return new Promise((res) => {
    const collectionItemContainer = document.getElementById(
      "modalContentContainer"
    );
    collectionItemContainer.innerHTML = "";

    collectionList.forEach((item) => {
      const element = createHTMLImageElement(item);
      addCollectionItemOnClick(element, item);
      collectionItemContainer.appendChild(element);
    });
    res();
  });
}

function createHTMLImageElement(item) {
  //create HTML Item
  const itemElement = document.createElement("div");
  itemElement.classList.add("modalItem");
  var newContent = `
        <div class="imageContainer">
          <img src='${item[0]}'/>
        </div>
        <h5 data-size="0x0">Image size</h5>
        <div class="modalItemButtons">
          <i class="fa-regular fa-heart modalItemFav"></i>
          <i class="fa-regular fa-square modalItemSelect" data-item="none"></i>
        </div>
  `;
  itemElement.innerHTML = newContent;
  const h5 = itemElement.querySelector("h5");
  h5.textContent = `${item[2].width} x ${item[2].height}`;
  h5.dataset.size = JSON.stringify([item[2].width, item[2].height]);
  if (favoriteCollectionData.includes(item)) {
    const favItem = itemElement.querySelector(".modalItemFav");
    favItem.classList.remove("fa-regular");
    favItem.classList.add("fa-solid");
  }
  itemElement.querySelector(".modalItemSelect").dataset.item =
    JSON.stringify(item);

  return itemElement;
}

function addCollectionItemOnClick(htmlElement, item) {
  htmlElement.querySelector("img").addEventListener("click", () => {
    if (imagePreview) {
      imagePreview.querySelector("img").src = item[1];
      imagePreview.style.display = "block";
    }
  });
  htmlElement
    .querySelector(".modalItemFav")
    .addEventListener("click", function () {
      if (favoriteCollectionData.includes(item)) {
        removeItemFromFavorites(item);
        addItemToMainCollection(item);
        this.classList.remove("fa-solid");
        this.classList.add("fa-regular");
      } else {
        removeItemFromMainCollection(item);
        addItemToFavorites(item);
        this.classList.remove("fa-regular");
        this.classList.add("fa-solid");
      }
      openCollection();
    });

  htmlElement
    .querySelector(".modalItemSelect")
    .addEventListener("click", function () {
      const selectedItem = JSON.parse(this.dataset.item);
      const index = selectedItems.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(selectedItem)
      );

      if (index === -1) {
        selectedItems.push(item);
        this.classList.remove("fa-square");
        this.classList.add("fa-square-check");
      } else {
        selectedItems.splice(index, 1);
        this.classList.add("fa-square");
        this.classList.remove("fa-square-check");
      }
    });
}

window.onload = function () {
  const node = document.getElementById("TitleFilters");
  if (node) {
    node.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        AddFilterToList();
      }
    });
  }
};

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

async function openCollection() {
  if (!wasFavoritesOpen) {
    await createCollectionHTMLItems(collectionData).then(() => {
      collectionModal.style.display = "flex";
    });
  } else {
    await createCollectionHTMLItems(favoriteCollectionData).then(() => {
      collectionModal.style.display = "flex";
    });
  }
}

function openMainCollection() {
  wasFavoritesOpen = false;
  modalMainCollectionButton.classList.add("activeBtn");
  modalFavCollectionButton.classList.remove("activeBtn");
  openCollection();
}

function openFavoritesCollection() {
  wasFavoritesOpen = true;
  modalMainCollectionButton.classList.remove("activeBtn");
  modalFavCollectionButton.classList.add("activeBtn");
  openCollection();
}

function closeCollection() {
  collectionModal.style.display = "none";
}

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

function clearFavorites() {
  favoriteCollectionData = [];
  localStorage.setItem(favoritesStorageKey, JSON.stringify([]));
  if (wasFavoritesOpen) openFavoritesCollection();
}

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
