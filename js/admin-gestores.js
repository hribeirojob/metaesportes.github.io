// Script para a página de administração de gestores

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    
    // Redirecionar se não estiver logado ou não for gestor
    if (!loggedIn || userType !== 'gestor') {
        window.location.href = 'index.html';
        return;
    }
    
    // Carregar gestores do localStorage ou usar dados padrão
    let gestores = JSON.parse(localStorage.getItem('gestores')) || getGestoresPadrao();
    
    // Configurações de paginação
    const itensPorPagina = 10;
    let paginaAtual = 1;
    let gestoresFiltrados = [...gestores];
    
    // Elementos do DOM
    const gestoresLista = document.getElementById('gestores-lista');
    const gestoresVazio = document.getElementById('gestores-vazio');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnProximo = document.getElementById('btn-proximo');
    const paginasContainer = document.getElementById('paginas');
    const buscaInput = document.getElementById('busca-gestor');
    const btnBuscar = document.getElementById('btn-buscar');
    const btnNovoGestor = document.getElementById('btn-novo-gestor');
    const modalGestor = document.getElementById('modal-gestor');
    const modalExcluir = document.getElementById('modal-excluir');
    const formGestor = document.getElementById('form-gestor');
    const modalGestorTitulo = document.getElementById('modal-gestor-titulo');
    const nomeGestorExcluir = document.getElementById('nome-gestor-excluir');
    const btnConfirmarExclusao = document.getElementById('btn-confirmar-exclusao');
    const btnFecharModais = document.querySelectorAll('.modal-close, .btn-cancelar');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
    let gestorParaEditar = null;
    let gestorParaExcluir = null;
    
    // Carregar gestores iniciais
    carregarGestores();
    
    // Event listeners
    btnAnterior.addEventListener('click', paginaAnterior);
    btnProximo.addEventListener('click', proximaPagina);
    btnBuscar.addEventListener('click', buscarGestores);
    btnNovoGestor.addEventListener('click', mostrarModalNovoGestor);
    
    buscaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarGestores();
        }
    });
    
    // Fechar modais
    btnFecharModais.forEach(btn => {
        btn.addEventListener('click', function() {
            modalGestor.classList.remove('active');
            modalExcluir.classList.remove('active');
            gestorParaEditar = null;
            gestorParaExcluir = null;
        });
    });
    
    // Alternar visibilidade da senha
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            
            // Alternar tipo de input entre password e text
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // Formulário de gestor
    formGestor.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const nome = document.getElementById('nome-gestor').value;
        const email = document.getElementById('email-gestor').value;
        const senha = document.getElementById('senha-gestor').value;
        const confirmarSenha = document.getElementById('confirmar-senha-gestor').value;
        const status = document.getElementById('status-gestor').value;
        
        // Verificar se as senhas coincidem
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem');
            return;
        }
        
        // Obter permissões selecionadas
        const permissoesCheckboxes = document.querySelectorAll('input[name="permissoes"]:checked');
        const permissoes = Array.from(permissoesCheckboxes).map(checkbox => checkbox.value);
        
        if (gestorParaEditar) {
            // Atualizar gestor existente
            const index = gestores.findIndex(g => g.id === gestorParaEditar.id);
            
            if (index !== -1) {
                gestores[index].nome = nome;
                gestores[index].email = email;
                
                // Atualizar senha apenas se foi fornecida
                if (senha) {
                    gestores[index].senha = senha;
                }
                
                gestores[index].status = status;
                gestores[index].permissoes = permissoes;
                
                // Salvar alterações
                localStorage.setItem('gestores', JSON.stringify(gestores));
                
                // Atualizar lista
                gestoresFiltrados = [...gestores];
                carregarGestores();
                
                // Fechar modal
                modalGestor.classList.remove('active');
                gestorParaEditar = null;
                
                alert('Gestor atualizado com sucesso!');
            }
        } else {
            // Verificar se o email já está em uso
            const emailExistente = gestores.some(g => g.email === email);
            
            if (emailExistente) {
                alert('Este email já está em uso');
                return;
            }
            
            // Criar novo gestor
            const novoGestor = {
                id: Date.now(),
                nome,
                email,
                senha,
                status,
                permissoes,
                dataCadastro: new Date().toISOString()
            };
            
            // Adicionar à lista
            gestores.push(novoGestor);
            
            // Salvar alterações
            localStorage.setItem('gestores', JSON.stringify(gestores));
            
            // Atualizar lista
            gestoresFiltrados = [...gestores];
            carregarGestores();
            
            // Fechar modal
            modalGestor.classList.remove('active');
            
            alert('Gestor cadastrado com sucesso!');
        }
        
        // Limpar formulário
        formGestor.reset();
    });
    
    // Confirmar exclusão
    btnConfirmarExclusao.addEventListener('click', confirmarExclusao);
    
    // Funções
    function carregarGestores() {
        // Limpar lista
        gestoresLista.innerHTML = '';
        
        // Calcular índices para paginação
        const inicio = (paginaAtual - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const gestoresExibidos = gestoresFiltrados.slice(inicio, fim);
        
        if (gestoresExibidos.length === 0) {
            gestoresLista.parentElement.style.display = 'none';
            gestoresVazio.style.display = 'flex';
            document.getElementById('gestores-paginacao').style.display = 'none';
            return;
        }
        
        gestoresLista.parentElement.style.display = 'table';
        gestoresVazio.style.display = 'none';
        document.getElementById('gestores-paginacao').style.display = 'flex';
        
        // Adicionar gestores à lista
        gestoresExibidos.forEach(gestor => {
            const tr = document.createElement('tr');
            
            // Formatação da data
            const data = new Date(gestor.dataCadastro);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            
            tr.innerHTML = `
                <td>${gestor.nome}</td>
                <td>${gestor.email}</td>
                <td>${dataFormatada}</td>
                <td>
                    <span class="status-badge ${gestor.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">
                        ${gestor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="acoes">
                    <button class="btn-acao btn-editar" data-id="${gestor.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-acao btn-excluir" data-id="${gestor.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            gestoresLista.appendChild(tr);
        });
        
        // Adicionar event listeners para botões de editar e excluir
        const botoesEditar = document.querySelectorAll('.btn-editar');
        botoesEditar.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editarGestor(id);
            });
        });
        
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                mostrarModalExclusao(id);
            });
        });
        
        // Atualizar paginação
        atualizarPaginacao();
    }
    
    function atualizarPaginacao() {
        const totalPaginas = Math.ceil(gestoresFiltrados.length / itensPorPagina);
        
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
                carregarGestores();
            });
            
            paginasContainer.appendChild(pagina);
        }
    }
    
    function paginaAnterior() {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarGestores();
        }
    }
    
    function proximaPagina() {
        const totalPaginas = Math.ceil(gestoresFiltrados.length / itensPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            carregarGestores();
        }
    }
    
    function buscarGestores() {
        const termo = buscaInput.value.toLowerCase().trim();
        
        if (termo === '') {
            gestoresFiltrados = [...gestores];
        } else {
            gestoresFiltrados = gestores.filter(gestor => {
                return (
                    gestor.nome.toLowerCase().includes(termo) ||
                    gestor.email.toLowerCase().includes(termo)
                );
            });
        }
        
        paginaAtual = 1;
        carregarGestores();
    }
    
    function mostrarModalNovoGestor() {
        // Limpar formulário
        formGestor.reset();
        
        // Atualizar título do modal
        modalGestorTitulo.textContent = 'Novo Gestor';
        
        // Exibir modal
        modalGestor.classList.add('active');
    }
    
    function editarGestor(id) {
        const gestor = gestores.find(g => g.id === id);
        
        if (!gestor) return;
        
        // Preencher formulário com dados do gestor
        document.getElementById('nome-gestor').value = gestor.nome;
        document.getElementById('email-gestor').value = gestor.email;
        document.getElementById('senha-gestor').value = '';
        document.getElementById('confirmar-senha-gestor').value = '';
        document.getElementById('status-gestor').value = gestor.status;
        
        // Desmarcar todas as permissões
        document.querySelectorAll('input[name="permissoes"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Marcar permissões do gestor
        gestor.permissoes.forEach(permissao => {
            const checkbox = document.querySelector(`input[name="permissoes"][value="${permissao}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Atualizar título do modal
        modalGestorTitulo.textContent = 'Editar Gestor';
        
        // Armazenar referência ao gestor sendo editado
        gestorParaEditar = gestor;
        
        // Exibir modal
        modalGestor.classList.add('active');
    }
    
    function mostrarModalExclusao(id) {
        const gestor = gestores.find(g => g.id === id);
        
        if (!gestor) return;
        
        // Armazenar referência ao gestor sendo excluído
        gestorParaExcluir = gestor;
        
        // Atualizar nome do gestor no modal
        nomeGestorExcluir.textContent = gestor.nome;
        
        // Exibir modal
        modalExcluir.classList.add('active');
    }
    
    function confirmarExclusao() {
        if (!gestorParaExcluir) return;
        
        // Remover gestor da lista
        gestores = gestores.filter(g => g.id !== gestorParaExcluir.id);
        
        // Salvar alterações
        localStorage.setItem('gestores', JSON.stringify(gestores));
        
        // Atualizar lista
        gestoresFiltrados = [...gestores];
        carregarGestores();
        
        // Fechar modal
        modalExcluir.classList.remove('active');
        gestorParaExcluir = null;
        
        alert('Gestor excluído com sucesso!');
    }
    
    // Função para obter gestores padrão
    function getGestoresPadrao() {
        return [
            {
                id: 1,
                nome: 'Administrador Meta Esportes',
                email: 'unipam',
                senha: 'unipam@123!',
                status: 'ativo',
                permissoes: ['eventos', 'inscricoes', 'gestores'],
                dataCadastro: '2025-01-01T00:00:00'
            }
        ];
    }
});
