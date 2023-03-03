import { useKeycloak } from "@react-keycloak/web";
import React, { Fragment, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

import RouteFactory from "../../../api/RouteFactory";
import Config from "../../../config.json";
import Message from "../../../model/Message";
import Util from "../../../Util";

const MSG_INVALIDATED = 1;
const MSG_NEXT_ID = 2;
const MSG_CREATION_STAT = 3;

function MessageBox({postMessage, keycloakReady, dataManager, dataset}) {
    const [msgs, setMsgs] = useState({});
    const { keycloak } = useKeycloak();
    useEffect(() => {
            if (dataset) {
                if (dataset.invalidated) {
                    setMsgs(prevM => { return {...prevM, [MSG_INVALIDATED]: "This dataset has been invalidated."};});
                }
                if (dataset.nextId) {
                    const path = RouteFactory.getPath(RouteFactory.DATASET_DETAILS, { datasetId: dataset.nextId } );
                    setMsgs(prevM => { return {...prevM, [MSG_NEXT_ID]: `There is a newer version for this dataset, 
                        check <a href="${path}">${dataset.nextId}</a>`};});

                }
            }
        }, [dataset, keycloakReady]);
    useEffect(() => {
        let intervalStat = null;
        if (dataset && dataset.draft  && keycloakReady) {
            if (dataset.creating) {
                intervalStat = setInterval(() => {
                    console.log(`This will run every ${Config.refreshDatasetCreate}`);
                    dataManager.getDatasetCreationStatus(keycloak.token, dataset.id)
                        .then(xhr => {
                            const lastMsg = JSON.parse(xhr.response).lastMessage;
                            setMsgs(prevM => { return {...prevM, [MSG_CREATION_STAT]: `Dataset creation in progress with last message: ${lastMsg}`};});
                        })
                        .catch(xhr => {
                            const error = Util.getErrFromXhr(xhr);
                            postMessage(new Message(Message.ERROR, "Unable to refresh dataset creation status", error.text));

                        });
                  }, Config.refreshDatasetCreate);
            } else {
                if (intervalStat) {
                    clearInterval(intervalStat);
                }
            }
        }
        return () => { if (intervalStat) clearInterval(intervalStat); };

    });
    if (Object.values(msgs).length > 0) {
        return <Alert variant="warning">
                <ul>
                    {
                        Object.values(msgs).map(m => <li key={m} dangerouslySetInnerHTML={{ __html: m }}></li>)
                    }
                </ul>
            </Alert>
    } else {
        return <Fragment />
    }
}

export default MessageBox;