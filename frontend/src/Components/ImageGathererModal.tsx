import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip, faStar, faX } from "@fortawesome/free-solid-svg-icons";
import { useImageGatherer } from "../Providers/ImageGathererProvider";
import ImageListItemComponent from "./ImageListItemComponent";
import ImageGathererPreview from "./ImageGathererPreview";
import { useRef, useState } from "react";

import "../css/ImageGathererModal.css";

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
    isPreviewActive,
    sortCollection,
  } = useImageGatherer();

  const [previewImageLink, setPreviewImageLink] = useState<string>("");
  const imageList = showFavorites ? favoriteImageList : mainImageList;
  const favoriteButtonRef = useRef<HTMLButtonElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);
  const toggleButtonAnimation = () => {
    (showFavorites ? favoriteButtonRef : mainButtonRef).current?.classList.add(
      "buttonWiggleAnimation"
    );
  };

  return (
    <div id="ImageDisplayModal">
      <div className="modalHeader">
        <div>
          <button
            ref={mainButtonRef}
            id="modalMainCollectionButton"
            className={showFavorites ? " " : "activeBtn"}
            onClick={() => {
              toggleButtonAnimation();
              setShowFavorites(false);
            }}
          >
            <FontAwesomeIcon className="FontAwesome" icon={faGrip} />
          </button>
          <button
            ref={favoriteButtonRef}
            className={showFavorites ? "activeBtn" : ""}
            id="modalFavCollectionButton"
            onClick={() => {
              toggleButtonAnimation();
              setShowFavorites(true);
            }}
          >
            <FontAwesomeIcon className="FontAwesome" icon={faStar} />
          </button>
          <select
            id="sort"
            onChange={(e) => sortCollection(e.target.value === "true")}
          >
            <option value="" disabled selected>
              Sort...
            </option>
            <option value={"true"}>Size &#8593; </option>
            <option value={"false"}>Size &darr; </option>
          </select>
        </div>
        <FontAwesomeIcon
          className="FontAwesome"
          icon={faX}
          onClick={() => setIsModalActive(false)}
        />
      </div>

      <div id="modalContentContainer">
        {imageList.length === 0 && (
          <p className="ModalErrorText">
            No images gathered yet, try sending a request!
          </p>
        )}
        {imageList.map((item) => {
          return (
            <ImageListItemComponent
              imageItem={item}
              setPreviewImage={setPreviewImageLink}
            />
          );
        })}
      </div>
      <div className="modalFooter">
        <button onClick={downloadAll}>Download all</button>
        <button onClick={downloadSelected}>Download selected</button>
        <button onClick={clearFavorites}>Clear All favorites</button>
      </div>
      {isPreviewActive && <ImageGathererPreview imageLink={previewImageLink} />}
    </div>
  );
};

export default ImageGathererModal;
