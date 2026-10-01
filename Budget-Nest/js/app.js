// ==========================================
// BudgetNest Personal Finance App
// ==========================================


// ==========================================
// DEFAULT DATA
// ==========================================

const defaultTransactions = [
    {
        id: 1,
        name: "Monthly Allowance",
        amount: 15000,
        type: "income",
        date: "Today"
    },

    {
        id: 2,
        name: "Groceries",
        amount: 1200,
        type: "expense",
        date: "Yesterday"
    },

    {
        id: 3,
        name: "Transportation",
        amount: 500,
        type: "expense",
        date: "Yesterday"
    },

    {
        id: 4,
        name: "Freelance Work",
        amount: 5000,
        type: "income",
        date: "3 days ago"
    }
];


// ==========================================
// LOAD DATA
// ==========================================

let transactions =
    JSON.parse(localStorage.getItem("budgetNestTransactions"))
    || defaultTransactions;


let monthlyBudget =
    Number(localStorage.getItem("budgetNestBudget"))
    || 20000;


let userProfile =
    JSON.parse(localStorage.getItem("budgetNestProfile"))
    || {
        name: "BudgetNest User",
        email: "user@example.com"
    };


// ==========================================
// SAVE DATA
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        "budgetNestTransactions",
        JSON.stringify(transactions)
    );

}


function saveBudget() {

    localStorage.setItem(
        "budgetNestBudget",
        monthlyBudget
    );

}


function saveProfile() {

    localStorage.setItem(
        "budgetNestProfile",
        JSON.stringify(userProfile)
    );

}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount) {

    return "₱" + Number(amount).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ==========================================
// CALCULATE TOTALS
// ==========================================

function calculateTotals() {

    let income = 0;
    let expenses = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        } else {

            expenses += Number(transaction.amount);

        }

    });


    return {
        income: income,
        expenses: expenses,
        balance: income - expenses,
        savings: income - expenses
    };

}


// ==========================================
// DISPLAY DASHBOARD
// ==========================================

function displayDashboard() {

    const balanceElement =
        document.getElementById("totalBalance");


    const incomeElement =
        document.getElementById("totalIncome");


    const expensesElement =
        document.getElementById("totalExpenses");


    const savingsElement =
        document.getElementById("totalSavings");


    if (!balanceElement) {
        return;
    }


    const totals = calculateTotals();


    balanceElement.textContent =
        formatMoney(totals.balance);


    incomeElement.textContent =
        formatMoney(totals.income);


    expensesElement.textContent =
        formatMoney(totals.expenses);


    savingsElement.textContent =
        formatMoney(totals.savings);


    displayRecentTransactions();


    updateBudgetProgress();

}


// ==========================================
// DISPLAY RECENT TRANSACTIONS
// ==========================================

function displayRecentTransactions() {

    const container =
        document.getElementById("recentTransactions");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const recentTransactions =
        transactions.slice(-5).reverse();


    if (recentTransactions.length === 0) {

        container.innerHTML =
            "<p>No transactions yet.</p>";

        return;

    }


    recentTransactions.forEach(function(transaction) {

        const item =
            document.createElement("div");


        item.className =
            "transaction-item";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const icon =
            transaction.type === "income"
                ? "📈"
                : "🛍️";


        item.innerHTML = `
            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div>
                    <div class="transaction-name">
                        ${transaction.name}
                    </div>

                    <div class="transaction-date">
                        ${transaction.date}
                    </div>
                </div>

            </div>

            <div class="transaction-amount ${transaction.type}">
                ${sign}${formatMoney(transaction.amount)}
            </div>
        `;


        container.appendChild(item);

    });

}


// ==========================================
// DISPLAY ALL TRANSACTIONS
// ==========================================

function displayTransactions() {

    const container =
        document.getElementById("transactionList");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (transactions.length === 0) {

        container.innerHTML =
            "<p>No transactions recorded.</p>";

        return;

    }


    transactions.slice().reverse().forEach(function(transaction) {

        const item =
            document.createElement("div");


        item.className =
            "transaction-item";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const icon =
            transaction.type === "income"
                ? "📈"
                : "🛍️";


        item.innerHTML = `
            <div class="transaction-left">

                <div class="transaction-icon">
                    ${icon}
                </div>

                <div>
                    <div class="transaction-name">
                        ${transaction.name}
                    </div>

                    <div class="transaction-date">
                        ${transaction.date}
                    </div>
                </div>

            </div>

            <div>

                <span class="transaction-amount ${transaction.type}">
                    ${sign}${formatMoney(transaction.amount)}
                </span>

                <button
                    class="delete-button"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    ✕
                </button>

            </div>
        `;


        container.appendChild(item);

    });

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

    transactions =
        transactions.filter(function(transaction) {

            return transaction.id !== id;

        });


    saveTransactions();

    displayTransactions();

    displayDashboard();

}


