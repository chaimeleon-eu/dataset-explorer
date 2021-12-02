import {Button, Container} from "react-bootstrap";

function DatasetDetailsFooter(props) {

  return (
    <Container className="w-100 m-1">
      <Button variant="secondary" size="sm" className="float-end" onClick={() => props.onClose()}>Close</Button>
    </Container>
  );
}

export default DatasetDetailsFooter;
