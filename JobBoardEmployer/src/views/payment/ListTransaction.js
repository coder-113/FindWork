import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { CButton, CCol, CContainer, CRow } from "@coreui/react";


const ListTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:8080/api/transcation/${userId}`);
        setTransactions(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch transactions");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <CContainer className="list-transaction-container">
      <CRow className="mb-4">
        <CCol lg="12">
          <h4 className="display-4">List of Purchased Packages</h4>
        </CCol>
      </CRow>
      <CRow>
        {transactions.map((transaction) => (
          <CCol lg="4" key={transaction.id} className="mb-4">
            <div className="transaction-card">
              <div className="transaction-header">Transaction ID: {transaction.id}</div>
              <div className="transaction-body">
                <p><strong>Amount:</strong> {transaction.amount}</p>
                <p><strong>Post Limit:</strong> {transaction.postLimit}</p>
                <p><strong>Start Date:</strong> {transaction.startDate}</p>
                <p><strong>End Date:</strong> {transaction.endDate}</p>
              </div>
            </div>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  );
};

export default ListTransaction;
