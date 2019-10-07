import React, { Component } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
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
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../css/Expenses.css";
import { connect } from "react-redux";

import Moment from "react-moment";

//var jwt = require("jsonwebtoken");

class Expenses extends Component {
  // constructor
  constructor() {
    super();
    this.state = {
      isLoading: true,
      expenses: [],
      categories: [],
      itemDataPayload: {
        price: Number,
        description: "",
        name: "",
        expenseDate: new Date(),
        userID: Number,
        category: Number,
        location: String
      },
      addedSuccess: false,
      errorMessage: false,
      editedSuccess: false
    };
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getExpenses = this.getExpenses.bind(this);
  }

  // life cycle methods
  async componentDidMount() {
    if (this.props.location.state) {
      let { editedSuccess } = this.props.location.state;
      this.setState({
        editedSuccess,
        addedSuccess: false,
        errorMessage: false
      });
    }

    // set the user id
    this.setState(prevState => {
      let itemDataPayload = Object.assign({}, prevState.itemDataPayload);
      itemDataPayload.userID = this.props.userId;
      return { itemDataPayload };
    });

    // If-else block to determine to show all expenses or just the ones relevant to USER role
    this.getExpenses();

    // This will load for both roles
    await axios.get("/api/categories/").then(res => {
      const categories = res.data;
      this.setState({ categories, isLoading: false });
    });
  }

  // methods
  async getExpenses() {
    if (this.props.isAdmin) {
      await axios.get("/api/expenses/").then(res => {
        const expenses = res.data;
        this.setState({ expenses });
      });
    } else {
      await axios.get(`/api/expenses/user/${this.props.userId}`).then(res => {
        const expenses = res.data;
        this.setState({ expenses });
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const itemDataPayload = this.state.itemDataPayload;
    //console.log(JSON.stringify(itemDataPayload));

    const config = {
      headers: {
        "content-type": "application/json"
      }
    };

    await axios
      .post(`/api/expenses/new`, JSON.stringify(itemDataPayload), config)
      .then(res => {
        if (res.status === 201) {
          //console.log("expense added");
          this.setState({
            addedSuccess: true,
            errorMessage: false,
            editedSuccess: false
          });
        }
      })
      .catch(err => {
        this.setState({
          errorMessage: true,
          addedSuccess: false,
          editedSuccess: false
        });
        console.log("ERROR POSTING TO EXPENSE");
        console.log(err);
      })
      .then(() => {
        this.getExpenses();
      });
  }

  delete(itemId) {
    axios.delete(`/api/expenses/${itemId}`).then(res => {
      let updatedExpenses = [...this.state.expenses].filter(
        element => element.id !== itemId
      );
      this.setState({ expenses: updatedExpenses });
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let itemDataPayload = { ...this.state.itemDataPayload };
    itemDataPayload[name] = value;
    this.setState({ itemDataPayload });
  }

  handleDateChange(date) {
    let itemDataPayload = { ...this.state.itemDataPayload };
    itemDataPayload.expenseDate = date;
    this.setState({ itemDataPayload });
  }

  // render
  render() {
    const addExpenseTitle = <h3>Add an Expense</h3>;
    const currentExpenseTitle = <h3>Existing Expenses</h3>;
    const {
      expenses,
      categories,
      isLoading,
      errorMessage,
      addedSuccess,
      editedSuccess
    } = this.state;

    let categoryList = categories.map(element => (
      <option value={element.name} key={element.id}>
        {element.name}
      </option>
    ));

    let expenseList = expenses.map(element => (
      <tr key={element.id}>
        <td>{element.id}</td>
        <td>{element.name}</td>
        <td>{element.category.name}</td>
        <td>{element.price}</td>
        <td>
          <Moment date={element.expensedate} format="YYYY/MM/DD" />
        </td>
        <td>{element.description}</td>
        <td>{element.location}</td>
        <td>{element.user.name}</td>
        <td>
          <Link
            to={{
              pathname: "/expenses/edit",
              state: { item: element, categories }
            }}
          >
            <Button size="sm" color="warning">
              Edit
            </Button>
          </Link>
        </td>
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
        <Container className="expenseContainer">
          {errorMessage ? (
            <UncontrolledAlert color="danger">
              Error adding expense!
            </UncontrolledAlert>
          ) : null}
          {addedSuccess ? (
            <UncontrolledAlert color="success">
              Expense added!
            </UncontrolledAlert>
          ) : null}
          {editedSuccess ? (
            <UncontrolledAlert color="success">
              Expense updated!
            </UncontrolledAlert>
          ) : null}
          {addExpenseTitle}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="title">Expense Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="price">Price (In USD)</Label>
              <Input
                type="number"
                step="0.01"
                name="price"
                id="price"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="expenseDate">Expense Date</Label>{" "}
              <DatePicker
                selected={this.state.itemDataPayload["expenseDate"]}
                onChange={this.handleDateChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="category">Category</Label>{" "}
              <select
                name="category"
                onChange={this.handleChange}
                defaultValue="select"
              >
                <option value="select" disabled={true}>
                  Select
                </option>
                {categoryList}
              </select>
            </FormGroup>

            <FormGroup>
              <Label for="location">Location</Label>
              <Input
                type="text"
                name="location"
                id="location"
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

          {currentExpenseTitle}
          <Table className="mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (USD)</th>
                <th>Date</th>
                <th>Description</th>
                <th>Location</th>
                <th>User</th>
                <th>Edit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{expenseList}</tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { isAdmin: state.auth.isAdmin, userId: state.auth.id };
};

export default connect(mapStateToProps)(Expenses);
