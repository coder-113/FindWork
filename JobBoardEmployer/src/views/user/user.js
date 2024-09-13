import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";

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
} from "reactstrap";
import { getUserByIDThunk, updateUserThunk } from "../../features/authSlice";
import { createFormData } from "../../utils/form-data/formDataUtil";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  bio: yup.string(),
  gender: yup
    .string()
    .oneOf(["MALE", "FEMALE", "OTHER"])
    .required("Gender is required"),
  imageFile: yup.mixed().test("fileSize", "File is too large", (value) => {
    return !value || (value && value.size <= 2000000); // 2MB
  }),
});

const User = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      gender: user?.gender,
      imageFile: "",
    },
  });

  const onSubmit = (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const username = decodedToken.sub; // Assuming username is in the token
      console.log(username);
      data = {
        ...data,
        id: userId,
        username: username,
      };

      console.log(">>> data to update: ", data);

      const formData = createFormData(data);
      dispatch(updateUserThunk({ formData, userId: data.id }));
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      if (!user) {
        dispatch(getUserByIDThunk(userId)).then((res) => {
          const reqStatus = res.meta.requestStatus;
          const payload = res.payload;
          if (reqStatus === "fulfilled") {
            setValue("bio", payload.bio);
            setValue("firstName", payload.firstName);
            setValue("lastName", payload.lastName);
            setValue("gender", payload.gender);
          }
        });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [user]);

  return (
    user && (
      <Row>
        <Col lg={4} md={6} sm={12}>
          <Card>
            <CardBody className="text-center">
              <img
                alt="Avatar"
                src={user?.imageUrl}
                className="rounded-circle img-fluid"
                style={{ width: "150px", height: "150px" }}
              />
              <CardTitle tag="h5" className="mt-3">
                {`${user?.firstName} ${user?.lastName}`}
              </CardTitle>
              <CardText className="text-truncate-multiline">
                {user?.bio}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col lg={8} md={6} sm={12}>
          <Card className="p-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="Enter your first name"
                    />
                  )}
                />
                {errors.firstName && <p>{errors.firstName.message}</p>}
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Enter your last name"
                    />
                  )}
                />
                {errors.lastName && <p>{errors.lastName.message}</p>}
              </FormGroup>
              <FormGroup>
                <Label for="bio">Bio</Label>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="bio"
                      type="textarea"
                      rows={10}
                      placeholder="Enter your bio"
                    />
                  )}
                />
                {errors.bio && <p>{errors.bio.message}</p>}
              </FormGroup>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="gender" type="select">
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Input>
                  )}
                />
                {errors.gender && <p>{errors.gender.message}</p>}
              </FormGroup>
              <FormGroup>
                <Label for="file">File</Label>
                <Controller
                  name="imageFile"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) =>
                        setValue("imageFile", e.target.files[0], {
                          shouldDirty: true,
                        })
                      }
                    />
                  )}
                />
                {errors.file && <p>{errors.file.message}</p>}
              </FormGroup>
              <Button color="primary" type="submit" disabled={!isDirty}>
                Save Changes
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    )
  );
};

export default User;
