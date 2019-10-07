import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import "./css/NavigationBar.css";
import { connect } from "react-redux";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  // life cycle

  // methods
  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  // render
  render() {
    return (
      <div className="navContainer">
        <Navbar color="dark" dark>
          <NavbarBrand href="/" className="mr-auto">
            Price Expense Tracker
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="/categories">Categories</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/expenses">Expenses</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/users">Users</NavLink>
              </NavItem>
              {this.props.isLoggedIn ? (
                <NavItem>
                  <NavLink href="/logout">Logout</NavLink>
                </NavItem>
              ) : (
                <NavItem>
                  <NavLink href="/login">Login/Register</NavLink>
                </NavItem>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(mapStateToProps)(NavigationBar);
