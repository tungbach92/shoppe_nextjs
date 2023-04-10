import {Button, ButtonProps} from "@mui/material";
import React from "react";

type BaseButtonProps = ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {}
export const BaseButton: React.FC<BaseButtonProps> = ({...props}) => {
  return (
    <Button {...props}/>
  );
};
