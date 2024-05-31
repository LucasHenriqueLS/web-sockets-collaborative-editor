// src/app/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private textUpdateSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      connectHeaders: {},
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      this.stompClient.subscribe('/topic/updates', (message) => {
        this.textUpdateSubject.next(JSON.parse(message.body).content);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  sendTextUpdate(text: string) {
    this.stompClient.publish({
      destination: '/app/changeText',
      body: JSON.stringify({ content: text })
    });
  }

  getTextUpdates() {
    return this.textUpdateSubject.asObservable();
  }
}