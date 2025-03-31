document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo para os eventos
    const eventos = [
        {
            id: 1,
            titulo: "Maratona São Paulo 2025",
            data: "15 de Abril, 2025",
            local: "São Paulo, SP",
            imagem: "img/maratonaSp.jpg",
            url: "evento.html?id=1"
        },
        {
            id: 2,
            titulo: "Ciclismo Tour Rio 2025",
            data: "22 de Maio, 2025",
            local: "Rio de Janeiro, RJ",
            imagem: "img/cicloTurismoRj.jpg",
            url: "evento.html?id=2"
        },
        {
            id: 3,
            titulo: "Corrida Noturna BH",
            data: "10 de Junho, 2025",
            local: "Belo Horizonte, MG",
            imagem: "img/corridaNoturnaBh.jpg",
            url: "evento.html?id=3"
        },
        {
            id: 4,
            titulo: "Desafio Mountain Bike",
            data: "18 de Julho, 2025",
            local: "Florianópolis, SC",
            imagem: "img/desafioMtbFl.jpg",
            url: "evento.html?id=4"
        },
        {
            id: 5,
            titulo: "Meia Maratona Salvador",
            data: "5 de Agosto, 2025",
            local: "Salvador, BA",
            imagem: "img/meiaMaratonaSalvador.jpg",
            url: "evento.html?id=5"
        },
        {
            id: 6,
            titulo: "Triathlon Fortaleza",
            data: "20 de Setembro, 2025",
            local: "Fortaleza, CE",
            imagem: "img/triatloFortaleza.jpg",
            url: "evento.html?id=6"
        }
    ];

    // Função para carregar os eventos no carrossel
    function carregarEventos() {
        const carouselTrack = document.getElementById('carousel-track');
        
        eventos.forEach(evento => {
            const eventoElement = document.createElement('div');
            eventoElement.className = 'carousel-item';
            eventoElement.innerHTML = `
                <img src="${evento.imagem}" alt="${evento.titulo}" onerror="this.src='img/evento-placeholder.jpg'">
                <div class="carousel-item-content">
                    <h3>${evento.titulo}</h3>
                    <p>${evento.local}</p>
                    <p class="event-date">${evento.data}</p>
                </div>
            `;
            
            // Adicionar evento de clique para redirecionar para a página de detalhes
            eventoElement.addEventListener('click', function() {
                window.location.href = evento.url;
            });
            
            carouselTrack.appendChild(eventoElement);
        });
    }

    // Carregar os eventos
    carregarEventos();

    // Configuração do carrossel
    const track = document.getElementById('carousel-track');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const items = track.querySelectorAll('.carousel-item');
    
    let currentIndex = 0;
    const itemWidth = items[0].offsetWidth + 30; // Largura do item + margem
    const itemsToShow = Math.floor(track.parentElement.offsetWidth / itemWidth);
    const maxIndex = items.length - itemsToShow;

    // Função para mover o carrossel
    function moveCarousel(index) {
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        
        currentIndex = index;
        const position = -currentIndex * itemWidth;
        track.style.transform = `translateX(${position}px)`;
        
        // Atualizar estado dos botões
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === maxIndex;
    }

    // Adicionar eventos aos botões
    prevButton.addEventListener('click', () => {
        moveCarousel(currentIndex - 1);
    });
    
    nextButton.addEventListener('click', () => {
        moveCarousel(currentIndex + 1);
    });

    // Inicializar carrossel
    moveCarousel(0);

    // Ajustar carrossel quando a janela for redimensionada
    window.addEventListener('resize', () => {
        const newItemsToShow = Math.floor(track.parentElement.offsetWidth / itemWidth);
        const newMaxIndex = items.length - newItemsToShow;
        
        if (currentIndex > newMaxIndex) {
            moveCarousel(newMaxIndex);
        } else {
            moveCarousel(currentIndex);
        }
    });
});
