import { useContext, useEffect, useState } from "react";
import style from "../Css/chain.module.css";
import { AppContext } from "../Context/ChainContext";
import { useNavigate } from "react-router-dom";

function Chain() {
  const { inputPairs, finalTotal, handleChange, addPair, deleteRow } =
    useContext(AppContext);

    const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addPair();
    }
  };

  const isFormValid = inputPairs.every(
    (e) =>
      e.num1 &&
      e.num2 &&
      e.chainName &&
      e.chainWidth &&
      Number(e.num1) > 0 &&
      Number(e.num2) > 0
  );

  const handleProceed = () => {
    if (!isFormValid) {
      alert("⚠️ Please fill all fields before proceeding to payment.");
      return;
    }
    navigate("/payment");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className={style.container}>
        <div className={style.allChains}>
          <table className={style.my_table}>
            <thead>
              <tr>
                <th>Weight</th>
                <th>Tunch</th>
                <th>Multiplied</th>
                <th>Chain Name</th>
                <th>Width</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {inputPairs.map((e, i) => (
                <tr key={i}>
                  <td>
                    <input
                      className={style.weight}
                      type="number"
                      placeholder="weight"
                      value={e.num1}
                      required
                      onChange={(ev) =>
                        handleChange(i, "num1", ev.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className={style.tunch}
                      type="number"
                      placeholder="tunch"
                      value={e.num2}
                      onChange={(ev) =>
                        handleChange(i, "num2", ev.target.value)
                      }
                    />
                  </td>
                  <td>
                    <h5>
                      {((Number(e.num1) * Number(e.num2)) / 100).toFixed(3)}
                    </h5>
                  </td>
                  <td>
                    <select
                      name="chainName"
                      value={e.chainName}
                      onChange={(ev) =>
                        handleChange(i, "chainName", ev.target.value)
                      }
                    >
                      <option value="">select Chain</option>
                      <option value="dp">DP</option>
                      <option value="lotus">Lotus</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="chainWidth"
                      value={e.chainWidth}
                      onChange={(ev) =>
                        handleChange(i, "chainWidth", ev.target.value)
                      }
                    >
                      <option value="">Select its Width</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </td>
                  <td className={style.deleteBtn} onClick={() => deleteRow(i)}>
                    <span className="material-symbols-outlined">delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={style.addChains} onClick={addPair}>
            +
          </div>
        </div>

        <div className={style.footer}>
          <h4>Total = {finalTotal}</h4>
          <button
            className={style.payment}
            onClick={handleProceed}
            disabled={!isFormValid}
            style={{
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </>
  );
}

export default Chain;
