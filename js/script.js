const btnHamburger = document.querySelector("a.menu");
const navbar = document.querySelector("nav");
console.log(btnHamburger)

btnHamburger.addEventListener('click', function () {
    console.log('open hamburger');
    console.log(btnHamburger.classList)
    if (navbar.classList.contains('open')) {
        navbar.classList.remove('open');
    }
    else {
        navbar.classList.add('open');
        console.log('Now there is an open class')
    }
})