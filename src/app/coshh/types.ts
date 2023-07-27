import * as moment from 'moment';

export type Chemical = {
    id: number,
    casNumber: string,
    name: string,
    chemicalNumber: string,
    matterState: 'solid' | 'liquid',
    quantity: string,
    added: moment.Moment,
    expiry: moment.Moment,
    safetyDataSheet: string,
    coshhLink: string,
    storageTemp: 'Shelf' | '+4' | '-20' | '-80',
    location: string,
    cupboard: string,
    projectSpecific: string,
    isArchived: boolean,
    hazards: Hazard[],
    hazardList: HazardListItem[],
    backgroundColour: ExpiryColor,
    editSDS: boolean,
    editCoshh: boolean
}

export type HazardListItem = {
    title: Hazard,
    activated: boolean,
    value: string
}

export type Expiry = 'Any' | '< 30 Days' | 'Expired'

export type ExpiryColor = '' | typeof yellow | typeof red
export const yellow = 'rgb(255,255,0,0.6)' 
export const red = 'rgb(255,0,0,0.6)' 

export const columnTypes = [
    'casNumber',
    'name',
    'hazards',
    'location',
    'cupboard',
    'chemicalNumber',
    'matterState',
    'quantity',
    'added',
    'expiry',
    'safetyDataSheet',
    'coshhLink',
    'storageTemp',
    'projectSpecific',
    'archive'
]

export function allHazards(): Hazard[] {
    return ALL_HAZARDS.map(e => e)
}

const ALL_HAZARDS = [
    'None',
    'Unknown',
    'Explosive',
    'Flammable',
    'Oxidising',
    'Corrosive',
    'Acute toxicity',
    'Hazardous to the environment',
    'Health hazard/Hazardous to the ozone layer',
    'Serious health hazard',
    'Gas under pressure'
] as const

type HazardTuple = typeof ALL_HAZARDS
export type Hazard = HazardTuple[number]

export type HazardCategory = {
    name: Hazard,
    selected: boolean
}

export const columnsForExport = [
    'Name',
    'Quantity',
    'Location',
    'Safety data sheet',
    'Added',
    'Expiry',
    'Comments'
]