// ==========================================
// ADD TRANSACTION
// ==========================================

const transactionForm =
    document.getElementById("transactionForm");


if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "transactionName"
                ).value;


            const amount =
                Number(
                    document.getElementById(
                        "transactionAmount"
                    ).value
                );


            const type =
                document.getElementById(
                    "transactionType"
                ).value;


            const newTransaction = {

                id: Date.now(),

                name: name,

                amount: amount,

                type: type,

                date: "Just now"

            };


            transactions.push(
                newTransaction
            );


            saveTransactions();


            transactionForm.reset();


            const message =
                document.getElementById(
                    "transactionMessage"
                );


            message.textContent =
                "✓ Transaction added successfully!";


            displayTransactions();

            displayDashboard();

        }
    );

}


// ==========================================
// BUDGET
// ==========================================

function updateBudgetProgress() {

    const progress =
        document.getElementById(
            "budgetProgress"
        );


    const budgetAmount =
        document.getElementById(
            "budgetAmount"
        );


    const budgetText =
        document.getElementById(
            "budgetText"
        );


    const pageProgress =
        document.getElementById(
            "budgetPageProgress"
        );


    const currentBudget =
        document.getElementById(
            "currentBudget"
        );


    const remainingBudget =
        document.getElementById(
            "remainingBudget"
        );


    const totals =
        calculateTotals();


    const percentage =
        monthlyBudget > 0
            ? Math.min(
                (totals.expenses / monthlyBudget) * 100,
                100
            )
            : 0;


    if (progress) {

        progress.style.width =
            percentage + "%";

    }


    if (pageProgress) {

        pageProgress.style.width =
            percentage + "%";

    }


    if (budgetAmount) {

        budgetAmount.textContent =
            `${formatMoney(totals.expenses)} / ${formatMoney(monthlyBudget)}`;

    }


    if (budgetText) {

        if (percentage >= 100) {

            budgetText.textContent =
                "⚠️ You have reached your budget.";

        } else if (percentage >= 80) {

            budgetText.textContent =
                "⚠️ You're getting close to your budget.";

        } else {

            budgetText.textContent =
                "✓ You're doing great! Keep it up.";

        }

    }


    if (currentBudget) {

        currentBudget.textContent =
            formatMoney(monthlyBudget);

    }


    if (remainingBudget) {

        const remaining =
            Math.max(
                monthlyBudget - totals.expenses,
                0
            );


        remainingBudget.textContent =
            `${formatMoney(remaining)} remaining`;

    }

}


// ==========================================
// BUDGET FORM
// ==========================================

const budgetForm =
    document.getElementById("budgetForm");


if (budgetForm) {

    const budgetInput =
        document.getElementById("budgetInput");


    budgetInput.value =
        monthlyBudget;


    budgetForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            monthlyBudget =
                Number(budgetInput.value);


            saveBudget();

            updateBudgetProgress();


            const message =
                document.getElementById(
                    "budgetMessage"
                );


            message.textContent =
                "✓ Budget saved successfully!";

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            localStorage.setItem(
                "budgetNestLoggedIn",
                "true"
            );


            userProfile.email = email;

            saveProfile();


            message.textContent =
                "✓ Login successful! Redirecting...";


            setTimeout(function() {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "budgetNestLoggedIn"
            );


            window.location.href =
                "index.html";

        }
    );

}


// ==========================================
// PROFILE
// ==========================================

function displayProfile() {

    const name =
        document.getElementById(
            "profileName"
        );


    const email =
        document.getElementById(
            "profileEmail"
        );


    const nameInput =
        document.getElementById(
            "profileNameInput"
        );


    const emailInput =
        document.getElementById(
            "profileEmailInput"
        );


    if (!name) {
        return;
    }


    name.textContent =
        userProfile.name;


    email.textContent =
        userProfile.email;


    nameInput.value =
        userProfile.name;


    emailInput.value =
        userProfile.email;

}


const profileForm =
    document.getElementById(
        "profileForm"
    );


if (profileForm) {

    displayProfile();


    profileForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            userProfile.name =
                document.getElementById(
                    "profileNameInput"
                ).value;


            userProfile.email =
                document.getElementById(
                    "profileEmailInput"
                ).value;


            saveProfile();

            displayProfile();


            document.getElementById(
                "profileMessage"
            ).textContent =
                "✓ Profile updated successfully!";

        }
    );

}


// ==========================================
// START APPLICATION
// ==========================================

displayDashboard();

displayTransactions();

updateBudgetProgress();