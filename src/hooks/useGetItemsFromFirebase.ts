import {useLayoutEffect, useState} from "react";
import {
  onSnapshot,
} from "firebase/firestore";
import {productQuery} from "@/common/dbRef";

const useGetItemsFromFirebase = () => {
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    let isMounted = true;
    setLoading(true);
    const unsubscribeProductObserver = onSnapshot(productQuery(),
      (snaps) => {
        if (!isMounted) {
          return;
        }
        const items : any = snaps.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(items);
        setLoading(false);
      },
      (error) => {
        alert("Lỗi lấy sản phẩm:" + error.message);
        setLoading(false);
      }
    );
    return () => {
      isMounted = false;
      unsubscribeProductObserver();
    };
  }, []);
  return {items, itemsLoading: loading};
};

export default useGetItemsFromFirebase;
