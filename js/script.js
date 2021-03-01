const btnHamburger = document.querySelector("a.menu");
const navbar = document.querySelector("nav");
const headerLinks = document.querySelector('.header-links');
console.log(btnHamburger)

btnHamburger.addEventListener('click', function () {
    console.log('open hamburger');
    console.log(btnHamburger.classList)
    if (navbar.classList.contains('open')) {
        navbar.classList.remove('open');
        headerLinks.classList.add('has-fade');
    }
    else {
        navbar.classList.add('open');
        headerLinks.classList.remove('has-fade');
        console.log('Now there is an open class')
    }
})