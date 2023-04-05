import Config from "../config.json";

export default class WebClient {

  static getDatasets(token, qParams) {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    const qTmp = this._prepQueryParams(qParams);
    return WebClient._call("GET", Config.datasetService + "/datasets", headers,
                null, "text", qTmp);
  }

  static getDataset(token, dsId, studiesSkip, studiesLimit) {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + "/datasets/" + dsId, headers,
                null, "text", { studiesSkip, studiesLimit });
  }

  static patchDataset(token, dsId, property, value) {
      let headers = new Map();
      if (token) {
        headers.set("Authorization", "Bearer " + token);
      }
      headers.set("Content-Type", "application/json");
      const payload = { property, value };
      return WebClient._call("PATCH", Config.datasetService + "/datasets/" + dsId, headers,
                  JSON.stringify(payload), "text", null );
  }

  static getTracesActions() {
      return WebClient._call("GET", Config.tracerService + "/static/traces/actions",
        new Map(), null, "text", null);
  }

  static getTracesDataset(token, datasetId, skipTraces, limitTraces) {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    const qTmp = this._prepQueryParams({ datasetId, skipTraces, limitTraces });
    return WebClient._call("GET", Config.tracerService + "/traces",
      headers, null, "text", qTmp);
  }

  static getDatasetCreationStatus(token, dsId) {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + `/datasets/${dsId}/creationStatus`, headers,
                null, "text", null);
  }

  static _prepQueryParams(qTmp) {
    const entr = Object.entries(qTmp);
    let size = entr.length;
    for (const [k,v] of entr) {
      if (v === undefined || v === null) {
        delete qTmp[k];
        --size;
      }
    }
    return size === 0 ? null : qTmp;
  }

  static _call(method, path, headers, payload, responseType, queryParams) {

      let request = new XMLHttpRequest();
      return new Promise(function (resolve, reject) {
          try {
            // Setup our listener to process compeleted requests
            request.onreadystatechange = function () {
                //console.log(path);
                // Only run if the request is complete
                if (request.readyState !== 4)
                    return;

                // Process the response
                if (request.status >= 200 && request.status < 300) {
                    // If successful
                    resolve(request);
                } else {
                    // If failed
                    reject(request);
                }

            };
            if (queryParams !== null) {
              path += "?" + Object.entries(queryParams)
                .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
                .join("&");
            }

            request.onerror = (err) => reject(err);
            request.open(method, path, true);
            request.responseType = responseType;


            for (const [k, v] of headers)
                request.setRequestHeader(k, v);
            //request.setRequestHeader("Authorization", "Bearer " + token);
            request.send(payload);
        } catch(e) {
          console.log(e);
          reject(e);
        }

      });
  }
}
