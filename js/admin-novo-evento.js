// Gerenciamento de novo evento e edição de eventos existentes

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!loggedIn) {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'login.html';
        return;
    }
    
    // Elementos do DOM
    const formEvento = document.getElementById('form-evento');
    const tituloPagina = document.getElementById('titulo-pagina');
    const btnAdicionarCategoria = document.getElementById('btn-adicionar-categoria');
    const categoriasContainer = document.getElementById('categorias-container');
    const inputImagem = document.getElementById('imagem');
    const previewImg = document.getElementById('preview-img');
    const inputArquivoGPX = document.getElementById('arquivoGPX');
    const gpxFilename = document.getElementById('gpx-filename');
    
    // Obter ID do evento da URL (se existir)
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id') ? parseInt(urlParams.get('id')) : null;
    
    // Carregar eventos do localStorage ou usar eventos padrão
    let eventos = JSON.parse(localStorage.getItem('eventos')) || getEventosPadrao();
    
    // Evento atual (para edição)
    let eventoAtual = null;
    
    // Contador para IDs de categorias
    let categoriaCounter = 1;
    
    // Verificar se é edição ou novo evento
    if (eventoId) {
        // Buscar evento pelo ID
        eventoAtual = eventos.find(evento => evento.id === eventoId);
        
        if (eventoAtual) {
            // Atualizar título da página
            tituloPagina.textContent = 'Editar Evento';
            
            // Preencher formulário com dados do evento
            preencherFormulario(eventoAtual);
        } else {
            // Evento não encontrado, redirecionar para lista de eventos
            window.location.href = 'admin-eventos.html';
        }
    }
    
    // Event listeners
    btnAdicionarCategoria.addEventListener('click', adicionarCategoria);
    inputImagem.addEventListener('change', previewImagem);
    inputArquivoGPX.addEventListener('change', previewGPX);
    formEvento.addEventListener('submit', salvarEvento);
    
    // Funções
    function preencherFormulario(evento) {
        // Preencher campos básicos
        document.getElementById('titulo').value = evento.titulo;
        document.getElementById('status').value = evento.status;
        
        // Formatar data e horário
        const data = new Date(evento.data);
        const dataFormatada = data.toISOString().split('T')[0];
        const horaFormatada = data.toTimeString().slice(0, 5);
        
        document.getElementById('data').value = dataFormatada;
        document.getElementById('horario').value = horaFormatada;
        
        document.getElementById('cidade').value = evento.cidade;
        document.getElementById('estado').value = evento.estado;
        document.getElementById('endereco').value = evento.endereco;
        document.getElementById('descricao').value = evento.descricao;
        
        // Preencher imagem se existir
        if (evento.imagem) {
            previewImg.src = evento.imagem;
            previewImg.style.display = 'block';
            document.querySelector('.upload-placeholder').style.display = 'none';
        }
        
        // Preencher arquivo GPX se existir
        if (evento.arquivoGPX) {
            gpxFilename.textContent = evento.arquivoGPX.split('/').pop();
            gpxFilename.style.display = 'block';
            inputArquivoGPX.parentElement.querySelector('.upload-placeholder').style.display = 'none';
        }
        
        // Limpar categorias existentes
        categoriasContainer.innerHTML = '';
        
        // Adicionar categorias do evento
        evento.categorias.forEach((categoria, index) => {
            adicionarCategoriaExistente(categoria, index);
        });
        
        // Atualizar contador de categorias
        categoriaCounter = evento.categorias.length;
    }
    
    function adicionarCategoriaExistente(categoria, index) {
        const categoriaItem = document.createElement('div');
        categoriaItem.className = 'categoria-item';
        
        categoriaItem.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label for="categoria-nome-${index}">Nome da Categoria*</label>
                    <input type="text" id="categoria-nome-${index}" name="categorias[${index}][nome]" value="${categoria.nome}" required>
                </div>
                <div class="form-group">
                    <label for="categoria-preco-${index}">Preço (R$)*</label>
                    <input type="number" id="categoria-preco-${index}" name="categorias[${index}][preco]" min="0" step="0.01" value="${categoria.preco}" required>
                </div>
            </div>
            <div class="form-group">
                <label for="categoria-descricao-${index}">Descrição da Categoria*</label>
                <textarea id="categoria-descricao-${index}" name="categorias[${index}][descricao]" rows="2" required>${categoria.descricao}</textarea>
            </div>
            ${index > 0 ? `<button type="button" class="btn-remover-categoria" data-index="${index}"><i class="fas fa-times"></i></button>` : ''}
        `;
        
        categoriasContainer.appendChild(categoriaItem);
        
        // Adicionar event listener para botão de remover
        if (index > 0) {
            const btnRemover = categoriaItem.querySelector('.btn-remover-categoria');
            btnRemover.addEventListener('click', function() {
                categoriaItem.remove();
            });
        }
    }
    
    function adicionarCategoria() {
        const index = categoriaCounter;
        categoriaCounter++;
        
        const categoriaItem = document.createElement('div');
        categoriaItem.className = 'categoria-item';
        
        categoriaItem.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label for="categoria-nome-${index}">Nome da Categoria*</label>
                    <input type="text" id="categoria-nome-${index}" name="categorias[${index}][nome]" required>
                </div>
                <div class="form-group">
                    <label for="categoria-preco-${index}">Preço (R$)*</label>
                    <input type="number" id="categoria-preco-${index}" name="categorias[${index}][preco]" min="0" step="0.01" required>
                </div>
            </div>
            <div class="form-group">
                <label for="categoria-descricao-${index}">Descrição da Categoria*</label>
                <textarea id="categoria-descricao-${index}" name="categorias[${index}][descricao]" rows="2" required></textarea>
            </div>
            <button type="button" class="btn-remover-categoria" data-index="${index}"><i class="fas fa-times"></i></button>
        `;
        
        categoriasContainer.appendChild(categoriaItem);
        
        // Adicionar event listener para botão de remover
        const btnRemover = categoriaItem.querySelector('.btn-remover-categoria');
        btnRemover.addEventListener('click', function() {
            categoriaItem.remove();
        });
    }
    
    function previewImagem(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewImg.style.display = 'block';
                document.querySelector('.upload-placeholder').style.display = 'none';
            }
            
            reader.readAsDataURL(file);
        }
    }
    
    function previewGPX(e) {
        const file = e.target.files[0];
        
        if (file) {
            gpxFilename.textContent = file.name;
            gpxFilename.style.display = 'block';
            inputArquivoGPX.parentElement.querySelector('.upload-placeholder').style.display = 'none';
        }
    }
    
    function salvarEvento(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const formData = new FormData(formEvento);
        
        // Criar objeto do evento
        const evento = {
            id: eventoAtual ? eventoAtual.id : gerarNovoId(),
            titulo: formData.get('titulo'),
            status: formData.get('status'),
            cidade: formData.get('cidade'),
            estado: formData.get('estado'),
            endereco: formData.get('endereco'),
            descricao: formData.get('descricao'),
            categorias: [],
            inscricoes: eventoAtual ? eventoAtual.inscricoes : 0,
            arquivoGPX: ''
        };
        
        // Combinar data e horário
        const data = formData.get('data');
        const horario = formData.get('horario');
        evento.data = `${data}T${horario}:00`;
        
        // Obter imagem (se foi carregada uma nova)
        if (previewImg.style.display === 'block') {
            evento.imagem = previewImg.src;
        } else if (eventoAtual && eventoAtual.imagem) {
            evento.imagem = eventoAtual.imagem;
        }
        
        // Obter arquivo GPX (se foi carregado um novo)
        if (inputArquivoGPX.files && inputArquivoGPX.files[0]) {
            // Em um sistema real, aqui faríamos o upload do arquivo
            // Como é um mock, vamos simular o caminho do arquivo
            evento.arquivoGPX = `percursos/${inputArquivoGPX.files[0].name}`;
        } else if (eventoAtual && eventoAtual.arquivoGPX) {
            evento.arquivoGPX = eventoAtual.arquivoGPX;
        }
        
        // Obter categorias
        const categoriaItems = categoriasContainer.querySelectorAll('.categoria-item');
        
        categoriaItems.forEach((item, index) => {
            const nome = item.querySelector(`#categoria-nome-${index}`).value;
            const preco = parseFloat(item.querySelector(`#categoria-preco-${index}`).value);
            const descricao = item.querySelector(`#categoria-descricao-${index}`).value;
            
            evento.categorias.push({
                nome,
                preco,
                descricao
            });
        });
        
        // Atualizar ou adicionar evento na lista
        if (eventoAtual) {
            // Atualizar evento existente
            const index = eventos.findIndex(e => e.id === eventoAtual.id);
            if (index !== -1) {
                eventos[index] = evento;
            }
        } else {
            // Adicionar novo evento
            eventos.push(evento);
        }
        
        // Salvar no localStorage
        localStorage.setItem('eventos', JSON.stringify(eventos));
        
        // Redirecionar para lista de eventos
        window.location.href = 'admin-eventos.html';
    }
    
    function gerarNovoId() {
        // Encontrar o maior ID existente e incrementar
        const ids = eventos.map(evento => evento.id);
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
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
