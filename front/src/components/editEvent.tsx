import React from 'react';
import { IDecoded, IEvent } from '../interfaces';
import * as actions from "../actions";
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { IGlobalState } from '../reducers';
import { updateEvent } from '../actions';
import { Link } from 'react-router-dom';

interface IPropsGlobal{
    token:string;
    decoded: IDecoded;
    events: IEvent[];
    updateEvent: (event: IEvent,event_id:string) => void
}

const EditEvent: React.FC<IPropsGlobal & RouteComponentProps<{eventId: string}>> = props => {
    const[file,setFile] = React.useState();
    const[name,setName] = React.useState("");
    const[date,setDate] = React.useState("");
    const[place,setPlace] = React.useState("");
    const[time,setTime] = React.useState("");
    const[description,setDescription] = React.useState("");

    const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files![0]);

    const updateName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

    const updateDate = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(event.target.value);

    const updatePlace = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPlace(event.target.value);

    const updateTime = (event: React.ChangeEvent<HTMLInputElement>)=>
    setTime(event.target.value);

    const updateDescription = (event: React.ChangeEvent<HTMLInputElement>)=>
    setDescription(event.target.value);

    const event = React.useMemo(
        // aqui cogemos de redux los usuarios
        () => props.events.find(e => e._id === props.match.params.eventId),
        [props.match.params.eventId, props.events]
      );

      React.useEffect(() => {
        /*el useEffect es para que me guarde los hooks de inicio cuando cambie el user.
                    el useEffect es para cuando el memo cambie el user, es decir, cuando cambie el user.
                    Aunque siempre se hacen la primera vez aunque no cambie lo que hay dentro del array, porque al iniciarse
                    siempre lo hacen. SIEMPRE SE EJECUTA LA POR LO MENOS LA PRIMERA VEZ*/
        if (event) {
          setName(event.name);
          setDate(event.date);
          setPlace(event.place);
          setTime(event.time);
          setDescription(event.description);
    
          // setPassword(user.password);// me da problemas al darle al boton editar metiendole le setPassword
        }
      }, [event]); // cada vez que el user cambie, es decir, cada vez que vaya a modificiar mi username

      if(!event){
          return null
      }

      const editEvent = (event_id: string) => {
        const data = new FormData();
        data.append("file", file);
        data.append("name", name);
        data.append("date", date);
        data.append("place", place);
        data.append("time", time);
        data.append("description", description);
       
        fetch("http://localhost:8080/api/events/" + event_id, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + props.token
          },
          body: data
        }).then(res => {
          if (res.ok) {
            res.json().then(e => {
              props.updateEvent(e, event_id);
              props.history.push("/events/");
            });
          }
        });
      };


    return (
        <div className=" section container">
        <div className="row">
          <div className="col s12">
            <div className="row card-panel">
              <div className="input-field col s6">
              <img
                width="200"
                src={
                  event.filename
                    ? "http://localhost:8080/uploads/events/" +
                      event.filename +
                      "?" +
                      Date()
                    : "/image/largee.gif"
                }
                alt="photo"
              />
                <input
                  type="file"
                  onChange={updateFile}
                  className="validate"
                  required
                />
  
                <input
                  type="text"
                  onChange={updateName}
                  placeholder="Title"
                  value={name}
                  className="validate"
                  required
                />
  
                <input
                  type="text"
                  onChange={updateDate}
                  value={date}
                  placeholder="Date"
                  className="validate"
                  required
                />
  
                <input
                  type="text"
                  onChange={updatePlace}
                  value={place}
                  placeholder="Place"
                  className="validate"
                  required
                />
                <input
                  type="text"
                  onChange={updateTime}
                  value={time}
                  placeholder="Time"
                  className="validate"
                  required
                />
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
          </div>
          <input
            type="button"
            value="Save"
            onClick={()=>editEvent(event._id)}
            className="waves-effect waves-light btn"
          />
          
        <Link to={"/events/"}>
        <button className="waves-effect waves-light btn">Cancel</button>
        </Link>
        </div>
      </div>
    )

}
const mapStateToProps = (state: IGlobalState) =>({
    token:state.token,
    decoded: state.decoded,
    events:state.events
});
const mapDispatchToProps = {
    updateEvent:actions.updateEvent
}
export default connect(mapStateToProps,mapDispatchToProps) (EditEvent);