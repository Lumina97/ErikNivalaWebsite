import { ReactNode } from "react";

const ProjectComponent = ({
  wrapperProps,
  imagePath,
  title,
  description,
  children,
}: {
  wrapperProps?: React.InputHTMLAttributes<HTMLInputElement>;
  imagePath: string;
  title: string;
  description: string;
  children?: ReactNode;
}) => {
  return (
    <div className="projectCard" {...wrapperProps}>
      <div className="projectImageWrapper">
        <img src={imagePath}></img>
      </div>
      <div className="projectCardInformationWrapper">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>click me!</p>
      </div>
      <div className="projectTechStack">{children}</div>
    </div>
  );
};

export default ProjectComponent;
