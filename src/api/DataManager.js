import WebClient from "./WebClient.js";

export default class DataManager {

  getDatasets(token, skip, limit, searchString) {
    return WebClient.getDatasets(token, skip, limit, searchString );
  }

  getDataset(token, datasetId, studiesSkip, studiesLimit) {
    return WebClient.getDataset(token, datasetId, studiesSkip, studiesLimit);
  }

  patchDataset(token, dsId, property, value) {
    return WebClient.patchDataset(token, dsId, property, value);
  }

  getTracesDataset(token, datasetId, skip,  limit) {
    return WebClient.getTracesDataset(token, datasetId, skip,  limit);
  }

  getTracesActions() {
    return WebClient.getTracesActions();
  }

  getDatasetCreationStatus(token, datasetId) {
    return WebClient.getDatasetCreationStatus(token, datasetId);
  }

}
