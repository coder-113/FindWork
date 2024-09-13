import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Card,
  CardTitle,
  InputGroup,
  InputGroupText,
  Input,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  FormGroup,
  Label,
  Select,
  Spinner,
  CardBody,
} from "reactstrap";
import { CSVLink } from "react-csv";
import Form from "../blog/FormBlog";
import { useDispatch, useSelector } from "react-redux";
import {
  searchBlogs,
  deleteBlog,
  getHashTags,
  updateIsArchiveStatusThunk,
} from "../../../features/blogSlice";
import debounce from "lodash.debounce";
import {
  FaEdit,
  FaFileExcel,
  FaRemoveFormat,
  FaTrash,
  FaTrashRestore,
} from "react-icons/fa";
import "../blog/style.css";
import { fetchBlogCategory } from "../../../features/blogCategorySlice";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";
import { getExcelData } from "../../../services/blog_service";
import { hasPermission } from "../../../utils/functions/hasPermission";
const isArchive = 1;

export function Blog(props) {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogs);
  const totalPages = useSelector((state) => state.blogs.totalPages);
  const status = useSelector((state) => state.blogs.status);
  const blogCategoryData = useSelector(
    (state) => state.blogCategory.blogCategory
  );
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedVisibility, setSelectedVisibility] = useState(2); // Default to 'All'
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isEdit, setIsEdit] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // New state for selected rows
  const encodedCategoryValue = encodeURIComponent(selectedCategory);

  const debouncedSearch = useCallback(
    debounce((query, type, visibility, archive, page, size) => {
      dispatch(
        searchBlogs({
          query,
          type,
          page,
          size,
          visibility,
          archive,
        })
      );
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(
      searchTerm,
      encodedCategoryValue,
      selectedVisibility,
      isArchive,
      currentPage,
      pageSize
    );
  }, [
    debouncedSearch,
    searchTerm,
    selectedCategory,
    selectedVisibility,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    dispatch(fetchBlogCategory());
  }, [dispatch]);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBlog(id)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            Swal.fire("Deleted!", "Your blog has been deleted.", "success");
          }
        });
      }
    });
  };

  const handleEdit = (id) => {
    const existBlog = blogData.find((item) => item.id === id);
    if (existBlog) {
      setIsEdit(existBlog);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleVisibilityChange = (e) => {
    setSelectedVisibility(e.target.value);
  };

  const handlePerRowsChange = (newPageSize, page) => {
    setPageSize(newPageSize);
    setCurrentPage(page - 1);
  };

  const handleRowSelected = (selectedRows) => {
    setSelectedRows(selectedRows.selectedRows);
  };

  const handleArchiveSelected = () => {
    const selectedIds = selectedRows.map((row) => row.id);
    if (selectedIds.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one blog to restore.",
        "warning"
      );
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You are about to restore the selected blogs.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateIsArchiveStatusThunk({
            selectedIds,
            status: 0,
          })
        ).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            Swal.fire(
              "Restored!",
              "The selected blogs have been restored.",
              "success"
            );
            setSelectedRows([]); // Clear selected rows
            navigate("/jobportal/blog");
          }
        });
      }
    });
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      width: "300px",
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontWeight: "bold",
          }}
          className="text-truncate-multiline"
        >
          [{row.id}] {row.title}
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.categories.length,
      sortable: true,
      cell: (row) => {
        return (
          <div>
            {row.categories.map((item) => (
              <Badge
                color="primary"
                key={item.id}
                style={{ margin: "0 5px 5px 0" }}
              >
                {item.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      name: "Visibility",
      selector: (row) => row.visibility,
      sortable: true,
      cell: (row) => {
        return (
          <Badge color={row.visibility ? "info" : "danger"}>
            {row.visibility ? "Show" : "Hide"}
          </Badge>
        );
      },
    },
    {
      name: "Posted By",
      width: "300px",
      cell: (row) => (
        <div>
          {row.user.firstName} {row.user.lastName}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            color="success"
            onClick={() => handleEdit(row.id)}
            style={{
              marginRight: 3,
            }}
          >
            <FaEdit />
          </Button>
          <Button color="danger" onClick={() => handleDelete(row.id)}>
            <FaTrash />
          </Button>
        </>
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        padding: "15px 0",
      },
    },
  };
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getHashTags());
  }, []);

  if (
    hasPermission(user.role, user.permission, "ROLE_MODERATOR", "MANAGE_BLOG")
  ) {
    return <Navigate to="/" />;
  }

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center p-3 gap-3">
        <h4>Archive</h4>
        <div className="d-flex  p-3 gap-3">
          <Form isEdit={isEdit} setIsEdit={setIsEdit} />
          <Button
            color="success"
            onClick={getExcelData}
            className="d-flex align-items-center"
            style={{
              backgroundColor: "green",
            }}
          >
            <FaFileExcel
              style={{
                marginRight: 5,
              }}
            />
            Export CSV
          </Button>
          <Button
            color="warning"
            onClick={handleArchiveSelected}
            className="d-flex align-items-center"
          >
            <FaTrashRestore
              style={{
                marginRight: 5,
              }}
            />
            Restore
          </Button>
        </div>
      </div>
      <div className="d-flex gap-3 px-2">
        <div className="form-floating" style={{ flex: 1, maxWidth: "400px" }}>
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
            id="floatingSearch"
          />
          <label htmlFor="floatingSearch">Search</label>
        </div>
        <div className="form-floating" style={{ flex: 1, maxWidth: "200px" }}>
          <Input
            type="select"
            name="categorySelect"
            id="categorySelect"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-control"
          >
            <option value="ALL">All</option>
            {blogCategoryData.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Input>
          <label htmlFor="categorySelect">Category</label>
        </div>
        <div className="form-floating" style={{ flex: 1, maxWidth: "200px" }}>
          <Input
            type="select"
            name="visibilitySelect"
            id="visibilitySelect"
            value={selectedVisibility}
            onChange={handleVisibilityChange}
            className="form-control"
          >
            <option value={2}>All</option>
            <option value={0}>Show</option>
            <option value={1}>Hide</option>
          </Input>
          <label htmlFor="visibilitySelect">Visibility</label>
        </div>
      </div>
      <CardBody>
        <DataTable
          columns={columns}
          data={blogData}
          pagination
          paginationServer
          paginationTotalRows={totalPages * pageSize}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={(page) => setCurrentPage(page - 1)}
          progressPending={status === "loading"}
          selectableRows
          onSelectedRowsChange={handleRowSelected}
          customStyles={customStyles} // Apply the customStyles here
        />
      </CardBody>
    </Card>
  );
}

export default Blog;
