import { Link } from "react-router-dom";
import style from "../Css/card.module.css";

const Card = ({ id, name, date }) => {
  return (
    <Link to={`/detailTran/${id}`} className={style.link}>
      <div className={style.container}>
        <h3>{name}</h3>
        <h4>{date}</h4>
      </div>
    </Link>
  );
};

export default Card;
