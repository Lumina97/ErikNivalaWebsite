import { createContext, ReactNode, useContext, useState } from "react";
import { NavigateFunction } from "react-router-dom";

const githubLink = "https://github.com/Lumina97?tab=repositories";

export enum EActiveTab {
  Home = "Home",
  Website = "Website",
  SpaceTrace = "SpaceTrace",
  Saas = "Saas",
  About = "About",
  Github = "Github",
  ImageGatherer = "ImageGatherer",
}

type TActiveTab = keyof typeof EActiveTab;

type TMainContainerProvider = {
  activeTab: TActiveTab;
  onHomeClicked: (navigate: NavigateFunction) => void;
  onImageGathererClicked: (navigate: NavigateFunction) => void;
  onWebsiteClicked: (navigate: NavigateFunction) => void;
  onSpaceTraceClicked: (navigate: NavigateFunction) => void;
  onSaasClicked: (navigate: NavigateFunction) => void;
  onSaasProjectClicked: (navigate: NavigateFunction) => void;
  onAboutClicked: (navigate: NavigateFunction) => void;
  onGitHubClicked: () => void;
};

const MainContainerContext = createContext<TMainContainerProvider>(
  {} as TMainContainerProvider
);
export const MainContainerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<TActiveTab>(EActiveTab.Github);

  const onHomeClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Home);
    if (navigate) navigate("/Home");
  };
  const onWebsiteClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Website);
    if (navigate) navigate("/Website");
  };
  const onImageGathererClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.ImageGatherer);
    if (navigate) navigate("/ImageGatherer");
  };
  const onSpaceTraceClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.SpaceTrace);
    if (navigate) navigate("/SpaceTrace");
  };
  const onSaasClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Saas);
    if (navigate) navigate("/Saas");
  };
  const onSaasProjectClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Saas);
    if (navigate) navigate("/SaaSProject");
  };
  const onAboutClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.About);
    if (navigate) navigate("/About");
  };
  const onGitHubClicked = () => {
    window.open(githubLink, "_blank");
  };

  return (
    <MainContainerContext.Provider
      value={{
        activeTab,
        onHomeClicked,
        onImageGathererClicked,
        onWebsiteClicked,
        onSpaceTraceClicked,
        onSaasClicked,
        onSaasProjectClicked,
        onAboutClicked,
        onGitHubClicked,
      }}
    >
      {children}
    </MainContainerContext.Provider>
  );
};

export const useMainContainer = () => useContext(MainContainerContext);
