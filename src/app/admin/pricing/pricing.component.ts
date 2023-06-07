import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/shared/services/plan/plan.service';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { Plan, User } from 'src/app/shared/models/Index';
import { UserService } from 'src/app/shared/services/user/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  newPlan: any = this.planReset;
  plans$: Observable<Plan[]> = this.ps.getPlansApi$;
  isadmin: Observable<any> = this._us.user$.pipe(
		map((user:User)=>{
			return user && user.role && (<string[]>user.role).includes('Admin')
		})
	)
  constructor(private ps: PlanService, private _us: UserService) { }

  ngOnInit(): void {
  }

  get planReset(){
    return {
      name: {
        value: '',
        message: '',
        status: false,
        changed: (e:any)=>this.changed('name', e)
      },
      suggestion: {
        value: '',
        message: '',
        status: false,
        changed: (e:any)=>this.changed('suggestion', e)
      },
      amount: {
        value: 0,
        message: '',
        status: false,
        changed: (e:any)=>this.changed('amount', e)
      },
      icon: {
        value: 'circle',
        message: 'Optional. Defsult: Circle',
        status: true,
        changed: (e:any)=>this.changed('icon', e)
      },
      features: {
        value: '',
        message: '',
        status: false,
        changed: (e:any)=>this.changed('features', e),
        children: [],
        save: ()=>{
          const value = this.newPlan.features.value.toLocaleLowerCase();
          let addedAlready = this.newPlan.features.children.indexOf((c:string)=>c.toLocaleLowerCase()==value)
          if(addedAlready<0){
            (<string[]>this.newPlan.features.children).unshift(this.newPlan.features.value);
            this.newPlan.features.value = '';
            this.newPlan.features.status = false;
          }else{
            this.newPlan.features.children.splice(addedAlready, 1);
            this.newPlan.features.children.unshift(value);
            const element = <HTMLElement | null>this.newPlan.features._getChildId(value);
            if(element){
              element.classList.add('shakeit');
              setTimeout(() => {
                element.classList.remove('shakeit');
              }, 1500);
            }
  
          }
        },
        _childId: (name:string)=>{
          return `features_child_${name.trim().replace(' ', '_').toLocaleLowerCase()}`
        },
        removeChild: (index:number)=>{
          this.newPlan.features.children.splice(index,1);
        },
        _getChildId: (name:string)=>{
          return (<HTMLElement | null>document.getElementById(this.newPlan.features._childId(name)));
        }
      },
      _submit: ()=>{
        this.save( {
          name: this.newPlan.name.value,
          amount: this.newPlan.amount.value,
          features: this.newPlan.features.children,
          suggestion: this.newPlan.suggestion.value,
          icon: this.newPlan.icon.value
        } );
      }
    }
  }

  changed(key:string, value:any){
    console.log(key);
    console.log(value);
    if(!value || (key == 'amount' && value == 0)){
      this.newPlan[key].value = '';
      this.newPlan[key].status = false;
      this.newPlan[key].message = `You must fill in a value for ${key}`;
      return;
    }
    switch(key){
      case 'name': 
        this.newPlan.name.message = 'Name accepted!';
        this.newPlan.name.status = true;
        break;
      
      case 'suggestion': 
        this.newPlan.suggestion.status = value.length < 50;
        if(this.newPlan.suggestion.status){
          this.newPlan.suggestion.message = 'Suggestion accepted!';
        }else{
          this.newPlan.suggestion.message = 'Suggestion must be less than 50 characters (Brief highlight)';
        }
        break;
      case 'amount': 
        this.newPlan.amount.message = 'Amount accepted!';
        this.newPlan.amount.status = true;
        break;
      case 'icon': 
        this.newPlan.icon.message = 'Icon accepted!';
        this.newPlan.icon.status = true;
        break;
      case 'features': 
        this.newPlan.features.status = value.length < 150;
        if(this.newPlan.features.status){
          this.newPlan.features.message = 'Features accepted!';
        }else{
          let overlap = this.newPlan.features.value.length - 150;
          this.newPlan.features.value = (<string>this.newPlan.features.value).slice(149,overlap);
          this.newPlan.features.message = 'Feature points must be less than 150 characters';
        }
        break;
    }
  }

  save(plan:any){
    this.ps.plans$.subscribe(
      plans=>{
        if(plans.find(p=>p.name == plan.name)){
          this.newPlan.name.message = 'Plan with name exists';
          this.newPlan.name.status =false;
        }else{
          this.ps.add(plan);
          this.newPlan = this.planReset;
        }
      }
    )
    console.log(plan);

  }

}
