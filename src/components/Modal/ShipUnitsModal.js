import React, { useRef } from "react";
import ReactDOM from "react-dom";
import {useUser} from "../../context/UserProvider";
import {Debugger} from "inspector";
export default function ShipUnitsModal(props) {
  const {
    shipChecked,
    setShipChecked,
    shipUnit,
    setShipUnit,
    shipUnitList,
    isShipUnits,
    toggleShipUnits,
  } = props;
  const inputRef = useRef();

  const handleBack = () => {
    toggleShipUnits(!isShipUnits);
    //setCheckedByShipUnit
    let checked = [];
    shipUnitList.forEach((item) => {
      if (item.id === shipUnit.id) {
        checked[item.id] = true;
      } else {
        checked[item.id] = false;
      }
    });
    setShipChecked(checked);
  };

  const handleShipUnitChange = (item, e) => {
    let checked = [];
    shipUnitList.forEach((shipUnititem) => {
      if (shipUnititem.id === item.id) {
        checked[item.id] = e.target.checked;
      } else {
        checked[shipUnititem.id] = false;
      }
    });
    setShipChecked(checked);
  };

  const handleApply = (e) => {
    let selectedShipUnit;
    shipUnitList.forEach((item) => {
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
  if (typeof window !== 'undefined') {
    return ReactDOM.createPortal(
      <div className="cart-product__modal">
        <div className="cart-product__modal-overlay"></div>
        <div className="cart-product__modal-container">
          <div className="cart-product__modal-header">
          <span className="cart-product__shipunit-label">
            Chọn đơn vị vận chuyển
          </span>
          </div>
          <ul className="cart-product__shipunit-list">
            {shipUnitList.map((item, index) => (
              <div key={index} className="cart-product__shipunit-wrapper">
                <li className="cart-product__shipunit-item">
                  <input
                    ref={inputRef}
                    name={item.name}
                    type="checkbox"
                    value={item}
                    checked={shipChecked[item.id]}
                    onChange={handleShipUnitChange.bind(this, item)}
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
      </div>
    );
  }
}
