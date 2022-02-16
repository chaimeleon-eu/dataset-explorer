import { Link } from "react-router-dom";

function ResourceNotFoundView(props) {

  return (
    <h4  className="m-2">
      Resource identified by <b>{ props.id }</b> not found. Return to the <Link to="/">home</Link> page.
    </h4>
  );
}

export default ResourceNotFoundView;
