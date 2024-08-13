const collectionModal = document.getElementById("ImageDisplayModal");
let collectionData = [];
let favoriteCollectionData = [];
let wasFavoritesOpen = false;

const collectionStorageKey = "collection";
const favoritesStorageKey = "favorites";

loadLastMainCollection();
loadFavoritesCollection();

/*------------------------ Collection Saving*/
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
      if (!favoriteCollectionData.some((item) => item[0] === element[0])) {
        favoriteCollectionData.push(element);
      }
    });
  }
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

function updateModalItemAbsolutePositionValues(htmlElement) {
  const itemRect = htmlElement.getBoundingClientRect();
  const left = itemRect.left;
  const top = itemRect.top;
  cssRoot.style.setProperty("--modalItemInitialPositionX", `${left}px`);
  cssRoot.style.setProperty("--modalItemInitialPositionY", `${top}px`);
}

function addAnimationToModalItem(HTMLitem, item, animationName) {
  updateModalItemAbsolutePositionValues(HTMLitem);
  const tempItem = createHTMLImageElement(item);
  document.body.appendChild(tempItem);
  tempItem.classList.add(animationName);
  setTimeout(function () {
    tempItem.remove();
  }, 1000);
}

function triggerButtonAnimation(button) {
  button.classList.add("buttonWiggleAnimation");
  setTimeout(function () {
    button.classList.remove("buttonWiggleAnimation");
  }, 1200);
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
      const fav = favoriteCollectionData.includes(item);
      const options = {
        removeCollection: fav ? favoriteCollectionData : collectionData,
        addCollection: fav ? collectionData : favoriteCollectionData,
        button: fav ? modalMainCollectionButton : modalFavCollectionButton,
        animation: fav
          ? "addToMainCollectionAnimation"
          : "addToFavoriteAnimation",
        classToRemove: fav ? "fa-solid" : "fa-regular",
        classToAdd: fav ? "fa-regular" : "fa-solid",
      };

      this.classList.remove(options.classToRemove);
      this.classList.add(options.classToAdd);
      addAnimationToModalItem(htmlElement, item, options.animation);
      triggerButtonAnimation(options.button);
      removeItemFromCollection(item, options.removeCollection);
      addItemToCollection(item, options.addCollection);
      reloadCollection();
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

function removeItemFromCollection(item, collection) {
  const index = collection.indexOf(item);
  index !== -1 && collection.splice(index, 1);
}

function addItemToCollection(item, collection) {
  if (collection.indexOf(item) === -1) {
    collection.push(item);
  }
}

async function reloadCollection() {
  (await wasFavoritesOpen)
    ? createCollectionHTMLItems(favoriteCollectionData)
    : createCollectionHTMLItems(collectionData).then(() => {
        collectionModal.style.display = "flex";
      });
}

function openMainCollection() {
  wasFavoritesOpen = false;
  modalMainCollectionButton.classList.add("activeBtn");
  modalFavCollectionButton.classList.remove("activeBtn");
  reloadCollection();
}

function openFavoritesCollection() {
  wasFavoritesOpen = true;
  modalMainCollectionButton.classList.remove("activeBtn");
  modalFavCollectionButton.classList.add("activeBtn");
  reloadCollection();
}

function openCollection() {
  wasFavoritesOpen ? openFavoritesCollection() : openMainCollection();
}

function closeCollection() {
  collectionModal.style.display = "none";
}
