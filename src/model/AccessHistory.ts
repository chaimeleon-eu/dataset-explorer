
export default interface AccessHistory {

    creationTime: Date;
    userName: string;
    accessType: string;
    toolName: string;
    toolVersion: string;
    image: string;
    resourcesFlavor: string;
    startTime: Date;
    endTime: Date;
    endStatus: string;
    cmdLine: string;
    openchallengeJobType: string;
}