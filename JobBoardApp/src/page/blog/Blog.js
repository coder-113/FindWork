import React, { useEffect, useState, useCallback } from "react";
import { GlobalLayoutUser } from "../../components/global-layout-user/GlobalLayoutUser";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { calculateReadingTime } from "../../utils/function/readingTime";
import { Badge, Input } from "reactstrap";
import { motion } from "framer-motion";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPopular, fetchBlogs } from "../../features/blogSlice";
import "./style.css";
import { FaHome } from "react-icons/fa";
import { BlogPagination } from "./BlogPagination";
import { Spinner } from "react-bootstrap";
import { PopularBlogCard } from "./PopularBlogCard";
import { BlogCard } from "./BlogCard";
import { ViewedBlogCard } from "./ViewedBlogCard";

export const Blog = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogsFilter);
  const popular = useSelector((state) => state.blogs.popular);
  const status = useSelector((state) => state.blogs.status);
  const totalPages = useSelector((state) => state.blogs.totalPages);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [order, setOrder] = useState("asc");

  const postsPerPage = 9;
  const navigate = useNavigate();
  const type = searchParams.get("type") ?? "ALL";
  const query = searchParams.get("query");
  const [searchText, setSearchText] = useState(query || "");

  const debouncedSearch = useCallback(
    debounce((query, order, type, page, size) => {
      dispatch(
        fetchBlogs({
          query,
          page,
          size,
          type,
          order,
        })
      );
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);
    setSearchParams({ query: newSearchText, order, type });
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    debouncedSearch(searchText, order, type, currentPage, postsPerPage);
  }, [debouncedSearch, searchText, order, type, currentPage, postsPerPage]);

  useEffect(() => {
    dispatch(fetchBlogPopular());
  }, [dispatch]);

  const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs")) || [];

  const paginate = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <GlobalLayoutUser>
      <>
        <motion.section
          className="section-hero overlay inner-page bg-image"
          style={{
            backgroundImage: 'url("../../../../assets/images/hero_1.jpg")',
          }}
          id="home-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-10">
                <motion.h3
                  className="text-white font-weight-bold title is-3"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  ITGrove Blog - Ideas to develop your IT career
                </motion.h3>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="row"
                >
                  <Input
                    className="form-control form-control-lg col-lg-8 col-md-6 col-sm-12"
                    placeholder="Enter search keywords..."
                    onChange={handleSearchChange}
                    value={searchText ? searchText : ""}
                  />

                  <Input
                    id="orderSelect"
                    type="select"
                    className="form-select form-control-lg col-lg-4 col-md-6 col-sm-12"
                    value={order}
                    onChange={(e) => {
                      setOrder(e.target.value);
                      debouncedSearch(searchText); // Trigger the search again with the new order
                    }}
                  >
                    <option value="" disabled>
                      Sort by date
                    </option>
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </Input>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
        <section className="section is-small">
          <div className="container">
            <h3 className="title is-3 mb-4">
              #{order === "desc" ? "Newest" : "Oldest"}
            </h3>
            {status === "succeeded" && blogs.length > 0 ? (
              <React.Fragment>
                <div className="row mb-5">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                <BlogPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </React.Fragment>
            ) : (
              status === "succeeded" && (
                <div
                  className="d-flex justify-content-center flex-column align-items-center content"
                  style={{
                    height: 350,
                  }}
                >
                  <h1 className="text-primary">Something's wrong here...</h1>
                  <p className="">
                    We can't find any result for your search term.
                  </p>
                  <button
                    className="btn btn-primary mt-3 "
                    onClick={() => navigate("/")}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <FaHome className="mr-2" /> Go back to home
                    </div>
                  </button>
                </div>
              )
            )}
          </div>

          {status === "loading" && (
            <div
              className="d-flex justify-content-center flex-column align-items-center content"
              style={{
                height: 350,
              }}
            >
              <Spinner />
            </div>
          )}
          <div className="container">
            <h3 className="title is-3 mb-4">#Most view</h3>
            {status === "succeeded" && popular.length > 0 && (
              <div className="row mb-5">
                {popular.map((blog) => (
                  <PopularBlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>

          {status === "succeeded" && viewedBlogs.length > 0 && (
            <div className="container">
              <h3 className="title is-3 mb-4">#Recently viewed blogs</h3>
              <div className="row mb-5">
                {viewedBlogs.map((blog) => (
                  <ViewedBlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          )}
        </section>
      </>
    </GlobalLayoutUser>
  );
};

export default Blog;
