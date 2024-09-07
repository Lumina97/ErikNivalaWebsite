import { createContext, ReactNode, useContext, useState } from "react";

type TImageGathererProvider = {
  isModalActive: boolean;
  setIsModalActive: (newValue: boolean) => void;
  isPreviewActive: boolean;
  setisPreviewActive: (newValue: boolean) => void;
};

const ImageGathererContext = createContext<TImageGathererProvider>(
  {} as TImageGathererProvider
);
export const MainContainerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [isPreviewActive, setisPreviewActive] = useState<boolean>(false);

  // const sendImageGatheringRequest = () => {};

  return (
    <ImageGathererContext.Provider
      value={{
        isModalActive,
        setIsModalActive,
        isPreviewActive,
        setisPreviewActive,
      }}
    >
      {children}
    </ImageGathererContext.Provider>
  );
};

export const useImageGatherer = () => useContext(ImageGathererContext);
