import React from "react";
import { Link } from "react-router-dom";

interface ResourceNotFoundViewProps {

  id: string;

}

function ResourceNotFoundView({id}: ResourceNotFoundViewProps) {

  return (
    <h4  className="m-2">
      Resource identified by <b>{ id }</b> not found. Return to the <Link to="/">home</Link> page.
    </h4>
  );
}

export default ResourceNotFoundView;
