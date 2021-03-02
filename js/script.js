const btnHamburger = document.querySelector('a.menu');
const documentBody = document.querySelector('body');
const header = document.querySelector('header');
const overlay = document.querySelector('.overlay');
const fadingElements = document.querySelectorAll('.has-fade');


btnHamburger.addEventListener('click', function () {
    console.log(overlay);
    console.log(btnHamburger.classList)
    if (header.classList.contains('open')) { //fechar o hamburger menu
        documentBody.classList.remove('no-scroll');
        header.classList.remove('open');
        fadingElements.forEach(function (element) {
            element.classList.add('fade-out');
            element.classList.remove('fade-in')
        })
    }
    else { //abrir o hamburger
        documentBody.classList.add('no-scroll');
        header.classList.add('open');
        //função pra verificar o botão ESC
        document.addEventListener("keydown", (e) => {
            if (e.key == 'Escape') {
                documentBody.classList.remove('no-scroll');
                header.classList.remove('open');
                fadingElements.forEach(function (element) {
                    element.classList.add('fade-out');
                    element.classList.remove('fade-in')
                })
            }
        });
        fadingElements.forEach(function (element) {
            element.classList.add('fade-in');
            element.classList.remove('fade-out')
        });
        //        overlay.classList.add('fade-in');
        //        overlay.classList.remove('fade-out');
        console.log('Now there is an open class')
    }
})

// Coloca um ">" na frente do conteúdo do item do menu que você está dando um mouseover
const possibleLinks = document.querySelectorAll('.header-links a');
const linksArray = Array.from(possibleLinks);

//Bubbling no body para adicionar ou remover '>' baseado no mouseEnter ou mouseLeave
document.addEventListener('mouseover', event => {
    if (linksArray.includes(event.target)) {
        formerTextContent = event.target.textContent;
        event.target.textContent = '> ' + formerTextContent;
        event.target.addEventListener('mouseleave', e => {
            //Restaura o texto anterior ao sair
            event.target.textContent = formerTextContent;
        })
    }
    else {
        return
    }
})