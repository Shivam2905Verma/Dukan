import React, { use, useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../Context/ChainContext";
import style from "../Css/detailTrans.module.css";
import { toast } from "react-toastify";

const DetailTrans = () => {
  const params = useParams();

  const navigate = useNavigate();

  const { api } = useContext(AppContext);
  let [data, setData] = useState({});
  let [id, setId] = useState();
  let [edit, setEdit] = useState(true);
  let [dataRec, setDataRec] = useState(false);
  let [weightAndTunch, setWeightAndTunch] = useState([]);
  let [lastBalance, setlastBalance] = useState();
  let [chainTotal, setChainTotal] = useState();
  let [grossTotal, setgrossTotal] = useState();
  let [goldPaid, setGoldPaid] = useState();
  let [remainingGold, setremainingGold] = useState();
  let [todayRate, setTodayRate] = useState();
  let [goldToCash, setGoldToCash] = useState();
  let [totalCash, settotalCash] = useState();
  let [cashPaid, setCashPaid] = useState();
  let [remainingCash, setRemainingCash] = useState();

  const handleChangeWeightAndTunch = (idx, field, value) => {
    setWeightAndTunch((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const deleteRow = (i) => {
    setWeightAndTunch(weightAndTunch.filter((e, idx) => idx != i));
  };

  const updateData = async () => {
    try {
      let response = await api.post("/data/update", {
        id,
        weightAndTunch,
        lastBalance,
        chainTotal,
        grossTotal,
        goldPaid,
        remainingGold,
        todayRate,
        goldToCash,
        totalCash,
        cashPaid,
        remainingCash,
      });

      setEdit(true);
      if (response.status === 200) {
        toast.success("Your Transaction is updated", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!isConfirmed) return;

    try {
      const response = await api.delete(`/data/deleteTrans/${params.id}`);
      console.log(response.data);
      alert("Record deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error deleting record!");
    }
  };

  useEffect(() => {
    let sum = 0;
    weightAndTunch.forEach((e) => {
      const num1 = Number(e.num1) || 0;
      const num2 = Number(e.num2) || 0;
      sum += (num1 * num2) / 100;
    });

    const calculatedChainTotal = sum.toFixed(3);
    setChainTotal(calculatedChainTotal);

    const total = (Number(calculatedChainTotal) + Number(lastBalance)).toFixed(
      3
    );
    setgrossTotal(total);

    let remaining = (Number(total) - Number(goldPaid)).toFixed(3);

    remaining = (remaining - Number(goldToCash)).toFixed(3);
    setremainingGold(remaining);

    let totalCashToPay = (
      Number(goldToCash) *
      (Number(todayRate) / 10)
    ).toFixed(3);
    settotalCash(totalCashToPay);

    let remainingCash2 = (totalCashToPay - cashPaid).toFixed(3);
    setRemainingCash(remainingCash2);
  }, [weightAndTunch, lastBalance, goldPaid, goldToCash, todayRate, cashPaid]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("/data/detailTrans", { params });
      console.log(response.data);
      setData(response.data);
      setId(response.data._id);
      setDataRec(true);
      setChainTotal(response.data.chainTotal);
      setWeightAndTunch(response.data.weightAndTunch);
      setlastBalance(response.data.lastBalance);
      setgrossTotal(response.data.grossTotal);
      setGoldPaid(response.data.goldPaid);
      setremainingGold(response.data.remainingGold);
      setGoldToCash(response.data.goldToCash);
      setTodayRate(response.data.todayRate);
      settotalCash(response.data.totalCash);
      setCashPaid(response.data.cashPaid);
      setRemainingCash(response.data.remainingCash);
    };

    fetchData();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.top}>
        <div className={style.topLeft}>
          <div>
            <h4>Name</h4>
            <h4>{data.name}</h4>
          </div>
          <div>
            <h4>Date</h4>
            <h4>{dataRec ? data.date.split("T")[0] : <></>}</h4>
          </div>
          <div>
            <h4>Time</h4>
            <h4>{dataRec ? data.time : <></>}</h4>
          </div>
        </div>
        <div className={style.topRight}>
          {edit ? (
            <span
              onClick={() => setEdit(!edit)}
              className="material-symbols-outlined"
            >
              edit
            </span>
          ) : (
            <span
              onClick={() => setEdit(!edit)}
              className="material-symbols-outlined"
            >
              close
            </span>
          )}
          <span
            onClick={() => handleDelete()}
            className="material-symbols-outlined"
          >
            delete
          </span>
        </div>
      </div>
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
          {weightAndTunch ? (
            weightAndTunch.map((e, i) => (
              <tr key={e._id}>
                <td>
                  <input
                    className={style.weight}
                    type="number"
                    placeholder="weight"
                    value={e.num1}
                    onChange={(ev) =>
                      handleChangeWeightAndTunch(i, "num1", ev.target.value)
                    }
                    disabled={edit}
                  />
                </td>
                <td>
                  <input
                    className={style.tunch}
                    type="number"
                    placeholder="tunch"
                    value={e.num2}
                    onChange={(ev) =>
                      handleChangeWeightAndTunch(i, "num2", ev.target.value)
                    }
                    disabled={edit}
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
                      handleChangeWeightAndTunch(
                        i,
                        "chainName",
                        ev.target.value
                      )
                    }
                    disabled={edit}
                  >
                    <option>select Chain</option>
                    <option value="dp">DP</option>
                    <option value="lotus">Lotus</option>
                  </select>
                </td>
                <td>
                  <select
                    name="chainWidth"
                    value={e.chainWidth}
                    onChange={(ev) =>
                      handleChangeWeightAndTunch(
                        i,
                        "chainWidth",
                        ev.target.value
                      )
                    }
                    disabled={edit}
                  >
                    <option>Select its Width</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </td>
                <td
                  className={style.deleteBtn}
                  onClick={!edit ? () => deleteRow(i) : undefined}
                >
                  <span className="material-symbols-outlined">delete</span>
                </td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>

      <table className={style.my_table}>
        <thead>
          <tr>
            <th>Details</th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          {dataRec ? (
            <>
              <tr>
                <td>Last Balance</td>
                <td>{lastBalance}</td>
              </tr>
              <tr>
                <td>Chain Total</td>
                <td>{chainTotal}</td>
              </tr>
              <tr>
                <td>Final Total</td>
                <td>{grossTotal}</td>
              </tr>
              <tr>
                <td>Gold Paid</td>
                <td>
                  <input
                    className={style.goldPaid}
                    type="number"
                    value={goldPaid}
                    placeholder="Gold paid"
                    onChange={(e) => setGoldPaid(e.target.value)}
                    disabled={edit}
                  />
                </td>
              </tr>
              <tr>
                <td>Remaining Gold</td>
                <td>{remainingGold}</td>
              </tr>

              <tr>
                <td>
                  <div className={style.cashAndGold}>
                    <div>
                      <p>Todays Rate</p>
                      <input
                        placeholder="Enter Todays Rate"
                        value={todayRate}
                        onChange={(e) => setTodayRate(e.target.value)}
                        className={style.todayRate}
                        type="number"
                        disabled={edit}
                      />
                    </div>
                    <div>
                      <p>Gold</p>
                      <input
                        placeholder="Enter Gold"
                        value={goldToCash}
                        onChange={(e) => setGoldToCash(e.target.value)}
                        className={style.todayRate}
                        type="number"
                        disabled={edit}
                      />
                    </div>
                  </div>
                </td>
                <td>{totalCash}</td>
              </tr>
              <tr>
                <td>Cash Paid</td>
                <td>
                  <input
                    placeholder="Enter Cash Paid"
                    onChange={(e) => setCashPaid(e.target.value)}
                    value={cashPaid}
                    className={style.cashPaid}
                    type="number"
                    disabled={edit}
                  />
                </td>
              </tr>
              <tr>
                <td>Remaining Cash TO Pay</td>
                <td>{remainingCash}</td>
              </tr>
            </>
          ) : (
            <></>
          )}
        </tbody>
      </table>
      {!edit ? (
        <div className={style.footer}>
          <span className={style.button} onClick={updateData}>
            Update
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DetailTrans;
