
import { Injectable } from "@angular/core";
import { Error, Validation, InputModel, Setting } from "./form.model";
@Injectable()
export class ValidationService {
    validationContents = {
        minLength: (inputName: string, value: number) => { return `${inputName} should have more than ${value} characters` },
        maxLength: (inputName: string, value: number)  => { return `${inputName} should have less than ${value} characters` },
        required: (inputName: string) => { return `${inputName} is required` },
        regex: (inputName: string, format: string) => { return `${inputName} must have specified format ${format}` }
    }

    validationMethods = {
        minLength: (value: any, requirements: number) => this.validateMinLength(value.length, requirements),
        maxLength: (value: any, requirements: number) => this.validateMaxLength(value.length, requirements), 
        required: (value: any) => this.validateIsExist(value), 
        regex: (value: any, requirements: number) => this.validateRegexPattern(value, requirements), 
    }

    validateMinLength(length: number, minLength: number): boolean{
        return length < minLength;
    }

    validateMaxLength(length: number, maxLength: number): boolean{
        return length > maxLength;
    }

    validateIsExist(value: any): boolean{
        return (value === null || value === undefined || value === "");
    }

    validateRegexPattern(length: number, minLength: number): boolean{
        return length > minLength;
    }

    validateWhileTyping(value: any, currentErrors: Error[], validationSettings: Validation): boolean{
        let isAllErrorsResolved = true;
        const validationKeys = Object.keys(validationSettings);
        for(let i = 0; i < currentErrors.length; i++){
            const methodKey = validationKeys[i];
            currentErrors[i].isError = this.validationMethods[methodKey](value, validationSettings[validationKeys[i]]);
            if(currentErrors[i].isError){
                isAllErrorsResolved = false;
            }
        }
        return isAllErrorsResolved;
    }

    validateAll(currentFormState: InputModel[], settings: Setting[]){
        let isFormReadyToSubmit: boolean = true;
        const formState: InputModel[] = currentFormState.map((state, index) => {
            const isAllErrorsResolved = this.validateWhileTyping(state.value, state.errors, settings[index].validationSettings);
            if(!isAllErrorsResolved)
                isFormReadyToSubmit = false;
            return new InputModel(state.value, isAllErrorsResolved, state.errors, state.dataList);
        });

        return { formState, isFormReadyToSubmit };
    }
}