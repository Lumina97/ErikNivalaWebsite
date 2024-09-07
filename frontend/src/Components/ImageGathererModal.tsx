const ImageGathererModal = () => {
  return (
    <div id="ImageDisplayModal">
      <div className="modalHeader">
        <div>
          <button
            id="modalMainCollectionButton"
            className="activeBtn"
            // onclick="openMainCollection()"
          >
            <i className="fa-solid fa-grip"></i>
          </button>
          <button
            id="modalFavCollectionButton"
            //onClick="openFavoritesCollection()"
          >
            <i className="fa-solid fa-star"></i>
          </button>
          <select id="sort">
            <option value="" disabled selected>
              Sort...
            </option>
            <option value="sizeAscending">Size &#8593; </option>
            <option value="sizeDescending">Size &darr; </option>
          </select>
        </div>
        {/* <i className="fa-solid fa-x" onclick="closeCollection()"></i> */}
      </div>

      <div id="modalContentContainer"></div>
      <div className="modalFooter">
        {/* <button onclick="downloadAll()">Download all</button>
        <button onclick="downloadSelected()">Download selected</button>
        <button onclick="clearFavorites()">Clear All favorites</button> */}
      </div>

      {/* <div id="itemPreview" onclick="closePreview()">
        <i className="fa-solid fa-x" onclick="closePreview()"></i>
        <img src="https://i.redd.it/bfp3yc5jusdd1.jpeg" />
      </div> */}
    </div>
  );
};

export default ImageGathererModal;
