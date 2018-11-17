import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  EventEmitter,
  Output
} from "@angular/core";
import { Setting, InputModel } from "src/app/components/form/form.model";
import {  Subscription, Subject } from "rxjs";
import { FormService } from "src/app/components/form/form.service";

@Component({
  selector: 'app-normal-input',
  templateUrl: './normal-input.component.html',
  styleUrls: ['./normal-input.component.scss']
})
export class NormalInputComponent implements OnInit, OnDestroy {
  @Input() setting: Setting;
  @Input() formState: InputModel[];

  @Input() Id: number;
  @Output() onChangingFocusedInput = new EventEmitter<void>();

  value = new Subject<any>();
  subscription: Subscription;
// pisze -> zapisuje eventem dane do komponentu 


  constructor(private formService: FormService) { }

  ngOnInit() {
    this.subscription = this.value.subscribe((val: any) => {
      this.formService.handleTyping(val, this.Id, this.setting, this.formState);
    });
  }

  handleTyping(e){
    this.value.next(e.target.value);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
