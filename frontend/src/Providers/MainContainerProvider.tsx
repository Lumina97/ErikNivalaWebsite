import { createContext, ReactNode, useState } from "react";

type TActiveTab =
  | "Home"
  | "Website"
  | "SpaceTrace"
  | "SaaS"
  | "About"
  | "Github"
  | "ImageGatherer";

type TMainContainerProvider = {
  activeTab: TActiveTab;
  OnHomeClicked: () => void;
  OnImageGathererClicked: () => void;
  OnWebsiteClicked: () => void;
  OnSpaceTraceClicked: () => void;
  OnSaasProjectClicked: () => void;
  OnAboutClicked: () => void;
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
  const [activeTab, setActiveTab] = useState<TActiveTab>("Home");

  const OnHomeClicked = () => {
    setActiveTab("Home");
  };
  const OnWebsiteClicked = () => {
    setActiveTab("Website");
  };
  const OnImageGathererClicked = () => {
    setActiveTab("ImageGatherer");
  };
  const OnSpaceTraceClicked = () => {
    setActiveTab("SpaceTrace");
  };
  const OnSaasProjectClicked = () => {
    setActiveTab("SaaS");
  };
  const OnAboutClicked = () => {
    setActiveTab("About");
  };
  const OnGitHubClicked = () => {
    setActiveTab("Github");
  };

  return (
    <MainContainerContext.Provider
      value={{
        activeTab,
        OnHomeClicked,
        OnImageGathererClicked,
        OnWebsiteClicked,
        OnSpaceTraceClicked,
        OnSaasProjectClicked,
        OnAboutClicked,
        OnGitHubClicked,
      }}
    >
      {children}
    </MainContainerContext.Provider>
  );
};
