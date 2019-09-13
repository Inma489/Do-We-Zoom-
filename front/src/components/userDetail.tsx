import React from "react";
import { IUser, IPhoto, IDecoded } from "../interfaces";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link } from "react-router-dom";
import * as actions from "../actions";

interface IPropsGlobal {
  users: IUser[];
  photos: IPhoto[];
  decoded: IDecoded;
  token: string;
  setPhotos: (photos: IPhoto[]) => void;
}

const UserDetail: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const { Icon } = require("react-materialize");
  const user = props.users.find(u => u._id === props.match.params.userId);
  let _id = props.match.params.userId;
  let myphotos = props.photos.filter(p => p.owner === _id);

  const listPhotos = () => {
    fetch("http://localhost:8080/api/photos", {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(res => {
      if (res.ok) {
        // si todo esta ok enviame un json con la lista de las fotos.
        res.json().then(photos => {
          props.setPhotos(photos);

          // console.log(photos);
        });
      }
    });
  };

  React.useEffect(listPhotos, []);

  if (!user) {
    return null;
  }
  return (
    <div className="usersBackground">
      <section id="content">
        <div className="container">
          <div id="profile-page" className="section">
            <Link to={"/posts"}>
              <Icon className="x">close</Icon>
            </Link>
            <div id="profile-page-header" className="card1">
              <div className="card-image waves-effect waves-block">
                <img
                  className="responsive-img fondo-perfil"
                  src={"/image/foto-fondoperfil.jpg"}
                  alt=""
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
                      : "/image/avatar-default.png"
                  }
                  alt=""
                />
              </figure>
              <div className="card-content">
                <div className="row">
                  <div className="col s3 offset-s2">
                    <h4 className="card-title grey-text text-darken-4 title1">
                      {user.username}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {myphotos.map(
              (_, i1) =>
                i1 % 3 === 0 && (
                  <div id="profile-page-content" className="row">
                    {myphotos.slice(i1, i1 + 3).map(p => (
                      <div className="col s4 m4" key={p._id}>
                        <div className="card">
                          <div className="card-image">
                            <Link to={"/posts/" + p._id + "/userPhotoDetail"}>
                              <img
                                className="activator"
                                src={
                                  p.filename
                                    ? "http://localhost:8080/uploads/photos/" +
                                      p.filename
                                    : "/image/largee.gif"
                                }
                                alt=""
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  users: state.users,
  photos: state.photos,
  decoded: state.decoded,
  token: state.token
});
const mapDispatchToProps = {
  setPhotos: actions.setPhotos
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDetail);
