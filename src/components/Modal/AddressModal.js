import React, {useRef, useState} from "react";
import ReactDOM from "react-dom";
import {Autocomplete, Button, styled, TextField} from "@mui/material";
import useGetShipInfos from "../../hooks/useGetShipInfos";
import {useUser} from "../../context/UserProvider";

const StyledTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== "isValid",
})(({isValid}) => ({
  "& .MuiInputBase-root, & .MuiOutlinedInput-root": {
    fontSize: "1.3rem",
  },
  "& .MuiFormLabel-root, & .MuiInputLabel-root": {
    fontSize: "1.3rem",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isValid === false && "red",
  },
}));

const StyleAutocomplete = styled(Autocomplete, {
  shouldForwardProp: (props) => props !== "isValid",
})(({isValid}) => ({
  "& .MuiFormLabel-root, & .MuiInputLabel-root": {
    fontSize: "1.3rem",
  },
  "& .MuiInputBase-root, & .MuiOutlinedInput-root": {
    fontSize: "1.3rem",
  },
  "& .MuiAutocomplete-endAdornment": {
    top: "calc(50% - 10px)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: isValid === false && "red",
  },
  "& .Mui-disabled": {
    cursor: "not-allowed",
  },
}));

const AddressModal = ({
                        isAddressAddShowing,
                        toggleAddressAdd,
                        phone,
                        setPhone,
                        name,
                        setName,
                        street,
                        setStreet,
                        ward,
                        province,
                        district,
                        provinces,
                        districts,
                        wards,
                        handleDistrictChoose,
                        handleProvinceChoose,
                        handleWardChoose,
                        shipInfoIndex,
                      }) => {
  const {user} = useUser();
  const {shipInfos, updateShipInfoToFirebase} = useGetShipInfos(user);
  const [errors, setErrors] = useState({});

  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isStreetValid, setIsStreetValid] = useState(true);
  const [isProvinceValid, setIsProvinceValid] = useState(true);
  const [isDistrictValid, setIsDistrictValid] = useState(true);
  const [isWardsValid, setIsWardsValid] = useState(true);
  const buttonRef = useRef();
  const validateName = () => {
    let error;
    setIsNameValid(true);
    // contain atleast 3 space
    if (!name) {
      setIsNameValid(false);
      error = "Vui lòng nhập Họ tên!";
    }

    const nameRegex = /(\D*[\s]){2,}/; // contain atleast 2 space, only char
    if (name && !nameRegex.test(name)) {
      setIsNameValid(false);
      error = "Nhập đầy đủ cả họ và tên, không chứa số!";
    }
    setErrors((prev) => ({...prev, name: error}));
  };

  const validatePhone = () => {
    let error;
    setIsPhoneValid(true);
    if (!phone) {
      setIsPhoneValid(false);
      error = "Vui lòng nhập Số điện thoại";
    }

    const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/; // đầu số 03, 05, 07, 08, 09, bắt đầu với +84 hoặc 84
    if (phone && !phoneRegex.test(phone)) {
      setIsPhoneValid(false);
      error = "Số điện thoại không hợp lệ!";
    }
    setErrors((prev) => ({...prev, phone: error}));
  };

  const validateProvince = () => {
    let isValid = true;
    let error;
    setIsProvinceValid(true);
    if (!province) {
      error = "Vui lòng chọn Tỉnh/thành phố";
      setIsProvinceValid(false);
    }
    setErrors((prev) => ({...prev, province: error}));
    return isValid;
  };

  const validateDistrict = () => {
    let error;
    setIsDistrictValid(true);
    if (!district) {
      setIsDistrictValid(false);
      error = "Vui lòng chọn Quận/huyện";
    }
    setErrors((prev) => ({...prev, district: error}));
  };

  const validateWard = () => {
    let error;
    setIsWardsValid(true);
    if (!ward) {
      setIsWardsValid(false);
      error = "Vui lòng chọn Phường/xã/thị trấn";
    }
    setErrors((prev) => ({...prev, ward: error}));
  };

  const validateStreet = () => {
    let error;
    setIsStreetValid(true);
    if (!street) {
      setIsStreetValid(false);
      error = "Vui lòng nhập Tổ dân phố, ngõ, số nhà, đường(thôn, xóm)";
    }
    setErrors((prev) => ({...prev, street: error}));
  };
  //TODO use formik
  const handleBack = () => {
    toggleAddressAdd(false);
    setIsNameValid(null);
    setIsPhoneValid(null);
    setIsStreetValid(null);
    setIsProvinceValid(null);
    setIsDistrictValid(null);
    setIsWardsValid(null);
    setErrors({});
  };

  const handleApply = (e) => {
    e.preventDefault();
    validateName();
    validatePhone();
    validateProvince();
    validateDistrict();
    validateWard();
    validateStreet();

    if (
      !isNameValid ||
      !isPhoneValid ||
      !isProvinceValid ||
      !isDistrictValid ||
      !isWardsValid ||
      !isStreetValid
    ) {
      return false;
    }
    if (shipInfoIndex !== null) {
      updateShipInfo().then();
    } else {
      addNewShipInfo().then();
    }
    toggleAddressAdd(!isAddressAddShowing);
  };

  const updateShipInfo = async () => {
    try {
      let tempShipInfos = [...shipInfos];
      const created = Date.now();
      const fullAddress = `${street}, ${ward.full_name}`;

      tempShipInfos = tempShipInfos.map((shipInfo) => {
        if (tempShipInfos.indexOf(shipInfo) === shipInfoIndex) {
          return {
            ...shipInfo,
            name: name,
            phone: phone,
            fullAddress: fullAddress,
            created: created,
            street: street,
            ward: ward,
            district: district,
            province: province,
          };
        } else return shipInfo;
      });

      await updateShipInfoToFirebase(tempShipInfos);
    } catch (error) {
      alert(error);
    }
  };

  const addNewShipInfo = async () => {
    try {
      let tempShipInfos = shipInfos ? [...shipInfos] : [];
      const created = Date.now();
      const fullAddress = `${street}, ${ward.full_name}`;

      const shipInfo = {
        name: name,
        phone: phone,
        fullAddress: fullAddress,
        isDefault: tempShipInfos.length === 0, // set defaul true when only have 1 shipinfo
        created: created,
        street: street,
        ward: ward,
        district: district,
        province: province,
      };

      tempShipInfos = [...tempShipInfos, shipInfo];
      await updateShipInfoToFirebase(tempShipInfos);
    } catch (err) {
      alert(err);
    }
  };

  const handlePhoneChange = (e) => {
    e.target.value = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setPhone(e.target.value);
  };

  return isAddressAddShowing
    ? (
      <div className="address-profile__modal">
        <div className="address-profile__modal-overlay"></div>
        <div className="address-profile__modal-container">
          <div className="address-profile__modal-header">
            <span className="address-profile__header-label">Địa Chỉ Mới</span>
          </div>
          <form
            className="address-profile__modal-content"
            onSubmit={handleApply}
          >
            <StyledTextField
              isValid={isNameValid}
              size="small"
              variant="outlined"
              label="Họ và tên"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateName}
              className="address-profile__name"
            />
            <StyledTextField
              isValid={isPhoneValid}
              size="small"
              type="text"
              variant="outlined"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={validatePhone}
              className="address-profile__phone"
              label="Số điện thoại"
            />
            <div className="address-profile__name-error">{errors.name}</div>
            <div className="address-profile__phone-error">{errors.phone}</div>
            <div className="address-profile__province">
              <StyleAutocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                isValid={isProvinceValid}
                size="small"
                ListboxProps={{
                  sx: {fontSize: "1.3rem"},
                }}
                value={province?.name || null}
                onChange={handleProvinceChoose}
                onBlur={validateProvince}
                disablePortal
                id="province"
                options={provinces.map((province) => province.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Thành phố"/>
                )}
              />
            </div>
            <div className="address-profile__district">
              <StyleAutocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                sx={{cursor: "not-allowed !important"}}
                isValid={isDistrictValid}
                size="small"
                ListboxProps={{
                  sx: {fontSize: "1.3rem"},
                }}
                disabled={!province}
                value={district?.name || null}
                onChange={handleDistrictChoose}
                onBlur={validateDistrict}
                disablePortal
                id="district"
                options={districts.map((district) => district.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Quận/Huyện"/>
                )}
              />
            </div>
            <div className="address-profile__ward">
              <StyleAutocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                isValid={isWardsValid}
                size="small"
                ListboxProps={{
                  sx: {fontSize: "1.3rem"},
                }}
                disabled={!district}
                value={ward?.name || null}
                onChange={handleWardChoose}
                onBlur={validateWard}
                disablePortal
                id="ward"
                options={wards.map((ward) => ward.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Phường/Xã"/>
                )}
              />
            </div>

            <div className="address-profile__province-error">
              {errors.province}
            </div>
            <div className="address-profile__district-error">
              {errors.district}
            </div>
            <div className="address-profile__ward-error">{errors.ward}</div>
            <StyledTextField
              isValid={isStreetValid}
              size="small"
              type="text"
              variant="outlined"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onBlur={validateStreet}
              className="address-profile__address-detail"
              label="Tổ dân phố, ngõ, số nhà, đường(thôn, xóm)"
            />
            <div className="address-profile__street-error">
              {errors.street}
            </div>
            <Button
              sx={{display: "none"}}
              ref={buttonRef}
              type="submit"
            ></Button>
          </form>

          <div className="address-profile__popup-footer">
            <button
              onClick={handleBack}
              className="btn address-profile__popup-back "
            >
              Trở lại
            </button>
            <button
              onClick={() => {
                buttonRef.current.click();
              }}
              className="btn address-profile__popup-apply "
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>) : null;
};
export default AddressModal;
