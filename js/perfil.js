// Script para a página de perfil

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!loggedIn) {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = 'login.html';
        return;
    }
    
    // Obter dados do usuário logado
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    // Carregar dados do perfil do localStorage ou usar dados padrão
    let perfilData = JSON.parse(localStorage.getItem('perfilData')) || getPerfilPadrao(username, userType, userName);
    
    // Elementos do DOM
    const menuItems = document.querySelectorAll('.perfil-menu-item');
    const tabs = document.querySelectorAll('.perfil-tab');
    const formDadosPessoais = document.getElementById('form-dados-pessoais');
    const formAlterarSenha = document.getElementById('form-alterar-senha');
    const formEndereco = document.getElementById('form-endereco');
    const formPreferencias = document.getElementById('form-preferencias');
    const btnAlterarAvatar = document.getElementById('btn-alterar-avatar');
    const avatarInput = document.getElementById('avatar-input');
    const avatarPreview = document.getElementById('avatar-preview');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const perfilTitulo = document.querySelector('.perfil-titulo h2');
    
    // Atualizar título com nome do usuário
    if (perfilTitulo) {
        perfilTitulo.textContent = `Perfil de ${userName || username}`;
    }
    
    // Configurar elementos específicos por tipo de usuário
    configurarPerfilPorTipo(userType);
    
    // Verificar se há uma tab específica na URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        ativarTab(hash);
    }
    
    // Preencher formulários com dados existentes
    preencherFormularios();
    
    // Event listeners para navegação de tabs
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                ativarTab(tabId);
            }
        });
    });
    
    // Event listener para alteração de avatar
    btnAlterarAvatar.addEventListener('click', function() {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
                perfilData.avatar = e.target.result;
                salvarPerfil();
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // Event listeners para formulários
    if (formDadosPessoais) {
        formDadosPessoais.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Atualizar dados pessoais
            perfilData.nome = document.getElementById('nome').value;
            perfilData.email = document.getElementById('email').value;
            perfilData.cpf = document.getElementById('cpf').value;
            perfilData.telefone = document.getElementById('telefone').value;
            perfilData.dataNascimento = document.getElementById('data-nascimento').value;
            perfilData.genero = document.getElementById('genero').value;
            
            // Atualizar nome no localStorage
            localStorage.setItem('userName', perfilData.nome);
            
            // Salvar dados
            salvarPerfil();
            
            // Exibir mensagem de sucesso
            exibirMensagem('Dados pessoais atualizados com sucesso!', 'success');
        });
    }
    
    if (formAlterarSenha) {
        // Event listeners para validação de senha em tempo real
        const novaSenhaInput = document.getElementById('nova-senha');
        const confirmarSenhaInput = document.getElementById('confirmar-senha');
        
        novaSenhaInput.addEventListener('input', validarSenha);
        
        formAlterarSenha.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const senhaAtual = document.getElementById('senha-atual').value;
            const novaSenha = novaSenhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
            
            // Verificar senha atual (simulação)
            if (senhaAtual !== 'unipam@123!') {
                exibirMensagem('Senha atual incorreta', 'error');
                return;
            }
            
            // Verificar se as senhas coincidem
            if (novaSenha !== confirmarSenha) {
                exibirMensagem('As senhas não coincidem', 'error');
                return;
            }
            
            // Verificar requisitos de senha
            if (!validarRequisitos(novaSenha)) {
                exibirMensagem('A nova senha não atende aos requisitos de segurança', 'error');
                return;
            }
            
            // Atualizar senha (simulação)
            exibirMensagem('Senha alterada com sucesso!', 'success');
            
            // Limpar formulário
            formAlterarSenha.reset();
            limparRequisitos();
        });
    }
    
    if (formEndereco) {
        // Event listener para busca de CEP
        const btnBuscarCep = document.getElementById('btn-buscar-cep');
        
        btnBuscarCep.addEventListener('click', function() {
            const cep = document.getElementById('cep').value.replace(/\D/g, '');
            
            if (cep.length !== 8) {
                exibirMensagem('CEP inválido', 'error');
                return;
            }
            
            // Simulação de busca de CEP
            setTimeout(() => {
                // Dados fictícios para simulação
                const enderecosSimulados = {
                    '38400000': {
                        rua: 'Avenida Brasil',
                        bairro: 'Centro',
                        cidade: 'Uberlândia',
                        estado: 'MG'
                    },
                    '01000000': {
                        rua: 'Avenida Paulista',
                        bairro: 'Bela Vista',
                        cidade: 'São Paulo',
                        estado: 'SP'
                    }
                };
                
                const endereco = enderecosSimulados[cep] || {
                    rua: 'Rua Exemplo',
                    bairro: 'Bairro Exemplo',
                    cidade: 'Cidade Exemplo',
                    estado: 'MG'
                };
                
                document.getElementById('rua').value = endereco.rua;
                document.getElementById('bairro').value = endereco.bairro;
                document.getElementById('cidade').value = endereco.cidade;
                document.getElementById('estado').value = endereco.estado;
                
                // Focar no campo número
                document.getElementById('numero').focus();
            }, 1000);
        });
        
        formEndereco.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Atualizar dados de endereço
            perfilData.endereco = {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('rua').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            };
            
            // Salvar dados
            salvarPerfil();
            
            // Exibir mensagem de sucesso
            exibirMensagem('Endereço atualizado com sucesso!', 'success');
        });
    }
    
    if (formPreferencias) {
        formPreferencias.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Atualizar preferências
            perfilData.preferencias = {
                notificacoes: document.getElementById('notificacoes').checked,
                newsletter: document.getElementById('newsletter').checked,
                compartilharDados: document.getElementById('compartilhar-dados').checked
            };
            
            // Atualizar interesses
            const interesses = document.querySelectorAll('input[name="interesses"]:checked');
            perfilData.interesses = Array.from(interesses).map(interesse => interesse.value);
            
            // Salvar dados
            salvarPerfil();
            
            // Exibir mensagem de sucesso
            exibirMensagem('Preferências atualizadas com sucesso!', 'success');
        });
    }
    
    // Event listeners para botões de mostrar/ocultar senha
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
    
    // Funções
    function ativarTab(tabId) {
        // Remover classe active de todos os itens do menu
        menuItems.forEach(item => item.classList.remove('active'));
        
        // Adicionar classe active ao item do menu correspondente à tab
        const menuItem = document.querySelector(`.perfil-menu-item[data-tab="${tabId}"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
        
        // Esconder todas as tabs
        tabs.forEach(tab => tab.style.display = 'none');
        
        // Mostrar a tab selecionada
        const tab = document.getElementById(`tab-${tabId}`);
        if (tab) {
            tab.style.display = 'block';
        }
    }
    
    function preencherFormularios() {
        // Preencher avatar
        if (perfilData.avatar) {
            avatarPreview.src = perfilData.avatar;
        }
        
        // Preencher dados pessoais
        if (formDadosPessoais) {
            document.getElementById('nome').value = perfilData.nome || '';
            document.getElementById('email').value = perfilData.email || '';
            document.getElementById('cpf').value = perfilData.cpf || '';
            document.getElementById('telefone').value = perfilData.telefone || '';
            document.getElementById('data-nascimento').value = perfilData.dataNascimento || '';
            document.getElementById('genero').value = perfilData.genero || '';
        }
        
        // Preencher endereço
        if (formEndereco && perfilData.endereco) {
            document.getElementById('cep').value = perfilData.endereco.cep || '';
            document.getElementById('rua').value = perfilData.endereco.rua || '';
            document.getElementById('numero').value = perfilData.endereco.numero || '';
            document.getElementById('complemento').value = perfilData.endereco.complemento || '';
            document.getElementById('bairro').value = perfilData.endereco.bairro || '';
            document.getElementById('cidade').value = perfilData.endereco.cidade || '';
            document.getElementById('estado').value = perfilData.endereco.estado || '';
        }
        
        // Preencher preferências
        if (formPreferencias && perfilData.preferencias) {
            document.getElementById('notificacoes').checked = perfilData.preferencias.notificacoes || false;
            document.getElementById('newsletter').checked = perfilData.preferencias.newsletter || false;
            document.getElementById('compartilhar-dados').checked = perfilData.preferencias.compartilharDados || false;
            
            // Preencher interesses
            if (perfilData.interesses) {
                perfilData.interesses.forEach(interesse => {
                    const checkbox = document.querySelector(`input[name="interesses"][value="${interesse}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }
    }
    
    function salvarPerfil() {
        localStorage.setItem('perfilData', JSON.stringify(perfilData));
    }
    
    function validarSenha() {
        const senha = this.value;
        
        // Verificar requisitos de senha
        const requisitos = {
            minimo: senha.length >= 6,
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            numero: /[0-9]/.test(senha),
            especial: /[^A-Za-z0-9]/.test(senha)
        };
        
        // Atualizar indicadores visuais
        document.getElementById('req-minimo').classList.toggle('atendido', requisitos.minimo);
        document.getElementById('req-maiuscula').classList.toggle('atendido', requisitos.maiuscula);
        document.getElementById('req-minuscula').classList.toggle('atendido', requisitos.minuscula);
        document.getElementById('req-numero').classList.toggle('atendido', requisitos.numero);
        document.getElementById('req-especial').classList.toggle('atendido', requisitos.especial);
        
        // Verificar confirmação de senha
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        
        if (confirmarSenha) {
            const coincide = senha === confirmarSenha;
            document.getElementById('req-coincide').classList.toggle('atendido', coincide);
        }
        
        // Calcular força da senha
        let forca = 0;
        Object.values(requisitos).forEach(req => {
            if (req) forca++;
        });
        
        const forcaSenha = document.getElementById('forca-senha');
        const forcaTexto = document.getElementById('forca-texto');
        
        // Atualizar barra de força
        forcaSenha.value = forca;
        
        // Atualizar texto de força
        switch (forca) {
            case 0:
            case 1:
                forcaTexto.textContent = 'Fraca';
                forcaTexto.className = 'forca-fraca';
                break;
            case 2:
            case 3:
                forcaTexto.textContent = 'Média';
                forcaTexto.className = 'forca-media';
                break;
            case 4:
                forcaTexto.textContent = 'Forte';
                forcaTexto.className = 'forca-forte';
                break;
            case 5:
                forcaTexto.textContent = 'Excelente';
                forcaTexto.className = 'forca-excelente';
                break;
        }
    }
    
    function validarRequisitos(senha) {
        return (
            senha.length >= 6 &&
            /[A-Z]/.test(senha) &&
            /[a-z]/.test(senha) &&
            /[0-9]/.test(senha) &&
            /[^A-Za-z0-9]/.test(senha)
        );
    }
    
    function limparRequisitos() {
        document.querySelectorAll('.requisito').forEach(req => {
            req.classList.remove('atendido');
        });
        
        document.getElementById('forca-senha').value = 0;
        document.getElementById('forca-texto').textContent = '';
        document.getElementById('forca-texto').className = '';
    }
    
    function exibirMensagem(mensagem, tipo) {
        // Remover mensagens anteriores
        const mensagensAnteriores = document.querySelectorAll('.mensagem');
        mensagensAnteriores.forEach(msg => msg.remove());
        
        // Criar elemento de mensagem
        const mensagemElement = document.createElement('div');
        mensagemElement.className = `mensagem mensagem-${tipo}`;
        mensagemElement.innerHTML = `
            <div class="mensagem-conteudo">
                <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${mensagem}</span>
            </div>
        `;
        
        // Adicionar ao DOM
        document.body.appendChild(mensagemElement);
        
        // Remover após alguns segundos
        setTimeout(() => {
            mensagemElement.classList.add('fade-out');
            setTimeout(() => {
                mensagemElement.remove();
            }, 500);
        }, 3000);
    }
    
    // Função para configurar elementos específicos por tipo de usuário
    function configurarPerfilPorTipo(userType) {
        const atletaElements = document.querySelectorAll('.atleta-only');
        const gestorElements = document.querySelectorAll('.gestor-only');
        
        if (userType === 'atleta') {
            // Mostrar elementos apenas para atletas
            atletaElements.forEach(el => el.style.display = 'block');
            // Esconder elementos apenas para gestores
            gestorElements.forEach(el => el.style.display = 'none');
        } else if (userType === 'gestor') {
            // Esconder elementos apenas para atletas
            atletaElements.forEach(el => el.style.display = 'none');
            // Mostrar elementos apenas para gestores
            gestorElements.forEach(el => el.style.display = 'block');
        }
    }
    
    // Função para obter dados padrão do perfil
    function getPerfilPadrao(username, userType, userName) {
        // Dados padrão diferentes para cada tipo de usuário
        if (userType === 'gestor') {
            return {
                nome: userName || 'Administrador',
                email: username,
                cpf: '',
                telefone: '',
                dataNascimento: '',
                genero: '',
                avatar: 'img/avatar-placeholder.jpg',
                endereco: {
                    cep: '',
                    rua: '',
                    numero: '',
                    complemento: '',
                    bairro: '',
                    cidade: '',
                    estado: ''
                },
                preferencias: {
                    notificacoes: true,
                    newsletter: true,
                    compartilharDados: false
                },
                interesses: ['corrida', 'ciclismo', 'natacao'],
                tipoUsuario: 'gestor'
            };
        } else {
            // Perfil padrão para atletas
            return {
                nome: userName || 'Atleta',
                email: username,
                cpf: '123.456.789-00',
                telefone: '(34) 99999-9999',
                dataNascimento: '1990-01-01',
                genero: 'masculino',
                avatar: 'img/avatar-placeholder.jpg',
                endereco: {
                    cep: '38400-000',
                    rua: 'Avenida Brasil',
                    numero: '123',
                    complemento: 'Apto 101',
                    bairro: 'Centro',
                    cidade: 'Uberlândia',
                    estado: 'MG'
                },
                preferencias: {
                    notificacoes: true,
                    newsletter: true,
                    compartilharDados: false
                },
                interesses: ['corrida', 'ciclismo', 'natacao'],
                tipoUsuario: 'atleta'
            };
        }
    }
});
