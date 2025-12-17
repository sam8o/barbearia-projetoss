// Arquivo: dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('agendamentos-list');

    // URL BASE DO BACKEND (Render)
    const API_URL = 'https://barbearia-backend-1s5u.onrender.com';

    // Função para buscar agendamentos do backend
    const fetchAgendamentos = async () => {
        try {
            listContainer.innerHTML = `<p class="loading-message">Carregando agendamentos...</p>`;

            const response = await fetch(`${API_URL}/api/agendamentos`);
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do servidor.');
            }

            const agendamentos = await response.json();
            renderAgendamentos(agendamentos);

        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            listContainer.innerHTML = `
                <p class="loading-message" style="color: #dc3545;">
                    Erro ao carregar agendamentos. Tente recarregar a página.
                </p>`;
        }
    };

    // Função para renderizar os agendamentos na página
    const renderAgendamentos = (agendamentos) => {
        listContainer.innerHTML = '';

        if (!agendamentos || agendamentos.length === 0) {
            listContainer.innerHTML = `<p class="loading-message">Nenhum agendamento encontrado.</p>`;
            return;
        }

        agendamentos.forEach(agendamento => {
            const card = document.createElement('div');
            card.classList.add('agendamento-card-item');

            const agendamentoDate = new Date(
                agendamento.date + 'T' + agendamento.time + ':00'
            );

            const dataFormatada = agendamentoDate.toLocaleDateString('pt-BR');
            const horaFormatada = agendamento.time;

            card.innerHTML = `
                <h3>
                    ${agendamento.name}
                    <span class="status-badge status-${agendamento.status}">
                        ${agendamento.status}
                    </span>
                </h3>

                <div class="info-item">
                    <span class="label">Serviço:</span>
                    <span class="value">${agendamento.service.toUpperCase()}</span>
                </div>

                <div class="info-item">
                    <span class="label">Data/Hora:</span>
                    <span class="value">${dataFormatada} às ${horaFormatada}</span>
                </div>

                <div class="info-item">
                    <span class="label">Telefone:</span>
                    <span class="value">${agendamento.phone}</span>
                </div>

                <div class="info-item">
                    <span class="label">Observação:</span>
                    <span class="value">${agendamento.notes || 'Nenhuma'}</span>
                </div>

                ${agendamento.status === 'Pendente' ? `
                    <div class="card-actions">
                        <button class="action-btn confirm-btn"
                            data-id="${agendamento.id}"
                            data-status="Confirmado">
                            Confirmar
                        </button>

                        <button class="action-btn cancel-btn"
                            data-id="${agendamento.id}"
                            data-status="Cancelado">
                            Cancelar
                        </button>
                    </div>
                ` : ''}
            `;

            listContainer.appendChild(card);
        });

        // Eventos dos botões
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', handleStatusUpdate);
        });
    };

    // Atualizar status do agendamento
    const handleStatusUpdate = async (e) => {
        const id = e.target.dataset.id;
        const status = e.target.dataset.status;

        if (!confirm(`Deseja alterar o status para "${status}"?`)) return;

        try {
            await fetch(`${API_URL}/api/agendamentos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            fetchAgendamentos();

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar o status.');
        }
    };

    // Inicializa
    fetchAgendamentos();
});
