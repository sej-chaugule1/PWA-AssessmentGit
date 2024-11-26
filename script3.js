document.addEventListener("DOMContentLoaded", () => {
    const logsContainer = document.getElementById("logs-container");
    const logs = JSON.parse(localStorage.getItem("logs")) || [];

    logsContainer.innerHTML = ""; // Clear existing logs

    logs.forEach((log, index) => {
        const logDiv = document.createElement("div");
        logDiv.className = "log";

        // Render log details
        logDiv.innerHTML = `
            <p><strong>${log.date}</strong></p>
            <hr />
            <p>${log.expensesDetails.join("<br>")}</p>
            <p class="budget-info">Budget: $${log.budget.toFixed(2)} | Total: $${log.totalSpending.toFixed(2)}</p>
            <button class="delete-btn" onclick="deleteLog(${index})">Delete</button>
        `;
        logsContainer.appendChild(logDiv);
    });
});

function deleteLog(index) {
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.splice(index, 1); // Remove the selected log
    localStorage.setItem("logs", JSON.stringify(logs)); // Update storage
    window.location.reload(); // Reload the page to reflect changes
}