import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';

const routes: Routes = [
  { path: 'editor/:id', component: EditorComponent },
  { path: '', redirectTo: '/editor/default', pathMatch: 'full' },
  { path: '**', redirectTo: '/editor/default' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
