import { useEffect, useState } from "react";
import { auth } from "@/configs/firebase";

const useGetUserByObserver = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribeUserObserver = auth.onIdTokenChanged(
      (authUser) => {
        if (!isMounted) {
          return;
        }
        if (authUser) {
          //user will log in or logged in
          // authUser.updateProfile({ photoURL: null }).then(() => {
          // });
          setUser(authUser);
          // cartItems = this.getCartItemsFromFirebase(authUser);
        } else {
          //user logged out
          setUser(null);
        }
        setLoading(false);
      },
      (error) => {
        alert("Lỗi check user:" + error);
        setLoading(false);
      }
    );
    return () => {
      isMounted = false;
      unsubscribeUserObserver();
    };
  }, []);

  return { user, userLoading: loading };
};
export default useGetUserByObserver;
