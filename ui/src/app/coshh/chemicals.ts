import * as moment from "moment"
import { Chemical, Expiry } from "./types"

export class Chemicals {
    private chemicals: Chemical[] = []

    get = (includeArchived: boolean, hazardCategory: string, lab: string, expiry: Expiry): Chemical[] => {
        return this.chemicals
            .filter(chemical => includeArchived || !chemical.isArchived)
            .filter(chemical => hazardCategory === 'All' ||
                chemical.hazards?.map(hazard => hazard.toString()).includes(hazardCategory))
            .filter(chemical => lab === 'All' || chemical.location === lab)
            .filter(chemical => Chemicals.filterExpiryDate(chemical, expiry))
    }
    add = (chemical: Chemical) => this.chemicals.push(chemical)
    set = (chemicals: Chemical[]) => this.chemicals = chemicals
    getNames = (includeArchived: boolean, hazardCategory: string, search: string, lab: string, expiry: Expiry): string[] => {
        return this.get(includeArchived, hazardCategory, lab, expiry)
            .filter(chemical => chemical.name.toLowerCase().includes(search.toLowerCase()))
            .map(chemical => chemical.name)
    }

    update = (chemical: Chemical) => {
        const chemicalIndex = this.chemicals.findIndex(chem => chem.id === chemical.id)
        this.chemicals[chemicalIndex] = chemical;
    }

    private static filterExpiryDate(chemical: Chemical, expiry: Expiry): boolean {

        const timeUntilExpiry = Chemicals.daysUntilExpiry(chemical)
        switch (expiry) {
            case 'Any':
                return true
            case '< 30 Days':
                return timeUntilExpiry < 30 && timeUntilExpiry > 0
            case 'Expired':
                return timeUntilExpiry <= 0
        }
    }

    
    static daysUntilExpiry(chemical: Chemical): number {
        return moment(chemical.expiry).diff(moment(), 'days')
    }
}