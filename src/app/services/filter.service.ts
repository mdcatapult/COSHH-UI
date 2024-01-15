import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Chemical } from '../coshh/types';
// environment.ts is added at compile time by npm run start command
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

       constructor(private http: HttpClient) {
    }

    getChemicals = () => this.http.get<Chemical[]>(`${environment.backendUrl}/chemicals`);


    /**
     * Get all the cupboards for all labs
     */
    getCupboards = () => this.http.get<[string]>(`${environment.backendUrl}/cupboards`);


    /**
     * Get all the cupboards for a particular lab
     * @param lab
     */
    getCupboardsForLab = (lab: string) => {
        const options = lab ?
            { params: new HttpParams().set('lab', lab) } : {};

        return this.http.get<[string]>(`${environment.backendUrl}/cupboards`, options);
    };


    getLabs = () => this.http.get<string[]>(`${environment.backendUrl}/labs`);

    getNames = (chemicals: Chemical[], search: string): string[] => {
        const searchLower = search.toLowerCase();

        return chemicals
            .flatMap((chemical) => [chemical.name, chemical.chemicalNumber || ''])
            .filter((phrase) => phrase.toLowerCase().includes(searchLower))
            .sort()
            .filter((item, pos, array) => !pos || item != array[pos - 1]);  // deduplication
    };


    getOwners = (chemicals: Chemical[], search: string): string[] => {
        const searchLower = search.toLowerCase();

        return chemicals
            .map((chemical) => chemical.owner)
            .filter((phrase) => phrase?.toLowerCase().includes(searchLower))
            .sort()
            .filter((item, pos, array) => !pos || item != array[pos - 1]);  // deduplication
    };

    getUsers = () =>  this.http.get<string[]>(`${environment.backendUrl}/users`);

}
