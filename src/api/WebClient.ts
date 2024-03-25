import Config from "../config.json";
import type QueryParamsType from "../model/QueryParamsType";

export default class WebClient {

  static getDatasets(token: string | null | undefined, qParams: QueryParamsType): Promise<XMLHttpRequest>  {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    const qTmp = this._prepQueryParams(qParams);
    return WebClient._call("GET", Config.datasetService + "/datasets", headers,
                null, "text", qTmp);
  }

  static getDataset(token: string | null | undefined, dsId: string): Promise<XMLHttpRequest> {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + "/datasets/" + dsId, headers,
                null, "text", null );
  }

  static patchDataset(token: string | null | undefined, dsId: string, property: string, value: string | null): Promise<XMLHttpRequest>  {
      let headers = new Map();
      if (token) {
        headers.set("Authorization", "Bearer " + token);
      }
      headers.set("Content-Type", "application/json");
      const payload = { property, value };
      return WebClient._call("PATCH", Config.datasetService + "/datasets/" + dsId, headers,
                  JSON.stringify(payload), "text", null );
  }

  static getStudies(token: string | null | undefined, dsId: string, studiesSkip: number | null | undefined, studiesLimit: number | null | undefined): Promise<XMLHttpRequest>  {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + "/datasets/" + dsId + "/studies", headers,
                null, "text", { studiesSkip, studiesLimit });

  }

  static getTracesActions(): Promise<XMLHttpRequest>  {
      return WebClient._call("GET", Config.tracerService + "/static/traces/actions",
        new Map(), null, "text", null);
  }

  static getTracesDataset(token: string | null | undefined, datasetId: string, skipTraces: number | null, limitTraces: number | null): Promise<XMLHttpRequest>  {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    const qTmp = this._prepQueryParams({ datasetId, skipTraces, limitTraces });
    return WebClient._call("GET", Config.tracerService + "/traces",
      headers, null, "text", qTmp);
  }

  static getDatasetCreationStatus(token: string | null | undefined, dsId: string): Promise<XMLHttpRequest>  {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + `/datasets/${dsId}/creationStatus`, headers,
                null, "text", null);
  }

  static getUpgradableDatasets(token: string | null | undefined): Promise<XMLHttpRequest>  {
    let headers = new Map<string, string>();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + `/upgradableDatasets`, headers,
                null, "text", null);
  }

  static getDatasetAccessHistory(token:  string | null | undefined, datasetId: string, skip: number | null,  limit: number | null) {
    let headers = new Map();
    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }
    return WebClient._call("GET", Config.datasetService + "/datasets/" + datasetId + "/accessHistory", headers,
                null, "text", { skip, limit });
  }
  
  static _prepQueryParams(qTmp: QueryParamsType): object | null {
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

  static _call(method: string, path: string, headers: Map<string, string>, payload: any, responseType: XMLHttpRequestResponseType, queryParams: object | null): Promise<XMLHttpRequest> {

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
