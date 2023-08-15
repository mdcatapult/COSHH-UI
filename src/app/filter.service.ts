import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) { }

  /**
   * Get all the cupboards for all labs
   */
  getCupboards() {
    return this.http.get<[string]>(`${environment.backendUrl}/cupboards`);
  }

  /**
   * Get all the cupboards for a particular lab
   * @param lab
   */
  getCupboardsForLab(lab: string) {
    const options = lab ?
        { params: new HttpParams().set('lab', lab) } : {};
    return this.http.get<[string]>(`${environment.backendUrl}/lab_cupboards`, options);
  }
}
