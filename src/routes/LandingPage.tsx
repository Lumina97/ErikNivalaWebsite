import Header from "../Components/Header";
import HeaderNav from "../Components/HeaderNav";
import SectionComponent from "../Components/SectionComponent";
import ProjectDisplayComponent from "../Components/ProjectDisplayComponent";
import About from "../Components/About";
import ContactFormComponent from "../Components/ContactFormComponent";
import FooterComponent from "../Components/FooterComponent";
import { ProjectProvider } from "../Providers/ProjectProvider";

const LandingPage = () => {
  return (
    <>
      <>
        <HeaderNav />
        <SectionComponent props={{ id: "home", className: "section" }}>
          <Header />
        </SectionComponent>

        <SectionComponent
          props={{
            id: "about",
            className: "section aboutSectionWrapper oddContainer",
          }}
        >
          <About />
        </SectionComponent>

        <SectionComponent
          props={{
            id: "projects",
            className: "section",
          }}
        >
          <ProjectProvider>
            <ProjectDisplayComponent />
          </ProjectProvider>
        </SectionComponent>
        <SectionComponent
          props={{
            id: "contact",
            className: "section oddContainer",
          }}
        >
          <ContactFormComponent />
        </SectionComponent>
        <SectionComponent props={{ className: "section footerSection" }}>
          <FooterComponent />
        </SectionComponent>
      </>
    </>
  );
};

export default LandingPage;
