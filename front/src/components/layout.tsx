import React, { Fragment } from "react";
import Navbar from "./navbar";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router";
import ShowUsers from "./showUsers";
import MyProfile from "./myProfile";
import ShowPhotos from "./showPhotos";
import EditProfile from "./editProfile";
import EditUser from "./editUser";
import MyPosts from "./myPosts";
import { IUser, IPhoto, IDecoded } from "../interfaces";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import * as actions from "../actions";
import AddPhoto from "./addPhoto";
import EditPhoto from "./editPhoto";
import ShowEvents from "./showEvents";
import AddEvent from "./addEvent";
import EditEvent from "./editEvent";
import PhotoDetail from "./photoDetail";
import PhotoUserDetail from "./photoUserDetail";
import UserPhotoDetail from "./userPhotoDetail";
import UserPhotoDetails from "./userPhotoDetails";
import UserDetail from "./userDetail";
import UserDetails from "./userDetails";
import "../css/layoutBackGround.css";
// import "../css/navbar.css";
import LayoutBackGround from "./layoutBackGround";


interface IPropsGlobal {
  setUsers: (users: IUser[]) => void;
  token: string;
  users: IUser[];
  photos: IPhoto[];
  decoded: IDecoded;
  setSearch: (search: string) => void;
  setPhotos: (photos: IPhoto[]) => void;
}
// los componeentes siempre poner la primera letra en mayusculas
const LayoutPage: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string; photoId: string }>
> = props => {
  // esto es lo que habia antes en el post que me genera todos las fotos,
  // pero me las filtra por el id de usuario
  const listPhotos = () => {
    fetch("http://localhost:8080/api/photos", {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + props.token // aqui en el Bearer tengo que meter el espacio para que no me aparezca el Bearer que anteriormente habiamos quitado en nuestro token
      }
    }).then(res => {
      if (res.ok) {
        // si todo esta ok enviame un json con la lista de las fotos, tienes que ser administrador para poder acceder a la lista
        res.json().then(photos => {
          props.setPhotos(photos);

          console.log(photos);
        });
      }
    });
  };

  const listUsers = () => {
    fetch("http://localhost:8080/api/users", {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + props.token // aqui en el Bearer tengo que meter el espacio para que no me aparezca el Bearer que anteriormente habiamos quitado en nuestro token
      }
    }).then(res => {
      if (res.ok) {
        // si todo esta ok enviame un json con la lista de los usuarios, tienes que ser administrador para poder acceder a la lista
        res.json().then(users => {
          props.setUsers(users);
        });
      }
    });
  };

  React.useEffect(listUsers, []);
  React.useEffect(listPhotos, []);

  React.useEffect(() => {
    props.setSearch("");
  }, [props.location.pathname]);

  return (
    <Fragment>
      {/* <Navbar /> */}
      <Route component={Navbar} />
      <Route path="/" exact component={LayoutBackGround} />
      <div className="routes">
        <Switch>
          <Route path="/users/:userId/edit" exact component={EditProfile} />
          <Route path="/users/:userId/editUser" exact component={EditUser} />
          <Route path="/myPosts/:photoId/edit" exact component={EditPhoto} />
          <Route path="/events/:eventId/edit" exact component={EditEvent} />
          <Route
            path="/myPosts/:photoId/photoDetail"
            exact
            component={PhotoDetail}
          />
          <Route
            path="/posts/:photoId/userPhotoDetail"
            exact
            component={UserPhotoDetail}
          />
          <Route
            path="/posts/:photoId/userPhotoDetails"
            exact
            component={UserPhotoDetails}
          />
          <Route
            path="/posts/:photoId/photoUserDetail"
            exact
            component={PhotoUserDetail}
          />

          <Route
            path="/users/:userId/userDetail"
            exact
            component={UserDetail}
          />
          <Route
            path="/users/:userId/userDetails"
            exact
            component={UserDetails}
          />

          <Route path="/myPosts/:userId" exact component={MyPosts} />
          <Route path="/users/:userId" exact component={MyProfile} />
          <Route path="/users" exact component={ShowUsers} />
          <Route path="/posts" exact component={ShowPhotos} />
          <Route path="/events" exact component={ShowEvents} />
          <Route path="/events/add/event" exact component={AddEvent} />
          <Route path="/myPosts/add/photo" exact component={AddPhoto} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Fragment>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  photos: state.photos,
  decoded: state.decoded,
  users: state.users
});
const mapDispatchToProps = {
  setUsers: actions.setUsers,
  setPhotos: actions.setPhotos,
  setSearch: actions.setSearch
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutPage);
