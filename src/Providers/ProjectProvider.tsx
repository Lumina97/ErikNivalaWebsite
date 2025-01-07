import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StopPlayingSpaceTrace } from "../JS/SpaceTrace";

export enum EActiveTab {
  None = "None",
  SpaceTrace = "SpaceTrace",
  Saas = "Saas",
  ImageGatherer = "ImageGatherer",
  hannulawells = "hannulawells",
  tyriaTracker = "tyriaTracker",
}

export type TActiveTab = keyof typeof EActiveTab;
type TProjectProvider = {
  activeTab: TActiveTab;
  changeActiveTab: (newActiveTab: EActiveTab) => void;
};

const ProjectContext = createContext<TProjectProvider>({} as TProjectProvider);
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TActiveTab>(EActiveTab.None);

  const scrollToTop = () => {
    const section = document.getElementById("home");
    if (section) {
      section.scrollIntoView({ behavior: "instant" });
    }
  };

  const changeActiveTab = (newActiveTab: EActiveTab) => {
    setActiveTab(newActiveTab);
    scrollToTop();
    StopPlayingSpaceTrace();
    switch (newActiveTab) {
      case EActiveTab.ImageGatherer:
        navigate("/ImageGatherer");
        break;
      case EActiveTab.Saas:
        navigate("/Saas");
        break;
      case EActiveTab.SpaceTrace:
        navigate("/SpaceTrace");
        break;
      case EActiveTab.hannulawells:
        window.open(
          "https://hannulawells.com",
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case EActiveTab.tyriaTracker:
        window.open(
          "https://tyria-tracker.vercel.app",
          "_blank",
          "noopener,noreferrer"
        );
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        activeTab,
        changeActiveTab,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
