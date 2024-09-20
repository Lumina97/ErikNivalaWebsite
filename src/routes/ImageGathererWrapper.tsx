import { ImageGathererProvider } from "../Providers/ImageGathererProvider";
import ImageGatherer from "../Components/ImageGatherer";

const ImageGathererWrapper = () => {
  return (
    <ImageGathererProvider>
      <ImageGatherer />
    </ImageGathererProvider>
  );
};

export default ImageGathererWrapper;
