import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Category from "./Components/Routes/Category";
import Home from "./Components/Routes/Home";
import Expenses from "./Components/Routes/Expenses";
import Users from "./Components/Routes/Users";
import Login from "./Components/Routes/Login";
import Register from "./Components/Routes/Register";
import Logout from "./Components/Routes/Logout";
import { ProtectedRoute } from "./Components/Protected/ProtectedRoute";
import NavigationBar from "./Components/NavigationBar";
import EditExpense from "./Components/Routes/EditExpense";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Router>
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <ProtectedRoute
            path="/categories"
            exact={true}
            component={Category}
          />
          <ProtectedRoute path="/expenses" exact={true} component={Expenses} />
          <ProtectedRoute
            path="/expenses/edit"
            exact={true}
            component={EditExpense}
          />
          <ProtectedRoute path="/users" exact={true} component={Users} />
          <Route path="/logout" exact={true} component={Logout} />
          <Route path="/login" exact={true} component={Login} />
          <Route path="/register" exact={true} component={Register} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
