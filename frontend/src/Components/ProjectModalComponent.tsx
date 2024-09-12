import ImageGatherer from "../routes/ImageGatherer";

import "../css/projectModal.css";
import { ImageGathererProvider } from "../Providers/ImageGathererProvider";
import { useCallback, useEffect } from "react";
import { EActiveTab, useProject } from "../Providers/ProjectProvider";

const ProjectModalComponent = () => {
  const { setActiveTab } = useProject();

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveTab(EActiveTab.None);
      }
    },
    [setActiveTab]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className="projectModal">
      <div className="projectModalPositioningWrapper"></div>
      <ImageGathererProvider>
        <ImageGatherer />
      </ImageGathererProvider>
    </div>
  );
};

export default ProjectModalComponent;
