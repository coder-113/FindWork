import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllEmployersAsync,
  approveEmployerAsync,
} from "../../../features/employerSlice";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Spinner,
} from "reactstrap";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";

const EmployerList = () => {
  const dispatch = useDispatch();
  const employers = useSelector((state) => state.employers.employers);
  const status = useSelector((state) => state.employers.status);
  const error = useSelector((state) => state.employers.error);

  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleApproveEmployer = (employerId) => {
    NProgress.start();
    dispatch(approveEmployerAsync(employerId)).finally(() => {
      NProgress.done();
    });
  };

  const handleDeleteEmployer = (employerId) => {
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
        Swal.fire("Deleted!", "The employer has been deleted.", "success");
      }
    });
  };

  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div>
          <img
            src={
              row.imageUrl
                ? row.imageUrl
                : "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
            }
            className="rounded-circle"
            width={50}
            height={50}
            alt={row.id}
          />
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <div>{row.name}</div>,
      width: "300px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <div>{row.email}</div>,
      width: "300px",
    },
    {
      name: "Company Name",
      selector: (row) => row.companyName,
      sortable: true,
      cell: (row) => <div>{row.companyName}</div>,
      width: "250px",
    },
    {
      name: "Status",
      selector: (row) => row.approved,
      sortable: true,
      cell: (row) => (
        <Badge pill color={row.approved ? "primary" : "danger"}>
          {row.approved ? "Approved" : "Pending"}
        </Badge>
      ),
    },
    {
      name: "Actions",
      cell: (row) =>
        !row.approved && (
          <Dropdown
            isOpen={dropdownOpen[row.id]}
            toggle={() => toggleDropdown(row.id)}
          >
            <DropdownToggle caret size="sm">
              Actions
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => handleApproveEmployer(row.id)}
              >
                Approve
              </DropdownItem>
              <DropdownItem
                color="danger"
                onClick={() => handleDeleteEmployer(row.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ),
    },
  ];

  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(fetchAllEmployersAsync(query));
    }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchAllEmployersAsync());
  }, [dispatch]);

  const customStyles = {
    rows: {
      style: {
        padding: "15px 0",
      },
    },
  };

  // if (status === "rejected") {
  //   return <Alert color="danger">Error: {error}</Alert>;
  // }

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center p-3 gap-3">
        <h4>Employer List</h4>
      </div>
      <div className="d-flex w-100 gap-2 p-2">
        <div className="form-floating" style={{ flex: 1, maxWidth: "400px" }}>
          <Input
            type="text"
            placeholder="Search"
            onChange={handleSearchChange}
            className="form-control"
            id="floatingSearch"
          />
          <label htmlFor="floatingSearch">Search</label>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={employers}
        customStyles={customStyles}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationServer
        paginationTotalRows={employers.length}
        progressComponent={<Spinner />}
        progressPending={status === "loading"}
      />
    </Card>
  );
};

export default EmployerList;
