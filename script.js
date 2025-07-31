document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const hitsSpan = document.getElementById('hits');
    const missesSpan = document.getElementById('misses');
    const playerNameInput = document.getElementById('playerName');
    const startGameBtn = document.getElementById('startGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const winnersList = document.getElementById('winnersList');

    // Novos elementos para a funcionalidade de adivinhação
    const guessSection = document.querySelector('.guess-section');
    const stateGuessInput = document.getElementById('stateGuessInput');
    const checkGuessBtn = document.getElementById('checkGuessBtn');
    const guessFeedback = document.getElementById('guessFeedback');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let hits = 0;
    let misses = 0;
    let currentPlayer = 'Jogador';
    let gameStarted = false;
    let awaitingGuess = false; // Novo estado para controlar quando a adivinhação é necessária

    // Array de bandeiras dos estados brasileiros (mais exemplos adicionados)
    const flagImages = [
        { name: 'Acre', img: 'https://todabandeira.com.br/wp-content/uploads/2023/03/bandeira-dos-estados-do-brasil01.jpg' },
        { name: 'Alagoas', img: 'https://todabandeira.com.br/wp-content/uploads/2023/03/bandeira-dos-estados-do-brasil02.jpg' },
        { name: 'Amapá', img: 'https://todabandeira.com.br/wp-content/uploads/2023/03/bandeira-dos-estados-do-brasil03.jpg' },
        { name: 'Amazonas', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACzCAMAAACXZfGrAAAAjVBMVEX////SAAAAHnj98/PphYVkED/a3utEWpyZpckFIntmeK6Aj7wEInoKJ313h7cTL4JNYqH4+ftvgLORnsXO1OU9VJgmQIxecaqqtNIeOIgZNIUtRpC5wdpVaaUPK4Dp7PPDyt80TJTt7/XU2egiPIri5fCjrs5Xa6Zpe7DGzeGcqMuIlsC6w9ups9HWdHvfHU7mAAAE3UlEQVR4nO2bCY/rJhRGKW2Ddxtv2ZzNiZ1kktf///NKvIETT6eq9F7J8B1ppGtkSxwM+EIYQn8dM6IXUIc61KEOdah/Z/UslDHzZBzR/xzbarnG6slcxgulzvu1Uv2V1Kr8Id5W9hDnqbw9K95APWesTBlrzNYs4gVjTSc4sA2pGds2IswhCWs7RMYC4rLsYewxdiMxyx7FPmMfZM4OTXswtiARW+uu7luPq1vz8sJChDxuypd7EZfz7n2KeNf2h8NDpGp0KatEPGsVo1LEad7Ecy7i+0p3dUqFr9vHV0Kcvl+LGrMu9oRX/xK3nPDe6iRaqu/9B9E6/USxES0iR4K+6rPiuhgUi2PSxSFfVH2T5Lze9U3CeF32E8K5tPihi+PdB1928a2quZwQtFVfx9QLunpmZ+oH3euKGN0G3T3zjIZxF1/W9NQ3Q3Ci63MXuyt66JvktqXtFKC3+s8H6toAdaibqs5W01WeTxf/m3u8s3Khsbp1ma5/epguV1jtvMlydn8D9YNz4TPHOT1XPnICcnec7bhwdOXNnZokzub50dBx9iR2+lRQW3XPJUPerrKtRfmOjcrsKhxdr4+Ek+tLq1G2E88uhlbTVV2sU5UcXqWSOXxHRp6G9lK02lSPjwg5yitt1e1qURQT1V/xJH1qkoQ83Tiv3DKjr4gnuewg2qrnYgBf/Nfqi7W3/zQOKsLHY98J6ellqAtij2bfJYc/WAIxMsj9EbCvH1B5b/V25mqZmBO/tTpdNTs44u+4/vrm76UuFuHNc/uJaeF91e1PqvxU7jbP1f94z2S5xurRa1LScBl/so8ixSGkHL/1T8a95ygXGqvXn9T/OPpk5yLzseclGSWzy3K6/0fXN1A/BAGvgmD5UvngRq5BLM2CZgc6Tz+GEtsJCvIRvCzetnGQklugfQ5PYzFtl695iZ+I+XymrN3cNpvxXTkMlntxzyJ8fvSxV89JMtynrfojhw9eat/W+Kvc5d1z+N0tuU9U/1ReimSiXOVydKqp5rHucSn3P7RVz8UQ3kxMVtmJ2l/t04jnwmiiXDyXy7GirfrPB+raAHXD1e2fHGusfs5lfFESlED5ZKtbVZ/EtpIdjPZ3NFZfKHXeK9+zmfxu2aVcpW+5/GSflJ/RM+VczUY5V6OtemZ98NJKmsVbZNWkspLG7GwtyMy6NdmrYxUktdyHpR1be7K3mh/hPddKyd2KH7F/s45kYTUNF96sGflhbXRXpxs+nI2hc877szE0Fnl42i5nbVfE3dmYJrfv9ti3P0Rct+99VTzy9va956mI3aEPaKs+yuGvRG61K/vwdklIPyH4oqn6CUHN4R9naYbmfJccPnb3XRyW86Q/V5PvNnWfw2dVVPTNcz6yfb8REV9ZOhwiKdiw0KsX0U4ug7VVP4nXybrJai3qy7qOegjlb2yZL88/Mo/afW+IbOoPsRgAmYxXyOGhrhNQhzrUoQ7176r+56/jrz+0gvxmLFA3EaibCNRNBOomAnUTgbqJQN1EoG4iUDcRqJsI1E0E6iYCdROBuolA3USgbiJQNxGomwjUTQTqJgJ1E4G6iUDdRKBuIlA3EaibCNRNBOomAnUTIb8by//938QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMbwN74tpy64JNBNAAAAAElFTkSuQmCC' },
        { name: 'Bahia', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAnFBMVEX////TGSAAMIfdZmnSCxX23d3QAADqqKkAH4GlrMkAHYEAJYN6hrEAMIllKm7aGBYAK4UACHwADX0AGYAAKITj5+9ic6gAEn7r7vQAJIMAEX4AGoCEkbmuttA7U5f19vqbpcUAAHy7wtdYaqMwS5PU2eeSncAmRJBxgK+zu9MXO4zX2+jEyt1OYp8LNYpEWpt2dqVkIGldFme8q78HzoFGAAADUUlEQVR4nO3b2XLaQBBGYYVsQnhiAbIFeJGN9z3L+79bQmww6B+NBMHl0Jzv2n3BKQoV3SZqvZnOTrShaKJoomiiaKJoomiiaKJoomiiaKJoopZ7mRlNSvrjsyWibEWT9Dza69JkQfciinaGNJl/jfuTv08cTWZcPpj8/VGfJjPJ5fPAVUqTF6l7Gbjo0eRFPp5ONH0em2+SPs0mBt1mH7Pmm3TvXkcOY5r8Mbyen8kavVGMN3H9Yn7mJqdJ6+Bkcei8yfPYdpP0tjR01+Rrj+0mvfvy1H5ny5tkDzJV9Oo/Zk036e7p2Emy1U2Gh765x9qPWcNNXOKdG4+2uEn/yD/4VPe1x26T9KpisHYNabfJZOHoV7eGNNskO6ucLGo2blabuN6gerR9sJVNYu9zeOo2+Dw22sRlwdn74BrSaJP8JjwcXEPabJIe1wzvnW5dk/mFo19oDWmyyfPhLyyu/n5ssYnLi/rxwFnQYpPp4S+seg1psEn62Gj+ovJrT/b982aqbjIa1weZqFxDuh9fNlNlk+ypPsdflWdB9233w0aqbOJbOPpdVqwhzTUZLvEB6fwfs9aalA5/YWP/WdBak4N28yRRdOx9oxhrIoe/MP9Z0FgTPfyFXfvWkLaaeA5/YUXueR7batJr/Bye8p0FTTUJLxz9PGdBS01cvHyS6F7PgpaaVB3+wh5kDWmoSXq+ShLPGtJQk+rDX5icBe00abJw9CrKa0gzTYKHv7B232iTuNHC0a/06wQrTWa/NFhF6SxopUnecOHot3gWNNKk9vAXNjg12KT+8Be2cBa00aRzXf+yw+Z/nWCiSaPDX9hN31iT5ORfkyycBS00WXLh6De3hrTQZLTkwtHv9SxooEnjw19YMXJ2miQrf9FZ1I7tNGl1krVIDb1PWm5NDH2erB1NaEITmtCEJoImiiaKJoomiiaKJoomKorfzs/3/sf5FUXtt/Pr62Zaz24NAAAAAAAAAAAAAAAAAAAAAACY9xFl0SeURe/9o6r/EE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE0UTRRNFE3Ub6w8wpWawW1GAAAAAElFTkSuQmCC' },
        { name: 'Ceará', img: 'https://st3.depositphotos.com/1482106/12548/i/950/depositphotos_125480224-stock-photo-waving-flag-of-ceara-state.jpg' },
        { name: 'Distrito Federal', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAC8CAMAAAC672BgAAAAaVBMVEX///8Akj/4wwCw07qZxqUAjjMAjTAAj0H9xACysR+1sh4AkEAAjkL/xwAAjUNtoTFbnjTUuhSjriTV59oAiCKNqCuEpi2Xqyd7pC52ozBinzO7tBzItxnYuxJDmjdUnTUumDiSqihWnTU2Pgs3AAACvElEQVR4nO3d21LqMBSAYYUNCawGigpqKSC+/0PupuWwekDTC8Zp+L8rZyjM9Df0aOPTEwAAAAAAAAAAAAAAAAAAAAAAAO7k9d8dvf712vU0fpvczdv4r9eup/H0OZzsdtJj8WnMMczK2p0hhicrOxrZVfjYiDiG8S18jeCxEW8MqVr0GRvxxtg5W40M63aPHmP/uVxmPka2XH7uHzzGs4gsfIxF8UPgW+KNUTA+BrtWYhCDGMSoEEPpE6PatRLDS178idpLQgzfwvmR4cJrxBvj1KJPjWhjXFr0qBFrDFlfWhQ1jmFnJ9HGmNtrDDt/8BgzHWNGDGIQgxjEIIZGDIUYCjEUYijEUHrFsIeDJUYVw6Ui344YPoZNiwaSWmLMrEvLBJI6YpxalDVij1FbPTFNi212WUKy7aK1QP39w44he7U2Zr2dN2y/1Ovy1Xp9vlY3l+QgQ45hVuvryibvzja4rP6bz9pLvF+vEsu6+ruvYcYwuduIajFqaLQotxutZa41ZONyM9QYSW7tJUZXi7S1wfR72Js1ZGNtngwzhsmLQ4eP0zZxETAubo6N82d8FB9YjI3hxZgU40KvUvs33tWic2zUPydPJsOLkbdWqi698UcIkv78Pps/UAwTY4zfvyadNYrda2v16y0G+DWZ+p2J2oAeOzagHTU6Wrjj4DegIbvWdo0fDzSGvGttHnQFjI2ucRHJQVcRgMNxjxM1hVN4JfziTvY4F3d+jcFlPx2DC8I6RnmrIOVWwfkm0jc3kS4xzqcdxCAGMYhBDGLUEEMhhkIMhRgKMRQevlF4LEvhgT2FRzkVHvJVePxbYWIAhSkjFGIoxFCIoRBDIYbCdHYKEx0qTIGpBMcwTI7arsG0uSUmVNb8VNvh4yLyGPFPws70/Ff84wYAAAAAAAAAAAAAAAAAAAAAAIBh+g+mJlo6X+XkKwAAAABJRU5ErkJggg==' },
        { name: 'Espírito Santo', img: 'data:image/png;base64,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' },
        { name: 'Goiás', img: 'data:image/png;base64,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' },
        { name: 'Maranhão', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAApVBMVEX////FNCUAAAAlJHvCHgDuzcvFxcXYgXvDKxnJNSAYI32FLFcAAHDr6/MXFneCgqpnKWYdHWIgH3kODHQTEXXj4+wdHHg0M4LX1+Tw8PVEQ4qdnb3e3ukuLYDKytsaGXeyssv39/pRUZA+PYdYV5OpqcV6a5aYmLqQkLUrKn8AAGd4eKZDQopKSozExNd9fKlhYZlnZ5QTEl1sa59wSHvJKw+bL0pyETFvAAAECklEQVR4nO2da3eaQBRFpyV9JJ2QFvGBz2iSamJN0qbt//9pxSfCYYbRLhdyOfuzwwp7eeBy50qUdzKuvl6+qySKTgA6QegEoROEThA6QegEoROETpDDnAR0Akq6dJKlcXvfopM0Onpo0EmKYKGuNZ2kaPSU6rpfZmvhRF8r1XMPTx2cBHdKqaZ7eOrgJIyjo9Sdc3jq4EQ3l056obuTi2ri7mQVHaX6zuEZff9QTdydhNOVE9V2DY9/oyqKsxPdXy+YuoZHvpNgsFngHB75TsLZdsXAMTzynejOdsXMMTzinQTebkXHMTzinfizZMmjW3jEO0miE4fHpxMvFR3n8Eh3kj4/fk+W6OH+mhsnKdKd+Kk1Q6fwCHeSPb06fU9aOp+nYXrR3PA5HYhzMppH1/lkFo3zPxV1fgTSnHjhInv2B/EcyvueLMNze/yhXtKXXilO4rvu25EHarYzz4ZynHjhY/+Y4zzo7FOQICdeoHsHH2X8iiVL6+fHapJbn+j78WFKhq28iuXX+2qSX7ONwmGxiIQZ5GbFt7JP7khMdax2vxhEXUOpL82J17hzLFWetWkmRZwT11Jlbn4elOdkWaoUXmr7A0vDWqITz/c6diVYlIh3EpcqU4uR8b29jyLTSZyfiTE/Q39kXyvVifcUmYNTsFSqk9bEGJ2ork4aD+brSdGwrFQn2hidODwF835CnViiUxweoU5s0VFqYd84FupEWx96CsIj00nQtSkpmjSX6SQs6LjZJ81lOslEp9mep53Yh2VFOtmMxG651a2wnWpg2yfNZfUeN6Sj87YUEOjUncg2aS6pb5+wniZf0wk2bWj9uvdUaAuPSCf70ZkmnRLfTxrYtmFZkU7CXfMkmuyfe6CTgT/LsKxIJ9tpcvWsM52SRnd7Q7JMmkt0spsmf8nZ49s2sC3hkehkM03ebOdW8HpTqpjDI9HJeiTW2IYOB6tomSfNBTpZjcTm7Y3vPrDaazcPywp0spwm7/jWab7VXrtx0lygkzg6hr3xhOVeu3HSXJ6ToB0tisdg41LFGB6BThaB0/saGpMaZcf1p5C1uhf/L3RCJ3RCJ3RCJ8jpnAS/P1WTk76z7s/nSsL3+CF0gtAJQicInSB0gtAJoq5OR2WdfDkdf6vq5PKElH1yR6LK/gPOEDpB6AShE4ROEDpB6ARRZTe1zhBVdvPzDCm7RU4IIYQQQgghhBBCCCG1oeyXSJwhdILQCUInCJ0gdILQCUInCJ0gdILQCUInCJ0gdILQCUInCJ0gdILQCUIniCr7n6ydIWW3yAkhhBBCCCGEEEIIIUL5QLKoC5KF74RB6AShE4ROEDpB6AShE4ROEDpB6AShE4ROEDpB6AShE4ROEDpB6AShE+QfTtw1D/edoAwAAAAASUVORK5CYII=' },
        { name: 'Mato Grosso', img: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Bandeira_de_Mato_Grosso.svg' },
        { name: 'Mato Grosso do Sul', img: 'data:image/png;base64,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' },
        { name: 'Minas Gerais', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bandeira_de_Minas_Gerais.svg' },
        { name: 'Pará', img: 'https://todabandeira.com.br/wp-content/uploads/2024/04/bandeira-do-para.jpg' },
        { name: 'Paraíba', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Bandeira_da_Para%C3%ADba.svg' },
        { name: 'Paraná', img: 'https://todabandeira.com.br/wp-content/uploads/2023/03/bandeira-dos-estados-do-brasil16.jpg' },
        { name: 'Pernambuco', img: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Bandeira_de_Pernambuco.svg' },
        { name: 'Piauí', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Bandeira_do_Piau%C3%AD.svg' },
        { name: 'Rio de Janeiro', img: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Bandeira_do_estado_do_Rio_de_Janeiro.svg' },
        { name: 'Rio Grande do Norte', img: 'https://todabandeira.com.br/wp-content/uploads/2023/03/bandeira-dos-estados-do-brasil20.jpg' },
        { name: 'Rio Grande do Sul', img: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg' },
        { name: 'Rondônia', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bandeira_de_Rond%C3%B4nia.svg' },
        { name: 'Roraima', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Bandeira_de_Roraima.svg' },
        { name: 'Santa Catarina', img: 'https://todabandeira.com.br/wp-content/uploads/2023/03/bandeira-dos-estados-do-brasil24.jpg' },
        { name: 'São Paulo', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Bandeira_do_estado_de_S%C3%A3o_Paulo.svg' },
        { name: 'Sergipe', img: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg' },
        { name: 'Tocantins', img: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandeira_do_Tocantins.svg' },
        

    ];

    function initializeGame() {
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        hits = 0;
        misses = 0;
        hitsSpan.textContent = hits;
        missesSpan.textContent = misses;
        document.body.classList.remove('correct-flash', 'wrong-flash');
        resetGuessSection(); // Reseta a seção de adivinhação

        // Embaralha as bandeiras e duplica para ter pares
        // Importante: use um subconjunto de flagImages para o jogo ser jogável
        // Aqui, estou pegando 8 bandeiras aleatórias para criar 16 cartas (8 pares)
        const selectedFlags = getRandomFlags(8); // Altere o número para mais ou menos pares
        cards = [...selectedFlags, ...selectedFlags];
        cards.sort(() => 0.5 - Math.random());

        cards.forEach((flag, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = flag.name;
            cardElement.dataset.originalIndex = index; // Adiciona um índice original para controle

            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            const img = document.createElement('img');
            img.src = flag.img;
            img.alt = `Bandeira do ${flag.name}`;
            cardFront.appendChild(img);

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = '?';

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            cardElement.addEventListener('click', () => flipCard(cardElement));
            gameBoard.appendChild(cardElement);
        });

        displayWinners();
        if (!gameStarted) {
            gameBoard.style.pointerEvents = 'none';
            resetGameBtn.style.display = 'none';
        } else {
            gameBoard.style.pointerEvents = 'auto';
            resetGameBtn.style.display = 'block';
        }
    }

    // Função para pegar um número aleatório de bandeiras
    function getRandomFlags(count) {
        const shuffled = [...flagImages].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function flipCard(card) {
        if (!gameStarted || awaitingGuess) return; // Não permite virar cartas se aguardando palpite
        if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                // Desabilita o tabuleiro enquanto as cartas estão viradas
                gameBoard.style.pointerEvents = 'none';
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    function checkForMatch() {
        const [cardOne, cardTwo] = flippedCards;
        const isMatch = cardOne.dataset.name === cardTwo.dataset.name;

        if (isMatch) {
            // Se as cartas forem um par, ativamos a seção de adivinhação
            awaitingGuess = true;
            guessSection.style.display = 'flex'; // Mostra a seção de adivinhação
            stateGuessInput.disabled = false;
            checkGuessBtn.disabled = false;
            stateGuessInput.focus(); // Coloca o foco no input
            // Armazena temporariamente o par que está sendo adivinhado
            flippedCards = [cardOne, cardTwo]; // Mantém as cartas no array para a verificação do nome
        } else {
            // Se não for um par, vira as cartas de volta
            // NOTA: Os erros de "não encontrar o par" NÃO são mais contabilizados aqui.
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
            flashBackground('wrong'); // Ainda pode dar um feedback visual de "erro de par"
            // Reabilita o tabuleiro imediatamente para continuar o jogo
            gameBoard.style.pointerEvents = 'auto';
            flippedCards = []; // Limpa as cartas viradas
        }
    }

    function processGuess(isCorrectGuess) {
        const [cardOne, cardTwo] = flippedCards;
        awaitingGuess = false;
        resetGuessSection(); // Esconde e limpa a seção de adivinhação

        if (isCorrectGuess) {
            matchedPairs++;
            hits++;
            hitsSpan.textContent = hits;
            // Cartas permanecem viradas
            cardOne.classList.add('matched');
            cardTwo.classList.add('matched');
            cardOne.style.pointerEvents = 'none'; // Desabilita clique
            cardTwo.style.pointerEvents = 'none'; // Desabilita clique
            flashBackground('correct');
            // Remove a classe 'flipped' para garantir que não haja conflitos futuros,
            // mas as cartas ficam visíveis devido à classe 'matched' e ao CSS.
            cardOne.classList.remove('flipped');
            cardTwo.classList.remove('flipped');
        } else {
            // Apenas aqui o erro é contabilizado
            misses++;
            missesSpan.textContent = misses;
            cardOne.classList.remove('flipped'); // Desvira as cartas se o palpite de nome estiver errado
            cardTwo.classList.remove('flipped'); // Desvira as cartas se o palpite de nome estiver errado
            flashBackground('wrong');
        }

        flippedCards = []; // Limpa as cartas viradas para a próxima jogada
        gameBoard.style.pointerEvents = 'auto'; // Reabilita o tabuleiro

        if (matchedPairs === (cards.length / 2)) { // Verifica se todos os pares foram encontrados
            endGame();
        }
    }

    // Função para verificar o palpite do usuário
    function checkGuess() {
        const guessedName = stateGuessInput.value.trim().toLowerCase();
        // A carta virada (qualquer uma do par) contém o nome correto
        const correctName = flippedCards[0].dataset.name.toLowerCase();

        if (guessedName === correctName) {
            guessFeedback.textContent = 'Acertou! 🎉';
            guessFeedback.classList.add('correct');
            guessFeedback.classList.remove('wrong');
            processGuess(true);
        } else {
            guessFeedback.textContent = `Errou! O nome correto é: ${flippedCards[0].dataset.name}`;
            guessFeedback.classList.add('wrong');
            guessFeedback.classList.remove('correct');
            processGuess(false); // Passa false para registrar como erro E desvirar as cartas
        }

        setTimeout(() => {
            guessFeedback.textContent = '';
            guessFeedback.classList.remove('correct', 'wrong');
        }, 2000); // Limpa a mensagem após 2 segundos
    }

    function resetGuessSection() {
        guessSection.style.display = 'none';
        stateGuessInput.value = '';
        stateGuessInput.disabled = true;
        checkGuessBtn.disabled = true;
        guessFeedback.textContent = '';
        guessFeedback.classList.remove('correct', 'wrong');
    }

    function flashBackground(type) {
        document.body.classList.remove('correct-flash', 'wrong-flash');
        if (type === 'correct') {
            document.body.classList.add('correct-flash');
        } else if (type === 'wrong') {
            document.body.classList.add('wrong-flash');
        }

        setTimeout(() => {
            document.body.classList.remove('correct-flash', 'wrong-flash');
        }, 300);
    }

    function endGame() {
        alert(`Parabéns, ${currentPlayer}! Você completou o jogo!\nAcertos: ${hits}\nErros: ${misses}`);
        saveWinner(currentPlayer, hits, misses);
        displayWinners();
        gameStarted = false;
        gameBoard.style.pointerEvents = 'none';
    }

    function saveWinner(name, hits, misses) {
        let winners = JSON.parse(localStorage.getItem('memoryGameWinners')) || [];
        winners.push({ name: name, hits: hits, misses: misses, date: new Date().toLocaleString() });
        if (winners.length > 10) {
            winners = winners.slice(winners.length - 10);
        }
        localStorage.setItem('memoryGameWinners', JSON.stringify(winners));
    }

    function displayWinners() {
        winnersList.innerHTML = '';
        let winners = JSON.parse(localStorage.getItem('memoryGameWinners')) || [];

        winners.sort((a, b) => {
            if (a.hits !== b.hits) {
                return b.hits - a.hits;
            }
            return a.misses - b.misses;
        });

        if (winners.length === 0) {
            winnersList.innerHTML = '<li>Nenhum vencedor ainda.</li>';
            return;
        }

        winners.forEach(winner => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${winner.name}</span> - Acertos: ${winner.hits}, Erros: ${winner.misses} <small>(${winner.date})</small>`;
            winnersList.appendChild(listItem);
        });
    }

    // Event Listeners
    startGameBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();
        if (name) {
            currentPlayer = name;
            gameStarted = true;
            initializeGame();
            playerNameInput.disabled = true;
            startGameBtn.style.display = 'none';
            resetGameBtn.style.display = 'block';
        } else {
            alert('Por favor, digite seu nome para começar!');
            playerNameInput.focus();
        }
    });

    resetGameBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja reiniciar o jogo? Seu progresso atual será perdido.')) {
            currentPlayer = playerNameInput.value.trim() || 'Jogador';
            gameStarted = true;
            initializeGame();
        }
    });

    // Event listeners para a nova funcionalidade de adivinhação
    checkGuessBtn.addEventListener('click', checkGuess);
    stateGuessInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkGuess();
        }
    });

    initializeGame();
});
