import React from "react";
import "./index.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { IGlobalState } from "./reducers";
import { connect } from "react-redux";
import LoginPage from "./components/loginPage";
import LayoutPage from "./components/layout";
import jwt from "jsonwebtoken";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import "react-materialize/lib/Icon";
import { IDecoded } from "./interfaces";
import * as actions from "./actions";

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  setDecoded: (decoded: IDecoded) => void;
  setToken: (token: string) => void;
}

const App: React.FC<IPropsGlobal> = props => {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwt.decode(token);
      if (decoded) {
        props.setDecoded(decoded);
        props.setToken(token);
      }
    }
    setIsLoading(false);
  }, [props.setDecoded, props.setToken]);

  return (
    <BrowserRouter>
      <Switch>
        {!props.token && !isLoading && (
          <Route path="/" exact component={LoginPage} />
        )}
        {props.token && <Route path="/" component={LayoutPage} />}
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded
});
const mapDispatchToProps = {
  setToken: actions.setToken,
  setDecoded: actions.setDecoded
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
