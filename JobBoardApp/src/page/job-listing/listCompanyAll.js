import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../features/authSlice";
// import companyData from './company_data.json';
import { fetchCompanyThunk } from "../../features/companySlice";
import "./job_company.css";
import { useTranslation } from "react-i18next";
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
import _ from 'lodash';

export function ViewAllCompany ()
{
    // const [companies, setCompanies] = useState([]);
    const companies = useSelector((state) => state.company.companies);
    const [selectedGroup, setSelectedGroup] = useState('ABC');
    const { t, i18n } = useTranslation(); // Initialize the useTranslation hook
    const user = useSelector((state) => state.auth.user);
    const roles = useSelector((state) => state.auth.roles);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>
    {
        dispatch(logout());
    };

    useEffect(() =>
    {
        dispatch(fetchCompanyThunk());
    }, []);

    // const fetchCompanies = async () =>
    // {
    //     try
    //     {
    //         //const response = await axiosRequest.get("/categories");
    //         setCompanies(companyData);
    //     } catch (error)
    //     {
    //         console.error("Error fetching categories:", error);
    //     }
    // };

    const handleCompanyClick = (e, companyId) =>
    {
        e.preventDefault();
        navigate(`/companyDetail/${companyId}`);
    };

    const alphabetGroups = ['#', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STUV', 'WXYZ'];

    const filterCompaniesByGroup = (group) =>
    {
        if (group === '#')
        {
            return companies.filter(company => /^[0-9]/.test(company.companyName));
        }

        const startChar = group[0];
        const endChar = group[group.length - 1];
        return companies.filter(company =>
        {
            const firstChar = company.companyName[0].toUpperCase();
            return firstChar >= startChar && firstChar <= endChar;
        });
    };

    const filteredCompanies = filterCompaniesByGroup(selectedGroup);
    // Group companies by initial character
    const groupedCompanies = _.groupBy(filteredCompanies, company => company.companyName[0].toUpperCase());
    const sortedInitials = Object.keys(groupedCompanies).sort();

    return (

        <GlobalLayoutUser>
            <>
                <section
                    className="section-hero overlay inner-page bg-image"
                    style={{
                        backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
                    }}
                    id="home-section"
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7">
                                <h1 className="text-white font-weight-bold">Jobs by Company</h1>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Navigation Bar */}
                <div className="jb_alphabet-nav flex justify-center items-center overflow-x-auto bg-gray-100 p-2">
                    {alphabetGroups.map(group => (
                        <button
                            key={group}
                            className={`jb_nav-link ${selectedGroup === group ? 'jb_active' : ''}`}
                            onClick={() => setSelectedGroup(group)}
                        >
                            {group}
                        </button>
                    ))}
                </div>
                <div className="jb_category-grid">
                    {sortedInitials.map(initial => (
                        <div key={initial}>
                            <h2 style={{ fontWeight: 'bold', fontSize: '25px' }}>{initial}</h2>
                            {groupedCompanies[initial].map(company => (
                                <div key={company.companyId} className="jb_category-item">
                                    <NavLink to={''} className="jb_item" onClick={(e) => handleCompanyClick(e, company.companyId)}>
                                        {company.companyName}
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        </GlobalLayoutUser>
    );
}



