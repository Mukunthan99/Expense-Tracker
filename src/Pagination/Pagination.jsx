import styles from "./Pagination.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import RecentTransactionItem from "../RecentTransactionItem/RecentTransactionItem";

export default function Pagination({
  expenseArray,
  setModalTitle,
  setModalIsOpen,
  setExpenseArray,
  setExpense,
  
  setWalletBalance,
  setCategoryArray,
  setEditIndex,
}) {
  const [pageNum, setPageNum] = useState(1);
  const [displayArray, setDisplayArray] = useState([]);

  const [islastItem, setIsLastItem] = useState(false);

  const fillDisplayArray = () => {
    setDisplayArray([]);
    let temp = [];
    let numberOfTransactions = 3;
    let pointer = pageNum * numberOfTransactions;
    let sortedArray = [...expenseArray].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    for (
      let i = pointer - numberOfTransactions;
      i < Math.min(pointer, sortedArray.length);
      i++
    ) {
      if (i === sortedArray.length - 1) setIsLastItem(true);
      temp.push(sortedArray[i]);
    }
    setDisplayArray(temp);
  };

  const handlePaginationButton = (e) => {
    switch (e.currentTarget.id) {
      case "previousButton":
        setIsLastItem(false);
        if (pageNum === 1) return;
        setPageNum((pre) => pre - 1);
        break;
      case "nextButton":
        if (islastItem) return;
        setPageNum((pre) => pre + 1);
        break;
      default:
        break;
    }
  };

  const handleDelete = (index) => {
    const removedExpense = displayArray[index];
    setWalletBalance((prev) => prev + parseInt(removedExpense.price, 10));
    setExpense((prev) => prev - removedExpense.price);
    setExpenseArray((prev) => {
      return [...prev].filter((e, i) => e !== removedExpense);
    });
    setCategoryArray((prev) => {
      const updatedArray = prev.map((ele) => {
        if (ele.category === removedExpense.category) {
          return { ...ele, price: ele.price - removedExpense.price };
        }
        return ele;
      });
      console.log(updatedArray);
      return updatedArray.filter((ele) => ele.price > 0);
    });
  };

  const handleEdit = (index) => {
    setModalTitle("edit");
    setModalIsOpen(true);

    let indexToBeEdited = [...expenseArray].findIndex((ele) =>{ 
    return ele === displayArray[index]})
    
    console.log(indexToBeEdited);
    setEditIndex(indexToBeEdited);
  };

  useEffect(() => {
    fillDisplayArray();
  }, [pageNum, expenseArray]);

  return (
    <>
      <div className={styles.recentTransactions}>
        {displayArray.length &&
          displayArray.map((ele, index) => (
            <RecentTransactionItem
              expenseArray={expenseArray}
              index={index}
              transaction={ele}
              handleDelete={handleDelete}
              handleEdit={() => {
                handleEdit(index);
              }}
            />
          ))}
      </div>
      <div className={styles.paginationControl}>
        <button
          className={styles.previousButton}
          id="previousButton"
          onClick={(e) => handlePaginationButton(e)}
        >
          <FaArrowLeft />
        </button>
        <div className={styles.pageNum}>{pageNum}</div>
        <button
          className={styles.nextButton}
          id="nextButton"
          onClick={(e) => handlePaginationButton(e)}
        >
          <FaArrowRight />
        </button>
      </div>
    </>
  );
}
