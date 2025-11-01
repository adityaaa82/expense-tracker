# Expense Tracker

A full-stack **personal Expense tracking app** built with React, Redux Toolkit, Node.js, and MongoDB.  
It helps users manage income and expenses, visualize data using charts, and keep transactions organized.

---

## Features

- Add, edit, and delete transactions  
- Filter by date, category, or type (income/expense)  
- Interactive charts with Chart.js  
- Redux Toolkit for state management  
- Responsive and minimal UI with TailwindCSS  
- Backend API with Express and MongoDB  

---

## Tech Stack

**Frontend:**
- React + TypeScript  
- Redux Toolkit  
- TailwindCSS  
- Chart.js  

**Backend:**
- Node.js  
- Express.js  
- MongoDB + Mongoose  

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/adityaaa82/expense-tracker.git
cd expense-tracker
````

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the **backend** folder:

```env
MONGO_URI=your_mongodb_connection_string
```

Then run the server:

```bash
node index.js
```

Your backend will start on `http://localhost:8500`.

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Your frontend will start on `http://localhost:5173`.

## Scripts

**Frontend:**

```bash
npm run dev      # Start development server
npm run build    # Build production files
```

**Backend:**

```bash
node index.js or nodemon index.js      # Run server with nodemon
```

---

## Preview

The dashboard includes:

* Pie chart showing income vs expense
* Bar chart for monthly trends
* Transaction list with actions

