// src/AppContext.js
import { createContext, useEffect, useState } from "react";
import axios from "axios";

// 1. Create the context
export const AppContext = createContext();

// 2. Create a provider component
export const AppProvider = ({ children }) => {
  const api = axios.create({
    baseURL: "https://dukan-one.vercel.app/",
    headers: { "Content-Type": "application/json" },
  });

  // Global state
  const [inputPairs, setinputPairs] = useState([{ num1: "", num2: "" , chainName: "" , chainWidth: "" }]);
  const [search, setSearch] = useState("");
  let [dateInput, setDateinput] = useState(
    new Date().toISOString().split("T")[0]
  );
  let [finalTotal, setTotal] = useState(0);

  const handleChange = (idx, field, value) => {
    const update = [...inputPairs];
    update[idx][field] = value;
    setinputPairs(update);
  };

  const addPair = () => {
    setinputPairs((prev) => [...prev, { num1: "", num2: "" , chainName: "" , chainWidth: "" }]);
  };

  const deleteRow = (i) => {
    setinputPairs(inputPairs.filter((item, index) => index !== i));
  };

  useEffect(() => {
    let total = 0;

    inputPairs.map((e) => {
      let num1 = parseFloat(e.num1) || 0;
      let num2 = parseFloat(e.num2) || 0;
      total = total + ((num1 * num2) / 100);
    });

    setTotal(total.toFixed(3));
  }, [inputPairs]);

  return (
    <AppContext.Provider
      value={{
        inputPairs,
        setinputPairs,
        finalTotal,
        setTotal,
        handleChange,
        addPair,
        deleteRow,
        api,
        setSearch,
        search,
        dateInput,
        setDateinput
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
