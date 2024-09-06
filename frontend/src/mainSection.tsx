import { ReactNode } from "react";

const MainSection = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container">
      <nav className="menu">
        <ul className="main-menu">
          <li /* onclick="OnHomeClicked()" */ id="HomeNav">Home</li>
          <li className="with-submenu">
            <div id="PortfolioNav">Portfolio </div>
            <ul className="submenu">
              <li /* onclick="OnWebsiteClicked()" */ id="WebsiteNav">
                Website
              </li>
              <li
                /* onclick="OnImageGathererClicked()" */ id="ImageGathererNav"
              >
                Image Gatherer
              </li>
              <li /* onclick="OnSpaceTraceClicked()" */ id="SpaceTraceNav">
                Space Trace
              </li>
              <li /* onclick="OnSaaSProjectClicked()" */ id="SaaSProjectNav">
                SaaS website
              </li>
            </ul>
          </li>
          <li className="active" id="AboutNav" /* onclick="OnAboutClicked()" */>
            About
          </li>
          <li id="GitHubNav" /* onclick="OnGithubClicked()" */>Github</li>
        </ul>
      </nav>
      {children}
    </div>
  );
};

export default MainSection;
