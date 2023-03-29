import React from "react";
import Header from "../components/Header/Header";
import LoginContainer from "../components/Login/LoginContainer";
const Login = () => {
  return (
    <>
      <Header headerText="Đăng nhập" isLoginPage={true}></Header>
      <LoginContainer
        submitText="Đăng nhập"
        isLoginPage={true}
      ></LoginContainer>
    </>
  );
};

export default Login;
