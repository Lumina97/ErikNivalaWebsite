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
    const ImageGathererNav = document.getElementById("ImageGathererNav")
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
    }

    else if (element == "about") {
        About.style.display = "block";
        AboutNav.classList.add("active");
    }

    else if (element == "website") {
        Website.style.display = "block";
        WebsiteNav.classList.add("active");
        PortfolioNav.classList.add("active");
    }

    else if (element == "imagegatherer") {
        ImageGatherer.style.display = "block";
        ImageGathererNav.classList.add("active");
        PortfolioNav.classList.add("active");
    }
    else if (element == "spacetrace") {
        SpaceTrace.style.display = "block";
        SpaceTraceNav.classList.add("active");
        PortfolioNav.classList.add("active");
    }


}

function OnHomeClicked() {
    EnableElement("home");
}

function OnAboutClicked() {
    EnableElement("about");
}

function OnWebsiteClicked() {
    EnableElement("website");
}

function OnImageGathererClicked() {
    EnableElement("imagegatherer");
}

function OnSpaceTraceClicked() {
    EnableElement("spacetrace");
}

function OnGithubClicked() {
    window.open("https://github.com/Lumina97?tab=repositories", '_blank');
}