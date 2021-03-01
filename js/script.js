const btnHamburger = document.querySelector("a.menu");
console.log(btnHamburger)

btnHamburger.addEventListener('click', function () {
    console.log('open hamburger');
    console.log(btnHamburger.classList)
    if (btnHamburger.classList.contains('open')) {
        btnHamburger.classList.remove('open');
    }
    else {
        btnHamburger.classList.add('open');
        console.log('Now there is an open class')
    }
})