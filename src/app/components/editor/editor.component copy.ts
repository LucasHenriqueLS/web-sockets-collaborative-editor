// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { WebSocketService } from 'src/app/services/web-socket.service';

// @Component({
//   selector: 'app-editor',
//   templateUrl: './editor.component.html',
//   styleUrls: ['./editor.component.css']
// })
// export class EditorComponent implements OnInit {
//   documentId: string | null = null;
//   content: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private webSocketService: WebSocketService
//   ) {}

//   ngOnInit(): void {
//     this.documentId = this.route.snapshot.paramMap.get('id');
//     if (this.documentId) {
//       this.webSocketService.connectToDocument(this.documentId);
//       this.webSocketService.getTextUpdates(this.documentId).subscribe((text: string) => {
//         console.log(`Received update for document ${this.documentId}: ${text}`);
//         this.content = text;
//       });
//     }
//   }

//   onContentChange(newContent: string): void {
//     console.log(`Sending update for document ${this.documentId}: ${newContent}`);
//     if (this.documentId) {
//       this.webSocketService.sendTextUpdate(this.documentId, newContent);
//     }
//   }
// }