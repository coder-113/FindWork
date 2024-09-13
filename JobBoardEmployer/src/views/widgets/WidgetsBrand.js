import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CWidgetStatsD, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCalendar } from '@coreui/icons';
import { CChart } from '@coreui/react-chartjs';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import đúng cách

const WidgetsBrand = (props) => {
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const fetchApplicationCount = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }
        const decodedToken = jwtDecode(token);
        const companyId = decodedToken.company; // Đảm bảo rằng key là đúng

        const response = await axios.get('http://localhost:8080/api/job-applications/applicationCount', {
          params: { companyId },
        });
        setApplicationCount(response.data);
      } catch (error) {
        console.error('Error fetching application count:', error);
      }
    };

    fetchApplicationCount();
  }, []);

  const chartOptions = {
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 },
    },
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  // return (
  // //   <CRow className={props.className} xs={{ gutter: 4 }}>
  // //     <CCol sm={6} xl={4} xxl={3}>
  // //       <CWidgetStatsD
  // //         {...(props.withCharts && {
  // //           chart: (
  // //             <CChart
  // //               className="position-absolute w-100 h-100"
  // //               type="line"
  // //               data={{
  // //                 labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  // //                 datasets: [{
  // //                   backgroundColor: 'rgba(255,255,255,.1)',
  // //                   borderColor: 'rgba(255,255,255,.55)',
  // //                   pointHoverBackgroundColor: '#fff',
  // //                   borderWidth: 2,
  // //                   data: [35, 23, 56, 22, 97, 23, 64],
  // //                   fill: true,
  // //                 }],
  // //               }}
  // //               options={chartOptions}
  // //             />
  // //           ),
  // //         })}
  // //         icon={<CIcon icon={cilCalendar} height={52} className="my-4 text-white" />}
  // //         values={[{ title: 'New Applications', value: applicationCount.toString() }]}
  // //       />
  // //     </CCol>
  // //   </CRow>
  // // );
}

WidgetsBrand.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsBrand;
