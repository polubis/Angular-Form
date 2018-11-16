import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormService } from "src/app/components/form/form.service";
import * as formModels from '../form/form.model';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService]
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() settingName: string;

  @Input() formClass: string = "form";
  @Input() submitButtonClass: string = "submit-btn";
  @Input() btnType: string = "submit";
  @Input() submitButtonTitle: string;
  @Input() errorClasses: string = "error-list";

  formState: formModels.InputModel[];
  settings: formModels.Setting[];
  currentFocusedInputIndex: number = -1;
  isFormDirty: boolean = false;
  isFormReadyToSubmit: boolean = true;

  subscription: Subscription;

  constructor(private formService: FormService) { }

  ngOnInit() {
    this.settings = [...formModels[this.settingName]];
    this.subscription = this.formService.formState
    .subscribe((state: formModels.InputModel[]) => {
      this.formState = state;
      if(this.isFormDirty){
        const index: number = this.formState.findIndex(state => !state.isAllErrorsResolved);
        this.isFormReadyToSubmit = index === -1;
        if(this.currentFocusedInputIndex === -1)
          this.currentFocusedInputIndex = index;
      }
    });

    this.formService.createFormItems(this.settings);
  }

  submit(e){
    e.preventDefault();
    this.isFormDirty = true;
    this.formService.handleValidateAll(this.formState, this.settings);
    if(this.isFormReadyToSubmit){
      alert("Wysylam dane") // Tutaj bedzie handlowanie submitowania
    }
  }

  changeFocusedInput(index: number){
      this.currentFocusedInputIndex = index;
  }

  handleTyping(e, index: number){
    console.log(e.target.value);
    this.formService.handleTyping(e.target.value, index, this.formState, this.settings[index]);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  handleTypAheadTyping(e, index: number){
    console.log(e.target.value);
  }
}
