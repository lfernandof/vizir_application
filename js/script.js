const btnHamburger = document.querySelector('a.menu');
const header = document.querySelector('header');
const headerLinks = document.querySelector('.header-links');
const overlay = document.querySelector('.overlay');
console.log(btnHamburger)

btnHamburger.addEventListener('click', function () {
    console.log(overlay);
    console.log(btnHamburger.classList)
    if (header.classList.contains('open')) { //fechar o hamburger menu
        header.classList.remove('open');
        overlay.classList.add('fade-out');
        overlay.classList.remove('fade-in')
    }
    else { //abrir o hamburger
        header.classList.add('open');
        overlay.classList.add('fade-in');
        overlay.classList.remove('fade-out');
        console.log('Now there is an open class')
    }
})