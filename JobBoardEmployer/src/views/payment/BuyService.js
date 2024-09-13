import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CCol,
  CRow,
} from '@coreui/react';
import axios from 'axios';

const BuyServices = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8080/api/payment/status', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Subscriptions:', response.data);  // Thêm dòng này
          setSubscriptions(response.data);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
        }
      }
    };

    fetchSubscription();
  }, []);


  useEffect(() => {
    if (subscriptions.length > 0) {
      console.log('Checking if services are purchased:');
      [30, 70, 100, 'CVFULL', 'HOT'].forEach(serviceName => {
        isServicePurchased(serviceName);
      });
    }
  }, [subscriptions]);

  const handleBuyNow = async (total, packageId) => {
    setLoadingStates(prevState => ({
      ...prevState,
      [packageId]: true,
    }));
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8080/api/payment/pay', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            total: total,
          },
        });
        console.log('Payment successful:', response.data);
        window.location.href = response.data;
      } catch (error) {
        console.error('Payment failed:', error);
        setLoadingStates(prevState => ({
          ...prevState,
          [packageId]: false,
        }));
      }
    } else {
      console.error('Token not found. User not authenticated.');
      setLoadingStates(prevState => ({
        ...prevState,
        [packageId]: false,
      }));
      window.location.href = '/login';
    }
  };

  const isServicePurchased = (serviceName) => {
    const purchased = subscriptions.some(sub => {
      if (serviceName === '30' || serviceName === '70' || serviceName === '100') {
        return sub.postLimit === parseInt(serviceName.split('_')[0]);
      } else {
        return sub.service === serviceName;
      }
    });
    console.log(`Service: ${serviceName}, Purchased: ${purchased}`);
    return purchased;
  };



  const renderPackageCard = (title, money, description, price, packageId, serviceName) => (
    <CCol xs={12} md={4} key={packageId}>
      <CCard className="service-card">
        <CCardBody>
          <CCardTitle className="package-title">{title}</CCardTitle>
          <CCardTitle className="package-money">{money}</CCardTitle>
          <CCardText>{description}</CCardText>
          {isServicePurchased(serviceName) ? (
            <CButton color="secondary" disabled>
              You have already purchased this package. Please wait until it expires.
            </CButton>
          ) : (
            <CButton
              color="primary"
              className="buy-now-button"
              onClick={() => handleBuyNow(price, packageId)}
              disabled={loadingStates[packageId]}
            >
              {loadingStates[packageId] ? 'Processing...' : 'Buy Now'}
            </CButton>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  );

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <p className="text-body-secondary small">
              Discover our comprehensive range of job posting packages tailored to meet your recruitment needs. Whether you're looking to fill a single role or expand your team, our packages offer flexible options designed to maximize visibility and attract top talent. Explore now and streamline your hiring process with ease.
            </p>

            <CRow>
              {renderPackageCard(
                '30 POSTS PER MONTH PACKAGE',
                '10$',
                'Enjoy 30 posts per month for just $10. Easy payment via PayPal.',
                10,
                'package1',
                '30'
                              )}
              {renderPackageCard(
                '70 POSTS PER MONTH PACKAGE',
                '20$',
                'Get 70 posts per month for only $20. Simple PayPal payment.',
                20,
                'package2',
                '70'
              )}
              {renderPackageCard(
                '100 POSTS PER MONTH PACKAGE',
                '29$',
                'Post 100 jobs per month for just $29. Convenient PayPal payment.',
                29,
                'package3',
                '100'
              )}
              {renderPackageCard(
                'FULL CANDIDATE INFO PACKAGE',
                '15$',
                'Access complete candidate profiles for only $15. PayPal payment available.',
                15,
                'package4',
                'CVFULL'
              )}
              {renderPackageCard(
                'HOT LABEL RECRUITMENT PACKAGE',
                '9$',
                'Add a hot label to your job title for just $9. Easy payment via PayPal.',
                9,
                'package5',
                'HOT'
              )}
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BuyServices;

// Inline CSS
const style = document.createElement('style');
style.textContent = `
  .service-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .service-card:hover {
    transform: translateY(-5px);
  }

  .package-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .package-money {
    font-size: 1.5rem;
    font-weight: bold;
    color: #28a745;
    margin-bottom: 1rem;
  }

  .buy-now-button {
    margin-top: auto; /* Push button to the bottom of the card */
    background-color: #28a745;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  }

  .buy-now-button:hover {
    background-color: #218838;
  }

  .service-card .CCardBody {
    padding: 1.5rem;
    text-align: center;
  }

  .text-body-secondary {
    margin-bottom: 2rem;
  }
`;
document.head.append(style);
