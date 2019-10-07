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
  Alert
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

import Moment from "react-moment";

class EditExpense extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      categories: [],
      itemDataPayload: {
        price: Number,
        description: "",
        name: "",
        expenseDate: new Date(),
        userID: Number,
        category: String,
        location: String
      },
      editItemId: Number,
      beginRedirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      let { item, categories } = this.props.location.state;
      let prefill = {
        price: item.price,
        description: item.description,
        name: item.name,
        expenseDate: new Date(),
        userID: item.user.id,
        category: item.category.name,
        location: item.location
      };
      this.setState({
        itemDataPayload: prefill,
        categories,
        isLoading: false,
        editItemId: item.id
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const itemDataPayload = this.state.itemDataPayload;

    const config = {
      headers: {
        "content-type": "application/json"
      }
    };
    await axios
      .put(
        `/api/expenses/${this.state.editItemId}`,
        JSON.stringify(itemDataPayload),
        config
      )
      .then(res => {
        if (res.status === 200) {
          console.log("expense edited");
          this.setState({ beginRedirect: true });
        }
      })
      .catch(err => {
        this.setState({ errorMessage: true });
        console.log("ERROR POSTING TO EXPENSE");
        console.log(err);
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

  render() {
    const editItemTitle = (
      <h3>Editing Item: {this.state.itemDataPayload.name}</h3>
    );
    const {
      isLoading,
      categories,
      itemDataPayload,
      beginRedirect
    } = this.state;

    let categoryList = categories.map(element => (
      <option value={element.name} key={element.id}>
        {element.name}
      </option>
    ));
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (beginRedirect) {
      return (
        <Redirect
          to={{
            pathname: "/expenses",
            state: { editedSuccess: true }
          }}
        />
      );
    }

    return (
      <div>
        <Container>
          {editItemTitle}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="title">New Expense Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                onChange={this.handleChange}
                value={itemDataPayload.name}
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
                value={itemDataPayload.price}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                onChange={this.handleChange}
                value={itemDataPayload.description}
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
                defaultValue="Select"
              >
                <option disabled={true}>Select</option>
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
                value={itemDataPayload.location}
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

export default EditExpense;
