import ProjectDisplayComponent from "../Components/ProjectDisplayComponent";
import { ProjectProvider } from "../Providers/ProjectProvider";
import Sidebar from "../Components/Sidebar/Sidebar";

import WorkExperience from "../Components/WorkExperience/WorkExperience";

const LandingPage = () => {
  return (
    <div className="landingPageWrapper">
      <Sidebar />

      <div className="contentWrapper">
        <ProjectProvider>
          <WorkExperience />
          <ProjectDisplayComponent />
        </ProjectProvider>
      </div>
    </div>
  );
};

export default LandingPage;
