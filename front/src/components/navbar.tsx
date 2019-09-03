import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { IDecoded, IUser } from "../interfaces";
import * as actions from "../actions";
import "../css/navbar.css";

const materialize = require("react-materialize");

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  Reset: () => void;
  setSearch: (search: string) => void;
  search: string;
  users: IUser[];
}

const Navbar: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  // const Navbar: React.FC<IPropsGlobal> = props => {

// const { Button, Icon, Divider, Dropdown } = require("react-materialize");
  const user = props.users.find(u => u._id === props.decoded._id);
  const param = props.location.pathname;
  const onSearchChange = (e: any) => {
    props.setSearch(e.target.value);
  };

  const logOut = () => {
    props.Reset();
    localStorage.removeItem("token"); // para que elimine el token de la local en el localstorage
  };

  if (!user) {
    return null;
  }

  return (
    // creamos de nuevo un navbar

    <div>
      <materialize.Navbar
        brand={
          <materialize.NavItem>
            <Link to="/">
              <img
                className="responsive-img object"
                width="70"
                src="/image/objetivo.png"
                alt="logo"
              />
            </Link>
          </materialize.NavItem>
        }
        className="black nav"
        fixed={true}
        alignLinks="right"
      >
        
        <materialize.NavItem className="searcha" hidden={param === "/posts" || param === "/users"|| param === "/events" ? false:true}>
        {/* <materialize.NavItem className="searcha"> */}

          <input
            id="search"
            type="search"
            value={props.search}
            onChange={onSearchChange}
          />
          <materialize.Icon className="iconsearch">search</materialize.Icon>
        </materialize.NavItem>
        <materialize.NavItem>
          <Link className="media" to="/">
            Home
          </Link>
        </materialize.NavItem>
        <materialize.NavItem>
          <Link className="media" to="/users">
            Users
          </Link>
        </materialize.NavItem>
        <materialize.NavItem>
          <Link className="media" to="/posts">
            Posts
          </Link>
        </materialize.NavItem>
        <materialize.NavItem>
          <Link className="media" to="/events">
            Events
          </Link>
        </materialize.NavItem>
        <materialize.NavItem>
          <img
            width="60"
            className="circle responsive-img avatar"
            src={
              user.avatar
                ? "http://localhost:8080/uploads/avatars/" +
                  user.avatar +
                  "?" +
                  Date()
                : "/image/default-avatar1.jpg"
            }
            alt="avatar"
          />
        </materialize.NavItem>
        <materialize.NavItem className="username">
          {user.username}
        </materialize.NavItem>
        <materialize.Dropdown
          trigger={
            <materialize.Button id="btnDrop">
              <materialize.Icon className="arrow">
                arrow_drop_down
              </materialize.Icon>
            </materialize.Button>
          }
        >
          <Link className="text" to={"/users/" + props.decoded._id}>
            <materialize.Icon className="is">account_circle</materialize.Icon>
            Profile
          </Link>
          <materialize.Divider />
          <Link
            className="text"
            onClick={e => props.decoded.admin && e.preventDefault()}
            to={"/myPosts/" + props.decoded._id}
          >
            <materialize.Icon className="is">insert_photo</materialize.Icon>
            My Posts
          </Link>
          <materialize.Divider />
          <Link to="/" onClick={logOut}>
            <materialize.Icon className="iss">settings_power</materialize.Icon>
          </Link>
        </materialize.Dropdown>
      </materialize.Navbar>
    </div>

    //si no hay token muestrame estas cosas si no muestrame otras
    // para darle opciones a mi dropdown : options={{hover:true}}
    // aqui comenzare otro navbar de nuevo por 4 vez o 5...
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded,
  users: state.users,
  search: state.search
});

const mapDispatchToProps = {
  Reset: actions.Reset,
  setSearch: actions.setSearch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
