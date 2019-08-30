import React from "react";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import * as actions from "../actions";
import { Link } from "react-router-dom";
import "../css/addEvent.css";

interface IPropsGlobal {
  token: string;
  addEvent: (event: string) => void;
}

const AddEvent: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  const { Icon } = require("react-materialize");
  const [file, setFile] = React.useState();
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState();
  const [place, setPlace] = React.useState("");
  const [time, setTime] = React.useState();
  const [description, setDescription] = React.useState("");

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files![0]);

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const updateDate = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(event.target.value);

  const updatePlace = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPlace(event.target.value);

  const updateTime = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTime(event.target.value);

  const updateDescription = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDescription(event.target.value);

  const add = () => {
    const data = new FormData();
    data.append("file", file);
    data.append("name", name);
    data.append("date", date);
    data.append("place", place);
    data.append("time", time);
    data.append("description", description);
    //preguntar a angel a ver si esta bien la peticion
    fetch("http://localhost:8080/api/events/add", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token
      },
      body: data
    })
      .then(res => {
        if (res.ok) {
          // poner siempre porque es el usuario nuevo que voy a crear
          res.json().then(a => {
            props.addEvent(a);
            props.history.push("/events"); // me redirije a mi pagina de login en este caso

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
    <div className=" section container contAdd">
      <div className="row">
        <div className="col s12 m9">
          <div className="row card-panel">
            <div className="input-field col s12">
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
                className="validate"
                accept=".jpg"
                required
              /> */}
              <div className="row">
                <label className="letters">Title</label>
                <input
                  type="text"
                  onChange={updateName}
                  placeholder="Title"
                  value={name}
                  className="validate"
                  required
                />
              </div>
              <div className="row">
              <label className="letters">Date</label>
              <input
                type="text"
                onChange={updateDate}
                value={date}
                placeholder="Date"
                className="validate"
                required
              />
              </div>
              <div className="row">
              <label className="letters">Place</label>
              <input
                type="text"
                onChange={updatePlace}
                value={place}
                placeholder="Place"
                className="validate"
                required
              />
              </div>
              <div className="row">
              <label className="letters">Time</label>
              <input
                type="text"
                onChange={updateTime}
                value={time}
                placeholder="Time"
                className="validate"
                required
              />
              </div>
              <div className="row">
              <label className="letters">Description</label>
              <input
                type="text"
                onChange={updateDescription}
                value={description}
                placeholder="Description"
                className="validate"
                required
              />
              </div>
            </div>

            <Link
              onClick={add}
              to="/events"
              className="waves-effect waves-light btn btnaddEvent"
            >
              <Icon>save</Icon>
            </Link>
            <Link to="/events" className="waves-effect waves-light btn">
              <Icon>cancel</Icon>
            </Link>
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token
});
const mapDispatchToProps = {
  addEvent: actions.addEvent
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEvent);
