import * as moment from 'moment';

export type Chemical = {
  casNumber: string,
  chemicalName: string,
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
}

export const columnTypes = ['casNumber',
  'chemicalName',
  'photoPath',
  'matterState',
  'quantity',
  'added',
  'expiry',
  'safetyDataSheet',
  'coshhLink',
  'hazards',
  'storageTemp',
  'location',
  'archive'
]
