import { Container } from "react-bootstrap";
import FilterFlags from "./FilterFlags";

function DatasetsFiltering({searchParams, updSearchParams, loading}) {

    return <Container>
        <FilterFlags updSearchParams={updSearchParams} searchParams={searchParams} loading={loading}/>

    </Container>;
}

export default DatasetsFiltering;