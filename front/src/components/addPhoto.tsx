import React from "react";
import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { IDecoded } from "../interfaces";
import { Link } from "react-router-dom";
import "../css/addPhoto.css";

interface IPropsGlobal {
  token: string;
  addPhoto: (photo: string) => void;
  decoded: IDecoded;
}

const AddPhoto: React.FC<IPropsGlobal & RouteComponentProps> = props => {
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

  const add = () => {
    const data = new FormData();
    data.append("file", file);
    data.append("name", name);
    data.append("camera", camera);
    data.append("localization", localization);
    //preguntar a angel a ver si esta bien la peticion
    fetch("http://localhost:8080/api/photos/add/", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token
      },
      body: data
    })
      .then(res => {
        if (res.ok) {
          // poner siempre porque es el usuario nuevo que voy a crear
          res.json().then(p => {
            props.addPhoto(p);
            props.history.push("/myPosts/" + props.decoded._id); // me redirije a mi pagina de login en este caso

            // me refresca la pagina que le estoy diciendo
            //aqui me  gustaria poner que cuando el usuario se haya registrado correctamente
            // que le saliera un texto que le pusiera: usuario resgistrado o algo asi
          });
        } else {
          //   res.send("error");
          console.log("error");
        }
      })
      .catch(err => {
        // res.status(400).send("error add ," + err);
        console.log("error al add photo," + err);
      });
  };

  return (
    <div className="usersBackground">
    <div className="section container contaddphoto">
      <div className="row">
        <div className="col s12 m7">
          <div className="row card-panel">
            <div className="input-field col s11">
              <img width="200" src="" alt="" />

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

              {/* <input
                type="file"
                onChange={updateFile}
                className="validate fileaddphoto"
                accept=".jpg"
                required
              /> */}
              <div className="row">
                <label className="letters">Title</label>
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
                <label className="letters">Camera</label>
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
                <label className="letters">Location</label>
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
            <button
              onClick={add}
              className="waves-effect waves-light btn btnsavePhoto"
            >
              <Icon>save</Icon>
            </button>
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
  decoded: state.decoded
});
const mapDispatchToProps = {
  addPhoto: actions.addPhoto
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPhoto);
