// Gerenciamento de autenticação e menu de administração

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');
    const userType = localStorage.getItem('userType');
    const userName = localStorage.getItem('userName');
    
    // Atualizar o menu de navegação com base no status de login
    atualizarMenu(loggedIn, username, userType, userName);
    
    // Adicionar listener para o botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Verificar permissões baseadas no tipo de usuário
    verificarPermissoes();
});

// Função para atualizar o menu de navegação
function atualizarMenu(loggedIn, username, userType, userName) {
    const nav = document.querySelector('header nav ul');
    
    if (!nav) return;
    
    // Encontrar o item de login/logout
    const loginItem = nav.querySelector('.btn-login')?.parentElement;
    
    if (!loginItem) return;
    
    if (loggedIn) {
        // Substituir o link de login por um dropdown de usuário
        loginItem.innerHTML = `
            <div class="user-dropdown">
                <a href="#" class="user-menu">
                    <i class="fas fa-user-circle"></i>
                    <span>${userName || username}</span>
                    <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-menu">
                    <a href="perfil.html"><i class="fas fa-user"></i> Meu Perfil</a>
                    ${userType === 'atleta' ? 
                      '<a href="minhas-inscricoes.html"><i class="fas fa-list"></i> Minhas Inscrições</a>' : ''}
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Sair</a>
                </div>
            </div>
        `;
        
        // Adicionar menu de administração apenas para gestores
        if (userType === 'gestor') {
            // Adicionar item de menu de administração após o item de contato
            const contatoItem = nav.querySelector('a[href="contato.html"]')?.parentElement;
            
            if (contatoItem) {
                // Criar novo item para o menu de administração
                const adminItem = document.createElement('li');
                adminItem.classList.add('admin-menu');
                adminItem.innerHTML = `
                    <div class="admin-dropdown">
                        <a href="#" class="admin-menu-btn">
                            <i class="fas fa-cog"></i>
                            <span>Administração</span>
                            <i class="fas fa-chevron-down"></i>
                        </a>
                        <div class="dropdown-menu">
                            <a href="admin-eventos.html"><i class="fas fa-calendar-alt"></i> Gerenciar Eventos</a>
                            <a href="admin-novo-evento.html"><i class="fas fa-plus-circle"></i> Novo Evento</a>
                            <a href="admin-inscricoes.html"><i class="fas fa-users"></i> Inscrições</a>
                            <a href="admin-gestores.html"><i class="fas fa-user-shield"></i> Gestores</a>
                        </div>
                    </div>
                `;
                
                // Inserir após o item de contato
                contatoItem.insertAdjacentElement('afterend', adminItem);
            }
        }
        
        // Adicionar listeners para os dropdowns
        setupDropdowns();
    } else {
        // Garantir que o link de login esteja correto
        loginItem.innerHTML = '<a href="login.html" class="btn-login">Login</a>';
        
        // Remover menu de administração se existir
        const adminItem = nav.querySelector('.admin-menu');
        if (adminItem) {
            adminItem.remove();
        }
    }
}

// Configurar comportamento dos dropdowns
function setupDropdowns() {
    // Dropdown do usuário
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        const userMenu = userDropdown.querySelector('.user-menu');
        const dropdownMenu = userDropdown.querySelector('.dropdown-menu');
        
        userMenu.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('active');
        });
    }
    
    // Dropdown de administração
    const adminDropdown = document.querySelector('.admin-dropdown');
    if (adminDropdown) {
        const adminMenu = adminDropdown.querySelector('.admin-menu-btn');
        const dropdownMenu = adminDropdown.querySelector('.dropdown-menu');
        
        adminMenu.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.toggle('active');
        });
    }
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-dropdown') && !e.target.closest('.admin-dropdown')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Função para fazer logout
function logout() {
    // Remover dados de login do localStorage
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('loginTime');
    
    // Redirecionar para a página inicial
    window.location.href = 'index.html';
}

// Função para verificar permissões baseadas no tipo de usuário
function verificarPermissoes() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const userType = localStorage.getItem('userType');
    
    // Verificar se está em uma página de administração
    const isAdminPage = window.location.pathname.includes('admin-');
    
    // Verificar se está na página de perfil ou inscrições
    const isPerfilPage = window.location.pathname.includes('perfil.html');
    const isInscricoesPage = window.location.pathname.includes('minhas-inscricoes.html');
    
    // Redirecionar se não estiver logado e tentar acessar páginas restritas
    if (!loggedIn && (isAdminPage || isPerfilPage || isInscricoesPage)) {
        window.location.href = 'login.html';
        return;
    }
    
    // Redirecionar se for atleta e tentar acessar páginas de administração
    if (loggedIn && userType === 'atleta' && isAdminPage) {
        window.location.href = 'index.html';
        return;
    }
    
    // Esconder elementos baseados no tipo de usuário
    if (loggedIn) {
        const adminElements = document.querySelectorAll('.admin-only');
        const atletaElements = document.querySelectorAll('.atleta-only');
        
        if (userType === 'gestor') {
            // Mostrar elementos apenas para administradores
            adminElements.forEach(el => el.style.display = 'block');
            // Esconder elementos apenas para atletas
            atletaElements.forEach(el => el.style.display = 'none');
        } else {
            // Esconder elementos apenas para administradores
            adminElements.forEach(el => el.style.display = 'none');
            // Mostrar elementos apenas para atletas
            atletaElements.forEach(el => el.style.display = 'block');
        }
    }
}

// Função para verificar se o usuário tem permissão para editar eventos
function podeEditarEventos() {
    const userType = localStorage.getItem('userType');
    return userType === 'gestor';
}

// Função para verificar se o usuário tem permissão para gerenciar gestores
function podeGerenciarGestores() {
    const userType = localStorage.getItem('userType');
    return userType === 'gestor';
}

// Função para verificar se o usuário tem permissão para gerenciar inscrições
function podeGerenciarInscricoes() {
    const userType = localStorage.getItem('userType');
    return userType === 'gestor';
}

// Função para verificar se o usuário tem permissão para se inscrever em eventos
function podeInscreverEmEventos() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    return loggedIn; // Qualquer usuário logado pode se inscrever
}

// Função para verificar se o usuário tem permissão para editar seu próprio perfil
function podeEditarPerfil(perfilId) {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    // Usuário só pode editar seu próprio perfil
    return loggedIn && perfilId === username;
}
