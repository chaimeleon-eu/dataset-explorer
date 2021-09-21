

export default class Message {

  constructor(type, title, message) {
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

Message.WARN = "warning";
Message.ERROR = "danger";
Message.INFO = "info";

Message.UNK_ERROR_TITLE = "Unknown error";
Message.UNK_ERROR_MSG = "An unknown error has occured, please check the browser console for more details."
