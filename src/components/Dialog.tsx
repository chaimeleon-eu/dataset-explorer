import { Modal} from 'react-bootstrap';
import React, { useState, useEffect} from "react";
import type DialogSettings from '../model/DialogSettings';
import { DialogSize } from '../model/DialogSize';

let outsideSetShow: Function | null;

const handleClose = (onBeforeClose?: Function | null) => {
  console.log(onBeforeClose);
  if (onBeforeClose) {
    if (typeof onBeforeClose === 'function') {
        onBeforeClose();
    } else
      throw new Error("Dialog: On before clause parameter must be a function");
  }
  if (outsideSetShow) {
    outsideSetShow(false);
  } else {
    console.error("outsidesetShow is not defined or null");
  }
};


interface DialogProps {
  settings: DialogSettings;
}

function Dialog({settings}: DialogProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    /* Assign update to outside variable */
    outsideSetShow = setShow;

    /* Unassign when component unmounts */
    return () => { outsideSetShow = null; };
  }, []);

  useEffect(() => {
      setShow(settings.show);
  }, [settings]);
  let dialogClassName = "modal-90w";
  let size: "xl" | "lg" | "sm" = "sm";
  if (settings.size === DialogSize.SIZE_XL) {
    dialogClassName = "modal-xxl";
    size = "xl";
  } else if (settings.size === DialogSize.SIZE_LG) {
      dialogClassName = "modal-lg";
      size = "lg";
  } else if (settings.size === DialogSize.SIZE_SM) {
      dialogClassName = "modal-sm";
      size = "sm";
  } else {
    console.error(`unhandled dialog size ${dialogClassName}`);
  }
  return (
    <>
      <Modal dialogClassName={dialogClassName} size={size} show={show} scrollable={settings.scrollable} onHide={() => handleClose(settings.onBeforeClose)}>
        <Modal.Header closeButton>
          <Modal.Title>{settings.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {settings.body}
        </Modal.Body>
        <Modal.Footer>
          {settings.footer}
        </Modal.Footer>
      </Modal>
    </>
  );
}

Dialog.SIZE_SM = "sm";
Dialog.SIZE_LG = "lg";
Dialog.SIZE_XXL = "xxl";

Dialog.HANDLE_CLOSE = handleClose;
export default Dialog;
