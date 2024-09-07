import { ImageGathererProvider } from "../Providers/ImageGathererProvider";
import ImageGatherer from "./ImageGatherer";

const ImageGathererWrapper = () => {
  return (
    <ImageGathererProvider>
      <ImageGatherer />
    </ImageGathererProvider>
  );
};

export default ImageGathererWrapper;
