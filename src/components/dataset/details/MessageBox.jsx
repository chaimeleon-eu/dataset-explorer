import { useKeycloak } from "@react-keycloak/web";
import React, { Fragment, useState, useEffect } from "react";
import { useCallback } from "react";
import { Alert } from "react-bootstrap";

import RouteFactory from "../../../api/RouteFactory";
import Config from "../../../config.json";
import Message from "../../../model/Message";
import Util from "../../../Util";

const MSG_INVALIDATED = 1;
const MSG_NEXT_ID = 2;
const MSG_CREATION_STAT = 3;

function MessageBox({postMessage, keycloakReady, dataManager, dataset, getDataset}) {
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
    const getCreationStatus = useCallback(() => {
        dataManager.getDatasetCreationStatus(keycloak.token, dataset.id)
            .then(xhr => {
                const stat = JSON.parse(xhr.response);
                let msg = `Dataset creation in progress with last message: ${stat.lastMessage}`;
                if ((stat.status === "finished" || stat.status === "error")) {
                    getDataset(keycloak.token, dataset.id);
                    msg = `Dataset creation finished with last message: ${stat.lastMessage}`;
                }
                setMsgs(prevM => { return {...prevM, [MSG_CREATION_STAT]: msg};});
            })
            .catch(xhr => {
                const error = Util.getErrFromXhr(xhr);
                postMessage(new Message(Message.ERROR, "Unable to refresh dataset creation status", error.text));

            });
      }, [msgs]);
      useEffect(() => {
        if (dataset && dataset.draft  && keycloakReady && dataset.creating) {
                getCreationStatus();
            }

      }, [dataset]);
    useEffect(() => {
        let intervalStat = null;
        if (dataset && dataset.draft  && keycloakReady) {
            if (dataset.creating) {
                intervalStat = setInterval(() => getCreationStatus(intervalStat), Config.refreshDatasetCreate);
            } else {
                if (intervalStat) {
                    clearInterval(intervalStat);
                }
            }
        }
        return () => { if (intervalStat) clearInterval(intervalStat); };

    }, [dataset]);
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