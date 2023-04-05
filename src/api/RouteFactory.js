
import Config from "../config.json";

export default class RouteFactory {

    static DATASET_DETAILS = Config.basename + "/datasets/:datasetId/details";

    static getPath(id, format) {
        switch (id) {
            case RouteFactory.DATASET_DETAILS: return format ? 
                RouteFactory.DATASET_DETAILS.replace(":datasetId", format.datasetId) : RouteFactory.DATASET_DETAILS;
            default: throw new Error(`Unknown id ${id}`);
        }
    }
}