import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TImageGathererProvider = {
  isModalActive: boolean;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  isPreviewActive: boolean;
  setIsPreviewActive: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  sendImageGatheringRequest: (
    subreddit: string,
    amount: number,
    filters: string[]
  ) => Promise<void>;
  responseError: string;
  mainImageList: TImageListItem[];
  favoriteImageList: TImageListItem[];
  toggleFavoriteItem: (item: TImageListItem) => void;
  toggleSelectedItem: (item: TImageListItem) => void;
  showFavorites: boolean;
  setShowFavorites: Dispatch<SetStateAction<boolean>>;
  downloadAll: () => void;
  downloadSelected: () => void;
  clearFavorites: () => void;
  sortCollection: (bSortAscending: boolean) => void;
};

export type TImageSize = {
  width: number;
  height: number;
};

export type TImageLink = {
  preview: string;
  main: string;
};

export type TImageListItem = {
  url: TImageLink;
  size: TImageSize;
  isSelected: boolean;
  isFavorited: boolean;
};

const ImageGathererContext = createContext<TImageGathererProvider>(
  {} as TImageGathererProvider
);
export const ImageGathererProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [isPreviewActive, setIsPreviewActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string>("");
  const [mainImageList, setMainImageList] = useState<TImageListItem[]>([]);
  const [favoriteImageList, setFavoriteImageList] = useState<TImageListItem[]>(
    []
  );
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const sendImageGatheringRequest = async (
    subreddit: string,
    amount: number,
    filters: string[]
  ) => {
    setIsLoading(true);
    const sendData = { subreddit, amount, filters };
    const options = {
      method: "POST",
      body: JSON.stringify(sendData),
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch("/api/ImageLoader", options);
    return response
      .json()
      .then(async function (result) {
        const data = JSON.parse(result);
        setMainImageList([]);
        addImageLinksToCollection(data.links)
          .then(() => setIsModalActive(true))
          .catch((e) => {
            throw new Error(e);
          });
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const downloadAll = async () => {
    const list = (showFavorites ? favoriteImageList : mainImageList).map(
      (item) => item.url.main
    );
    await downloadFromLinks(list);
  };

  const downloadSelected = async () => {
    const list = (showFavorites ? favoriteImageList : mainImageList)
      .filter((item) => item.isSelected)
      .map((item) => item.url.main);
    await downloadFromLinks(list); //.then((result) => console.log(result));
  };

  const downloadFromLinks = (links: string[]) => {
    if (!links) throw new Error("given Links was not defined!");

    const options = {
      method: "POST",
      body: JSON.stringify({ links: links }),
      headers: { "Content-Type": "application/json" },
    };

    fetch("/api/downloadFilesFromLinks", options)
      .then((response) => {
        if (!response.ok) {
          console.log(`Err: ${response}`);
          throw new Error("Error");
        }

        response.json().then(async () => await downloadFile());
      })
      .catch(() => console.log("Tihi Error"));
  };

  const downloadFile = () => {
    setIsLoading(true);
    return fetch(`/api/download/`, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Network response was not ok");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "images";
        document.body.appendChild(a);
        a.click();
        a.remove(); // Clean up after download
      })
      .catch((error) => {
        console.error("There was an error with the download:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const addImageLinksToCollection = (links: string[]) => {
    if (!links) return Promise.reject("Links was not defined!");

    links.forEach((link) => {
      const img = new Image();
      img.src = link[1];
      img.onload = function () {
        const imagelink: TImageLink = { preview: link[0], main: link[1] };
        const imageSize: TImageSize = { width: img.width, height: img.height };
        const linkItem: TImageListItem = {
          url: imagelink,
          size: imageSize,
          isSelected: false,
          isFavorited: false,
        };
        setMainImageList((prevList) => [...prevList, linkItem]);
      };
    });
    return Promise.resolve();
  };

  const toggleSelectedItem = (item: TImageListItem) => {
    if (!item)
      console.log("The image you wanted to toggle selected did not exist");

    item.isSelected = !item.isSelected;
    const copyList = item.isFavorited
      ? [...favoriteImageList]
      : [...mainImageList];
    const index = copyList.findIndex((i) => i.url.main === item.url.main);
    copyList[index] = item;
    if (item.isFavorited) setFavoriteImageList(copyList);
    else setMainImageList(copyList);
  };

  const toggleFavoriteItem = (item: TImageListItem) => {
    if (!item)
      console.log("The image you wanted to add to favorites did not exist");

    if (item.isFavorited) {
      item.isFavorited = false;
      setFavoriteImageList(
        favoriteImageList.filter((i) => i.url.main != item.url.main)
      );
      setMainImageList([...mainImageList, item]);
    } else {
      item.isFavorited = true;
      setMainImageList(
        mainImageList.filter((i) => i.url.main != item.url.main)
      );
      setFavoriteImageList([...favoriteImageList, item]);
    }
  };

  const clearFavorites = () => {
    setMainImageList([...mainImageList, ...favoriteImageList]);
    setFavoriteImageList([]);
  };

  const sortCollection = (bSortAscending: boolean) => {
    const sortFunction = (a: TImageListItem, b: TImageListItem) => {
      const areaA = a.size.width * a.size.height;
      const areaB = b.size.width * b.size.height;
      return bSortAscending ? areaB - areaA : areaA - areaB;
    };

    let mainCopy = [...mainImageList];
    mainCopy = mainCopy.sort(sortFunction);
    let favCopy = [...favoriteImageList];
    favCopy = favCopy.sort(sortFunction);
    setFavoriteImageList(favCopy);
    setMainImageList(mainCopy);
  };

  return (
    <ImageGathererContext.Provider
      value={{
        isModalActive,
        setIsModalActive,
        isPreviewActive,
        setIsPreviewActive,
        isLoading,
        sendImageGatheringRequest,
        responseError,
        mainImageList,
        favoriteImageList,
        toggleFavoriteItem,
        toggleSelectedItem,
        showFavorites,
        setShowFavorites,
        downloadAll,
        downloadSelected,
        clearFavorites,
        sortCollection,
      }}
    >
      {children}
    </ImageGathererContext.Provider>
  );
};

export const useImageGatherer = () => useContext(ImageGathererContext);
