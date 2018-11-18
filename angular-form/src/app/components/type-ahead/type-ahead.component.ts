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
    currentFocusedIndexInDataList: number = -1;
  
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

    selectRow(value: any, index: number, inputRef: HTMLInputElement, shouldAdd: boolean){
      console.log(inputRef);
      this.formService.handleTyping(value, this.Id, this.setting, this.formState);
      this.currentFocusedIndexInDataList = index;
      inputRef.focus();

      if(shouldAdd){
        this.addIntoValuesList();
      }
    }

    addIntoValuesList(){
        const value: any = this.formState[this.Id].value;
        this.formService.addItemIntoDynamicList(value, this.formState, this.Id);
    }

    handlePressingArrows(arrowType: string){
      const inputState: InputModel = this.formState[this.Id];
      const numberOfItems: number = inputState.dataList.length;
      if(numberOfItems > 0 && inputState.isAllErrorsResolved && !this.isLoadingData){
        this[arrowType](numberOfItems-1, inputState.dataList);
      }
    }

    selectNext(numberOfItems: number, dataList: {value: any, displayValue: string}[]){
        if(this.currentFocusedIndexInDataList === numberOfItems){
          this.currentFocusedIndexInDataList = 0;
          this.formService.handleTyping(dataList[this.currentFocusedIndexInDataList].value, this.Id, this.setting, this.formState);  
        }else{
          this.currentFocusedIndexInDataList = this.currentFocusedIndexInDataList + 1;
          this.formService.handleTyping(dataList[this.currentFocusedIndexInDataList].value, this.Id, this.setting, this.formState);  
        }
    } 

    selectBefore(numberOfItems: number, dataList: {value: any, displayValue: string}[]){
      if(this.currentFocusedIndexInDataList <= 0){
        this.currentFocusedIndexInDataList = numberOfItems;
        this.formService.handleTyping(dataList[this.currentFocusedIndexInDataList].value, this.Id, this.setting, this.formState);  
      }else{
        this.currentFocusedIndexInDataList = this.currentFocusedIndexInDataList - 1;
        this.formService.handleTyping(dataList[this.currentFocusedIndexInDataList].value, this.Id, this.setting, this.formState);  
      }
    }

    handleKeyDown(e){
      if(!this.isLoadingData && this.formState[this.Id].isAllErrorsResolved){
        if(e.keyCode === 13){
          e.preventDefault();
          this.addIntoValuesList();
        }else if(e.keyCode === 38){
          e.preventDefault();
          this.handlePressingArrows("selectBefore");
        }
        else if(e.keyCode === 40){
          e.preventDefault();
          this.handlePressingArrows("selectNext");
        }
      }
    }

    handleTyping(e){
      this.value.next(e.target.value);
    }
  
    ngOnDestroy(){
      this.subscription.unsubscribe();
    }
}

