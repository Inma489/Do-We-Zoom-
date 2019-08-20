import React from "react";
import { IUser, IDecoded } from "../interfaces";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import * as actions from "../actions";

interface IPropsGlobal {
  token: string;
  users: IUser[];
  decoded: IDecoded;
  Reset:() => void
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
      props.Reset()
      localStorage.removeItem("token");
      props.history.push("/layout"); // me redirije a mi pagina de users// el history.push es para que me redirija al /users
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="section content">
      <div className="col s12 m7">
        <div className="card horizontal">
          <div className="card-image" />
          {/*aqui pondre la imagen de la base de datos*/}
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
}
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
