import { Component, OnInit, Input } from "@angular/core";
import { Setting, InputModel } from "src/app/components/form/form.model";
import { Output, EventEmitter } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { FormService } from "src/app/components/form/form.service";

@Component({
  selector: 'app-select-and-type',
  templateUrl: './select-and-type.component.html',
  styleUrls: ['./select-and-type.component.scss']
})
export class SelectAndTypeComponent implements OnInit {
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
