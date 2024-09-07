import MainSection from "../mainSection";
import { PlaySpaceTrace } from "../JS/SpaceTrace";

const SpaceTrace = () => {
  return (
    <MainSection title="SpaceTrace">
      <div className="SpaceTrace">
        <p id="space-trace-text">
          A modernized asteroids clone created using the Unity engine and built
          as a webGL game. My focus was on making the entire game as modular as
          possible while keeping it fun to play and not over engineering
          everything.
          <br />
          Source code of the project can be found on my github page.
        </p>
        <p id="spaceTraceMobileText"> This does NOT work on mobile!</p>
        <button
          className="space-trace-play-button"
          id="PlaySpaceTrace"
          onClick={PlaySpaceTrace}
        >
          Play
        </button>

        <div id="unity-container" className="unity-desktop">
          <canvas
            id="unity-canvas"
            style={{ width: "0%", height: "0%" }}
          ></canvas>
          <div id="unity-loading-bar">
            <div id="unity-logo"></div>
            <div id="unity-progress-bar-empty">
              <div id="unity-progress-bar-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="unity-warning"> </div>
    </MainSection>
  );
};

export default SpaceTrace;
