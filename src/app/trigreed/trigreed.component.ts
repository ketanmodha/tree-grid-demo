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
  public contextMenuItems: Object[];
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

  ngOnInit(): void {
    this.data = sampleData;
    this.customAttributes = { class: "customcss" };
    this.columns = [
      { field: "taskID", headerText: "Task Id", visble: true, isFrozen: true },
      {
        field: "taskName",
        headerText: "Task Name",
        visble: true,
        isFrozen: true,
      },
      {
        field: "startDate",
        headerText: "Start Date",
        visble: true,
        format: "yMd",
      },
      {
        field: "duration",
        headerText: "Duration",
        visble: true,
        filterbars: this.templateOptions,
      },
    ];

    this.toolbarOption = ["ColumnChooser"];
    this.selectionOptions = {
      cellSelectionMode: "Box",
      type: "Multiple",
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
      { text: "Delete Row", target: ".e-content", id: "deleterow" },
      'Edit',
      { text: "Edit Row", target: ".e-content", id: "editrow" },
      { text: "Multi Select", target: ".e-content", id: "multiselect" },
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
      mode: "Row",
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
        console.log("TreeGrid", this.toolbarOption);
      }, 200);
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
    console.log("args", args);
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

  contextMenuClick(args?: MenuEventArgs): void {
    var idx: any = args['rowInfo'].rowIndex;
    // A row where right click happened
    let row: Element = args["rowInfo"].row;

    // Get UID of the clicked row
    let uid: string = row && row.getAttribute("data-uid");

    // Get Index of clicked Row
    let clickedRowIndex: number =
      row && parseInt(row.getAttribute("aria-rowindex"));

    if (args.item["properties"].id === "deleterow") {
      // Delete selected row
      this.treeGridObj.deleteRow(<HTMLTableRowElement>row);
    } else if (args.item["properties"].id === "copyrows") {
      // Clear clipboard
      this.clipboardData = [];

      // Setting up shouldMove to false as it's a copy operation
      this.shouldMove = false;

      // Assigning and saving the data to clipboard
      let copiedObject = this.treeGridObj.grid.getRowObjectFromUID(uid).data;
      this.treeGridobject.copiedObject = copiedObject;
      this.clipboardData.push(copiedObject);
    } else if (args.item["properties"].id === "cutrows") {
      // Clear clipboard
      this.clipboardData = [];

      // Setting up shouldMove to true as it's a cut operation
      this.shouldMove = true;

      // Assigning and saving the data to clipboard
      let copiedObject = this.treeGridObj.grid.getRowObjectFromUID(uid).data;
      this.treeGridobject.copiedObject = copiedObject;
      this.clipboardData.push(copiedObject);
      this.treeGridObj.deleteRow(<HTMLTableRowElement>row);

    } else if (args.item["properties"].id === "pastenext") {
      // this.treeGridObj.deleteRow(<HTMLTableRowElement>row);

      // Increment the row index, as we will be adding the copied record next to the clicked record
      // clickedRowIndex++;

      // Insert row to grid
      this.treeGridObj.addRecord(this.treeGridobject.copiedObject, idx, "Below");
      // if (clickedRowIndex >= 0) {
      //   this.clipboardData.map((rowItem) => {
      //     this.treeGridObj.addRecord(rowItem, clickedRowIndex, "Below");
      //   });
      // }

      // Clear clipboard
      if (this.shouldMove) {
        this.clipboardData = [];
        this.shouldMove = false;
      }
    } else if (args.item["properties"].id === "pastechild") {
      // Increment the row index, as we will be adding the copied record next to the clicked record
      // clickedRowIndex++;

      this.treeGridObj.addRecord(this.treeGridobject.copiedObject, idx, "Child");

      if (this.shouldMove) {
        this.clipboardData = [];
        this.shouldMove = false;
      }

      // Move row to grid
      // if (clickedRowIndex >= 0) {
      //   this.clipboardData.map((rowItem) => {
      //     this.treeGridObj.addRecord(rowItem, clickedRowIndex, "Child");
      //   });

      //   // Clear clipboard
      //   if (this.shouldMove) this.clipboardData = [];
      //   this.shouldMove = false;
      // }
    } else if (args.item['properties'].id === 'addnext') {
      // Adding Next Row from the selected row

      // get Random Data
      var data = { taskID: this.getRandomID(), duration: 10 };
      this.treeGridObj.addRecord(data, idx, "Below");

    } else if (args.item['properties'].id === 'addchild') {
      // Paste Child  Row from the selected row

      // get Random Data
      var data = { taskID: this.getRandomID(), duration: 10 };
      this.treeGridObj.addRecord(data, idx, "Child");

    }

    else if (args.item["properties"].id == "ranamecolumn") {
      console.log("args", args);
      this.headerText = args["column"].field;
      this.changeHeader = args["column"].headerText;
      args["rowInfo"].target.setAttribute("class", "headerColumnStyle");
      $("#exampleModal").modal("show");
    } else if (args.item["properties"].id == "deletecolumn") {
      this.deleteColumnDialog();
      this.treeGridobject.deleteField = args["column"].field;
      this.treeGridobject.deleteHeaderName = args["column"].headerText;
      this.treeGridObj.refresh();
      this.gridObj.refreshColumns();
    } else if (args.item["properties"].id == "setColourgreen") {
      this.newColourColumn.push({
        fieldName: args["column"].field,
        colurs: "green",
      });
      console.log(this.newColourColumn);
      this.treeGridObj.refresh();
    } else if (args.item["properties"].id == "setColourred") {
      this.newColourColumn.push({
        fieldName: args["column"].field,
        colurs: "red",
      });
      this.treeGridObj.refresh();
    } else if (args.item["properties"].id == "right") {
      this.newColourColumn.push({
        fieldName: args["column"].field,
        textAlign: "right",
      });
      this.treeGridObj.refresh();
    } else if (args.item["properties"].id == "left") {
      this.newColourColumn.push({
        fieldName: args["column"].field,
        textAlign: "left",
      });
      this.treeGridObj.refresh();
    } else if (args.item["properties"].id == "copyrows") {
      console.log("Args:", args);
      this.flagCut = false;
      this.copyNewObj.push(args["rowInfo"].rowData["taskData"]);
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], true); // enable toolbar items.
    } else if (args.item["properties"].id == "above") {
      for (let data in this.copyNewObj) {
        this.treeGridObj.addRecord(
          this.copyNewObj[data],
          this.globleIndex,
          "Top"
        );
      }
      this.treeGridObj.addRecord(this.copyNewObj, this.globleIndex, "Top");
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], true);
    } else if (args.item["properties"].id == "below") {
      this.treeGridObj.addRecord(this.copyNewObj, 0, "Below");
    } else if (args.item["properties"].id == "Cut") {
      this.flagCut = false;
      for (let cut in this.cutObject) {
        this.treeGridObj.deleteRow(<HTMLTableRowElement>this.cutObject[cut]);
      }
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], true);
    } else if (args.item["properties"].id == "addcolumn") {
      this.onClick();
    } else if (args.item["properties"].id == "freezecolumn") {
    } else if (args.item["properties"].id == "filtercolumn") {
      $("#filterModal").modal("show");
    } else if (args.item["properties"].id == "multisort") {
      $("#multisorting").modal("show");
    }
  }

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
    console.log(column);
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
  public getRandomID(): string {
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
        field: this.getRandomID(),
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
    this.globleIndex = args.data["index"];
    if (this.flagCut == true) {
      if (args["isInteracted"] == true) {
        if (args["rowIndexes"] == undefined || args["rowIndexes"].length > 0) {
          this.copyObject.push(args.data["taskData"]);
          this.cutObject.push(args.row);
        }
      } else if (args["isInteracted"] == false) {
        if (args["target"] == null && !args["rowIndexes"]) {
          this.copyObject.push(args.data["taskData"]);
          this.cutObject.push(args.row);
        } else {
          for (let datas in args.data) {
            this.copyObject.push(args.data[datas].taskData);
          }
          this.copyObject = this.copyObject.filter((res, index) => {
            const _thing = JSON.stringify(res);
            return (
              index ===
              this.copyObject.findIndex((obj) => {
                return JSON.stringify(obj) === _thing;
              })
            );
          });
          this.cutObject = args.row;
        }
      }
    }
  }

  // row deselected

  rowDeselected(argss: RowDeselectEventArgs) {
    if (argss["isInteracted"] == true) {
      if (argss["rowIndexes"] == undefined || argss["rowIndexes"].length > 0) {
        const index = this.copyObject.indexOf(argss.data["taskData"]);
        if (index >= 0 || index == -1) {
          this.copyObject.splice(index, 1);
        }
        const indexx = this.cutObject.indexOf(argss.row);
        if (indexx >= 0) {
          this.cutObject.splice(index, 1);
        }
      }
    } else if (argss["isInteracted"] == false) {
    }
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
    console.log(
      "this.treeGridobject.columnAlign",
      this.treeGridobject.columnAlign
    );
    // this.treeGridObj.getColumnByField(columnName).textAlign = alignment;
    // console.log(this.treeGridObj.getColumnByField(columnName))
    // this.treeGridObj.refreshColumns();
  }
}
