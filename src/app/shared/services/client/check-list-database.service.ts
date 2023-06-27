import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DocumentNode } from '../../models/Index';
import { UserService } from '../user/user.service';

/** Flat to-do item node with expandable and level information */
export class DocumentNodeFlatNode extends DocumentNode{
  level: number = 0;
  expandable: boolean = false;
  constructor(){
    super()
  }
}

/**
 * The Json object for to-do list data.
 */
// const TREE_DATA = {
//   Groceries: {
//     'Almond Meal flour': null,
//     'Organic eggs': null,
//     'Protein Powder': null,
//     Fruits: {
//       Apple: null,
//       Berries: ['Blueberry', 'Raspberry'],
//       Orange: null,
//     },
//   },
//   Reminders: ['Cook dinner', 'Read the Material Design spec', 'Upgrade Application to Angular'],
// };

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable({
  providedIn: 'root'
})
export class CheckListDatabaseService  {
  dataChange = new BehaviorSubject<DocumentNode[]>([]);

  get data(): DocumentNode[] {
    return this.dataChange.value;
  }

  constructor(private _us: UserService) {
    this.initialize();
  }
  initialize() {
    // Build the tree nodes from Json object. The result is a list of `DocumentNode` with nested
    //     file node as children.
    // const data = this.buildFileTree(TREE_DATA, 0);
    let nnewDoc = new DocumentNode();
    const user:any = this._us.getuser();
    nnewDoc.name = user.firstName;
    nnewDoc.status = 'saved';
    nnewDoc.type = 'folder';

    let child = new DocumentNode();
    child.name = '__Welcome';
    child.status = 'saved';
    child.type = 'file';

    nnewDoc.children.unshift(child);
    const data = [
      nnewDoc
    ];
    console.log(nnewDoc)
    console.log(data)

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `DocumentNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): DocumentNode[] {
    return []
  }

  /** Add an item to to-do list */
  insertItem(parent: DocumentNode, document: DocumentNode) {
    if (parent.children) {
      parent.children.push(document);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: DocumentNode, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }
}
