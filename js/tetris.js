const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20); //Aumenta o tamanho do que é desenhado no canvas por um fator de 20 nas dimensões x e y

//Os formatos serão desenhados a partir de uma matriz 3x3:
//Cada formato vai ser contido, então, em um grid. Por exemplo, a peça que tem formato de T:
const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
]
//A escolha por uma matriz nxn é para facilitar rotações a partir do centro (i,i), onde i é o valor intermediário entre [0,n].

//Player é uma estrutura que armazena a posição atual a partir do canto superior esquerdo (offset) e a peça atual (matrix)
const player = {
    pos: { x: 5, y: 5 },
    matrix: matrix
}

/*drawMatrix: função cujo input é a matriz que representa uma peça e o offset, que diz quão distante a peça está do canto superior direito (0,0). O output é o desenho dessa respectiva peça na posição desejada do canvas. */
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        })
    });
};

//draw: função genérica para desenhar no canvas
function draw() {
    //Deixar o canvas todo preto, o que apaga as posições anteriores da mesma peça
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(player.matrix, player.pos)
}

//update: a função update faz duas ações. A primeira é a de chamar a função draw() e desenhar a peça nas coordenadas atuais do ponteiro no canvas. A seguinte, é usar o método requestAnimationFrame() para preparar a próxima animação através do callback de uma função, que é recursivamente a própria update(): uma animação sucede a outra sem fim para o jogo, continuamente.

let lastTime = 0;

let dropCounter = 0;
let dropInterval = 1000; //1000ms

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime; //incrementalmente aumenta dropCounter
    if (dropCounter > dropInterval) { //se o número de timesteps deu mais que o tempo neste dropInterval
        player.pos.y++; //a peça "cai" uma posição no tabuleiro
        dropCounter = 0;
    }
    console.log(deltaTime);
    draw();
    requestAnimationFrame(update);
}

//Teste
//draw();

update();