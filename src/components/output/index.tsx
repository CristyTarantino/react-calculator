import React from "react";
import styles from "./index.module.scss";

interface IOutput {
  currentValue: string;
}

const Output: React.FC<IOutput> = ({ currentValue }) => {
  return (
    <div className={styles.outputScreen} id="display">
      {currentValue}
    </div>
  );
};

export default Output;
