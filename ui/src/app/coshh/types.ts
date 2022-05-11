import { ThisReceiver } from '@angular/compiler';
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
}


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
    get = (includeArchived: boolean, hazardCategory: string): Chemical[] => {
        return this.chemicals
            .filter(chemical => includeArchived || !chemical.isArchived)
            .filter(chemical => hazardCategory === 'All' ||
                chemical.hazards?.map(hazard => hazard.toString()).includes(hazardCategory))
    }
    add = (chemical: Chemical) => this.chemicals.push(chemical)
    set = (chemicals: Chemical[]) => this.chemicals = chemicals
    getNames = (includeArchived: boolean, hazardCategory: string, search: string): string[] => {
        return this.get(includeArchived, hazardCategory)
            .filter(chemical => chemical.name.toLowerCase().includes(search.toLowerCase()))
            .map(chemical => chemical.name)
    }
}



