window.onload = () => {
  const menuButton = document.querySelector(".hamburger-button");
  const navigation = document.querySelector(".navigation");

  menuButton.addEventListener("click", e => {
    e.preventDefault();
    menuButton.classList.toggle("hamburger-button_active");
    if (navigation) {
      navigation.classList.toggle("navigation_collapsed");
    }
  });
};
