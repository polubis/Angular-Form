
import { Injectable } from "@angular/core";
import { Subject, of } from "rxjs";
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

    handleValidateAll(currentFormState: InputModel[], settings: Setting[]){
        const validationResult: { formState: InputModel[], isFormReadyToSubmit: boolean } = this.validationService.validateAll(currentFormState, settings);
        this.formState.next(validationResult.formState);
        return validationResult.isFormReadyToSubmit;
    }
}

