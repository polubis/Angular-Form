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
    @Output() onPressingEnter = new EventEmitter<any>();

    value = new Subject<any>();
    subscription: Subscription;
    isLoadingData: boolean = false;
  
    constructor(private formService: FormService, private requestService: RequestService) { }
  
    ngOnInit() {
      this.subscription = this.getDataOnTyping().subscribe();
    }

    getData(value: any){
      this.isLoadingData = true;
      const requestData = this.requestService.makeRequest("getPosts")
      .pipe(
        map(value => {
          const jsonVal = value.json();
          const number = Math.ceil(Math.random(0, 10) * 100);
          const data = [];
          for(let i = 0; i < number; i++){
            data.push({value: i.toString() + "wartosc", displayValue: i.toString() + "wartosc"})
          }
          return data;
        }),
      )
      .subscribe(
        data => {
          this.isLoadingData = false;
          this.formService.putDataIntoInputList(data, this.formState, this.Id);
        },
        error => {
          this.isLoadingData = false;
        }
      );

      return of(requestData);
    }
    
    getDataOnTyping(){
      return this.value
        .pipe(
          tap(value => {
            this.formService.handleTyping(value, this.Id, this.setting, this.formState);
          }),
          debounceTime(500),
          filter(value => {
            return this.formState[this.Id].isAllErrorsResolved && !this.isLoadingData;
          }),
          switchMap((value: any) => this.getData(value)),
          catchError(error => of(error))
        );
    }

    selectRow(value: any){
      this.formService.handleTyping(value, this.Id, this.setting, this.formState);
    }

    addIntoValuesList(){
      if(!this.isLoadingData){
        const value: any = this.formState[this.Id].value;
        this.formService.addItemIntoDynamicList(value, this.formState, this.Id);
      }
    }

    handleKeyPress(e){
      if(e.keyCode === 13){
        e.preventDefault();
        this.addIntoValuesList();
      }else if(e.keyCode === 39 || e.keyCode === 37){
          console.log("Siema");
      }
    }

    handleTyping(e){
      this.value.next(e.target.value);
    }
  
    ngOnDestroy(){
      this.subscription.unsubscribe();
    }
}

