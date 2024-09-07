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
  OnHomeClicked: (navigate: NavigateFunction) => void;
  OnImageGathererClicked: (navigate: NavigateFunction) => void;
  OnWebsiteClicked: (navigate: NavigateFunction) => void;
  OnSpaceTraceClicked: (navigate: NavigateFunction) => void;
  OnSaasClicked: (navigate: NavigateFunction) => void;
  OnSaasProjectClicked: (navigate: NavigateFunction) => void;
  OnAboutClicked: (navigate: NavigateFunction) => void;
  OnGitHubClicked: () => void;
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

  const OnHomeClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Home);
    if (navigate) navigate("/Home");
  };
  const OnWebsiteClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Website);
    if (navigate) navigate("/Website");
  };
  const OnImageGathererClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.ImageGatherer);
    if (navigate) navigate("/ImageGatherer");
  };
  const OnSpaceTraceClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.SpaceTrace);
    if (navigate) navigate("/SpaceTrace");
  };
  const OnSaasClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Saas);
    if (navigate) navigate("/Saas");
  };
  const OnSaasProjectClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.Saas);
    if (navigate) navigate("/SaaSProject");
  };
  const OnAboutClicked = (navigate: NavigateFunction) => {
    setActiveTab(EActiveTab.About);
    if (navigate) navigate("/About");
  };
  const OnGitHubClicked = () => {
    window.open(githubLink, "_blank");
  };

  return (
    <MainContainerContext.Provider
      value={{
        activeTab,
        OnHomeClicked,
        OnImageGathererClicked,
        OnWebsiteClicked,
        OnSpaceTraceClicked,
        OnSaasClicked,
        OnSaasProjectClicked,
        OnAboutClicked,
        OnGitHubClicked,
      }}
    >
      {children}
    </MainContainerContext.Provider>
  );
};

export const useMainContainer = () => useContext(MainContainerContext);
