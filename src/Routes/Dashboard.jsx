import { useContext, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import Pagination from "../Components/Pagination";
import { AppContext } from "../Context/AppContext";

function Dashboard() {
  const [data, setData] = useState([]);
  const [searchpage, setSearchpage] = useSearchParams();
  const [page, setPage] = useState(Number(searchpage.get("page")) || 1);
  const [state, dispatch] = useContext(AppContext);
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=10`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  }, [page]);
  console.log(data);
  useEffect(() => {
    setSearchpage({
      page
    });
  }, [page]);
  const handlelogout = () => {
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {
        token: null
      },
      isAuth: false
    });
    <Navigate to="/login" />;
  };
  return (
    <div>
      <h3>Dashboard</h3>
      <h4 data-testid="token">TOKEN {state.token}</h4>
      <button data-testid="logout-btn" onClick={handlelogout}>
        Logout
      </button>
      <ul data-testid="item-container">
        {data.map((item) => (
          <li data-testid="item">{item.title}</li>
        ))}
      </ul>
      <div data-testid="pagination-container">
        <Pagination current={page} changePage={setPage} total={10} />
      </div>
    </div>
  );
}

export default Dashboard;
