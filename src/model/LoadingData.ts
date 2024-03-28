import type LoadingError from "./LoadingError";

export default class LoadingData<T_DATA> {

    data: T_DATA | null;
    loading: boolean;
    error: LoadingError | null;
    statusCode: number | null;
}