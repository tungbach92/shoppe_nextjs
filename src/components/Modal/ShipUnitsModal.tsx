import React, {useRef} from "react";
import {BaseModal, BaseModalProps} from "@/components/base";

interface Props extends BaseModalProps {
  shipChecked?: any
  setShipChecked?: any
  shipUnit?: any
  setShipUnit?: any
  shipUnitList?: any
  isShipUnits: boolean
  toggleShipUnits: () => void
}

interface ShipUnitsModalFooterProps {
  handleBack: () => void
  handleApply: () => void
}

interface ShipUnitsModalInterface {
  footer: React.FC<ShipUnitsModalFooterProps>
}

export const ShipUnitsModal: React.FC<Props> & ShipUnitsModalInterface = ({
                                                                            shipChecked,
                                                                            setShipChecked,
                                                                            shipUnit,
                                                                            setShipUnit,
                                                                            shipUnitList,
                                                                            isShipUnits,
                                                                            toggleShipUnits,
                                                                          }) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    toggleShipUnits();
    //setCheckedByShipUnit
    let checked: any[] = [];
    shipUnitList.forEach((item: any) => {
      checked[item.id] = item.id === shipUnit.id;
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

  const handleApply = () => {
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
    toggleShipUnits();
  };
  return (
    <BaseModal
      isOpen={isShipUnits}
      handleClose={toggleShipUnits}
      header={<div className="cart-product__modal-header">
          <span className="cart-product__shipunit-label">
            Chọn đơn vị vận chuyển
          </span>
      </div>}
      footer={<ShipUnitsModal.footer handleApply={handleApply} handleBack={handleBack}></ShipUnitsModal.footer>}
    >
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
    </BaseModal>)

}

ShipUnitsModal.footer = function ({handleBack, handleApply}) {
  return (
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
  )
}
