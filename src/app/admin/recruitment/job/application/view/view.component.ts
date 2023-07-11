import { Component, OnInit, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileService } from 'src/app/shared/services/client/file.service';
import { environment } from 'src/environments/environment';
import {catchError, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-recruitment-application-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  @Input('type') type: 'modal' | 'navigate' = 'modal';
  @Input('application') application:any = null;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '50',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: `${environment.uploadApi}/upload`,
    upload: (file: File) => { 
      console.log(file); 
      let formData = new FormData();
      formData.append('file', file, file.name)
      return this._fs.upload(formData)
        .pipe(
          catchError((err: any) => {
            console.log(err);
            return throwError(err);
          }),
          tap((res:any)=>{
            console.log(res);
            
          })
        );
      },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  response:any = null;
  constructor(private _fs: FileService) { }

  ngOnInit(): void {
  }
  view(){

  }

}
