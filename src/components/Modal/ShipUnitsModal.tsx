import React, {useRef} from "react";
import ReactDOM from "react-dom";
import {BaseModal} from "@/components/base";

interface Props {
  shipChecked: any
  setShipChecked: any
  shipUnit: any
  setShipUnit: any
  shipUnitList: any
  isShipUnits: boolean
  toggleShipUnits: any
}

export default function ShipUnitsModal({
                                         shipChecked,
                                         setShipChecked,
                                         shipUnit,
                                         setShipUnit,
                                         shipUnitList,
                                         isShipUnits,
                                         toggleShipUnits,
                                       }: Props) {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    toggleShipUnits(!isShipUnits);
    //setCheckedByShipUnit
    let checked: any[] = [];
    shipUnitList.forEach((item: any) => {
      if (item.id === shipUnit.id) {
        checked[item.id] = true;
      } else {
        checked[item.id] = false;
      }
    });
    setShipChecked(checked);
  };

  const handleShipUnitChange = (item: any, e: any) => {
    let checked: any[] = [];
    shipUnitList.forEach((shipUnititem: any) => {
      if (shipUnititem.id === item.id) {
        checked[item.id] = e.target.checked;
      } else {
        checked[shipUnititem.id] = false;
      }
    });
    setShipChecked(checked);
  };

  const handleApply = (e: any) => {
    let selectedShipUnit;
    shipUnitList.forEach((item: any) => {
      if (shipChecked[item.id]) {
        selectedShipUnit = item;
      }
    });
    if (selectedShipUnit) {
      setShipUnit(selectedShipUnit);
    } else {
      setShipUnit({});
    }
    toggleShipUnits(!isShipUnits);
  };
  return (
    <BaseModal isOpen={isShipUnits} handleClose={toggleShipUnits}>
      <div className="cart-product__modal-overlay"></div>
      <div className="cart-product__modal-container">
        <div className="cart-product__modal-header">
          <span className="cart-product__shipunit-label">
            Chọn đơn vị vận chuyển
          </span>
        </div>
        <ul className="cart-product__shipunit-list">
          {shipUnitList.map((item: any, index: any) => (
            <div key={index} className="cart-product__shipunit-wrapper">
              <li className="cart-product__shipunit-item">
                <input
                  ref={inputRef}
                  name={item.name}
                  type="checkbox"
                  value={item}
                  checked={shipChecked[item.id]}
                  onChange={(e) => handleShipUnitChange(item, e)}
                  className="cart-product__shipunit-checkbox"
                />
                <label className="cart-product__shipunit-name">
                  {item.name}
                </label>
                <span className="cart-product__shipunit-price">
                  {Number(item.price)}
                </span>
                <span className="cart-product__shipunit-date">{item.date}</span>
                <span className="cart-product__shipunit-pay">
                  {item.method}
                </span>
              </li>
            </div>
          ))}
        </ul>
        <div className="cart-product__modal-footer">
          <button
            onClick={handleBack}
            className="btn cart-product__modal-close"
          >
            Trở lại
          </button>
          <button
            onClick={handleApply}
            className="btn cart-product__modal-apply"
          >
            OK
          </button>
        </div>
      </div>
    </BaseModal>)

}
