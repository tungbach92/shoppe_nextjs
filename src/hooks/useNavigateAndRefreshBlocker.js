import { useContext, useEffect } from "react";
// import { UNSAFE_NavigationContext } from "react-router-dom";

const useNavigateAndRefreshBlocker = (loading) => {
  // const { navigator } = useContext(UNSAFE_NavigationContext);

  // useEffect(() => {
  //   if (!loading) return;
  //
  //   const blocker = (tx) => {
  //     if (
  //       window.confirm(
  //         "Việc này có thể khiến quá trình bị gián đoạn. Bạn vẫn muốn rời khỏi trang web?"
  //       )
  //     )
  //       tx.retry();
  //   };
  //
  //   const unblock = navigator.block((tx) => {
  //     const autoUnblockingTx = {
  //       ...tx,
  //       retry() {
  //         // Automatically unblock the transition so it can play all the way
  //         // through before retrying it. TODO: Figure out how to re-enable
  //         // this block if the transition is cancelled for some reason.
  //         unblock();
  //         tx.retry();
  //       },
  //     };
  //
  //     blocker(autoUnblockingTx);
  //   });
  //
  //   return unblock;
  // }, [navigator, loading]);
};

export default useNavigateAndRefreshBlocker;
