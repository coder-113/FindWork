import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Row, Col, Card, CardTitle, InputGroup, InputGroupText, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryQuiz, deleteCategoryQuiz } from "../../../features/quizCategorySlice";
import { CategoryQuizForm } from "./CategoryQuizForm";
import nprogress from "nprogress";

export function CategoryQuiz(props) {
  const dispatch = useDispatch();
  const categoryQuizData = useSelector((state) => state.categoryQuiz.categoryQuiz) || [];
  const categoryQuizStatus = useSelector((state) => state.categoryQuiz.status);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(null); // Changed initial state to null

  useEffect(() => {
    nprogress.start();
    dispatch(fetchCategoryQuiz()).then(() => {
      nprogress.done();
    });
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      nprogress.start();
      dispatch(deleteCategoryQuiz(id)).then(() => {
        nprogress.done();
      });
    }
  };

  const handleEdit = (id) => {
    const editCategory = categoryQuizData.find((item) => item.id === id);
    console.log(editCategory);
    if (editCategory) {
      setIsEdit(editCategory); // Set the state to the selected category
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
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button onClick={() => handleEdit(row.id)} className="btn btn-info">
            Edit
          </button>
          {!row.quizCount > 0 && (
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
    <Row>
      <Col lg="12">
        <CategoryQuizForm isEdit={isEdit} setIsEdit={setIsEdit} />{" "}
        {/* Pass isEdit and setIsEdit as props */}
      </Col>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"> </i>
            Category Quiz List
          </CardTitle>
          <InputGroup className="mb-3">
            <InputGroupText>Search</InputGroupText>
            <Input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <DataTable
            columns={columns}
            data={categoryQuizData.filter((category) =>
                category.name?.toLowerCase().includes(searchTerm.toLowerCase())
              )}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default CategoryQuiz;
