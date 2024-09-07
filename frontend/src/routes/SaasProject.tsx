import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircleInfo,
  faUser,
  faPhone,
  faLocationArrow,
  faCopyright,
  faCircle,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import Select from "react-select";
import "../css/Saas_Css/global.css";
import "../css/Saas_Css/style.css";
import "../css/Saas_Css/responsive.css";

const assetURL = "Saas_assets";

const SaasProject = () => {
  const budgetOptions = [
    { value: "Budget", label: "Budget" },
    { value: "1", label: "1000 $" },
    { value: "2", label: "2000 $" },
    { value: "3", label: "3000 $" },
  ];
  const CountryOption = [
    { value: "Country", label: "Country" },
    { value: "Germany", label: "Germany" },
    { value: "UK", label: "UK" },
    { value: "Poland", label: "Poland" },
  ];

  const toggleMobileMenu = (menu: HTMLElement) => {
    menu.classList.toggle("open");
  };

  return (
    <div className="Saas-Page">
      <header>
        <div className="SaaS-container header-wrapper">
          <div className="company-logo">
            <img src={`${assetURL}/project_logo/logo.svg`} alt="" />
          </div>
          <nav>
            <ul className="nav-list">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/">Features</a>
              </li>
              <li>
                <a href="/">Learn</a>
              </li>
              <li>
                <a href="/">Pricing</a>
              </li>
              <li>
                <a href="/">Hire us</a>
              </li>
              <a href="/" className="btn btn-primary">
                {" "}
                Buy Now
              </a>
            </ul>

            <div
              className="mobile-menu-wrapper"
              onClick={(e) => {
                toggleMobileMenu(e.currentTarget);
              }}
            >
              <FontAwesomeIcon icon={faBars} />
              <div className="mobile-menu">
                <hr />
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/">Features</a>
                  </li>
                  <li>
                    <a href="/">Learn</a>
                  </li>
                  <li>
                    <a href="/">Pricing</a>
                  </li>
                  <li>
                    <a href="/">Hire us</a>
                  </li>
                  <a href="/" className="btn btn-primary">
                    {" "}
                    Buy Now
                  </a>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <section>
        <div className="SaaS-container empowering-wrapper">
          <div className="empowering-text-wrapper">
            <h1>
              Empowering <br />
              teams with the <br />
              freedom
            </h1>
            <p>Own the unlimited power of web development</p>
            <a href="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlay} /> Play Video
            </a>
            <a href="/" className="btn">
              Learn More
            </a>
          </div>

          <div className="logo-icon-wrapper">
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/asana.png`} alt="" />
            </div>
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/atlassian.png`} alt="" />
            </div>
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/calendar.png`} alt="" />
            </div>
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/google-A.png`} alt="" />
            </div>
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/google.png`} alt="" />
            </div>
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/paypal.jpg`} alt="" />
            </div>
            <div className="logo-icon">
              <img src={`${assetURL}/logo_icons/weave.png`} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="SaaS-container benefits-wrapper">
          <h2>Key benefits</h2>
          <h4>Design faster with a growing array of beautiful templates</h4>

          <div className="benefits-cards-wrapper">
            <div className="benefits-card">
              <div className="card-img-wrapper">
                <img src={`${assetURL}/icons/responsive.svg`} alt="" />
              </div>
              <h4>Responsive</h4>
              <p>
                All of our components are mobile responsive an well visible on
                every screen size.
              </p>
              <a href="/" className="btn">
                Learn More
              </a>
            </div>

            <div className="benefits-card">
              <div className="card-img-wrapper">
                <img src={`${assetURL}/icons/customizable.svg`} alt="" />
              </div>
              <h4>customizable</h4>
              <p>Easily customize components to you needs and application.</p>
              <a href="/" className="btn">
                Learn More
              </a>
            </div>

            <div className="benefits-card">
              <div className="card-img-wrapper">
                <img src={`${assetURL}/icons/premium.svg`} alt="" />
              </div>
              <div className="premium-card-header">
                <h4>premium</h4>
                <span id="sketch">sketch</span>
              </div>
              <p>We ensure high quality in everything we offer.</p>
              <a href="/" className="btn">
                Learn More
              </a>
            </div>

            <div className="benefits-card">
              <div className="card-img-wrapper">
                <img src={`${assetURL}/icons/documentation.svg`} alt="" />
              </div>
              <h4>documentation</h4>
              <p>Access to our in depth documentation of all our components.</p>
              <a href="/" className="btn">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="SaaS-container banner-wrapper">
          <div>
            <h2>Front makes you look at things from a different perspective</h2>
            <a href="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlay} /> Play Video
            </a>
          </div>
          <div>
            <img src={`${assetURL}/banners/banner_one.jpg`} alt="banner_01" />
          </div>
        </div>
      </section>

      <section>
        <div className="SaaS-container why-front-wrapper">
          <h2>Why front?</h2>
          <p>
            Front is an incredibly beautiful,fully responsive, and mobile-first
            projects on <br />
            the web - it is the starting point for creative sites
          </p>

          <div className="why-front-dots">
            <div className="dot-wrapper">
              <div className="dot">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <h4>Basic elements</h4>
            </div>

            <div className="dot-line"></div>

            <div className="dot-wrapper">
              <div className="dot">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <h4>Components</h4>
            </div>

            <div className="dot-line"></div>

            <div className="dot-wrapper">
              <div className="dot">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <h4>Combined components</h4>
            </div>

            <div className="dot-line"></div>

            <div className="dot-wrapper">
              <div className="dot">
                <FontAwesomeIcon icon={faCircle} />
              </div>
              <h4>Page layouts</h4>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="banner2 SaaS-container">
          <img src={`${assetURL}/banners/banner_two.jpg`} alt="Banner 2" />
        </div>
      </section>

      <section>
        <div className="SaaS-container">
          <div className="hub-spot-wrapper">
            <div>
              <img
                className="hub-spot-main-img"
                src={`${assetURL}/people/woman_three.jpg`}
                alt="women3"
              />
              <img
                className="dots-background"
                src={`${assetURL}/abstract/dots.svg`}
                alt="dots"
              />
            </div>
            <div className="hub-spot-text">
              <div>
                <img
                  src={`${assetURL}/company_logos/hubspot.svg`}
                  alt="hubspot"
                />
              </div>
              <h3>
                The template is really nice and offers quite a large set of
                options. It's beautiful and the coding is done quickly and
                seamlessly. Thank you!
              </h3>
              <h4>Christina Kray</h4>
              <h5>Executive Director</h5>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="SaaS-container trusted-by-wrapper">
          <h2>TRUSTED BY WORLD'S BEST</h2>
          <div className="company-display-wrapper">
            <div className="company">
              <img src={`${assetURL}/company_logos/weebly.svg`} alt="weebly" />
            </div>
            <div className="company">
              <img src={`${assetURL}/company_logos/uber.svg`} alt="uber" />
            </div>
            <div className="company">
              <img src={`${assetURL}/company_logos/slack.svg`} alt="slack" />
            </div>
            <div className="company">
              <img src={`${assetURL}/company_logos/airbnb.svg`} alt="airbnb" />
            </div>
            <div className="company">
              <img src={`${assetURL}/company_logos/slack.svg`} alt="slack" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="SaaS-container">
          <div className="pricing-header">
            <h2>Pricing</h2>
            <p>No additional costs. Pay for what you use</p>
          </div>
          <div className="pricing-wrapper">
            <div className="main-price-card">
              <div className="main-price">
                <h2>59</h2>
                <span>/ mo</span>
              </div>
              <hr />
              <p>
                Start your Front business now. 100% guaranteed money back. No
                questions asked.
              </p>
              <a href="/" className="btn btn-primary">
                <FontAwesomeIcon icon={faPlay} /> Play Video
              </a>
              <p className="price-card-footer-text">No credit card required</p>
            </div>

            <div className="price-card-benefits">
              <div className="benefits-card">
                <div className="card-img-wrapper">
                  <img
                    src={`${assetURL}/icons/components.svg`}
                    alt="components"
                  />
                </div>
                <h4>Hundreds of components</h4>
                <p>
                  Achieve maximum productivity with minimum effort with Front
                  and create robust Limitless products.
                </p>
              </div>

              <div className="benefits-card">
                <div className="card-img-wrapper">
                  <img src={`${assetURL}/icons/images.svg`} alt="images" />
                </div>
                <h4>Images Included</h4>
                <p>
                  Images included We made custom license for all our premium
                  images in the front
                </p>
              </div>

              <div className="benefits-card">
                <div className="card-img-wrapper">
                  <img src={`${assetURL}/icons/cancel.svg`} alt="cancel" />
                </div>
                <h4>
                  Cancel anytime <span id="sketch">sketch</span>
                </h4>
                <p>If its not for you, just cancel, no hidden costs or fees.</p>
              </div>

              <div className="benefits-card">
                <div className="card-img-wrapper">
                  <img
                    src={`${assetURL}/icons/moneyback.svg`}
                    alt="money back"
                  />
                </div>
                <h4>Money back</h4>
                <p>100% guaranteed money back. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hire-us-section">
        <div className="SaaS-container">
          <div className="hire-us-wrapper">
            <div className="hire-us-text">
              <div>
                <h4>Hire Us</h4>
                <p>
                  Whatever your goal- <br />
                  we will get you there
                </p>
                <hr />
                <p>
                  "I love front! I love the ease of use, I love the fact that I
                  have total creative freedom..."
                </p>
              </div>
              <div>
                <h5>Charlotte Moore</h5>
                <p>Head of Commercial, Slack</p>
                <div className="hire-us-people-wrapper">
                  <img src={`${assetURL}/people/woman_two.jpg`} alt="woman2" />
                  <img src={`${assetURL}/people/woman_one.jpg`} alt="woman1" />
                  <img src={`${assetURL}/people/man_one.jpg`} alt="man1" />
                </div>
              </div>
            </div>

            <div className="hire-us-from-wrapper">
              <h4>
                Fill out the form and we'll be in touch as soon as possible
              </h4>
              <form className="hire-us-form">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  placeholder="First name"
                />
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  placeholder="Last name"
                />
                <Select
                  name="Budget"
                  id="budget"
                  options={budgetOptions}
                  defaultValue={budgetOptions[0]}
                ></Select>
                <Select
                  name="Country"
                  id="Country"
                  options={CountryOption}
                  defaultValue={CountryOption[0]}
                ></Select>

                <textarea
                  name="info"
                  id="info"
                  placeholder="Tell us more about your project, needs, and timeline, please..."
                ></textarea>

                <div className="newsletter-checkbox">
                  <input type="checkbox" name="newsletter" />
                  <label>
                    Yes, I'd like to receive occasional marketing emails from
                    Front. I have the right to opt out at any time
                  </label>
                </div>
                <a href="/">View privacy policy</a>

                <a href="/" className="btn btn-primary">
                  {" "}
                  Get started{" "}
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="SaaS-container">
          <div className="contact-footer-wrapper">
            <div className="contact-footer">
              <div className="contact-footer-image-wrapper">
                <img
                  src={`${assetURL}/project_logo/logo.svg`}
                  alt="Front logo"
                />
              </div>
              <a href="/">
                <FontAwesomeIcon icon={faLocationArrow} /> 153 Williamson Plaza,
                Maggieberg
              </a>
              <a href="/">
                <FontAwesomeIcon icon={faPhone} /> +1 (062) 109-9222
              </a>
            </div>
            <div className="company-footer">
              <h3>Company</h3>
              <a href="/">About</a>
              <a href="/">
                Career <span className="hiring-span">We're hiring</span>
              </a>
              <a href="/">Blog</a>
              <a href="/">Customers</a>
              <a href="/">Hire us</a>
            </div>
            <div className="features-footer">
              <h3>Features</h3>
              <a href="/">Press</a>
              <a href="/">Release notes</a>
              <a href="/">Integrations</a>
              <a href="/">Pricing</a>
            </div>
            <div className="documentation-footer">
              <h3>Documentation</h3>
              <a href="/">Support</a>
              <a href="/">Docs</a>
              <a href="/">Status</a>
              <a href="/">API Reference</a>
              <a href="/">Tech Requirements</a>
            </div>
            <div className="resources-footer">
              <h3>Resources</h3>
              <a href="/">
                <FontAwesomeIcon icon={faCircleInfo} /> Help
              </a>
              <a href="/">
                <FontAwesomeIcon icon={faUser} /> Your Account
              </a>
            </div>
          </div>
          <hr />
          <div className="footer">
            <div className="footer-top-wrapper">
              <span>
                <a href="/">Privacy & Policy</a> <a href="/"> Terms </a>
                <a href="/"> Site Map</a>
              </span>

              <span className="socials-container">
                <a href="/">
                  {" "}
                  <FontAwesomeIcon className="I" icon={faFacebook} />
                </a>
                <a href="/">
                  {" "}
                  <FontAwesomeIcon className="I" icon={faGoogle} />
                </a>
                <a href="/">
                  {" "}
                  <FontAwesomeIcon className="I" icon={faTwitter} />
                </a>
                <a href="/">
                  {" "}
                  <FontAwesomeIcon className="I" icon={faGithub} />
                </a>

                <select className="language" name="Language" id="Language">
                  <option value="United States " content="United States">
                    United States
                  </option>
                </select>
              </span>
            </div>

            <div className="footer-bottom">
              <p>
                <FontAwesomeIcon icon={faCopyright} /> Front. 2022 Responsive
                designs. All right reserved.
              </p>

              <p>
                When you visit or interact with our sites, services or tools, we
                or our authorized service providers may use cookies for storing
                information to help provide you with better, faster and safer
                experience and for marketing purposes.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SaasProject;
