import { useState } from "react";
import MainSection from "../mainSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ImageGatherer = () => {
  const [subreddit, setSubreddit] = useState<string>("");
  const [amountOfPosts, setAmountOfPosts] = useState<number>();
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
    <MainSection title="ImageGatherer">
      <div className="content">
        <div className="inputFields" id="InputFields">
          <p id="RedditEntryP" className="center">
            {" "}
            Subreddit to search:
          </p>
          <input
            className="rightAlign"
            id="subredditToSearch"
            placeholder="Subreddit..."
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
          />

          <p id="SearchAmountP" className="center">
            Amount of posts:
          </p>
          <input
            className="rightAlign"
            id="SearchAmount"
            placeholder="Amount of posts..."
            value={amountOfPosts}
            onChange={(e) => setAmountOfPosts(+e.target.value)}
          />

          <p id="TitleFiltersP" className="center">
            Add Filter:
          </p>
          <div className="filterInputContainer">
            <input
              className="rightAlign TitleFiltersInput"
              id="TitleFilters"
              placeholder="Filter..."
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              onKeyDown={(e) => addNewFilter(e)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              onClick={() => titleFiltersArray.slice(0)}
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
            onClick={() => "sendImageGatheringRequest()"}
          >
            {" "}
            Request images
          </button>
          <button id="OpenCollectionButton" onClick={() => "openCollection()"}>
            {" "}
            Collection
          </button>
          <div className="loaderContainer">
            <div className="loader" id="loader">
              {" "}
            </div>
          </div>
          <p id="ErrorText"></p>
        </div>
      </div>
    </MainSection>
  );
};

export default ImageGatherer;
