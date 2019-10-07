import React, { Component } from "react";
import axios from "axios";
import { Container, Button, Table } from "reactstrap";
import { connect } from "react-redux";

class Users extends Component {
  // constructor
  constructor() {
    super();
    this.state = {
      isLoading: true,
      users: []
    };
    this.delete = this.delete.bind(this);
  }

  // life cycle
  async componentDidMount() {
    await axios.get("/api/users/").then(res => {
      const users = res.data;
      this.setState({ users, isLoading: false });
    });
  }

  // methods
  delete(id) {
    axios.delete(`/api/user/${id}`).then(res => {
      let updatedUsers = [...this.state.users].filter(
        element => element.id !== id
      );
      this.setState({ users: updatedUsers });
    });
  }

  // render
  render() {
    const currentUserTitle = <h2>Existing Users</h2>;
    const { users } = this.state;
    let userList;

    if (this.props.isAdmin) {
      userList = users.map(element => (
        <tr key={element.id}>
          <td>{element.id}</td>
          <td>{element.name}</td>
          <td>{element.email}</td>
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
    } else {
      userList = users.map(element => (
        <tr key={element.id}>
          <td>{element.id}</td>
          <td>{element.name}</td>
          <td>{element.email}</td>
        </tr>
      ));
    }

    return (
      <div>
        <Container>
          {currentUserTitle}
          <Table className="mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{userList}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isAdmin: state.auth.isAdmin };
};

export default connect(mapStateToProps)(Users);
