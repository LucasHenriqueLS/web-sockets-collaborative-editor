// import { Component, OnInit } from '@angular/core';
// import { WebSocketService } from 'src/app/services/web-socket.service';

// @Component({
//   selector: 'app-editor',
//   templateUrl: './editor.component.html',
//   styleUrls: ['./editor.component.css']
// })
// export class EditorComponent implements OnInit {
//   text: string = '';

//   constructor(private webSocketService: WebSocketService) {}

//   ngOnInit() {
//     this.webSocketService.getTextUpdates().subscribe((text: string) => {
//       this.text = text;
//     });
//   }

//   onTextChanged(event: any) {
//     this.webSocketService.sendTextUpdate(event.target.value);
//   }
// }



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  documentId: string | null = null;
  text: string = '';

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id');
    if (this.documentId) {
      this.webSocketService.connectToDocument(this.documentId);
      this.webSocketService.getTextUpdates(this.documentId).subscribe((text: string) => {
        console.log(`Received update for document ${this.documentId}: ${text}`);
        this.text = text;
      });
    }
  }

  onTextChanged(event: any): void {
    console.log(`Sending update for document ${this.documentId}: ${event.target.value}`);
    if (this.documentId) {
      this.webSocketService.sendTextUpdate(this.documentId, event.target.value);
    }
  }
}