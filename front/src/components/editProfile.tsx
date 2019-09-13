import React from "react";
import { IUser, IDecoded } from "../interfaces";
import { RouteComponentProps } from "react-router";
import * as actions from "../actions";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link } from "react-router-dom";
import "../css/editProfile.css";

interface IPropsGlobal {
  token: string;
  users: IUser[];
  decoded: IDecoded;
  updateUser: (user: IUser, user_id: string) => void;
  setDecoded: (decoded: IDecoded) => void;
}

const EditProfile: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const { Icon } = require("react-materialize");
  const [file, setFile] = React.useState();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [updated, setUpdated] = React.useState(false);
  const inputFileRef = React.createRef<any>();

  const handleFileUpload = (event: any) => setFile(event.target.files[0]);

  // const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setFile(event.target.files![0]);

  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const user = React.useMemo(
    // aqui cogemos de redux los usuarios
    () => props.users.find(u => u._id === props.match.params.userId),
    [props.match.params.userId, props.users]
  );

  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const edit = () => {
    const data = new FormData();
    data.append("_id", "" + user._id);
    if (file) {
      data.append("file", file);
    } else {
      data.append("file", "");
    }
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    if (props.decoded.admin || props.decoded._id === user._id) {
      fetch("http://localhost:8080/api/users/" + user._id, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + props.token
        },
        body: data
      })
        .then(res => {
          if (res.ok) {
            res
              .json()
              .then(user => {
                // console.log(user);
                props.setDecoded(user);
                props.updateUser(user, user._id);

                props.history.push("/users/" + props.decoded._id); // me redirije a mi pagina showUsers
              })
              .catch(err => {
                // console.log("error " + err);
              });
          } else {
            // console.log("error");
          }
        })
        .catch(err => {
          // console.log("error editar ," + err);
        });
    }
  };

  return (
    <div className="usersBackground">
      <div className="section container contEditProfile">
        <div className="row">
          <div className="col s12 m7">
            <div className="row card-panel">
              {props.decoded._id === user._id && (
                <div className="input-field col s11">
                  {(!props.decoded.admin || props.decoded._id === user._id) && (
                    <img
                      className="circle responsive-img editProfile"
                      width="260"
                      src={
                        user.avatar
                          ? "http://localhost:8080/uploads/avatars/" +
                            user.avatar +
                            "?" +
                            Date()
                          : "/image/default-avatar1.jpg"
                      }
                      alt=""
                    />
                  )}

                  <input
                    type="button"
                    value="Change photo"
                    className="waves-effect waves-light btn btnfileProfile"
                    onClick={() => inputFileRef.current.click()}
                  />

                  <br />
                  <div>
                    <input
                      ref={inputFileRef}
                      hidden
                      type="file"
                      onChange={handleFileUpload}
                      accept=".jpg"
                    />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col s10 coleditProfile">
                  <label className="letterss">Username</label>
                  <input
                    value={username}
                    onChange={updateUsername}
                    type="text"
                    className="validate"
                    required
                  />
                </div>

                <div className="col s10 coleditProfile">
                  <label className="letterss">Email</label>
                  <input
                    value={email}
                    onChange={updateEmail}
                    type="email"
                    className="validate"
                    required
                  />
                </div>
                {props.decoded._id === user._id && (
                  <div className="col s10 coleditProfile">
                    <label className="letterss">Password</label>
                    <input
                      value={password}
                      onChange={updatePassword}
                      type="password"
                      className="validate"
                      required
                    />
                  </div>
                )}
              </div>
              <button
                onClick={edit}
                className="waves-effect waves-light btn btneditPerfil"
              >
                <Icon>save</Icon>
              </button>
              <Link
                to={"/users/" + props.decoded._id}
                className="waves-effect waves-light btn btncancelProfile"
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
  users: state.users
});

const mapDispatchToProps = {
  updateUser: actions.updateUser,
  setDecoded: actions.setDecoded
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);
