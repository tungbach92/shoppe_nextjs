import {useCallback, useState} from "react";

const useModal = () => {
  const [isVoucherShowing, setIsVoucherShowing] = useState(false);
  const [isPopupShowing, setIsPopupShowing] = useState(false);
  const [isShipUnits, setIsShipUnits] = useState(false);
  const [isCardInfoShowing, setIsCardInfoShowing] = useState(false);
  const [isAddCartPopup, setIsAddCartPopup] = useState(false);
  const [isPasswordResetShowing, setIsPasswordResetShowing] = useState(false);
  const [isAddressAddShowing, setIsAddressAddShowing] = useState(false);

  const toggleAddressAdd = useCallback(() => {
    setIsAddressAddShowing(prev => !prev);
  }, []);

  const togglePasswordReset = useCallback((value) => {
    setIsPasswordResetShowing(value);
  }, []);

  const toggleShipUnits = useCallback(() => {
    setIsShipUnits(prevState => !prevState);
  }, []);

  const toggleVoucher = useCallback(() => {
    setIsVoucherShowing(prevState => !prevState);
  }, []);

  const togglePopup = useCallback(() => {
    setIsPopupShowing(prevState => !prevState);
  }, []);

  const toggleCardInfo = useCallback((value) => {
    setIsCardInfoShowing(value);
  }, []);

  const toggleIsAddCardPopup = useCallback((value) => {
    setIsAddCartPopup(value);
  }, []);

  return {
    isVoucherShowing,
    toggleVoucher,
    isPopupShowing,
    togglePopup,
    isShipUnits,
    toggleShipUnits,
    isCardInfoShowing,
    toggleCardInfo,
    isAddCartPopup,
    toggleIsAddCardPopup,
    isPasswordResetShowing,
    togglePasswordReset,
    isAddressAddShowing,
    toggleAddressAdd,
  };
};
export default useModal;
