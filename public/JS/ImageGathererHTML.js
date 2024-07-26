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

async function DownloadFile(filepath) {
  console.log("Sending DL request: " + filepath);
  const options = {
    method: "POST",
    body: filepath,
    headers: { "Content-Type": "application/json" },
  };

  await fetch("/download", options).then((result) => {
    window.open("/download");
  });
}

async function addLinksToMainCollection(links) {
  collectionData = [];
  return new Promise((res) => {
    links.forEach((link) => {
      const img = new Image();
      img.src = link;
      img.onload = function () {
        const item = [link, { width: img.width, height: img.height }];
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
          <i class="fa-regular fa-square modalItemSelect" data-item="none" onclick="itemSelected(this)"></i>
        </div>
  `;
  itemElement.innerHTML = newContent;
  const h5 = itemElement.querySelector("h5");
  h5.textContent = `${item[1].width} x ${item[1].height}`;
  h5.dataset.size = JSON.stringify([item[1].width, item[1].height]);
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
      imagePreview.querySelector("img").src = item[0];
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
      collectionModal.style.display = "block";
    });
  } else {
    await createCollectionHTMLItems(favoriteCollectionData).then(() => {
      collectionModal.style.display = "block";
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

function itemSelected(element) {}
