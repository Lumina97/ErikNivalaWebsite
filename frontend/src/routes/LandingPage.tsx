import Header from "../Components/Header";
import HeaderNav from "../Components/HeaderNav";
import SectionComponent from "../Components/SectionComponent";
import ProjectDisplayComponent from "../Components/ProjectDisplayComponent";
import About from "./About";
import ContactFormComponent from "../Components/ContactFormComponent";
import FooterComponent from "../Components/FooterComponent";

const LandingPage = () => {
  return (
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
        <ProjectDisplayComponent />
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
  );
};

export default LandingPage;
