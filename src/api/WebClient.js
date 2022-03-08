import Config from "../config.json";

export default class WebClient {

  static getDatasets(token, skip, limit) {
    let headers = new Map();
    if (token != undefined) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + "/datasets", headers,
                null, "text", { skip, limit });
  }

  static getDataset(token, dsId, studiesSkip, studiesLimit) {
    let headers = new Map();
    if (token != undefined) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + "/dataset/" + dsId, headers,
                null, "text", { studiesSkip, studiesLimit });
  }

  static getTracesActions() {
      return WebClient._call("GET", Config.tracerService + "/static/traces/actions",
        new Map(), null, "text", null);
  }

  static getTracesDataset(token, datasetId) {
    let headers = new Map();
    if (token != undefined) {
      headers.set("Authorization", "Bearer " + token);
    }
      return WebClient._call("GET", Config.tracerService + "/traces",
        headers, null, "text", { datasetId });
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
