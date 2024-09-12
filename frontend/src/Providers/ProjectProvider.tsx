import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

export enum EActiveTab {
  None = "None",
  SpaceTrace = "SpaceTrace",
  Saas = "Saas",
  ImageGatherer = "ImageGatherer",
}

export type TActiveTab = keyof typeof EActiveTab;

type TProjectProvider = {
  activeTab: TActiveTab;
  setActiveTab: Dispatch<SetStateAction<TActiveTab>>;
};

const ProjectContext = createContext<TProjectProvider>({} as TProjectProvider);
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TActiveTab>(EActiveTab.None);

  return (
    <ProjectContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
