import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const JobFilter = () => {
  const [searchTerms, setSearchTerms] = useState("");
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của Enter
      handleSearch(); // Thực hiện tìm kiếm
      // setOpen(false); // Đóng dropdown sau khi nhấn Enter
    }
  };

  const handleSearch = () => {
    const trimmedSearchTerms = searchTerms.trim();
    if (trimmedSearchTerms) {
      // Nếu có từ khóa tìm kiếm, điều hướng đến URL với từ khóa tìm kiếm
      navigate(`/viewAllJobs/${encodeURIComponent(trimmedSearchTerms)}`);
    } else {
      // Nếu không có từ khóa tìm kiếm, điều hướng đến URL không có từ khóa
      navigate(`/viewAllJobs`);
    }
  };

  const trendingKeywords = [
    { categoryId: 9, categoryName: "Java" },
    { categoryId: 22, categoryName: "Python" },
    { categoryId: 13, categoryName: "ReactJS" },
  ];

  const handleKeywordClick = (categoryId) => {
    // Điều hướng đến URL với categoryId
    navigate(`/jobList/${categoryId}`);
  };

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-12">
          <div className="mb-5 text-center">
            <h1 className="text-white font-weight-bold">
              The Easiest Way To Get Your Dream Job
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Cupiditate est, consequuntur perferendis.
            </p>
          </div>
          <form method="post" className="search-jobs-form">
            <div className="row mb-5">
              <div className="col-12 col-sm-8 col-md-9 col-lg-10 mb-4 mb-lg-0">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter keywork skill (Java, iOS...), job title..."
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)} // Cập nhật giá trị tìm kiếm
                  onKeyDown={handleKeyDown} // Xử lý nhấn phím Enter
                />
              </div>

              <div className="col-12 col-sm-4 col-md-3 col-lg-2 mb-4 mb-lg-0">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block text-white btn-search w-100"
                  onClick={handleSearch}
                >
                  <span className="icon-search icon mr-2" />
                  Search Job
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 popular-keywords">
                <h3>Trending Keywords:</h3>
                <ul className="keywords list-unstyled m-0 p-0">
                  {trendingKeywords.map((keyword) => (
                    <li key={keyword.categoryId}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
                          handleKeywordClick(keyword.categoryId); // Gọi hàm để điều hướng
                        }}
                      >
                        {keyword.categoryName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
