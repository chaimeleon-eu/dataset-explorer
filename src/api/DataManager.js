import WebClient from "./WebClient.js";

export default class DataManager {

  getDatasets(token, skip, limit) {
    return WebClient.getDatasets(token, skip, limit);
  }

  getDataset(token, datasetId, studiesSkip, studiesLimit) {
    return WebClient.getDataset(token, datasetId, studiesSkip, studiesLimit);
  }

  getDatasetHistory(token, datasetId) {
    return WebClient.getDatasetHistory(token, datasetId);
  }

  getTracesActions(token) {
    return WebClient.getTracesActions(token);
  }

}
