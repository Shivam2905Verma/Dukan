import { useContext, useEffect, useState } from "react";
import style from "../Css/search.module.css";
import { AppContext } from "../Context/ChainContext";
import Card from "../Components/Card";

const Search = () => {
  const { api, search, setSearch } = useContext(AppContext);

  const [allData, setData] = useState("");
  const [dropDwonData, setDropDwonData] = useState();
  const [showDropdown, setshowDropdown] = useState(false);

  const handleSelectName = (name) => {
    setshowDropdown(false);
    setSearch(name);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!search.trim()) {
        setData([]);
        setDropDwonData([]);
        setshowDropdown(false);
        return;
      }

      try {
        const response = await api.get("/data/search", { params: { search } });
        const dropDownResponse = await api.get("/data/searchedNames", { params: { search } });

        setData(response.data);
        setDropDwonData(dropDownResponse.data);
        setshowDropdown(dropDownResponse.data.length > 0);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div className={style.cointainer}>
      <div className={style.searchbox}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />

        <div
          className={`${style.dropDown} ${
            search && dropDwonData?.length > 0 ? style.open : ""
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

export default Search;
