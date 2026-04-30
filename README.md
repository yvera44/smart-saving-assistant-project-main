💰 Savings Assistant
An AI-powered savings assistant built by the Year Up Intern Team for PayPal/Braintree. It helps users track spending, manage savings goals, and receive AI-powered financial tips — all connected to a real cloud database.


👥 Team
Name
Role
Lucas Rappatta
Tech Lead & Presentation
Malik Canteberry
Developer
Yair Vera
Developer
Diana Dzhus
Docs & Research


Built during Year Up United Internship at PayPal (2026)


🚀 Features
📊 Dashboard — View balance, savings, and goal progress
💳 Transaction Tracking — Real transactions stored in Azure Cosmos DB
🗂️ Categories — Transactions organized by Food, Entertainment, Shopping, Transport, Health
🎯 Savings Goals — Create and track multiple savings goals
🤖 AI Tips — Personalized spending advice powered by Anthropic Claude
🌙 Dark Mode — Toggle between light and dark themes



🛠️ Tech Stack
Technology
Purpose
Node.js + Express
Backend server
Azure Cosmos DB
Cloud database
JavaScript
Frontend logic
HTML + CSS
User interface



⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/yvera44/smart-saving-assistant-project-main

cd smart-saving-assistant-project-main
2. Install packages
npm install

This installs every library the project needs, including the Azure Cosmos DB .
3. Create .env file
Create a file called .env in the root of the project (same folder as server.js) and add:

COSMOS_ENDPOINT=https://paypal-db.documents.azure.com:443/

COSMOS_KEY=ask team for this

COSMOS_DATABASE=PayPal-project

COSMOS_CONTAINER=tools

4. Run the app
node server.js
5. Open in browser
http://localhost:3000

You should see the dashboard with live transactions and the AI tips card.


🚫 Do NOT run node import-data.js
The database is already populated with sample transactions. The import-data.js script is a one-time setup that has already been run by the team.

⚠️ Running it again will create duplicate data and break the Recent Transactions view for everyone on the team.

Only run import-data.js if:

You are setting up a brand new, empty Cosmos DB container, OR
The team has explicitly asked you to re-seed the database.


🔄 Pulling the Latest Updates
When a teammate pushes new code, sync your local copy with these commands:

git fetch origin

git pull origin main

npm install

node server.js



📁 Project Structure
smart-saving-assistant-project-main/

├── public/

│   ├── index.html      ← Main UI

│   ├── app.js          ← Frontend logic

│   └── style.css       ← Styling

├── db.js               ← Azure Cosmos DB connection

├── server.js           ← Express server + API routes

├── import-data.js      ← One-time database seed (DO NOT RUN)

├── .env                ← Secret keys (never push to GitHub!)

├── .gitignore          ← Protects secret files

└── package.json        ← Project dependencies


🔌 API Endpoints
Method
Endpoint
Description
GET
/api/transactions
Get all transactions from the database
GET
/api/data
Get all data from the database
POST
/api/save
Save new data to the database



🗄️ Database
This project uses Azure Cosmos DB as the cloud database.

Account: paypal-db
Database: PayPal-project
Container: tools

Transactions are organized by categories:

🍔 Food
🎬 Entertainment
🛍️ Shopping
🚗 Transport
💪 Health


🎬 Demo Day Checklist
Before showing this project to PayPal mentors:

✅ Server starts without errors (node server.js prints "Server running on http://localhost:3000")
✅ Page loads at http://localhost:3000 and shows transactions
✅ AI tip button generates a real tip in under 5 seconds
✅ A 60-second screen recording of a successful demo is saved as backup, in case Claude API or Wi-Fi fails during the live presentation


📝 License
Built for educational purposes as part of the Year Up United Internship Program at PayPal (2026).
