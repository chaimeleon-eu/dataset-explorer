import Series from "./Series";

export default interface Study {

    studyId: string,
    studyName: string | null,
    subjectName: string | null,
    pathInDatalake: string,
    series: Series[],
    url: string | null
    sizeInBytes: number;
}