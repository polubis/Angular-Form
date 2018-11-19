
import { Injectable } from "@angular/core";
import { of, BehaviorSubject, Subject } from "rxjs";
import { Setting, InputModel, Error } from './form.model';
import { Http } from '@angular/http';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from "rxjs/operators";

import * as formModels from './form.model';
import { ValidationService } from "src/app/components/form/validation.service";

@Injectable()
export class FormService {
    formState = new Subject<InputModel[]>();
    isDoingSomeBackendOperations = new BehaviorSubject<boolean>(false);

    constructor(private validationService: ValidationService, private http: Http){}
    createFormItems = (settings: Setting[]) => {
        const newFormState: InputModel[] = settings.map(setting => {
            const errors: Error[] = this.createErrorsStructure(setting);

            return new InputModel(setting.initialValue, null, errors, 
                [...setting.initialData]);
        });
        this.formState.next(newFormState);
    }
  
    createErrorsStructure = (setting: Setting) => {
        const keys: string[] = Object.keys(setting.validationSettings);
        return keys.map(key => {
            return { isError: false, content: this.validationService.validationContents[key]
                (setting.descriptionName, setting.validationSettings[key])
            };
        });
    }//

    resetInputState(index: number, currentFormState: InputModel[], setting: Setting, value: any){
        const formState: InputModel[] = [...currentFormState];
        formState[index].dataList = [];
        formState[index].value = value;
        this.formState.next(formState);
    }

    handleTyping(value: any, index: number, setting: Setting, currentFormState: InputModel[]){
        const formState: InputModel[] = [...currentFormState];
        const inputState: InputModel = formState[index];
        inputState.value = value;
        const isAllErrorsResolved = this.validationService.validateWhileTyping(inputState.value, inputState.errors, 
            setting.validationSettings);
        
        inputState.isAllErrorsResolved = isAllErrorsResolved;
        this.formState.next(formState);
    }

    putDataIntoInputList(data: {value: any, displayValue: string}[], currentFormState: InputModel[], index: number){
        const formState: InputModel[] = [...currentFormState];
        formState[index].dataList = [...data];
        this.formState.next(formState);
    }

    addItemIntoDynamicList(value: any, currentFormState: InputModel[], index: number){
        const formState: InputModel[] = [...currentFormState];
        const dataList: {value: any, displayValue: string}[] = [...formState[index].dataList];
        const dynamicAddedData = [...formState[index].dynamicAddedData];

        const indexOfValueInDataList = dataList.findIndex(data => data.value === value);
        const isSelectedItemAlreadyInDynamicAddedData = dynamicAddedData.findIndex(data => data.value === value) !== -1;
        if(indexOfValueInDataList !== -1 && !isSelectedItemAlreadyInDynamicAddedData){
            dynamicAddedData.push(dataList[indexOfValueInDataList]);
            dataList.splice(indexOfValueInDataList, 1);
            if(dataList.length > 0)
                formState[index].value = dataList[0].value;
            
            formState[index].dataList = dataList;
            formState[index].dynamicAddedData = dynamicAddedData;
            this.formState.next(formState);
        }
        // if(indexOfValueInDataList === -1){
        //     alert("Brak elementu w data list");
        // }
        // else if(isSelectedItemAlreadyInDynamicAddedData){
        //     alert("Ten element jest juz dodany");
        // }
        // else{
        //     dynamicAddedData.push(dataList[indexOfValueInDataList]);
        //     dataList.splice(indexOfValueInDataList, 1);
        //     if(dataList.length > 0)
        //         formState[index].value = dataList[0].value;
            
        //     formState[index].dataList = dataList;
        //     formState[index].dynamicAddedData = dynamicAddedData;
        //     this.formState.next(formState);
        // }
    }

    handleValidateAll(currentFormState: InputModel[], settings: Setting[]){
        const validationResult: { formState: InputModel[], isFormReadyToSubmit: boolean } = this.validationService.validateAll(currentFormState, settings);
        this.formState.next(validationResult.formState);
        return validationResult.isFormReadyToSubmit;
    }
}

