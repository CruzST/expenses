import React, { Component } from "react";
import { Jumbotron, Container } from "reactstrap";

class Home extends Component {
  state = {};

  render() {
    return (
      <div>
        <Container>
          <Jumbotron>
            <h1>Price Expense Tracker</h1>
            <hr />
            <p>
              This CRUD application allows users to create an account and add,
              edit or delete expenses to existing categories.
            </p>
            <p>
              Users are also allowed to add new categories. An admin account is
              provided for testing purposes.
            </p>
            <br />
            <p>
              The front end system is built using React in conjunction with
              Redux and JWT Tokens for user state management and React-Router
              for navigation.
            </p>
            <p>
              The back end system was built using Java Spring Boot and
              Spring-Security. Java Persistance API is used to communicate with
              the database and front end system.
            </p>
          </Jumbotron>
        </Container>
      </div>
    );
  }
}

export default Home;
