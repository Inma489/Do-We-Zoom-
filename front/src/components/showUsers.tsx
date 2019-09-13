import React from "react";
import { IUser, IDecoded } from "../interfaces";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import * as actions from "../actions";
import { Link, RouteComponentProps } from "react-router-dom";
import "../css/showUsers.css";

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  users: IUser[];
  removeUser: (user_id: string) => void;
  removePhoto: (photo_id: string) => void;
  search: string;
}

const ShowUsers: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const { Icon } = require("react-materialize");
  // hacemos la peticion para eliminar un usuario de la base de daatos
  const Delete = (id: string) => {
    fetch("http://localhost:8080/api/users/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + props.token
      }
    }).then(() => {
      props.removeUser(id);
      props.removePhoto(id);
    });
  };

  return (
    <div className="usersBackground">
      <div className="section container">
        {props.users
          .filter(u =>
            u.username.toLowerCase().startsWith(props.search.toLowerCase())
          )
          .filter(u => u._id !== props.decoded._id)
          .map(
            (_, i1) =>
              i1 % 3 === 0 && (
                <div className="row">
                  {props.users
                    .filter(u =>
                      u.username
                        .toLowerCase()
                        .startsWith(props.search.toLowerCase())
                    )
                    .filter(u => u._id !== props.decoded._id)
                    .slice(i1, i1 + 3)
                    .map(u => (
                      <div
                        className="col s12 m4 hoverable border-card"
                        key={u.username}
                      >
                        <Link to={"/users/" + u._id + "/userDetails"}>
                          <div className="card">
                            <div className="card-image">
                              <img
                                className="responsive-img hoverable"
                                src={
                                  u.avatar
                                    ? "http://localhost:8080/uploads/avatars/" +
                                      u.avatar
                                    : "/image/default-avatar1.jpg"
                                }
                                alt="user"
                              />
                            </div>
                            <div className="card-content nombres">
                              <p className="card-title">{u.username}</p>

                              {props.decoded.admin && (
                                <Link
                                  to={"/users/" + u._id + "/editUser"}
                                  className="waves-effect waves-light btn ml-4"
                                >
                                  <Icon>edit</Icon>
                                </Link>
                              )}
                              {props.decoded.admin && (
                                <Link
                                  onClick={() => {
                                    Delete(u._id);
                                  }}
                                  to="/users"
                                  className="waves-effect waves-light btn btnDeleteUser"
                                >
                                  <Icon>delete</Icon>
                                </Link>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              )
          )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  users: state.users,
  decoded: state.decoded,
  search: state.search
});

const mapDispatchToProps = {
  removeUser: actions.removeUser,
  removePhoto: actions.removePhoto
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowUsers);
