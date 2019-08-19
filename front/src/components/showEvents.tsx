import React from "react";
import { IEvent, IDecoded } from "../interfaces";
import * as actions from "../actions";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link, RouteComponentProps } from "react-router-dom";


interface IPropsGlobal {
  events: IEvent[];
  token: string;
  decoded: IDecoded;
  setEvent: (events: IEvent[]) => void;
  removeEvent: (event_id: string) => void;
}

const ShowEvents: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  const listEvents = () => {
    fetch("http://localhost:8080/api/events/", {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + props.token // aqui en el Bearer tengo que meter el espacio para que no me aparezca el Bearer que anteriormente habiamos quitado en nuestro token
      }
    }).then(res => {
      if (res.ok) {
        // si todo esta ok enviame un json con la lista de los usuarios, tienes que ser administrador para poder acceder a la lista
        res.json().then(events => {
          props.setEvent(events);
        });
      }
    });
  };

  const deleteEvent = (event_id: string) => {
    fetch("http://localhost:8080/api/events/" + event_id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + props.token // aqui en el Bearer tengo que meter el espacio para que no me aparezca el Bearer que anteriormente habiamos quitado en nuestro token
      }
    }).then(res => {
      if (res.ok) {
        // si todo esta ok enviame un json con la lista de las fotos, tienes que ser administrador para poder acceder a la lista

        props.removeEvent(event_id);
        props.history.push("/events");
      }
    });
  };

  React.useEffect(listEvents, []);
  return (
    <div className="section container">
      <div className="row">
        <div className="col s6">
          {props.decoded.admin && (
            <Link
              to="/events/add/event"
              className="waves-effect waves-light btn"
            >
              + Event
            </Link>
          )}
        </div>
      </div>
      <div className="row">
        {props.events.map(e => (
          <div className="col s3" key={e._id}>
            <div className="card">
              <div className="card-image waves-effect waves-block waves-light">
                <img
                  className="activator"
                  src={e.filename?"http://localhost:8080/uploads/events/" + e.filename : "/image/largee.gif"}
                />
              </div>
              <div className="card-content">
                <h5>Name of event</h5>
                <span className="card-title activator grey-text text-darken-4">
                  {e.name}
                </span>
                <span className="card-title activator grey-text text-darken-4">
                  <h5>Date</h5>
                  {new Date(e.date).toLocaleDateString()}
                </span>
                <span className="card-title activator grey-text text-darken-4">
                  <h5>Place</h5>
                  {e.place}
                </span>
                <span className="card-title activator grey-text text-darken-4">
                  <h5>Time</h5>
                  {e.time}
                </span>
                <span className="card-title activator grey-text text-darken-4">
                  <h5>Description</h5>
                  {e.description}
                </span>
                {props.decoded.admin && (
                  <Link
                  to={"/events/" + e._id + "/edit"}
                  className="waves-effect waves-light btn ml-4"
                >
                  Edit
                </Link>
                )}
                {props.decoded.admin && (
                  <Link
                    onClick={() => {
                      deleteEvent(e._id);
                    }}
                    to="/events"
                    className="waves-effect waves-light btn"
                  >
                    Delete
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded,
  events: state.events
});

const mapDispatchToProps = {
  setEvent: actions.setEvent,
  removeEvent: actions.removeEvent
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowEvents);
