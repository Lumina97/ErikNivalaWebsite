import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { profilePicturePath } from "../../settings";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import HeroTechStack from "./HeroTechStack";

const Hero = () => {
  return (
    <header className="hero">
      <div className="profileInformation">
        <div className="profileImageWrapper">
          <img src={profilePicturePath} alt="eriknivalaimage" />
        </div>
        <div className="ProfileTitle">
          <h1>Erik Nivala</h1>
          <h2>React Front end developer</h2>
          <FontAwesomeIcon icon={faMapPin} />
          {`  Wisconsin, USA`}
        </div>
      </div>
      <div className="socialInformation">
        <ul>
          <li>
            <a target="blank" href="https://www.linkedin.com/in/erik-nivala/">
              <FontAwesomeIcon icon={faLinkedinIn}></FontAwesomeIcon>
              <p>LinkedIn</p>
            </a>
          </li>
          <li>
            <a target="blank" href="https://github.com/Lumina97">
              <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon> GitHub
            </a>
          </li>
        </ul>
      </div>
      <HeroTechStack />
    </header>
  );
};

export default Hero;
