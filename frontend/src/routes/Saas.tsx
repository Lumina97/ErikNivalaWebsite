import MainSection from "../mainSection";
import { useMainContainer } from "../Providers/MainContainerProvider";
import { useNavigate } from "react-router-dom";

const Saas = () => {
  const { OnSaasProjectClicked } = useMainContainer();
  const navigate = useNavigate();

  return (
    <MainSection title="SaaS project">
      <p>Welcome to the SaaS website explanation</p>
      <p>
        I started the Devslopes academy where I learn everything about Web
        development and complete multiple projects throughout the course and one
        of them being this SaaS website.
      </p>
      <p>
        The website is non functioning but fully responsive from 1024px all the
        way down. You can get to the website through{" "}
        <a href="" onClick={() => OnSaasProjectClicked(navigate)}>
          {" "}
          this link
        </a>
        .
      </p>
      <p>
        In order to return to this page you can click on any button or link on
        the SaaS website and it will take you right back here.
      </p>
    </MainSection>
  );
};

export default Saas;
