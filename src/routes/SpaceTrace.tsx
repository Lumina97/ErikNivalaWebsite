import { useCallback, useEffect, useState } from "react";
import { PlaySpaceTrace } from "../JS/SpaceTrace";
import "../css/spaceTrace.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { EActiveTab, useProject } from "../Providers/ProjectProvider";

const SpaceTrace = () => {
  const [playingSpaceTrace, setPlayingSpaceTrace] = useState<boolean>(false);
  const { changeActiveTab } = useProject();

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      changeActiveTab(EActiveTab.None);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <>
      <div className="spaceTrace">
        {!playingSpaceTrace && (
          <div className="spaceTraceInfo">
            <div
              className="exitButton"
              onClick={() => changeActiveTab(EActiveTab.None)}
            >
              <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
            </div>
            <p id="space-trace-text">
              A modernized asteroids clone created using the Unity engine and
              built as a webGL game. My focus was on making the entire game as
              modular as possible while keeping it fun to play and not over
              engineering everything.
              <br />
              Source code of the project can be found on my github page.
            </p>
            <p id="spaceTraceMobileText"> This does NOT work on mobile!</p>
            <button
              className="space-trace-play-button btnPrimary"
              id="PlaySpaceTrace"
              onClick={() => {
                PlaySpaceTrace();
                setPlayingSpaceTrace(true);
              }}
            >
              Play
            </button>
          </div>
        )}

        <div id="unity-container" className="unity-desktop">
          <canvas id="unity-canvas"></canvas>
          <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
              <div id="unity-progress-bar-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="unity-warning"> </div>
    </>
  );
};

export default SpaceTrace;
