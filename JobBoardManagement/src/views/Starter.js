import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import TopCards from "../components/dashboard/TopCards";
import { useEffect, useState } from "react";
import axiosRequest from "../configs/axiosConfig";

const Starter = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    axiosRequest
      .get("/dashboard/stats")
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the dashboard stats!",
          error
        );
      });
  }, []);
  return (
    <div>
      {/***Top Cards***/}
      <Row>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-success text-success"
            title="Profit"
            subtitle="Total Users"
            earning={stats.totalUsers}
            icon="bi bi-wallet"
          />
        </Col>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-danger text-danger"
            title="Refunds"
            subtitle="Total Blogs"
            earning={stats.totalBlogs}
            icon="bi bi-coin"
          />
        </Col>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-warning text-warning"
            title="New Project"
            subtitle="Total Quizzes"
            earning={stats.totalQuizzes}
            icon="bi bi-basket3"
          />
        </Col>
      </Row>
      {/***Sales & Feed***/}
      <Row>
        <Col sm="6" lg="6" xl="7" xxl="12">
          <SalesChart />
        </Col>
      </Row>
      {/***Table ***/}

      {/***Blog Cards***/}
    </div>
  );
};

export default Starter;
