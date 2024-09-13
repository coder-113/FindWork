import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Card,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Table,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import NProgress from "nprogress";
import debounce from "lodash/debounce";
import {
  getUserThunk,
  deleteUserThunk,
  updateUserStatusThunk,
  getAllPermissionThunk,
  updateIsOnlineThunk,
} from "../../../features/userSlice";
import showToast from "../../../utils/functions/showToast";
import { ModeratorForm } from "./ModeratorForm";
import PermissionForm from "./PermissionForm";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../../services/websocket_service";
import { hasPermission } from "../../../utils/functions/hasPermission";
import { Navigate } from "react-router-dom";
import moment from "moment/moment";
import { formatPermissionName } from "../../../utils/functions/formatPermission";

const ExpandableRow = ({ data }) => {
  console.log(">>>data: ", data);
  const isModerator = data.roles.some((role) => role.name === "ROLE_MODERATOR");

  return (
    <div style={{ padding: "10px", background: "#f9f9f9" }}>
      <Table bordered responsive>
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>
              {data.firstName} {data.lastName}
            </td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{data.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{data.email}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{data.gender ?? "Not updated"}</td>
          </tr>
          <tr>
            <th>Last Updated At</th>
            <td>{moment(data.updatedAt).format("DD MMM YYYY, h:mm A")}</td>
          </tr>
          <tr>
            <th>Verified</th>
            <td>
              {data.verified ? (
                <Badge color="success">Verified</Badge>
              ) : (
                <Badge color="danger">Not Verified</Badge>
              )}
            </td>
          </tr>
          {isModerator && (
            <tr>
              <th>Permissions</th>
              <td>
                {data.permissions.map((permission) => (
                  <Badge key={permission.name} color="info" className="me-2">
                    {formatPermissionName(permission.name)}
                  </Badge>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.list);
  const user = useSelector((state) => state.auth.user);
  const permissions = useSelector((state) => state.user.permissions);
  const totalPages = useSelector((state) => state.user.totalPages);
  const status = useSelector((state) => state.user.status);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleStatusToggle = (userId, isEnabled) => {
    NProgress.start();
    dispatch(updateUserStatusThunk({ userId, isEnabled: !isEnabled })).finally(
      () => {
        NProgress.done();
      }
    );
  };

  const handleDeleteUser = (userId) => {
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
        dispatch(deleteUserThunk(userId)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          }
        });
      }
    });
  };

  const handleOpenPermissionModal = (user) => {
    setSelectedUser(user);
    setIsPermissionModalOpen(true);
  };

  const handleClosePermissionModal = () => {
    setSelectedUser(null);
    setIsPermissionModalOpen(false);
  };

  const mapRoleName = (roleName) => {
    switch (roleName) {
      case "ROLE_ADMIN":
        return "ADMINISTRATOR";
      case "ROLE_MODERATOR":
        return "MODERATOR";
      case "ROLE_USER":
        return "USER";
      default:
        return "";
    }
  };

  const columns = [
    {
      name: "",
      cell: (row) => (
        <div>
          <img
            src={
              row.imageUrl
                ? row.imageUrl
                : "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
            }
            className="rounded-circle"
            style={{
              objectFit: "contain",
            }}
            width={50}
            height={50}
            alt={row.id}
          />
        </div>
      ),
      width: "70px",
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => <div>{row.username}</div>,
      width: "200px",
    },
    {
      name: "Full Name",
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => (
        <div>
          {row.firstName} {row.lastName}
        </div>
      ),
      width: "200px",
    },
    {
      name: "Active",
      selector: (row) => row.isEnabled,
      sortable: true,
      cell: (row) => (
        <Badge pill color={row.isEnabled ? "primary" : "danger"}>
          {row.isEnabled ? "Active" : "Deactive"}
        </Badge>
      ),
    },
    {
      name: "Role",
      cell: (row) => row.roles.map((item) => mapRoleName(item.name)).join(", "),
      width: "200px",
    },
    {
      name: "Last updated at",
      cell: (row) =>
        moment(row.updatedAt).format("ddd, MMMM, DD, YYYY, h:mm A"),
      width: "300px",
    },
    {
      name: "Actions",
      cell: (row) => {
        const isAdmin = user.role.some(
          (role) => role.authority === "ROLE_ADMIN"
        );
        const isModerator = user.role.some(
          (role) => role.authority === "ROLE_MODERATOR"
        );
        const canManageUser = user.permission
          .map((item) => item.name)
          .includes("MANAGE_USER");
        const isUserAdmin = row.roles.some(
          (role) => role.name === "ROLE_ADMIN"
        );
        const isUserModerator = row.roles.some(
          (role) => role.name === "ROLE_MODERATOR"
        );
        const isUser = row.roles.some((role) => role.name === "ROLE_USER");
        const isCurrentUser = row.username === user.sub;

        const isAttemptingToManageOtherModerator =
          isModerator && isUserModerator;

        return (
          !isUserAdmin &&
          !isAttemptingToManageOtherModerator &&
          !isCurrentUser && (
            <Dropdown
              isOpen={dropdownOpen[row.id]}
              toggle={() => toggleDropdown(row.id)}
              a11y
            >
              <DropdownToggle caret size="sm">
                Actions
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => handleStatusToggle(row.id, row.isEnabled)}
                >
                  {row.isEnabled ? "Deactivate" : "Activate"}
                </DropdownItem>
                {!row.isEnabled && (
                  <DropdownItem
                    color="danger"
                    onClick={() => handleDeleteUser(row.id)}
                  >
                    Delete
                  </DropdownItem>
                )}
                {(isAdmin || (isModerator && canManageUser)) && !isUser && (
                  <DropdownItem onClick={() => handleOpenPermissionModal(row)}>
                    Assign Permissions
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )
        );
      },
    },
  ];

  const debouncedSearch = useCallback(
    debounce((query, role) => {
      dispatch(
        getUserThunk({ query, role, page: currentPage, size: pageSize })
      );
    }, 500),
    [dispatch, currentPage, pageSize]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value, roleFilter);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    debouncedSearch(searchTerm, e.target.value);
  };

  const handlePerRowsChange = (newPageSize, page) => {
    setPageSize(newPageSize);
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    dispatch(
      getUserThunk({
        query: searchTerm,
        role: roleFilter,
        page: currentPage,
        size: pageSize,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "rejected") {
        showToast(res.payload, "error");
      }
    });

    dispatch(getAllPermissionThunk());
  }, [dispatch, currentPage, pageSize]);

  const customStyles = {
    rows: {
      style: {
        padding: "10px 0",
      },
    },
  };

  if (
    hasPermission(user.role, user.permission, "ROLE_MODERATOR", "MANAGE_USER")
  ) {
    return <Navigate to="/" />;
  }

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center p-3 gap-3">
        <h4>User List</h4>
        {user.role.map((item) => item.authority).includes("ROLE_ADMIN") && (
          <ModeratorForm listPermissions={permissions} />
        )}
      </div>
      <div className="d-flex w-100 gap-2 p-2">
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
        <div className="form-floating" style={{ flex: 1, maxWidth: "400px" }}>
          <Input type="select" value={roleFilter} onChange={handleRoleChange}>
            <option value="">All Roles</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_MODERATOR">Moderator</option>
            <option value="ROLE_USER">User</option>
          </Input>
          <label htmlFor="floatingSearch">Role</label>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={users}
        pagination
        customStyles={customStyles}
        paginationPerPage={pageSize}
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationServer
        paginationTotalRows={totalPages * pageSize}
        onChangePage={(page) => setCurrentPage(page - 1)}
        onChangeRowsPerPage={handlePerRowsChange}
        progressComponent={<Spinner />}
        progressPending={status === "loading"}
        expandableRows
        expandableRowsComponent={ExpandableRow}
        highlightOnHover
      />
      {selectedUser && (
        <PermissionForm
          userId={selectedUser.id}
          currentPermissions={selectedUser.permissions.map(
            (permission) => permission.name
          )}
          isOpen={isPermissionModalOpen}
          toggle={handleClosePermissionModal}
          listPermissions={permissions}
        />
      )}
    </Card>
  );
};

export default UserList;
