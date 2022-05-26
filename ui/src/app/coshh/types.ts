import * as moment from 'moment';

export type Chemical = {
    id: number,
    casNumber: string,
    name: string,
    photoPath: string,
    matterState: 'solid' | 'liquid',
    quantity: string,
    added: moment.Moment,
    expiry: moment.Moment,
    safetyDataSheet: string,
    coshhLink: string,
    storageTemp: 'Shelf' | '+4' | '-20' | '-80',
    location: string,
    isArchived: boolean,
    hazards: Hazard[]
    backgroundColour: string
}

export type Expiry = 'Any' | '< 30 Days' | 'Expired'


export const columnTypes = [
    'casNumber',
    'name',
    'hazards',
    'location',
    'photoPath',
    'matterState',
    'quantity',
    'added',
    'expiry',
    'safetyDataSheet',
    'coshhLink',
    'storageTemp',
    'archive'
]

export function allHazards(): Hazard[] {
    return ALL_HAZARDS.map(e => e)
}

const ALL_HAZARDS = [
    'None',
    'Explosive',
    'Flammable',
    'Oxidising',
    'Corrosive',
    'Acute toxicity',
    'Hazardous to the environment',
    'Health hazard/Hazardous to the ozone layer',
    'Serious health hazard',
    'Gas under pressure',
] as const

type HazardTuple = typeof ALL_HAZARDS
export type Hazard = HazardTuple[number]

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
        const i = this.chemicals.findIndex(chem => chem.id === chemical.id)
        this.chemicals[i] = chemical;
    }

    private static filterExpiryDate(chemical: Chemical, expiry: Expiry): boolean {
        console.log('expiry', expiry)
        console.log('chemical', chemical)
        if (expiry === 'Any') {
            return true
        }

        const timeUntilExpiry = Chemicals.timeUntilExpiry(chemical)
        if (expiry === '< 30 Days') {
            return timeUntilExpiry <= 30 && timeUntilExpiry > 0
        }

        console.log('timeUntilExpiry', timeUntilExpiry)
        return timeUntilExpiry <= 0
    }

    
    static timeUntilExpiry(chemical: Chemical): number {
        const expiryDate = new Date(chemical.expiry.toString());
        const currentDate = new Date();

        const difference = expiryDate.getTime() - currentDate.getTime();

        return Math.ceil(difference / (1000 * 3600 * 24));
    }
}



