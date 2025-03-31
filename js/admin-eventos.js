// Gerenciamento de eventos - Área administrativa

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!loggedIn) {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'login.html';
        return;
    }
    
    // Carregar eventos do localStorage ou usar eventos padrão
    let eventos = JSON.parse(localStorage.getItem('eventos')) || getEventosPadrao();
    
    // Configurações de paginação
    const itensPorPagina = 5;
    let paginaAtual = 1;
    let eventosFiltrados = [...eventos];
    
    // Elementos do DOM
    const tabelaEventos = document.getElementById('tabela-eventos');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const paginasContainer = document.getElementById('paginas');
    const buscaInput = document.getElementById('busca-evento');
    const btnBuscar = document.getElementById('btn-buscar');
    const filtroStatus = document.getElementById('filtro-status');
    const modalExcluir = document.getElementById('modal-excluir');
    const btnFecharModal = document.querySelector('.modal-close');
    const btnCancelarExclusao = document.querySelector('.btn-cancelar');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
    const nomeEventoExcluir = document.getElementById('nome-evento-excluir');
    
    let eventoParaExcluir = null;
    
    // Carregar eventos iniciais
    carregarEventos();
    
    // Event listeners
    btnAnterior.addEventListener('click', paginaAnterior);
    btnProximo.addEventListener('click', proximaPagina);
    btnBuscar.addEventListener('click', buscarEventos);
    filtroStatus.addEventListener('change', filtrarEventos);
    buscaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarEventos();
        }
    });
    
    // Fechar modal
    btnFecharModal.addEventListener('click', fecharModal);
    btnCancelarExclusao.addEventListener('click', fecharModal);
    
    // Confirmar exclusão
    btnConfirmarExclusao.addEventListener('click', confirmarExclusao);
    
    // Funções
    function carregarEventos() {
        // Limpar tabela
        tabelaEventos.innerHTML = '';
        
        // Calcular índices para paginação
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const eventosExibidos = eventosFiltrados.slice(inicio, fim);
        
        if (eventosExibidos.length === 0) {
            tabelaEventos.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 30px;">
                        <i class="fas fa-search" style="font-size: 2rem; color: #ddd; margin-bottom: 15px;"></i>
                        <p>Nenhum evento encontrado</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Adicionar eventos à tabela
        eventosExibidos.forEach(evento => {
            const row = document.createElement('tr');
            
            // Formatação da data
            const data = new Date(evento.data);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            
            // Status do evento
            let statusClass = '';
            switch (evento.status) {
                case 'ativo':
                    statusClass = 'status-ativo';
                    break;
                case 'encerrado':
                    statusClass = 'status-encerrado';
                    break;
                case 'cancelado':
                    statusClass = 'status-cancelado';
                    break;
            }
            
            row.innerHTML = `
                <td>
                    <div class="evento-titulo">
                        <img src="${evento.imagem || 'img/evento-thumb.jpg'}" alt="${evento.titulo}" onerror="this.onerror=null; this.src='img/evento-thumb.jpg';">
                        ${evento.titulo}
                    </div>
                </td>
                <td>${dataFormatada}</td>
                <td>${evento.cidade}, ${evento.estado}</td>
                <td><span class="evento-status ${statusClass}">${capitalizarPrimeiraLetra(evento.status)}</span></td>
                <td>${evento.inscricoes || 0}</td>
                <td>
                    <div class="acoes-evento">
                        <a href="evento.html?id=${evento.id}" class="btn-acao btn-visualizar" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="admin-novo-evento.html?id=${evento.id}" class="btn-acao btn-editar" title="Editar">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn-acao btn-excluir" title="Excluir" data-id="${evento.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tabelaEventos.appendChild(row);
        });
        
        // Adicionar event listeners para botões de exclusão
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const evento = eventos.find(e => e.id === id);
                
                if (evento) {
                    eventoParaExcluir = evento;
                    nomeEventoExcluir.textContent = evento.titulo;
                    abrirModal();
                }
            });
        });
        
        // Atualizar paginação
        atualizarPaginacao();
    }
    
    function atualizarPaginacao() {
        const totalPaginas = Math.ceil(eventosFiltrados.length / itensPorPagina);
        
        // Atualizar botões de navegação
        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = paginaAtual === totalPaginas || totalPaginas === 0;
        
        // Atualizar números de página
        paginasContainer.innerHTML = '';
        
        // Limitar o número de páginas exibidas
        let startPage = Math.max(1, paginaAtual - 2);
        let endPage = Math.min(totalPaginas, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pagina = document.createElement('span');
            pagina.classList.add('pagina');
            if (i === paginaAtual) {
                pagina.classList.add('ativa');
            }
            pagina.textContent = i;
            
            pagina.addEventListener('click', function() {
                paginaAtual = i;
                carregarEventos();
            });
            
            paginasContainer.appendChild(pagina);
        }
    }
    
    function paginaAnterior() {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarEventos();
        }
    }
    
    function proximaPagina() {
        const totalPaginas = Math.ceil(eventosFiltrados.length / itensPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            carregarEventos();
        }
    }
    
    function buscarEventos() {
        const termo = buscaInput.value.toLowerCase().trim();
        
        if (termo === '') {
            eventosFiltrados = filtrarPorStatus(eventos);
        } else {
            eventosFiltrados = eventos.filter(evento => {
                return (
                    evento.titulo.toLowerCase().includes(termo) ||
                    evento.cidade.toLowerCase().includes(termo) ||
                    evento.estado.toLowerCase().includes(termo)
                );
            });
            
            // Aplicar filtro de status após a busca
            eventosFiltrados = filtrarPorStatus(eventosFiltrados);
        }
        
        paginaAtual = 1;
        carregarEventos();
    }
    
    function filtrarEventos() {
        eventosFiltrados = filtrarPorStatus(eventos);
        paginaAtual = 1;
        carregarEventos();
    }
    
    function filtrarPorStatus(listaEventos) {
        const status = filtroStatus.value;
        
        if (status === 'todos') {
            return listaEventos;
        }
        
        return listaEventos.filter(evento => evento.status === status);
    }
    
    function abrirModal() {
        modalExcluir.classList.add('active');
    }
    
    function fecharModal() {
        modalExcluir.classList.remove('active');
        eventoParaExcluir = null;
    }
    
    function confirmarExclusao() {
        if (eventoParaExcluir) {
            // Remover evento da lista
            eventos = eventos.filter(evento => evento.id !== eventoParaExcluir.id);
            
            // Atualizar localStorage
            localStorage.setItem('eventos', JSON.stringify(eventos));
            
            // Atualizar lista filtrada
            eventosFiltrados = filtrarPorStatus(eventos);
            
            // Fechar modal
            fecharModal();
            
            // Recarregar eventos
            carregarEventos();
        }
    }
    
    function capitalizarPrimeiraLetra(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Função para obter eventos padrão
    function getEventosPadrao() {
        return [
            {
                id: 1,
                titulo: "Maratona São Paulo 2025",
                data: "2025-05-15T07:00:00",
                cidade: "São Paulo",
                estado: "SP",
                endereco: "Parque Ibirapuera, Portão 10",
                descricao: "A maior maratona do Brasil, percorrendo os principais pontos turísticos da cidade de São Paulo.",
                status: "ativo",
                imagem: "img/evento1.jpg",
                inscricoes: 1243,
                categorias: [
                    {
                        nome: "5km",
                        preco: 89.90,
                        descricao: "Percurso de 5km para iniciantes"
                    },
                    {
                        nome: "10km",
                        preco: 109.90,
                        descricao: "Percurso intermediário de 10km"
                    },
                    {
                        nome: "21km",
                        preco: 149.90,
                        descricao: "Meia maratona para corredores experientes"
                    },
                    {
                        nome: "42km",
                        preco: 199.90,
                        descricao: "Maratona completa para atletas de alto rendimento"
                    }
                ]
            },
            {
                id: 2,
                titulo: "Ciclismo Mountain Bike - Serra da Mantiqueira",
                data: "2025-06-20T08:00:00",
                cidade: "Campos do Jordão",
                estado: "SP",
                endereco: "Parque Estadual de Campos do Jordão",
                descricao: "Desafio de mountain bike nas trilhas da Serra da Mantiqueira com diferentes níveis de dificuldade.",
                status: "ativo",
                imagem: "img/evento2.jpg",
                inscricoes: 876,
                categorias: [
                    {
                        nome: "Iniciante",
                        preco: 120.00,
                        descricao: "Percurso de 15km com baixa dificuldade técnica"
                    },
                    {
                        nome: "Intermediário",
                        preco: 150.00,
                        descricao: "Percurso de 30km com média dificuldade técnica"
                    },
                    {
                        nome: "Avançado",
                        preco: 180.00,
                        descricao: "Percurso de 45km com alta dificuldade técnica"
                    }
                ]
            },
            {
                id: 3,
                titulo: "Corrida Noturna Rio de Janeiro",
                data: "2025-04-10T19:30:00",
                cidade: "Rio de Janeiro",
                estado: "RJ",
                endereco: "Praia de Copacabana",
                descricao: "Corrida noturna pela orla do Rio de Janeiro, com vista para os principais cartões-postais da cidade.",
                status: "encerrado",
                imagem: "img/evento3.jpg",
                inscricoes: 1502,
                categorias: [
                    {
                        nome: "5km",
                        preco: 79.90,
                        descricao: "Percurso de 5km pela orla de Copacabana"
                    },
                    {
                        nome: "10km",
                        preco: 99.90,
                        descricao: "Percurso de 10km por Copacabana e Ipanema"
                    }
                ]
            },
            {
                id: 4,
                titulo: "Triathlon Challenge Florianópolis",
                data: "2025-09-05T06:00:00",
                cidade: "Florianópolis",
                estado: "SC",
                endereco: "Praia de Jurerê Internacional",
                descricao: "Competição de triathlon em uma das praias mais bonitas do Brasil.",
                status: "ativo",
                imagem: "img/evento4.jpg",
                inscricoes: 654,
                categorias: [
                    {
                        nome: "Sprint",
                        preco: 250.00,
                        descricao: "750m natação, 20km ciclismo, 5km corrida"
                    },
                    {
                        nome: "Olímpico",
                        preco: 350.00,
                        descricao: "1.5km natação, 40km ciclismo, 10km corrida"
                    },
                    {
                        nome: "Half",
                        preco: 450.00,
                        descricao: "1.9km natação, 90km ciclismo, 21km corrida"
                    }
                ]
            },
            {
                id: 5,
                titulo: "Meia Maratona de Belo Horizonte",
                data: "2025-07-12T07:00:00",
                cidade: "Belo Horizonte",
                estado: "MG",
                endereco: "Praça da Liberdade",
                descricao: "Percurso desafiador pelas ruas e avenidas da capital mineira.",
                status: "ativo",
                imagem: "img/evento5.jpg",
                inscricoes: 1089,
                categorias: [
                    {
                        nome: "5km",
                        preco: 85.00,
                        descricao: "Percurso de 5km pelo centro histórico"
                    },
                    {
                        nome: "10km",
                        preco: 105.00,
                        descricao: "Percurso de 10km pelos principais pontos turísticos"
                    },
                    {
                        nome: "21km",
                        preco: 140.00,
                        descricao: "Meia maratona completa"
                    }
                ]
            },
            {
                id: 6,
                titulo: "Desafio Ciclístico Serra do Mar",
                data: "2025-08-18T07:30:00",
                cidade: "Santos",
                estado: "SP",
                endereco: "Praia do Gonzaga",
                descricao: "Percurso de ciclismo de estrada subindo a Serra do Mar com vistas deslumbrantes.",
                status: "cancelado",
                imagem: "img/evento6.jpg",
                inscricoes: 432,
                categorias: [
                    {
                        nome: "Light",
                        preco: 130.00,
                        descricao: "Percurso de 40km com 800m de altimetria"
                    },
                    {
                        nome: "Pro",
                        preco: 180.00,
                        descricao: "Percurso de 80km com 1600m de altimetria"
                    },
                    {
                        nome: "Elite",
                        preco: 220.00,
                        descricao: "Percurso de 120km com 2400m de altimetria"
                    }
                ]
            }
        ];
    }
});
