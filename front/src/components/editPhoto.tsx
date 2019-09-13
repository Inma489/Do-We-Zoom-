import React from "react";
import { RouteComponentProps } from "react-router";
import { IDecoded, IPhoto } from "../interfaces";
import * as actions from "../actions";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link } from "react-router-dom";
import "../css/editPhoto.css";

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  photos: IPhoto[];
  updatePhoto: (photo: IPhoto, photo_id: string) => void;
}

const EditPhoto: React.FC<
  IPropsGlobal & RouteComponentProps<{ photoId: string }>
> = props => {
  const { Icon } = require("react-materialize");

  const [file, setFile] = React.useState();
  const [name, setName] = React.useState("");
  const [camera, setCamera] = React.useState("");
  const [localization, setLocalization] = React.useState();

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files![0]);

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const updateCamera = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCamera(event.target.value);

  const updateLocalization = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLocalization(event.target.value);

  const photo = React.useMemo(
    // aqui cogemos de redux las photos
    () => props.photos.find(p => p._id === props.match.params.photoId),
    [props.match.params.photoId, props.photos]
  );

  React.useEffect(() => {
    if (photo) {
      setName(photo.name);
      setCamera(photo.camera);
      setLocalization(photo.localization);
    }
  }, [photo]);

  if (!photo) {
    return null;
  }

  const editPhoto = (photo_id: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("name", name);
    data.append("camera", camera);
    data.append("localization", localization);
    fetch("http://localhost:8080/api/photos/" + photo_id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + props.token
      },
      body: data
    }).then(res => {
      if (res.ok) {
        res.json().then(p => {
          props.updatePhoto(p, photo_id);
          props.history.push("/myPosts/" + props.decoded._id);
        });
      }
    });
  };

  return (
    <div className="usersBackground">
      <div className="section container contPhoto">
        <div className="row">
          <div className="col s12 m7">
            <div className="row card-panel">
              <div className="input-field col s11">
                <img
                  className="responsive-img"
                  width="250"
                  src={
                    photo.filename
                      ? "http://localhost:8080/uploads/photos/" +
                        photo.filename +
                        "?" +
                        Date()
                      : "/image/camara.jpg"
                  }
                  alt=""
                />
                <div className="file-field input-field">
                  <div className="btn">
                    <Icon>add_a_photo</Icon>
                    <input
                      type="file"
                      onChange={updateFile}
                      accept=".jpg"
                      required
                    />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                  </div>
                </div>

                <div className="row">
                  <label className="letterss">Title</label>
                  <input
                    type="text"
                    onChange={updateName}
                    placeholder="Name of photo"
                    value={name}
                    className="validate"
                    required
                  />
                </div>
                <div className="row">
                  <label className="letterss">Camera</label>
                  <input
                    type="text"
                    onChange={updateCamera}
                    value={camera}
                    placeholder="Camera"
                    className="validate"
                    required
                  />
                </div>
                <div className="row">
                  <label className="letterss">Location</label>
                  <input
                    type="text"
                    onChange={updateLocalization}
                    value={localization}
                    placeholder="Location"
                    className="validate"
                    required
                  />
                </div>
              </div>
              <Link
                to={"/myPosts/" + props.decoded._id}
                onClick={() => editPhoto(photo._id)}
                className="waves-effect waves-light btn btnsavePhoto"
              >
                <Icon>save</Icon>
              </Link>
              <Link
                to={"/myPosts/" + props.decoded._id}
                className="waves-effect waves-light btn btnCancelPhoto"
              >
                <Icon>cancel</Icon>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded,
  photos: state.photos
});
const mapDispatchToProps = {
  updatePhoto: actions.updatePhoto
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPhoto);
