import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import axiosRequest from "../../configs/axiosConfig";

const SalesChart = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [userChartData, setUserChartData] = useState({
    series: [
      {
        name: "User Registrations",
        data: [], // Registration counts
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: [], // Months
      },
      title: {
        text: `User Registrations for ${year}`,
      },
    },
  });
  const [blogChartData, setBlogChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "line",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      title: {
        text: `Blog Posts per Month by User in ${year}`,
      },
    },
  });

  const fetchData = async () => {
    try {
      // Fetch user registration data
      const userRegistrationData = await axiosRequest.get(
        "/user/registration-count/year",
        {
          params: { year },
        }
      );

      const userCategories = userRegistrationData.map((item) => item.month);
      const userSeriesData = userRegistrationData.map((item) => item.count);

      setUserChartData({
        series: [
          {
            name: "User Registrations",
            data: userSeriesData,
          },
        ],
        options: {
          ...userChartData.options,
          xaxis: {
            categories: userCategories,
          },
        },
      });

      // Fetch blog posts data
      const blogPostsData = await axiosRequest.get(
        `/blogs/count-by-user-and-month?year=${year}`
      );
      const users = Array.from(new Set(blogPostsData.map((bc) => bc.username)));

      const blogSeries = users.map((user) => {
        return {
          name: user,
          data: Array.from({ length: 12 }, (_, i) => {
            const countData = blogPostsData.find(
              (bc) => bc.username === user && bc.month === i + 1
            );
            return countData ? countData.count : 0;
          }),
        };
      });

      setBlogChartData({
        series: blogSeries,
        options: {
          ...blogChartData.options,
          title: {
            text: `Blog Posts per Month by Moderator in ${year}`,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch on component mount
  }, []);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleFetchData = () => {
    fetchData(); // Fetch data when the button is clicked
  };

  return (
    <Card>
      <CardBody>
        <div className="mb-4">
          <CardTitle tag="h5">Data Overview</CardTitle>
          <CardSubtitle className="text-muted" tag="h6">
            Select a year to view charts for user registrations and blog posts.
          </CardSubtitle>
        </div>
        <div className="d-flex align-items-center mb-4">
          <FormGroup className="mr-3">
            <Label for="yearInput">Select Year:</Label>
            <Input
              id="yearInput"
              type="number"
              value={year}
              onChange={handleYearChange}
              min="2000"
              max={new Date().getFullYear()}
              placeholder="Enter year"
            />
          </FormGroup>
          <Button color="primary" onClick={handleFetchData} className="mt-3">
            Fetch Data
          </Button>
        </div>
        <div className="mt-4">
          <Chart
            options={userChartData.options}
            series={userChartData.series}
            type="area"
            height="350"
          />
        </div>
        <div className="mt-4">
          <Chart
            options={blogChartData.options}
            series={blogChartData.series}
            type="area"
            height="350"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default SalesChart;
