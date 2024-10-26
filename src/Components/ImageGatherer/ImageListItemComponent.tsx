import {
  TImageListItem,
  useImageGatherer,
} from "../../Providers/ImageGathererProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faRegularHeart,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faSquareCheck,
  faHeart as faSolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction } from "react";

const ImageListItemComponent = ({
  imageItem,
  toggleFavoriteAnimation,
  setPreviewImage,
}: {
  imageItem: TImageListItem;
  toggleFavoriteAnimation: () => void;
  setPreviewImage: Dispatch<SetStateAction<string>>;
}) => {
  const { toggleFavoriteItem, toggleSelectedItem, setIsPreviewActive } =
    useImageGatherer();

  return (
    <div className="modalItem">
      <div
        className="imageContainer"
        onClick={() => {
          setPreviewImage(imageItem.url.main);
          setIsPreviewActive(true);
        }}
      >
        <img src={imageItem.url.preview} />
      </div>
      <h5>{imageItem.size.width + "x" + imageItem.size.height}</h5>
      <div className="modalItemButtons">
        <FontAwesomeIcon
          icon={imageItem.isFavorited ? faSolidHeart : faRegularHeart}
          className="modalItemFav"
          onClick={() => {
            toggleFavoriteAnimation();
            toggleFavoriteItem(imageItem);
          }}
        />
        <FontAwesomeIcon
          icon={imageItem.isSelected ? faSquareCheck : faSquare}
          className="modalItemSelect"
          onClick={() => {
            toggleSelectedItem(imageItem);
          }}
        />
      </div>
    </div>
  );
};

export default ImageListItemComponent;
