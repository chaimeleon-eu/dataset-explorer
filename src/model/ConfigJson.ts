
interface KeycloakConfigOptions {
    "responseMode": string;
    "checkLoginIframe": boolean;
    "onLoad": string;
}

interface KeycloakConfig {
    "url": string;
    "realm": string;
    "clientId": string;
}

interface KeycloakOpts {
    config: KeycloakConfig;
    initOptions: KeycloakConfigOptions;
}

export default interface ConfigJson {

    "appVersion": string;
    "release": string;
    "datasetService": string | null | undefined;
    "tracerService": string | null | undefined;
    "caseExplorerService": string | null | undefined;
    "basename": string;
    "defaultLimitDatasets": number;
    "defaultLimitStudies": number;
    "defaultLimitTraces": number;
    "kubeAppsUrl": string;
    "userAccountUrl": string;
    "refreshDatasetCreate": number;
    "keycloak": KeycloakOpts;

}