import { useState } from "react";
import styles from "./Modal.module.css";

export default function Modal({
  title,
  closeModal,
  addToWallet,
  addExpense,
  setExpenseArray,
}) {
  const modalCardClass =
    title === "income"
      ? styles.modalCardIncome
      : title === "expense" || title === "edit"
      ? styles.modalCardExpense
      : styles.modalCard;

  const [newIncome, setNewIncome] = useState("");
  const [expenseData, setExpenseData] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  const handleNewIncome = (e) => {
    let p = e.target.value;
    setNewIncome(p);
  };

  const handleAddToBalance = () => {
    addToWallet(parseInt(newIncome, 10));
  };

  const handleAddExpense = (index) => {
    addExpense(expenseData,index);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className={styles.modalLayout} onClick={closeModal}>
      <div
        className={`${styles.modalCard} ${modalCardClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title === "income" && (
          <>
            <div className={styles.cardLabel}>Add Income</div>
            <div className={styles.content}>
              <input
                type="number"
                placeholder="Income Amount"
                className={styles.inputField}
                value={newIncome}
                onChange={(e) => {
                  handleNewIncome(e);
                }}
              />
              <button
                type="button"
                className={styles.addBalance}
                onClick={() => {
                  handleAddToBalance();
                  closeModal();
                }}
              >
                Add Income
              </button>
              <button
                type="button"
                className={styles.cancel}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {(title === "expense" || title === "edit") && (
          <>
            <div className={styles.cardLabel}>
              {title === "expense"
                ? "Add Expense"
                : title === "edit"
                ? "Edit Expense"
                : ""}
            </div>
            <form>
              <div className={styles.content}>
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  className={styles.inputField}
                  value={expenseData.title}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  name="price"
                  className={styles.inputField}
                  value={expenseData.price}
                  onChange={handleChange}
                  required
                />

                <select
                  name="category"
                  className={styles.inputField}
                  onChange={handleChange}
                  value={expenseData.category}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="date"
                  placeholder="dd/mm/yyyy"
                  name="date"
                  className={styles.inputField}
                  value={expenseData.date}
                  onChange={handleChange}
                  required
                />
                <button
                  type="submit"
                  className={styles.addExpense}
                  onClick={() => {
                    
                      let {title,price,category,date}=expenseData;
                      if((title!=='') && (price!=='') && (category!=='') && (date!=='')){
                        handleAddExpense();
                      closeModal();
                      }
                  }}
                >
                  {title === "expense" ? "Add Expense" : "Edit Expense"}
                </button>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
