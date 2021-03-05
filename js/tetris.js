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

//createMatrix: função que gera a matriz que guarda a relação das peças que já foram depositadas na tela.
function createMatrix(w, h) {
    const matrix = [];
    while (h--) { //enquanto h !== 0 faça h--
        matrix.push(new Array(w).fill(0)); //faz um novo array de comprimento w preenchido por zeros
    }
    return matrix;
}

//Criando a área onde as peças podem ser depositadas
const arena = createMatrix(12, 20);
console.log(arena);
console.table(arena);

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

//collide: colide a peça atual com a arena (bordas e outras peças já depositadas)
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos]; //assimila a estrutura player a uma tupla com duas partes individuais: peça e posição (offset, o)
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            /* Aqui checa se a matriz correspondente à peça (m[y][x]) na posição (x,y) é não-nula, checa se a arena é não-nula em (x,y tanto pra linha quanto pra coluna*/
            if ((m[y][x] !== 0) && arena[y + o.y]) && (arena[y + o.y][x + 0.x]) !== 0 {
                return true;//e se sim, retorna verdadeiro
            }
            else {
                return false;//senão, falso
            }
        }
    }
}

//merge: combina as posições das peças já depositadas (arena) com a atual sob controle do jogador (player)
function merge(arena, player) {
    player.matrix.forEach((row, y) => { //pra peça atual [player.matrix]
        //itere pelas linhas
        row.forEach(value, x) => {
            if (value !== 0) { //se não é um espaço vazio na peça
                //salva essa peça na arena
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        }
    })
}

//playerDrop: 
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {//se colidiu
        player.pos.y--; //diminui em um a posição
        merge(arena, player); //e registra a peça
        player.position.y = 0;//retornando a 0 pras próximas iterações
    }
    dropCounter = 0;
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
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

//Controlando os movimentos da peça com o teclado
document.addEventListener('keydown', event => {
    if (event.keyCode === 37) { //se é o botão para mover pra esquerda
        player.pos.x--; //reduz uma posição no x
    }
    else if (event.keyCode === 39) { //se é o botão para mover pra direita
        player.pos.x++;
    }
    else if (event.keyCode === 40) {
        playerDrop();
    }
})

//Teste
update();