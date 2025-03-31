// Script para a página de minhas inscrições

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    
    if (!loggedIn) {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'login.html';
        return;
    }
    
    // Verificar se o usuário é atleta, gestores não devem acessar esta página
    if (userType !== 'atleta') {
        // Redirecionar para a página inicial
        window.location.href = 'index.html';
        return;
    }
    
    // Obter username do usuário logado
    const username = localStorage.getItem('username');
    const userName = localStorage.getItem('userName');
    
    // Atualizar título com nome do usuário
    const inscricoesTitulo = document.querySelector('.inscricoes-titulo h2');
    if (inscricoesTitulo) {
        inscricoesTitulo.textContent = `Inscrições de ${userName || username}`;
    }
    
    // Carregar inscrições do localStorage ou usar dados padrão
    let inscricoes = JSON.parse(localStorage.getItem('minhasInscricoes')) || getInscricoesPadrao();
    
    // Carregar eventos para obter detalhes
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    
    // Configurações de paginação
    const itensPorPagina = 5;
    let paginaAtual = 1;
    let inscricoesFiltradas = [...inscricoes];
    
    // Elementos do DOM
    const inscricoesLista = document.getElementById('inscricoes-lista');
    const inscricoesVazio = document.getElementById('inscricoes-vazio');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const paginasContainer = document.getElementById('paginas');
    const buscaInput = document.getElementById('busca-inscricao');
    const btnBuscar = document.getElementById('btn-buscar');
    const filtroStatus = document.getElementById('filtro-status');
    const modalDetalhes = document.getElementById('modal-detalhes');
    const modalCancelar = document.getElementById('modal-cancelar');
    const modalDetalhesConteudo = document.getElementById('modal-detalhes-conteudo');
    const nomeEventoCancelar = document.getElementById('nome-evento-cancelar');
    const btnFecharModais = document.querySelectorAll('.modal-close, .btn-fechar, .btn-cancelar');
    const btnConfirmarCancelamento = document.getElementById('btn-confirmar-cancelamento');
    const motivoCancelamento = document.getElementById('motivo-cancelamento');
    const outroMotivoContainer = document.getElementById('outro-motivo-container');
    
    let inscricaoParaCancelar = null;
    
    // Carregar inscrições iniciais
    carregarInscricoes();
    
    // Event listeners
    btnAnterior.addEventListener('click', paginaAnterior);
    btnProximo.addEventListener('click', proximaPagina);
    btnBuscar.addEventListener('click', buscarInscricoes);
    filtroStatus.addEventListener('change', filtrarInscricoes);
    buscaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarInscricoes();
        }
    });
    
    // Fechar modais
    btnFecharModais.forEach(btn => {
        btn.addEventListener('click', function() {
            modalDetalhes.classList.remove('active');
            modalCancelar.classList.remove('active');
            inscricaoParaCancelar = null;
        });
    });
    
    // Motivo de cancelamento
    motivoCancelamento.addEventListener('change', function() {
        if (this.value === 'outro') {
            outroMotivoContainer.style.display = 'block';
        } else {
            outroMotivoContainer.style.display = 'none';
        }
    });
    
    // Confirmar cancelamento
    btnConfirmarCancelamento.addEventListener('click', confirmarCancelamento);
    
    // Funções
    function carregarInscricoes() {
        // Limpar lista
        inscricoesLista.innerHTML = '';
        
        // Calcular índices para paginação
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const inscricoesExibidas = inscricoesFiltradas.slice(inicio, fim);
        
        if (inscricoesExibidas.length === 0) {
            inscricoesLista.style.display = 'none';
            inscricoesVazio.style.display = 'block';
            document.getElementById('inscricoes-paginacao').style.display = 'none';
            return;
        }
        
        inscricoesLista.style.display = 'block';
        inscricoesVazio.style.display = 'none';
        document.getElementById('inscricoes-paginacao').style.display = 'flex';
        
        // Adicionar inscrições à lista
        inscricoesExibidas.forEach(inscricao => {
            // Buscar evento relacionado
            const evento = eventos.find(e => e.id === inscricao.eventoId) || {
                titulo: 'Evento não encontrado',
                data: new Date().toISOString(),
                cidade: 'N/A',
                estado: 'N/A',
                imagem: 'img/evento-placeholder.jpg'
            };
            
            // Formatação da data
            const data = new Date(evento.data);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            
            // Status da inscrição
            let statusClass = '';
            switch (inscricao.status) {
                case 'confirmado':
                    statusClass = 'status-confirmado';
                    break;
                case 'pendente':
                    statusClass = 'status-pendente';
                    break;
                case 'concluido':
                    statusClass = 'status-concluido';
                    break;
                case 'cancelado':
                    statusClass = 'status-cancelado';
                    break;
            }
            
            const card = document.createElement('div');
            card.className = 'inscricao-card';
            
            card.innerHTML = `
                <div class="inscricao-header">
                    <div class="inscricao-imagem">
                        <img src="${evento.imagem || 'img/evento-placeholder.jpg'}" alt="${evento.titulo}">
                    </div>
                    <div class="inscricao-titulo">
                        <h4>${evento.titulo}</h4>
                        <p>${dataFormatada} - ${evento.cidade}, ${evento.estado}</p>
                    </div>
                    <span class="inscricao-status ${statusClass}">${capitalizarPrimeiraLetra(inscricao.status)}</span>
                </div>
                <div class="inscricao-body">
                    <div class="inscricao-info">
                        <div class="info-item">
                            <span class="info-label">Categoria</span>
                            <span class="info-valor">${inscricao.categoria}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Número</span>
                            <span class="info-valor">${inscricao.numero || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Valor</span>
                            <span class="info-valor">R$ ${inscricao.valor.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="inscricao-acoes">
                        <button class="btn-acao btn-detalhes" data-id="${inscricao.id}">
                            <i class="fas fa-info-circle"></i> Detalhes
                        </button>
                        ${inscricao.status !== 'cancelado' && inscricao.status !== 'concluido' ? `
                            <button class="btn-acao btn-cancelar-inscricao" data-id="${inscricao.id}">
                                <i class="fas fa-times-circle"></i> Cancelar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
            
            inscricoesLista.appendChild(card);
        });
        
        // Adicionar event listeners para botões de detalhes e cancelamento
        const botoesDetalhes = document.querySelectorAll('.btn-detalhes');
        botoesDetalhes.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                mostrarDetalhesInscricao(id);
            });
        });
        
        const botoesCancelar = document.querySelectorAll('.btn-cancelar-inscricao');
        botoesCancelar.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                mostrarModalCancelamento(id);
            });
        });
        
        // Atualizar paginação
        atualizarPaginacao();
    }
    
    function atualizarPaginacao() {
        const totalPaginas = Math.ceil(inscricoesFiltradas.length / itensPorPagina);
        
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
                carregarInscricoes();
            });
            
            paginasContainer.appendChild(pagina);
        }
    }
    
    function paginaAnterior() {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarInscricoes();
        }
    }
    
    function proximaPagina() {
        const totalPaginas = Math.ceil(inscricoesFiltradas.length / itensPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            carregarInscricoes();
        }
    }
    
    function buscarInscricoes() {
        const termo = buscaInput.value.toLowerCase().trim();
        
        if (termo === '') {
            inscricoesFiltradas = filtrarPorStatus(inscricoes);
        } else {
            inscricoesFiltradas = inscricoes.filter(inscricao => {
                // Buscar evento relacionado
                const evento = eventos.find(e => e.id === inscricao.eventoId) || {
                    titulo: '',
                    cidade: '',
                    estado: ''
                };
                
                return (
                    evento.titulo.toLowerCase().includes(termo) ||
                    evento.cidade.toLowerCase().includes(termo) ||
                    evento.estado.toLowerCase().includes(termo) ||
                    inscricao.categoria.toLowerCase().includes(termo)
                );
            });
            
            // Aplicar filtro de status após a busca
            inscricoesFiltradas = filtrarPorStatus(inscricoesFiltradas);
        }
        
        paginaAtual = 1;
        carregarInscricoes();
    }
    
    function filtrarInscricoes() {
        inscricoesFiltradas = filtrarPorStatus(inscricoes);
        paginaAtual = 1;
        carregarInscricoes();
    }
    
    function filtrarPorStatus(listaInscricoes) {
        const status = filtroStatus.value;
        
        if (status === 'todos') {
            return listaInscricoes;
        }
        
        return listaInscricoes.filter(inscricao => inscricao.status === status);
    }
    
    function mostrarDetalhesInscricao(id) {
        const inscricao = inscricoes.find(i => i.id === id);
        
        if (!inscricao) return;
        
        // Buscar evento relacionado
        const evento = eventos.find(e => e.id === inscricao.eventoId) || {
            titulo: 'Evento não encontrado',
            data: new Date().toISOString(),
            cidade: 'N/A',
            estado: 'N/A',
            endereco: 'N/A',
            imagem: 'img/evento-placeholder.jpg'
        };
        
        // Formatação da data
        const data = new Date(evento.data);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        const horaFormatada = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Status da inscrição
        let statusClass = '';
        let statusIcon = '';
        let statusTexto = '';
        
        switch (inscricao.status) {
            case 'confirmado':
                statusClass = 'confirmado';
                statusIcon = 'fa-check-circle';
                statusTexto = 'Inscrição Confirmada';
                break;
            case 'pendente':
                statusClass = 'pendente';
                statusIcon = 'fa-clock';
                statusTexto = 'Pagamento Pendente';
                break;
            case 'concluido':
                statusClass = 'concluido';
                statusIcon = 'fa-trophy';
                statusTexto = 'Evento Concluído';
                break;
            case 'cancelado':
                statusClass = 'cancelado';
                statusIcon = 'fa-times-circle';
                statusTexto = 'Inscrição Cancelada';
                break;
        }
        
        // Preencher conteúdo do modal
        modalDetalhesConteudo.innerHTML = `
            <div class="detalhes-inscricao">
                <div class="detalhes-evento">
                    <div class="detalhes-evento-imagem">
                        <img src="${evento.imagem || 'img/evento-placeholder.jpg'}" alt="${evento.titulo}">
                    </div>
                    <div class="detalhes-evento-info">
                        <h4>${evento.titulo}</h4>
                        <p>${dataFormatada} às ${horaFormatada} - ${evento.cidade}, ${evento.estado}</p>
                    </div>
                </div>
                
                <div class="detalhes-status ${statusClass}">
                    <i class="fas ${statusIcon}"></i>
                    <div class="detalhes-status-info">
                        <h5>${statusTexto}</h5>
                        <p>${getStatusDescricao(inscricao.status)}</p>
                    </div>
                </div>
                
                <div class="detalhes-info-grid">
                    <div class="detalhes-info-item">
                        <h5>Número de Inscrição</h5>
                        <p>${inscricao.id}</p>
                    </div>
                    <div class="detalhes-info-item">
                        <h5>Data de Inscrição</h5>
                        <p>${new Date(inscricao.dataInscricao).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div class="detalhes-info-item">
                        <h5>Categoria</h5>
                        <p>${inscricao.categoria}</p>
                    </div>
                    <div class="detalhes-info-item">
                        <h5>Número do Atleta</h5>
                        <p>${inscricao.numero || 'A ser definido'}</p>
                    </div>
                </div>
                
                <div class="detalhes-pagamento">
                    <h4>Detalhes do Pagamento</h4>
                    <div class="detalhes-pagamento-info">
                        <span>Valor da Inscrição</span>
                        <span>R$ ${inscricao.valor.toFixed(2)}</span>
                    </div>
                    <div class="detalhes-pagamento-info">
                        <span>Taxa de Serviço</span>
                        <span>R$ ${(inscricao.valor * 0.1).toFixed(2)}</span>
                    </div>
                    <div class="detalhes-pagamento-info">
                        <span>Valor Total</span>
                        <span>R$ ${(inscricao.valor * 1.1).toFixed(2)}</span>
                    </div>
                    <div class="detalhes-pagamento-info">
                        <span>Forma de Pagamento</span>
                        <span>${inscricao.formaPagamento}</span>
                    </div>
                    <div class="detalhes-pagamento-info">
                        <span>Status do Pagamento</span>
                        <span>${getStatusPagamento(inscricao.status)}</span>
                    </div>
                </div>
                
                <div class="detalhes-kit">
                    <h4>Kit do Atleta</h4>
                    <div class="detalhes-kit-item">
                        <i class="fas fa-check"></i>
                        <span>Camiseta Oficial do Evento</span>
                    </div>
                    <div class="detalhes-kit-item">
                        <i class="fas fa-check"></i>
                        <span>Número de Peito</span>
                    </div>
                    <div class="detalhes-kit-item">
                        <i class="fas fa-check"></i>
                        <span>Chip de Cronometragem</span>
                    </div>
                    <div class="detalhes-kit-item">
                        <i class="fas fa-check"></i>
                        <span>Medalha de Participação</span>
                    </div>
                </div>
                
                ${inscricao.status === 'confirmado' ? `
                    <div class="detalhes-qrcode">
                        <p>Apresente este QR Code na retirada do kit</p>
                        <img src="img/qrcode-placeholder.jpg" alt="QR Code">
                    </div>
                ` : ''}
            </div>
        `;
        
        // Exibir modal
        modalDetalhes.classList.add('active');
    }
    
    function mostrarModalCancelamento(id) {
        const inscricao = inscricoes.find(i => i.id === id);
        
        if (!inscricao) return;
        
        // Buscar evento relacionado
        const evento = eventos.find(e => e.id === inscricao.eventoId) || {
            titulo: 'Evento não encontrado'
        };
        
        inscricaoParaCancelar = inscricao;
        nomeEventoCancelar.textContent = evento.titulo;
        
        // Resetar formulário
        motivoCancelamento.value = '';
        document.getElementById('outro-motivo').value = '';
        outroMotivoContainer.style.display = 'none';
        
        // Exibir modal
        modalCancelar.classList.add('active');
    }
    
    function confirmarCancelamento() {
        if (!inscricaoParaCancelar) return;
        
        // Verificar se foi selecionado um motivo
        const motivo = motivoCancelamento.value;
        if (!motivo) {
            alert('Por favor, selecione um motivo para o cancelamento.');
            return;
        }
        
        // Atualizar status da inscrição
        inscricaoParaCancelar.status = 'cancelado';
        
        // Registrar motivo do cancelamento
        inscricaoParaCancelar.motivoCancelamento = motivo === 'outro' ? 
            document.getElementById('outro-motivo').value : 
            motivoCancelamento.options[motivoCancelamento.selectedIndex].text;
        
        // Salvar alterações
        localStorage.setItem('minhasInscricoes', JSON.stringify(inscricoes));
        
        // Fechar modal
        modalCancelar.classList.remove('active');
        
        // Atualizar lista
        inscricoesFiltradas = filtrarPorStatus(inscricoes);
        carregarInscricoes();
    }
    
    function capitalizarPrimeiraLetra(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function getStatusDescricao(status) {
        switch (status) {
            case 'confirmado':
                return 'Sua inscrição está confirmada. Você receberá informações sobre a retirada do kit por e-mail.';
            case 'pendente':
                return 'Aguardando confirmação do pagamento. Isso pode levar até 3 dias úteis.';
            case 'concluido':
                return 'Você participou deste evento. Confira seus resultados na área de resultados.';
            case 'cancelado':
                return 'Esta inscrição foi cancelada. Entre em contato com o suporte para mais informações.';
            default:
                return '';
        }
    }
    
    function getStatusPagamento(status) {
        switch (status) {
            case 'confirmado':
            case 'concluido':
                return 'Pago';
            case 'pendente':
                return 'Aguardando Pagamento';
            case 'cancelado':
                return 'Cancelado';
            default:
                return 'Desconhecido';
        }
    }
    
    // Função para obter inscrições padrão
    function getInscricoesPadrao() {
        return [
            {
                id: 1001,
                eventoId: 1,
                categoria: '21km',
                valor: 149.90,
                numero: 1234,
                status: 'confirmado',
                dataInscricao: '2025-02-15T10:30:00',
                formaPagamento: 'Cartão de Crédito'
            },
            {
                id: 1002,
                eventoId: 2,
                categoria: 'Intermediário',
                valor: 150.00,
                numero: 567,
                status: 'confirmado',
                dataInscricao: '2025-03-05T14:20:00',
                formaPagamento: 'PIX'
            },
            {
                id: 1003,
                eventoId: 3,
                categoria: '10km',
                valor: 99.90,
                numero: null,
                status: 'cancelado',
                dataInscricao: '2025-01-20T09:15:00',
                formaPagamento: 'Boleto',
                motivoCancelamento: 'Não estarei disponível na data'
            },
            {
                id: 1004,
                eventoId: 4,
                categoria: 'Sprint',
                valor: 250.00,
                numero: null,
                status: 'pendente',
                dataInscricao: '2025-03-25T16:40:00',
                formaPagamento: 'Boleto'
            },
            {
                id: 1005,
                eventoId: 5,
                categoria: '5km',
                valor: 85.00,
                numero: 789,
                status: 'confirmado',
                dataInscricao: '2025-03-10T11:05:00',
                formaPagamento: 'PIX'
            }
        ];
    }
});
