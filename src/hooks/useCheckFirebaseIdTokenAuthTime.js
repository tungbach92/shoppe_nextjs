import { useEffect } from "react";
import axios from "@/configs/axios";

const currentTimeinMs = new Date().valueOf();
const sessionExpinHour = 24;
const sessionExpinSec = sessionExpinHour * 3600;

export const useCheckFirebaseIdTokenAuthTime = (user, signOut) => {
  useEffect(() => {
    const checkFirebaseIdTokenAuthTime = async () => {
      if (!user) return;
      try {
        //revoke id token if expired
        // const idToken = await auth.currentUser.getIdToken(
        //   /* forceRefresh */ false
        // );
        const idToken = user._lat;
        const result = await axios({
          method: "POST",
          url: "/verify-id-token-by-firebase",
          data: { idToken },
        });
        if (result.data.revoked) {
          // never be called cause idToken auto refresh after 1 hour by fỉrebase sdk unless manual refresh
          // alert("Id Token refreshed. Vui lòng đăng nhập lại!");
          // await signOut();
        }
        if (result.data.invalid) {
          // alert("Token's invalid. Vui lòng đăng nhập lại!");
          // await signOut();
        }
        if (result.data.succeeded) {
          const idToken = result.data.idToken;
          const authTime = idToken.auth_time; //auth time stay the same after idToken revoked
          if (
            Math.floor(currentTimeinMs / 1000) - authTime >=
            sessionExpinSec
          ) {
            alert(`Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!`);
            await signOut();
          }
        }
      } catch (error) {
        alert(error.message);
      }
    };
    checkFirebaseIdTokenAuthTime();
  }, [signOut, user]);
};
