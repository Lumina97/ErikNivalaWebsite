import { useState } from "react";
import InputFieldComponent from "../InputFieldComponent";
import { useImageGatherer } from "../../Providers/ImageGathererProvider";
import ImageGathererModal from "./ImageGathererModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import "../../css/ImageGatherer.css";
import "../../css/ImageGathererResponsive.css";
import "../../css/animations.css";
import { EActiveTab, useProject } from "../../Providers/ProjectProvider";
import { mobileImageGathererButtonShowWidth } from "../../settings";
import { useWindowDimensions } from "../../app";

const ImageGatherer = () => {
  const {
    sendImageGatheringRequest,
    isModalActive,
    setIsModalActive,
    isLoading,
    hasImages,
    responseError,
  } = useImageGatherer();
  const { changeActiveTab } = useProject();

  const [subreddit, setSubreddit] = useState<string>("");
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);
  const [showMobileHowTo, setShowMobileHowTo] = useState<boolean>(true);

  const subredditError = "Subreddit cannot be empty!";

  const isSubredditValid = () => {
    return subreddit.length > 0;
  };

  const submitGatherRequest = () => {
    setWasSubmitted(true);
    if (isSubredditValid()) sendImageGatheringRequest(subreddit);
  };

  const { width } = useWindowDimensions();

  return (
    <>
      {isModalActive && <ImageGathererModal />}
      {!isModalActive && (
        <div id="ImageGatherer">
          {!isModalActive && (
            <>
              <div
                className="exitButton"
                onClick={() => changeActiveTab(EActiveTab.None)}
              >
                <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
              </div>
              {width <= mobileImageGathererButtonShowWidth && (
                <div className="mobileButtons">
                  {!showMobileHowTo && (
                    <button
                      className="btnPrimary"
                      onClick={() => {
                        setShowMobileHowTo(true);
                      }}
                    >
                      How To
                    </button>
                  )}
                  {showMobileHowTo && (
                    <button
                      className="btnPrimary"
                      onClick={() => {
                        setShowMobileHowTo(false);
                      }}
                    >
                      Image Gatherer
                    </button>
                  )}
                </div>
              )}
              {(width > mobileImageGathererButtonShowWidth ||
                (width <= mobileImageGathererButtonShowWidth &&
                  showMobileHowTo === false)) && (
                <div className="inputFields" id="InputFields">
                  <InputFieldComponent
                    labelTitle="Subreddit: "
                    wrapperProps={{ className: "inputWrapper" }}
                    props={{
                      disabled: isLoading,
                      value: subreddit,
                      onChange: (e) => setSubreddit(e.target.value),
                    }}
                  />
                  {wasSubmitted && !isSubredditValid() && (
                    <div className="inputFieldErrorText">{subredditError}</div>
                  )}
                  <div className="imageGathererButtons">
                    <button
                      disabled={isLoading}
                      className="btnPrimary"
                      onClick={submitGatherRequest}
                    >
                      Request images
                    </button>
                    <button
                      disabled={isLoading || !hasImages}
                      className="btnPrimary"
                      onClick={() => setIsModalActive(true)}
                    >
                      Collection
                    </button>
                  </div>
                  {isLoading && (
                    <>
                      <div className="loaderContainer">
                        <div className="loader" id="loader"></div>
                      </div>
                    </>
                  )}
                  {responseError?.length > 0 && (
                    <p id="ErrorText">{responseError}</p>
                  )}
                </div>
              )}

              {(width > mobileImageGathererButtonShowWidth ||
                (width <= mobileImageGathererButtonShowWidth &&
                  showMobileHowTo === true)) && (
                <div className="imageGathererHowTo">
                  <h3>Image Gatherer</h3>
                  <p>Welcome to my reddit app!</p>
                  <p>How to use:</p>
                  <p>
                    Just enter the name of the subreddit you would like to scan
                    for images in recent posts ("wallpaper" for example)
                  </p>
                  <p>
                    Then wait until the collection view pops up and displays
                    your images.
                  </p>
                  <p>
                    Inside the collection view you can favorite images, select
                    which ones to download or download all{" "}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGatherer;
