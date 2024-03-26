import React from "react";
import { Container } from "react-bootstrap";
import FilterFlags from "./FilterFlags";

interface DatasetsFilteringProps {
    searchParams: URLSearchParams;
    filterUpdate: Function;
    loading: boolean;
}

function DatasetsFiltering({searchParams, filterUpdate, loading}: DatasetsFilteringProps) {

    return <Container>
        <FilterFlags filterUpdate={filterUpdate} searchParams={searchParams} loading={loading}/>

    </Container>;
}

export default DatasetsFiltering;