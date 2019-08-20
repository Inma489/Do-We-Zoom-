import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { IGlobalState } from "./reducers";
import { connect } from "react-redux";
import LoginPage from "./components/loginPage";
import LayoutPage from "./components/layout";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

interface IPropsGlobal {
  token: string;
}

const App: React.FC<IPropsGlobal> = props => {
  return (
    <BrowserRouter>
      <Switch>
        {!props.token && <Route path="/" exact component={LoginPage} />}
        {props.token && <Route path="/" component={LayoutPage} />}
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token
});

export default connect(mapStateToProps)(App);
