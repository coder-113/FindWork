import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
  const widgetChartRef3 = useRef(null);
  const widgetChartRef4 = useRef(null);

  const [jobCount, setJobCount] = useState(0);
  const [cvCount, setCvCount] = useState(0);
  const [newCvCount, setNewCvCount] = useState(0);
  const [approvedCvCount, setApprovedCvCount] = useState(0);

  const [previousJobCount, setPreviousJobCount] = useState(null);
  const [previousCvCount, setPreviousCvCount] = useState(null);
  const [previousNewCvCount, setPreviousNewCvCount] = useState(null);
  const [previousApprovedCvCount, setPreviousApprovedCvCount] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          const decodedToken = jwtDecode(accessToken);
          const companyId = decodedToken.company;

          // Fetch job count
          const jobResponse = await axios.get('http://localhost:8080/api/job-applications/applicationCount', {
            params: { companyId },
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const currentJobCount = jobResponse.data;
          setJobCount(currentJobCount);

          // Fetch CV count
          const cvResponse = await axios.get('http://localhost:8080/api/jobs/count', {
            params: { userId: decodedToken.id },
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const currentCvCount = cvResponse.data;
          setCvCount(currentCvCount);

          // Fetch new CV count
          const newCvResponse = await axios.get('http://localhost:8080/api/job-applications/newCount', {
            params: { companyId },
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const currentNewCvCount = newCvResponse.data;
          setNewCvCount(currentNewCvCount);

          // Fetch approved CV count
          const approvedCvResponse = await axios.get('http://localhost:8080/api/job-applications/approvedCount', {
            params: { companyId },
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const currentApprovedCvCount = approvedCvResponse.data;
          setApprovedCvCount(currentApprovedCvCount);

          // Set previous counts
          if (previousJobCount !== null) {
            console.log('Job count changed:', currentJobCount - previousJobCount);
          }
          if (previousCvCount !== null) {
            console.log('CV count changed:', currentCvCount - previousCvCount);
          }
          if (previousNewCvCount !== null) {
            console.log('New CV count changed:', currentNewCvCount - previousNewCvCount);
          }
          if (previousApprovedCvCount !== null) {
            console.log('Approved CV count changed:', currentApprovedCvCount - previousApprovedCvCount);
          }

          setPreviousJobCount(currentJobCount);
          setPreviousCvCount(currentCvCount);
          setPreviousNewCvCount(currentNewCvCount);
          setPreviousApprovedCvCount(currentApprovedCvCount);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary');
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info');
          widgetChartRef2.current.update();
        });
      }

      if (widgetChartRef3.current) {
        setTimeout(() => {
          widgetChartRef3.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-success');
          widgetChartRef3.current.update();
        });
      }

      if (widgetChartRef4.current) {
        setTimeout(() => {
          widgetChartRef4.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-warning');
          widgetChartRef4.current.update();
        });
      }
    });
  }, [accessToken, previousJobCount, previousCvCount, previousNewCvCount, previousApprovedCvCount]);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {jobCount}
              <span className="fs-6 fw-normal">
                {previousJobCount !== null && jobCount > previousJobCount ? (
                  <span className="text-success">
                    (+{((jobCount - previousJobCount) / previousJobCount * 100).toFixed(1)}% <CIcon icon={cilArrowTop} />)
                  </span>
                ) : previousJobCount !== null && jobCount < previousJobCount ? (
                  <span className="text-danger">
                    ({((jobCount - previousJobCount) / previousJobCount * 100).toFixed(1)}% <CIcon icon={cilArrowBottom} />)
                  </span>
                ) : (
                  <span className="fs-6 fw-normal">No change</span>
                )}
              </span>
            </>
          }
          title="CV"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {cvCount}
              <span className="fs-6 fw-normal">
                {previousCvCount !== null && cvCount > previousCvCount ? (
                  <span className="text-success">
                    (+{((cvCount - previousCvCount) / previousCvCount * 100).toFixed(1)}% <CIcon icon={cilArrowTop} />)
                  </span>
                ) : previousCvCount !== null && cvCount < previousCvCount ? (
                  <span className="text-danger">
                    ({((cvCount - previousCvCount) / previousCvCount * 100).toFixed(1)}% <CIcon icon={cilArrowBottom} />)
                  </span>
                ) : (
                  <span className="fs-6 fw-normal">No change</span>
                )}
              </span>
            </>
          }
          title="Jobs"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="success"
          value={
            <>
              {newCvCount}
              <span className="fs-6 fw-normal">
                {previousNewCvCount !== null && newCvCount > previousNewCvCount ? (
                  <span className="text-success">
                    (+{((newCvCount - previousNewCvCount) / previousNewCvCount * 100).toFixed(1)}% <CIcon icon={cilArrowTop} />)
                  </span>
                ) : previousNewCvCount !== null && newCvCount < previousNewCvCount ? (
                  <span className="text-danger">
                    ({((newCvCount - previousNewCvCount) / previousNewCvCount * 100).toFixed(1)}% <CIcon icon={cilArrowBottom} />)
                  </span>
                ) : (
                  <span className="fs-6 fw-normal">No change</span>
                )}
              </span>
            </>
          }
          title="New CVs"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef3}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'New CVs',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-success'),
                    data: [10, 20, 15, 25, 30, 20, 35], // Placeholder data
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    max: 40,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {approvedCvCount}
              <span className="fs-6 fw-normal">
                {previousApprovedCvCount !== null && approvedCvCount > previousApprovedCvCount ? (
                  <span className="text-success">
                    (+{((approvedCvCount - previousApprovedCvCount) / previousApprovedCvCount * 100).toFixed(1)}% <CIcon icon={cilArrowTop} />)
                  </span>
                ) : previousApprovedCvCount !== null && approvedCvCount < previousApprovedCvCount ? (
                  <span className="text-danger">
                    ({((approvedCvCount - previousApprovedCvCount) / previousApprovedCvCount * 100).toFixed(1)}% <CIcon icon={cilArrowBottom} />)
                  </span>
                ) : (
                  <span className="fs-6 fw-normal">No change</span>
                )}
              </span>
            </>
          }
          title="Approved CVs"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef4}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Approved CVs',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-warning'),
                    data: [5, 15, 10, 20, 25, 18, 30], // Placeholder data
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 0,
                    max: 35,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
