import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosRequest from "../../configs/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryThunk } from "../../features/categorySlice";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../features/authSlice";
import "./job_company.css";
import { useTranslation } from "react-i18next";
import { GlobalLayoutUser } from '../../components/global-layout-user/GlobalLayoutUser';
export function ViewAllSkill ()
{
    // const [categories, setCategories] = useState([]);
    const { t, i18n } = useTranslation(); // Initialize the useTranslation hook
    const user = useSelector((state) => state.auth.user);
    const roles = useSelector((state) => state.auth.roles);
    const categories = useSelector((state) => state.category.categories);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>
    {
        dispatch(logout());
    };

    useEffect(() =>
    {
        if (categories.length === 0)
        {
            dispatch(fetchCategoryThunk());
        }
    }, []);

    const handleCategoryClick = (e, categoryId) =>
    {
        e.preventDefault();
        navigate(`/jobList/${categoryId}`);
    };
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
                                <h1 className="text-white font-weight-bold">Jobs by Skill</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="jb_category-grid">
                    {categories.map((category) => (
                        <div key={category.categoryId} className="jb_category-item">
                            <NavLink to={''} className="jb_item" onClick={(e) => handleCategoryClick(e, category.categoryId)}>
                                {category.categoryName}
                            </NavLink>
                        </div>
                    ))}
                </div>
            </>
        </GlobalLayoutUser>
    );
}
