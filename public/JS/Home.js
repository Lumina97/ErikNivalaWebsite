///Allows for better mobile interaction with submenus
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth >= 768) return;

  // JavaScript to handle submenu for touch-enabled devices
  const mainMenuItems = document.querySelectorAll(".main-menu>li.with-submenu");

  mainMenuItems.forEach((item) => {
    const submenu = item.querySelector(".submenu");
    let submenuOpen = false;

    if (
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0) &&
      window.innerWidth <= 1024
    ) {
      // For touch-enabled devices and small screens, add event listener for pointerdown
      item.addEventListener("click", (event) => {
        if (!submenuOpen) {
          toggleSubmenu(submenu);
          event.stopPropagation();
        }
      });
    }

    // Close submenu when clicking outside of it
    document.addEventListener("click", (event) => {
      if (
        submenuOpen &&
        !submenu.contains(event.target) &&
        !item.contains(event.target)
      ) {
        toggleSubmenu(submenu);
      }
    });

    // Add event listener to submenu items to close submenu after selection
    const submenuItems = submenu.querySelectorAll("li");
    submenuItems.forEach((submenuItem) => {
      submenuItem.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSubmenu(submenu);
      });
    });

    function toggleSubmenu(submenu) {
      submenu.style.display =
        submenu.style.display === "block" ? "none" : "block";
      submenuOpen = !submenuOpen;
      console.log("Submenu");
    }
  });
});

function EnableElement(element) {
  //Article elements
  const Home = document.getElementById("Home");
  const About = document.getElementById("About");
  const Website = document.getElementById("Website");
  const ImageGatherer = document.getElementById("ImageGatherer");
  const SpaceTrace = document.getElementById("Space Trace");

  //nav elements
  const PortfolioNav = document.getElementById("PortfolioNav");
  const WebsiteNav = document.getElementById("WebsiteNav");
  const ImageGathererNav = document.getElementById("ImageGathererNav");
  const AboutNav = document.getElementById("AboutNav");
  const HomeNav = document.getElementById("HomeNav");
  const SpaceTraceNav = document.getElementById("SpaceTraceNav");

  //set nav not active
  HomeNav.classList.remove("active");
  PortfolioNav.classList.remove("active");
  WebsiteNav.classList.remove("active");
  ImageGathererNav.classList.remove("active");
  AboutNav.classList.remove("active");
  SpaceTraceNav.classList.remove("active");

  //disable elements
  Home.style.display = "none";
  About.style.display = "none";
  Website.style.display = "none";
  ImageGatherer.style.display = "none";
  SpaceTrace.style.display = "none";

  if (element == "home") {
    Home.style.display = "block";
    HomeNav.classList.add("active");
  } else if (element == "about") {
    About.style.display = "block";
    AboutNav.classList.add("active");
  } else if (element == "website") {
    Website.style.display = "block";
    WebsiteNav.classList.add("active");
    PortfolioNav.classList.add("active");
  } else if (element == "imagegatherer") {
    ImageGatherer.style.display = "block";
    ImageGathererNav.classList.add("active");
    PortfolioNav.classList.add("active");
  } else if (element == "spacetrace") {
    SpaceTrace.style.display = "block";
    SpaceTraceNav.classList.add("active");
    PortfolioNav.classList.add("active");
  }
}

function OnSaaSProjectClicked() {
  window.location.href = "/Portfolio/SaaS Website/index.html";
}

function OnPortfolioClicked() {
  EnableElement("portfolio");
  console.log("portfolio");
}

function OnHomeClicked() {
  EnableElement("home");
  console.log("home");
}

function OnAboutClicked() {
  EnableElement("about");
  console.log("about");
}

function OnWebsiteClicked() {
  EnableElement("website");
  console.log("website");
}

function OnImageGathererClicked() {
  EnableElement("imagegatherer");
}

function OnSpaceTraceClicked() {
  EnableElement("spacetrace");
}

function OnGithubClicked() {
  window.open("https://github.com/Lumina97?tab=repositories", "_blank");
}
