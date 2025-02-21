let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let history = JSON.parse(localStorage.getItem('expenseHistory')) || [];
let editIndex = -1;
let chart;

function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('expenseHistory', JSON.stringify(history));
}

function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const errorMsg = document.getElementById('errorMsg');

    if (!amount || !category || !date || !description) {
        errorMsg.style.display = 'block';
        setTimeout(() => errorMsg.style.display = 'none', 2000);
        return;
    }

    const expense = { amount, category, date, description };

    if (editIndex === -1) {
        expenses.push(expense);
        history.push(expense);
    } else {
        expenses[editIndex] = expense;
        editIndex = -1;
        document.getElementById('addBtn').textContent = 'Add Expense ➕';
    }

    updateLocalStorage();
    renderExpenses();
    renderChart();
    clearInputs();
}

function renderExpenses() {
    const tbody = document.getElementById('expenseList');
    tbody.innerHTML = '';
    
    expenses.forEach((expense, index) => {
        const row = `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editExpense(${index})"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteExpense(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    updateTotal();
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    document.getElementById('description').value = expense.description;
    editIndex = index;
    document.getElementById('addBtn').textContent = 'Update Expense ✏️';
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateLocalStorage();
    renderExpenses();
    renderChart();
}

function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
}

function clearInputs() {
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
}

function renderChart() {
    const categories = [...new Set(expenses.map(e => e.category))];
    const data = categories.map(cat => 
        expenses.filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0)
    );

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById('chart'), {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d', '#ffa502']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Expense Distribution' }
            }
        }
    });
}

document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    btn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

renderExpenses();
renderChart();