import { useState } from "react";

const voucherList = [
  { code: "FREE", discount: "100%" },
  { code: "SALE50", discount: "50%" },
  { code: "SALE100000", discount: "100000" },
];
const useVoucher = () => {
  const [voucher, setVoucher] = useState();
  const [isValidVoucher, setIsValidVoucher] = useState(false);

  const updateVoucher = (text) => {
    const voucher = voucherList.find((item) => item.code === text);
    if (!voucher) {
      setIsValidVoucher(false);
      return;
    }
    setIsValidVoucher(true);
    setVoucher(voucher);
  };

  const resetVoucher = () => {
    setVoucher(null);
  };

  return { voucher, updateVoucher, isValidVoucher, resetVoucher };
};

export default useVoucher;
