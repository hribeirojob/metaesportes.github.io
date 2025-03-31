document.addEventListener('DOMContentLoaded', function() {
    // Obter o ID do evento da URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');
    
    // Dados de exemplo para os eventos (em produção, esses dados viriam de um servidor)
    const eventos = [
        {
            id: 1,
            titulo: "Maratona São Paulo 2025",
            data: "15 de Abril, 2025",
            horario: "07:00",
            local: "Parque Ibirapuera",
            cidade: "São Paulo, SP",
            imagem: "img/maratonaSp.jpg",
            categorias: [
                { id: 1, nome: "Maratona (42km)", descricao: "Percurso completo de 42km", preco: "R$ 250,00", valor: 250 },
                { id: 2, nome: "Meia Maratona (21km)", descricao: "Percurso de 21km", preco: "R$ 180,00", valor: 180 },
                { id: 3, nome: "Corrida (10km)", descricao: "Percurso de 10km", preco: "R$ 150,00", valor: 150 }
            ]
        },
        {
            id: 2,
            titulo: "Ciclismo Tour Rio 2025",
            data: "22 de Maio, 2025",
            horario: "06:30",
            local: "Praia de Copacabana",
            cidade: "Rio de Janeiro, RJ",
            imagem: "img/cicloTurismoRj.jpg",
            categorias: [
                { id: 1, nome: "Elite (120km)", descricao: "Percurso completo para ciclistas avançados", preco: "R$ 300,00", valor: 300 },
                { id: 2, nome: "Amador Avançado (80km)", descricao: "Percurso intermediário", preco: "R$ 230,00", valor: 230 },
                { id: 3, nome: "Amador (40km)", descricao: "Percurso para iniciantes", preco: "R$ 180,00", valor: 180 }
            ]
        },
        {
            id: 3,
            titulo: "Corrida Noturna BH",
            data: "10 de Junho, 2025",
            horario: "19:30",
            local: "Praça da Liberdade",
            cidade: "Belo Horizonte, MG",
            imagem: "img/corridaNoturnaBh.jpg",
            categorias: [
                { id: 1, nome: "Corrida (10km)", descricao: "Percurso de 10km iluminado", preco: "R$ 120,00", valor: 120 },
                { id: 2, nome: "Corrida (5km)", descricao: "Percurso de 5km iluminado", preco: "R$ 90,00", valor: 90 }
            ]
        },
        {
            id: 4,
            titulo: "Desafio Mountain Bike",
            data: "18 de Julho, 2025",
            horario: "08:00",
            local: "Parque Estadual do Rio Vermelho",
            cidade: "Florianópolis, SC",
            imagem: "img/desafioMtbFl.jpg",
            categorias: [
                { id: 1, nome: "Elite (60km)", descricao: "Percurso técnico avançado", preco: "R$ 220,00", valor: 220 },
                { id: 2, nome: "Sport (40km)", descricao: "Percurso intermediário", preco: "R$ 180,00", valor: 180 },
                { id: 3, nome: "Turismo (20km)", descricao: "Percurso para iniciantes", preco: "R$ 150,00", valor: 150 }
            ]
        },
        {
            id: 5,
            titulo: "Meia Maratona Salvador",
            data: "5 de Agosto, 2025",
            horario: "06:00",
            local: "Farol da Barra",
            cidade: "Salvador, BA",
            imagem: "img/meiaMaratonaSalvador.jpg",
            categorias: [
                { id: 1, nome: "Meia Maratona (21km)", descricao: "Percurso de 21km", preco: "R$ 200,00", valor: 200 },
                { id: 2, nome: "Corrida (10km)", descricao: "Percurso de 10km", preco: "R$ 150,00", valor: 150 },
                { id: 3, nome: "Caminhada (5km)", descricao: "Percurso de 5km", preco: "R$ 100,00", valor: 100 }
            ]
        },
        {
            id: 6,
            titulo: "Triathlon Fortaleza",
            data: "20 de Setembro, 2025",
            horario: "05:30",
            local: "Praia do Futuro",
            cidade: "Fortaleza, CE",
            imagem: "img/triatloFortaleza.jpg",
            categorias: [
                { id: 1, nome: "Olímpico", descricao: "1.5km natação, 40km ciclismo, 10km corrida", preco: "R$ 350,00", valor: 350 },
                { id: 2, nome: "Sprint", descricao: "750m natação, 20km ciclismo, 5km corrida", preco: "R$ 250,00", valor: 250 }
            ]
        }
    ];

    // Variáveis para armazenar os dados da inscrição
    let inscricao = {
        evento: null,
        dadosPessoais: {},
        categoria: null,
        pagamento: {}
    };

    // Inicializar a página
    function inicializarPagina() {
        // Encontrar o evento pelo ID
        const evento = eventos.find(e => e.id == eventoId);
        
        if (!evento) {
            alert('Evento não encontrado!');
            window.location.href = 'index.html';
            return;
        }
        
        // Armazenar o evento na inscrição
        inscricao.evento = evento;
        
        // Atualizar o título da página
        document.title = `Inscrição - ${evento.titulo} - Meta Esportes`;
        
        // Atualizar o título do evento na página
        document.getElementById('evento-titulo').textContent = evento.titulo;
        
        // Carregar as categorias do evento
        carregarCategorias(evento.categorias);
        
        // Inicializar os resumos
        atualizarResumos();
    }

    // Carregar as categorias do evento
    function carregarCategorias(categorias) {
        const categoriasLista = document.getElementById('categorias-lista');
        categoriasLista.innerHTML = '';
        
        categorias.forEach(categoria => {
            const categoriaElement = document.createElement('div');
            categoriaElement.className = 'categoria-card';
            categoriaElement.innerHTML = `
                <input type="radio" id="categoria-${categoria.id}" name="categoria" value="${categoria.id}" required>
                <label for="categoria-${categoria.id}">
                    <div class="categoria-nome">${categoria.nome}</div>
                    <div class="categoria-descricao">${categoria.descricao}</div>
                    <div class="categoria-preco">${categoria.preco}</div>
                </label>
            `;
            
            categoriasLista.appendChild(categoriaElement);
        });
        
        // Adicionar evento de clique para selecionar categoria
        const categoriaCards = document.querySelectorAll('.categoria-card');
        categoriaCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remover classe selected de todos os cards
                categoriaCards.forEach(c => c.classList.remove('selected'));
                
                // Adicionar classe selected ao card clicado
                this.classList.add('selected');
                
                // Marcar o radio button
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
            });
        });
    }

    // Atualizar os resumos na página
    function atualizarResumos() {
        if (inscricao.evento) {
            // Resumo na etapa de pagamento
            document.getElementById('resumo-evento').textContent = inscricao.evento.titulo;
            
            // Confirmação
            document.getElementById('confirmacao-evento').textContent = inscricao.evento.titulo;
            document.getElementById('confirmacao-data').textContent = inscricao.evento.data;
            document.getElementById('confirmacao-local').textContent = `${inscricao.evento.local}, ${inscricao.evento.cidade}`;
        }
        
        if (inscricao.categoria) {
            // Resumo na etapa de pagamento
            document.getElementById('resumo-categoria').textContent = inscricao.categoria.nome;
            document.getElementById('resumo-valor').textContent = inscricao.categoria.preco;
            
            // Confirmação
            document.getElementById('confirmacao-categoria').textContent = inscricao.categoria.nome;
        }
        
        if (inscricao.dadosPessoais.nome) {
            document.getElementById('confirmacao-atleta').textContent = inscricao.dadosPessoais.nome;
        }
        
        if (inscricao.dadosPessoais.email) {
            document.getElementById('confirmacao-email').textContent = inscricao.dadosPessoais.email;
        }
        
        // Gerar número de inscrição aleatório
        const numeroInscricao = `ME${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
        document.getElementById('confirmacao-numero').textContent = numeroInscricao;
    }

    // Configurar navegação entre etapas
    function configurarNavegacao() {
        const steps = document.querySelectorAll('.inscricao-step');
        const progressoItems = document.querySelectorAll('.progresso-item');
        const progressoLinhas = document.querySelectorAll('.progresso-linha');
        
        // Formulários
        const formDadosPessoais = document.getElementById('form-dados-pessoais');
        const formCategoria = document.getElementById('form-categoria');
        const formPagamento = document.getElementById('form-pagamento');
        
        // Botões de navegação
        const btnVoltar = document.querySelectorAll('.btn-voltar');
        
        // Etapa atual
        let etapaAtual = 1;
        
        // Função para ir para a próxima etapa
        function irParaEtapa(etapa) {
            // Esconder todas as etapas
            steps.forEach(step => step.style.display = 'none');
            
            // Mostrar a etapa atual
            document.getElementById(`step-${etapa}`).style.display = 'block';
            
            // Atualizar a barra de progresso
            progressoItems.forEach((item, index) => {
                const itemEtapa = parseInt(item.getAttribute('data-step'));
                
                if (itemEtapa < etapa) {
                    item.classList.add('completed');
                    item.classList.remove('active');
                } else if (itemEtapa === etapa) {
                    item.classList.add('active');
                    item.classList.remove('completed');
                } else {
                    item.classList.remove('active', 'completed');
                }
            });
            
            // Atualizar as linhas de progresso
            progressoLinhas.forEach((linha, index) => {
                if (index < etapa - 1) {
                    linha.classList.add('completed');
                } else {
                    linha.classList.remove('completed');
                }
            });
            
            // Atualizar a etapa atual
            etapaAtual = etapa;
            
            // Scroll para o topo
            window.scrollTo(0, 0);
        }
        
        // Formulário de dados pessoais
        if (formDadosPessoais) {
            formDadosPessoais.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Validar formulário
                if (this.checkValidity()) {
                    // Armazenar dados pessoais
                    inscricao.dadosPessoais = {
                        nome: document.getElementById('nome').value,
                        cpf: document.getElementById('cpf').value,
                        dataNascimento: document.getElementById('data-nascimento').value,
                        genero: document.getElementById('genero').value,
                        email: document.getElementById('email').value,
                        telefone: document.getElementById('telefone').value,
                        cep: document.getElementById('cep').value,
                        endereco: document.getElementById('endereco').value,
                        numero: document.getElementById('numero').value,
                        complemento: document.getElementById('complemento').value,
                        bairro: document.getElementById('bairro').value,
                        cidade: document.getElementById('cidade').value,
                        estado: document.getElementById('estado').value
                    };
                    
                    // Ir para a próxima etapa
                    irParaEtapa(2);
                } else {
                    // Mostrar validações nativas do navegador
                    this.reportValidity();
                }
            });
        }
        
        // Formulário de categoria
        if (formCategoria) {
            formCategoria.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Validar formulário
                if (this.checkValidity()) {
                    // Obter categoria selecionada
                    const categoriaId = document.querySelector('input[name="categoria"]:checked')?.value;
                    
                    if (!categoriaId) {
                        alert('Por favor, selecione uma categoria');
                        return;
                    }
                    
                    // Armazenar categoria
                    inscricao.categoria = inscricao.evento.categorias.find(c => c.id == categoriaId);
                    
                    // Armazenar dados adicionais
                    inscricao.dadosAdicionais = {
                        tamanhoCamiseta: document.getElementById('tamanho-camiseta').value,
                        infoMedica: document.getElementById('info-medica').value,
                        contatoEmergencia: document.getElementById('contato-emergencia').value
                    };
                    
                    // Atualizar resumos
                    atualizarResumos();
                    
                    // Ir para a próxima etapa
                    irParaEtapa(3);
                } else {
                    // Mostrar validações nativas do navegador
                    this.reportValidity();
                }
            });
        }
        
        // Formulário de pagamento
        if (formPagamento) {
            // Alternar entre métodos de pagamento
            const radiosPagamento = document.querySelectorAll('input[name="forma-pagamento"]');
            const formsPagamento = document.querySelectorAll('.pagamento-form');
            
            radiosPagamento.forEach(radio => {
                radio.addEventListener('change', function() {
                    // Esconder todos os formulários
                    formsPagamento.forEach(form => form.style.display = 'none');
                    
                    // Mostrar o formulário correspondente
                    document.getElementById(`form-${this.value}`).style.display = 'block';
                });
            });
            
            // Botão de copiar chave PIX
            const btnCopy = document.querySelector('.btn-copy');
            if (btnCopy) {
                btnCopy.addEventListener('click', function() {
                    const pixKey = this.previousElementSibling;
                    pixKey.select();
                    document.execCommand('copy');
                    
                    // Feedback visual
                    this.textContent = 'Copiado!';
                    setTimeout(() => {
                        this.textContent = 'Copiar';
                    }, 2000);
                });
            }
            
            // Botão de gerar boleto
            const btnGerarBoleto = document.querySelector('.btn-gerar-boleto');
            if (btnGerarBoleto) {
                btnGerarBoleto.addEventListener('click', function() {
                    alert('Funcionalidade de geração de boleto simulada. Em um ambiente real, o boleto seria gerado e aberto em uma nova aba.');
                });
            }
            
            // Submissão do formulário de pagamento
            formPagamento.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Obter método de pagamento selecionado
                const metodoPagamento = document.querySelector('input[name="forma-pagamento"]:checked').value;
                
                // Validar formulário específico do método de pagamento
                let valido = true;
                
                if (metodoPagamento === 'cartao') {
                    // Validar campos do cartão
                    const cartaoNome = document.getElementById('cartao-nome');
                    const cartaoNumero = document.getElementById('cartao-numero');
                    const cartaoValidade = document.getElementById('cartao-validade');
                    const cartaoCvv = document.getElementById('cartao-cvv');
                    
                    if (!cartaoNome.value.trim()) {
                        alert('Por favor, informe o nome no cartão');
                        valido = false;
                    } else if (!cartaoNumero.value.trim() || cartaoNumero.value.replace(/\D/g, '').length < 16) {
                        alert('Por favor, informe um número de cartão válido');
                        valido = false;
                    } else if (!cartaoValidade.value.trim() || !/^\d{2}\/\d{2}$/.test(cartaoValidade.value)) {
                        alert('Por favor, informe uma data de validade válida (MM/AA)');
                        valido = false;
                    } else if (!cartaoCvv.value.trim() || !/^\d{3,4}$/.test(cartaoCvv.value)) {
                        alert('Por favor, informe um código de segurança válido');
                        valido = false;
                    }
                }
                
                if (valido) {
                    // Armazenar dados de pagamento
                    inscricao.pagamento = {
                        metodo: metodoPagamento
                    };
                    
                    // Simular processamento de pagamento
                    const btnSubmit = this.querySelector('button[type="submit"]');
                    btnSubmit.disabled = true;
                    btnSubmit.textContent = 'Processando...';
                    
                    setTimeout(() => {
                        // Ir para a próxima etapa
                        irParaEtapa(4);
                        
                        // Restaurar botão
                        btnSubmit.disabled = false;
                        btnSubmit.textContent = 'Confirmar Pagamento';
                    }, 2000);
                }
            });
        }
        
        // Botões de voltar
        btnVoltar.forEach(btn => {
            btn.addEventListener('click', function() {
                if (etapaAtual > 1) {
                    irParaEtapa(etapaAtual - 1);
                }
            });
        });
        
        // Botão de imprimir comprovante
        const btnImprimir = document.querySelector('.btn-imprimir');
        if (btnImprimir) {
            btnImprimir.addEventListener('click', function() {
                window.print();
            });
        }
    }

    // Máscaras para campos
    function configurarMascaras() {
        // Máscara para CPF
        const inputCpf = document.getElementById('cpf');
        if (inputCpf) {
            inputCpf.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 0) {
                    valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
                    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
                    valor = valor.replace(/\.(\d{3})(\d)/, '.$1-$2');
                }
                
                e.target.value = valor;
            });
        }
        
        // Máscara para telefone
        const inputTelefone = document.getElementById('telefone');
        if (inputTelefone) {
            inputTelefone.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 0) {
                    // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                    if (valor.length <= 10) {
                        valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
                        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
                    } else {
                        valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
                        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
                    }
                }
                
                e.target.value = valor;
            });
        }
        
        // Máscara para CEP
        const inputCep = document.getElementById('cep');
        if (inputCep) {
            inputCep.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 0) {
                    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
                }
                
                e.target.value = valor;
            });
        }
        
        // Máscara para cartão de crédito
        const inputCartaoNumero = document.getElementById('cartao-numero');
        if (inputCartaoNumero) {
            inputCartaoNumero.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 0) {
                    valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
                }
                
                e.target.value = valor;
            });
        }
        
        // Máscara para validade do cartão
        const inputCartaoValidade = document.getElementById('cartao-validade');
        if (inputCartaoValidade) {
            inputCartaoValidade.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 0) {
                    valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
                }
                
                e.target.value = valor;
            });
        }
    }

    // Inicializar a página
    inicializarPagina();
    
    // Configurar navegação
    configurarNavegacao();
    
    // Configurar máscaras
    configurarMascaras();
});
