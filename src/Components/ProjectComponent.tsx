import { ReactNode } from "react";
import { TProject } from "../data";

const ProjectComponent = ({
  wrapperProps,
  project,
  children,
}: {
  wrapperProps?: React.InputHTMLAttributes<HTMLInputElement>;
  project: TProject;
  children?: ReactNode;
}) => {
  const gitHubClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!project.githubPath) return;

    event.stopPropagation();
    const link = event.currentTarget as HTMLAnchorElement;

    link.href = project.githubPath;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="projectCard" {...wrapperProps}>
      <div className="projectImageWrapper">
        <img src={project.imagePath}></img>
      </div>
      <div className="projectCardInformationWrapper">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        {project.githubPath && (
          <a onClick={(e) => gitHubClick(e)}>Github Link</a>
        )}
      </div>
      <div className="projectTechStack">{children}</div>
    </div>
  );
};

export default ProjectComponent;
