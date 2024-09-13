import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import * as yup from "yup";
import { IoMdAdd } from "react-icons/io";
import { FaUser, FaEnvelope, FaLock, FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createModeratorThunk } from "../../../features/userSlice";

export function ModeratorForm({ listPermissions }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.list);

  const [newModeratorModal, setNewModeratorModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const moderatorSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    username: yup
      .string()
      .required("Username is required")
      .test(
        "unique-username",
        "Username already exists",
        async function (value) {
          const existingUser = users.find((user) => user.username === value);
          return !existingUser;
        }
      ),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required")
      .test("unique-email", "Email already exists", async function (value) {
        const existingUser = users.find((user) => user.email === value);
        return !existingUser;
      }),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const toggleNewModeratorModal = () => {
    setNewModeratorModal(!newModeratorModal);
    if (newModeratorModal) {
      reset({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
      setSelectedPermissions([]);
    }
  };

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(moderatorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const handleChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((perm) => perm !== value)
    );
  };

  const onSubmit = (data) => {
    console.log(">>> data create moderator: ", data);
    const moderatorData = {
      signupRequest: data,
      permissions: selectedPermissions,
    };
    dispatch(createModeratorThunk(moderatorData)).then(() => {
      toggleNewModeratorModal();
    });
  };

  return (
    <>
      <div>
        <Button color="primary" onClick={toggleNewModeratorModal}>
          <IoMdAdd className="me-2" />
          New Moderator
        </Button>
      </div>
      <Modal
        isOpen={newModeratorModal}
        size="xl"
        toggle={toggleNewModeratorModal}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleNewModeratorModal}>
            Create New Moderator
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <InputGroup>
                    <InputGroupText>
                      <FaUser />
                    </InputGroupText>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="firstName"
                          placeholder="Enter first name"
                          type="text"
                          invalid={!!errors.firstName}
                        />
                      )}
                    />
                  </InputGroup>
                  {errors.firstName && (
                    <FormText color="danger">
                      {errors.firstName.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <InputGroup>
                    <InputGroupText>
                      <FaUserAlt />
                    </InputGroupText>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="lastName"
                          placeholder="Enter last name"
                          type="text"
                          invalid={!!errors.lastName}
                        />
                      )}
                    />
                  </InputGroup>
                  {errors.lastName && (
                    <FormText color="danger">
                      {errors.lastName.message}
                    </FormText>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="username">Username</Label>
              <InputGroup>
                <InputGroupText>
                  <FaUser />
                </InputGroupText>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="username"
                      placeholder="Enter username"
                      type="text"
                      invalid={!!errors.username}
                    />
                  )}
                />
              </InputGroup>
              {errors.username && (
                <FormText color="danger">{errors.username.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <InputGroup>
                <InputGroupText>
                  <FaEnvelope />
                </InputGroupText>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      placeholder="Enter email"
                      type="email"
                      invalid={!!errors.email}
                    />
                  )}
                />
              </InputGroup>
              {errors.email && (
                <FormText color="danger">{errors.email.message}</FormText>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <InputGroup>
                <InputGroupText>
                  <FaLock />
                </InputGroupText>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      placeholder="Enter password"
                      type="password"
                      invalid={!!errors.password}
                    />
                  )}
                />
              </InputGroup>
              {errors.password && (
                <FormText color="danger">{errors.password.message}</FormText>
              )}
            </FormGroup>
            {listPermissions.map((item) => (
              <FormGroup key={item.id} check>
                <Label check>
                  <Input
                    type="checkbox"
                    value={item.name}
                    onChange={handleChange}
                  />
                  {item.name}
                </Label>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Submit
            </Button>
            <Button
              color="secondary"
              type="button"
              onClick={toggleNewModeratorModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
}
