import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  FormFeedback,
  CardHeader,
} from "reactstrap";
import { getUserByIDThunk, updateUserThunk } from "../../../features/authSlice";
import { createFormData } from "../../../utils/form-data/formDataUtil";
import classnames from "classnames";
import { updatePasswordAsync } from "../../../services/user_service";
import showToast from "../../../utils/functions/showToast";
import moment from "moment/moment";
import "./style.css";
import { formatPermissionName } from "../../../utils/functions/formatPermission";

const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  bio: yup.string(),
  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .required("Gender is required"),
  imageFile: yup.mixed().test("fileSize", "File is too large", (value) => {
    console.log("value: ", value);
    return !value || (value && value.size <= 2000000); // 2MB
  }),
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required")
    .notOneOf(
      [yup.ref("currentPassword"), null],
      "New password cannot be the same as the current password"
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

const User = () => {
  const user = useSelector((state) => state.auth.user);
  const userEdit = useSelector((state) => state.auth.userEdit);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: userEdit?.firstName,
      lastName: userEdit?.lastName,
      bio: userEdit?.bio,
      gender: userEdit?.gender,
      imageFile: "",
    },
  });

  const {
    control: controlPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (data) => {
    data = {
      ...data,
      id: user.id,
      username: user.sub,
    };

    const formData = createFormData(data);
    dispatch(updateUserThunk({ formData, userId: data.id }));
    setEditMode(false);
  };

  const handleChangePassword = async (data) => {
    try {
      const id = user.id;
      const { currentPassword, newPassword } = data;
      await updatePasswordAsync(id, currentPassword, newPassword);
      showToast("Password updated successfully", "success");
      resetPasswordForm();
    } catch (error) {
      showToast(error.response.data, "error");
    }
  };

  useEffect(() => {
    if (!userEdit) {
      dispatch(getUserByIDThunk(user.sub)).then((res) => {
        const reqStatus = res.meta.requestStatus;
        const payload = res.payload;
        if (reqStatus === "fulfilled") {
          setValue("bio", payload.bio ? payload.bio : "");
          setValue("firstName", payload.firstName);
          setValue("lastName", payload.lastName);
          setValue("gender", payload.gender);
        }
      });
    }
  }, [userEdit]);

  console.log(">>>userEdit:", userEdit);

  const isAdmin = userEdit?.roles.some((role) => role.name === "ROLE_ADMIN");
  const isModerator = userEdit?.roles.some(
    (role) => role.name === "ROLE_MODERATOR"
  );

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    userEdit && (
      <Row>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <CardHeader>
              Updated {moment(userEdit?.updatedAt).from()}
            </CardHeader>
            <CardBody className="text-center">
              <img
                alt="Avatar"
                src={userEdit?.imageUrl}
                className="rounded-circle img-fluid"
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
              <CardTitle tag="h5" className="mt-3">
                {`${userEdit?.firstName} ${userEdit?.lastName}`}
              </CardTitle>
              <CardText>
                {isAdmin
                  ? "Administrator"
                  : isModerator
                  ? "Moderator"
                  : userEdit?.roles.map((item) => item.name).join(", ")}
              </CardText>
            </CardBody>
          </Card>
          {user.role
            .map((item) => item.authority)
            .includes("ROLE_MODERATOR") && (
            <Card className="mt-4">
              <CardHeader>Permissions</CardHeader>
              <CardBody>
                <ul>
                  {user.permission.map((item) => (
                    <li key={item.id}>{formatPermissionName(item.name)}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </Col>
        <Col lg={8} md={6} sm={12}>
          <Card>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "profile" })}
                  onClick={() => toggleTab("profile")}
                >
                  Edit Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "password" })}
                  onClick={() => toggleTab("password")}
                >
                  Change Password
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="p-2" activeTab={activeTab}>
              <TabPane tabId="profile">
                {!editMode ? (
                  <Table>
                    <tbody>
                      <tr>
                        <th style={{ width: "150px" }}>Username</th>
                        <td>{user.sub}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{userEdit?.email}</td>
                      </tr>
                      <tr>
                        <th>Full Name</th>
                        <td>
                          {userEdit?.firstName} {userEdit?.lastName}
                        </td>
                      </tr>
                      <tr>
                        <th>Bio</th>
                        <td>
                          <p className="text-truncate-multiline">
                            {userEdit?.bio}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td>{userEdit?.gender}</td>
                      </tr>
                    </tbody>
                  </Table>
                ) : (
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Table>
                      <tbody>
                        <tr>
                          <th style={{ width: "150px" }}>First Name</th>
                          <td>
                            <Controller
                              name="firstName"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Enter your first name"
                                />
                              )}
                            />
                            {errors.firstName && (
                              <p>{errors.firstName.message}</p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Last Name</th>
                          <td>
                            <Controller
                              name="lastName"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Enter your last name"
                                />
                              )}
                            />
                            {errors.lastName && (
                              <p>{errors.lastName.message}</p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Bio</th>
                          <td>
                            <Controller
                              name="bio"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="textarea"
                                  rows={3}
                                  placeholder="Enter your bio"
                                />
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Gender</th>
                          <td>
                            <Controller
                              name="gender"
                              control={control}
                              render={({ field }) => (
                                <Input type="select" {...field}>
                                  <option value="MALE">Male</option>
                                  <option value="FEMALE">Female</option>
                                  <option value="OTHER">Other</option>
                                </Input>
                              )}
                            />
                            {errors.gender && <p>{errors.gender.message}</p>}
                          </td>
                        </tr>
                        <tr>
                          <th>Profile Picture</th>
                          <td>
                            <Controller
                              name="imageFile"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    setValue("imageFile", e.target.files[0], {
                                      shouldDirty: true,
                                    });
                                  }}
                                />
                              )}
                            />
                            {errors.imageFile && (
                              <p>{errors.imageFile.message}</p>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <div className="text-center">
                      <Button color="primary" type="submit" disabled={!isDirty}>
                        Save
                      </Button>
                      <Button
                        color="secondary"
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="ml-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
                {!editMode && (
                  <div className="text-center mt-3">
                    <Button
                      color="primary"
                      type="button"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </TabPane>
              <TabPane tabId="password">
                <Table>
                  <tbody>
                    <tr>
                      <th>Current Password</th>
                      <td>
                        <Controller
                          name="currentPassword"
                          control={controlPassword}
                          render={({ field }) => (
                            <Input
                              type="password"
                              placeholder="Enter current password"
                              invalid={!!passwordErrors.currentPassword}
                              {...field}
                            />
                          )}
                        />
                        {passwordErrors.currentPassword && (
                          <FormFeedback>
                            {passwordErrors.currentPassword.message}
                          </FormFeedback>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>New Password</th>
                      <td>
                        <Controller
                          name="newPassword"
                          control={controlPassword}
                          render={({ field }) => (
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              invalid={!!passwordErrors.newPassword}
                              {...field}
                            />
                          )}
                        />
                        {passwordErrors.newPassword && (
                          <FormFeedback>
                            {passwordErrors.newPassword.message}
                          </FormFeedback>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Confirm New Password</th>
                      <td>
                        <Controller
                          name="confirmNewPassword"
                          control={controlPassword}
                          render={({ field }) => (
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              invalid={!!passwordErrors.confirmNewPassword}
                              {...field}
                            />
                          )}
                        />
                        {passwordErrors.confirmNewPassword && (
                          <FormFeedback>
                            {passwordErrors.confirmNewPassword.message}
                          </FormFeedback>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <Button
                  color="primary"
                  type="submit"
                  onClick={handlePasswordSubmit(handleChangePassword)}
                >
                  Change Password
                </Button>
              </TabPane>
            </TabContent>
          </Card>
        </Col>
      </Row>
    )
  );
};

export default User;
