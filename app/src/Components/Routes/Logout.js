import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "../../Redux/Actions/authorizeActions";

class Logout extends Component {
  // constructor
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    this.onLogout();
  }

  // methods
  onLogout() {
    this.props.onLogout();
  }

  // render
  render() {
    return (
      <div>
        <h1>Logged out successfully</h1>
      </div>
    );
  }
}

const mapActionsToProps = {
  onLogout: logout
};

//export default Logout;
export default connect(
  null,
  mapActionsToProps
)(Logout);
