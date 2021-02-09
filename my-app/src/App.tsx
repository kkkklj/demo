import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Login  from "./views/login";
import Register  from "./views/register";
import { Route, Switch, Redirect } from "react-router-dom";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/register" component={Register}></Route>
      <Redirect to="/" />
    </Switch>
  );
}

export default App;
