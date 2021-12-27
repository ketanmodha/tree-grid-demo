import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { TreeGridModule,EditService } from "@syncfusion/ej2-angular-treegrid";
import {
  PageService,
  SortService,
  FilterService
} from "@syncfusion/ej2-angular-treegrid";
import { TrigreedComponent } from './trigreed/trigreed.component';
import { LargedataComponent } from './largedata/largedata.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from "./app.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [AppComponent, TrigreedComponent, LargedataComponent, HeaderComponent],
  imports: [BrowserModule, TreeGridModule,AppRoutingModule,FormsModule,ReactiveFormsModule],
  providers: [PageService, SortService, FilterService,EditService],
  bootstrap: [AppComponent]
})
export class AppModule {}
