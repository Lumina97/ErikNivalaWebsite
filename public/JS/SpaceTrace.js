var myGameInstance = null;
var scriptElement = null;
var container;
var canvas;
var loadingBar;
var progressBarFull;
var warningBanner;
var playbutton;
var space_trace_text;

function TogglePlayButtonAndCanvas(play) {
    if (play) {
        canvas.style.display = "block";
        playbutton.style.display = "none";
        space_trace_text.style.display = "none";
    }

    else {
        playbutton.style.display = "block";
        space_trace_text.style.display = "block";
        canvas.style.display = "none";
    }
}

function PlaySpaceTrace() {
    container = document.querySelector("#unity-container");
    canvas = document.querySelector("#unity-canvas");
    loadingBar = document.querySelector("#unity-loading-bar");
    progressBarFull = document.querySelector("#unity-progress-bar-full");
    warningBanner = document.querySelector("#unity-warning");
    playbutton = document.getElementById("PlaySpaceTrace");
    space_trace_text = document.getElementById("space-trace-text");

    TogglePlayButtonAndCanvas(true);

    function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
            if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
            setTimeout(function () {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
    }

    var buildUrl = "../spacetrace/Build";
    var loaderUrl = buildUrl + "/web.loader.js";
    var config = {
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
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
        container.className = "unity-mobile";
        canvas.className = "unity-mobile";
    }
    else {
        canvas.style.width = "100%";
        canvas.style.height = "75%";
    }

    loadingBar.style.display = "block";

    scriptElement = document.createElement("script");
    scriptElement.src = loaderUrl;
    scriptElement.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
            progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance) => {
            myGameInstance = unityInstance;
            loadingBar.style.display = "none";
        }).catch((message) => {
            alert(message);
        });
    };

    document.body.appendChild(scriptElement);
}

function StopPlayingSpaceTrace() {
    if (myGameInstance === undefined || myGameInstance === null) {
        return;
    }
    TogglePlayButtonAndCanvas(false);

    myGameInstance.SendMessage('JSManager', 'CloseGame');
    myGameInstance = null;

    document.body.removeChild(scriptElement);
    const context = canvas.getContext('webgl2');
    context.clear(0, 0, 0, 0);
}