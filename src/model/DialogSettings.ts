import { ReactNode } from "react";
import { DialogSize } from "./DialogSize";


export default interface DialogSettings {
    body: ReactNode;
    footer: ReactNode;
    title: string;
    onBeforeClose: Function | null;
    scrollable: boolean;
    size: DialogSize;
    show: boolean;

}