import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Col, FormGroup, Label, Input, FormText, Row } from "reactstrap";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { useSelector } from "react-redux";

export const RightSideBlogForm = (props) => {
  const suggestions = useSelector((state) => state.blogs.hashTags);
  const handleChange = (selectedOptions) => {
    props.onChangeTags(selectedOptions.map((option) => option.value));
  };

  const tagOptions = suggestions.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  return (
    <Col lg={4}>
      <Row>
        <Col md={12}>
          <FormGroup>
            <Label for="postCategory">
              Category <span className="text-danger">*</span>
            </Label>
            <Controller
              name="categoryIds"
              control={props.control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="postCategory"
                  options={props.categoryList.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  isSearchable={false}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption.map((item) => item.value))
                  }
                  value={props.categoryList.find(
                    (category) => category === field
                  )}
                  {...(props.isEdit && {
                    defaultValue: props.defaultValue,
                  })}
                  isMulti
                  closeMenuOnSelect={false}
                  placeholder="Select category..."
                />
              )}
            />
            {props.errors.categoryIds && (
              <FormText color="danger">
                {props.errors.categoryIds.message}
              </FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="visibility">
              Visibility <span className="text-danger">*</span>
            </Label>
            <Controller
              name="visibility"
              control={props.control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="checkbox"
                  id="visibility"
                  defaultChecked={field.value}
                />
              )}
            />
            {props.errors.visibility && (
              <FormText color="danger">
                {props.errors.visibility.message}
              </FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="postImage">
              Featured Image <span className="text-danger">*</span>
            </Label>
            <div
              {...props.getRootProps({
                className: "dropzone",
                style: {
                  border: "2px dashed #ddd",
                  borderRadius: "4px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                },
              })}
            >
              <input {...props.getInputProps()} accept="image/png, image/jpg" />
              {props.previewUrl || props.isEdit ? (
                <img
                  src={
                    props.previewUrl || (props.isEdit && props.isEdit.imageUrl)
                  }
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              ) : (
                <p>Drag & drop a featured image here, or click to select one</p>
              )}
            </div>
            {props.errors.image && (
              <FormText color="danger">{props.errors.image.message}</FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="hashtags">
              Hashtags <span className="text-danger">*</span>
            </Label>
            <Creatable
              isMulti
              value={props.tags.map((tag) => ({ value: tag, label: tag }))}
              onChange={handleChange}
              options={tagOptions}
              placeholder="Type and press enter"
            />
            {props.errors.hashtags && (
              <FormText color="danger">
                {props.errors.hashtags.message}
              </FormText>
            )}
          </FormGroup>
        </Col>
      </Row>
    </Col>
  );
};

export default RightSideBlogForm;
