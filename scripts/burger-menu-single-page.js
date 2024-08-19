document.addEventListener("DOMContentLoaded", function() {
    var burgerMenu = document.querySelector(".burger-menu");
    var menu = document.querySelector(".menu-single-page");

    burgerMenu.addEventListener("click", function() {
        menu.classList.toggle("active");
    });
});