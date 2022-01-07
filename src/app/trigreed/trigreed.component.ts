import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  ToolbarItems,
  SelectionSettingsModel,
  SortSettingsModel,
  PageSettingsModel,
  EditSettingsModel,
  ResizeService,
  ContextMenuService,
  EditService,
  ExcelExportService,
  PageService,
  PdfExportService,
  ReorderService,
  RowDDService,
  SelectionService,
  SortService,
  ToolbarService,
  TreeGridComponent,
  FilterSettingsModel,
  Column,
  FreezeService,
  ColumnChooserService,
  InfiniteScrollService,
  VirtualScrollService,
  ColumnMenuService,
  RowPosition,
} from "@syncfusion/ej2-angular-treegrid";
import { sampleData } from "../data";
import { MenuEventArgs } from "@syncfusion/ej2-navigations";
import { getValue, isNullOrUndefined } from "@syncfusion/ej2-base";
import { BeforeOpenCloseEventArgs } from "@syncfusion/ej2-inputs";
import {
  GridComponent,
  QueryCellInfoEventArgs,
  RowDeselectEventArgs,
  RowSelectEventArgs,
  SortEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { DropDownListComponent } from "@syncfusion/ej2-angular-dropdowns";
import {
  DropDownList,
  ChangeEventArgs,
} from "@syncfusion/ej2-angular-dropdowns";
import { CheckBoxComponent } from "@syncfusion/ej2-angular-buttons";
import { DialogComponent } from "@syncfusion/ej2-angular-popups";

declare var $: any;

@Component({
  selector: "app-trigreed",
  templateUrl: "./trigreed.component.html",
  styleUrls: ["./trigreed.component.css"],
  providers: [
    ResizeService,
    ReorderService,
    RowDDService,
    SelectionService,
    SortService,
    ResizeService,
    PageService,
    EditService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
    ToolbarService,
    FreezeService,
    ColumnChooserService,
    InfiniteScrollService,
    VirtualScrollService,
    ColumnMenuService,
  ],
})
export class TrigreedComponent implements OnInit {
  public data: Object[];
  public sortSettings: SortSettingsModel;
  public pageSettings: PageSettingsModel;
  public filterSettings: FilterSettingsModel;
  public contextMenuItems: any = Object;
  public editSettings: EditSettingsModel;
  public editparams: Object;
  public datas: Object;
  public toolbarOption: string[];
  public selectionOptions: SelectionSettingsModel;
  @ViewChild("treeGridObj", { static: false })
  public treeGridObj: TreeGridComponent;
  public formatoption: Object;
  public columns: Object[];
  headerText: string;
  changeHeader: string;
  columnName: string;
  @ViewChild("grid", { static: false })
  gridObj: GridComponent;
  public flag = true;
  public newColumns;
  public newColourColumn: any = [];
  public copyObject: any = [];
  public cutObject: any = [];
  flagCut: boolean = true;
  copyNewObj: any = [];
  globleIndex: any;
  public newRecord: any = {};
  public clickedRowIndex: number = 0;
  public addMode: string = "Below";
  //   taskID: any = "",
  //   taskName: "",
  //   startDate: "",
  //   duration: "",
  // };

  // To hold rows that is being cut or copied
  clipboardData: any = [];

  // Will be set to true if user performs cut operation
  shouldMove: boolean = false;

  @ViewChild("dropdown1", { static: false })
  public dropdown1: DropDownListComponent;
  public templateOptions: object;
  public dropDownFilter: DropDownList;
  public d1data: Object;
  public fields1: Object;

  // ! Multi Sorting
  @ViewChild("taskID", { static: false })
  public taskID: CheckBoxComponent;
  @ViewChild("taskName", { static: false })
  public taskName: CheckBoxComponent;
  @ViewChild("startDate", { static: false })
  public startDate: CheckBoxComponent;
  @ViewChild("duration", { static: false })
  public duration: CheckBoxComponent;
  @ViewChild("price", { static: false })
  public price: CheckBoxComponent;

  // ! Cell Alignment and other
  public d2data: Object;
  public d3data: Object;
  public ddlfields: Object;
  public fields: Object;
  @ViewChild("dropdown2", { static: false })
  public dropdown2: DropDownListComponent;
  @ViewChild("dropdown3", { static: false })
  public dropdown3: DropDownListComponent;
  public customAttributes: Object;
  treeGridobject: any = {};

  public directionData: Object[] = [
    { id: "Left", name: "Left" },
    { id: "Right", name: "Right" },
    { id: "Center", name: "Center" },
  ];

  // ej2 angular modal
  @ViewChild("template", { static: false }) template: DialogComponent;
  @ViewChild("deletetemplate", { static: false })
  deletetemplate: DialogComponent;

  // Create element reference for dialog target element.
  @ViewChild("container", { read: ElementRef, static: false })
  container: ElementRef;

  ngOnInit(): void {
    this.treeGridobject.selectedRows = [];
    this.treeGridobject.copiedRows = [];
    this.treeGridobject.selectedHTMLRow = [];
    this.data = sampleData;
    this.customAttributes = { class: "customcss" };
    this.columns = [
      {
        field: "taskID",
        headerText: "Task Id",
        type: "number",
        visble: true,
        isFrozen: true,
        validationRules: { required: true, number: true },
      },
      {
        field: "taskName",
        headerText: "Task Name",
        type: "text",
        visble: true,
        isFrozen: true,
      },
      {
        field: "startDate",
        headerText: "Start Date",
        visble: true,
        type: "date",
        format: "yMd",
      },
      {
        field: "duration",
        headerText: "Duration",
        type: "number",
        visble: true,
        filterbars: this.templateOptions,
      },
    ];

    this.toolbarOption = ["ColumnChooser"];
    this.selectionOptions = {
      cellSelectionMode: "Box",
      type: "Multiple",
      checkboxMode: "Default",
      mode: "Row",
    };

    // Context Menu Items for header and records

    this.contextMenuItems = [
      /* Context Menu Items for Header Cells */

      { text: "Edit Col", target: ".e-headercell", id: "ranamecolumn" },
      { text: "New Col", target: ".e-headercell", id: "addcolumn" },
      { text: "Del Col", target: ".e-headercell", id: "deletecolumn" },
      { text: "Choose Col", target: ".e-headercell", id: "selectcolumn" },
      { text: "Freeze Col", target: ".e-headercell", id: "freezecolumn" },
      { text: "Filter Col", target: ".e-headercell", id: "filtercolumn" },
      { text: "Multi Sort", target: ".e-headercell", id: "multisort" },

      /* Context Menu Items for Row Cells */

      { text: "Add Next", target: ".e-content", id: "addnext" },
      { text: "Add Child", target: ".e-content", id: "addchild" },
      { separator: true, target: ".e-content" },
      // "Delete",
      { text: "Delete Row", target: ".e-content", id: "deleterow" },
      { text: "Edit Row", target: ".e-content", id: "editrow" },
      {
        text: "Multi Select",
        target: ".e-content",
        id: "multiselect",
        iconCss: "e-icons e-right",
      },
      {
        text: "Multi Select",
        target: ".e-content",
        id: "multiselectSingle",
      },
      { separator: true, target: ".e-content" },
      { text: "Copy Rows", target: ".e-content", id: "copyrows" },
      { text: "Cut Rows", target: ".e-content", id: "cutrows" },
      { text: "Paste Next", target: ".e-content", id: "pastenext" },
      { text: "Paste Child", target: ".e-content", id: "pastechild" },
    ];

    this.sortSettings = {
      columns: [
        { field: "taskID", direction: "Ascending" },
        { field: "taskName", direction: "Ascending" },
      ],
    };

    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Dialog",
      newRowPosition: "Below",
      // showDeleteConfirmDialog: true,
    };

    this.editparams = { params: { format: "n" } };
    this.pageSettings = { pageSize: 100 };
    // this.filterSettings = { type: 'Menu', ignoreAccent: true };
    this.formatoption = { type: "dateTime", format: "dd/MM/yyyy hh:mm a" };
    this.templateOptions = {
      create: (args: { element: Element }) => {
        let dd: HTMLInputElement = document.createElement("input");
        dd.id = "duration";
        return dd;
      },
      write: (args: { element: Element }) => {
        let dataSource: string[] = ["All", "1", "3", "4", "5", "6", "8", "9"];
        this.dropDownFilter = new DropDownList({
          dataSource: dataSource,
          value: "All",
          change: (e: ChangeEventArgs) => {
            let valuenum: any = +e.value;
            let id: any = <string>this.dropDownFilter.element.id;
            let value: any = <string>e.value;
            if (value !== "All") {
              this.treeGridObj.filterByColumn(id, "equal", valuenum);
            } else {
              this.treeGridObj.removeFilteredColsByField(id);
            }
          },
        });
        this.dropDownFilter.appendTo("#duration");
      },
    };

    this.fields1 = { text: "mode", value: "id" };

    this.d1data = [
      { id: "Parent", mode: "Parent" },
      { id: "Child", mode: "Child" },
      { id: "Both", mode: "Both" },
      { id: "None", mode: "None" },
    ];

    this.ddlfields = { text: "name", value: "id" };
    this.fields = { text: "name", value: "id" };

    (this.d2data = [
      { id: "taskID", name: "Task ID" },
      { id: "taskName", name: "Task Name" },
      { id: "startDate", name: "Start Date" },
      { id: "duration", name: "Duration" },
    ]),

      (this.d3data = [
        { id: "right", name: "right" },
        { id: "left", name: "left" },
        { id: "center", name: "center" },
        { id: "justify", name: "justify" },
      ]),
      setTimeout(() => {
        this.disable();
        document.getElementById("multiselectSingle").style.display = "none";
      }, 200);
  }

  clickEvent() {
    console.log("aaaaaaaaaaaaaaaaaaa")
  }

  change(e: ChangeEventArgs): void {
    let mode: any = <string>e.value;
    this.treeGridObj.filterSettings.hierarchyMode = mode;
    this.treeGridObj.clearFiltering();
    this.dropDownFilter.value = "All";
  }

  removed(args: any) {
    this.gridObj.getColumnByField(args.itemData).isFrozen = false;
    this.gridObj.refreshColumns();
  }

  select(args: any): void {
    if (
      this.gridObj.getColumns().length - 1 >
      this.gridObj.getFrozenColumns()
    ) {
      for (let i = 0; i < this.gridObj.getVisibleColumns().length; i++) {
        if (args.itemData == this.gridObj.getVisibleColumns()[i].field) {
          this.gridObj.getVisibleColumns()[i].isFrozen = true;
        }
      }
      this.gridObj.refreshColumns();
    } else {
      args.cancel = true;
    }
  }

  commandClick(args?: MenuEventArgs) {
    console.log("args?", args)
  }

  contextMenuClick(args?: MenuEventArgs): void {
    console.log("args", args);
    var idx: any = args["rowInfo"].rowIndex;
    console.log(idx)

    // A row where right click happened
    let row: Element = args["rowInfo"].row;
    this.treeGridobject.deleteRow = row;

    // Get UID of the clicked row
    let uid: string = row && row.getAttribute("data-uid");

    // Get Index of clicked Row
    this.clickedRowIndex = row && parseInt(row.getAttribute("aria-rowindex"));

    if (args.item["properties"].id === "deleterow") {
      // Delete selected row
      this.deletetemplate.show();
      // this.treeGridObj.deleteRow(<HTMLTableRowElement>row);
    } else if (args.item["properties"].id === "multiselectSingle") {
      // Enable Multi Select
      this.selectionOptions = {
        type: "Multiple",
        cellSelectionMode: "Box",
        checkboxMode: "Default",
        mode: "Row",
      };
      console.log(this.selectionOptions);

      // multi select on off
      document.getElementById("multiselect").style.display = "block";

      document.getElementById("multiselectSingle").style.display = "none";
    } else if (args.item["properties"].id === "multiselect") {
      // multi select on off
      this.selectionOptions = {
        cellSelectionMode: "Box",
        type: "Single",
        checkboxMode: "Default",
        mode: "Row",
      };

      document.getElementById("multiselect").style.display = "none";

      document.getElementById("multiselectSingle").style.display = "block";
    } else if (args.item["properties"].id === "editrow") {
      this.treeGridObj.startEdit();
    } else if (args.item["properties"].id === "copyrows") {
      // Clear clipboard
      this.clipboardData = [];

      // Setting up shouldMove to false as it's a copy operation
      this.shouldMove = false;

      // Assigning and saving the data to clipboard
      this.treeGridObj.getSelectedRows().map((rowItem) => {
        rowItem.setAttribute("ID", "copyRowBackGround");
        console.log(rowItem);
        let dataUID: string = rowItem.getAttribute("data-uid");
        let data: any = this.treeGridObj.grid.getRowObjectFromUID(dataUID).data;
        if (data) {
          this.clipboardData.unshift(data);
        }
      });
    } else if (args.item["properties"].id === "cutrows") {
      // Clear clipboard
      this.clipboardData = [];

      // Setting up shouldMove to true as it's a cut operation
      this.shouldMove = true;

      // Assigning and saving the data to clipboard
      this.treeGridObj.getSelectedRows().map((rowItem) => {
        rowItem.setAttribute("ID", "copyRowBackGround");
        this.treeGridobject.selectedRows.unshift(rowItem);
        let dataUID: string = rowItem.getAttribute("data-uid");
        let data: any = this.treeGridObj.grid.getRowObjectFromUID(dataUID).data;
        if (data) {
          this.clipboardData.unshift(data);
        }

        // this.treeGridObj.deleteRow(<HTMLTableRowElement>rowItem);
      });

      console.log("this.data>>>>>>>", this.clipboardData);
      // copy row menu css

      // let style = "pointer-events: none; opacity: 0.6";
      // document.querySelectorAll("li#cutrows")[0].setAttribute("style", style);
    } else if (args.item["properties"].id === "pastenext") {
      // // After cut row then paste next remove cut row
      // if (this.treeGridobject.selectedRows.length > 0) {
      //   this.treeGridobject.selectedRows.forEach(element => {
      //     this.treeGridObj.deleteRow(
      //       <HTMLTableRowElement>element
      //     );
      //   });
      // }

      if (this.clipboardData.length > 0) {
        for (let data in this.clipboardData) {
          let record = this.shouldMove
            ? this.clipboardData[data]
            : Object.assign({}, this.clipboardData[data]);

          if (!this.shouldMove) record.taskID = this.getRandomID();

          this.treeGridObj.addRecord(record, idx, "Below");
        }
      }
      if (this.shouldMove) this.clipboardData = [];
    } else if (args.item["properties"].id === "pastechild") {

      // After cut row then paste next remove cut row
      if (this.treeGridobject.selectedRows.length > 0) {
        this.treeGridobject.selectedRows.forEach(element => {
          this.treeGridObj.deleteRow(
            <HTMLTableRowElement>element
          );
        });
      }

      if (this.clipboardData.length > 0) {
        for (let data in this.clipboardData) {
          let record = this.shouldMove
            ? this.clipboardData[data]
            : Object.assign({}, this.clipboardData[data]);
          if (!this.shouldMove) record.taskID = this.getRandomID();
          let index = idx + 1;
          this.treeGridObj.addRecord(record, idx, "Child");
        }
      }

      console.log(this.data)

      if (this.shouldMove) this.clipboardData = [];
    } else if (args.item["properties"].id === "addnext") {
      this.newRecord = {};

      // ej2 angular modal
      this.template.show();
      // Adding Next Row from the selected row
      // this.presentModalPopupForNewRecord("Below");
      this.addMode = "Below";
      // get Random Data
      // var data = { taskID: this.getRandomID(), duration: 10 };
      // this.treeGridObj.addRecord(data, idx, "Below");
    } else if (args.item["properties"].id === "addchild") {
      // Paste Child  Row from the selected row

      this.newRecord = {};
      // this.presentModalPopupForNewRecord("Child");
      this.template.show();
      this.addMode = "Child";

      // get Random Data
      // var data = { taskID: this.getRandomID(), duration: 10 };
      // this.treeGridObj.addRecord(data, idx, "Child");
    } else if (args.item["properties"].id == "ranamecolumn") {
      // Rename column field

      this.headerText = args["column"].field;

      // Rename column headerfield

      this.changeHeader = args["column"].headerText;

      // For stying css add to class
      args["rowInfo"].target.setAttribute("class", "headerColumnStyle");

      //  Rename column text and styling property modal
      $("#exampleModal").modal("show");
    } else if (args.item["properties"].id == "deletecolumn") {
      // Delete Column Modal Open Function
      this.deleteColumnDialog();

      // Delete column Field
      this.treeGridobject.deleteField = args["column"].field;

      // Delete column headerText
      this.treeGridobject.deleteHeaderName = args["column"].headerText;

      // Treegrid Refresh
      this.treeGridObj.refresh();
      this.gridObj.refreshColumns();
    } else if (args.item["properties"].id == "addcolumn") {
      // Add new Column Function
      this.onClick();
    } else if (args.item["properties"].id == "filtercolumn") {
      // Filter type modal show
      $("#filterModal").modal("show");
    } else if (args.item["properties"].id == "multisort") {
      // Multi Sorting modal show
      $("#multisorting").modal("show");
    }
  }


  // check box selected items
  getRowData(args: any): void { }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    /* Checked if any row/record is being cut or copied,
    / based on that, it activates / deactivates the paste next and paste child menu items.
    */
    let style =
      this.clipboardData.length === 0
        ? "pointer-events: none; opacity: 0.6"
        : "";
    document.querySelectorAll("li#pastenext")[0].setAttribute("style", style);
    document.querySelectorAll("li#pastechild")[0].setAttribute("style", style);
  }

  //! Edit column Save

  click() {
    if (
      this.changeHeader == null ||
      this.changeHeader == "" ||
      this.changeHeader == undefined
    ) {
      alert("Please fill header name");
      return;
    }
    const column = this.treeGridObj.getColumnByField(this.headerText);
    column.headerText = this.changeHeader;
    // this.treeGridObj.refreshColumns();
    setTimeout(() => {
      this.stylingCell();
    }, 500);

    // this.treeGridObj.getColumnByField(this.headerText)s = alignment;
    // console.log(this.treeGridObj.getColumnByField(columnName))

    // args['rowInfo'].target.setAttribute('class', 'headerColumnStyle');

    $("#exampleModal").modal("hide");
  }

  // ! Set Style

  stylingCell() {
    $(".customcss").css({
      "background-color": this.treeGridobject.columnColor,
      color: this.treeGridobject.columnColorText,
      "font-size": this.treeGridobject.columnColorFontSize,
      "text-align": this.treeGridobject.columnAlign,
    });
  }

  //! custmize cell
  customizeCell(args: QueryCellInfoEventArgs) {
    for (let data in this.newColourColumn) {
      if (this.newColourColumn[data].fieldName == args.column.field) {
        if (this.newColourColumn[data].textAlign == "left") {
          args.cell.setAttribute("style", "text-align:left;");
        } else if (this.newColourColumn[data].textAlign == "right") {
          args.cell.setAttribute("style", "text-align:right;");
        } else if (this.newColourColumn[data].colurs == "red") {
          args.cell.setAttribute("style", "color:red;text-align:center;");
        } else {
          args.cell.setAttribute("style", "color:#336c12");
        }
      }
    }
  }

  //! add new column
  onClick() {
    $("#exampleModalAdd").modal("show");
    this.columnName = null;
  }

  //! get random Id
  public getRandomID(): any {
    const S4 = () => {
      return ((1 + Math.random()) * 0x100) | 0;
    };
    return S4();
  }

  // ! String Id generate

  public getRandomIDString(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }

  //! add new column
  AddColumn() {
    if (this.columnName == null) {
      alert("Please fill column name");
      return;
    }
    this.newColumns = [
      {
        field: this.getRandomIDString(),
        headerText: this.columnName,
        type: "string",
      },
    ];
    if (this.flag) {
      this.newColumns.forEach((Column) => {
        this.treeGridObj.columns.push(Column);
      });
      this.treeGridObj.refreshColumns();
    }
    $("#exampleModalAdd").modal("hide");
  }

  disable() {
    this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false); // enable toolbar items.
  }

  // toolbar click

  toolbarClick(args: Object): void {
    if (args["item"].properties.text === "Paste") {
      for (let data in this.copyObject) {
        this.treeGridObj.addRecord(this.copyObject[data], 10, "Bottom");
      }
      this.copyObject = [];
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);
    }
    if (args["item"].properties.text === "Update") {
      this.flagCut = true;
      this.copyObject = [];
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);
    }
    if (args["item"].properties.text === "Cancel") {
      this.flagCut = true;
      this.copyObject = [];
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);
    }
  }

  // row selected
  rowSelected(args: RowSelectEventArgs) {
    // console.log("args", args);
    // alert("row index: " + " " + (args.row as HTMLTableRowElement).getAttribute('aria-rowindex'));
    // alert("column index: " + " " + args.target.closest('td').getAttribute('aria-colindex'));
  }

  // row deselected and splice of array

  rowDeselected(args: RowDeselectEventArgs) {

  }

  // ! Delete Column

  deleteColumnDialog() {
    $("#exampleModalDelete").modal("show");
  }

  deleteColumn() {
    this.treeGridObj.columns.findIndex((i, x) => {
      if (i.field == this.treeGridobject.deleteField) {
        this.treeGridObj.columns.splice(x, 1);
        $("#exampleModalDelete").modal("hide");
        this.treeGridObj.refreshColumns();
      }
    });
  }

  // ! Multi Sorting Functions Start

  public onClick1(e: MouseEvent): void {
    if (this.taskID.checked) {
      this.treeGridObj.sortByColumn("taskID", "Ascending", true);
    } else {
      this.treeGridObj.grid.removeSortColumn("taskID");
    }
  }

  public onClick2(e: MouseEvent): void {
    if (this.taskName.checked) {
      this.treeGridObj.sortByColumn("taskName", "Ascending", true);
    } else {
      this.treeGridObj.grid.removeSortColumn("taskName");
    }
  }

  public onClick3(e: MouseEvent): void {
    if (this.startDate.checked) {
      this.treeGridObj.sortByColumn("startDate", "Ascending", true);
    } else {
      this.treeGridObj.grid.removeSortColumn("startDate");
    }
  }

  public onClick4(e: MouseEvent): void {
    if (this.duration.checked) {
      this.treeGridObj.sortByColumn("duration", "Ascending", true);
    } else {
      this.treeGridObj.grid.removeSortColumn("duration");
    }
  }

  public sort(args: SortEventArgs): void {
    if (args.requestType === "sorting") {
      for (let columns of this.treeGridObj.getColumns()) {
        for (let sortcolumns of this.treeGridObj.sortSettings.columns) {
          if (sortcolumns.field === columns.field) {
            this.check(sortcolumns.field, true);
            break;
          } else {
            this.check(columns.field, false);
          }
        }
      }
    }
  }

  public check(field: string, state: boolean): void {
    switch (field) {
      case "taskID":
        this.taskID.checked = state;
        break;
      case "taskName":
        this.taskName.checked = state;
        break;
      case "startDate":
        this.startDate.checked = state;
        break;
      case "duration":
        this.duration.checked = state;
        break;
    }
  }

  // ! Multi Sorting Functions End

  // ! Cell alignment

  public onChange(e: ChangeEventArgs): void {
    let columnName: string = <string>e.value;
    let alignment: any =
      this.treeGridObj.getColumnByField(columnName).textAlign;
    this.dropdown3.value = alignment;
  }

  public changeAlignment(e: ChangeEventArgs): void {
    let alignment: any = e.value;
    this.treeGridobject.columnAlign = e.value;
  }

  public saveNewRecord(): void {
    this.treeGridObj.addRecord(
      this.newRecord,
      this.clickedRowIndex,
      <RowPosition>this.addMode
    );
    this.hideAddTaskModal();
  }

  // hide add popup modal

  hideAddTaskModal() {
    // hide add modal
    this.template.hide();
  }

  // delete selected record
  deleteSelectedRecord() {
    this.treeGridObj.getSelectedRows().map((rowItem) => {
      this.treeGridObj.deleteRow(<HTMLTableRowElement>rowItem);
    });

    this.deletetemplate.hide();
  }

  // deletepopupHide
  cancleDeletePopup() {
    this.deletetemplate.hide();
  }
}
