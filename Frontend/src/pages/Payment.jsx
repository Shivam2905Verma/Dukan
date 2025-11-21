import { useContext, useEffect, useState } from "react";
import style from "../Css/Payment.module.css";
import { AppContext } from "../Context/ChainContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const { inputPairs, finalTotal, api } = useContext(AppContext);

  const navigate = useNavigate();

  const [dropDwonData, setDropDwonData] = useState();
  const [showDropdown, setshowDropdown] = useState(false);
  let [nameOfCustomer, setNameOfCustomer] = useState("");
  let [lastBalance, setlastBalance] = useState(0);
  let [goldPaid, setGoldPaid] = useState(0);
  let [grossTotal, setgrossTotal] = useState(finalTotal);
  let [remainingGold, setRemainingGold] = useState(0);
  let [inCash, setIncash] = useState(false);
  let [todayRate, setTodayRate] = useState(0);
  let [totalCash, setTotalCash] = useState(0);
  let [cashPaid, setCashPaid] = useState(0);
  let [remainingCash, setRemainingCash] = useState();
  let [goldToCash, setGoldToCash] = useState(0);

  const saveData = async (
    name,
    weightAndTunch,
    date,
    time,
    chainTotal,
    finalTotal,
    goldPaid,
    remainingGold
  ) => {
    try {
      let response = await api.post("/data/savedata", {
        name: name,
        weightAndTunch: weightAndTunch,
        date: date,
        time: time,
        lastBalance: lastBalance,
        chainTotal: chainTotal,
        grossTotal: finalTotal,
        goldPaid: goldPaid,
        remainingGold: remainingGold,
        todayRate: todayRate,
        goldToCash: goldToCash,
        totalCash: totalCash,
        cashPaid: cashPaid,
        remainingCash: remainingCash,
      });

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
      let nameResponse = await api.post("/data/savename", { name });
      console.log(nameResponse);
      console.log(response);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "There is an issue", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleIncash = () => {
    setTodayRate(0);
    setGoldToCash(0);
    setCashPaid(0);
    setIncash(!inCash);
  };

  const handleSelectName = (name) => {
    setshowDropdown(false);
    setNameOfCustomer(name);
  };

  useEffect(() => {
    if (finalTotal == 0) {
      navigate("/chain");
    }
  }, []);

  useEffect(() => {
    // ✅ 1. Calculate grossTotal
    const gross = (Number(finalTotal) + Number(lastBalance)).toFixed(3);
    setgrossTotal(gross);

    // ✅ 2. Calculate remaining gold
    const remGold = (gross - Number(goldPaid)).toFixed(3);
    const remAfterGold = (remGold - Number(goldToCash)).toFixed(3);
    setRemainingGold(remAfterGold);

    // ✅ 3. Calculate total cash from goldToCash
    const cashToPay = (Number(goldToCash) * (Number(todayRate) / 10)).toFixed(
      3
    );
    setTotalCash(cashToPay);

    // ✅ 4. Remaining cash
    const remCash = (cashToPay - Number(cashPaid)).toFixed(3);
    setRemainingCash(remCash);
  }, [
    finalTotal,
    lastBalance,
    goldPaid,
    goldToCash,
    todayRate,
    cashPaid,
    nameOfCustomer,
  ]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!nameOfCustomer.trim()) {
        setDropDwonData([]);
        setshowDropdown(false);
        return;
      }

      const responseName = await api.get("/data/searchedNames", {
        params: { search: nameOfCustomer },
      });
      setDropDwonData(responseName.data);
      setshowDropdown(responseName.data.length > 0);
      console.log(responseName.data);

      const responseLastBalance = await api.get("/data/lastbalance", {
        params: { search: nameOfCustomer },
      });

      setlastBalance(responseLastBalance.data.remainingGold || 0);

      console.log("Data :-  ", responseLastBalance.data);
    }, 500);

    return () => clearTimeout(handler);
  }, [nameOfCustomer]);

  return (
    <div>
      <form
        className={style.container}
        onSubmit={(e) => {
          e.preventDefault();
          saveData(
            nameOfCustomer,
            inputPairs,
            new Date(),
            new Date().toLocaleTimeString(),
            finalTotal,
            grossTotal,
            goldPaid,
            remainingGold
          );
        }}
      >
        <div className={style.name}>
          <input
            placeholder="Name"
            type="text"
            onChange={(e) => setNameOfCustomer(e.target.value)}
            value={nameOfCustomer}
            required
          />
          <div
            className={`${style.dropDown} ${
              nameOfCustomer && dropDwonData?.length > 0 ? style.open : ""
            }`}
          >
            {dropDwonData && showDropdown ? (
              dropDwonData.map((e) => (
                <p
                  key={e._id}
                  className={style.names}
                  onClick={() => handleSelectName(e.name)}
                >
                  {e.name}
                </p>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={style.tableBox}>
          <table className={style.my_table}>
            <thead>
              <tr>
                <th>Details</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Last Balance</td>
                <td>{lastBalance ? lastBalance : 0}</td>
              </tr>
              <tr>
                <td>Chain Total</td>
                <td>{finalTotal}</td>
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
                    placeholder="Gold paid"
                    value={goldPaid}
                    onChange={(e) => setGoldPaid(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>Remaining Gold</td>
                <td>{remainingGold || 0}</td>
              </tr>
              {inCash ? (
                <>
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
                        value={cashPaid}
                        onChange={(e) => setCashPaid(e.target.value)}
                        className={style.cashpaid}
                        type="number"
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
        </div>
        <div className={style.footer}>
          <h4 className={style.incashBtn} onClick={() => handleIncash()}>
            In cash
          </h4>
          <button className={style.saveData}>Save the Data</button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
