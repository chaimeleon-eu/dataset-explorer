import WebClient from "./WebClient.js";

export default class DataManager {

  getDatasets(token, skip, limit) {
    return WebClient.getDatasets(token, skip, limit);
  }

  getDataset(token, datasetId, studiesSkip, studiesLimit) {
    return WebClient.getDataset(token, datasetId, studiesSkip, studiesLimit);
  }

  patchDataset(token, dsId, property, value) {
    return WebClient.patchDataset(token, dsId, property, value);
  }

  getTracesDataset(token, datasetId) {
    return WebClient.getTracesDataset(token, datasetId);
  }

  getTracesActions() {
    return WebClient.getTracesActions();
  }

}
