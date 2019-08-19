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
  // const {Navbar,NavItem,Divider,Dropdown } = require("react-materialize");
  const user = props.users.find(u => u._id === props.decoded._id);

  const logOut = () => {
    props.Reset();
    localStorage.removeItem("token"); // para que elimine el token de la sesion en el session storage
  };

  if (!user) {
    return null;
  }

  return (
    //si no hay token muestrame estas cosas si no muestrame otras
    // para darle opciones a mi dropdown : options={{hover:true}}
    <div className="container-fluid">
      <div className="navbar-fixed">
        <nav className="#c2185b pink darken-2">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo">
              Mi Logo
            </a>
            <ul className="right">
              <li>
                <a href="#">Users</a>
              </li>
              <li>
                <a href="#">Posts</a>
              </li>
              <li>
                <a href="#">Events</a>
              </li>
              <li>
                <a href="#" className="dropdown-trigger"  data-beloworigin="true"data-target="drop">
                  {user.username}
                  <i className="material-icons right">arrow_drop_down</i>
                </a>
                <ul id="drop" className="dropdown-content">
                  <li>
                    <div >Profile</div>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <a href="#">My posts</a>
                  </li>
                  <li>
                    <a href="#">Logout</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>

    // el nuevo navbar comiezza aqui




    

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
