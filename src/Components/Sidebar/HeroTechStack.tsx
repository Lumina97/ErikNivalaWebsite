import {
  faCss3,
  faHtml5,
  faJs,
  faNodeJs,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import TechStackElement from "./TechStackElement";

const HeroTechStack = () => {
  return (
    <div className="heroTechStackWrapper">
      <h2>Tech stack</h2>
      <div className="heroTechStack">
        <TechStackElement icon={faReact} name="React" />
        <TechStackElement icon={faHtml5} name="HTML" />
        <TechStackElement icon={faNodeJs} name="NodeJS" />
        <TechStackElement icon={faCss3} name="CSS" />
        <TechStackElement icon={faJs} name="JS" />
      </div>
    </div>
  );
};

export default HeroTechStack;
