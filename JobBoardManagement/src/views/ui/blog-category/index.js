import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Card,
  CardTitle,
  InputGroup,
  InputGroupText,
  Input,
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../../../features/blogSlice";
import { BlogCategoryForm } from "./BlogCategoryForm";
import {
  deleteBlogCategory,
  fetchBlogCategory,
} from "../../../features/blogCategorySlice";
import nprogress from "nprogress";

export function BlogCategory(props) {
  const dispatch = useDispatch();
  const blogCategoryData =
    useSelector((state) => state.blogCategory.blogCategory) || [];
  const blogCategoryStatus = useSelector((state) => state.blogCategory.status);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(null); // Changed initial state to null

  useEffect(() => {
    nprogress.start();
    dispatch(fetchBlogCategory()).then(() => {
      nprogress.done();
    });
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      nprogress.start();
      dispatch(deleteBlogCategory(id)).then(() => {
        nprogress.done();
      });
    }
  };

  const handleEdit = (id) => {
    const editBlog = blogCategoryData.find((item) => item.id === id);
    console.log(editBlog);
    if (editBlog) {
      setIsEdit(editBlog); // Set the state to the selected blog category
    }
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.name}
        </div>
      ),
    },
    {
      name: "Posts",
      selector: (row) => row.blogCount,
      sortable: true,
      cell: (row) => <div>{row.blogCount}</div>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button onClick={() => handleEdit(row.id)} className="btn btn-info">
            Edit
          </button>
          {!row.blogCount > 0 && (
            <button
              onClick={() => handleDelete(row.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center p-3 gap-3">
        <h4>Category List</h4>
        <div className="d-flex  p-3 gap-3">
          <BlogCategoryForm isEdit={isEdit} setIsEdit={setIsEdit} />{" "}
        </div>
      </div>
      <div className="d-flex gap-3 px-2">
        <div className="form-floating" style={{ flex: 1, maxWidth: "400px" }}>
          <Input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label htmlFor="floatingSearch">Search</label>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={blogCategoryData.filter((blog) =>
          blog.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        pagination
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationPerPage={5}
        progressPending={blogCategoryStatus === "loading"}
        progressComponent={<Spinner />}
      />
    </Card>
  );
}

export default BlogCategory;
