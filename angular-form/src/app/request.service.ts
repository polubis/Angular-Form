

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class RequestService {
    constructor(private http: Http){

    }
    requests: {
        "getPosts": {url: "https://jsonplaceholder.typicode.com/posts"}
    }

    makeRequest(requestName: string){
        return this.http.get("https://jsonplaceholder.typicode.com/posts");
    }
}