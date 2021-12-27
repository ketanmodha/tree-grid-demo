import { LargedataComponent } from './largedata/largedata.component';
import { TrigreedComponent } from './trigreed/trigreed.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component : TrigreedComponent
  },
  {
    path: 'largedata',
    component : LargedataComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
