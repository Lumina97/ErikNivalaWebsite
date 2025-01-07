import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TechStackElement = ({ icon, name }: { icon: IconProp; name: string }) => {
  return (
    <div className="techStackElementWrapper">
      <FontAwesomeIcon icon={icon} />
      <p>{name}</p>
    </div>
  );
};

export default TechStackElement;
