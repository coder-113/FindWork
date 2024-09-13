// src/components/Tables.js
import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { Row, Col, Card, CardTitle } from "reactstrap";
import Forms from "./Forms";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../../features/blogs/blogSlice";

const Tables = () => {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogs);
  const blogStatus = useSelector((state) => state.blogs.status);

  useEffect(() => {
    if (blogStatus === "idle") {
      dispatch(fetchBlogs());
    }
  }, [blogStatus, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  const handleEdit = (id) => {
    history.push(`/edit-blog/${id}`);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.title}
        </div>
      ),
    },
    {
      name: "Image",
      selector: (row) => row.imageUrl,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          <img
            src={row.imageUrl}
            alt={row.title}
            style={{ maxWidth: "100px" }}
          />
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleEdit(row.id)}
            style={{ marginRight: "10px" }}
            className="btn btn-info"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Row>
      <Col lg="12">
        <Forms />
      </Col>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Blog List
          </CardTitle>  
          <DataTable columns={columns} data={blogData} />
        </Card>
      </Col>
    </Row>
  );
};

export default Tables;
