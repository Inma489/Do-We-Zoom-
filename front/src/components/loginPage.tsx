import React, { ChangeEvent } from "react";
import jwt from "jsonwebtoken";
// import imgs from '../../public/image/foto.jpg'
import { RouteComponentProps } from "react-router";
import "../css/loginPage.css";
import { IDecoded, IUser } from "../interfaces";
import * as actions from "../actions";
import { IGlobalState } from "../reducers";
import { connect } from "react-redux";

const { Carousel } = require("react-materialize");
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
  // const [updated, setUpdated] = React.useState(false);
  // const inputFileRef = React.createRef<any>();
  const handleFileUpload = (event: any) => setFile(event.target.files[0]);
  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files![0]);

  const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
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
  // para mandar la foto en el formulario de registrar a un usuario

  // para que se loguee el usuario y acceda a su pagina
  const getToken = () => {
    if (email && password) {
      fetch("http://localhost:8080/api/auth", {
        // es una funcion promesa, funcion que se ejecuta que puede esperar hasta que se obtenga la respuesta, devuelve una respuesta
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password }) // aqui pongo el username declarado arriba y el password
      }).then(res => {
        if (res.ok) {
          res.text().then(token => {
            // nos pinta el token que llamamos del servidor, y me la imrpime en el html
            console.log(token);
            localStorage.setItem("token", token); // para que guarde la sesion en el session storage

            props.setToken(token); // props settoken viene de redux
            // aqui hare la constante decoded para ver lo que trae mi decode y poder verlo en la consola
            const decoded = jwt.decode(token);
            console.log(decoded); // aqui me muestra lo que trae el decode en consola
            // aqui le decimos que si el decoded es disitinto de null o el tipo de decoded es distinto de un string que me lo descodifique
            if (decoded !== null && typeof decoded !== "string") {
              props.setDecoded(decoded); // la decodificacion tambien viene de redux
            }

            props.history.push("/");
          });
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
  // para mandar la foto en el formulario de registrar a un usuario
  const addUser = () => {
    if (username && email && password) {
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

              // me refresca la pagina que le estoy diciendo
              //aqui me  gustaria poner que cuando el usuario se haya registrado correctamente
              // que le saliera un texto que le pusiera: usuario resgistrado o algo asi
            });
          } else {
            res
              .json()
              .then(({ e }) => {
                if (e.code === 11000) {
                  let err = e.errmsg.split("{")[1];
                  console.log(err);
                  err = err.split('"')[1];
                  console.log(err);
                  if (err === username) {
                    setErrorUser(" that username already exist");
                  } else if (err === email) {
                    setErrorEmail(" that email already exist");
                  }
                }

                console.log(e);
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          // res.status(400).send("error add ," + err);
          console.log("error al add user," + err);
        });
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
    <div className="container">
      {/* <Carousel
        images={[
          "https://picsum.photos/200/300?image=0",
          "https://picsum.photos/200/300?image=1",
          "https://picsum.photos/200/300?image=2"
        ]}
      /> */}

      <div className="modal-content center">
        <Button id="btnLogin" href="#modal1" className="modal-trigger">
          Login
        </Button>
        <Modal id="modal1" header="" className="modal1">
          <div className="section center">
            <div className="row">
              <div className="col s3">
                <img width="200" src="/image/foto.jpg" alt="foto" />
              </div>
            </div>

            <div className="col s3">
              <div className="input-field">
                <i className="material-icons prefix">email</i>
                <input type="text" value={email} onChange={updateEmail} />
                <label>Email</label>
              </div>
              <br />

              <div className="col s3">
                <div className="input-field">
                  <i className="material-icons prefix">lock</i>
                  <input
                    type="password"
                    value={password}
                    onChange={updatePassword}
                    id="password"
                  />
                  <label>Password</label>
                  <div>{errorEmail}</div>
                </div>
              </div>
            </div>
            <input
              type="submit"
              value="SignIn"
              onClick={getToken}
              className="btn btn-large submit"
            />
          </div>
        </Modal>
      </div>
      <div className="modal-content center">
        <Button href="#modal2" className="modal-trigger">
          SignUp
        </Button>
        <Modal id="modal2"  className="modal2" header="">
          <img width="150" src="/image/avatar-default.png" alt="avatar" />
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
              className="waves-effect waves-light btn"
              onClick={() => inputFileRef.current.click()}
            />
          </div>
          <div className="input-field">
            <i className="material-icons prefix">person</i>
            <input
              className={errorUser ? "border-red" : ""}
              type="text"
              value={username}
              onChange={updateUsername}
            />
            <label>Username</label>
            <div>{errorUser}</div>
          </div>
          <br />
          <div className="input-field">
            <i className="material-icons prefix">email</i>
            <input type="text" value={email} onChange={updateEmail} />
            <label>Email</label>
            <div>{errorEmail}</div>
          </div>
          <br />
          <div className="input-field">
            <i className="material-icons prefix">lock</i>
            <input type="password" value={password} onChange={updatePassword} />
            <label>Password</label>
            <div>{errorPassword}</div>
          </div>
          <br />
          <input
            type="submit"
            value="Send"
            onClick={addUser}
            className="btn btn-large submit"
          />
        </Modal>
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
