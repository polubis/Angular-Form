import { Component, OnInit, Input } from "@angular/core";
import { Setting, InputModel } from "src/app/components/form/form.model";
import { Output, EventEmitter } from "@angular/core";
import { Subject, Subscription, of } from "rxjs";
import { FormService } from "src/app/components/form/form.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap
} from "rxjs/operators";
import { RequestService } from "src/app/request.service";

@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss']
})
export class TypeAheadComponent implements OnInit {
    @Input() setting: Setting;
    @Input() formState: InputModel[];
  
    @Input() Id: number;
    @Output() onChangingFocusedInput = new EventEmitter<void>();
  
    value = new Subject<any>();
    subscription: Subscription;
  // pisze -> zapisuje eventem dane do komponentu 
  
  
    constructor(private formService: FormService, private requestService: RequestService) { }
  
    ngOnInit() {
      this.subscription = this.value.subscribe((val: any) => {
        this.formService.handleTyping(val, this.Id, this.setting, this.formState);
      });

      this.requestService.makeRequest("getPosts")
        .pipe(
          map(value => value.json())
        )
        .subscribe(value => {
          // Dokonczyc requesty
          console.log(value);
        });
    }
    
    getResultsData(){
      return this.value
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          filter(value => value.length > 2),
          map(value => value.trim()),
          switchMap(value => value ? value : of([]))
        );
    }

    handleTyping(e){
      this.value.next(e.target.value);
    }
  
    ngOnDestroy(){
      this.subscription.unsubscribe();
    }
}

