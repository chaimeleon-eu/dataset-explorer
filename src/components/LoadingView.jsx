import { Spinner } from 'react-bootstrap';


function LoadingView(props) {
  return <div><Spinner animation="border" className="me-2"/>Loading { props.what }. Please wait...</div>
}

export default LoadingView;
