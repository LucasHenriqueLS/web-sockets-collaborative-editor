// import { Injectable } from '@angular/core';
// import { Client } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private stompClient: Client;
//   private textUpdateSubject: Subject<string> = new Subject<string>();

//   constructor() {
//     this.stompClient = new Client({
//       brokerURL: 'ws://localhost:8080/ws/websocket',
//       connectHeaders: {},
//       debug: (str) => { console.log(str); },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       webSocketFactory: () => {
//         return new SockJS('http://localhost:8080/ws');
//       }
//     });

//     this.stompClient.onConnect = (frame) => {
//       this.stompClient.subscribe('/topic/updates', (message) => {
//         this.textUpdateSubject.next(JSON.parse(message.body).content);
//       });
//     };

//     this.stompClient.onStompError = (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//     };

//     this.stompClient.activate();
//   }

//   sendTextUpdate(text: string) {
//     this.stompClient.publish({
//       destination: '/app/changeText',
//       body: JSON.stringify({ content: text })
//     });
//   }

//   getTextUpdates() {
//     return this.textUpdateSubject.asObservable();
//   }
// }


import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private textUpdateSubjects: Map<string, Subject<string>> = new Map();

  constructor() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      connectHeaders: {},
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws');
      },
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        this.textUpdateSubjects.forEach((subject, documentId) => {
          this.subscribeToDocument(documentId);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    this.stompClient.activate();
  }

  private subscribeToDocument(documentId: string) {
    if (!this.textUpdateSubjects.has(documentId)) {
      this.textUpdateSubjects.set(documentId, new Subject<string>());
    }
    if (this.stompClient.connected) {
      this.stompClient.subscribe(`/topic/updates/${documentId}`, (message) => {
        const content = JSON.parse(message.body).content;
        console.log(`Received update for document ${documentId} in WebSocketService: ${content}`);
        this.textUpdateSubjects.get(documentId)!.next(content);
      });
    } else {
      console.warn(`Cannot subscribe to document ${documentId} because STOMP client is not connected.`);
    }
  }

  connectToDocument(documentId: string) {
    if (this.stompClient.connected) {
      this.subscribeToDocument(documentId);
    } else {
      this.stompClient.onConnect = (frame) => {
        console.log('Connected: ' + frame);
        this.subscribeToDocument(documentId);
      };
    }
  }

  sendTextUpdate(documentId: string, text: string) {
    this.stompClient.publish({
      destination: `/app/changeText/${documentId}`,
      body: JSON.stringify({ content: text })
    });
  }

  getTextUpdates(documentId: string) {
    if (!this.textUpdateSubjects.has(documentId)) {
      this.textUpdateSubjects.set(documentId, new Subject<string>());
    }
    return this.textUpdateSubjects.get(documentId)!.asObservable();
  }
}