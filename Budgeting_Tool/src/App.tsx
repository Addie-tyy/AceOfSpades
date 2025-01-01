import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { Bar } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [expenses, setExpenses] = useState<
    { category: string; amount: number }[]
  >([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">(0);
  const [budget, setBudget] = useState<number | "">(0);
  const [savingsGoal, setSavingsGoal] = useState<number | "">(0);
  const [model, setModel] = useState<any>(null);
  const [prediction, setPrediction] = useState<string>("");

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const isOverBudget = totalExpenses > budget;
  const remainingSavings = savingsGoal - (budget - totalExpenses);

  const addExpense = () => {
    if (category && amount > 0) {
      setExpenses([...expenses, { category, amount: Number(amount) }]);
      setCategory("");
      setAmount(0);
      toast.success("Expense added successfully!");
    } else {
      toast.error("Please fill out both fields correctly.");
    }
  };

  const chartData = {
    labels: expenses.map((e) => e.category),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((e) => e.amount),
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#2196f3",
          "#f44336",
          "#9c27b0",
          "#673ab7",
          "#00bcd4",
        ],
      },
    ],
  };

  const savingsChartData = {
    labels: ["Saved", "Remaining"],
    datasets: [
      {
        data: [
          budget - totalExpenses,
          remainingSavings > 0 ? remainingSavings : 0,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("budget", JSON.stringify(budget));
    localStorage.setItem("savingsGoal", JSON.stringify(savingsGoal));
  }, [expenses, budget, savingsGoal]);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
    const savedBudget = JSON.parse(localStorage.getItem("budget") || "0");
    const savedSavingsGoal = JSON.parse(
      localStorage.getItem("savingsGoal") || "0"
    );

    setExpenses(savedExpenses);
    setBudget(savedBudget);
    setSavingsGoal(savedSavingsGoal);
  }, []);

  useEffect(() => {
    if (isOverBudget) {
      toast.warn("Alert: You are over your budget!");
    }
    if (totalExpenses > budget * 0.8) {
      toast.info("Tip: Consider cutting back on dining or subscriptions!");
    }
  }, [totalExpenses, budget]);

  useEffect(() => {
    const loadModel = async () => {
      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

      const trainingData = tf.tensor2d([totalExpenses], [1, 1]);
      const outputData = tf.tensor2d([isOverBudget ? 1 : 0], [1, 1]);

      await model.fit(trainingData, outputData, { epochs: 10 });
      setModel(model);
    };

    loadModel();
  }, [totalExpenses, isOverBudget]);

  useEffect(() => {
    if (model) {
      const predictBudgetStatus = async () => {
        const predictionResult = model.predict(
          tf.tensor2d([totalExpenses], [1, 1])
        ) as tf.Tensor;
        const result =
          predictionResult.dataSync()[0] > 0.5
            ? "Likely to exceed budget"
            : "On track";
        setPrediction(result);
      };
      predictBudgetStatus();
    }
  }, [model, totalExpenses]);

  return (
    <div className="container">
      <h1 className="header">Welcome to Swaya!</h1>

      <div className="input-container">
        <div className="input-group">
          <h4>Enter your monthly budget</h4>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="Enter your monthly budget"
            className="input"
          />
        </div>
        <div className="input-group">
          <h4>Enter your savings goal</h4>
          <input
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(Number(e.target.value))}
            placeholder="Enter your savings goal"
            className="input"
          />
        </div>
      </div>

      <div className="input-container">
        <h2>Expense Tracker</h2>
        <div className="input-group">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="input"
          />
        </div>
        <div className="input-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount"
            className="input"
          />
        </div>
        <div className="button-container">
          <button onClick={addExpense} className="button">
            Add Expense
          </button>
        </div>
      </div>

      <div className="info-container">
        <p>
          {isOverBudget
            ? "You are over your budget! Try to reduce expenses."
            : "Good job! You're staying within your budget."}
        </p>
        <p>AI Prediction: {prediction}</p>
      </div>

      {savingsGoal > 0 && (
        <div className="info-container">
          <p>
            {remainingSavings > 0
              ? `You need to save ₹${remainingSavings} more to reach your goal.`
              : "Congratulations! You’ve met your savings goal!"}
          </p>
        </div>
      )}

      <div className="chart-container">
        <h3>Expense Chart</h3>
        {expenses.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p>No expenses to display yet.</p>
        )}
      </div>

      {savingsGoal > 0 && (
        <div className="chart-container">
          <h3>Savings Progress</h3>
          <Bar data={savingsChartData} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
