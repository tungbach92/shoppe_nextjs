import React, {useState} from "react";
import {Autocomplete, ButtonProps, styled, TextField, TextFieldProps,} from "@mui/material";
import {useUser} from "@/context/UserProvider";
import {BaseModal} from "@/components/base";
import useGetShipInfos from "@/hooks/useGetShipInfos";

type StyledTextFieldProps = TextFieldProps & {
  isValid: boolean
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== "isValid",
})(({isValid}: StyledTextFieldProps) => ({
  "& .MuiInputBase-root, & .MuiOutlinedInput-root": {
    fontSize: "1.3rem",
  },
  "& .MuiFormLabel-root, & .MuiInputLabel-root": {
    fontSize: "1.3rem",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: !isValid && "red",
  },
}));

const StyleAutocomplete = styled(Autocomplete, {
  shouldForwardProp: (props) => props !== "isValid",
})(({isValid}: StyledTextFieldProps) => ({
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
    borderColor: !isValid && "red",
  },
  "& .Mui-disabled": {
    cursor: "not-allowed",
  },
}));

type RefButtonProps = ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {}

interface AddressModalProps {
  isAddressAddShowing: boolean
  toggleAddressAdd: () => void
  phone: string
  setPhone: React.Dispatch<React.SetStateAction<string>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  street: string
  setStreet: React.Dispatch<React.SetStateAction<string>>
  ward: any
  province: any
  district: any
  provinces: any[]
  districts: any[]
  wards: any[]
  handleDistrictChoose: any
  handleProvinceChoose: any
  handleWardChoose: any
  shipInfoIndex?: number | null
}

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
                      }: AddressModalProps) => {
  const {user} = useUser();
  const {shipInfos, updateShipInfoToFirebase} = useGetShipInfos(user);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validateName = () => {
    let error: string;
    let isNameValid = true
    // contain atleast 3 space
    if (!name) {
      isNameValid = false
      error = "Vui lòng nhập Họ tên!";
    }

    const nameRegex = /(\D*[\s]){2,}/; // contain atleast 2 space, only char
    if (name && !nameRegex.test(name)) {
      isNameValid = false
      error = "Nhập đầy đủ cả họ và tên, không chứa số!";
    }
    setErrors((prev: any) => ({...prev, name: error}));
    return isNameValid
  };

  const validatePhone = () => {
    let error: string;
    let isPhoneValid = true
    if (!phone) {
      isPhoneValid = false
      error = "Vui lòng nhập Số điện thoại";
    }

    const phoneRegex = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/; // đầu số 03, 05, 07, 08, 09, bắt đầu với +84 hoặc 84
    if (phone && !phoneRegex.test(phone)) {
      isPhoneValid = false
      error = "Số điện thoại không hợp lệ!";
    }
    setErrors((prev: any) => ({...prev, phone: error}));
    return isPhoneValid
  };

  const validateProvince = () => {
    let isProvinceValid = true;
    let error: string;
    if (!province) {
      error = "Vui lòng chọn Tỉnh/thành phố";
      isProvinceValid = false
    }
    setErrors((prev: any) => ({...prev, province: error}));
    return isProvinceValid;
  };

  const validateDistrict = () => {
    let error: string;
    let isDistrictValid = true
    if (!district) {
      isDistrictValid = false
      error = "Vui lòng chọn Quận/huyện";
    }
    setErrors((prev: any) => ({...prev, district: error}));
    return isDistrictValid
  };

  const validateWard = () => {
    let error: string;
    let isWardValid = true
    if (!ward) {
      isWardValid = false
      error = "Vui lòng chọn Phường/xã/thị trấn";
    }
    setErrors((prev: any) => ({...prev, ward: error}));
    return isWardValid
  };

  const validateStreet = () => {
    let error: string;
    let isStreetValid = true
    if (!street) {
      isStreetValid = false
      error = "Vui lòng nhập Tổ dân phố, ngõ, số nhà, đường(thôn, xóm)";
    }
    setErrors((prev: any) => ({...prev, street: error}));
    return isStreetValid
  };
  //TODO use formik
  const handleBack = () => {
    toggleAddressAdd();
    // setIsNameValid(null);
    // setIsPhoneValid(null);
    // setIsStreetValid(null);
    // setIsProvinceValid(null);
    // setIsDistrictValid(null);
    // setIsWardsValid(null);
    setErrors({});
  };

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isNameValid = validateName();
    const isPhoneValid = validatePhone();
    const isProvinceValid = validateProvince();
    const isDistrictValid = validateDistrict();
    const isWardsValid = validateWard();
    const isStreetValid = validateStreet();
    if (!isNameValid || !isPhoneValid || !isProvinceValid || !isDistrictValid || !isWardsValid || !isStreetValid) return

    if (shipInfoIndex !== null) {
      updateShipInfo().then();
    } else {
      addNewShipInfo().then();
    }
    toggleAddressAdd();
  };

  const updateShipInfo = async () => {
    try {
      let tempShipInfos = [...shipInfos];
      const created = Date.now();
      const fullAddress = `${street}, ${ward?.full_name ?? ''}`;

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
      const fullAddress = `${street}, ${ward?.full_name ?? ''}`;

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

  const handlePhoneChange = (e: any) => {
    e.target.value = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setPhone(e.target.value);
  };

  return (
    <BaseModal isOpen={isAddressAddShowing} handleClose={toggleAddressAdd}>
      <div className="address-profile__modal">
        <div className="address-profile__modal-overlay"></div>
        <div className="address-profile__modal-container">
          <div className="address-profile__modal-header">
            <span className="address-profile__header-label">Địa Chỉ Mới</span>
          </div>
          <form
            id={'address_form'}
            className="address-profile__modal-content"
            onSubmit={handleApply}
          >
            <TextField
              // isValid={isNameValid}
              size="small"
              // variant="outlined"
              label="Họ và tên"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validateName}
              className="address-profile__name"
            />
            <TextField
              // isValid={isPhoneValid}
              size="small"
              type="text"
              // variant="outlined"
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
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                // isValid={isProvinceValid}
                size="small"
                ListboxProps={{
                  sx: {fontSize: "1.3rem"},
                }}
                value={province?.name || null}
                onChange={handleProvinceChoose}
                onBlur={validateProvince}
                // disablePortal
                id="province"
                options={provinces.map((province) => province.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Thành phố"/>
                )}
              />
            </div>
            <div className="address-profile__district">
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                sx={{cursor: "not-allowed !important"}}
                // isValid={isDistrictValid}
                size="small"
                ListboxProps={{
                  sx: {fontSize: "1.3rem"},
                }}
                disabled={!province}
                value={district?.name || null}
                onChange={handleDistrictChoose}
                onBlur={validateDistrict}
                // disablePortal
                id="district"
                options={districts.map((district) => district.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Quận/Huyện"/>
                )}
              />
            </div>
            <div className="address-profile__ward">
              <Autocomplete
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                // isValid={isWardsValid}
                size="small"
                ListboxProps={{
                  sx: {fontSize: "1.3rem"},
                }}
                disabled={!district}
                value={ward?.name || null}
                onChange={handleWardChoose}
                onBlur={validateWard}
                // disablePortal
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
            <TextField
              // isValid={isStreetValid}
              size="small"
              type="text"
              // variant="outlined"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              onBlur={validateStreet}
              className="address-profile__address-detail"
              label="Tổ dân phố, ngõ, số nhà, đường(thôn, xóm)"
            />
            <div className="address-profile__street-error">
              {errors.street}
            </div>
          </form>

          <div className="address-profile__popup-footer">
            <button
              onClick={handleBack}
              className="btn address-profile__popup-back "
            >
              Trở lại
            </button>
            <button
              form={'address_form'}
              type={'submit'}
              className="btn address-profile__popup-apply "
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  )
};
export default AddressModal;
