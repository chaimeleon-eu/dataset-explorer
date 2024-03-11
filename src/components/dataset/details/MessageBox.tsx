import { useKeycloak } from "@react-keycloak/web";
import React, { Fragment, useState, useEffect } from "react";
import { useCallback } from "react";
import { Alert } from "react-bootstrap";
import DataManager from "../../../api/DataManager";

import RouteFactory from "../../../api/RouteFactory";
import Config from "../../../config.json";
import Dataset from "../../../model/Dataset";
import Message from "../../../model/Message";
import Util from "../../../Util";

const MSG_INVALIDATED = 1;
const MSG_NEXT_ID = 2;
const MSG_CREATION_STAT = 3;

interface MessageBox {
    postMessage: Function;
    keycloakReady: boolean;
    dataManager: DataManager;
    dataset: Dataset;
    getDataset: Function;
}

function MessageBox({postMessage, keycloakReady, dataManager, dataset, getDataset}: MessageBox) {
    const [msgs, setMsgs] = useState<object>({});
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
                if ((stat.status === "finished" || stat.status === "error") && !dataset.creating) {
                    getDataset(keycloak.token, dataset.id);
                    msg = `Dataset creation finished with last message: ${stat.lastMessage}`;
                }
                setMsgs(prevM => { return {...prevM, [MSG_CREATION_STAT]: msg};});
            })
            .catch(xhr => {
                const error = Util.getErrFromXhr(xhr);
                postMessage(new Message(Message.ERROR, "Unable to refresh dataset creation status", error.text));

            });
      }, [msgs, dataset]);
      useEffect(() => {
        if (dataset && dataset.draft  && keycloakReady && dataset.creating) {
                getCreationStatus();
                console.log(`initial get creation status ${dataset}`);
            }

      }, [dataset]);
    useEffect(() => {
        let intervalStat: number | null = null;
        if (dataset && dataset.draft  && keycloakReady) {
            if (dataset.creating) {
                intervalStat = window.setInterval(() => {
                    console.log(`get creation status ${dataset}`);
                    getCreationStatus()
                }, Config.refreshDatasetCreate);
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
                        Object.values(msgs).map((m: string) => <li key={m} dangerouslySetInnerHTML={{ __html: m }}></li>)
                    }
                </ul>
            </Alert>
    } else {
        return <Fragment />
    }
}

export default MessageBox;