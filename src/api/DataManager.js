import WebClient from "./WebClient.js";

export default class DataManager {

  constructor(token) {
    this._token = token;
  }

  get datasets() {
    return WebClient.getDatasets(this._token);
  }

  get tracesActions() {
    return WebClient.getTracesActions(this._token);
  }

}
