import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Chemical } from '../coshh/types';
// environment.ts is added at compile time by npm run start command
import { environment } from '../../environments/environment';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {

       constructor(private http: HttpClient) {
    }

    /**
     * Get all the chemicals from the database
     * @returns {Observable<Chemical[]>}
     */
    getChemicals = (): Observable<Chemical[]> => this.http.get<Chemical[]>(`${environment.backendUrl}/chemicals`);


    /**
     * Get all the cupboards for all the labs
     * @returns {Observable<string[]>}
     */
    getCupboards = (): Observable<string[]> => this.http.get<[string]>(`${environment.backendUrl}/cupboards`);


    /**
     * Get all the cupboards for a single lab
     * @param {string} lab
     * @returns {Observable<string[]>}
     */
    getCupboardsForLab = (lab: string): Observable<string[]> => {
        const options = lab ?
            { params: new HttpParams().set('lab', lab) } : {};

        return this.http.get<[string]>(`${environment.backendUrl}/cupboards`, options);
    };


    /**
     * Get all the labs
     * @returns {Observable<string[]>}
     */
    getLabs = (): Observable<string[]> => this.http.get<string[]>(`${environment.backendUrl}/labs`);

    /**
     * Search the passed array of chemicals for chemical names or numbers containing the search string (case-insensitive)
     * @param {Chemical[]} chemicals the array of chemicals to search
     * @param {string} search the string to search for
     * @returns {string[]} a sorted array of unique chemical names
     */
    getNames = (chemicals: Chemical[], search: string): string[] => {
        const searchLower = search.toLowerCase();

        return chemicals
            .flatMap((chemical) => [chemical.name, chemical.chemicalNumber || ''])
            .filter((phrase) => phrase.toLowerCase().includes(searchLower))
            .sort()
            .filter((item, pos, array) => !pos || item != array[pos - 1]);  // deduplication
    };


    /**
     * Search the passed array of chemicals for chemical owners containing the search string (case-insensitive)
     * @param {Chemical[]} chemicals the array of chemicals to search
     * @param {string} search the string to search for
     * @returns {string[]} a sorted array of unique chemical owners
     */
    getOwners = (chemicals: Chemical[], search: string): string[] => {
        const searchLower = search.toLowerCase();

        return chemicals
            .map((chemical) => chemical.owner)
            .filter((phrase) => phrase?.toLowerCase().includes(searchLower))
            .sort()
            .filter((item, pos, array) => !pos || item != array[pos - 1]);  // deduplication
    };

    /**
     * Get all users from the database
     * @returns {Observable<string[]>}
     */
    getUsers = (): Observable<string[]> =>  this.http.get<string[]>(`${environment.backendUrl}/users`);

}
