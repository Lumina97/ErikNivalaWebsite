const cssRoot = document.querySelector(":root");
const modalMainCollectionButton = document.getElementById(
  "modalMainCollectionButton"
);
const modalFavCollectionButton = document.getElementById(
  "modalFavCollectionButton"
);

function updateFavoriteButtonPositionValue() {
  //Get button position (relative to parent)
  const favButtonRect = modalFavCollectionButton.getBoundingClientRect();
  const collectionButtonRect =
    modalMainCollectionButton.getBoundingClientRect();

  const favLeft = favButtonRect.left + 75;
  const favTop = favButtonRect.top - 75;

  const collectionLeft = collectionButtonRect.left;
  const collectionTop = collectionButtonRect.top - 75;

  cssRoot.style.setProperty("--favPositionX", `${favLeft}px`);
  cssRoot.style.setProperty("--favPositionY", `${favTop}px`);
  cssRoot.style.setProperty("--collectionPositionX", `${collectionLeft}px`);
  cssRoot.style.setProperty("--collectionPositionY", `${collectionTop}px`);
}

window.addEventListener("resize", () => {
  updateFavoriteButtonPositionValue();
});

window.addEventListener("DOMContentLoaded", () => {
  updateFavoriteButtonPositionValue();
});
