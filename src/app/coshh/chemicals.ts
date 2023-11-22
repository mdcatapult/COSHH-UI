import * as moment from 'moment';
import { Chemical, Expiry } from './types';

export class Chemicals {
    private chemicals: Chemical[] = [];

    get = (includeArchived: boolean, cupboard: string, hazardCategory: string, lab: string, expiry: Expiry, nameOrNumberSearchStr: string, ownerSearchStr: string): Chemical[] => {
        const nameOrNumberSearchLower = nameOrNumberSearchStr.toLowerCase();

        const ownerSearchLower = ownerSearchStr.toLowerCase();

        return this.chemicals
            .filter((chemical) => includeArchived || !chemical.isArchived)
            .filter((chemical) => cupboard === 'All' || chemical.cupboard?.toLowerCase().trim() === cupboard) // Note that cupboard is now set to lower case
            .filter((chemical) => hazardCategory === 'All' ||
                chemical.hazards?.map((hazard) => hazard.toString()).includes(hazardCategory))
            .filter((chemical) => lab === 'All' || chemical.location === lab)
            .filter((chemical) => Chemicals.filterExpiryDate(chemical, expiry))
            .filter((chemical) => chemical.name.toLowerCase().includes(nameOrNumberSearchLower) || chemical.chemicalNumber?.toLowerCase().includes(nameOrNumberSearchLower))
            // only filter if ownerSearchStr is not empty - this handles null values which we want to filter out only
            // if the user has entered a value in the owner filter
            .filter((chemical) => ownerSearchStr ? chemical.owner?.toLowerCase().includes(ownerSearchLower) : true)
            .sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }

                return 0;
            });
    };
    add = (chemical: Chemical) => this.chemicals.push(chemical);
    set = (chemicals: Chemical[]) => this.chemicals = chemicals;
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

    update = (chemical: Chemical) => {
        const chemicalIndex = this.chemicals.findIndex((chem) => chem.id === chemical.id);

        this.chemicals[chemicalIndex] = chemical;
    };

    private static filterExpiryDate(chemical: Chemical, expiry: Expiry): boolean {

        const timeUntilExpiry = Chemicals.daysUntilExpiry(chemical);

        switch (expiry) {
            case 'Any':
                return true;
            case '< 30 Days':
                return timeUntilExpiry < 30 && timeUntilExpiry > 0;
            case 'Expired':
                return timeUntilExpiry <= 0;
        }
    }

    
    static daysUntilExpiry(chemical: Chemical): number {
        return moment(chemical.expiry).startOf('day').diff(moment().startOf('day'), 'days');
    }
}
