import { Subject } from "rxjs";

export class InputModel {
  constructor(
    public value: any,
    public isAllErrorsResolved: boolean = null,
    public errors: Error[],
    public dataList: any[], 
    public dynamicAddedData: any[] = []
  ) {}
}

export interface Error{
    isError: boolean, 
    content: string
}

export interface Setting{
    label: string, 
    descriptionName: string,
    inputClass: string, 
    inputContainerClass: string,
    validationSettings: Validation,
    placeholder: string, 
    mode: string, 
    type: string, 
    initialData: any[],
    initialValue: any
}

export interface Validation {
    // validateOnlyOnSubmitingKeys?: {
    //     [key: number]: {
    //         value: number
    //     }
    // },
    minLength?: number,
    maxLength?: number, 
    required?: boolean, 
    regex?: string
}

export const filterSettings: Setting[] = [
    {
        label: "", placeholder: "", descriptionName: "Searcher", inputClass: "input", inputContainerClass: "input-container",
        validationSettings: {minLength: 3, maxLength: 25, required: true}, mode: "normal", type: "text",
        initialData: [], initialValue: "ddasd"
    },
    {
        label: "", placeholder: "", descriptionName: "Searcher", inputClass: "input", inputContainerClass: "input-container",
        validationSettings: {minLength: 3, maxLength: 25, required: true}, mode: "normal", type: "text",
        initialData: [], initialValue: ""
    },
    // {
    //     label: "", placeholder: "", descriptionName: "Searcher", inputClass: "input", inputContainerClass: "input-container",
    //     validationSettings: {minLength: 3, maxLength: 25, required: true}, mode: "normal", type: "text",
    //     initialData: [], initialValue: ""
    // },
    // {
    //     label: "", placeholder: "", descriptionName: "Searcher", inputClass: "input", inputContainerClass: "input-container",
    //     validationSettings: {minLength: 3, maxLength: 25, required: true}, mode: "normal", type: "text",
    //     initialData: [], initialValue: ""
    // },
    {
        label: "Type ahead", placeholder: "", descriptionName: "Searcher", inputClass: "input", inputContainerClass: "input-container",
        validationSettings: {minLength: 2, required: true}, mode: "type-ahead", type: "text",
        initialData: [], initialValue: "ddasd"
    },
    {
        label: "", placeholder: "", descriptionName: "Category", inputClass: "input", inputContainerClass: "input-container",
        validationSettings: {required: true}, mode: "select-and-type", type: "text",
        initialData: [{value: "Id", displayValue: "Id"}], initialValue: "Siema"
    },
    {
        label: "", placeholder: "", descriptionName: "Searcher", inputClass: "input", inputContainerClass: "input-container",
        validationSettings: {required: true}, mode: "simple-select", type: "text",
        initialData: [{value: "", displayValue: "Id"}, {value: "Id", displayValue: "Elo"}], initialValue: ""
    },
    // {
    //     label: "", placeholder: "", descriptionName: "Content test", inputClass: "input", inputContainerClass: "input-container",
    //     validationSettings: {required: true}, mode: "type-ahead", type: "text",
    //     initialData: [{value: "", displayValue: "Id"}], initialValue: new Subject()
    // }
];
