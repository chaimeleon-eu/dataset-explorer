
export default class Util {

  static RELEASE_DEV = "dev";
  static RELEASE_PROD = "prod";
  static RELEASE_PROD_TEST= "prod-test";
  static RELEASE_UNDEFINED = undefined;

  static getErrFromXhr(xhr) {
    let title = null;
    let text = null;
    if (!xhr.responseText) {
      if (xhr.statusText !== undefined && xhr.statusText !== null) {
          title = xhr.statusText;
          text = "Error loading data from " + xhr.responseURL;
      } else {
        title = "Error";
        text =  "Error loading data from " + xhr.responseURL;
      }
    } else {
      try {
        const err = JSON.parse(xhr.response);
        title = err.title;
        text = err.message;
      } catch (err) {
        console.warn(err);
        title = "Error";
        text = xhr.response;
      }
    }
    return { title, text };
  }


  static parseK8sNames(uNameKeycloak, truncate) {
    let uNameKube = uNameKeycloak.toLowerCase()
      .replaceAll("_","--").replaceAll("@","-at-")
      .replaceAll(".","-dot-").replaceAll('"', '' )
      .replaceAll('\\', '' ).replaceAll('..', '')
      .replaceAll('%', '-perc-').replaceAll(" ","");
    if (truncate) {
      let start = 0
      let end = uNameKube.length - 1
      while (!uNameKube.charAt(start).match(/^[0-9a-z]+$/) && start < end) {
          start += 1 ;
      }
      while (!uNameKube.charAt(end).match(/^[0-9a-z]+$/) && end > start) {
          end -= 1;
      }
      if (start === end) {
          console.error(`parse_k8s_names -> Cannot convert ${uNameKube} to a valid name to k8s`);
          uNameKube = null;
      } else {  
        uNameKube = uNameKube.substring(start, end + 1);
      }
    }
  
    if (uNameKube.length >= 63) {
      uNameKube = uNameKube.substring(0, 63);
    }
    return uNameKube;
  
  }

  static getReleaseType(configJson) {
    switch (configJson.release) {
      case Util.RELEASE_PROD: return Util.RELEASE_PROD;
      case Util.RELEASE_DEV: return Util.RELEASE_DEV;
      case Util.RELEASE_PROD_TEST: return Util.RELEASE_PROD_TEST;
      default: return Util.RELEASE_UNDEFINED;
    }
  }
}
