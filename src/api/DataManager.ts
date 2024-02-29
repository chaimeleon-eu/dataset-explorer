import WebClient from "./WebClient";

export default class DataManager {

  getDatasets(token, qParams) {
    return WebClient.getDatasets(token, qParams );
  }

  getDataset(token, datasetId, studiesSkip, studiesLimit) {
    return WebClient.getDataset(token, datasetId, studiesSkip, studiesLimit);
  }

  patchDataset(token, dsId, property, value) {
    return WebClient.patchDataset(token, dsId, property, value);
  }

  getStudies(token, dsId, studiesSkip, studiesLimit) {
    return WebClient.getStudies(token, dsId, studiesSkip, studiesLimit);
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

  getUpgradableDatasets(token) {
    return WebClient.getUpgradableDatasets(token);
  }

  getDatasetAccessHistory(token, datasetId, skip, limit) {
    return WebClient.getDatasetAccessHistory(token, datasetId, skip, limit);
  }
}
