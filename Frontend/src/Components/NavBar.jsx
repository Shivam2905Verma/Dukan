import { use, useState } from "react";
import style from "../Css/navbar.module.css";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  let newDate = new Date();

  let navigate = useNavigate();

  return (
    <div className={style.container}>
      <h2>Thakkar Jewellers</h2>
      <div className={style.right}>
      <h4 onClick={()=>navigate("/")}>Home</h4>
      <h4 onClick={()=>navigate("/search")}>Search</h4>
      </div>
    </div>
  );
};

export default NavBar;
