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
function OnSaaSLinkClicked() {
  window.location.href = "/Portfolio/SaaS Website/index.html";
}

function OnSaaSProjectClicked() {
  window.location.href = "/saas";
}

function OnPortfolioClicked() {
  window.location.href = "/saas";
}

function OnHomeClicked() {
  window.location.href = "/home";
}

function OnAboutClicked() {
  window.location.href = "/about";
}

function OnWebsiteClicked() {
  window.location.href = "/website";
}

function OnImageGathererClicked() {
  window.location.href = "/imageGatherer";
}

function OnSpaceTraceClicked() {
  window.location.href = "/spaceTracePage";
}

function OnGithubClicked() {
  window.open("https://github.com/Lumina97?tab=repositories", "_blank");
}
