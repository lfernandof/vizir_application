const btnHamburger = document.querySelector('a.menu');
const documentBody = document.querySelector('body');
const header = document.querySelector('header');
const overlay = document.querySelector('.overlay');
const fadingElements = document.querySelectorAll('.has-fade');
// Colocar um ">" na frente do conteúdo do item do menu que você está dando um mouseover
const possibleLinks = document.querySelectorAll('.header-links a');
const linksArray = Array.from(possibleLinks);

//Chamada da função caso o DOM já esteja com o .readyState completo (ou seja, carregado):
window.onload = function () {
    setTimeout(function () {
        documentBody.classList.remove('no-scroll');
        documentBody.classList.add('fade-in');
        loaderDiv = document.getElementById('loader-div');
        console.log('removendo...');
        loaderDiv.remove()
    }, 3000);
};

// Função nomeada para não criar duplicata por causa de múltiplas chamadas do mesmo EventListener, que ocorrem por consequência de abertura e fechamento do hamburger
var overThisElement = function (event) {
    //o que acontece no "hover"
    if (linksArray.includes(event.target)) {
        formerTextContent = event.target.textContent;
        currentTargetName = '> ' + formerTextContent;
        event.target.textContent = currentTargetName;
        event.target.addEventListener('mouseleave', e => {
            //Restaura o texto anterior ao sair
            event.target.textContent = formerTextContent;
        })
    }

};

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
        //Adicionar o '>' na frente do elemento com hover
        document.addEventListener('mouseover', overThisElement)
        //Fechar a janela com o botão ESC
        document.addEventListener("keydown", (e) => {
            if (e.key == 'Escape') {
                documentBody.classList.remove('no-scroll');
                header.classList.remove('open');
                fadingElements.forEach(function (element) {
                    element.classList.add('fade-out');
                    element.classList.remove('fade-in')
                })
            }
            else {
                return
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


