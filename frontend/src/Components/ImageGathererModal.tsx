import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip, faStar, faX } from "@fortawesome/free-solid-svg-icons";
import { useImageGatherer } from "../Providers/ImageGathererProvider";

import "../css/ImageGathererModal.css";
import ImageListItemComponent from "./ImageListItemComponent";

const ImageGathererModal = () => {
  const {
    setIsModalActive,
    mainImageList,
    favoriteImageList,
    showFavorites,
    setShowFavorites,
    downloadAll,
    downloadSelected,
    clearFavorites,
  } = useImageGatherer();
  return (
    <div id="ImageDisplayModal">
      <div className="modalHeader">
        <div>
          <button
            id="modalMainCollectionButton"
            className={showFavorites ? " " : "activeBtn"}
            onClick={() => {
              setShowFavorites(false);
            }}
          >
            <FontAwesomeIcon icon={faGrip} />
          </button>
          <button
            className={showFavorites ? "activeBtn" : ""}
            id="modalFavCollectionButton"
            onClick={() => {
              setShowFavorites(true);
            }}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
          <select id="sort">
            <option value="" disabled selected>
              Sort...
            </option>
            <option value="sizeAscending">Size &#8593; </option>
            <option value="sizeDescending">Size &darr; </option>
          </select>
        </div>
        <FontAwesomeIcon icon={faX} onClick={() => setIsModalActive(false)} />
      </div>

      <div id="modalContentContainer">
        {(showFavorites ? favoriteImageList : mainImageList).map((item) => {
          return <ImageListItemComponent imageItem={item} />;
        })}
      </div>
      <div className="modalFooter">
        <button onClick={downloadAll}>Download all</button>
        <button onClick={downloadSelected}>Download selected</button>
        <button onClick={clearFavorites}>Clear All favorites</button>
      </div>

      {/* <div id="itemPreview" onclick="closePreview()">
        <i className="fa-solid fa-x" onclick="closePreview()"></i>
        <img src="https://i.redd.it/bfp3yc5jusdd1.jpeg" />
      </div>  */}
    </div>
  );
};

export default ImageGathererModal;
