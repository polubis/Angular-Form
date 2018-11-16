export class InputModel{
    constructor(public value: any, public isAllErrorsResolved: boolean = true, 
        public errors: Error[], public dataList: any[]) {
    }
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
    minLength?: number,
    maxLength?: number, 
    required?: number, 
    regex?: string 
}

export const filterSettings: Setting[] = [
    { label: "", descriptionName: "Categories", initialValue: "Tomaz", inputContainerClass: "", initialData: [{displayValue: "wybierz pole", value: ""}, {displayValue: "inne dane ", value: "inne dane"}], inputClass: "", validationSettings: {}, placeholder: "click here to select category", mode: "select-and-type", type: "text" }, 
    { label: "", descriptionName: "Searcher", inputClass: "", inputContainerClass: "", validationSettings: {
        minLength: 3, maxLength: 25, required: true
    }, placeholder: "start typing and add filters...", mode: "filter-search", type: "text", initialData: [{displayValue: "wybierz pole", value: ""}, {displayValue: "inne dane ", value: "inne dane"}] },
    { label: "", descriptionName: "Searcher", inputClass: "dadsad", inputContainerClass: "", validationSettings: {
        minLength: 3, maxLength: 25, required: true
    }, placeholder: "start typing and add filters...", mode: 'custom-select', type: "text", initialData: [{displayValue: "wybierz pole", value: ""}, {displayValue: "inne dane ", value: "inne dane"}] }
];
