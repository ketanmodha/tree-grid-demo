import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { TreeGridModule, EditService, TreeGridAllModule } from "@syncfusion/ej2-angular-treegrid";
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
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    TrigreedComponent,
    LargedataComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    TreeGridModule,
    TreeGridAllModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownListAllModule,
    CheckBoxModule,
    DialogModule,
    HttpClientModule,
  ],
  providers: [PageService,
    SortService,
    FilterService,
    EditService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
