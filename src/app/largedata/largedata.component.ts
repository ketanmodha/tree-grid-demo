import { Component } from '@angular/core';
import { OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MenuItemModel, ContextMenu } from '@syncfusion/ej2-navigations';
import { dragData, sampleData } from "../data"

import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
//import { ContextMenuModule } from "@syncfusion/ej2-angular-navigations";
import {
    TreeGridComponent,
    RowDDService,
    SelectionService,
    EditService,
    PageService,
    CommandColumnService,
    ContextMenuService
} from "@syncfusion/ej2-angular-treegrid";
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { AnyKindOfDictionary } from 'lodash';
import { ButtonArgs } from '@syncfusion/ej2-popups';
import { MouseEventArgs } from '@syncfusion/ej2-base';
import { ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';

@Component({
    selector: 'app-largedata',
    templateUrl: './largedata.component.html',
    styleUrls: ['./largedata.component.css'],
})
export class LargedataComponent implements OnInit {

    public data: Object[] = [];
    public gridData: Object[] = [];
    public pageSetting: Object;
    public selectOptions: Object;
    public treeColumns: any;
    public editSettings: EditSettingsModel;
    public contextMenuItems: Object[];
    public tree: TreeGridComponent;
    public isCommandClick: boolean = false;

    @ViewChild("treegrid", { static: false })
    public treegrid: TreeGridComponent;

    ngOnInit(): void {


        this.data = sampleData;
        this.selectOptions = { type: "Multiple" };
        this.treeColumns = this.createTreeGridColumns();
        this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Row' };
        this.contextMenuItems = [
            { text: "Add Child", target: ".e-content", id: "addchild" },
            { text: "Copy", target: ".e-content", id: "copy" },
        ];
    }
    btnclick(e: MouseEventArgs) {
        var element: EventTarget = e.target;
        var ev: Event = document.createEvent('HTMLEvents');
        ev['pageX'] = e.pageX, ev['pageY'] = e.pageY;
        ev.initEvent("contextmenu", true, false)
        element.dispatchEvent(ev);
    }
    // contextMenuOpen(args: BeforeOpenCloseEventArgs) {
    //   if (!(<HTMLElement>args.event.target).classList.contains('e-btn-icon')) {
    //     args.cancel = true;
    //   }

    // }
    contextMenuClick(args: ContextMenuClickEventArgs): void {
        var idx: any = args.rowInfo.rowIndex
        if (args.item.id === 'addchild') {
            var data = { taskID: 88, priority: "high" };
            this.treegrid.addRecord(data, idx, "Below");
        }

        else if (args.item.id === 'copy') {
            this.treegrid.selectRow(idx);

            this.treegrid.copy();
        }
    }
    reorder(args) {
        var data = { taskID: 88, priority: "high" };
        this.treegrid.addRecord(data, 2, "Below");
    }

    private createTreeGridColumns() {
        return [
            {
                field: "taskID",
                headerText: "Task ID",
                isPrimaryKey: "true",
                editType: "defaultedit",
                customAttributes: { class: "customcss" }
            },

            {
                field: "startDate",
                headerText: "Start Date",
                editType: "defaultedit"
            },
            {
                field: "priority",
                headerText: "Priority",
                editType: "defaultedit"
            },
            {
                headerText: "action",
                commands: [
                    {
                        buttonOption: {
                            iconCss: "e-icons e-detail",
                            cssClass: "e-flat",

                            click: this.btnclick.bind(this)
                        }
                    }
                ]
            }
        ];
    }

}
