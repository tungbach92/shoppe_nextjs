import { useState, useEffect } from "react";
import ProvincesCitiesVN from "pc-vn";

const useAddress = () => {
  //TODO: change to 1 state address, update multiple state with cb func
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");

  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState(null);
  const [ward, setWard] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const handleProvinceChoose = (e, value) => {
    const province = provinces.find((province) => province.name === value);
    setDistrict(null);
    setWard(null);
    setProvince(province || null);
  };

  const handleDistrictChoose = (e, value) => {
    const district = districts.find((district) => district.name === value);
    setWard(null);
    setDistrict(district || null);
  };

  const handleWardChoose = (e, value) => {
    const ward = wards.find((ward) => ward.name === value);
    setWard(ward || null);
  };

  //Get and set province and set districts and district depend on province
  useEffect(() => {
    const provinces = ProvincesCitiesVN.getProvinces();
    const provincesWithShipPrice = provinces.map((item, index) => {
      return {
        ...item,
        shipPrice: [10000 + 2000 * index, 15000 + 2000 * index],
      };
    });
    setProvinces(provincesWithShipPrice);

    if (province) {
      const districts = ProvincesCitiesVN.getDistrictsByProvinceCode(
        province.code
      );
      setDistricts(districts);
    }

    if (district) {
      const wards = ProvincesCitiesVN.getWardsByDistrictCode(district.code);
      setWards(wards);
    }
  }, [district, province, ward]);

  return {
    name,
    setName,
    phone,
    setPhone,
    street,
    setStreet,
    provinces,
    districts,
    wards,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    handleDistrictChoose,
    handleProvinceChoose,
    handleWardChoose,
  };
};

export default useAddress;
