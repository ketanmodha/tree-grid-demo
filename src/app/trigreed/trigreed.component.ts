import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems, SelectionSettingsModel, SortSettingsModel, PageSettingsModel, EditSettingsModel, ResizeService, ContextMenuService, EditService, ExcelExportService, PageService, PdfExportService, ReorderService, RowDDService, SelectionService, SortService, ToolbarService, TreeGridComponent, FilterSettingsModel, Column } from '@syncfusion/ej2-angular-treegrid';
import { sampleData } from '../datasource';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { getValue, isNullOrUndefined } from '@syncfusion/ej2-base';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { GridComponent, QueryCellInfoEventArgs, RowDeselectEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

declare var $: any;

@Component({
  selector: 'app-trigreed',
  templateUrl: './trigreed.component.html',
  styleUrls: ['./trigreed.component.css'],
  providers: [ResizeService, ReorderService, RowDDService, SelectionService, SortService, ResizeService, PageService, EditService, ExcelExportService, PdfExportService, ContextMenuService, ToolbarService]
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
  @ViewChild('treeGridObj', { static: false })
  public treeGridObj: TreeGridComponent;
  public formatoption: Object;

  public columns: Object[];

  headerText: string;
  changeHeader: string;
  columnName: string;

  @ViewChild('grid', { static: false })
  gridObj: GridComponent;

  public flag = true;
  public newColumns;
  public newColourColumn: any = [];

  public copyObject: any = [];
  public cutObject: any = [];
  flagCut: boolean = true;

  copyNewObj:any = [];
  globleIndex:any;

  ngOnInit(): void {
    this.data = sampleData;
    this.columns = [{ field: "taskID", headerText: 'Task Id', visble: true },
    { field: "taskName", headerText: 'Task Name', visble: true },
    { field: "startDate", headerText: 'Start Date', visble: true, format: 'yMd' },
    { field: "duration", headerText: 'Duration', visble: true }];
    this.toolbarOption = ['Search', 'Update', 'Cancel', 'Paste'];
    this.selectionOptions = { cellSelectionMode: 'Box', type: 'Multiple', mode: 'Row' };
    this.contextMenuItems = [
      {
        text: 'Edit Col',
        target: '.e-headercell',
        id: 'editcolumn'
      },
      {
        text: 'New Col',
        target: '.e-headercell',
        id: 'addcolumn'
      },
      {
        text: 'Del Col',
        target: '.e-headercell',
        id: 'deletecolumn'
      }
      ,{
        text: 'Choose Col',
        target: '.e-headercell',
        id: 'selectcolumn'
      },
      {
        text: 'Freeze Col',
        target: '.e-headercell',
        id: 'freezecolumn'
      },
      {
        text: 'Filter Col',
        target: '.e-headercell',
        id: 'filtercolumn'
      },
      {
        text: 'Multi Sort',
        target: '.e-headercell',
        id: 'multisort'
      },
      {
        text: 'Add Next',
        target: '.e-content',
        id: 'addnext'
      },
      {
        text: 'Add Child',
        target: '.e-content',
        id: 'addchild'
      },
      {
        separator: true,
        target: '.e-content'
      },
      {
        text: 'Delete Row',
        target: '.e-content',
        id: 'deleterow'
      },
      {
        text: 'Edit Row',
        target: '.e-content',
        id: 'editrow'
      },
      {
        text: 'Multi Select',
        target: '.e-content',
        id: 'multiselect'
      },
      {
        separator: true,
        target: '.e-content'
      },
      {
        text: 'Copy Rows',
        target: '.e-content',
        id: 'copyrows'
      },
      {
        text: 'Cut Rows',
        target: '.e-content',
        id: 'cutrows'
      },
      {
        text: 'Paste Next',
        target: '.e-content',
        id: 'pastenext'
      },
      {
        text: 'Paste Child',
        target: '.e-content',
        id: 'pastechild'
      }
    ]
    // this.contextMenuItems = [
    //   'AutoFit',
    //   'AutoFitAll',
    //   'SortAscending',
    //   'SortDescending',
    //   'Edit', 'Delete',
    //   'Save', 'Cancel','AddRow',
    //   { text: 'Cut', target: '.e-content', id: 'Cut' },
    //   { text: 'Copy', target: '.e-content', id: 'copy' },
    //   {
    //     text: 'Paste',
    //     target: '.e-content',
    //     items: [
    //       { text: 'Above', id: 'above'},
    //       { text: 'Belov', id: 'below'},
    //       { text: 'child', id: 'child'},
    //     ]
    //   },
    //   // { text: 'Paste: Below', target: '.e-content', id: 'pastebelow' },
    //   // { text: 'Paste: Above', target: '.e-content', id: 'pasteabove' },
    //   {
    //     separator: true,
    //     target: '.e-headercell',
    //   },
    //   { text: 'Rename this column', target: '.e-headercell', id: 'ranamecolumn' },
    //   {
    //     separator: true,
    //     target: '.e-headercell',
    //   },
    //   { text: 'Delete this column', target: '.e-headercell', id: 'deletecolumn' },
    //   {
    //     separator: true,
    //     target: '.e-headercell',
    //   },
    //   { text: 'Colour: Green', target: '.e-headercell', id: 'setColourgreen' },
    //   { text: 'Colour: Red', target: '.e-headercell', id: 'setColourred' },
    //   { text: 'Align: Right', target: '.e-headercell', id: 'right' },
    //   { text: 'Align: Left', target: '.e-headercell', id: 'left' },
    // ];
    this.sortSettings = {
      columns: [
        { field: "taskName", direction: "Ascending" },
        { field: "taskID", direction: "Descending" }
      ]
    };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch',newRowPosition: 'Child' };
    this.editparams = { params: { format: 'n' } };
    this.pageSettings = { pageSize: 100 };
    this.filterSettings = { type: 'Menu', ignoreAccent: true };
    this.formatoption = { type: 'dateTime', format: 'dd/MM/yyyy hh:mm a' }

    setTimeout(() => {
      this.disable();
      console.log("TreeGrid",this.toolbarOption)
    }, 200)
  }


  contextMenuClick(args?: MenuEventArgs): void {
    console.log("args",args);
    if (args.item['properties'].id == 'ranamecolumn') {
      this.headerText = args['column'].field;
      this.changeHeader = args['column'].headerText
      $('#exampleModal').modal('show');
    } else if (args.item['properties'].id == 'deletecolumn') {
      // this.treeGridObj.hideColumns(key:args['column'].field)
      // this.columns = this.columns.filter(element => {
      //   if (args['column'].headerText == element['headerText']) {
      //     element['visble'] = false;

      //   }
      //   return this.columns;
      // });
      // this.data = this.columns
      // this.treeGridObj.setProperties({
      //   columnModel: this.columns
      // }, false);
      this.treeGridObj.refresh();
      this.gridObj.refreshColumns();
    }

    else if (args.item['properties'].id == 'setColourgreen') {
      this.newColourColumn.push({
        fieldName: args['column'].field,
        colurs: 'green'
      });
      this.treeGridObj.refresh();
      
    } else if (args.item['properties'].id == 'setColourred') {
      this.newColourColumn.push({
        fieldName: args['column'].field,
        colurs: 'red'
      });
      this.treeGridObj.refresh();
    }

    else if (args.item['properties'].id == 'right') {
      this.newColourColumn.push({
        fieldName: args['column'].field,
        textAlign: "right"
      });
      this.treeGridObj.refresh();
    }

    else if (args.item['properties'].id == 'left') {
      this.newColourColumn.push({
        fieldName: args['column'].field,
        textAlign: "left"
      });
      this.treeGridObj.refresh();

    } else if (args.item['properties'].id == 'copy') {
      this.flagCut = false;
      this.copyNewObj.push(args['rowInfo'].rowData['taskData']);
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], true);// enable toolbar items.

    } else if (args.item['properties'].id == 'above') {
      for (let data in this.copyNewObj) {
        this.treeGridObj.addRecord(this.copyNewObj[data], this.globleIndex, 'Top');
      }
      this.treeGridObj.addRecord(this.copyNewObj,this.globleIndex, 'Top');
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], true);

      // this.treeGridObj.refresh();

    } else if (args.item['properties'].id == 'below') {
      this.treeGridObj.addRecord(this.copyNewObj, 0, 'Below');

    } else if (args.item['properties'].id == 'child') {
      this.treeGridObj.addRecord(this.copyNewObj, 0, 'Child');

    }
    else if (args.item['properties'].id == 'Cut') {
      this.flagCut = false;
      for (let cut in this.cutObject) {
        this.treeGridObj.deleteRow(<HTMLTableRowElement>(this.cutObject[cut]));
      }
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], true);

    }
  }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void {

  }

  click() {
    if (this.changeHeader == null || this.changeHeader == '' || this.changeHeader == undefined) {
      alert("Please fill header name");
      return
    }
    const column = this.treeGridObj.getColumnByField(this.headerText);
    column.headerText = this.changeHeader;
    this.treeGridObj.refreshColumns();
    $('#exampleModal').modal('hide');
  }

  // custmize cell
  customizeCell(args: QueryCellInfoEventArgs) {
    for (let data in this.newColourColumn) {
      if (this.newColourColumn[data].fieldName == args.column.field) {
        if (this.newColourColumn[data].textAlign == 'left') {
          args.cell.setAttribute('style', 'text-align:left;');
        }
        else if (this.newColourColumn[data].textAlign == 'right') {
          args.cell.setAttribute('style', 'text-align:right;');
        }
        else if (this.newColourColumn[data].colurs == 'red') {
          args.cell.setAttribute('style', 'color:red;text-align:center;');
        } else {
          args.cell.setAttribute('style', 'color:#336c12;text-align:center;');
        }
      }
    }
  }

  // add new column
  onClick() {
    $('#exampleModalAdd').modal('show');
    this.columnName = null;
  }

  // get random Id
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }

  // add new column
  AddColumn() {
    if (this.columnName == null) {
      alert("Please fill column name");
      return
    }
    this.newColumns = [
      {
        field: this.getRandomID(),
        headerText: this.columnName,
        type: "string"
      },
    ]
    if (this.flag) {
      this.newColumns.forEach(Column => {
        this.treeGridObj.columns.push(Column);
      });
      this.treeGridObj.refreshColumns();
    }
    $('#exampleModalAdd').modal('hide');
  }

  disable() {
    this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);// enable toolbar items.
  }

  // toolbar click

  toolbarClick(args: Object): void {
    if (args['item'].properties.text === 'Paste') {
      for (let data in this.copyObject) {
        this.treeGridObj.addRecord(this.copyObject[data], 10, 'Bottom');
      }
      this.copyObject = [];
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);
    }
    if (args['item'].properties.text === 'Update') {
      this.flagCut = true;
      this.copyObject = [];
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);
    }
    if (args['item'].properties.text === 'Cancel') {
      this.flagCut = true;
      this.copyObject = [];
      this.cutObject = [];
      this.treeGridObj.toolbarModule.enableItems(["_gridcontrol_Paste"], false);
    }
  }

  // row selected
  rowSelected(args: RowSelectEventArgs) {
    this.globleIndex = args.data['index'];
    if (this.flagCut == true) {
      if (args['isInteracted'] == true) {
        if (args['rowIndexes'] == undefined || args['rowIndexes'].length > 0) {
          this.copyObject.push(args.data['taskData']);
          this.cutObject.push(
            args.row
          );
        }
      } else if (args['isInteracted'] == false) {
        if (args['target'] == null && !args['rowIndexes']) {
          this.copyObject.push(args.data['taskData']);
          this.cutObject.push(
            args.row
          );
        } else {
          for (let datas in args.data) {
            this.copyObject.push(args.data[datas].taskData);
          }
          this.copyObject = this.copyObject.filter((res, index) => {
            const _thing = JSON.stringify(res);
            return index === this.copyObject.findIndex(obj => {
              return JSON.stringify(obj) === _thing
            })
          });
          this.cutObject = args.row;
        }
      }

    }
  }

  // row deselected

  rowDeselected(argss: RowDeselectEventArgs) {
    if (argss['isInteracted'] == true) {
      if (argss['rowIndexes'] == undefined || argss['rowIndexes'].length > 0) {
        const index = this.copyObject.indexOf(argss.data['taskData']);
        if (index >= 0 || index == -1) {
          this.copyObject.splice(index, 1);
        }
        const indexx = this.cutObject.indexOf(argss.row);
        if (indexx >= 0) {
          this.cutObject.splice(index, 1);
        }
      }
    } else if (argss['isInteracted'] == false) {

    }
  }

}


