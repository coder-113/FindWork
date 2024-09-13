import React from "react";
import { Controller } from "react-hook-form";
import { Col, FormGroup, FormText, Input, Label, Row } from "reactstrap";
import { slugify } from "../../../utils/functions/convertToSlug";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function LeftSideBlogForm(props) {
  return (
    <Col lg={8}>
      <Row>
        <Col md={12}>
          <FormGroup>
            <Label for="postTitle">
              Title <span className="text-danger">*</span>
            </Label>
            <Controller
              name="title"
              control={props.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="postTitle"
                  placeholder="Enter the title of the blog post"
                  type="text"
                  invalid={!!props.errors.title}
                />
              )}
            />
            {props.errors.title && (
              <FormText color="danger">{props.errors.title.message}</FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="citation">
              Citation <span className="text-danger">*</span>
            </Label>
            <Controller
              name="citation"
              control={props.control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="citation"
                  placeholder="Enter the citation of the blog post"
                  type="textarea"
                  invalid={!!props.errors.citation}
                />
              )}
            />
            {props.errors.citation && (
              <FormText color="danger">
                {props.errors.citation.message}
              </FormText>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="content">
              Content <span className="text-danger">*</span>
            </Label>
            <Controller
              name="content"
              control={props.control}
              render={({ field }) => (
                <CKEditor
                  config={{
                    placeholder: "Enter the content of the blog post...",
                  }}
                  editor={ClassicEditor}
                  data={props.isEdit ? props.isEdit.content : ""}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    field.onChange(data);
                  }}
                />
              )}
            />
            {props.errors.content && (
              <FormText color="danger">{props.errors.content.message}</FormText>
            )}
          </FormGroup>
        </Col>
      </Row>
    </Col>
  );
}
