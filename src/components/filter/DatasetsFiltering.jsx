import { Container } from "react-bootstrap";
import FilterFlags from "./FilterFlags.jsx";

function DatasetsFiltering({searchParams, updSearchParams}) {

    return <Container>
        <FilterFlags updSearchParams={updSearchParams} searchParams={searchParams} />

    </Container>;
}

export default DatasetsFiltering;