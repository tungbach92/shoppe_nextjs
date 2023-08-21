import React, {useState} from "react";
import useModal from "../../hooks/useModal";
import useAddress from "../../hooks/useAddress";
import AddressModal from "../Modal/AddressModal";
import PopupModal from "../Modal/PopupModal";
import useGetShipInfos from "../../hooks/useGetShipInfos";
import {updateCustomerBillingAddressStripe} from "@/services/updateCustomerBillingAddressStripe";
import {useUser} from "@/context/UserProvider";
import useNavigateAndRefreshBlocker from "../../hooks/useNavigateAndRefreshBlocker";
import {ClipLoading} from "../ClipLoading";

const AccountAddress = () => {
  const {
    name,
    setName,
    phone,
    setPhone,
    street,
    setStreet,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    provinces,
    districts,
    wards,
    handleDistrictChoose,
    handleProvinceChoose,
    handleWardChoose,
  } = useAddress();
  const {user} = useUser();
  const {
    shipInfos,
    shipInfosLoading,
    shipInfosUpdateLoading,
    updateShipInfoToFirebase,
  } = useGetShipInfos(user);
  const {isAddressAddShowing, toggleAddressAdd} = useModal();
  const [shipInfoIndex, setShipInfoIndex] = useState<number | null>(null);
  const {isPopupShowing, togglePopup} = useModal();

  useNavigateAndRefreshBlocker(shipInfosUpdateLoading);

  const handleDefaultClick = async (index: any) => {
    let tempShipInfos: any = [...shipInfos];
    tempShipInfos = tempShipInfos.map(
      (shipInfo: any) => ({...shipInfo, isDefault: false})
    );
    tempShipInfos[index] = {...tempShipInfos[index], isDefault: true};
    await updateShipInfoToFirebase(tempShipInfos);
    await updateCustomerBillingAddressStripe(user, tempShipInfos); // TODO: refactor??
  };

  const handleAddressAddClick = () => {
    toggleAddressAdd();
    setName("");
    setPhone("");
    setStreet("");
    setProvince(null);
    setDistrict(null);
    setWard(null);
    setShipInfoIndex(null);
  };

  const handleEditClick = (index: any) => {
    toggleAddressAdd();
    const name = shipInfos[index].name;
    const phone = shipInfos[index].phone;
    const street = shipInfos[index].street;
    const province = shipInfos[index].province;
    const district = shipInfos[index].district;
    const ward = shipInfos[index].ward;
    setName(name);
    setPhone(phone);
    setStreet(street);
    setProvince(province);
    setDistrict(district);
    setWard(ward);
    setShipInfoIndex(index);
  };

  const handleDeleteClick = (index: any) => {
    setShipInfoIndex(index);
    togglePopup();
  };

  const handleDeleteTrue = async (index: any) => {
    let tempShipInfos = [...shipInfos];
    tempShipInfos = tempShipInfos.filter(
      (shipInfo) => tempShipInfos.indexOf(shipInfo) !== index
    );
    await updateShipInfoToFirebase(tempShipInfos);
  };

  return (
    <>
      <div className="user-profile__title-container">
        <div className="user-profile__title">
          <div className="user-profile__label">
            Địa Chỉ Của Tôi
            <button
              onClick={handleAddressAddClick}
              className="btn user-profile__address-add w-full md:w-auto"
            >
              Thêm địa chỉ mới
            </button>
            <AddressModal
              name={name}
              setName={setName}
              street={street}
              setStreet={setStreet}
              district={district}
              province={province}
              ward={ward}
              phone={phone}
              setPhone={setPhone}
              provinces={provinces}
              districts={districts}
              wards={wards}
              handleDistrictChoose={handleDistrictChoose}
              handleProvinceChoose={handleProvinceChoose}
              handleWardChoose={handleWardChoose}
              isAddressAddShowing={isAddressAddShowing}
              toggleAddressAdd={toggleAddressAdd}
              shipInfoIndex={shipInfoIndex}
            ></AddressModal>
          </div>
        </div>
      </div>
      <div className="address-profile__address-container">
        {shipInfos?.length > 0 &&
          !shipInfosLoading &&
          !shipInfosUpdateLoading &&
          shipInfos?.map((shipInfo: any, index: any) => (
            <div key={index} className="address-profile__address-content">
              <div className="address-profile__user-container">
                <label className="address-profile__name-label">Họ Và Tên:</label>
                <span className="address-profile__name-text">
                  {shipInfo.name}
                  {shipInfo.isDefault && (
                    <span className="address-profile__default-badge">
                      Mặc định
                    </span>
                  )}
                </span>
                <label className="address-profile__phone-label">
                  Số Điện Thoại:
                </label>
                <span className="address-profile__phone-text">
                  {shipInfo.phone}
                </span>
                <label className="address-profile__address-label">
                  Địa Chỉ:
                </label>
                <span className="address-profile__address-text">
                  {shipInfo.fullAddress}
                </span>
              </div>
              <div className="address-profile__btn-container flex-1">
                {!shipInfosUpdateLoading && (
                  <div className={'flex w-full justify-around md:flex-none md:w-auto'}>
                    <span
                      onClick={() => handleEditClick(index)}
                      className="address-profile__edit-btn"
                    >
                      Sửa
                    </span>
                    {shipInfo.isDefault === false && (
                      <span
                        onClick={() => handleDeleteClick(index)}
                        className="address-profile__delete-btn"
                      >
                        Xóa
                      </span>
                    )}
                  </div>
                )}
                <button
                  disabled={shipInfo.isDefault || shipInfosUpdateLoading}
                  onClick={
                    shipInfo.isDefault
                      ? undefined
                      : () => handleDefaultClick(index)
                  }
                  className="btn address-profile__btn-default w-full md:w-clamp"
                >
                  Thiết lập mặc định
                </button>
              </div>
            </div>
          ))}
        {shipInfos?.length === 0 &&
          !shipInfosLoading &&
          !shipInfosUpdateLoading && (
            <div className="address-profile__address--empty">
              Vui lòng thêm địa chỉ
            </div>
          )}
        {(shipInfosLoading || shipInfosUpdateLoading) && (
          <ClipLoading></ClipLoading>
        )}
      </div>
      {isPopupShowing && (
        <PopupModal
          isPopupShowing={isPopupShowing}
          togglePopup={togglePopup}
          isAccountPage={true}
          shipInfoIndex={shipInfoIndex}
          setShipInfoIndex={setShipInfoIndex}
          handleDeleteTrue={handleDeleteTrue}
        ></PopupModal>
      )}
    </>
  );
};

export default AccountAddress;
