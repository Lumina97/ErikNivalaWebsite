import { projectImagePath } from "../settings";
import ProjectComponent from "./ProjectComponent";

const ProjectDisplayComponent = () => {
  return (
    <div className="projectCardDisplayWrapper">
      <h2>Projects</h2>
      <div className="projectsWrapper">
        <ProjectComponent
          imagePath={`${projectImagePath}SpaceTrace2.png`}
          title="Space Trace"
          description="Modern asteroids game"
        />
        <ProjectComponent
          imagePath={`${projectImagePath}ImageGatherer.png`}
          title="Image gatherer"
          description="Reddit app that lets you download images from reddit posts"
        />
        <ProjectComponent
          imagePath={`${projectImagePath}Saas.png`}
          title="Saas website"
          description="Fully responsive saas website"
        />
        <ProjectComponent
          imagePath={`${projectImagePath}GitHub.svg`}
          title="Github"
          description="My github account"
        />
      </div>
    </div>
  );
};

export default ProjectDisplayComponent;
