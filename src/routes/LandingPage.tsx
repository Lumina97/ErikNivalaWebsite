import ProjectDisplayComponent from "../Components/ProjectDisplayComponent";
import { ProjectProvider } from "../Providers/ProjectProvider";
import Hero from "../Components/Sidebar/Hero";

import WorkExperience from "../Components/WorkExperience/WorkExperience";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <div className="landingPageWrapper">
        <div className="contentWrapper">
          <ProjectProvider>
            <WorkExperience />
            <ProjectDisplayComponent />
          </ProjectProvider>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
