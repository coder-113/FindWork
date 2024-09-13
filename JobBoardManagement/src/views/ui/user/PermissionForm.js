import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { updatePermissionsThunk } from "../../../features/userSlice";
import { formatPermissionName } from "../../../utils/functions/formatPermission";

const PermissionForm = ({
  userId,
  currentPermissions,
  isOpen,
  toggle,
  listPermissions,
}) => {
  const dispatch = useDispatch();
  const [permissions, setPermissions] = useState(currentPermissions);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setPermissions((prev) =>
      checked ? [...prev, value] : prev.filter((perm) => perm !== value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePermissionsThunk({ userId, permissions }));
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Assign Permissions</ModalHeader>
        <ModalBody>
          {listPermissions.map((item) => (
            <FormGroup key={item.id} check>
              <Label check>
                <Input
                  type="checkbox"
                  value={item.name}
                  checked={permissions.includes(item.name)}
                  onChange={handleChange}
                />
                {formatPermissionName(item.name)}
              </Label>
            </FormGroup>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            Save
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default PermissionForm;
