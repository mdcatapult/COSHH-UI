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
  coshhLink: string
}

export const columnTypes = ['casNumber',
  'chemicalName',
  'photoPath',
  'matterState',
  'quantity',
  'added',
  'expiry',
  'safetyDataSheet',
  'coshhLink']
