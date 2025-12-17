document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('agendamentos-list');
    const API_URL = 'https://barbearia-backend-1s5u.onrender.com';

    async function fetchAgendamentos() {
        try {
            listContainer.innerHTML = `<p class="loading-message">Carregando agendamentos...</p>`;

            const response = await fetch(`${API_URL}/api/agendamentos`);
            if (!response.ok) throw new Error('Erro ao buscar');

            const agendamentos = await response.json();
            renderAgendamentos(agendamentos);

        } catch (error) {
            console.error(error);
            listContainer.innerHTML = `
                <p class="loading-message" style="color:red;">
                    Erro ao carregar agendamentos. Tente recarregar a página.
                </p>`;
        }
    }

    function renderAgendamentos(agendamentos) {
        listContainer.innerHTML = '';

        if (!agendamentos || agendamentos.length === 0) {
            listContainer.innerHTML = `<p class="loading-message">Nenhum agendamento encontrado.</p>`;
            return;
        }

        agendamentos.forEach(ag => {
            const card = document.createElement('div');
            card.classList.add('agendamento-card-item');

            const dataFormatada = new Date(
                `${ag.date}T${ag.time}:00`
            ).toLocaleDateString('pt-BR');

            card.innerHTML = `
                <h3>
                    ${ag.name}
                    <span class="status-badge status-${ag.status}">
                        ${ag.status}
                    </span>
                </h3>

                <p><strong>Serviço:</strong> ${ag.service}</p>
                <p><strong>Data:</strong> ${dataFormatada} às ${ag.time}</p>
                <p><strong>Telefone:</strong> ${ag.phone}</p>
                <p><strong>Obs:</strong> ${ag.notes || 'Nenhuma'}</p>

                ${ag.status === 'Pendente' ? `
                    <div class="card-actions">
                        <button data-id="${ag.id}" data-status="Confirmado">Confirmar</button>
                        <button data-id="${ag.id}" data-status="Cancelado">Cancelar</button>
                    </div>
                ` : ''}
            `;

            listContainer.appendChild(card);
        });

        document.querySelectorAll('.card-actions button')
            .forEach(btn => btn.addEventListener('click', updateStatus));
    }

    async function updateStatus(e) {
        const id = e.target.dataset.id;
        const status = e.target.dataset.status;

        if (!confirm(`Alterar status para ${status}?`)) return;

        await fetch(`${API_URL}/api/agendamentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        fetchAgendamentos();
    }

    fetchAgendamentos();
});
