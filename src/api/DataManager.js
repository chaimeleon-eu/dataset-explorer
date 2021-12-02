import WebClient from "./WebClient.js";

export default class DataManager {

  getDatasets(token) {
    return WebClient.getDatasets(token);
  }

  getDataset(token, datasetId) {
    return WebClient.getDataset(token, datasetId);
  }

  getTracesActions(token) {
    return WebClient.getTracesActions(token);
  }

}
