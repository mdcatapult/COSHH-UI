import * as moment from 'moment';

export type Chemical = {
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
  'Health hazard',
  'Serious health hazard',
  'Gas under pressure',
] as const

type HazardTuple = typeof ALL_HAZARDS
export type Hazard = HazardTuple[number]




