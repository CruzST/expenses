import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Label,
  Input,
  FormGroup,
  Form,
  Button,
  UncontrolledAlert
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";

class Register extends Component {
  // constructor
  constructor() {
    super();
    this.state = {
      userPayload: {
        name: String,
        email: String,
        password: String
      },
      errorMessage: false,
      userAdded: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // methods
  async handleSubmit(event) {
    event.preventDefault();
    const signupPayload = this.state.userPayload;

    const config = {
      headers: {
        "content-type": "application/json"
      }
    };

    console.log(JSON.stringify(signupPayload));

    await axios
      .post(`/api/auth/signup`, JSON.stringify(signupPayload), config)
      .then(res => {
        if (res.status === 201) {
          //console.log(res);
          //console.log(signupPayload);
          this.setState({ userAdded: true });
          //console.log("USER ADDED");
          //this.props.history.push("/login");
        } else {
          console.log("Status 201 was not rcvd. Got code: " + res.status);
        }
      })
      .catch(err => {
        if (err.response.status === 409) {
          console.log("ERROR 409 rcvd. Rmail already exists.");
          this.setState({ errorMessage: true });
        }
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let userPayload = { ...this.state.userPayload };
    userPayload[name] = value;
    this.setState({ userPayload });
  }

  render() {
    const addUserTitle = <h3>Add User</h3>;

    let beginRedirect = this.state.userAdded;
    if (beginRedirect) {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { successMessage: true }
          }}
        />
      );
    }
    return (
      <div>
        {/*Add users */}
        <Container>
          {addUserTitle}
          {this.state.errorMessage ? (
            <UncontrolledAlert color="danger">
              Error registering user, email already taken!
            </UncontrolledAlert>
          ) : null}

          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="John Wick"
                required
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                placeholder="DogLuver@gmail.com"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
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
        </Container>
      </div>
    );
  }
}

export default Register;
