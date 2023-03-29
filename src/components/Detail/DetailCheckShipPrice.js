import React, { useState, useEffect } from "react";

import ProvincesCitiesVN from "pc-vn";
export default function DetailCheckShipPrice({
  setAddress,
  isPickerShow,
  togglePicker,
  setLookupShipPrice,
}) {
  const [isProvinceSelected, setIsProvinceSelected] = useState(false);
  const [isDistrictSelected, setIsDistrictSelected] = useState(false);
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestProvince, setSuggestProvince] = useState([]);
  const [suggestDistrict, setSuggestDistrict] = useState([]);

  const handleClick = (e) => {
    const value = e.target.innerText;
    const province = provinces.find((province) => province.name === value);
    const district = districts.find((district) => district.name === value);
    if (province) {
      setProvince(province);
      setIsProvinceSelected(true);
    }
    if (district) {
      setDistrict(district);
      setIsDistrictSelected(true);
    }
  };

  const handleSelectedClick = () => {
    setIsProvinceSelected(false);
  };

  const handlePickerInput = (e) => {
    let text = e.target.value;
    setSearchInput(text);
    text = text.trim().toLowerCase();
    changeSuggestProvinceAndDistrictBySearchInput(text);
  };

  const changeSuggestProvinceAndDistrictBySearchInput = (text) => {
    const suggestProvince = provinces.filter((province) =>
      province.name.toLowerCase().includes(text)
    );
    const suggestDistrict = districts.filter((district) =>
      district.name.toLowerCase().includes(text)
    );
    if (text === "") {
      setSuggestProvince(provinces);
      setSuggestDistrict(districts);
    } else {
      setSuggestProvince(suggestProvince);
      setSuggestDistrict(suggestDistrict);
    }
  };

  useEffect(() => {
    const provinces = ProvincesCitiesVN.getProvinces();
    const provincesWithShipPrice = provinces.map((item, index) => {
      return {
        ...item,
        shipPrice: [10000 + 2000 * index, 15000 + 2000 * index],
      };
    });
    if (province) {
      const districts = ProvincesCitiesVN.getDistrictsByProvinceCode(
        province.code
      );
      setDistricts(districts);
    }
    setProvinces(provincesWithShipPrice);
  }, [province]);

  useEffect(() => {
    // effect
    if (province && district) {
      const address = district.full_name;
      setAddress(address);
      const shipPrice = province.shipPrice;
      setLookupShipPrice(shipPrice);
    }
    if (isDistrictSelected) {
      togglePicker(!isPickerShow);
    }
  }, [
    district,
    province,
    setAddress,
    isPickerShow,
    togglePicker,
    isDistrictSelected,
    setLookupShipPrice,
  ]);

  useEffect(() => {
    setSuggestProvince(provinces);
    setSuggestDistrict(districts);
  }, [districts, isProvinceSelected, provinces]);

  return (
    <>
      <div className="detail-product__picker">
        <input
          type="text"
          value={searchInput}
          onChange={handlePickerInput}
          placeholder="Tìm"
          className="detail-product__picker-input"
        />

        <div className="detail-product__picker-list-wrapper">
          {isProvinceSelected && (
            <div
              onClick={handleSelectedClick}
              className="detail-product__selected-item"
            >
              <svg
                enableBackground="new 0 0 11 11"
                viewBox="0 0 11 11"
                x="0"
                y="0"
                className="detail-product__selected-icon"
              >
                <g>
                  <path d="m8.5 11c-.1 0-.2 0-.3-.1l-6-5c-.1-.1-.2-.3-.2-.4s.1-.3.2-.4l6-5c .2-.2.5-.1.7.1s.1.5-.1.7l-5.5 4.6 5.5 4.6c.2.2.2.5.1.7-.1.1-.3.2-.4.2z"></path>
                </g>
              </svg>
              {province.name}
            </div>
          )}
          <ul className="detail-product__picker-list">
            {isProvinceSelected === false
              ? suggestProvince.map((province, index) => (
                  <li
                    key={index}
                    onClick={handleClick}
                    className="detail-product__picker-item"
                  >
                    {province.name}
                  </li>
                ))
              : suggestDistrict.map((district, index) => (
                  <li
                    key={index}
                    onClick={handleClick}
                    className="detail-product__picker-item"
                  >
                    {district.name}
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </>
  );
}
