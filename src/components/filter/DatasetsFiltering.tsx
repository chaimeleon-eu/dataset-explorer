import React from "react";
import { Container } from "react-bootstrap";
import FilterFlags from "./FilterFlags";

interface DatasetsFilteringProps {
    searchParams: URLSearchParams;
    updSearchParams: Function;
    loading: boolean;
}

function DatasetsFiltering({searchParams, updSearchParams, loading}: DatasetsFilteringProps) {

    return <Container>
        <FilterFlags updSearchParams={updSearchParams} searchParams={searchParams} loading={loading}/>

    </Container>;
}

export default DatasetsFiltering;