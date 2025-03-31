document.addEventListener('DOMContentLoaded', function() {
    // Obter o ID do evento da URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');
    
    // Variáveis para armazenar os dados
    let eventos = [];
    let inscricoes = [];
    let resultados = [];
    
    // Carregar dados diretamente (em vez de usar fetch)
    function carregarDados() {
        try {
            // Carregar dados dos eventos do localStorage ou usar dados padrão
            eventos = JSON.parse(localStorage.getItem('eventos')) || getEventosPadrao();
            
            // Carregar dados das inscrições do localStorage ou usar dados padrão
            inscricoes = JSON.parse(localStorage.getItem('inscricoes')) || getInscricoesPadrao();
            
            // Carregar dados dos resultados do localStorage ou usar dados padrão
            resultados = JSON.parse(localStorage.getItem('resultados')) || getResultadosPadrao();
            
            // Filtrar inscrições pelo ID do evento
            const inscricoesDoEvento = inscricoes.filter(inscricao => inscricao.eventoId == eventoId);
            
            // Exibir os detalhes do evento
            exibirDetalhesEvento(eventos, eventoId, inscricoesDoEvento);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            document.getElementById('evento-detalhes').innerHTML = `
                <div class="erro-evento">
                    <h2>Erro ao carregar dados do evento</h2>
                    <p>Ocorreu um erro ao carregar os dados do evento. Por favor, tente novamente mais tarde.</p>
                    <a href="index.html" class="btn-inscricao">Voltar para a página inicial</a>
                </div>
            `;
        }
    }
    
    // Função para obter dados padrão de eventos
    function getEventosPadrao() {
        return [
            {
                "id": 1,
                "titulo": "Maratona São Paulo 2025",
                "data": "15 de Abril, 2025",
                "horario": "07:00",
                "local": "Parque Ibirapuera",
                "cidade": "São Paulo, SP",
                "imagem": "img/maratonaSp.jpg",
                "arquivoGPX": "percursos/maratona-sp-2025.gpx",
                "descricao": "A Maratona São Paulo 2025 é um dos eventos mais esperados do calendário esportivo brasileiro. Com percurso que passa pelos principais pontos turísticos da cidade, a prova oferece distâncias de 42km, 21km e 10km, atendendo desde atletas profissionais até corredores amadores.",
                "detalhes": "A largada será no Parque Ibirapuera, com percurso passando pela Avenida Paulista, Centro Histórico e retornando ao parque. Haverá pontos de hidratação a cada 3km e atendimento médico ao longo de todo o percurso.",
                "categorias": ["Maratona (42km)", "Meia Maratona (21km)", "Corrida (10km)"],
                "preco": "R$ 150,00 a R$ 250,00",
                "organizador": "Associação Brasileira de Corridas",
                "contato": "contato@maratonasaopaulo.com.br"
            },
            {
                "id": 2,
                "titulo": "Ciclismo Tour Rio 2025",
                "data": "22 de Maio, 2025",
                "horario": "06:30",
                "local": "Praia de Copacabana",
                "cidade": "Rio de Janeiro, RJ",
                "imagem": "img/cicloTurismoRj.jpg",
                "arquivoGPX": "percursos/tour-rio-2025.gpx",
                "descricao": "O Tour Rio 2025 é a maior competição de ciclismo do estado do Rio de Janeiro. Com percursos deslumbrantes à beira-mar e subidas desafiadoras, o evento atrai ciclistas de todo o país e do exterior.",
                "detalhes": "O percurso inclui a orla de Copacabana, Ipanema, Leblon, além de subidas desafiadoras como a Vista Chinesa e o Corcovado. Haverá suporte técnico e pontos de hidratação ao longo do trajeto.",
                "categorias": ["Elite (120km)", "Amador Avançado (80km)", "Amador (40km)"],
                "preco": "R$ 180,00 a R$ 300,00",
                "organizador": "Federação de Ciclismo do Rio de Janeiro",
                "contato": "info@tourrio.com.br"
            },
            {
                "id": 3,
                "titulo": "Corrida Noturna BH",
                "data": "10 de Junho, 2025",
                "horario": "19:30",
                "local": "Praça da Liberdade",
                "cidade": "Belo Horizonte, MG",
                "imagem": "img/corridaNoturnaBh.jpg",
                "arquivoGPX": "percursos/corrida-noturna-bh.gpx",
                "descricao": "A Corrida Noturna BH é um evento único que transforma as ruas de Belo Horizonte em um espetáculo de luzes e energia. Com percurso iluminado e música ao vivo, a corrida oferece uma experiência inesquecível para os participantes.",
                "detalhes": "O percurso passa pelos principais pontos turísticos da cidade iluminados especialmente para o evento. Todos os participantes receberão kits com itens luminosos para garantir a segurança e o visual da prova.",
                "categorias": ["Corrida (10km)", "Corrida (5km)"],
                "preco": "R$ 120,00",
                "organizador": "BH Running Club",
                "contato": "corridanoturna@bhrunning.com.br"
            },
            {
                "id": 4,
                "titulo": "Desafio Mountain Bike",
                "data": "18 de Julho, 2025",
                "horario": "08:00",
                "local": "Parque Estadual do Rio Vermelho",
                "cidade": "Florianópolis, SC",
                "imagem": "img/desafioMtbFl.jpg",
                "arquivoGPX": "percursos/desafio-mtb-floripa.gpx",
                "descricao": "O Desafio Mountain Bike de Florianópolis é uma competição que explora as mais belas trilhas da Ilha da Magia. Com percursos técnicos e paisagens deslumbrantes, o evento é um dos mais aguardados pelos amantes do MTB.",
                "detalhes": "O percurso inclui trilhas técnicas, single tracks, descidas radicais e subidas desafiadoras. A organização oferece suporte mecânico, pontos de hidratação e primeiros socorros ao longo de todo o trajeto.",
                "categorias": ["Elite (60km)", "Sport (40km)", "Turismo (20km)"],
                "preco": "R$ 150,00 a R$ 220,00",
                "organizador": "SC Bike Association",
                "contato": "desafio@scbike.org.br"
            },
            {
                "id": 5,
                "titulo": "Meia Maratona Salvador",
                "data": "5 de Agosto, 2025",
                "horario": "06:00",
                "local": "Farol da Barra",
                "cidade": "Salvador, BA",
                "imagem": "img/meiaMaratonaSalvador.jpg",
                "arquivoGPX": "percursos/meia-maratona-salvador.gpx",
                "descricao": "A Meia Maratona de Salvador é uma celebração do esporte e da cultura baiana. Com percurso que passa pelos principais pontos históricos da primeira capital do Brasil, a prova oferece uma experiência única aos participantes.",
                "detalhes": "O percurso passa pelo Farol da Barra, Pelourinho, Elevador Lacerda e outros pontos históricos. Haverá apresentações culturais ao longo do trajeto e uma grande festa na chegada.",
                "categorias": ["Meia Maratona (21km)", "Corrida (10km)", "Caminhada (5km)"],
                "preco": "R$ 130,00 a R$ 180,00",
                "organizador": "Bahia Runners",
                "contato": "info@meiamaratonasalvador.com.br"
            }
        ];
    }
    
    // Função para obter dados padrão de inscrições
    function getInscricoesPadrao() {
        return [
            {
                "eventoId": 1,
                "inscritos": [
                    {
                        "id": 1,
                        "nome": "Carlos Silva",
                        "email": "carlos.silva@email.com",
                        "telefone": "(11) 98765-4321",
                        "categoria": "Maratona (42km)",
                        "dataInscricao": "2025-01-15T14:30:00",
                        "status": "confirmado"
                    },
                    {
                        "id": 2,
                        "nome": "Ana Oliveira",
                        "email": "ana.oliveira@email.com",
                        "telefone": "(11) 91234-5678",
                        "categoria": "Meia Maratona (21km)",
                        "dataInscricao": "2025-01-16T10:15:00",
                        "status": "confirmado"
                    },
                    {
                        "id": 3,
                        "nome": "Roberto Santos",
                        "email": "roberto.santos@email.com",
                        "telefone": "(11) 99876-5432",
                        "categoria": "Corrida (10km)",
                        "dataInscricao": "2025-01-18T16:45:00",
                        "status": "pendente"
                    }
                ]
            },
            {
                "eventoId": 2,
                "inscritos": [
                    {
                        "id": 4,
                        "nome": "Juliana Costa",
                        "email": "juliana.costa@email.com",
                        "telefone": "(21) 98765-4321",
                        "categoria": "Elite (120km)",
                        "dataInscricao": "2025-02-10T09:30:00",
                        "status": "confirmado"
                    },
                    {
                        "id": 5,
                        "nome": "Pedro Almeida",
                        "email": "pedro.almeida@email.com",
                        "telefone": "(21) 91234-5678",
                        "categoria": "Amador (40km)",
                        "dataInscricao": "2025-02-12T14:20:00",
                        "status": "confirmado"
                    }
                ]
            },
            {
                "eventoId": 3,
                "inscritos": [
                    {
                        "id": 6,
                        "nome": "Fernanda Lima",
                        "email": "fernanda.lima@email.com",
                        "telefone": "(31) 98765-4321",
                        "categoria": "Corrida (10km)",
                        "dataInscricao": "2025-03-05T11:45:00",
                        "status": "confirmado"
                    }
                ]
            },
            {
                "eventoId": 4,
                "inscritos": [
                    {
                        "id": 7,
                        "nome": "Marcelo Souza",
                        "email": "marcelo.souza@email.com",
                        "telefone": "(48) 98765-4321",
                        "categoria": "Sport (40km)",
                        "dataInscricao": "2025-04-02T16:30:00",
                        "status": "confirmado"
                    },
                    {
                        "id": 8,
                        "nome": "Camila Ferreira",
                        "email": "camila.ferreira@email.com",
                        "telefone": "(48) 91234-5678",
                        "categoria": "Turismo (20km)",
                        "dataInscricao": "2025-04-05T10:15:00",
                        "status": "pendente"
                    }
                ]
            },
            {
                "eventoId": 5,
                "inscritos": [
                    {
                        "id": 9,
                        "nome": "Rafael Oliveira",
                        "email": "rafael.oliveira@email.com",
                        "telefone": "(71) 98765-4321",
                        "categoria": "Meia Maratona (21km)",
                        "dataInscricao": "2025-05-10T09:45:00",
                        "status": "confirmado"
                    },
                    {
                        "id": 10,
                        "nome": "Mariana Santos",
                        "email": "mariana.santos@email.com",
                        "telefone": "(71) 91234-5678",
                        "categoria": "Corrida (10km)",
                        "dataInscricao": "2025-05-12T14:30:00",
                        "status": "confirmado"
                    }
                ]
            }
        ];
    }
    
    // Função para obter dados padrão de resultados
    function getResultadosPadrao() {
        return [
            {
                "eventoId": 1,
                "atletas": [
                    {
                        "numero": 101,
                        "nome": "Carlos Silva",
                        "categoria": "Maratona (42km)",
                        "horaSaida": "2025-04-15T07:00:00",
                        "horaChegada": "2025-04-15T10:32:45",
                        "tempoTotal": "03:32:45",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 102,
                        "nome": "Mariana Oliveira",
                        "categoria": "Maratona (42km)",
                        "horaSaida": "2025-04-15T07:00:00",
                        "horaChegada": "2025-04-15T10:45:12",
                        "tempoTotal": "03:45:12",
                        "colocacaoGeral": 2,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 103,
                        "nome": "João Pereira",
                        "categoria": "Meia Maratona (21km)",
                        "horaSaida": "2025-04-15T07:30:00",
                        "horaChegada": "2025-04-15T09:15:33",
                        "tempoTotal": "01:45:33",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 104,
                        "nome": "Ana Souza",
                        "categoria": "Corrida (10km)",
                        "horaSaida": "2025-04-15T08:00:00",
                        "horaChegada": "2025-04-15T08:47:21",
                        "tempoTotal": "00:47:21",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    }
                ]
            },
            {
                "eventoId": 2,
                "atletas": [
                    {
                        "numero": 201,
                        "nome": "Roberto Mendes",
                        "categoria": "Elite (120km)",
                        "horaSaida": "2025-05-22T06:30:00",
                        "horaChegada": "2025-05-22T10:15:42",
                        "tempoTotal": "03:45:42",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 202,
                        "nome": "Fernanda Lima",
                        "categoria": "Elite (120km)",
                        "horaSaida": "2025-05-22T06:30:00",
                        "horaChegada": "2025-05-22T10:22:18",
                        "tempoTotal": "03:52:18",
                        "colocacaoGeral": 2,
                        "colocacaoCategoria": 2
                    },
                    {
                        "numero": 203,
                        "nome": "Lucas Martins",
                        "categoria": "Amador Avançado (80km)",
                        "horaSaida": "2025-05-22T07:00:00",
                        "horaChegada": "2025-05-22T10:05:37",
                        "tempoTotal": "03:05:37",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    }
                ]
            },
            {
                "eventoId": 3,
                "atletas": [
                    {
                        "numero": 301,
                        "nome": "Patricia Santos",
                        "categoria": "Corrida (10km)",
                        "horaSaida": "2025-06-10T19:30:00",
                        "horaChegada": "2025-06-10T20:25:14",
                        "tempoTotal": "00:55:14",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 302,
                        "nome": "Marcelo Costa",
                        "categoria": "Corrida (5km)",
                        "horaSaida": "2025-06-10T19:30:00",
                        "horaChegada": "2025-06-10T19:55:42",
                        "tempoTotal": "00:25:42",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    }
                ]
            },
            {
                "eventoId": 4,
                "atletas": [
                    {
                        "numero": 401,
                        "nome": "Bruno Almeida",
                        "categoria": "Elite (60km)",
                        "horaSaida": "2025-07-18T08:00:00",
                        "horaChegada": "2025-07-18T10:45:23",
                        "tempoTotal": "02:45:23",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 402,
                        "nome": "Camila Ferreira",
                        "categoria": "Sport (40km)",
                        "horaSaida": "2025-07-18T08:30:00",
                        "horaChegada": "2025-07-18T10:15:07",
                        "tempoTotal": "01:45:07",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    }
                ]
            },
            {
                "eventoId": 5,
                "atletas": [
                    {
                        "numero": 501,
                        "nome": "Rafael Oliveira",
                        "categoria": "Meia Maratona (21km)",
                        "horaSaida": "2025-08-05T06:00:00",
                        "horaChegada": "2025-08-05T07:42:18",
                        "tempoTotal": "01:42:18",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    },
                    {
                        "numero": 502,
                        "nome": "Juliana Ribeiro",
                        "categoria": "Corrida (10km)",
                        "horaSaida": "2025-08-05T06:30:00",
                        "horaChegada": "2025-08-05T07:25:41",
                        "tempoTotal": "00:55:41",
                        "colocacaoGeral": 1,
                        "colocacaoCategoria": 1
                    }
                ]
            }
        ];
    }
    
    // Função para exibir os detalhes do evento
    function exibirDetalhesEvento(eventos, eventoId, inscricoesDoEvento) {
        // Encontrar o evento pelo ID
        const evento = eventos.find(e => e.id == eventoId);
        
        if (!evento) {
            document.getElementById('evento-detalhes').innerHTML = `
                <div class="erro-evento">
                    <h2>Evento não encontrado</h2>
                    <p>O evento que você está procurando não existe ou foi removido.</p>
                    <a href="index.html" class="btn-inscricao">Voltar para a página inicial</a>
                </div>
            `;
            return;
        }
        
        // Verificar se o usuário está logado
        function isLoggedIn() {
            return localStorage.getItem('loggedIn') === 'true';
        }
        
        // Atualizar o título da página
        document.title = `${evento.titulo} - Meta Esportes`;
        
        // Construir o HTML com os detalhes do evento
        const eventoHTML = `
            <div class="evento-header">
                <img src="${evento.imagem}" alt="${evento.titulo}" onerror="this.src='img/evento-placeholder.jpg'">
                <div class="evento-header-overlay">
                    <h1>${evento.titulo}</h1>
                    <div class="evento-info">
                        <div class="evento-info-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${evento.data}</span>
                        </div>
                        <div class="evento-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${evento.cidade}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="evento-content">
                <div class="evento-descricao">
                    <h2>Sobre o Evento</h2>
                    <p>${evento.descricao}</p>
                    <p>${evento.detalhes}</p>
                    
                    <h2>Categorias</h2>
                    <ul>
                        ${evento.categorias.map(cat => `<li>${cat}</li>`).join('')}
                    </ul>
                    
                    <div class="evento-percurso">
                        <h2>Percurso</h2>
                        ${evento.arquivoGPX ? 
                            `<div class="download-gpx">
                                <p>Baixe o arquivo GPX do percurso para usar em seu aplicativo de navegação favorito.</p>
                                <a href="${evento.arquivoGPX}" class="btn-download-gpx" download>
                                    <i class="fas fa-download"></i> Baixar Arquivo GPX
                                </a>
                             </div>` : 
                            `<p>Arquivo GPX do percurso não disponível.</p>`
                        }
                    </div>
                </div>
                
                <div class="evento-sidebar">
                    <h2>Informações</h2>
                    <div class="evento-sidebar-info">
                        <div class="evento-sidebar-item">
                            <i class="fas fa-calendar-day"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Data</h3>
                                <p>${evento.data}</p>
                            </div>
                        </div>
                        
                        <div class="evento-sidebar-item">
                            <i class="fas fa-clock"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Horário</h3>
                                <p>${evento.horario}</p>
                            </div>
                        </div>
                        
                        <div class="evento-sidebar-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Local</h3>
                                <p>${evento.local}, ${evento.cidade}</p>
                            </div>
                        </div>
                        
                        <div class="evento-sidebar-item">
                            <i class="fas fa-tag"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Preço</h3>
                                <p>${evento.preco}</p>
                            </div>
                        </div>
                        
                        <div class="evento-sidebar-item">
                            <i class="fas fa-trophy"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Resultados</h3>
                                <button class="btn-resultados" id="btn-resultados">
                                    <i class="fas fa-list-ol"></i> Ver Resultados
                                </button>
                            </div>
                        </div>
                        
                        ${isLoggedIn() ? `
                        <div class="evento-sidebar-item">
                            <i class="fas fa-stopwatch"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Cronometragem</h3>
                                <button class="btn-cronometragem" id="btn-cronometragem">
                                    <i class="fas fa-clock"></i> Lançar Cronometragem
                                </button>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="evento-sidebar-item">
                            <i class="fas fa-user-tie"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Organizador</h3>
                                <p>${evento.organizador}</p>
                            </div>
                        </div>
                        
                        <div class="evento-sidebar-item">
                            <i class="fas fa-envelope"></i>
                            <div class="evento-sidebar-item-content">
                                <h3>Contato</h3>
                                <p>${evento.contato}</p>
                            </div>
                        </div>
                    </div>
                    
                    <a href="inscricao.html?id=${evento.id}" class="btn-inscricao">Inscrever-se</a>
                    <button id="btn-ver-inscritos" class="btn-ver-inscritos">
                        <i class="fas fa-users"></i> Ver Inscritos
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('evento-detalhes').innerHTML = eventoHTML;
        
        // Adicionar listener para o botão de ver inscritos após um pequeno atraso para garantir que o DOM foi atualizado
        setTimeout(() => {
            const btnVerInscritos = document.getElementById('btn-ver-inscritos');
            if (btnVerInscritos) {
                btnVerInscritos.addEventListener('click', () => mostrarModalInscritos(evento, inscricoesDoEvento));
            }
        }, 100);
        
        // Adicionar event listeners para os botões após o DOM ser atualizado
        setTimeout(() => {
            // Botão de inscrição
            const btnInscricao = document.getElementById('btn-inscricao');
            if (btnInscricao) {
                btnInscricao.addEventListener('click', () => {
                    window.location.href = `inscricao.html?id=${evento.id}`;
                });
            }
            
            // Botão de ver inscritos
            const btnVerInscritos = document.getElementById('btn-ver-inscritos');
            if (btnVerInscritos) {
                btnVerInscritos.addEventListener('click', () => {
                    mostrarModalInscritos(evento, inscricoesDoEvento);
                });
            }
            
            // Botão de ver resultados
            const btnResultados = document.getElementById('btn-resultados');
            if (btnResultados) {
                btnResultados.addEventListener('click', () => {
                    mostrarModalResultados(evento);
                });
            }
            
            // Botão de lançar cronometragem (apenas para usuários logados)
            const btnCronometragem = document.getElementById('btn-cronometragem');
            if (btnCronometragem) {
                btnCronometragem.addEventListener('click', () => {
                    mostrarModalCronometragem(evento);
                });
            }
        }, 100);
        
        // Adicionar modais ao DOM
        const modaisHTML = `
            <!-- Modal de Inscritos -->
            <div id="modal-inscritos" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Inscritos no Evento</h3>
                        <span class="fechar-modal">&times;</span>
                    </div>
                    <div class="modal-body" id="modal-inscritos-corpo">
                        <!-- Conteúdo será preenchido via JavaScript -->
                    </div>
                </div>
            </div>
            
            <!-- Modal de Resultados -->
            <div id="modal-resultados" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Resultados do Evento</h3>
                        <span class="fechar-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="resultados-filtro">
                            <input type="text" id="filtro-resultados" placeholder="Buscar por nome ou número do atleta">
                            <button id="btn-filtrar-resultados">Buscar</button>
                        </div>
                        <div id="resultados-lista">
                            <!-- Resultados serão preenchidos via JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de Cronometragem (apenas para usuários logados) -->
            <div id="modal-cronometragem" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Lançar Cronometragem</h3>
                        <span class="fechar-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="form-cronometragem">
                            <div class="form-group">
                                <label for="numero-atleta">Número do Atleta</label>
                                <input type="number" id="numero-atleta" required>
                            </div>
                            <div class="form-group">
                                <label for="nome-atleta">Nome do Atleta</label>
                                <input type="text" id="nome-atleta" required>
                            </div>
                            <div class="form-group">
                                <label for="categoria-atleta">Categoria</label>
                                <select id="categoria-atleta" required>
                                    ${evento.categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="hora-saida">Hora de Saída</label>
                                <input type="datetime-local" id="hora-saida" required>
                            </div>
                            <div class="form-group">
                                <label for="hora-chegada">Hora de Chegada</label>
                                <input type="datetime-local" id="hora-chegada" required>
                            </div>
                            <button type="submit" class="btn-salvar-cronometragem">Salvar Cronometragem</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modais ao DOM
        document.body.insertAdjacentHTML('beforeend', modaisHTML);
        
        // Adicionar event listeners para fechar modais
        document.querySelectorAll('.fechar-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // Função para mostrar o modal com os inscritos
        function mostrarModalInscritos(evento, inscricoes) {
            // Agrupar inscrições por categoria
            const inscricoesPorCategoria = agruparInscricoesPorCategoria(inscricoes);
            
            // Remover qualquer modal existente para evitar duplicação
            const modalExistente = document.getElementById('modal-inscritos');
            if (modalExistente) {
                modalExistente.remove();
            }
            
            // Verificar se há categorias
            if (Object.keys(inscricoesPorCategoria).length === 0) {
                // Criar modal simples informando que não há inscritos
                const modal = document.createElement('div');
                modal.id = 'modal-inscritos';
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Inscritos - ${evento.titulo}</h2>
                            <button class="fechar-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p class="sem-inscritos">Não há inscritos para este evento ainda.</p>
                        </div>
                    </div>
                `;
                
                // Adicionar o modal ao DOM
                document.body.appendChild(modal);
                
                // Mostrar o modal
                modal.style.display = 'flex';
                
                // Adicionar event listener para fechar o modal
                modal.querySelector('.fechar-modal').addEventListener('click', () => {
                    modal.style.display = 'none';
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                });
                
                // Fechar o modal ao clicar fora dele
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    }
                });
                
                return;
            }
            
            // Criar o modal
            const modal = document.createElement('div');
            modal.id = 'modal-inscritos';
            modal.className = 'modal';
            
            // Criar o conteúdo do modal
            let tabsHTML = '';
            let tabsContentHTML = '';
            
            // Criar as abas e conteúdo para cada categoria
            Object.keys(inscricoesPorCategoria).forEach((categoria, index) => {
                const categoriaId = categoria.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase();
                const isActive = index === 0 ? 'active' : '';
                
                tabsHTML += `<button class="tab-btn ${isActive}" data-tab="${categoriaId}">${categoria} (${inscricoesPorCategoria[categoria].length})</button>`;
                
                tabsContentHTML += `
                    <div id="tab-${categoriaId}" class="tab-content ${isActive}">
                        <table class="inscritos-tabela">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Data de Inscrição</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${inscricoesPorCategoria[categoria].map(inscricao => `
                                    <tr class="status-${inscricao.status}">
                                        <td>${inscricao.nome}</td>
                                        <td>${new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}</td>
                                        <td>${capitalizarPrimeiraLetra(inscricao.status)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            });
            
            // Montar o HTML do modal
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Inscritos - ${evento.titulo}</h2>
                        <button class="fechar-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="tabs">
                            ${tabsHTML}
                        </div>
                        <div class="tabs-content">
                            ${tabsContentHTML}
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar o modal ao DOM
            document.body.appendChild(modal);
            
            // Mostrar o modal
            modal.style.display = 'flex';
            
            // Adicionar event listeners para as abas
            const tabBtns = modal.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remover classe active de todas as abas e conteúdos
                    tabBtns.forEach(b => b.classList.remove('active'));
                    modal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                    
                    // Adicionar classe active à aba clicada e seu conteúdo
                    btn.classList.add('active');
                    const tabId = btn.getAttribute('data-tab');
                    const tabContent = document.getElementById(`tab-${tabId}`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                });
            });
            
            // Adicionar event listener para fechar o modal
            const fecharBtn = modal.querySelector('.fechar-modal');
            if (fecharBtn) {
                fecharBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                });
            }
            
            // Fechar o modal ao clicar fora dele
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
            });
        }
        
        // Função para agrupar inscrições por categoria
        function agruparInscricoesPorCategoria(inscricoes) {
            const grupos = {};
            
            inscricoes.forEach(inscricao => {
                if (!grupos[inscricao.categoria]) {
                    grupos[inscricao.categoria] = [];
                }
                
                grupos[inscricao.categoria].push(inscricao);
            });
            
            return grupos;
        }
        
        // Função para capitalizar a primeira letra
        function capitalizarPrimeiraLetra(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        // Função para mostrar o modal de resultados
        function mostrarModalResultados(evento) {
            // Obter o modal
            const modal = document.getElementById('modal-resultados');
            
            // Mostrar o modal
            modal.style.display = 'flex';
            
            // Filtrar resultados pelo ID do evento
            const resultadosDoEvento = resultados.find(resultado => resultado.eventoId == evento.id);
            
            if (!resultadosDoEvento || !resultadosDoEvento.atletas || resultadosDoEvento.atletas.length === 0) {
                modal.querySelector('.modal-body').innerHTML = `
                    <div class="sem-resultados">
                        <p>Ainda não há resultados disponíveis para este evento.</p>
                    </div>
                `;
                return;
            }
            
            // Criar o conteúdo do modal
            const resultadosHTML = `
                <div class="resultados-filtro">
                    <input type="text" id="filtro-resultados" placeholder="Buscar por nome ou número do atleta">
                    <button id="btn-filtrar-resultados">Buscar</button>
                </div>
                <div id="resultados-lista">
                    <table class="resultados-tabela">
                        <thead>
                            <tr>
                                <th>Colocação</th>
                                <th>Número</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Tempo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resultadosDoEvento.atletas.map(atleta => `
                                <tr>
                                    <td>${atleta.colocacaoGeral}º</td>
                                    <td>${atleta.numero}</td>
                                    <td>${atleta.nome}</td>
                                    <td>${atleta.categoria}</td>
                                    <td>${atleta.tempoTotal}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            // Adicionar o conteúdo ao modal
            modal.querySelector('.modal-body').innerHTML = resultadosHTML;
            
            // Adicionar event listener para filtrar resultados
            const filtroInput = modal.querySelector('#filtro-resultados');
            const btnFiltrar = modal.querySelector('#btn-filtrar-resultados');
            
            btnFiltrar.addEventListener('click', () => {
                filtrarResultados(filtroInput.value, resultadosDoEvento.atletas, modal);
            });
            
            filtroInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    filtrarResultados(filtroInput.value, resultadosDoEvento.atletas, modal);
                }
            });
        }
        
        // Função para filtrar resultados
        function filtrarResultados(termo, atletas, modal) {
            if (!termo) {
                mostrarModalResultados(evento);
                return;
            }
            
            const termoLower = termo.toLowerCase();
            const atletasFiltrados = atletas.filter(atleta => 
                atleta.nome.toLowerCase().includes(termoLower) || 
                atleta.numero.toString() === termo
            );
            
            if (atletasFiltrados.length === 0) {
                modal.querySelector('#resultados-lista').innerHTML = `
                    <div class="sem-resultados">
                        <p>Nenhum atleta encontrado com o termo "${termo}".</p>
                    </div>
                `;
                return;
            }
            
            const resultadosHTML = `
                <table class="resultados-tabela">
                    <thead>
                        <tr>
                            <th>Colocação</th>
                            <th>Número</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Tempo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${atletasFiltrados.map(atleta => `
                            <tr>
                                <td>${atleta.colocacaoGeral}º</td>
                                <td>${atleta.numero}</td>
                                <td>${atleta.nome}</td>
                                <td>${atleta.categoria}</td>
                                <td>${atleta.tempoTotal}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            
            modal.querySelector('#resultados-lista').innerHTML = resultadosHTML;
        }
        
        // Função para mostrar o modal de cronometragem
        function mostrarModalCronometragem(evento) {
            // Obter o modal
            const modal = document.getElementById('modal-cronometragem');
            
            // Mostrar o modal
            modal.style.display = 'flex';
            
            // Preencher o campo de data/hora com a data atual
            const agora = new Date();
            const dataHoraFormatada = agora.toISOString().slice(0, 16);
            modal.querySelector('#hora-saida').value = dataHoraFormatada;
            modal.querySelector('#hora-chegada').value = dataHoraFormatada;
            
            // Adicionar event listener para salvar a cronometragem
            const formCronometragem = modal.querySelector('#form-cronometragem');
            if (formCronometragem) {
                formCronometragem.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // Obter os dados da cronometragem
                    const numeroAtleta = parseInt(modal.querySelector('#numero-atleta').value);
                    const nomeAtleta = modal.querySelector('#nome-atleta').value;
                    const categoriaAtleta = modal.querySelector('#categoria-atleta').value;
                    const horaSaida = modal.querySelector('#hora-saida').value;
                    const horaChegada = modal.querySelector('#hora-chegada').value;
                    
                    // Calcular o tempo total
                    const tempoTotal = calcularTempoTotal(horaSaida, horaChegada);
                    
                    // Verificar se já existem resultados para este evento
                    let resultadoEvento = resultados.find(r => r.eventoId == evento.id);
                    
                    if (!resultadoEvento) {
                        // Criar um novo objeto de resultados para o evento
                        resultadoEvento = {
                            eventoId: evento.id,
                            atletas: []
                        };
                        resultados.push(resultadoEvento);
                    }
                    
                    // Verificar se o atleta já existe nos resultados
                    const atletaExistente = resultadoEvento.atletas.findIndex(a => a.numero === numeroAtleta);
                    
                    if (atletaExistente !== -1) {
                        // Atualizar o atleta existente
                        resultadoEvento.atletas[atletaExistente] = {
                            numero: numeroAtleta,
                            nome: nomeAtleta,
                            categoria: categoriaAtleta,
                            horaSaida: horaSaida,
                            horaChegada: horaChegada,
                            tempoTotal: tempoTotal,
                            colocacaoGeral: resultadoEvento.atletas[atletaExistente].colocacaoGeral,
                            colocacaoCategoria: resultadoEvento.atletas[atletaExistente].colocacaoCategoria
                        };
                    } else {
                        // Adicionar um novo atleta
                        resultadoEvento.atletas.push({
                            numero: numeroAtleta,
                            nome: nomeAtleta,
                            categoria: categoriaAtleta,
                            horaSaida: horaSaida,
                            horaChegada: horaChegada,
                            tempoTotal: tempoTotal,
                            colocacaoGeral: resultadoEvento.atletas.length + 1,
                            colocacaoCategoria: resultadoEvento.atletas.filter(a => a.categoria === categoriaAtleta).length + 1
                        });
                    }
                    
                    // Ordenar os atletas por tempo total
                    resultadoEvento.atletas.sort((a, b) => {
                        const tempoA = converterTempoParaSegundos(a.tempoTotal);
                        const tempoB = converterTempoParaSegundos(b.tempoTotal);
                        return tempoA - tempoB;
                    });
                    
                    // Atualizar as colocações
                    resultadoEvento.atletas.forEach((atleta, index) => {
                        atleta.colocacaoGeral = index + 1;
                    });
                    
                    // Atualizar as colocações por categoria
                    const categorias = [...new Set(resultadoEvento.atletas.map(a => a.categoria))];
                    categorias.forEach(categoria => {
                        const atletasCategoria = resultadoEvento.atletas.filter(a => a.categoria === categoria);
                        atletasCategoria.forEach((atleta, index) => {
                            const atletaIndex = resultadoEvento.atletas.findIndex(a => a.numero === atleta.numero);
                            resultadoEvento.atletas[atletaIndex].colocacaoCategoria = index + 1;
                        });
                    });
                    
                    // Salvar os resultados no localStorage (em um sistema real, seria enviado para o servidor)
                    localStorage.setItem('resultados', JSON.stringify(resultados));
                    
                    // Mostrar mensagem de sucesso
                    alert('Cronometragem salva com sucesso!');
                    
                    // Limpar o formulário
                    formCronometragem.reset();
                    
                    // Fechar o modal
                    modal.style.display = 'none';
                });
            }
        }
        
        // Função para calcular o tempo total entre duas datas
        function calcularTempoTotal(horaSaida, horaChegada) {
            const dataSaida = new Date(horaSaida);
            const dataChegada = new Date(horaChegada);
            const diferencaMs = dataChegada - dataSaida;
            
            // Converter para horas, minutos e segundos
            const horas = Math.floor(diferencaMs / (1000 * 60 * 60));
            const minutos = Math.floor((diferencaMs % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencaMs % (1000 * 60)) / 1000);
            
            // Formatar como HH:MM:SS
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }
        
        // Função para converter tempo no formato HH:MM:SS para segundos
        function converterTempoParaSegundos(tempo) {
            const [horas, minutos, segundos] = tempo.split(':').map(Number);
            return horas * 3600 + minutos * 60 + segundos;
        }
    }
    
    // Iniciar o carregamento dos dados
    carregarDados();
});
