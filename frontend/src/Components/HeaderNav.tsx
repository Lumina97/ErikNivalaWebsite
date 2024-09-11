import { LogoImgFilePath } from "../settings";

const HeaderNav = () => {
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
      </nav>
    </header>
  );
};

export default HeaderNav;
