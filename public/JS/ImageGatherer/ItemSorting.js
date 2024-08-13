const sortSelect = document.getElementById("sort");

sortSelect.addEventListener("change", function (event) {
  const selectedValue = event.target.value;
  selectedValue === "sizeAscending"
    ? sortCollection(true)
    : sortCollection(false);
});

function sortCollection(bFilterAscending) {
  const sortFunction = bFilterAscending
    ? (a, b) => {
        const areaA = a[2].width * a[2].height;
        const areaB = b[2].width * b[2].height;
        return areaB - areaA;
      }
    : (a, b) => {
        const areaA = a[2].width * a[2].height;
        const areaB = b[2].width * b[2].height;
        return areaA - areaB;
      };

  favoriteCollectionData.sort(sortFunction);
  collectionData.sort(sortFunction);

  reloadCollection();
}
