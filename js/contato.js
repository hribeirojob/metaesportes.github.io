document.addEventListener('DOMContentLoaded', function() {
    const formularioContato = document.getElementById('formulario-contato');
    
    if (formularioContato) {
        formularioContato.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Limpar mensagens de erro anteriores
            limparErros();
            
            // Validar formulário
            if (validarFormulario()) {
                // Simulação de envio bem-sucedido
                exibirMensagemSucesso();
                formularioContato.reset();
            }
        });
    }
    
    // Função para validar o formulário
    function validarFormulario() {
        let valido = true;
        
        // Validar nome
        const nome = document.getElementById('nome');
        if (!nome.value.trim()) {
            exibirErro(nome, 'Por favor, informe seu nome completo');
            valido = false;
        }
        
        // Validar email
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            exibirErro(email, 'Por favor, informe seu e-mail');
            valido = false;
        } else if (!validarEmail(email.value)) {
            exibirErro(email, 'Por favor, informe um e-mail válido');
            valido = false;
        }
        
        // Validar telefone (opcional, mas se preenchido deve ser válido)
        const telefone = document.getElementById('telefone');
        if (telefone.value.trim() && !validarTelefone(telefone.value)) {
            exibirErro(telefone, 'Por favor, informe um telefone válido');
            valido = false;
        }
        
        // Validar assunto
        const assunto = document.getElementById('assunto');
        if (!assunto.value) {
            exibirErro(assunto, 'Por favor, selecione um assunto');
            valido = false;
        }
        
        // Validar mensagem
        const mensagem = document.getElementById('mensagem');
        if (!mensagem.value.trim()) {
            exibirErro(mensagem, 'Por favor, escreva sua mensagem');
            valido = false;
        } else if (mensagem.value.trim().length < 10) {
            exibirErro(mensagem, 'Sua mensagem deve ter pelo menos 10 caracteres');
            valido = false;
        }
        
        return valido;
    }
    
    // Função para exibir erro
    function exibirErro(elemento, mensagem) {
        // Remover erro anterior se existir
        const erroExistente = elemento.parentElement.querySelector('.form-error');
        if (erroExistente) {
            erroExistente.remove();
        }
        
        // Criar e adicionar mensagem de erro
        const erro = document.createElement('div');
        erro.className = 'form-error';
        erro.textContent = mensagem;
        
        elemento.parentElement.appendChild(erro);
        elemento.classList.add('input-error');
    }
    
    // Função para limpar erros
    function limparErros() {
        const erros = document.querySelectorAll('.form-error');
        erros.forEach(erro => erro.remove());
        
        const inputsComErro = document.querySelectorAll('.input-error');
        inputsComErro.forEach(input => input.classList.remove('input-error'));
    }
    
    // Função para exibir mensagem de sucesso
    function exibirMensagemSucesso() {
        // Remover mensagem anterior se existir
        const sucessoExistente = document.querySelector('.form-success');
        if (sucessoExistente) {
            sucessoExistente.remove();
        }
        
        // Criar e adicionar mensagem de sucesso
        const sucesso = document.createElement('div');
        sucesso.className = 'form-success';
        sucesso.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        sucesso.style.display = 'block';
        
        formularioContato.insertAdjacentElement('beforebegin', sucesso);
        
        // Esconder a mensagem após 5 segundos
        setTimeout(() => {
            sucesso.style.display = 'none';
        }, 5000);
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
    const inputTelefone = document.getElementById('telefone');
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
});
