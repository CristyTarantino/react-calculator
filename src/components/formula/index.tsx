import React from "react";
import styles from "./index.module.scss";

interface IFormula {
  formula: string;
}

const Formula: React.FC<IFormula> = ({ formula }) => {
  return <div className={styles.formulaScreen}>{formula}</div>;
};

export default Formula;
