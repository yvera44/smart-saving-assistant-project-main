// Login logic
const LOGIN_SESSION_KEY = 'pp_session';
const VALID_USERNAME = 'user';
const VALID_PASSWORD = 'password123';

function checkSession() {
    return localStorage.getItem(LOGIN_SESSION_KEY) === 'active';
}

function initLogin() {
    const screen = document.getElementById('login-screen');
    if (!screen) return;

    if (checkSession()) {
        screen.style.display = 'none';
        return;
    }

    const button = document.getElementById('login-button');
    const errorEl = document.getElementById('login-error');

    button.addEventListener('click', () => {
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;

        if (user === VALID_USERNAME && pass === VALID_PASSWORD) {
            localStorage.setItem(LOGIN_SESSION_KEY, 'active');
            screen.style.display = 'none';
        } else {
            errorEl.style.display = 'block';
        }
    });
}

initLogin();

const balanceElement = document.getElementById('balance');
const savedElement = document.getElementById('saved');
const goalProgressElement = document.getElementById('goal-progress');
const transactionList = document.getElementById('transaction-list');
const insightList = document.getElementById('insight-list');
const aiAdvice = document.getElementById('ai-advice');
const goalAmountElement = document.getElementById('goal-amount');
const goalSavedElement = document.getElementById('goal-saved');
const goalRemainingElement = document.getElementById('goal-remaining');
const goalStatusElement = document.getElementById('goal-status');
const goalListContainer = document.getElementById('goal-list');
const dashboardGoalList = document.getElementById('dashboard-goal-list');
const newGoalNameInput = document.getElementById('new-goal-name');
const newGoalTargetInput = document.getElementById('new-goal-target');
const newGoalSavedInput = document.getElementById('new-goal-saved');
const addGoalButton = document.getElementById('add-goal-button');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const toggle = document.querySelector('.theme-toggle');

const currentBalance = 1280.50;
const storageKey = 'paypalSavingsGoals';
let goals = loadGoals();

const categoryMap = {
    coffee: ['starbucks', 'dunkin', 'coffee', 'brew'],
    streaming: ['netflix', 'spotify', 'hulu', 'prime', 'apple tv', 'hbo', 'disney'],
    retail: ['amazon', 'walmart', 'target', 'store', 'shop', 'marshalls'],
    food: ['mcdonalds', 'burger', 'pizza', 'restaurant', 'eats', 'market'],
    transportation: ['uber', 'lyft', 'taxi', 'bus', 'train', 'metro', 'transit']
};

function loadGoals() {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                return parsed;
            }
        } catch (err) {
            console.error('Failed to parse saved goals', err);
        }
    }
    return [{
        id: 'goal-1',
        name: 'Vacation',
        target: 2000,
        saved: 420
    }];
}

function saveGoals() {
    window.localStorage.setItem(storageKey, JSON.stringify(goals));
}

function formatMoney(value) {
    return `$${Number(value).toFixed(2)}`;
}

function updateSummaryCards() {
    const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target || 0), 0);
    const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.saved || 0), 0);
    const remaining = Math.max(0, totalTarget - totalSaved);
    const goalPercent = totalTarget ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    balanceElement.textContent = formatMoney(currentBalance);
    savedElement.textContent = formatMoney(totalSaved);
    goalProgressElement.textContent = `${goalPercent}%`;
    goalAmountElement.textContent = formatMoney(totalTarget);
    goalSavedElement.textContent = formatMoney(totalSaved);
    goalRemainingElement.textContent = formatMoney(remaining);
    goalStatusElement.textContent = totalTarget
        ? `You are ${goalPercent}% of the way to your goals. ${remaining > 0 ? `You still need ${formatMoney(remaining)}.` : 'All goals complete!'}`
        : 'Add a goal to start tracking your savings.';
}

function updateGoal(goalId, changes) {
    const goal = goals.find(entry => entry.id === goalId);
    if (!goal) return;
    Object.assign(goal, changes);
    saveGoals();
    updateSummaryCards();
    renderDashboardGoals();
}

function removeGoal(goalId) {
    goals = goals.filter(goal => goal.id !== goalId);
    saveGoals();
    renderGoals();
    updateSummaryCards();
    renderDashboardGoals();
    updateGoalUIState();
}

function updateGoalUIState() {
    const goalLimitMessage = document.getElementById('goal-limit-message');
    const addGoalButton = document.getElementById('add-goal-button');

    if (goals.length >= 4) {
        // Disable the button and show the warning
        if (addGoalButton) {
            addGoalButton.disabled = true;
            addGoalButton.style.opacity = "0.5";
            addGoalButton.style.cursor = "not-allowed";
        }
        if (goalLimitMessage) goalLimitMessage.style.display = 'block';
    } else {
        // Re-enable everything
        if (addGoalButton) {
            addGoalButton.disabled = false;
            addGoalButton.style.opacity = "1";
            addGoalButton.style.cursor = "pointer";
        }
        if (goalLimitMessage) goalLimitMessage.style.display = 'none';
    }
}

