const ProjectComponent = ({
  wrapperProps,
  imagePath,
  title,
  description,
}: {
  wrapperProps?: React.InputHTMLAttributes<HTMLInputElement>;
  imagePath: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="projectCard" {...wrapperProps}>
      <div className="projectCardInner">
        <div className="projectImageWrapper">
          <img src={imagePath}></img>
        </div>
        <div className="projectCardInformationWrapper">
          <h2>{title}</h2>
          <p>{description}</p>
          <p>click me!</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectComponent;
