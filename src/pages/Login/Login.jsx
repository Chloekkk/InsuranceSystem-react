import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../css/Login.css";
import { notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../../redux/modules/user";
import SignUp from "./SignUp";
import { useDispatch } from "react-redux";

const Login = () => {
  //state & variables
  const [info, setInfo] = useState({
    loginId: "",
    password: "",
  });
  const { loginId, password } = info;
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  async function getUser(info) {
    const response = await axios({
      url: "/login",
      method: "post",
      data: {
        loginId: info.loginId,
        password: info.password,
      },
      withCredentials: true,
    });
    return response.data;
  }

  const login = async () => {
    try {
      const data = await getUser(info);
      console.log("login method");
      dispatch(loginUser(data));
      //   console.log(data);
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Failed with response", error.response.data);
        notification["error"]({
          message: "Error!",
          description: error.response.data.message,
        });
      } else if (error.request) {
        console.error("Failed request", error);
      } else {
        console.error("Failed in general", error);
      }
      dispatch(
        loginUser({
          status: 500,
          data: null,
          result: "FAIL",
        })
      );
      setInfo({
        loginId: "",
        password: "",
      });
    }
  };

  return (
    <div className="wrap">
      <div className="panel left-side">
        <div className="left-logo"></div>
      </div>
      <div className="panel right-side">
        <div className="login-container">
          <div className="right-title">
            <label>HM ????????????</label>
            <h3>?????? ?????? ?????????</h3>
          </div>

          <div className="login-div">
            <div className="square-box">
              <div className="square-img">
                <div className="id-img"></div>
              </div>
              <input
                onChange={onChange}
                value={loginId}
                name="loginId"
                className="id-input"
                type="text"
                id="userid"
                placeholder="ID"
              ></input>
            </div>
            <div className="square-box">
              <div className="square-img">
                <div className="pass-img"></div>
              </div>
              <input
                onChange={onChange}
                value={password}
                name="password"
                className="pass-input"
                type="password"
                id="password"
                placeholder="Password"
              ></input>
            </div>
            <button onClick={login} className="square" id="login">
              ?????????
            </button>
          </div>
          <div>
            <Link className="forget-pass" to="/login/forget">
              ??????????????? ???????????????????
            </Link>
          </div>
          <div>
            <a
              className="forget-pass"
              onClick={() => {
                setVisible(true);
              }}
            >
              ????????????
            </a>
          </div>
          <SignUp visible={visible} setVisible={setVisible} />
        </div>
      </div>
    </div>
  );
};

export default Login;
