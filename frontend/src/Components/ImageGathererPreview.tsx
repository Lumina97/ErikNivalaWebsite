import { useImageGatherer } from "../Providers/ImageGathererProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const ImageGathererPreview = ({ imageLink }: { imageLink: string }) => {
  const { setIsPreviewActive } = useImageGatherer();
  return (
    <div id="itemPreview" onClick={() => setIsPreviewActive(false)}>
      <FontAwesomeIcon
        className="FontAwesome"
        icon={faX}
        onClick={() => setIsPreviewActive(false)}
      />
      <img src={imageLink} />
    </div>
  );
};

export default ImageGathererPreview;
