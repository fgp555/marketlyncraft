let btnNavbar = document.querySelector(".btnNavbar");
let navbarUl = document.querySelector("header .navbar nav ul");

btnNavbar.addEventListener("click", function () {
  btnNavbar.classList.toggle("icon-times");
  navbarUl.classList.toggle("d-block");
});
