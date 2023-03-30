import React, {ReactNode} from "react";
import LoginContainer from "../../components/Login/LoginContainer";
import Layout from "@/components/Layout/Layout";

const Register = () => {
  return (
    <LoginContainer
      isRegisterPage={true}
      submitText="Đăng ký"
    ></LoginContainer>
  );
};
Register.getLayout = (page: ReactNode) => <Layout isRegisterPage={true} headerText="Đăng ký">{page} </Layout>
export default Register;
