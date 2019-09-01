import React from "react";
import { IUser, IDecoded } from "../interfaces";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import * as actions from "../actions";
import "../css/myProfile.css";

interface IPropsGlobal {
  token: string;
  users: IUser[];
  decoded: IDecoded;
  Reset: () => void;
}

const MyProfile: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const { Icon } = require("react-materialize");
  const user = props.users.find(u => u._id === props.decoded._id); //aqui me coge los usuarios de redux
  // el if lo ponemos porque es user puede venir undefined

  // hacemos la peticion para eliminar un usuario de la base de daatos
  const Delete = (id: string) => {
    fetch("http://localhost:8080/api/users/" + id, {
      method: "DELETE",
      headers: {
        //   "Content-type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(() => {
      props.Reset();
      localStorage.removeItem("token");
      props.history.push("/layout"); // me redirije a mi pagina de users// el history.push es para que me redirija al /users
    });
  };

  if (!user) {
    return null;
  }

  return (
    

    <section id="content">
      <div className="container">
        <div id="profile-page" className="section">
          <div id="profile-page-header" className="card1">
            <div className="card-image waves-effect waves-block waves-light">
              <img
                className="responsive-img fondo-perfil"
                src={"/image/foto-fondoperfil.jpg"}
                alt="fondo"
              />
            </div>
            <figure className="card-profile-image">
              <img
                className="circle responsive-img foto-perfil"
                src={
                  user.avatar
                    ? "http://localhost:8080/uploads/avatars/" +
                      user.avatar +
                      "?" +
                      Date()
                    : "/image/default-avatar1.jpg"
                }
              />
            </figure>
            <div className="card-content">
              <div className="row">
                <div className="col s3 offset-s2">
                  <h4 className="card-title grey-text text-darken-4">
                    {user.username}
                  </h4>
                  <h6 className="medium-small grey-text text-darken-3">
                    {user.email}
                  </h6>
                </div>
              </div>
              <Link
                to={"/users/" + props.decoded._id + "/edit"}
                className="waves-effect waves-light btn btneditprofile"
              >
                <Icon>edit</Icon>
              </Link>
              <Link
                to="/"
                className="waves-effect waves-light btn btndeleteacount"
                onClick={() => {
                  Delete(user._id);
                }}
              >
                <Icon>delete_forever</Icon>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    /*AQUI EL OTRO PERFIL*/

    // <div className="section content">
    //   <div className="row">
    //   <div className="col s12 m8">
    //     <div className="card horizontal">
    //       <div className="card-image responsive-img">

    //       <img
    //         width="500"
    //         className="circle responsive-img"
    //         src={
    //           user.avatar
    //             ? "http://localhost:8080/uploads/avatars/" + user.avatar + "?" + Date()
    //             : "/image/avatar-default.png"
    //         }
    //       />
    //       </div>

    //         <div className="card-stacked">
    //           <div className="card-content">
    //           <h3 className="header">{user.username}</h3>
    //             <p>{user.email}</p>
    //           </div>

    //           <div className="card-action">
    //             <Link to={"/users/" + props.decoded._id + "/edit"}className="waves-effect waves-light btn"><Icon>edit</Icon></Link>
    //             <Link to="/" className="waves-effect waves-light btn"onClick={() => {
    //               Delete(user._id)
    //             }}><Icon>delete_forever</Icon></Link>
    //           </div>
    //         </div>
    //         </div>
    //       </div>
    //     </div>
    //     </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  users: state.users,
  decoded: state.decoded
});
const mapDispatchToProps = {
  Reset: actions.Reset
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfile);
