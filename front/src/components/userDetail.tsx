import React from "react";
import { IUser, IPhoto, IDecoded } from "../interfaces";
import { RouteComponentProps, Redirect } from "react-router";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link } from 'react-router-dom';
import * as actions from "../actions";


interface IPropsGlobal {
  users: IUser[];
  photos: IPhoto[];
  decoded: IDecoded;
  token:string;
  setPhotos:(photos: IPhoto[]) => void
}

const UserDetail: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const {Icon} = require("react-materialize");
  const user = props.users.find(u => u._id === props.match.params.userId);
  let _id = props.match.params.userId;
  let myphotos = props.photos.filter(p => p.owner === _id);

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

  React.useEffect(listPhotos, []);


  if (!user) {
    return null;
  }
  return (
    <div className="section container">
      <Link to={"/posts"}>
      <Icon>close</Icon>
      </Link>
      <div className="row">
        <div className="col s12">
          <div className="card-image" />
          <img
            width="500"
            src={
              user.avatar
                ? "http://localhost:8080/uploads/avatars/" +
                  user.avatar +
                  "?" +
                  Date()
                : "/image/avatar-default.png"
            }
          />
          <div className="row">
            <h2 className="header">{user.username}</h2>
          </div>
        </div>
      </div>
      <div className="row">
      {myphotos.map(p => (
          <div className="col s2" key={p._id}>
            <div className="card">
              <div className="card-image waves-effect waves-block waves-light">
                <Link to={"/posts/" + p._id + "/userPhotoDetail"}>
                <img
                  className="activator"
                  src={
                    p.filename
                      ? "http://localhost:8080/uploads/photos/" + p.filename
                      : "/image/60352801-icono-de-la-cámara-símbolo-photocamera-profesional-botón-con-el-icono-de-banda-plana-en-el-fondo-blanco-bot.jpg"
                  }
                />
                </Link>
              </div>
              <div className="card-content">
                <span className="card-title activator grey-text text-darken-4">
                  <h5>Title</h5>
                  {p.name}
                </span>
                
              </div>
            </div>
          </div>
        ))}
      </div>
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
}

export default connect(mapStateToProps,mapDispatchToProps)(UserDetail);
