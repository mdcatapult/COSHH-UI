import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) { }

  getCupboards() {
    return this.http.get<[string]>(`${environment.backendUrl}/cupboards`);
  }
}
