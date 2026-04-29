const { container } = require("./db");

const transactions = [
  // 🍔 Food
  { date: "2024-01-10", name: "Starbucks", amount: 5.50, category: "Food" },
  { date: "2024-01-13", name: "McDonald's", amount: 8.75, category: "Food" },
  { date: "2024-02-14", name: "Olive Garden", amount: 65.00, category: "Food" },
  { date: "2024-03-05", name: "Whole Foods", amount: 89.30, category: "Food" },
  { date: "2024-03-20", name: "Starbucks", amount: 7.50, category: "Food" },
  { date: "2024-04-05", name: "Uber Eats", amount: 35.00, category: "Food" },
  { date: "2024-04-18", name: "Dunkin Donuts", amount: 6.25, category: "Food" },
  { date: "2024-02-05", name: "Chipotle", amount: 12.30, category: "Food" },

  // 🎬 Entertainment
  { date: "2024-01-11", name: "Netflix", amount: 15.99, category: "Entertainment" },
  { date: "2024-02-01", name: "Spotify", amount: 9.99, category: "Entertainment" },
  { date: "2024-02-20", name: "Apple", amount: 9.99, category: "Entertainment" },
  { date: "2024-03-15", name: "Hulu", amount: 12.99, category: "Entertainment" },
  { date: "2024-04-15", name: "Disney Plus", amount: 10.99, category: "Entertainment" },

  // 🛍️ Shopping
  { date: "2024-01-12", name: "Amazon", amount: 45.00, category: "Shopping" },
  { date: "2024-02-05", name: "Walmart", amount: 120.50, category: "Shopping" },
  { date: "2024-03-10", name: "Nike", amount: 120.00, category: "Shopping" },
  { date: "2024-04-01", name: "Amazon", amount: 230.00, category: "Shopping" },
  { date: "2024-04-10", name: "Target", amount: 78.50, category: "Shopping" },
  { date: "2024-04-22", name: "Best Buy", amount: 199.99, category: "Shopping" },

  // 🚗 Transport
  { date: "2024-01-14", name: "Uber", amount: 12.30, category: "Transport" },
  { date: "2024-02-10", name: "Lyft", amount: 18.00, category: "Transport" },
  { date: "2024-03-01", name: "Gas Station", amount: 55.00, category: "Transport" },
  { date: "2024-04-08", name: "Uber", amount: 22.50, category: "Transport" },

  // 💪 Health
  { date: "2024-04-20", name: "Gym", amount: 40.00, category: "Health" },
  { date: "2024-03-25", name: "CVS Pharmacy", amount: 28.75, category: "Health" }
];

async function importData() {
  for (const transaction of transactions) {
    await container.items.create({
      id: Date.now().toString() + Math.random().toString(),
      type: "transaction",
      ...transaction,
      createdAt: new Date()
    });
    console.log(`✅ Imported: ${transaction.name}`);
  }
  console.log("🎉 All done!");
}

importData();