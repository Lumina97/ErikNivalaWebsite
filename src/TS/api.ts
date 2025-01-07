import emailjs from "@emailjs/browser";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type TFormData = {
  name: string;
  email: string;
  message: string;
};

export const sendEmail = async (data: TFormData) => {
  init();
  return emailjs.send("service_o8ay9sa", "template_xfv49lp", {
    from_name: data.name,
    message: data.message,
    from_email: data.email,
  });
};

const init = () => {
  emailjs.init({
    publicKey: "gUZOghklUU05IAq4c",
    // Do not allow headless browsers
    blockHeadless: true,
    limitRate: {
      // Set the limit rate for the application
      id: "app",
      // Allow 1 request per 10s
      throttle: 10000,
    },
  });
};

export const gatherImages = async (subreddit: string) => {
  const link = `https://www.reddit.com/r/${subreddit}/new/.json`;
  const image_links: [string, string][] = [];
  const config: AxiosRequestConfig = {
    method: "get",
    url: link,
  };

  try {
    const result: AxiosResponse = await axios(config);
    const postArray = result.data.data.children;
    if (!postArray || postArray.length === 0) {
      return image_links;
    }
    let bHasAnyImageLinks = false;

    for (const post of postArray) {
      if (
        post.kind === "t3" &&
        (post.data.url.includes(".jpg") ||
          post.data.url.includes(".png") ||
          post.data.url.includes(".jpeg"))
      ) {
        let thumbnail = "";
        if (post.data.preview) {
          const resolutions = post.data.preview.images[0].resolutions;
          if (resolutions.length > 0) {
            thumbnail = resolutions[2].url.replace(/&amp;/g, "&");
          }
        }
        image_links.push([thumbnail, post.data.url]);
        bHasAnyImageLinks = true;
      }
    }

    if (!bHasAnyImageLinks) {
      return image_links;
    } else {
      return image_links;
    }
  } catch (err) {
    console.error(`RedditLinksGatherer - Error - ${err}`);
    return image_links;
  }
};
