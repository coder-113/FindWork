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
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobCategory,
  fetchJobCategory,
} from "../../../features/jobCategorySlice";
import { JobCategoryForm } from "./JobCategoryForm";

export function JobCategory(props) {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.jobCategory.list) || [];
  const blogCategoryStatus = useSelector((state) => state.jobCategory.status);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(null); // Changed initial state to null

  useEffect(() => {
    dispatch(fetchJobCategory());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteJobCategory(id));
    }
  };

  const handleEdit = (id) => {
    const editBlog = list.find((item) => item.categoryId === id);
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
          {row.categoryName}
        </div>
      ),
    },
    // {
    //   name: "Posts",
    //   selector: (row) => row.blogCount,
    //   sortable: true,
    //   cell: (row) => <div>{row.blogCount}</div>,
    // },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button onClick={() => handleEdit(row.categoryId)} className="btn btn-info">
            Edit
          </button>
          {!row.blogCount > 0 && (
            <button
              onClick={() => handleDelete(row.categoryId)}
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
    <Row>
      <Col lg="12">
        <JobCategoryForm isEdit={isEdit} setIsEdit={setIsEdit} />{" "}
        {/* Pass isEdit and setIsEdit as props */}
      </Col>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Blog List
          </CardTitle>
          <InputGroup className="mb-3">
            <InputGroupText>Search</InputGroupText>
            <Input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <DataTable
            columns={columns}
            data={list.filter((blog) =>
              blog.categoryName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default JobCategory;
