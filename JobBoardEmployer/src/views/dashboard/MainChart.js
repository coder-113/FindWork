import React, { useEffect, useRef, useState } from 'react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
} from '@coreui/react';

const monthOrder = {
  'JANUARY': 1,
  'FEBRUARY': 2,
  'MARCH': 3,
  'APRIL': 4,
  'MAY': 5,
  'JUNE': 6,
  'JULY': 7,
  'AUGUST': 8,
  'SEPTEMBER': 9,
  'OCTOBER': 10,
  'NOVEMBER': 11,
  'DECEMBER': 12
};

const MainChart = () => {
  const chartRef = useRef(null);
  const [filterType, setFilterType] = useState('MONTH');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'CV',
        backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        data: [],
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken.company;

        const response = await axios.get('http://localhost:8080/api/job-applications/api/chart-data', {
          params: { companyId: companyId, filterType: filterType },
        });

        const data = response.data;

        // Sắp xếp dữ liệu theo tháng
        const sortedData = data.labels
          .map((label, index) => ({ label, value: data.dataset1[index] }))
          .sort((a, b) => monthOrder[a.label] - monthOrder[b.label]);

        setChartData({
          labels: sortedData.map(item => item.label),
          datasets: [
            {
              ...chartData.datasets[0],
              data: sortedData.map(item => item.value),
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();

    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent'
          );
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent');
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color');
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent'
          );
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent');
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color');
          chartRef.current.update();
        });
      }
    });
  }, [chartRef, filterType]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <CFormSelect value={filterType} onChange={handleFilterChange}>
              <option value="MONTH">Month</option>
              <option value="DAY">Day</option>
            </CFormSelect>
          </CCardHeader>
          <CCardBody>
            <CChartLine
              ref={chartRef}
              style={{ height: '300px', marginTop: '40px' }}
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: getStyle('--cui-border-color-translucent'),
                      drawOnChartArea: false,
                    },
                    ticks: {
                      color: getStyle('--cui-body-color'),
                    },
                  },
                  y: {
                    beginAtZero: true,
                    border: {
                      color: getStyle('--cui-border-color-translucent'),
                    },
                    grid: {
                      color: getStyle('--cui-border-color-translucent'),
                    },
                    max: 50,
                    ticks: {
                      color: getStyle('--cui-body-color'),
                      maxTicksLimit: 5,
                      stepSize: Math.ceil(50 / 5),
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default MainChart;
