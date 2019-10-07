import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Label,
  Input,
  FormGroup,
  Form,
  Button,
  Table,
  UncontrolledAlert
} from "reactstrap";

class Category extends Component {
  // constructor
  constructor() {
    super();
    this.state = {
      isLoading: true,
      categories: [],
      errorMessage: false,
      addedMessage: false,
      categoryPayload: {
        name: ""
      },
      deleteError: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.delete = this.delete.bind(this);
  }

  // life cycle
  async componentDidMount() {
    const response = await fetch("/api/categories/"); // proxy in package.json is set to the server the back end is on
    const body = await response.json();
    this.setState({ categories: body, isLoading: false });
  }

  async componentDidUpdate() {
    const response = await fetch("/api/categories/"); // proxy in package.json is set to the server the back end is on
    const body = await response.json();
    this.setState({ categories: body, isLoading: false });
  }

  // methods
  async handleSubmit(event) {
    event.preventDefault();
    const categoryPayload = this.state.categoryPayload;

    const config = {
      headers: {
        "content-type": "application/json"
      }
    };

    await axios
      .post(`/api/categories/new`, JSON.stringify(categoryPayload), config)
      .then(res => {
        if (res.status === 201) {
          this.setState({ errorMessage: false, addedMessage: true });
        } else {
          console.log("Status 201 was not rcvd. Got code: " + res.status);
        }
        //event.target.reset();
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 409) {
          console.log("Category already exists");
          this.setState({ errorMessage: true, addedMessage: false });
        }
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let categoryPayload = { ...this.state.categoryPayload };
    categoryPayload[name] = value;
    this.setState({ categoryPayload });
  }

  delete(id) {
    axios
      .delete(`/api/categories/${id}`)
      .then(res => {
        let updatedCategories = [...this.state.categories].filter(
          element => element.id !== id
        );
        this.setState({ categories: updatedCategories });
      })
      .catch(err => {
        console.log(err);
        this.setState({ deleteError: true });
      });
  }

  //render
  render() {
    const { categories, isLoading } = this.state;
    const addCategoryTitle = <h3>Add a new Category</h3>;
    const existingCategoryTitle = <h3>Existing Categories</h3>;

    let categoryList = categories.map(element => (
      <tr key={element.id}>
        <td>{element.id}</td>
        <td>{element.name}</td>
        <td>
          <Button
            size="sm"
            color="danger"
            onClick={() => this.delete(element.id)}
          >
            X
          </Button>
        </td>
      </tr>
    ));

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <Container>
          {addCategoryTitle}
          {this.state.errorMessage ? (
            <UncontrolledAlert color="danger">
              Error, category already exists!
            </UncontrolledAlert>
          ) : null}
          {this.state.addedMessage ? (
            <UncontrolledAlert color="success">
              Category added!
            </UncontrolledAlert>
          ) : null}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="title">Category Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Button type="submit" color="primary">
                Save
              </Button>{" "}
              <Button color="warning" tag={Link} to="/">
                Cancel
              </Button>
            </FormGroup>
          </Form>

          <br />
          <hr />
          <br />
          {existingCategoryTitle}
          {this.state.deleteError ? (
            <UncontrolledAlert color="danger">
              Error, that category is in use by you or by someone else!
              <hr />
              In order to remove this category. Delete the expenses that involve
              it.
            </UncontrolledAlert>
          ) : null}
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{categoryList}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default Category;
