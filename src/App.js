import styles from "./App.module.css";
import { useState, useEffect } from "react";
import Modal from "./Modal/Modal.jsx";
import Pagination from "./Pagination/Pagination.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

import { useSnackbar } from "notistack";

export default function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [expenseArray, setExpenseArray] = useState(
    JSON.parse(localStorage.getItem("expenseArray")) || []
  );
  const [walletBalance, setWalletBalance] = useState(
    parseInt(localStorage.getItem("balance"), 10) || 5000
  );
  const [expense, setExpense] = useState(
    parseInt(parseInt(localStorage.getItem("expense"), 10) || 0)
  );
  const [categoryArray, setCategoryArray] = useState(
    JSON.parse(localStorage.getItem("categoryArray")) || []
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#ff7096"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleModal = (e) => {
    setModalTitle(e.target.id);
    setModalIsOpen(true);
  };

  const addToWallet = (addedAmount) => {
    setWalletBalance((pre) => pre + addedAmount);
    enqueueSnackbar("Funds added", { variant: "success" });
  };

  const addExpense = (expenseObject) => {
    console.log(expenseObject, editIndex);
    let price = parseInt(expenseObject.price, 10);
    if (editIndex === -1) {
      

      if (walletBalance < price) {
        enqueueSnackbar("Insufficient funds", { variant: "error" });
        return;
      }
      setWalletBalance(walletBalance - price);
      setExpenseArray((pre) => [...pre, expenseObject]);
      setExpense((pre) => pre + price);
      updateCategoryArray(expenseObject);
    } else {
      const previousPrice = parseInt(expenseArray[editIndex].price, 10);
      if (walletBalance < price-previousPrice) {
        enqueueSnackbar("Insufficient funds", { variant: "error" });
        return;
      }
      setWalletBalance((pre) => pre + previousPrice - price);
      setExpenseArray((pre) => {
        const updatedArray = [...pre];
        updatedArray[editIndex] = expenseObject;
        return updatedArray;
      });
      setExpense((pre) => pre - previousPrice + price);
      updateCategoryArray({category:expenseObject.category,price:(price-previousPrice)})
    }
  };

  const updateCategoryArray = (expenseObject) => {
    let { category, price } = {
      category: expenseObject.category,
      price: parseInt(expenseObject.price, 10),
    };

    setCategoryArray((pre) => {
      const updatedArray = pre.map((item) => ({ ...item }));

      const existingCategoryIndex = updatedArray.findIndex(
        (item) => item.category === category
      );

      if (existingCategoryIndex !== -1) {
        updatedArray[existingCategoryIndex].price += price;
      } else {
        updatedArray.push({ category, price });
      }

      return updatedArray;
    });
  };

  useEffect(() => {
    localStorage.setItem("balance", walletBalance);
    localStorage.setItem("expense", expense);
  }, [walletBalance, expense]);

  useEffect(() => {
    localStorage.setItem("expenseArray", JSON.stringify(expenseArray));
  }, [expenseArray]);

  useEffect(() => {
    localStorage.setItem("categoryArray", JSON.stringify(categoryArray));
  }, [categoryArray]);

  return (
    <div className={styles.layout}>
      <div className={styles.title}>Expense Tracker</div>
      <div className={styles.container}>
        <div className={styles.dashboard}>
          <div className={styles.cardHolder}>
            <div className={styles.card} id="balance-card">
              <div>
                <span className={styles.label}>Wallet Balance: </span>
                <span className={styles.balanceAmount}>₹{walletBalance}</span>
              </div>
              <button
                className={styles.incomeButton}
                id="income"
                onClick={(e) => {
                  handleModal(e);
                }}
              >
                + Add Income
              </button>
            </div>
            <div className={styles.card} id="expense-card">
              <div>
                <span className={styles.label}>Expense: </span>
                <span className={styles.spentAmount}>₹{expense}</span>
              </div>
              <button
                className={styles.expenseButton}
                id="expense"
                onClick={(e) => {
                  handleModal(e);
                }}
              >
                + Add Expense
              </button>
            </div>
          </div>
          <div className={styles.pieChart}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryArray}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="price"
                  stroke="none"
                >
                  {categoryArray.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="rect"
                  align="center"
                  verticalAlign="bottom"
                  formatter={(value, entry) => `${entry.payload.category}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.transactionContainer}>
          <div className={styles.transactionTitle}>Recent transactions</div>
          <div className={styles.transactions}>
            {expenseArray.length > 0 && (
              <Pagination
                expenseArray={expenseArray}
                setModalTitle={setModalTitle}
                setModalIsOpen={setModalIsOpen}
                setExpenseArray={setExpenseArray}
                updateCategoryArray={updateCategoryArray}
                setExpense={setExpense}
                setWalletBalance={setWalletBalance}
                setCategoryArray={setCategoryArray}
                addExpense={addExpense}
                setEditIndex={setEditIndex}
              />
            )}
          </div>
        </div>
        <div className={styles.barChartContainer}>
          <div className={styles.barChartTitle}>Top Expenses</div>
          <div className={styles.barChart}>
            <ResponsiveContainer width="75%" height="100%">
              <BarChart
                data={categoryArray}
                layout="vertical"
                barSize={20}
                barCategoryGap={0}
                margin={{ left: 50 }}
              >
                <XAxis type="number" hide={true} />

                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontFamily: "Open Sans",
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: "16.34px",
                    textAlign: "left",
                  }}
                ></YAxis>
                <Tooltip />
                <Bar dataKey="price" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {modalIsOpen && (
        <Modal
          title={modalTitle}
          closeModal={() => {
            setModalIsOpen(false);
            setModalTitle("");
          }}
          addToWallet={addToWallet}
          addExpense={addExpense}
          setExpenseArray={setExpenseArray}
        />
      )}
    </div>
  );
}
