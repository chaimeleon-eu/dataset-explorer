import { Button, Modal} from 'react-bootstrap';
import { useState, useEffect} from "react";

var outsideSetShow;

const handleClose = (onBeforeClose) => {
  console.log(onBeforeClose);
  if (onBeforeClose !== null && onBeforeClose !== undefined) {
    if (typeof onBeforeClose === 'function') {
        onBeforeClose();
    } else
      throw "Dialog: On before clause parameter must be a function";
  }

  outsideSetShow(false);
};

function Dialog(props) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(props.settings.data);
  useEffect(() => {
    /* Assign update to outside variable */
    outsideSetShow = setShow;

    /* Unassign when component unmounts */
    return () => outsideSetShow = null;
  });

  useEffect(() => {
      setShow(props.settings.show);
  }, [props.settings]);
  let dialogClassName = "modal-90w";
  let size = "";
  if (props.settings.size === Dialog.SIZE_XXL) {
    dialogClassName = "modal-xxl";
    size = Dialog.SIZE_XXL;
  } else if (props.settings.size === Dialog.SIZE_LG) {
      dialogClassName = "modal-lg";
      size = Dialog.SIZE_LG;
  } else if (props.settings.size === Dialog.SIZE_SM) {
      dialogClassName = "modal-sm";
      size = Dialog.SIZE_SM;
  } else {
    console.error(`unhandled dialog size ${dialogClassName}`);
  }
  return (
    <>
      <Modal dialogClassName={dialogClassName} size={size} show={show} scrollable={props.settings.scrollable} onHide={() => handleClose(props.settings.onBeforeClose)}>
        <Modal.Header closeButton>
          <Modal.Title>{props.settings.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.settings.body}
        </Modal.Body>
        <Modal.Footer>
          {props.settings.footer}
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
