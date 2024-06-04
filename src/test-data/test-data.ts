import { Chemical } from '../app/coshh/types';
import moment from 'moment';


export const chemicalOne: Chemical = {
    name: 'Chemical 1',
    chemicalNumber: '1',
    id: 0,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: 'Lab 1',
    cupboard: 'Cupboard 2',
    owner: 'Owner 1',
    isArchived: false,
    hazards: ['Explosive'],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};

export const chemicalTwo: Chemical = {
    name: 'Chemical 2',
    chemicalNumber: '2',
    id: 1,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'd'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: '',
    cupboard: '',
    owner: 'Owner 2',
    isArchived: false,
    hazards: [],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};

export const chemicalThree: Chemical = {
    name: 'Chemical 3',
    chemicalNumber: '3',
    id: 2,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: 'Lab 3',
    cupboard: 'Cupboard 3',
    owner: 'Owner 2',
    isArchived: false,
    hazards: [],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};

export const chemicalFour: Chemical = {
    name: 'Chemical 3',
    chemicalNumber: '2',
    id: 3,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: '',
    cupboard: '',
    owner: 'Owner 3',
    isArchived: false,
    hazards: [],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};

export const chemicalFive: Chemical = {
    name: 'Chemical 5',
    chemicalNumber: '',
    id: 4,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: '',
    cupboard: '',
    owner: '',
    isArchived: false,
    hazards: [],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};

export const archivedChemical: Chemical = {
    name: 'Archived Chemical',
    chemicalNumber: '101',
    id: 101,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: '',
    cupboard: '',
    owner: '',
    isArchived: true,
    hazards: [],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''

};

export const allChemicals: Chemical[] = [chemicalOne, chemicalTwo, chemicalThree, chemicalFour, chemicalFive, archivedChemical];

export const newChemical: Chemical = {
    name: 'New Chemical',
    chemicalNumber: '99',
    id: 5,
    casNumber: '987-65-4',
    matterState: 'liquid',
    quantity: '99',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(1, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: 'Lab 99',
    cupboard: 'Cupboard 99',
    owner: 'Owner 99',
    isArchived: false,
    hazards: [],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};

export const updatedChemical : Chemical = {
    name: 'Updated Chemical 1',
    chemicalNumber: '1',
    id: 0,
    casNumber: '',
    matterState: 'solid',
    quantity: '',
    added: moment(new Date(), 'DD-MM-YYY'),
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
    safetyDataSheet: '',
    coshhLink: '',
    storageTemp: 'Shelf',
    location: 'Lab 27',
    cupboard: 'Cupboard 2',
    owner: 'Owner 1',
    isArchived: false,
    hazards: ['Explosive'],
    hazardList: [],
    backgroundColour: '',
    lastUpdatedBy: ''
};