import { projectImagePath } from "./settings";

export type TProject = {
  imagePath: string;
  title: string;
  description: string;
  githubPath?: string;
};

export const Projects: TProject[] = [
  {
    imagePath: projectImagePath + "Saas.png",
    title: "Saas website",
    description: "Fully responsive saas website",
    githubPath:
      "https://github.com/Lumina97/ErikNivalaWebsite/blob/main/src/routes/SaasProject.tsx",
  },
  {
    imagePath: projectImagePath + "SpaceTrace2.png",
    title: "Space Trace",
    description: "Modern asteroids game made with Unity",
    githubPath: "https://github.com/Lumina97/Space-Trace",
  },
  {
    imagePath: projectImagePath + "ImageGatherer.png",
    title: "Image gatherer",
    description: "Reddit app that lets you download images from reddit posts",
    githubPath: "https://github.com/Lumina97/WebsiteBackend",
  },
  {
    imagePath: projectImagePath + "NoteMaster.png",
    title: "Note Master",
    description:
      "First place in a chrome extension Hackathon over a 2 week duration",
    githubPath: "https://github.com/Lumina97/NoteMaster",
  },
  {
    imagePath: projectImagePath + "Gw2_taskmaster.png",
    title: "Tyria Tracker",
    description:
      "Daily/Weekly activity tracker for the game Guild Wars 2. Front and Backend application with complete log in system and database storing users.",
    githubPath: "https://github.com/Lumina97/TyriaTracker",
  },
];

export const WorkExperienceList: TProject[] = [
  {
    imagePath: projectImagePath + "Hannula.PNG",
    title: "Hannulawells",
    description:
      "Performed various CSS adjustments and additions based on client provided figma design.",
  },
];
