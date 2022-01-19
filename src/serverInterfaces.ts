import {connection} from "websocket";
export interface IServerResponseMessage {
  type: string;
  content: string;
}
export interface IServerRequestMessage {
  type: string;
  content: string;
}
export interface IConnection {
  name: string,
  connection: connection
}


