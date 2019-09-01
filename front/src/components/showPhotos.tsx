import React from "react";
import { IDecoded, IPhoto, IUser } from "../interfaces";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import "../css/showPhotos.css";

interface IPropsGlobal {
  token: string;
  photos: IPhoto[];
  setPhotos: (photos: IPhoto[]) => void;
  removePhoto: (photo_id: string) => void;
  decoded: IDecoded;
  users: IUser[];
}

const ShowPhotos: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  const { Icon } = require("react-materialize");
  const user = props.users.find(u => u._id === props.decoded._id);
  const deletePhoto = (photo_id: string) => {
    fetch("http://localhost:8080/api/photos/" + photo_id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + props.token // aqui en el Bearer tengo que meter el espacio para que no me aparezca el Bearer que anteriormente habiamos quitado en nuestro token
      }
    }).then(res => {
      if (res.ok) {
        // si todo esta ok enviame un json con la lista de las fotos, tienes que ser administrador para poder acceder a la lista

        props.removePhoto(photo_id);
        props.history.push("/posts");
      }
    });
  };
  if (!user) {
    return null;
  }

  return (
    <div className="usersBackground">
    <div className="section container">
      <div className="row">
        {props.photos
          .filter(p => p.owner != props.decoded._id)
          .map(p => {
            const u = props.users.find(u => u._id === p.owner);
            if (!u) {
              return null;
            }
            return (
              <div className="col s12 m4 box" key={p._id}>
                <div className="card">
                  <div className="card-image photolist">
                    <Link to={"/posts/" + p._id + "/photoUserDetail"}>
                      <img
                        className="responsive-img activator hoverable photo"
                        src={
                          p.filename
                            ? "http://localhost:8080/uploads/photos/" +
                              p.filename
                            : "/image/largee.gif"
                        }
                      />
                    </Link>
                  </div>
                  
                  <div className="overlay">
                    <Link
                      className="word"
                      to={"/users/" + u._id + "/userDetail"}
                    >
                      <img
                        className="circle responsive-img users"
                        width="60"
                        src={
                          u.avatar
                            ? "http://localhost:8080/uploads/avatars/" +
                              u.avatar
                            : "/image/avatar-default.png"
                        }
                        alt="user"
                      />
                      <div>{u.username}</div>
                    </Link>
                  </div>
                </div>
                {props.decoded.admin && (
                  <Link
                    onClick={() => {
                      deletePhoto(p._id);
                    }}
                    to="/posts"
                    className="waves-effect waves-light btn btnDeletePost"
                  >
                    <Icon>delete</Icon>
                  </Link>
                )}
              </div>
            );
          })}
      </div>
    </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  photos: state.photos,
  decoded: state.decoded,
  users: state.users
});
const mapDispatchToProps = {
  setPhotos: actions.setPhotos,
  removePhoto: actions.removePhoto
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowPhotos);
