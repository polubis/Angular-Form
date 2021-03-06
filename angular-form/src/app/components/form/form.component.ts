import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ViewEncapsulation
} from "@angular/core";
import { FormService } from "src/app/components/form/form.service";
import { Subscription } from "rxjs";
import { InputModel, Setting } from "src/app/components/form/form.model";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService],
  encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() settingName: string;
  @Input() inputSettings: Setting[];
  
  @Input() formClass: string = "form";
  @Input() submitButtonClass: string = "submit-btn";
  @Input() btnType: string = "submit";
  @Input() submitButtonTitle: string;

  formState: InputModel[];
  settings: Setting[];

  currentFocusedInputIndex: number = -1;

  isFormDirty: boolean = false;
  isFormReadyToSubmit: boolean = true;

  subscription: Subscription;
  stateSubscription: Subscription;

  isDoingSomeServerOperations: boolean = false;


  constructor(private formService: FormService) { }

  ngOnInit() {
    this.settings = [...this.inputSettings];

    this.subscription = this.formService.formState
      .subscribe((formState: InputModel[]) => {
        this.formState = formState;
        console.log(this.formState);
        if(this.isFormDirty){
          this.isFormReadyToSubmit = this.formState.findIndex(state => !state.isAllErrorsResolved) === -1;
        }
      });
    this.formService.isDoingSomeBackendOperations
      .subscribe(state => {
        this.isDoingSomeServerOperations = state;
      })
    this.formService.createFormItems(this.inputSettings);

  }
  changeFocusedInput(index: number){
      console.log(index);
      this.currentFocusedInputIndex = index;
  }

  submit(e){
    e.preventDefault();
    e.stopPropagation();
    this.isFormDirty = true;
    this.isFormReadyToSubmit = this.formService.handleValidateAll(this.formState, this.settings);
    if(this.isFormReadyToSubmit){
      alert("Form jest ok")
    }else{
      this.currentFocusedInputIndex = this.formState.findIndex(state => !state.isAllErrorsResolved);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.stateSubscription.unsubscribe();
  }

  calculateErrorListLength(baseWidth: number, additionalWidth: number = 24){
    return (baseWidth + additionalWidth).toString() + "px";
  }
}
