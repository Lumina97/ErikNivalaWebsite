import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FooterComponent = () => {
  return (
    <>
      <p>
        <FontAwesomeIcon icon={faCopyright} /> Erik Nivala 2024 All rights
        reserved.
      </p>
    </>
  );
};

export default FooterComponent;
