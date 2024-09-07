import { useState } from "react";
import MainSection from "../Components/mainSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import InputFieldComponent from "../Components/InputFieldComponent";
import { useImageGatherer } from "../Providers/ImageGathererProvider";
import ImageGathererModal from "../Components/ImageGathererModal";

const ImageGatherer = () => {
  const {
    sendImageGatheringRequest,
    isModalActive,
    setIsModalActive,
    isLoading,
  } = useImageGatherer();

  const [subreddit, setSubreddit] = useState<string>("wallpaper");
  const [amountOfPosts, setAmountOfPosts] = useState<number>(10);
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [titleFiltersArray, setTitleFilterArray] = useState<string[]>([]);

  const addNewFilter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (titleFilter !== "") {
        setTitleFilterArray([...titleFiltersArray, titleFilter]);
        setTitleFilter("");
      }
    }
  };

  return (
    <>
      {isModalActive && <ImageGathererModal />}
      <MainSection title="ImageGatherer">
        {!isModalActive && (
          <>
            <div>
              <div className="inputFields" id="InputFields">
                <InputFieldComponent
                  Title="Subreddit to search"
                  props={{
                    placeholder: "Subreddit...",
                    value: subreddit,
                    onChange: (e) => setSubreddit(e.target.value),
                  }}
                />
                <InputFieldComponent
                  Title="Amount of posts:"
                  props={{
                    placeholder: "Amount of posts...",
                    value: amountOfPosts,
                    onChange: (e) => setAmountOfPosts(+e.target.value),
                  }}
                />
                <InputFieldComponent
                  Title="Title filters:"
                  props={{
                    placeholder: "Filter...",
                    value: titleFilter,
                    onChange: (e) => setTitleFilter(e.target.value),
                    onKeyDown: (e) => addNewFilter(e),
                  }}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => setTitleFilterArray([])}
                />
              </div>
            </div>
            <div className="imageGathererButtons">
              <ul id="FilterUnorderedList">
                {titleFiltersArray.map((filter) => {
                  return <li>{filter}</li>;
                })}
              </ul>
              <button
                id="SendImageRequestButton"
                onClick={() =>
                  sendImageGatheringRequest(
                    subreddit,
                    amountOfPosts,
                    titleFiltersArray
                  )
                }
              >
                Request images
              </button>
              <button
                id="OpenCollectionButton"
                onClick={() => setIsModalActive(true)}
              >
                Collection
              </button>
              {isLoading && (
                <>
                  <div className="loaderContainer">
                    <div className="loader" id="loader"></div>
                  </div>
                </>
              )}
              <p id="ErrorText"></p>
            </div>
          </>
        )}
      </MainSection>
    </>
  );
};

export default ImageGatherer;
