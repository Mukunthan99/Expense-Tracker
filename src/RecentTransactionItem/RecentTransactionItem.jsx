import styles from "./RecentTransactionItem.module.css";
import { TbXboxX } from "react-icons/tb";
import { MdOutlineModeEdit } from "react-icons/md";
import { GiMountaintop } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { RiMovie2Line } from "react-icons/ri";
import { IoFastFoodSharp } from "react-icons/io5";
import { GiHealthNormal } from "react-icons/gi";
import { MdMiscellaneousServices } from "react-icons/md";

export default function RecentTransactionItem({ transaction,index,handleDelete,expenseArray,handleEdit }) {
  let { title, date, price, category } = transaction;
  //console.log(title, date, price);

  
  

  return (
    <>
      <div className={styles.itemContainer}>
        <div className={styles.category_title_Date}>
          <span className={styles.categoryIcon}>
            {category === "Travel" ? (
              <GiMountaintop />
            ) : category === "Utilities" ? (
              <IoHome />
            ) : category === "Entertainment" ? (
              <RiMovie2Line />
            ) : category === "Food" ? (
              <IoFastFoodSharp />
            ) : category === "Health" ? (
              <GiHealthNormal />
            ) : (
              <MdMiscellaneousServices />
            )}
          </span>
          <div className={styles.title_Date}>
            <div className={styles.itemTitle}>{title}</div>
            <div className={styles.itemDate}>
              {new Date(date).toDateString()}
            </div>
          </div>
        </div>
        <div className={styles.price_edit_delete}>
          <span className={styles.itemPrice}>₹{price}</span>
          <button
            className={styles.editButton}
            onClick={() => {
              handleDelete(index);
              //console.log(index)
            }}
          >
            <TbXboxX />
          </button>
          <button
            className={styles.editButton}
            onClick={() => {
                
              handleEdit();
            }}
          >
            <MdOutlineModeEdit />
          </button>
        </div>
      </div>
    </>
  );
}
