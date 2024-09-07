import { ReactNode } from "react";
import {
  useMainContainer,
  EActiveTab,
} from "./Providers/MainContainerProvider";
import "./css/Global.css";
import { useNavigate } from "react-router-dom";

import "./css/Global.css";

const MainSection = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const {
    activeTab,
    OnHomeClicked,
    OnImageGathererClicked,
    OnWebsiteClicked,
    OnSpaceTraceClicked,
    OnSaasClicked,
    OnAboutClicked,
    OnGitHubClicked,
  } = useMainContainer();

  const navigate = useNavigate();

  return (
    <div className="container">
      <nav className="menu">
        <ul className="main-menu">
          <li
            className={activeTab === EActiveTab.Home ? "active" : ""}
            onClick={() => OnHomeClicked(navigate)}
            id="HomeNav"
          >
            Home
          </li>
          <li className="with-submenu">
            <div id="PortfolioNav">Portfolio </div>
            <ul className="submenu">
              <li
                className={activeTab === EActiveTab.Website ? "active" : ""}
                onClick={() => OnWebsiteClicked(navigate)}
                id="WebsiteNav"
              >
                Website
              </li>
              <li
                className={
                  activeTab === EActiveTab.ImageGatherer ? "active" : ""
                }
                onClick={() => OnImageGathererClicked(navigate)}
                id="ImageGathererNav"
              >
                Image Gatherer
              </li>
              <li
                className={activeTab === EActiveTab.SpaceTrace ? "active" : ""}
                onClick={() => OnSpaceTraceClicked(navigate)}
                id="SpaceTraceNav"
              >
                Space Trace
              </li>
              <li
                className={activeTab === EActiveTab.Saas ? "active" : ""}
                onClick={() => OnSaasClicked(navigate)}
                id="SaaSProjectNav"
              >
                SaaS website
              </li>
            </ul>
          </li>
          <li
            className={activeTab === EActiveTab.About ? "active" : ""}
            id="AboutNav"
            onClick={() => OnAboutClicked(navigate)}
          >
            About
          </li>
          <li id="GitHubNav" onClick={OnGitHubClicked}>
            Github
          </li>
        </ul>
      </nav>
      <div className="content" id={title}>
        <h1>{title}</h1>
        <div> {children}</div>
      </div>
    </div>
  );
};

export default MainSection;
