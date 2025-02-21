let history = JSON.parse(localStorage.getItem('expenseHistory')) || [];

function renderHistory(filteredHistory = history) {
    const tbody = document.getElementById('historyList');
    tbody.innerHTML = '';
    
    filteredHistory.forEach((expense) => {
        const row = `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function filterHistory() {
    const category = document.getElementById('filterCategory').value;
    const date = document.getElementById('filterDate').value;

    let filtered = history.filter(expense => {
        return (!category || expense.category === category) &&
               (!date || expense.date === date);
    });

    renderHistory(filtered);
}

window.addEventListener('load', () => {
    const loader = document.getElementById('historyLoader');
    const table = document.getElementById('historyTable');
    
    setTimeout(() => {
        loader.style.display = 'none';
        table.style.display = 'table';
        renderHistory();
    }, 1000);
});

document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});