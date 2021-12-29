import { Component, OnInit } from "@angular/core";
import { sampleData } from "./datasource";
import {
  ContextMenuService,
  EditService,
  ExcelExportService,
  PageService,
  PageSettingsModel,
  PdfExportService,
  ReorderService,
  ResizeService,
  RowDDService,
  SelectionService,
  SortService,
  SortSettingsModel
} from "@syncfusion/ej2-angular-treegrid";
import { EditSettingsModel } from '@syncfusion/ej2-treegrid';
// import { getData } from './data';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [ResizeService, ReorderService, RowDDService, SelectionService, SortService, ResizeService, PageService, EditService, ExcelExportService, PdfExportService, ContextMenuService]
})
export class AppComponent implements OnInit {


  ngOnInit(): void {

  }


}
