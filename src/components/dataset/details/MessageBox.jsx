import React, { Fragment } from "react";
import { Alert } from "react-bootstrap";

import RouteFactory from "../../../api/RouteFactory";

function MessageBox({dataset}) {
    let msgs = [];
    if (dataset) {
        if (dataset.invalidated) {
            msgs.push("This dataset has been invalidated.");
        }
        if (dataset.nextId) {
            const path = RouteFactory.getPath(RouteFactory.DATASET_DETAILS, { datasetId: dataset.nextId } );
            msgs.push(`There is a newer version for this dataset, 
                check <a href="${path}">${dataset.nextId}</a>`);
        }
    }
    if (msgs.length > 0) {
        return <Alert variant="warning">
                <ul>
                    {
                        msgs.map(m => <li key={m} dangerouslySetInnerHTML={{ __html: m }}></li>)
                    }
                </ul>
            </Alert>
    } else {
        return <Fragment />
    }
}

export default MessageBox;