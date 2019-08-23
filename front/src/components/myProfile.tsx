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
    /* aqui voy a poner el nuevo profile a ver como queda*/
    /*
    <div className="section content">
      <div className="row">
        <div className="col s12">
          <div className="container">
            <div className="row user-profile mt-1">
              <img
                className="responsive-img forest"
                alt="forest"
                src="/image/foto-fondoperfil.jpg"
              />
            </div>
            <div className="section">
              <div className="row">
                <div className="col s12 m4 l3 user-section-negative-margin">
                  <div className="row">
                    <div className="col s12 center-align">
                      <img
                        width="200"
                        className="responsive-img circle z-depth-5 avatar" 
                        src={
                          user.avatar
                            ? "http://localhost:8080/uploads/avatars/" + user.avatar + "?" + Date()
                            : "/image/avatar-default.png"
                        }
                        alt="avatar"
                      />
                    </div>
                  </div>
                </div>
                <div className="col s12 m8 l6">
                  <div className="row">
                    <div className="card user-card-negative-margin z-depth-0">
                      <div className="card-content card-border-gray">
                        <div className="row">
                          <div className="col s12">
                            <h5>{user.username}</h5>
                            <p>{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    */

    /*AQUI EL OTRO PERFIL*/

    <div className="section content">
      <div className="col s12 m7">
        <div className="card horizontal">
          <div className="card-image" />
          
          <img
            width="500"
            src={
              user.avatar
                ? "http://localhost:8080/uploads/avatars/" + user.avatar + "?" + Date()
                : "/image/avatar-default.png"
            }
          />
          <div className="row">
            <h2 className="header">{user.username}</h2>
          </div>
          <div className="row">
            <div className="card-stacked">
              <div className="card-content">
                <p>{user.email}</p>
              </div>
            </div>
            <div className="row">
              <div className="card-action">
                <Link to={"/users/" + props.decoded._id + "/edit"}>Edit</Link>
                <Link to="/" className="waves-effect waves-light btn"onClick={() => {
                  Delete(user._id)
                }}>Delete account</Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div> 
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
