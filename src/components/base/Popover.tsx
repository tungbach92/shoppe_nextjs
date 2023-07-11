import * as React from 'react';
import {ReactNode} from 'react';
import Popover from '@mui/material/Popover';
import {useAtom} from "jotai";
import {anchorElAtom} from "@/store/anchorEl.atom";

interface PopoverProps {
  children: ReactNode
  open: boolean
  id: string | undefined
}

export default function BasicPopover({children, open, id}: PopoverProps) {
  const [anchorEl, setAnchorEl] = useAtom(anchorElAtom)

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        className={'top-8 left-6'}
      >
        {children}
      </Popover>
    </div>
  );
}
