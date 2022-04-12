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

export type Hazard = 'None' |
'Explosive' |
'Flammable' |
'Oxidising' |
'Corrosive' |
'Acute toxicity' |
'Hazardous to the environment' |
'Ozone' |
'Serious health hazard' |
'Gas under pressure'


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
