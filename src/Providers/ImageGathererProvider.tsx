import JSZip from "jszip";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { saveAs } from "file-saver";

type TImageGathererProvider = {
  isModalActive: boolean;
  setIsModalActive: Dispatch<SetStateAction<boolean>>;
  isPreviewActive: boolean;
  setIsPreviewActive: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  hasImages: boolean;
  sendImageGatheringRequest: (subreddit: string) => Promise<void>;
  responseError: string;
  mainImageList: TImageListItem[];
  favoriteImageList: TImageListItem[];
  toggleFavoriteItem: (item: TImageListItem) => void;
  toggleSelectedItem: (item: TImageListItem) => void;
  showFavorites: boolean;
  setShowFavorites: Dispatch<SetStateAction<boolean>>;
  downloadAll: () => void;
  downloadSelected: () => Promise<void>;
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

  const sendImageGatheringRequest = async (subreddit: string) => {
    setResponseError("");
    setIsLoading(true);
    const sendData = { subreddit };
    const options = {
      method: "POST",
      body: JSON.stringify(sendData),
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    return await fetch("http://127.0.0.1:3000/api/ImageLoader", options)
      .then((result) => {
        if (result.statusText !== "OK") {
          setResponseError("There was an error getting your data.");
          return;
        }
        result.json().then(async (result: string) => {
          const data = JSON.parse(result);
          if (!data.links) throw new Error("Response data had no links.");
          setMainImageList([]);
          addImageLinksToCollection(data.links)
            .then(() => setIsModalActive(true))
            .catch((e) => {
              throw new Error(e);
            });
        });
      })
      .catch(() => {
        setResponseError("There was an error getting your data!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const downloadAll = async () => {
    const list = (showFavorites ? favoriteImageList : mainImageList).map(
      (item) => item.url.main
    );
    downloadImagesFromLinks(list).then(clearSelectedImages);
  };

  const downloadSelected = async () => {
    const list = (showFavorites ? favoriteImageList : mainImageList)
      .filter((item) => item.isSelected)
      .map((item) => item.url.main);
    downloadImagesFromLinks(list).then(clearSelectedImages);
  };

  const downloadImagesFromLinks = async (links: string[]) => {
    const zip = new JSZip();
    const imageFolder = zip.folder("images")!;

    const fetchAndAddImage = async (url: string, index: number) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = `image${index + 1}.jpg`;
      imageFolder.file(fileName, blob);
    };

    await Promise.all(links.map(fetchAndAddImage));

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "images.zip");
    });
  };

  const clearSelectedImages = () => {
    (showFavorites ? favoriteImageList : mainImageList).map((item) => {
      item.isSelected = false;
    });
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
        hasImages: mainImageList.length > 0,
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
