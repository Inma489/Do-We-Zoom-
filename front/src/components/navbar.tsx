import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { IDecoded, IUser } from "../interfaces";
import * as actions from "../actions";

import "../css/navbar.css";

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  Reset: () => void;

  users: IUser[];
}

const Navbar: React.FC<IPropsGlobal> = props => {
  const { Button, Icon, Divider, Dropdown } = require("react-materialize");
  const user = props.users.find(u => u._id === props.decoded._id);

  const logOut = () => {
    props.Reset();
    localStorage.removeItem("token"); // para que elimine el token de la sesion en el session storage
  };

  if (!user) {
    return null;
  }

  return (
    // creamos de nuevo un navbar

    //si no hay token muestrame estas cosas si no muestrame otras
    // para darle opciones a mi dropdown : options={{hover:true}}
    <div className="container-fluid">
      <nav>
        <div className="nav-wrapper">
        <Link to="/">
          <a className="brand-logo left">Logo</a>
          </Link>
          <ul className="right hide-on-med-and-down list">
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <img
                width="60"
                className="avatar"
                src={
                  user.avatar
                    ? "http://localhost:8080/uploads/avatars/" +
                      user.avatar +
                      "?" +
                      Date()
                    : "/image/avatar-default.png"
                }
                alt="avatar"
              />
            </li>

            <Dropdown trigger={<Button>{user.username}</Button>}>
              
              <Link to={"/users/" + props.decoded._id}>
                <Icon>person</Icon>Profile
                </Link>
              
              
              <Divider />
              {!props.decoded.admin && (
              
              <Link to={"/myPosts/" + props.decoded._id}>
                <Icon>insert_photo</Icon>
                My Posts
                </Link>
              
              )}
              <Divider />
            </Dropdown>
            <Link
              to="/"
              className="waves-effect waves-light btn-small"
              onClick={logOut}
            >
              <i className="small material-icons">settings_power</i>
            </Link>
          </ul>
        </div>
      </nav>
    </div>

    /*
 <div className="container-fluid">

<nav>
  <div className="nav-wrapper">
    <img
      width="60"
      src={
        user.avatar
          ? "http://localhost:8080/uploads/avatars/" +
            user.avatar +
            "?" +
            Date()
          : "/image/foto-default.png"
      }
      alt="avatar"
    />
    <ul className="right hide-on-med-and-down">
      <li>
        <Link to={"/users/" + props.decoded._id}>My profile</Link>
      </li>
      {!props.decoded.admin && (
        <li>
          <Link to={"/myPosts/" + props.decoded._id}>My posts</Link>
        </li>
      )}
      <li>
        <Link to="/">Home</Link>
      </li>
        <li>
          <Link to="/users">
            Users
          </Link>
        </li>
      
      <li>
        <Link to="/posts">
          
          Posts
        </Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <a className='dropdown-trigger btn' href='#' data-target='dropdown1'>{user.username}</a>
      <ul id='dropdown1' className='dropdown-content'>
    <li><a href="#">one</a></li>
    <li><a href="#">two</a></li>
  </ul>

      <Link
        to="/"
        className="waves-effect waves-light btn-small"
        onClick={logOut}
      >
        <i className="small material-icons">settings_power</i>
      </Link>
    </ul>
  </div>
</nav>
</div> 
*/
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded,
  users: state.users
});

const mapDispatchToProps = {
  Reset: actions.Reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
