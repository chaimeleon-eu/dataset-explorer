import React from "react";
import { Spinner } from 'react-bootstrap';

interface LoadingViewProps {

  what: string;
}

function LoadingView(props: LoadingViewProps) {
  return <div><Spinner animation="border" className="me-2"/>Loading { props.what }. Please wait...</div>
}

export default LoadingView;
