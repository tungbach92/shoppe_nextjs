import React from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Stack, TextField} from "@mui/material";
import PropTypes from "prop-types";
import Link from "next/link";
import {useUser} from "@/context/UserProvider";
import withContainer from "@/components/withContainer";
import {useRouter} from "next/router";

function LoginContainer({isRegisterPage, isLoginPage, submitText}) {
  const {signIn, register} = useUser();
  const router = useRouter()
  const onSubmit = async (values) => {
    if (isRegisterPage) {
      try {
        const userCredential = await register(values);
        if (userCredential) {
          const user = userCredential.user;
          const randomName = Math.random().toString(36).substring(2);

          await user.updateProfile({
            displayName: randomName,
          });
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          alert("Mật khẩu quá ngắn.");
        } else {
          alert(errorMessage);
        }
      } finally {
        formik.setSubmitting(false);
        router.push("/");
      }
    }
    if (isLoginPage) {
      try {
        await signIn(values);
      } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          alert("Mật khẩu không đúng!.");
        } else {
          alert(errorMessage);
        }
      } finally {
        formik.setSubmitting(false);
        router.push("/");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không đúng định dạng")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
      confirmPassword:
        isRegisterPage &&
        Yup.string()
          .oneOf([Yup.ref("password"), null], "Mật khẩu phải trùng nhau")
          .required("Vui lòng nhập lại mật khẩu"),
    }),
    onSubmit: onSubmit,
  });

  return (
    <div className="main main--login">
      <div className="grid grid--login">
        <div className="login-content__img">
          <form
            className="login-content__input"
            // onSubmit={isLoginPage ? handleLogin : handleRegister}
            onSubmit={formik.handleSubmit}
          >
            <span className="login-content__title"> {submitText}</span>
            <Stack mt="2rem" spacing="1rem">
              <TextField
                id="email"
                type="text"
                {...formik.getFieldProps("email")}
                label="Email"
                size="small"
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{style: {fontSize: "1.3rem"}}}
                InputLabelProps={{style: {fontSize: "1.3rem"}}}
                FormHelperTextProps={{style: {fontSize: "1.3rem"}}}
              />

              <TextField
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
                label="Mật khẩu"
                size="small"
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{style: {fontSize: "1.3rem"}}}
                InputLabelProps={{style: {fontSize: "1.3rem"}}}
                FormHelperTextProps={{style: {fontSize: "1.3rem"}}}
              />
              {isRegisterPage && (
                <TextField
                  id="confirmPassword"
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                  label="Nhập lại mật khẩu"
                  size="small"
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  InputProps={{style: {fontSize: "1.3rem"}}}
                  InputLabelProps={{style: {fontSize: "1.3rem"}}}
                  FormHelperTextProps={{style: {fontSize: "1.3rem"}}}
                />
              )}
            </Stack>

            <button
              disabled={formik.isSubmitting}
              type="submit"
              className="btn login-content__submit"
            >
              {submitText}
            </button>
            {isRegisterPage && (
              <span className="login-content__rule">
                Bằng việc đăng kí, bạn đã đồng ý với Shopee về Điều khoản dịch
                vụ và Chính sách bảo mật
              </span>
            )}
            <span className="login-content__register-wrapper">
              {isLoginPage && (
                <>
                  Bạn mới biết đến Shopee?
                  <Link href="/register" className="login-content__register">
                    Đăng ký
                  </Link>
                </>
              )}
              {isRegisterPage && (
                <>
                  Bạn đã có tài khoản?
                  <Link href="/login" className="login-content__register">
                    Đăng nhập
                  </Link>
                </>
              )}
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

LoginContainer.propTypes = {
  isLoginPage: PropTypes.bool,
  isRegisterPage: PropTypes.bool,
  submitText: PropTypes.string,
};
LoginContainer.defaultProps = {
  isLoginPage: false,
  isRegisterPage: false,
  submitText: "",
};

export default withContainer(LoginContainer);
