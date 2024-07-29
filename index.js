const path = require("path");
const envPath = path.join(__dirname, "website.env");
require("dotenv").config({ path: envPath });

const express = require("express");
const session = require("express-session");
const RedditAPI = require("./RedditAPI/RedditAPI");
const FileDownloader = require("./FileDownloader");
const { v4: uuidv4 } = require("uuid");
const compression = require("compression");
const log = require("./Config").log;
const app = express();

app.use(compression());
app.use(express.static(__dirname + "/public"));
app.use(express.json({ limit: "1mb" }));

const oneDay = 1000 * 60 * 60 * 24;
const secretKey = process.env.SESSION_SECRET;
var downloadRequestDict = {};

app.use(
  session({
    name: "SessionCookie",
    genid: function () {
      log.info("session id created");
      return uuidv4();
    },
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h (in ms)
    }),
    cookie: { secure: false, maxAge: oneDay },
  })
);

const port = 3000;
app.listen(port, () => log.info("listening on " + port));

//#region Image Gatherer
app.post("/downloadFilesFromLinks", async (request, response) => {
  const links = request.body.links;

  await FileDownloader.DownloadFilesFromLinksAndZip(
    links,
    request.session.userid
  )
    .then((result) => {
      downloadRequestDict[request.session.userid] = result;
      try {
        let data = JSON.stringify({ id: request.session.userid });
        response.json(data);
      } catch (error) {
        log.error("ERROR:\n" + error);
      }
    })
    .catch((reason) => {
      log.error(reason);
    });
});

app.get("/download", async function (request, response) {
  log.info("Download GET request");
  for (const [key, value] of Object.entries(downloadRequestDict)) {
    log.info(key, value);
    if (key == request.session.userid) {
      log.info("Found request!");
      const path = value;
      log.info(path);
      response.download(path, (err) => {
        if (err) {
          log.error("Error occurred while downloading the file:", err);
          response
            .status(500)
            .send("Error occurred while downloading the file");
        }
      });
      delete downloadRequestDict[key];
    }
  }
});

app.post("/ImageLoader", async function (request, response) {
  if (!request.session) {
    log.warn("Invalid Session!");
    response.json({ ERROR: "Invalid Session, try reloading the page!" });
    return;
  }

  const data = request.body;
  if (data.subreddit == false) {
    log.warn("Subreddit was empty!");
    response.json({ ERROR: "Subreddit was empty!" });
    return;
  }

  await RedditAPI.GetAllImageLinks(
    data.subreddit,
    data.amount,
    session,
    data.filters
  )
    .then((result) => {
      let returnData;
      try {
        returnData = JSON.stringify({ links: result });
        response.json(returnData);
        return;
      } catch (error) {
        log.warn("Error parsing json! \n" + error);
        response.json("There was an error getting your data!");
        return;
      }
    })
    .catch((error) => {
      log.error("ERROR: " + error);
      response.json({ ERROR: "There was an error getting your data!" });
      return;
    });
});
//#endregion

//#region File Serving
app.get("/spacetrace", (response) => {
  response.sendFile(
    path.join(pth.join(__dirname, "/public/spacetrace/index.html"))
  );
});

app.get("/", (request, response) => {
  if (!request.session.userid) {
    request.session.userid = uuidv4();
  }
  response.sendFile(path.join(__dirname, "/public/html/Home.html"));
});
//#endregion
