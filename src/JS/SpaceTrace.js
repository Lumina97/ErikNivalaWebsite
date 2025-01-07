let myGameInstance = null;
let scriptElement = null;
let container;
let canvas;
let loadingBar;
let progressBarFull;
let warningBanner;
let playButton;
let space_trace_text;

function getElements() {
  container = document.querySelector("#unity-container");
  canvas = document.querySelector("#unity-canvas");
  loadingBar = document.querySelector("#unity-loading-bar");
  progressBarFull = document.querySelector("#unity-progress-bar-full");
  warningBanner = document.querySelector("#unity-warning");
  playButton = document.getElementById("PlaySpaceTrace");
  space_trace_text = document.getElementById("space-trace-text");
}

export function PlaySpaceTrace() {
  getElements();

  function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
      warningBanner.style.display = warningBanner.children.length
        ? "block"
        : "none";
    }
    let div = document.createElement("div");
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == "error") div.style = "background: red; padding: 10px;";
    else {
      if (type == "warning") div.style = "background: yellow; padding: 10px;";
      setTimeout(function () {
        warningBanner.removeChild(div);
        updateBannerVisibility();
      }, 5000);
    }
    updateBannerVisibility();
  }

  let buildUrl = "/spacetrace/Build";
  let loaderUrl = buildUrl + "/web.loader.js";
  let config = {
    dataUrl: buildUrl + "/web.data.unityweb",
    frameworkUrl: buildUrl + "/web.framework.js.unityweb",
    codeUrl: buildUrl + "/web.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Insight Gaming",
    productName: "Space Trace",
    productVersion: "0.9",
    showBanner: unityShowBanner,
  };

  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    let meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width , height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes";
    document.getElementsByTagName("head")[0].appendChild(meta);
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";
  } else {
    canvas.style.width = screen.width / 2;
    canvas.style.height = screen.height / 2;
  }

  loadingBar.style.display = "block";

  scriptElement = document.createElement("script");
  scriptElement.src = loaderUrl;
  scriptElement.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
      progressBarFull.style.width = 100 * progress + "%";
    })
      .then((unityInstance) => {
        myGameInstance = unityInstance;
        loadingBar.style.display = "none";
      })
      .catch((message) => {
        alert(message);
      });
  };

  document.body.appendChild(scriptElement);
}

export function StopPlayingSpaceTrace() {
  if (myGameInstance === undefined || myGameInstance === null) {
    return;
  }
  getElements();

  myGameInstance.SendMessage("JSManager", "CloseGame");
  myGameInstance = null;

  document.body.removeChild(scriptElement);
  const context = canvas.getContext("webgl2");
  context.clear(0, 0, 0, 0);
}
