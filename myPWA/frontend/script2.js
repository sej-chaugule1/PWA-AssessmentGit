function total() {
    const expenseInputs = document.querySelectorAll('.expense-amount');
    let total = 0;

    expenseInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            total += value;
        }
    });

    document.getElementById('total-spending').innerText = `$${total.toFixed(2)}`;
}

function enableAmount(selectElement) {
    // Get the corresponding expense amount input field
    const expenseInput = selectElement.parentElement.querySelector('.expense-amount');
    
    // Enable the input if a category is selected, otherwise keep it disabled
    if (selectElement.value) {
        expenseInput.disabled = false; // Enable the input field
    } else {
        expenseInput.disabled = true;  // Disable the input field
        expenseInput.value = '';       // Clear any previously entered value
    }
}
// This must stay

async function enableAmount(selectElement) {
    const expenseInput = selectElement.parentElement.querySelector('.expense-amount');
    if (selectElement.value) {
        expenseInput.disabled = false;
    } else {
        expenseInput.disabled = true;
        expenseInput.value = '';
    }
}

async function SubmitLog() {
    const date = document.getElementById('dateInput').value;
    const categories = document.querySelectorAll('.expensecategory');
    const amounts = document.querySelectorAll('.expense-amount');

    if (!date) {
        alert('Please select a date.');
        return;
    }

    const logs = [];
    let hasError = false;

    categories.forEach((category, index) => {
        const amount = amounts[index];
        const amountValue = parseFloat(amount.value);

        if (!category.value || !amount.value) {
            return; // Skip empty category or amount
        }

        if (isNaN(amountValue) || amountValue < 0) {
            alert(`Invalid input detected for category "${category.value || 'Unknown'}". Please enter a positive number.`);
            hasError = true;
            return;
        }

        logs.push({
            Category: category.value,
            Amount: amountValue,
            Date: date,
        });
    });

    if (hasError) {
        return;
    }

    if (logs.length === 0) {
        alert('Please enter at least one valid expense.');
        return;
    }

    try {
        // Send logs to the backend
        for (const log of logs) {
            await fetch('http://localhost:3000/Expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(log),
            });
        }

        alert('Logs submitted successfully!');
        window.location.href = 'entries.html';
    } catch (error) {
        console.error('Error submitting logs:', error);
        alert('Failed to submit logs. Please try again.');
    }
}

async function fetchLogs() {
    try {
        const response = await fetch('http://localhost:3000/Expense');
        const logs = await response.json();
        renderLogs(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        alert('Failed to fetch logs.');
    }
}

function renderLogs(logs) {
    const logContainer = document.getElementById('log-container');
    logContainer.innerHTML = '';

    const groupedLogs = logs.reduce((acc, log) => {
        acc[log.Date] = acc[log.Date] || [];
        acc[log.Date].push(log);
        return acc;
    }, {});

    for (const date in groupedLogs) {
        const dateLogs = groupedLogs[date];
        const totalSpending = dateLogs.reduce((sum, log) => sum + parseFloat(log.Amount), 0);

        const dateContainer = document.createElement('div');
        dateContainer.classList.add('date-container');
        dateContainer.innerHTML = `<h2>Date: ${date}</h2>`;

        const totalDiv = document.createElement('div');
        totalDiv.classList.add('total-spending');
        totalDiv.innerHTML = `<p>Total Spending: $${totalSpending.toFixed(2)}</p>`;
        dateContainer.appendChild(totalDiv);

        dateLogs.forEach((log, index) => {
            const logDiv = document.createElement('div');
            logDiv.classList.add('log-entry');
            logDiv.innerHTML = `
                <div class="log">
                    <p>Category: ${log.Category}</p>
                    <p>Amount: $${parseFloat(log.Amount).toFixed(2)}</p>
                    <button onclick="deleteLog(${log.id})">Delete</button>
                    <button onclick="editLog(${log.id})">Edit</button>
                </div>
            `;
            dateContainer.appendChild(logDiv);
        });

        logContainer.appendChild(dateContainer);
    }
}

async function deleteLog(id) {
    if (confirm('Are you sure you want to delete this log?')) {
        try {
            await fetch(`http://localhost:3000/Expense/${id}`, {
                method: 'DELETE',
            });
            alert('Log deleted successfully!');
            fetchLogs();
        } catch (error) {
            console.error('Error deleting log:', error);
            alert('Failed to delete log.');
        }
    }
}

async function editLog(id) {
    const logs = await fetch(`http://localhost:3000/Expense/${id}`).then((res) => res.json());

    const logContainer = document.querySelector(`.log-entry[data-id="${id}"]`);
    if (!logContainer) return;

    logContainer.innerHTML = `
        <form id="editLogForm" onsubmit="saveLog(event, ${id})" style="display: flex; flex-direction: column; gap: 5px;">
            <label for="editCategory">Category:</label>
            <select id="editCategory" required>
                <option value="Groceries" ${logs.Category === 'Groceries' ? 'selected' : ''}>Groceries</option>
                <option value="Transportation" ${logs.Category === 'Transportation' ? 'selected' : ''}>Transportation</option>
                <option value="Entertainment" ${logs.Category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                <option value="Utilities" ${logs.Category === 'Utilities' ? 'selected' : ''}>Utilities</option>
                <option value="Healthcare" ${logs.Category === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
            </select>
            <label for="editAmount">Amount:</label>
            <input type="number" id="editAmount" value="${logs.Amount}" required />
            <label for="editDate">Date:</label>
            <input type="date" id="editDate" value="${logs.Date}" required />
            <button type="submit">Save</button>
            <button type="button" onclick="cancelEdit()">Cancel</button>
        </form>
    `;
}

async function saveLog(event, id) {
    event.preventDefault();

    const editedCategory = document.getElementById('editCategory').value;
    const editedAmount = parseFloat(document.getElementById('editAmount').value).toFixed(2);
    const editedDate = document.getElementById('editDate').value;

    try {
        await fetch(`http://localhost:3000/Expense/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Category: editedCategory,
                Amount: editedAmount,
                Date: editedDate,
            }),
        });
        alert('Log updated successfully!');
        fetchLogs();
    } catch (error) {
        console.error('Error updating log:', error);
        alert('Failed to update log.');
    }
}

function cancelEdit() {
    fetchLogs();
}

window.onload = fetchLogs;

