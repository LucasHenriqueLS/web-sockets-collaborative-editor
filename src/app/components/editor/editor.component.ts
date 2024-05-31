// src/app/editor/editor.component.ts
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  text: string = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.webSocketService.getTextUpdates().subscribe((text: string) => {
      this.text = text;
    });
  }

  onTextChanged(event: any) {
    this.webSocketService.sendTextUpdate(event.target.value);
  }
}