function createGoalItem(goal) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    item.dataset.id = goal.id;
    item.innerHTML = `
        <div class="goal-item-header">
            <input class="goal-name-input" value="${goal.name}" aria-label="Goal name" />
            <button class="delete-goal-button" type="button">Delete</button>
        </div>
        <div class="goal-input-row">
            <label>
                Target
                <input class="goal-target-input" type="number" min="0" value="${goal.target}" />
            </label>
            <label>
                Saved
                <input class="goal-saved-input" type="number" min="0" value="${goal.saved}" />
            </label>
        </div>
        <p class="goal-progress-text">${goal.target ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0}% complete</p>
    `;

    const nameInput = item.querySelector('.goal-name-input');
    const targetInput = item.querySelector('.goal-target-input');
    const savedInput = item.querySelector('.goal-saved-input');
    const deleteButton = item.querySelector('.delete-goal-button');

    nameInput.addEventListener('input', event => {
        updateGoal(goal.id, { name: event.target.value });
    });

    targetInput.addEventListener('input', event => {
        updateGoal(goal.id, { target: Number(event.target.value) || 0 });
    });

    savedInput.addEventListener('input', event => {
        updateGoal(goal.id, { saved: Number(event.target.value) || 0 });
    });

    deleteButton.addEventListener('click', () => {
        removeGoal(goal.id);
    });

    return item;
}

function renderGoals() {
    goalListContainer.innerHTML = '';
    if (!goals.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'goal-empty';
        emptyState.textContent = 'No goals yet. Add one to get started.';
        goalListContainer.appendChild(emptyState);
        return;
    }

    goals.forEach(goal => goalListContainer.appendChild(createGoalItem(goal)));
}

function renderDashboardGoals() {
    dashboardGoalList.innerHTML = '';
    if (!goals.length) {
        const message = document.createElement('p');
        message.className = 'goal-empty';
        message.textContent = 'No active goals yet. Create one on the Goal tab.';
        dashboardGoalList.appendChild(message);

        return;
    
    }

    goals.forEach(goal => {
        const progress = goal.target ? Math.min(100, Math.round((goal.saved / goal.target) * 100)) : 0;
        const remaining = Math.max(0, Number(goal.target || 0) - Number(goal.saved || 0));
        const goalCard = document.createElement('div');
        goalCard.className = 'dashboard-goal-card';
        goalCard.innerHTML = `
            <div class="dashboard-goal-title">${goal.name}</div>
            <div class="dashboard-goal-details">
                <span>Target: ${formatMoney(goal.target)}</span>
                <span>Saved: ${formatMoney(goal.saved)}</span>
                <span>Remaining: ${formatMoney(remaining)}</span>
            </div>
            <div class="dashboard-goal-progress">${progress}% complete</div>
        `;
        dashboardGoalList.appendChild(goalCard);
    });
}

addGoalButton.addEventListener('click', () => {
    if (goals.length >= 4) {
        return; 
    }

    const name = newGoalNameInput.value.trim() || 'New goal';
    const target = Number(newGoalTargetInput.value) || 0;
    const saved = Number(newGoalSavedInput.value) || 0;
    const id = `goal-${Date.now()}`;

    goals.push({ id, name, target, saved });

    saveGoals();
    renderGoals();
    renderDashboardGoals();
    updateSummaryCards();
    updateGoalUIState();

    newGoalNameInput.value = '';
    newGoalTargetInput.value = '2000';
    newGoalSavedInput.value = '0';
});

function categorize(name) {
    const lowered = name.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(keyword => lowered.includes(keyword))) {
            return category;
        }
    }
    return 'other';
}

function categoryLabel(key) {
    return key === 'coffee' ? 'Coffee & Snacks'
        : key === 'streaming' ? 'Streaming'
        : key === 'retail' ? 'Retail'
        : key === 'food' ? 'Dining'
        : key === 'transportation' ? 'Transportation'
        : 'Other';
}

fetch('/api/transactions')
    .then(response => response.json())
    .then(transactions => {
        const totals = {};
        let totalSpent = 0;

        transactions.forEach(transaction => {
            const category = categorize(transaction.name);
            totals[category] = (totals[category] || 0) + transaction.amount;
            totalSpent += transaction.amount;

            const li = document.createElement('li');
            li.textContent = `${transaction.date} · ${transaction.name} — $${transaction.amount.toFixed(2)}`;
            transactionList.appendChild(li);
        });

        Object.entries(totals)
            .sort((a, b) => b[1] - a[1])
            .forEach(([category, amount]) => {
                const insight = document.createElement('li');
                insight.textContent = `${categoryLabel(category)}: $${amount.toFixed(2)}`;
                insightList.appendChild(insight);
            });

        const topCategory = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
        const topCategoryLabel = topCategory ? categoryLabel(topCategory[0]) : 'Other';
        const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target || 0), 0);
        const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.saved || 0), 0);
        const goalPercent = totalTarget ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

        updateSummaryCards();
        renderDashboardGoals();

        const lines = [
            `You spent $${totalSpent.toFixed(2)} across ${transactions.length} recent transactions.`,
            `Most spending is currently in ${topCategoryLabel}.`,
            `You are ${goalPercent}% of the way to your savings goals.`
        ];

        if (totalSpent > 65) {
            lines.push('Smart nudge: consider trimming one subscription or dining out purchase this week.');
        } else {
            lines.push('Great job staying on track — keep the momentum going toward your savings goals.');
        }

        aiAdvice.textContent = lines.join(' ');
    })
    .catch(() => {
        aiAdvice.textContent = 'Unable to load transaction data. Please refresh the page.';
    });

function openTab(tabId) {
    tabButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.tab === tabId);
    });

    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => openTab(button.dataset.tab));
});

renderGoals();
renderDashboardGoals();
updateSummaryCards();

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Initialize theme from storage
const currentTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const activeTheme = root.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    themeToggle.textContent = newTheme === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode';
});
