import {
  TImageListItem,
  useImageGatherer,
} from "../Providers/ImageGathererProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faRegularHeart,
  faSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faSquareCheck,
  faHeart as faSolidHeart,
} from "@fortawesome/free-solid-svg-icons";

const ImageListItemComponent = ({
  imageItem,
}: {
  imageItem: TImageListItem;
}) => {
  const { toggleFavoriteItem, toggleSelectedItem } = useImageGatherer();

  return (
    <div className="modalItem">
      <div className="imageContainer">
        <img src={imageItem.url.preview} />
      </div>
      <h5 data-size={imageItem.size.width + "x" + imageItem.size.height}>
        Image size
      </h5>
      <div className="modalItemButtons">
        <FontAwesomeIcon
          icon={imageItem.isFavorited ? faSolidHeart : faRegularHeart}
          className="modalItemFav"
          onClick={() => toggleFavoriteItem(imageItem)}
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
