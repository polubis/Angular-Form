

import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

@Injectable()
export class RequestService {
    constructor(private http: Http){

    }
    requests: {
        "getPosts": {url: "https://jsonplaceholder.typicode.com/posts"}
    }

    makeRequest(query: string){
        return this.http.get("http://localhost:60965/Project/UserSearcher?query=" + query);
    }
}