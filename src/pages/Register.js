import React from "react";
import Header from "../components/Header/Header";
import LoginContainer from "../components/Login/LoginContainer";
const Register = () => {
  return (
    <>
      <Header isRegisterPage={true} headerText="Đăng ký"></Header>
      <LoginContainer
        isRegisterPage={true}
        submitText="Đăng ký"
      ></LoginContainer>
    </>
  );
};

export default Register;
