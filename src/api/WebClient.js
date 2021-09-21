import Config from "../config.json";

export default class WebClient {

  static getDatasets(token) {
    return WebClient._call("GET", Config.proxyServerUrl + "/datasets",
      new Map([["Access-Control-Allow-Origin", "*"]]),
                null, token, "text");
  }

  static getTracesActions(token) {
      return WebClient._call("GET", Config.proxyServerUrl + "/traces/actions/",
        new Map([["Access-Control-Allow-Origin", "*"]]),
                  null, token, "text");
  }

  static _call(method, path, headers, payload, token, responseType) {

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
            request.onerror = (err) => reject(err);
            request.open(method, path, true);
            request.responseType = responseType;
            for (const [k, v] of headers)
                request.setRequestHeader(k, v);
            request.setRequestHeader("Authorization", "Bearer " + token);
            request.send(payload);
        } catch(e) {
          console.log(e);
          reject(e);
        }

      });
  }
}
