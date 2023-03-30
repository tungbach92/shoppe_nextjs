import React, {ReactNode} from "react";
import Header from "../../components/Header/Header";
import LoginContainer from "../../components/Login/LoginContainer";
import Layout from "@/components/Layout/Layout";

const Login = () => {
  return (
      <LoginContainer
        submitText="Đăng nhập"
        isLoginPage={true}
      ></LoginContainer>
  );
};

Login.getLayout = (page: ReactNode) => <Layout isLoginPage={true} headerText="Đăng nhập">{page} </Layout>
export default Login;

