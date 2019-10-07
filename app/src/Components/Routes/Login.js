import React, { Component } from "react";
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
import { connect } from "react-redux";
import { login, removeError } from "../../Redux/Actions/authorizeActions";

class Login extends Component {
  //constructor
  constructor() {
    super();
    this.state = {
      loginPayload: {
        email: String,
        password: String
      },
      protectedRedirect: false,
      registerRedirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.rmLoginErrMsg = this.rmLoginErrMsg.bind(this);
  }

  componentDidMount() {
    // props is from the protectedRoute component, if there is a "state",  and "from" line
    // it was redirected due to invalid auth. else it came from register
    if (this.props.location.state) {
      //console.log(this.props.location.state.from === undefined);

      let { successMessage, from } = this.props.location.state;

      if (from) {
        this.setState({
          protectedRedirect: true
        });
      }
      if (successMessage) {
        this.setState({ registerRedirect: true });
      }
    } else {
      console.log("NO FROM");
    }
  }

  // methods
  handleSubmit(event) {
    event.preventDefault();
    const signinPayload = this.state.loginPayload;

    const config = {
      headers: {
        "content-type": "application/json"
      }
    };
    this.props.login(signinPayload, config);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let loginPayload = { ...this.state.loginPayload };
    loginPayload[name] = value;
    this.setState({ loginPayload });
  }

  rmLoginErrMsg() {
    this.props.removeError();
  }

  render() {
    const loginTitle = <h2>Login</h2>;

    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let beginRedirect = this.props.userLoggedIn || false;

    let { registerRedirect, protectedRedirect } = this.state;

    /*The component will redirect ONLY AFTER the user as logged in.*/
    if (beginRedirect) {
      return <Redirect to={from} />;
    }
    return (
      <div>
        <Container>
          {loginTitle}

          {this.props.showLoginError ? (
            <UncontrolledAlert color="danger" onClick={this.rmLoginErrMsg}>
              Error logging in!
            </UncontrolledAlert>
          ) : null}
          {protectedRedirect ? (
            <UncontrolledAlert color="danger">
              You must be logged in to view that page!
            </UncontrolledAlert>
          ) : null}
          {registerRedirect ? (
            <UncontrolledAlert color="success">
              User added! Please log in.
            </UncontrolledAlert>
          ) : null}

          <Form onSubmit={this.handleSubmit}>
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
                Login
              </Button>{" "}
              <Button color="link" tag={Link} to="/register">
                Register a new account
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showLoginError: state.auth.loginError,
    userLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(
  mapStateToProps,
  { login, removeError }
)(Login);

/*
  the above export is object shorthand form for mapping actions as props
  : https://react-redux.js.org/api/connect
*/
