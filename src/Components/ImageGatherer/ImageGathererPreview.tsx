import { useCallback, useEffect } from "react";
import { useImageGatherer } from "../../Providers/ImageGathererProvider";
const ImageGathererPreview = ({ imageLink }: { imageLink: string }) => {
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsPreviewActive(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const { setIsPreviewActive } = useImageGatherer();
  return (
    <div id="itemPreview" onClick={() => setIsPreviewActive(false)}>
      <img src={imageLink} />
    </div>
  );
};

export default ImageGathererPreview;
