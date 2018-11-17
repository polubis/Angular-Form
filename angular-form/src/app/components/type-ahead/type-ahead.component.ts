import { Component, OnInit, Input } from "@angular/core";
import { Setting, InputModel } from "src/app/components/form/form.model";
import { Output, EventEmitter } from "@angular/core";
import { Subject, Subscription, of, Observable } from "rxjs";
import { FormService } from "src/app/components/form/form.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  catchError,
  take,
  tap
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
    isLoadingData: boolean = false;
  // pisze -> zapisuje eventem dane do komponentu 
  
  
    constructor(private formService: FormService, private requestService: RequestService) { }
  
    ngOnInit() {
      this.subscription = this.getDataOnTyping().subscribe(data => {
      });

    }

    getData(value: any){
      this.isLoadingData = true;
      const requestData = this.requestService.makeRequest("getPosts")
      .pipe(
        map(value => value.json())
      )
      .subscribe(data => {
        this.isLoadingData = false;
        return data;
      });

      return of(requestData);
    }
    
    getDataOnTyping(){
      return this.value
        .pipe(
          tap(value => {
            this.formService.handleTyping(value, this.Id, this.setting, this.formState);
          }),
          filter(value => {
            return this.formState[this.Id].isAllErrorsResolved;
          }),
          debounceTime(600),
          switchMap((value: any) => this.getData(value))
        );
    }

    handleTyping(e){
      this.value.next(e.target.value);
    }
  
    ngOnDestroy(){
      this.subscription.unsubscribe();
    }
}

