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

//makePiece(type): recebe o tipo de peça e retorna a matriz correspondente
function makePiece(type) {
    switch (type) {
        case 'T':
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        case 'L':
            return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1],
            ];
        case 'J':
            return [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0],
            ];
        case 'I':
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        case 'O':
            [
                [1, 1],
                [1, 1],
            ];
        case 'S':
            return [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0],
            ];
        case 'Z':
            return [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0],
            ];
        default:
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
    }
}


//draw: função genérica para desenhar no canvas
function draw() {
    //Deixar o canvas todo preto, o que apaga as posições anteriores da mesma peça
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos)
}

//collide: colide a peça atual com a arena (bordas e outras peças já depositadas)
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos]; //assimila a estrutura player a uma tupla com duas partes individuais: peça e posição (offset, o)
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            /* Aqui checa se a matriz correspondente à peça (m[y][x]) na posição (x,y) é não-nula, checa se a arena é não-nula em (x,y tanto pra linha quanto pra coluna*/
            if (m[y][x] !== 0 && (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;//e se sim, retorna verdadeiro
            }
        }
    }
    return false;
}

//merge: combina as posições das peças já depositadas (arena) com a atual sob controle do jogador (player)
function merge(arena, player) {
    player.matrix.forEach((row, y) => { //pra peça atual [player.matrix]
        //itere pelas linhas
        row.forEach((value, x) => {
            if (value !== 0) { //se não é um espaço vazio na peça
                //salva essa peça na arena
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    });
}

//playerDrop: 
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {//se colidiu
        player.pos.y--; //diminui em um a posição
        merge(arena, player); //e registra a peça
        playerReset();
    }
    dropCounter = 0;
}

//playerMove: move a peça horizontalmente e checa se houve uma colisão
function playerMove(step) {
    player.pos.x += step;
    if (collide(arena, player)) {
        player.pos.x -= step;
    }

}

//playerReset:
function playerReset() {
    const availablePieces = 'ILJOTSZ';
    //    const availablePieces = ['J', 'L', 'I', 'S', 'Z', 'O', 'T'];
    console.log(availablePieces[availablePieces.length * Math.random() | 0]);
    player.matrix = makePiece(availablePieces[availablePieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
}

//rotate: rotaciona a estrutura matrix, que representa a maneira como a peça se posiciona no canvas
function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            //inversão das tuplas para fazer a transposição da matriz, com A(x,y) = B(y,x) para todos x,y, onde B é a transposta de A
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                    matrix[y][x],
                    matrix[x][y]
                ];
        }
    }
    if (direction > 0) { //se for uma rotação horária
        matrix.forEach(row => row.reverse());
    }
    else { //ou anti-horária
        matrix.reverse();
    }
}

/*No fim do documento você encontra um comentário sobre o que acontece na rotação (pode ser pulado).*/

//playerRotate:
function playerRotate(direction) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, direction);
    //Conferir se a rotação não é feita através de uma parede, o que é proibido
    while (collide(arena, player)) {
        player.pos.x += offset;
        //sintaxe de operador condicional: condition ? val1 : val2 (MDN)
        offset = -(offset + (offset > 0 ? 1 : -1))
        /*condição = offset > 0; val1 = 1, val2 = -1
        assim, o offset aumenta em 1 e muda de sinal a cada iteração
        ou seja, ele checa se colide, se sim ele move 1 casa para um lado; se ainda colidir, move 2 casas para o lado oposto, cobrindo dessa maneira todas as possíveis casas na mesma linha do canvas
        */
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.pos.x = pos;
            return;
        }
    }
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
        playerMove(-1);
    }
    else if (event.keyCode === 39) { //se é o botão para mover pra direita
        playerMove(1);
    }
    else if (event.keyCode === 40) {//para baixar a peça mais rápido
        playerDrop();
    }
    else if (event.keyCode === 81) {//Q, rotação anti-horária da peça
        playerRotate(-1);
    }
    else if (event.keyCode === 87) {//W, rotação horária da peça
        playerRotate(1);
    }
})

//Teste
update();

/* ================= Comentário sobre rotações
Uma matriz é representada como um array multidimensional (um vetor 3x1, onde cada elemento é um vetor 1x3).

Na transposição, a inversão de tuplas é sob a seleção dos elementos [x][y] e [y][x], que pega os itens fora da diagonal principal e troca eles de posição, como um espelhamento em relação à linha (a,a) para todos a em (0,dim{matriz}).

Na reversão, ela pode ocorrer de duas maneiras. Em uma rotação no sentido horário, inverte-se o ordenamento do array correspondente a cada linha (vetor 1x3), que equivale a um reordenamento das colunas (a terceira coluna vira a primeira, a primeira a terceira, etc.). Em uma rotação no sentido anti-horário, inverte-se o ordenamento do próprio array de arrays (3x1), que equivale a um reordenamento das linhas (a última linha vira a primeira, a primeira vira a última, etc.

Exemplo: rotação de matriz 2x2
[[a,b],[c,d]]

[a,b]
[c,d]

Temos um vetor "master" [2x1], cujos elementos são vetores [2x1]
A transposição equivale ao espelhamento ao longo da diagonal principal:
T([[a,b],[c,d]]) = [[a,c],[b,d]]
conservando as posições (i,i) idênticas
[a,c]
[b,d]

Das transformações por rotação, em sentido horário, invertem-se os vetores I = [a,c] e J = [b,d] individualmente, mas mantêm-se a ordem do vetor "master" [I,J]:
[[c,a],[d,b]]

[c,a]
[d,b]

Podemos ver que o resultado é equivalente à "rotação" horária dos elementos ("c" ocupa o lugar que era de "a", "a" que era de "b", "b" de "d", "d" de "c")
[a,b] => [c,a]
[c,d]    [d,b]

No caso da rotação em sentido anti-horário, revertemos a ordem do vetor "master" [I,J] em [J,I] mas conservamos a ordem individual dos I = [a,c] e J = [b,d]:
[[b,d],[a,c]]

[b,d]
[a,c]

O resultado disso é equivalente à "rotação" horária dos elementos ("b" ocupa o lugar que era de "a", "d" o que era de "b", "c" o de "d", "a" o que era de "c")
[a,b] => [b,d]
[c,d]    [a,c]
*/