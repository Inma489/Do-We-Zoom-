import React, { ChangeEvent } from "react";
import jwt from "jsonwebtoken";

import { RouteComponentProps } from "react-router";
import "../css/loginPage.css";
import { IDecoded, IUser } from "../interfaces";
import * as actions from "../actions";
import { IGlobalState } from "../reducers";
import { connect } from "react-redux";

const { Modal, Button } = require("react-materialize");

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  setToken: (token: string) => void;
  setDecoded: (decoded: IDecoded) => void;
  addUser: (user: IUser) => void;
}

const LoginPage: React.FC<IPropsGlobal & RouteComponentProps<any>> = props => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [file, setFile] = React.useState();
  const inputFileRef = React.createRef<any>();
  const [errorUser, setErrorUser] = React.useState("");
  const [errorEmail, setErrorEmail] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");

  const handleFileUpload = (event: any) => setFile(event.target.files[0]);
  // const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setFile(event.target.files![0]);

  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setErrorUser("");
  };

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrorEmail("");
  };
  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrorPassword("");
  };

  // validar email,contraseña y nombre de usuario
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i //eslint-disable-line
  );
  const validateEmail = (e: string) => validEmailRegex.test(e);

  const mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))((?=.*[a-z])(?=.*[0-9]))((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})" //eslint-disable-line
  );
  const validatePassword = (p: string) => mediumRegex.test(p);

  const validateusernameRegex = new RegExp(/^([a-zA-Z0-9' ]+)$/);

  const validateusername = (u: string) => validateusernameRegex.test(u); //eslint-disable-line

  // comprueba que el usuario que se está logeando conincida con el que hay en la base de datos
  const getToken = () => {
    if (email && password) {
      fetch("http://localhost:8080/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password }) // aqui pongo el username declarado arriba y el password
      }).then(res => {
        if (res.ok) {
          res.text().then(token => {
            localStorage.setItem("token", token); // para que guarde la sesion en el localstorage
            // por si el usuario cierra sin querer la pestaña y cuando la vuelva a abrir tenga su
            //sesión abierta.

            props.setToken(token);

            const decoded = jwt.decode(token);

            // aqui le decimos que si el decoded es disitinto de null o el tipo de decoded es distinto de un string
            //que me lo descodifique
            if (decoded !== null && typeof decoded !== "string") {
              props.setDecoded(decoded);
            }

            props.history.push("/");
          });
        } else {
          setErrorEmail("email or password incorret");
        }
      });
    } else {
      if (!email) {
        setErrorEmail("you must to complete those fields");
      }
      if (!password) {
        setErrorPassword("you must to complete those fields");
      }
    }
  };
  // registro de usuarios

  const addUser = () => {
    if (username && email && password) {
      if (
        validateEmail(email) &&
        validatePassword(password) &&
        validateusername(username)
      ) {
        const data = new FormData();
        if (file) {
          data.append("file", file);
        } else {
          data.append("file", "");
        }
        data.append("_id", "");
        data.append("username", username);
        data.append("email", email);
        data.append("password", password);
        fetch("http://localhost:8080/api/users/add", {
          method: "POST",
          body: data
        })
          .then(res => {
            if (res.ok) {
              // poner siempre porque es el usuario nuevo que voy a crear
              res.json().then(u => {
                props.addUser(u);
                const a: any = document.getElementsByClassName(
                  "modal-overlay"
                )[0];
                a.click();
                document.getElementById("btnLogin")!.click();
              });
            } else {
              res
                .json()
                .then(({ e }) => {
                  if (e.code === 11000) {
                    let err = e.errmsg.split("{")[1];
                    // console.log(err);
                    err = err.split('"')[1];
                    // console.log(err);
                    if (err === username) {
                      setErrorUser("that username already exist");
                    } else if (err === email) {
                      setErrorEmail("that email already exist");
                    }
                  }

                  // console.log(e);
                })
                .catch(err => {
                  // console.log(err);
                });
            }
          })
          .catch(err => {
            // console.log("error al add user," + err);
          });
      } else {
        if (!validateusername(username)) {
          setErrorUser("Username must contain only words and numbers.");
        }
        if (!validateEmail(email)) {
          setErrorEmail("This email is not valid.");
        }
        if (!validatePassword(password)) {
          setErrorPassword(
            "Password must contain 8 characters, 1 Uppercase, 1 Lowercase, 1 number at least."
          );
        }
      }
    } else {
      if (!username) {
        setErrorUser("you must to complete this field");
      }
      if (!email) {
        setErrorEmail("you must to complete this field");
      }
      if (!password) {
        setErrorPassword("you must to complete this field");
      }
    }
  };

  return (
    <div className="container-fluid responsive principal">
      <div className="modal-content center">
        <Button id="btnLogin" href="#modal1" className="modal-trigger">
          Sign in
        </Button>
        <Modal id="modal1" className="modal1">
          <div className="section center">
            <div className="row">
              <div className="col s12 m8">
                <img
                  width="200"
                  className="responsive-img loginPhoto"
                  src="/image/logo-listo2.png"
                  alt="foto"
                />
              </div>
              <div className="col s12">
                <div className="input-field inputLogin">
                  <i className="material-icons prefix">email</i>
                  <input
                    className={errorEmail ? "border-red" : ""}
                    type="text"
                    value={email}
                    onChange={updateEmail}
                    maxLength={30}
                  />
                  <label className={email ? "active" : ""}>Email</label>
                </div>
              </div>
              <div className="col s12">
                <div className="input-field">
                  <i className="material-icons prefix">lock</i>
                  <input
                    className={errorEmail ? "border-red" : ""}
                    type="password"
                    value={password}
                    onChange={updatePassword}
                    id="password"
                    maxLength={12}
                  />
                  <label className={password ? "active" : ""}>Password</label>
                </div>
                <div>{errorEmail}</div>
              </div>
            </div>
          </div>

          <input
            type="submit"
            value="Login"
            onClick={getToken}
            className="btn btn-small btnLog"
          />
        </Modal>
      </div>
      <div className="modal-content center">
        <Button id="btnSignUp" href="#modal2" className="modal-trigger">
          Sign Up
        </Button>
        <Modal id="modal2" className="modal2">
          <div className="section content">
            <div className="row">
              <div className="col s12 m8">
                <img
                  width="150"
                  className="responsive-img avatarDefault"
                  src="/image/objetivo2.png"
                  alt="avatar"
                />
                <div className="input-field">
                  <input
                    ref={inputFileRef}
                    hidden
                    type="file"
                    onChange={handleFileUpload}
                    accept=".jpg"
                  />
                  <br />
                  <input
                    type="button"
                    value="Add your photo"
                    className="btn btn-small btnSignup1"
                    onClick={() => inputFileRef.current.click()}
                  />
                </div>
              </div>

              <div className="col s12">
                <div className="input-field">
                  <i className="material-icons prefix">person</i>
                  <input
                    className={errorUser ? "border-red" : ""}
                    type="text"
                    maxLength={12}
                    value={username}
                    onChange={updateUsername}
                  />
                  <label>Username</label>
                  <div>{errorUser}</div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <i className="material-icons prefix">email</i>
                    <input
                      className={errorEmail ? "border-red" : ""}
                      type="text"
                      value={email}
                      onChange={updateEmail}
                      maxLength={30}
                    />
                    <label className={email ? "active" : ""}>Email</label>

                    <div>{errorEmail}</div>
                  </div>
                </div>
                <div className="col s12">
                  <div className="input-field">
                    <i className="material-icons prefix">lock</i>
                    <input
                      className={errorPassword ? "border-red" : ""}
                      type="password"
                      value={password}
                      onChange={updatePassword}
                      maxLength={12}
                    />
                    <label className={password ? "active" : ""}>Password</label>
                    <div>{errorPassword}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <input
            type="submit"
            value="Send"
            onClick={addUser}
            className="btn btn-small submit"
          />
        </Modal>
      </div>
      <div className="thumb carta">
        <Button
          id="btnSignUp"
          href="#modal2"
          className="modal-trigger boton-polaroid"
        ></Button>
      </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded
});
const mapDispatchToProps = {
  setToken: actions.setToken,
  setDecoded: actions.setDecoded,
  addUser: actions.addUser
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
