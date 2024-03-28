

export default class Message {
  public static WARN = "warning";
  public static ERROR = "danger";
  public static INFO = "info";
  
  public static UNK_ERROR_TITLE = "Unknown error";
  public static UNK_ERROR_MSG = "An unknown error has occured, please check the browser console for more details."
  

  protected _type: string;
  protected _title: string;
  protected _message: string | null | undefined;

  constructor(type: string, title: string, message?: string | null) {
    this._type = type;
    this._title = title;
    this._message = message;
  }

  get type() {return this._type;}
  set type(type) {this._type = type;}

  get title() {return this._title;}
  set title(title) {this._title = title;}

  get message() {return this._message;}
  set message(message) {this._message = message;}

}
