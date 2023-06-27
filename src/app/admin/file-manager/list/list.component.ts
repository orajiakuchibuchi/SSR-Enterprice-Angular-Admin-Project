import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user/user.service';
import { CheckListDatabaseService, DocumentNodeFlatNode } from 'src/app/shared/services/client/check-list-database.service';
import { DocumentNode } from 'src/app/shared/models/Index';

interface Section {
  id: any;
  name: string;
  updated: Date;
  status: 'unsaved' | 'saved' | 'trash';
  type: 'file' | 'folder';
}

@Component({
  selector: 'app-file-manager-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

   /** Map from flat node to nested node. This helps us finding the nested node to be modified */
   flatNodeMap = new Map<DocumentNodeFlatNode, DocumentNode>();

   /** Map from nested node to flattened node. This helps us to keep the same object for selection */
   nestedNodeMap = new Map<DocumentNode, DocumentNodeFlatNode>();
 
   /** A selected parent node to be inserted */
   selectedParent: DocumentNodeFlatNode | null = null;
 
   /** The new item's name */
   newItemName = '';
 
   treeControl: FlatTreeControl<DocumentNodeFlatNode>;
 
   treeFlattener: MatTreeFlattener<DocumentNode, DocumentNodeFlatNode>;
 
   dataSource: MatTreeFlatDataSource<DocumentNode, DocumentNodeFlatNode>;
 
   /** The selection for checklist */
   checklistSelection = new SelectionModel<DocumentNodeFlatNode>(true /* multiple */);
   newDoc:any = null;
   constructor(private _database: CheckListDatabaseService, private _us: UserService) {
     this.treeFlattener = new MatTreeFlattener(
       this.transformer,
       this.getLevel,
       this.isExpandable,
       this.getChildren,
     );
     this.treeControl = new FlatTreeControl<DocumentNodeFlatNode>(this.getLevel, this.isExpandable);
     this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
 
     _database.dataChange.subscribe(data => {
      console.log(data)
       this.dataSource.data = data;
     });
   }
 
   getLevel = (node: DocumentNodeFlatNode) => node.level;
 
   isExpandable = (node: DocumentNodeFlatNode) => node.expandable;
 
   getChildren = (node: DocumentNode): DocumentNode[] => node.children;
 
   hasChild = (_: number, _nodeData: DocumentNodeFlatNode) =>{ return _nodeData.children};
   isFolder = (_: number, _nodeData: DocumentNodeFlatNode) =>{ return _nodeData.type == 'folder'};
   isFile = (_: number, _nodeData: DocumentNodeFlatNode) =>{ return _nodeData.type == 'file'};
 
   hasNoContent = (_: number, _nodeData: DocumentNodeFlatNode) => _nodeData.name === '';
 
   /**
    * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
    */
   transformer = (node: DocumentNode, level: number) => {
     const existingNode = this.nestedNodeMap.get(node);
     const flatNode =
       existingNode && existingNode.name === node.name ? existingNode : new DocumentNodeFlatNode();
     flatNode.type = node.type;
     flatNode.name = node.name;
     flatNode.level = level;
     flatNode.expandable = !!node.children?.length;
     this.flatNodeMap.set(flatNode, node);
     this.nestedNodeMap.set(node, flatNode);
     return flatNode;
   };
 
   /** Whether all the descendants of the node are selected. */
   descendantsAllSelected(node: DocumentNodeFlatNode): boolean {
     const descendants = this.treeControl.getDescendants(node);
     const descAllSelected =
       descendants.length > 0 &&
       descendants.every(child => {
         return this.checklistSelection.isSelected(child);
       });
     return descAllSelected;
   }
 
   /** Whether part of the descendants are selected */
   descendantsPartiallySelected(node: DocumentNodeFlatNode): boolean {
     const descendants = this.treeControl.getDescendants(node);
     const result = descendants.some(child => this.checklistSelection.isSelected(child));
     return result && !this.descendantsAllSelected(node);
   }
 
   /** Toggle the to-do item selection. Select/deselect all the descendants node */
   todoItemSelectionToggle(node: DocumentNodeFlatNode): void {
     this.checklistSelection.toggle(node);
     const descendants = this.treeControl.getDescendants(node);
     this.checklistSelection.isSelected(node)
       ? this.checklistSelection.select(...descendants)
       : this.checklistSelection.deselect(...descendants);
    console.log(this.checklistSelection.selected);
    console.log(this.checklistSelection.selected);
    console.log(this.checklistSelection.isSelected(node));
     // Force update for the parent
     descendants.forEach(child => this.checklistSelection.isSelected(child));
     this.checkAllParentsSelection(node);
   }
 
   /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
   todoLeafItemSelectionToggle(node: DocumentNodeFlatNode): void {
     this.checklistSelection.toggle(node);
     this.checkAllParentsSelection(node);
   }
 
   /* Checks all the parents when a leaf node is selected/unselected */
   checkAllParentsSelection(node: DocumentNodeFlatNode): void {
     let parent: DocumentNodeFlatNode | null = this.getParentNode(node);
     while (parent) {
       this.checkRootNodeSelection(parent);
       parent = this.getParentNode(parent);
     }
   }
 
   /** Check root node checked state and change it accordingly */
   checkRootNodeSelection(node: DocumentNodeFlatNode): void {
     const nodeSelected = this.checklistSelection.isSelected(node);
     const descendants = this.treeControl.getDescendants(node);
     const descAllSelected =
       descendants.length > 0 &&
       descendants.every(child => {
         return this.checklistSelection.isSelected(child);
       });
     if (nodeSelected && !descAllSelected) {
       this.checklistSelection.deselect(node);
     } else if (!nodeSelected && descAllSelected) {
       this.checklistSelection.select(node);
     }
   }
 
   /* Get the parent node of a node */
   getParentNode(node: DocumentNodeFlatNode): DocumentNodeFlatNode | null {
     const currentLevel = this.getLevel(node);
 
     if (currentLevel < 1) {
       return null;
     }
 
     const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
 
     for (let i = startIndex; i >= 0; i--) {
       const currentNode = this.treeControl.dataNodes[i];
 
       if (this.getLevel(currentNode) < currentLevel) {
         return currentNode;
       }
     }
     return null;
   }
 
   /** Select the category so we can insert the new item. */
   addNewItem(node: DocumentNodeFlatNode,type:"file" | "folder") {
    console.log(type)
    console.log(node)
     const parentNode = this.flatNodeMap.get(node);
     let newDoc = new DocumentNode();
     newDoc.name = '';
     newDoc.status = 'unsaved';
     newDoc.type = type;
     this._database.insertItem(parentNode!, newDoc);
     this.newDoc = newDoc;
     console.log(this.newDoc)
     this.treeControl.expand(node);
   }
 
   /** Save the node to database */
   saveNode(node: DocumentNodeFlatNode, itemValue: string) {
     const nestedNode = this.flatNodeMap.get(node);
     this.newDoc.name = itemValue;
     this._database.updateItem(nestedNode!, itemValue);
   }


  users$: Observable<User []> = this._us.list$;
  folders: Section[] = [
    {
      id: 1,
      name: 'Photos',
      updated: new Date('1/1/16'),
      status: 'saved',
      type: 'folder'
    },
    // {
    //   name: 'Recipes',
    //   updated: new Date('1/17/16'),
    // },
    // {
    //   name: 'Work',
    //   updated: new Date('1/28/16'),
    // },
  ];
  notes: Section[] = [
    {
      id: 1,
      name: 'into.jpg',
      updated: new Date('1/1/16'),
      status: 'saved',
      type: 'file'
    },
  ];
  nav: string[] = ['Home'];
  selectedDocument:any = {
    folder: [],
    file: []
  }

  ngOnInit(): void {
  }
  selected(type:string, elem:any){
    console.log(type);
    if(type == 'foldersTarget'){
      this.selectedDocument.folder = elem.map((v:any)=>v._value);
    }else if(type == 'fileTarget'){
      this.selectedDocument.file = elem.map((v:any)=>v._value);
    }
    console.log(elem);
  }

  get totalSelected(){
    return this.checklistSelection.selected.length;
  }

  get isCreating(){
    return this.folders.find(f=>f.status == 'unsaved') || this.notes.find(f=>f.status == 'unsaved');
  }

  createFolder(){
    const yettosave = this.folders.find(f=>f.status == 'unsaved');
    this.folders.unshift({
      id: null,
      name: '',
      updated: new Date(Date.now()),
      status: 'unsaved',
      type: 'folder'
    })
    
  }
  createFile(){
    const yettosave = this.notes.find(f=>f.status == 'unsaved');
    this.notes.unshift({
      id: null,
      name: '',
      updated: new Date(Date.now()),
      status: 'unsaved',
      type: 'file'
    })
    
  }
  cancelSelected(){
    let yettosaveFile = this.notes.findIndex(f=>f.status == 'unsaved');
    if(yettosaveFile > -1){
      this.notes.splice(yettosaveFile,1);
    }
    yettosaveFile = this.folders.findIndex(f=>f.status == 'unsaved');
    if(yettosaveFile > -1){
      this.folders.splice(yettosaveFile,1);
    }
  }
  saveNew(){

  }
  visit(event:any, doc:any){
    event.preventDefault();
    console.log(event);
    console.log(doc);
  }
}
