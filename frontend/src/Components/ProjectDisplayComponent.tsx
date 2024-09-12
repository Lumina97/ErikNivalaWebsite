import { EActiveTab, useProject } from "../Providers/ProjectProvider";
import { githubLink, projectImagePath } from "../settings";
import ProjectComponent from "./ProjectComponent";

const ProjectDisplayComponent = () => {
  const { setActiveTab } = useProject();
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
          wrapperProps={{
            onClick: () => {
              setActiveTab(EActiveTab.ImageGatherer);
            },
          }}
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
          wrapperProps={{
            onClick: () => {
              window.open(githubLink, "_blank");
            },
          }}
          imagePath={`${projectImagePath}GitHub.svg`}
          title="Github"
          description="My github account"
        />
      </div>
    </div>
  );
};

export default ProjectDisplayComponent;
