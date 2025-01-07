import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faReact,
  faNode,
  faNpm,
  faHtml5,
  faCss3,
  faJs,
  faUnity,
} from "@fortawesome/free-brands-svg-icons";

const About = () => {
  return (
    <div>
      <h2>About</h2>
      <p className="aboutDescriptionText">
        Hey, my name is Erik, freelance fullstack developer and I LOVE coding!
        I've been coding for about 5 years now and recently added Web
        development to my arsenal. I've made a bunch of stuff like games, apps
        and websites. Here are a few of my recent projects, you're welcome to
        check them out and look at the github as well! If you want to work with
        me or just chat you can fill out the form below to get in contact with
        me.
      </p>
      <p></p>
      <div className="aboutSkillsWrapper">
        <p>
          <FontAwesomeIcon icon={faReact}></FontAwesomeIcon> React
        </p>
        <p>Express</p>
        <p>
          <FontAwesomeIcon icon={faNode}></FontAwesomeIcon> NodeJs
        </p>
        <p>Rest APIs </p>
        <p>
          <FontAwesomeIcon icon={faNpm}></FontAwesomeIcon> npm package manager
        </p>
        <p>C#</p>
        <p>
          <FontAwesomeIcon icon={faHtml5}></FontAwesomeIcon>{" "}
          <FontAwesomeIcon icon={faCss3}></FontAwesomeIcon>{" "}
          <FontAwesomeIcon icon={faJs}></FontAwesomeIcon> HTML,CSS,JS
        </p>
        <p>C++ </p>
        <p>
          <FontAwesomeIcon icon={faUnity}></FontAwesomeIcon> Unity
        </p>

        <p>Unreal Engine</p>
        <p>
          <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon> Github
        </p>
        <p>Typescript</p>
      </div>
    </div>
  );
};

export default About;
