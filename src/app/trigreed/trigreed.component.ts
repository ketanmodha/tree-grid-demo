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
  ITreeData,
} from "@syncfusion/ej2-angular-treegrid";
import { sampleData } from "../data";
import { MenuEventArgs } from "@syncfusion/ej2-navigations";
import { getValue, isNullOrUndefined } from "@syncfusion/ej2-base";
import { BeforeOpenCloseEventArgs } from "@syncfusion/ej2-inputs";
import {
  GridComponent,
  QueryCellInfoEventArgs,
  RowDataBoundEventArgs,
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

  // ! Search Filter
  @ViewChild("taskIDf", { static: false })
  public taskIDf: CheckBoxComponent;
  @ViewChild("taskNamef", { static: false })
  public taskNamef: CheckBoxComponent;
  @ViewChild("startDatef", { static: false })
  public startDatef: CheckBoxComponent;
  @ViewChild("durationf", { static: false })
  public durationf: CheckBoxComponent;
  @ViewChild("pricef", { static: false })
  public pricef: CheckBoxComponent;
  // ! Cell Alignment and other
  public d2data: Object;
  public d3data: Object;
  public d4data: Object;
  public ddlfields: Object;
  public fields: Object;
  @ViewChild("dropdown2", { static: false })
  public dropdown2: DropDownListComponent;
  @ViewChild("dropdown3", { static: false })
  public dropdown3: DropDownListComponent;
  @ViewChild("dropdown4", { static: false })
  public dropdown4: DropDownListComponent;
  public customAttributes: Object;
  treeGridobject: any = {};
  public copiedRecord: boolean = false;

  public directionData: Object[] = [
    { id: "Left", name: "Left" },
    { id: "Right", name: "Right" },
    { id: "Center", name: "Center" },
  ];

  // ej2 angularDialogComponent
  @ViewChild("template", { static: false })
  template: DialogComponent;
  @ViewChild("deletetemplate", { static: false })
  deletetemplate: DialogComponent;
  @ViewChild("addTemplate", { static: false })
  addTemplate: DialogComponent;
  public animationSettings: Object = { effect: 'SlideTop', duration: 400, delay: 0 };
  @ViewChild("deleteColumntemplate", { static: false })
  deleteColumntemplate: DialogComponent;
  @ViewChild("filterColumntemplate", { static: false })
  filterColumntemplate: DialogComponent;
  @ViewChild("multisortingtemplate", { static: false })
  multisortingtemplate: DialogComponent;
  @ViewChild("editcolumntemplate", { static: false })
  editcolumntemplate: DialogComponent;

  // Create element reference for dialog target element.
  @ViewChild("container", { read: ElementRef, static: false })
  container: ElementRef;


  public columnStyle: any = [];

  ngOnInit(): void {
    this.treeGridobject.singleRowSelection = [];
    this.data = sampleData;

    // custom attribut for css
    this.customAttributes = { class: "customcss" };

    // all columns
    this.columns = [
      {
        field: "taskID",
        headerText: "Task Id",
        type: "number",
        visble: true,
        width: 300,
        minWidth: 100,
        maxWidth: 300,
        isFrozen: true,
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


    // toolbar option like column chooser
    // this.toolbarOption = ["ColumnChooser",];

    // selection option like single or multiple
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
      { text: "Freeze Col", target: ".e-headercell", id: "freezecolumnOff", iconCss: "e-icons e-right", },
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

    // sroting settings
    this.sortSettings = {
      columns: [
        { field: "taskID", direction: "Ascending" },
        { field: "taskName", direction: "Ascending" },
      ],
    };

    // edit settings
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Dialog",
      newRowPosition: "Below",
      // showDeleteConfirmDialog: true,
    };

    // edit params
    this.editparams = { params: { format: "n" } };

    // page size
    this.pageSettings = { pageSize: 100 };
    this.filterSettings = { type: 'FilterBar', ignoreAccent: true, mode: 'Immediate' };

    // formate option
    this.formatoption = { type: "dateTime", format: "dd/MM/yyyy hh:mm a" };

    // template options
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

    // fiels like a mode
    this.fields1 = { text: "mode", value: "id" };

    // parent child data
    this.d1data = [
      { id: "Parent", mode: "Parent" },
      { id: "Child", mode: "Child" },
      { id: "Both", mode: "Both" },
      { id: "None", mode: "None" },
    ];

    // fiels like input
    this.ddlfields = { text: "name", value: "id" };

    // fields like input
    this.fields = { text: "name", value: "id" };

    // data of tasks
    (this.d2data = [
      { id: "taskID", name: "Task ID" },
      { id: "taskName", name: "Task Name" },
      { id: "startDate", name: "Start Date" },
      { id: "duration", name: "Duration" },
    ]),

      (this.d3data = [
        { id: "right", name: "Right" },
        { id: "left", name: "Left" },
        { id: "center", name: "Center" },
        { id: "justify", name: "Justify" },
      ]),

      // Data type

      this.d4data = [
        { id: "text", name: "Text" },
        { id: "num", name: "Number" },
        { id: "date", name: "date" },
        { id: "boolean", name: "Boolean" },
      ]
    setTimeout(() => {
      // this.disable();
      document.getElementById("multiselectSingle").style.display = "none";
    }, 200);


  }

  // filter modal change filter type
  change(e: ChangeEventArgs): void {
    let mode: any = <string>e.value;
    this.treeGridObj.filterSettings.hierarchyMode = mode;
    this.treeGridObj.clearFiltering();
    this.dropDownFilter.value = "All";
  }

  // remove column
  removed(args: any) {
    this.gridObj.getColumnByField(args.itemData).isFrozen = false;
    this.gridObj.refreshColumns();
  }

  // select column
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

  // contexManu click
  contextMenuClick(args?: MenuEventArgs): void {
    var idx: any = args["rowInfo"].rowIndex;

    // A row where right click happened
    let row: Element = args["rowInfo"].row;
    this.treeGridobject.deleteRow = row;



    // Get UID of the clicked row
    let uid: string = row && row.getAttribute("data-uid");

    // Get Index of clicked Row
    this.clickedRowIndex = row && parseInt(row.getAttribute("aria-rowindex"));

    // ************************* Row Context Menu ************************ //

    // ****** Delete Row ****** //
    if (args.item["properties"].id === "deleterow") {
      // Delete selected row
      this.deletetemplate.show();

      // ****** MuliSelect Rows ****** //
    } else if (args.item["properties"].id === "multiselectSingle") {
      // Enable Multi Select
      this.selectionOptions = {
        type: "Multiple",
        cellSelectionMode: "Box",
        checkboxMode: "Default",
        mode: "Row",
      };


      // multi select on off
      document.getElementById("multiselect").style.display = "block";

      document.getElementById("multiselectSingle").style.display = "none";

      // ****** Single Select Rows ****** //
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

      // ****** Edit Row ****** //
    } else if (args.item["properties"].id === "editrow") {
      this.treeGridObj.startEdit();

      // ****** Copy Rows ****** //
    } else if (args.item["properties"].id === "copyrows") {
      // Clear clipboard
      this.clipboardData = [];

      // Setting up shouldMove to false as it's a copy operation
      this.shouldMove = false;
      this.copiedRecord = false;

      // remove css when single selection
      if (this.treeGridobject.singleRowSelection.length > 0) {
        this.treeGridobject.singleRowSelection.map((rowItemSingleSelection) => {
          rowItemSingleSelection.removeAttribute("id");
        });
      }

      // Assigning and saving the data to clipboard
      this.treeGridObj.getSelectedRows().map((rowItem) => {
        rowItem.setAttribute("ID", "copyRowBackGround");
        this.treeGridobject.singleRowSelection.push(rowItem)
        let dataUID: string = rowItem.getAttribute("data-uid");
        let data: any = this.treeGridObj.grid.getRowObjectFromUID(dataUID).data;
        if (data) {
          this.clipboardData.unshift(data);
        }
      });

      // ****** Cut Rows ****** //
    } else if (args.item["properties"].id === "cutrows") {
      // Clear clipboard

      // remove css when single selection
      if (this.treeGridobject.singleRowSelection.length > 0) {
        this.treeGridobject.singleRowSelection.map((rowItemSingleSelection) => {
          rowItemSingleSelection.removeAttribute("id");
        });
      }

      // Assigning and saving the data to clipboard
      this.treeGridObj.getSelectedRows().map((rowItem) => {
        rowItem.setAttribute("ID", "copyRowBackGroundCut");
        this.treeGridobject.singleRowSelection.push(rowItem)
        let dataUID: string = rowItem.getAttribute("data-uid");
        let data: any = this.treeGridObj.grid.getRowObjectFromUID(dataUID).data;
        if (data) {
          this.clipboardData.unshift(data);
          // this.clipboardData.unshift(args["rowInfo"]['rowData'])

        }

      });
      // Setting up shouldMove to true as it's a cut operation
      this.shouldMove = true;
      this.copiedRecord = true;

      // ****** Paste Next Rows ****** //
    } else if (args.item["properties"].id === "pastenext") {

      if (this.clipboardData.length > 0) {
        for (let data in this.clipboardData) {
          let record = this.shouldMove
            ? this.clipboardData[data]
            : Object.assign({}, this.clipboardData[data]);

          if (!this.shouldMove) record.taskID = this.getRandomID();

          if (this.copiedRecord) {
            this.treeGridObj.reorderRows([record.index], args["rowInfo"]['rowData'].index, "below");

          }
          else {
            this.treeGridObj.addRecord(record, idx, "Below");
          }
        }
      }
      if (this.shouldMove) this.clipboardData = [];

      // ****** Paste Child Rows ****** //
    } else if (args.item["properties"].id === "pastechild") {
      if (this.clipboardData.length > 0) {
        for (let data in this.clipboardData) {
          let record = this.shouldMove
            ? this.clipboardData[data]
            : Object.assign({}, this.clipboardData[data]);
          if (!this.shouldMove) record.taskID = this.getRandomID();

          if (this.copiedRecord) {
            this.treeGridObj.reorderRows([record.index], args["rowInfo"]['rowData'].index, "child");
          }
          else {
            this.treeGridObj.addRecord(record, idx, "Child");

          }
          // After cut row then paste next remove cut row
        }
      }

      console.log(this.data)

      if (this.shouldMove) this.clipboardData = [];

      // ****** Add Next Rows ****** //
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

      // ****** Add Child Rows ****** //
    } else if (args.item["properties"].id === "addchild") {
      // Paste Child  Row from the selected row

      this.newRecord = {};
      // this.presentModalPopupForNewRecord("Child");
      this.template.show();
      this.addMode = "Child";

      // get Random Data
      // var data = { taskID: this.getRandomID(), duration: 10 };
      // this.treeGridObj.addRecord(data, idx, "Child");


      // ************************* Column Context Menu ************************ //
      // ****** Rename column ****** //
    } else if (args.item["properties"].id == "ranamecolumn") {
      // Rename column field

      this.headerText = args["column"].field;

      // Rename column headerfield

      this.changeHeader = args["column"].headerText;

      // For stying css add to class
      // args["rowInfo"].target.setAttribute("class", "headerColumnStyle");

      //  Rename column text and styling property modal
      // $("#exampleModal").modal("show");
      this.editcolumntemplate.show();


      // ****** Delete Column ****** //
    } else if (args.item["properties"].id == "deletecolumn") {


      // Delete column Field
      this.treeGridobject.deleteField = args["column"].field;

      // Delete column headerText
      this.treeGridobject.deleteHeaderName = args["column"].headerText;

      // Delete Column Modal Open Function
      this.deleteColumntemplate.show();


      // // Treegrid Refresh
      // this.treeGridObj.refresh();
      // this.gridObj.refreshColumns();

      // ****** Add Column  ****** //
    } else if (args.item["properties"].id == "addcolumn") {

      // Add new Column show
      this.addTemplate.show();
      this.columnName = null;

      // ****** Filter Column  ****** //
    } else if (args.item["properties"].id == "filtercolumn") {
      // Filter type modal show

      this.filterColumntemplate.show();

      // ****** Multi Sort  ****** //
    } else if (args.item["properties"].id == "multisort") {
      // Multi Sorting modal show
      this.multisortingtemplate.show()
      $("#multisorting").modal("show");

      // ****** column chooser popup  ****** //
    } else if (args.item["properties"].id == "selectcolumn") {
      // open column chooser on click event
      this.treeGridObj.columnChooserModule.openColumnChooser();

      // ***** column freez ****** //
    } else if (args.item["properties"].id == "freezecolumn") {
      if (this.treeGridObj.getColumns().length - 1 > this.treeGridObj.getFrozenColumns()) {
        for (let i = 0; i < this.treeGridObj.getVisibleColumns().length; i++) {
          if (args['column'].field == this.treeGridObj.getVisibleColumns()[i].field) {
            this.treeGridObj.getVisibleColumns()[i].isFrozen = true;
          }
        }
        this.treeGridObj.refreshColumns();
      }

      // ******* column freez Off **** //
    } else if (args.item["properties"].id == "freezecolumnOff") {
      console.log("args>>>>>>>>", args)
      this.treeGridObj.getColumnByField(args['column'].field).isFrozen = false;
      this.treeGridObj.refreshColumns();
    }
  }


  // check box selected items
  getRowData(args: any): void { }

  // context menu open 
  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {
    console.log("arg", arg)
    if (arg['column'].freezeTable == 'frozen-left') {
      document.getElementById("freezecolumn").style.display = "none";
      document.getElementById("freezecolumnOff").style.display = "block";
    } else if (arg['column'].freezeTable == 'movable') {
      document.getElementById("freezecolumn").style.display = "block";
      document.getElementById("freezecolumnOff").style.display = "none";

    }
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

  // change Data type 
  changeDatatype(e: ChangeEventArgs): void {
    console.log("e", e)
    this.treeGridobject.dataType = e.itemData;
    console.log("this.treeGridobject.dataType", this.treeGridobject.dataType)
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
    column.type = 'number';
    if (column.field == "taskID") {
      this.treeGridobject.taskIdStyle = true;
      this.treeGridobject.taskIdStyleCss =
      {
        'taskID': `background-color: ${this.treeGridobject.columnColor};
          color:${this.treeGridobject.columnColorText};
          font-size:${this.treeGridobject.columnColorFontSize + 'px'};
          text-align:${this.treeGridobject.columnAlign}`
      }

    } else if (column.field == "taskName") {
      this.treeGridobject.taskNameStyle = true;
      this.treeGridobject.taskNameStyleCss =
      {
        'taskName': `background-color: ${this.treeGridobject.columnColor};
          color:${this.treeGridobject.columnColorText};
          font-size:${this.treeGridobject.columnColorFontSize + 'px'};
          text-align:${this.treeGridobject.columnAlign}`
      }

    } else if (column.field == "startDate") {
      this.treeGridobject.startDateStyle = true;

      this.treeGridobject.startDateStyleCss =
      {
        'startDate': `background-color: ${this.treeGridobject.columnColor};
          color:${this.treeGridobject.columnColorText};
          font-size:${this.treeGridobject.columnColorFontSize + 'px'};
          text-align:${this.treeGridobject.columnAlign}`
      }
    } else if (column.field == "duration") {
      this.treeGridobject.durationStyle = true;

      this.treeGridobject.durationStyleCss =
      {
        'duration': `background-color: ${this.treeGridobject.columnColor};
          color:${this.treeGridobject.columnColorText};
          font-size:${this.treeGridobject.columnColorFontSize + 'px'};
          text-align:${this.treeGridobject.columnAlign}`
      }
    }



    console.log("column", column.type = 'number')
    this.treeGridObj.refreshColumns();

    console.log("this.data>>>>>>.", this.data)


    // this.treeGridObj.getColumnByField(this.headerText)s = alignment;
    // console.log(this.treeGridObj.getColumnByField(columnName))

    // args['rowInfo'].target.setAttribute('class', 'headerColumnStyle');

    this.editcolumntemplate.hide()
    // $("#exampleModal").modal("hide");
  }


  // rowDataBound(args: RowDataBoundEventArgs) {
  //   console.log("args", args)
  //   if (!(args.data as ITreeData).hasChildRecords) {
  //     (args.row as HTMLElement).style.backgroundColor = 'green';
  //     args.data['taskID'] = this.getRandomID();
  //     args.data['taskData']['taskID'] = args.data['taskID']
  //     console.log("args.data['taskID']??>>", args.data['taskID'])
  //     console.log("args.data['taskData']['taskID']>>>", args.data['taskData']['taskID'])
  //   }
  // }

  //! custmize cell
  customizeCell(args: QueryCellInfoEventArgs) {
    if (args.column.field === "taskID" && this.treeGridobject.taskIdStyle == true) {
      // args.cell.setAttribute(
      //   'style',
      //   `background-color: ${this.treeGridobject.columnColor};
      //   color:${this.treeGridobject.columnColorText};
      //   font-size:${this.treeGridobject.columnColorFontSize + 'px'};
      //   text-align:${this.treeGridobject.columnAlign}`);

      args.cell.setAttribute('style', this.treeGridobject.taskIdStyleCss.taskID);

      // taskName css
    } else if (args.column.field === "taskName" && this.treeGridobject.taskNameStyle == true) {
      args.cell.setAttribute('style', this.treeGridobject.taskNameStyleCss.taskName);

      // startDate Css
    } else if (args.column.field === "startDate" && this.treeGridobject.startDateStyle == true) {
      args.cell.setAttribute('style', this.treeGridobject.startDateStyleCss.startDate);

      // duresion Css
    } else if (args.column.field === "duration" && this.treeGridobject.durationStyle == true) {
      args.cell.setAttribute('style', this.treeGridobject.durationStyleCss.duration);
      console.log("aRGS>>>>>>>>>>>>>", args);

    }
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
    this.addTemplate.hide();
  }

  // add dialog hide
  addDialgHide(parameter) {
    if (parameter == "deleteColumn") {
      this.deleteColumntemplate.hide();
    } else if (parameter == "editColumn") {
      this.editcolumntemplate.hide();
    }
    else {
      this.addTemplate.hide();
    }
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

  // delete column

  deleteColumn() {

    this.treeGridObj.columns.findIndex((i, x) => {
      if (this.treeGridobject.deleteField) {
        if (i.field == this.treeGridobject.deleteField) {
          this.treeGridObj.columns.splice(x, 1);
          this.treeGridObj.refreshColumns();
          this.deleteColumntemplate.hide();
          this.treeGridobject.deleteField = null
        }
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


  // ! Multi Sorting Functions Start

  public onClick11(e: MouseEvent): void {
    if (this.taskIDf.checked) {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'none';
    } else {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'contents';
    }
  }

  public onClick22(e: MouseEvent): void {
    if (this.taskNamef.checked) {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'none';
    } else {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'contents';
    }
  }

  public onClick33(e: MouseEvent): void {
    if (this.startDatef.checked) {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'none';
    } else {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'contents';
    }
  }

  public onClick44(e: MouseEvent): void {
    if (this.durationf.checked) {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'none';
    } else {
      // this.treeGridObj.getHeaderTable().querySelector('.e-filterdiv').style.display = 'contents';
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

  selectfreez(args: any): void {
    console.log("select", args)
    if (this.treeGridObj.getColumns().length - 1 > this.treeGridObj.getFrozenColumns()) {
      for (let i = 0; i < this.treeGridObj.getVisibleColumns().length; i++) {
        if (args['itemData'].id == this.treeGridObj.getVisibleColumns()[i].field) {
          this.treeGridObj.getVisibleColumns()[i].isFrozen = true;
        }
      }
      this.treeGridObj.refreshColumns();
    } else {
      args.cancel = true;
    }
  }
}
