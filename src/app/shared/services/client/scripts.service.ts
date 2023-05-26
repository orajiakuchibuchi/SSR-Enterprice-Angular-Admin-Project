import { Injectable } from '@angular/core';
import { Script } from '../../models/Index';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  listOfScripts: Script[] = [
    {
      name: 'process',
      src: 'src/assets/vendors/scripts/process.js'
    }
  ];
  private scripts: any = {};
  
  constructor() {
      this.listOfScripts.forEach((script: any) => {
          this.scripts[script.name] = {
              loaded: false,
              src: script.src
          };
      });
  }
  
  load(...scripts: string[]) {
      const promises: any[] = [];
      scripts.forEach((script) => promises.push(this.loadScript(script)));
      return Promise.all(promises);
  }
  
  loadScript(name: string) {
      return new Promise((resolve, reject) => {
          //resolve if already loaded
          if (this.scripts[name].loaded) {
              resolve({script: name, loaded: true, status: 'Already Loaded'});
          }
          else {
              //load script
              let script = <HTMLScriptElement>document.createElement('script');
              script.type = 'text/javascript';
              script.src = this.scripts[name].src;
              if ((<any>script).readyState) {  //IE
                (<any>script).onreadystatechange = () => {
                      if ((<any>script).readyState === "loaded" || (<any>script).readyState === "complete") {
                        (<any>script).onreadystatechange = null;
                          this.scripts[name].loaded = true;
                          resolve({script: name, loaded: true, status: 'Loaded'});
                      }
                  };
              } else {  //Others
                  script.onload = () => {
                      this.scripts[name].loaded = true;
                      resolve({script: name, loaded: true, status: 'Loaded'});
                  };
              }
              script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
              document.getElementsByTagName('head')[0].appendChild(script);
          }
      });
  }
  
  }