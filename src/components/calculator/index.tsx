import React, { useState } from "react";
import Output from "../output";
import Formula from "../formula";
import Buttons from "../buttons";

import styles from "./index.module.scss";

// VARS:
const isOperator = /[x/+‑]/,
  endsWithOperator = /[x+‑/]$/,
  endsWithNegativeSign = /[x/+]‑$/;

const Calculator = () => {
  const [currentVal, setCurrentVal] = useState("0");
  const [prevVal, setPrevVal] = useState("0");
  const [formula, setFormula] = useState("");
  const [evaluated, setEvaluated] = useState(false);

  const maxDigitWarning = () => {
    setCurrentVal("Digit Limit Met");
    setPrevVal(currentVal);
    setTimeout(() => setCurrentVal(prevVal), 1000);
  };

  const handleEvaluate = () => {
    if (!currentVal.includes("Limit")) {
      let expression = formula;
      while (endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression.replace(/x/g, "*").replace(/‑/g, "-");

      try {
        // eslint-disable-next-line
        let answer =
          Math.round(1000000000000 * eval(expression)) / 1000000000000;
        setCurrentVal(answer.toString());
        setFormula(
          expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + "=" + answer
        );
        setPrevVal(answer.toString());
        setEvaluated(true);
      } catch (e) {}
    }
  };

  const handleOperators = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (!currentVal.includes("Limit")) {
      const value = event.currentTarget.value;
      setCurrentVal(value);
      setEvaluated(false);
      if (evaluated) {
        setFormula(prevVal + value);
      } else if (!endsWithOperator.test(formula)) {
        setPrevVal(formula);
        setFormula(formula + value);
      } else if (!endsWithNegativeSign.test(formula)) {
        setFormula(
          (endsWithNegativeSign.test(formula + value) ? formula : prevVal) +
            value
        );
      } else if (value !== "‑") {
        setFormula(prevVal + value);
      }
    }
  };

  const handleNumbers = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (!currentVal.includes("Limit")) {
      const value = event.currentTarget.value;
      setEvaluated(false);
      if (currentVal.length > 21) {
        maxDigitWarning();
      } else if (evaluated) {
        setCurrentVal(value);
        setFormula(value !== "0" ? value : "");
      } else {
        setCurrentVal(
          currentVal === "0" || isOperator.test(currentVal)
            ? value
            : currentVal + value
        );
        setFormula(
          currentVal === "0" && value === "0"
            ? formula === ""
              ? value
              : formula
            : /([^.0-9]0|^0)$/.test(formula)
            ? formula.slice(0, -1) + value
            : formula + value
        );
      }
    }
  };

  const handleDecimal = () => {
    if (evaluated) {
      setCurrentVal("0.");
      setFormula("0.");
      setEvaluated(false);
    } else if (!currentVal.includes(".") && !currentVal.includes("Limit")) {
      setEvaluated(false);
      if (currentVal.length > 21) {
        maxDigitWarning();
      } else if (
        endsWithOperator.test(formula) ||
        (currentVal === "0" && formula === "")
      ) {
        setCurrentVal("0.");
        setFormula(formula + "0.");
      } else {
        setCurrentVal(formula.match(/(-?\d+\.?\d*)$/)![0] + ".");
        setFormula(formula + ".");
      }
    }
  };

  const initialize = () => {
    setCurrentVal("0");
    setPrevVal("0");
    setFormula("");
    setEvaluated(false);
  };

  return (
    <div>
      <div className={styles.calculator}>
        <Formula formula={formula.replace(/x/g, "⋅")} />
        <Output currentValue={currentVal} />
        <Buttons
          decimal={handleDecimal}
          evaluate={handleEvaluate}
          initialize={initialize}
          numbers={handleNumbers}
          operators={handleOperators}
        />
      </div>
    </div>
  );
};

export default Calculator;
