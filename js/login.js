document.addEventListener('DOMContentLoaded', function() {
    // Credenciais de mock para login
    const mockCredentials = [
        {
            email: "unipam@unipam.com",
            senha: "unipam@123!",
            tipo: "gestor",
            nome: "Administrador Meta Esportes"
        },
        {
            email: "atleta@teste.com",
            senha: "atleta123",
            tipo: "atleta",
            nome: "Atleta Teste"
        }
    ];

    // Verificar se o usuário já está logado
    verificarLogin();

    // Alternar entre abas de login e cadastro
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todos os botões
            tabBtns.forEach(b => b.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Esconder todos os conteúdos de abas
            tabContents.forEach(content => content.style.display = 'none');
            
            // Mostrar o conteúdo da aba selecionada
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    // Alternar visibilidade da senha
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    
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
    
    // Validação do formulário de login
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Limpar mensagens de erro anteriores
            limparErros(formLogin);
            
            // Obter valores do formulário
            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('senha-login').value;
            
            // Verificar se as credenciais correspondem a algum usuário mock
            const usuario = mockCredentials.find(user => user.email === email && user.senha === senha);
            
            if (usuario) {
                // Login bem-sucedido
                exibirMensagemSucesso(formLogin, 'Login realizado com sucesso! Redirecionando...');
                
                // Armazenar informações de login
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', usuario.email);
                localStorage.setItem('userType', usuario.tipo);
                localStorage.setItem('userName', usuario.nome);
                localStorage.setItem('loginTime', new Date().toString());
                
                // Simulação de redirecionamento após login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Credenciais inválidas
                exibirErro(document.getElementById('senha-login'), 'Credenciais inválidas. Verifique seu usuário e senha.');
            }
        });
    }
    
    // Validação do formulário de cadastro
    const formCadastro = document.getElementById('form-cadastro');
    
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Limpar mensagens de erro anteriores
            limparErros(formCadastro);
            
            // Validar formulário
            if (validarFormularioCadastro()) {
                // Simulação de cadastro bem-sucedido
                exibirMensagemSucesso(formCadastro, 'Cadastro realizado com sucesso! Redirecionando...');
                
                // Obter dados do formulário
                const nome = document.getElementById('nome-cadastro').value;
                const email = document.getElementById('email-cadastro').value;
                
                // Armazenar informações de login (simulação)
                // Cadastro público sempre cria um perfil de atleta
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('username', email);
                localStorage.setItem('userType', 'atleta');
                localStorage.setItem('userName', nome);
                localStorage.setItem('loginTime', new Date().toString());
                
                // Simulação de redirecionamento após cadastro
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
    
    // Função para validar o formulário de cadastro
    function validarFormularioCadastro() {
        let valido = true;
        
        // Validar nome
        const nome = document.getElementById('nome-cadastro');
        if (!nome.value.trim()) {
            exibirErro(nome, 'Por favor, informe seu nome completo');
            valido = false;
        }
        
        // Validar email
        const email = document.getElementById('email-cadastro');
        if (!email.value.trim()) {
            exibirErro(email, 'Por favor, informe seu e-mail');
            valido = false;
        } else if (!validarEmail(email.value)) {
            exibirErro(email, 'Por favor, informe um e-mail válido');
            valido = false;
        }
        
        // Verificar se o email já está em uso
        const emailJaExiste = mockCredentials.some(user => user.email === email.value);
        if (emailJaExiste) {
            exibirErro(email, 'Este e-mail já está em uso');
            valido = false;
        }
        
        // Validar telefone
        const telefone = document.getElementById('telefone-cadastro');
        if (!telefone.value.trim()) {
            exibirErro(telefone, 'Por favor, informe seu telefone');
            valido = false;
        } else if (!validarTelefone(telefone.value)) {
            exibirErro(telefone, 'Por favor, informe um telefone válido');
            valido = false;
        }
        
        // Validar senha
        const senha = document.getElementById('senha-cadastro');
        if (!senha.value.trim()) {
            exibirErro(senha, 'Por favor, informe uma senha');
            valido = false;
        } else if (senha.value.length < 6) {
            exibirErro(senha, 'A senha deve ter pelo menos 6 caracteres');
            valido = false;
        }
        
        // Validar confirmação de senha
        const confirmarSenha = document.getElementById('confirmar-senha');
        if (!confirmarSenha.value.trim()) {
            exibirErro(confirmarSenha, 'Por favor, confirme sua senha');
            valido = false;
        } else if (confirmarSenha.value !== senha.value) {
            exibirErro(confirmarSenha, 'As senhas não coincidem');
            valido = false;
        }
        
        // Validar termos
        const termos = document.getElementById('termos');
        if (!termos.checked) {
            exibirErro(termos, 'Você deve concordar com os termos de uso e política de privacidade');
            valido = false;
        }
        
        return valido;
    }
    
    // Função para exibir erro
    function exibirErro(elemento, mensagem) {
        // Remover erro anterior se existir
        const erroExistente = elemento.parentElement.parentElement.querySelector('.form-error');
        if (erroExistente) {
            erroExistente.remove();
        }
        
        // Criar e adicionar mensagem de erro
        const erro = document.createElement('div');
        erro.className = 'form-error';
        erro.textContent = mensagem;
        
        if (elemento.type === 'checkbox') {
            elemento.parentElement.appendChild(erro);
        } else {
            elemento.parentElement.parentElement.appendChild(erro);
        }
        
        elemento.classList.add('input-error');
    }
    
    // Função para limpar erros
    function limparErros(form) {
        const erros = form.querySelectorAll('.form-error');
        erros.forEach(erro => erro.remove());
        
        const inputsComErro = form.querySelectorAll('.input-error');
        inputsComErro.forEach(input => input.classList.remove('input-error'));
    }
    
    // Função para exibir mensagem de sucesso
    function exibirMensagemSucesso(form, mensagem) {
        // Remover mensagem anterior se existir
        const sucessoExistente = form.parentElement.querySelector('.form-success');
        if (sucessoExistente) {
            sucessoExistente.remove();
        }
        
        // Criar e adicionar mensagem de sucesso
        const sucesso = document.createElement('div');
        sucesso.className = 'form-success';
        sucesso.textContent = mensagem;
        sucesso.style.display = 'block';
        
        form.insertAdjacentElement('beforebegin', sucesso);
    }
    
    // Função para validar email
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Função para validar telefone
    function validarTelefone(telefone) {
        // Remove caracteres não numéricos
        const numeroLimpo = telefone.replace(/\D/g, '');
        // Verifica se tem pelo menos 10 dígitos (DDD + número)
        return numeroLimpo.length >= 10;
    }
    
    // Máscara para telefone
    const inputTelefone = document.getElementById('telefone-cadastro');
    if (inputTelefone) {
        inputTelefone.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 0) {
                // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                if (valor.length <= 10) {
                    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
                } else {
                    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
                }
            }
            
            e.target.value = valor;
        });
    }

    // Função para verificar se o usuário está logado
    function verificarLogin() {
        const loggedIn = localStorage.getItem('loggedIn');
        
        if (loggedIn === 'true') {
            // Redirecionar para a página inicial se já estiver logado
            window.location.href = 'index.html';
        }
    }
});
