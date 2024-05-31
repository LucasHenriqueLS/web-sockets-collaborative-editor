// import { Injectable } from '@angular/core';
// import { Client, Message } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private stompClient: Client;
//   private textUpdateSubjects: { [key: string]: Subject<string> } = {};

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
//       console.log('Connected: ' + frame);
//       // Re-subscribe to document topics upon reconnect
//       Object.keys(this.textUpdateSubjects).forEach((documentId) => {
//         this.subscribeToDocument(documentId);
//       });
//     };

//     this.stompClient.onStompError = (frame) => {
//       console.error('Broker reported error: ' + frame.headers['message']);
//       console.error('Additional details: ' + frame.body);
//     };

//     this.stompClient.activate();
//   }

//   private subscribeToDocument(documentId: string) {
//     if (!this.textUpdateSubjects[documentId]) {
//       this.textUpdateSubjects[documentId] = new Subject<string>();
//     }
//     this.stompClient.subscribe(`/topic/updates/${documentId}`, (message: Message) => {
//       const content = JSON.parse(message.body).content;
//       console.log(`Received update for document ${documentId} in WebSocketService: ${content}`);
//       this.textUpdateSubjects[documentId].next(content);
//     });
//   }

//   connectToDocument(documentId: string) {
//     this.subscribeToDocument(documentId);
//   }

//   sendTextUpdate(documentId: string, text: string) {
//     this.stompClient.publish({
//       destination: `/app/changeText/${documentId}`,
//       body: JSON.stringify({ content: text })
//     });
//   }

//   getTextUpdates(documentId: string) {
//     console.log('Função "getTextUpdates" sendo chamada!!!!!!!!!!!!!!!!!!!!!!!!!!');
//     if (!this.textUpdateSubjects[documentId]) {
//       this.textUpdateSubjects[documentId] = new Subject<string>();
//     }
//     return this.textUpdateSubjects[documentId].asObservable();
//   }
// }