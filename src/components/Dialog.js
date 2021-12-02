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
  useEffect(() => {
    /* Assign update to outside variable */
    outsideSetShow = setShow;

    /* Unassign when component unmounts */
    return () => outsideSetShow = null;
  });

  useEffect(() => {
      setShow(props.settings.show);
  }, [props.settings])

  let dialogSizeClass = "";
  if (props.settings.size === Dialog.SIZE_XL) {
    dialogSizeClass = "modal-xl";
  }

  return (
    <>
      <Modal dialogClassName={dialogSizeClass} size={props.settings.size} show={show} onHide={() => handleClose(props.settings.onBeforeClose)}>
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
Dialog.SIZE_XL = "xl";

Dialog.HANDLE_CLOSE = handleClose;
export default Dialog;
