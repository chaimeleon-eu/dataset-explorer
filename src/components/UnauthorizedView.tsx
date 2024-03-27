import React from "react";
import { Link } from "react-router-dom";

function UnauthorizedView() {

  return (
    <h4 className="m-2">Please log in to see this page or return to the <Link to="/">home</Link> page.</h4>
  )

}

export default UnauthorizedView;
