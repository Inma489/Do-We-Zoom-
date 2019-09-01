import React, { useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { IDecoded, IPhoto, IUser } from "../interfaces";
import * as actions from "../actions";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import "../css/myPosts.css";

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  setPhotos: (photos: IPhoto[]) => void;
  photos: IPhoto[];
  users: IUser[];
  removePhoto: (photo_id: string) => void;
}

const MyPosts: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const { Icon } = require("react-materialize");

  // hacemos la peticion para eliminar una foto de la base de datos
  let _id = props.match.params.userId;
  let myphotos = props.photos.filter(p => p.owner === _id);
  console.log(_id);
  console.log(props.photos);
  console.log(myphotos);

  const deletePhoto = (photo_id: string) => {
    fetch("http://localhost:8080/api/photos/" + photo_id, {
      method: "DELETE",
      headers: {
        // "Content-type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(res => {
      if (res.ok) {
        props.removePhoto(photo_id);
      }
    });
  };

  // if (! myphotos){
  //   return null
  // }

  return (
    <div className="section container">
      <div className="row">
        <div className="col s6">
          <Link
            to="/myPosts/add/photo"
            className="waves-effect waves-light btn"
          >
            + Photo
          </Link>
        </div>
      </div>
      <div className="row">
        {myphotos.map(p => (
          <div className="col s12 m4" key={p._id}>
            <div className="card">
              <div className="card-image">
                <Link to={"/myPosts/" + p._id + "/photoDetail"}>
                  <img
                    className="responsive-img hoverable"
                    src={
                      p.filename
                        ? "http://localhost:8080/uploads/photos/" + p.filename
                        : "/image/60352801-icono-de-la-cámara-símbolo-photocamera-profesional-botón-con-el-icono-de-banda-plana-en-el-fondo-blanco-bot.jpg"
                    }
                  />
                </Link>
              </div>
            </div>
            <Link
              to={"/myPosts/" + p._id + "/edit"}
              className="waves-effect waves-light btn btnEditPhoto"
            >
              <Icon>edit</Icon>
            </Link>
            
            <Link
              onClick={() => {
                deletePhoto(p._id);
              }}
              to={"/myPosts/" + props.decoded._id}
              className="waves-effect waves-light btn btndeletePhoto"
            >
              <Icon>delete</Icon>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded,
  photos: state.photos,
  users: state.users
});
const mapDispatchToProps = {
  setPhotos: actions.setPhotos,
  removePhoto: actions.removePhoto
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyPosts);
