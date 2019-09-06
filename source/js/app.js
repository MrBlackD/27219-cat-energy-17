window.onload = function () {
  const menuButton = document.querySelector(".hamburger-button");
  const navigation = document.querySelector(".navigation");
  const map = document.querySelector(".map");

  navigation.classList.remove("navigation__no-js");
  menuButton.classList.remove("hamburger-button__no-js");
  map.classList.remove("map__no-js");

  menuButton.addEventListener("click", function(e) {
    e.preventDefault();
    menuButton.classList.toggle("hamburger-button_active");
    if (navigation) {
      navigation.classList.toggle("navigation_collapsed");
    }
  });
};
