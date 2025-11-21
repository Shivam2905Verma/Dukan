import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { AppContext } from "../Context/ChainContext";
import style from "../Css/home.module.css";
import { useState } from "react";
import Card from "../Components/Card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { api, dateInput, setDateinput } = useContext(AppContext);
  const navigate = useNavigate()
  let [allData, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/data/todays_transactions", {
          params: {
            dateInput,
          },
        });
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dateInput]);

  return (
    <div className={style.conatiner}>
      <div className={style.newTransaction} onClick={()=>navigate("/chain")}> + New Transaction</div>
      <div className={style.top}>
        <h4>Todays Transactions</h4>
        <input
        className={style.dateInput}
          type="date"
          value={dateInput}
          onChange={(e) => setDateinput(e.target.value)}
        />
      </div>
      <div className={style.allTransactions}>
        {allData.length != 0 ? (
          allData.map((e) => {
            let eDate = e.date;
            return (
              <Card
                key={e._id}
                id={e._id}
                name={e.name}
                date={eDate.split("T")[0]}
              />
            );
          })
        ) : (
          <div>
            <h2>No Transactions</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
