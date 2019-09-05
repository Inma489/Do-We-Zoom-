import React from "react";
import { IEvent, IDecoded } from "../interfaces";
import * as actions from "../actions";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link, RouteComponentProps } from "react-router-dom";
import "../css/showEvents.css";

interface IPropsGlobal {
  events: IEvent[];
  token: string;
  decoded: IDecoded;
  setEvent: (events: IEvent[]) => void;
  removeEvent: (event_id: string) => void;
  search: string;
}

const ShowEvents: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  const { Icon } = require("react-materialize");
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
    <div className="usersBackground">
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

        {props.events
          .filter(e =>
            (e.name && e.place)
              .toLowerCase()
              .startsWith(props.search.toLowerCase())
          )
          .reverse()
          .map(
            (_, i1) =>
              i1 % 2 === 0 && (
                <div className="row">
                  {props.events
                    .filter(
                      e =>
                        e.name
                          .toLowerCase()
                          .startsWith(props.search.toLowerCase()) ||
                        e.place
                          .toLowerCase()
                          .startsWith(props.search.toLowerCase())
                    )
                    .reverse()
                    .slice(i1, i1 + 2)
                    .map(e => (
                      <div className="col s11 m6 hoverable" key={e._id}>
                        <div className="card horizontal small">
                          <div className="card-image responsive-img">
                            <img
                              width="200"
                              src={
                                e.filename
                                  ? "http://localhost:8080/uploads/events/" +
                                    e.filename
                                  : "/image/largee.gif"
                              }
                            />
                          </div>
                          <div className="card-stacked hoverable">
                            <div className="card-content detailsevent">
                              <h6 className="letterss">Event</h6>
                              <p>{e.name}</p>
                              <h6 className="letterss">Date</h6>
                              <p>{new Date(e.date).toLocaleDateString()}</p>
                              <h6 className="letterss">Place</h6>
                              <p>{e.place}</p>
                              <h6 className="letterss">Time</h6>
                              <p>{e.time}</p>
                              <h6 className="letterss">Description</h6>
                              <p>{e.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="btnevents">
                          {props.decoded.admin && (
                            <Link
                              to={"/events/" + e._id + "/edit"}
                              className="waves-effect waves-light btn ml-4"
                            >
                              <Icon>edit</Icon>
                            </Link>
                          )}
                          {props.decoded.admin && (
                            <Link
                              onClick={() => {
                                deleteEvent(e._id);
                              }}
                              to="/events"
                              className="waves-effect waves-light btn btndeleteEvent"
                            >
                              <Icon>delete</Icon>
                            </Link>
                          )}
                        </div>
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
  decoded: state.decoded,
  events: state.events,
  search: state.search
});

const mapDispatchToProps = {
  setEvent: actions.setEvent,
  removeEvent: actions.removeEvent
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowEvents);
