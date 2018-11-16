
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Setting, InputModel, Error } from './form.model';

import * as formModels from './form.model';
import { ValidationService } from "src/app/components/form/validation.service";




@Injectable()
export class FormService {
    formState = new Subject<InputModel[]>();
    constructor(private validationService: ValidationService){

    }
    createFormItems = (settings: Setting[]) => {
        const newFormState: InputModel[] = settings.map(setting => {
            const errors: Error[] = this.createErrorsStructure(setting);

            return new InputModel(setting.initialValue ? setting.initialValue : "", null, errors, 
                [...setting.initialData]);
        });
        this.formState.next(newFormState);
    }
  
    createErrorsStructure = (setting: Setting) => {
        const keys: string = Object.keys(setting.validationSettings);
        return keys.map(key => {
            return { isError: true, content: this.validationService.validationContents[key]
                (setting.descriptionName, setting.validationSettings[key])
            };
        });
    }

    handleTyping(value: any, index: number, currentFormState: InputModel[], setting: Setting){
        const newFormState = [...currentFormState];
        newFormState[index].value = value;

        const isAllErrorsResolved = this.validationService.validateWhileTyping(newFormState[index].value, newFormState[index].errors, 
            setting.validationSettings);
        newFormState[index].isAllErrorsResolved = isAllErrorsResolved;
  
        this.formState.next(newFormState);
    }

    handleValidateAll(currentFormState: InputModel[], settings: Setting[]){
        this.formState.next(
            this.validationService.validateAll(currentFormState, settings)
        );
    }
}

