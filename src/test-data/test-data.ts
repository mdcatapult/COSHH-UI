import {Chemical} from "../app/coshh/types";
import moment from "moment";


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
    location: '',
    cupboard: '',
    owner: 'Owner 1',
    isArchived: false,
    hazards: [],
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
    expiry: moment(new Date(), 'DD-MM-YYY').add(5, 'y'),
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
    location: '',
    cupboard: '',
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