document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const successMessage = document.getElementById('success-message');
    
    // Máscara para telefone (A correção que fizemos)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); 
            let formattedValue = '';
            
            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 2); 
            }
            if (value.length > 2) {
                formattedValue += ') ' + value.substring(2, 7); 
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 11); 
            }
            
            e.target.value = formattedValue.substring(0, 15);
        });
    }

    // Função de SUBMISSÃO REAL
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Impede o envio padrão

        // Coleta todos os dados do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Envia os dados para a rota do Node.js (/api/agendar)
            const response = await fetch("https://barbearia-backend-1s5u.onrender.com/api/agendar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // Se o servidor retornar erro
                throw new Error('Erro ao salvar o agendamento no servidor.');
            }

            // Se for bem-sucedido, esconde o formulário e mostra a mensagem
            form.classList.add('hidden'); 
            successMessage.classList.remove('hidden');
            
            console.log("Agendamento enviado com sucesso para o servidor!");

        } catch (error) {
            console.error("Erro ao agendar:", error);
            alert("Não foi possível agendar. Verifique se o servidor Node.js está rodando (node server.js).");
        }
    });
});