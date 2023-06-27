export class Document {
    id: any;
    children: Document[] = [];
    name: string = '';
    private _created_at: Date;
    private _updated_at: Date;
    status: string = 'unsaved';
    type: string = '';

    constructor(){
        this.id = Math.random() * (324234 - 12) + 12;
        this._created_at = new Date(Date.now());
        this._updated_at = this.created_at;
    }

    get created_at(){
        return this._created_at;
    }

    get updated_at(){
        return this._updated_at;
    }

}