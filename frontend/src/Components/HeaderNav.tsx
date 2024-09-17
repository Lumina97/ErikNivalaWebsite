import {
  LogoImgFilePath,
  mobileImageGathererButtonShowWidth,
} from "../settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useWindowDimensions } from "../app";

const HeaderNav = () => {
  const [isMobileMenuActive, setIsMobileMenuActive] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const isMobileView = width <= mobileImageGathererButtonShowWidth;

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header id="home" className="oddContainer">
      <div className="headerLogoWrapper">
        <div className="headerImgWrapper">
          <img src={LogoImgFilePath}></img>
        </div>
      </div>
      <nav>
        <div
          className={
            isMobileView
              ? `${isMobileMenuActive ? "open" : ""}
            mobileMenuWrapper`
              : ""
          }
          onClick={() => {
            setIsMobileMenuActive(!isMobileMenuActive);
          }}
        >
          {isMobileView && (
            <FontAwesomeIcon className="fontAwesome" icon={faBars} />
          )}
          <div className={`${isMobileView ? "mobileMenu" : "headerMenu"}`}>
            {isMobileView && (
              <FontAwesomeIcon className="fontAwesome" icon={faX} />
            )}
            <ul>
              <li>
                <a onClick={() => scrollToSection("home")}>Home</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("about")}>About me</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("projects")}>Projects</a>
              </li>
              <li>
                <a onClick={() => scrollToSection("contact")}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderNav;
