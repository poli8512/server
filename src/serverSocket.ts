import {IUtf8Message, request} from "websocket";
import {Server} from "http";
import {IConnection, IServerRequestMessage, IServerResponseMessage} from "./serverInterfaces";

const websocket = require('websocket')

export class ServerSocket {

  public connections: Array<IConnection> = []

  constructor(server: Server) {
    const wsServer = new websocket.server({
      httpServer: server,
    });

    wsServer.on('request', (request: request) => {
        const connection = request.accept(undefined, request.origin);
        connection.on('message', (_message) => {
          if (_message.type === 'utf8') {
            const message = _message as IUtf8Message
            const requestMessage: IServerRequestMessage = JSON.parse(
              message.utf8Data
            );
            if (requestMessage.type === 'message') {
              const responseStatus: IServerResponseMessage = {
                type: 'message-status',
                content: 'ok'
              }
              const responseMessage: IServerResponseMessage = {
                type: 'message',
                content: message.utf8Data
              }
              connection.sendUTF(JSON.stringify(responseStatus))
              this.connections.forEach(connect => {
                connect.connection.sendUTF(message.utf8Data)
              })
            }

          }
          else {
            throw new Error('Not UTF8')
          }
        })
        connection.on('close', (reasonCode, description) => {
          // this.connections = this.connections.filter(client => client.connection !== connection)
          console.log("Disconnect")
        })
      }
    )
  }
}

