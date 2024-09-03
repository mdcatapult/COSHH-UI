/*
 * Copyright 2024 Medicines Discovery Catapult
 * Licensed under the Apache License, Version 2.0 (the "Licence");
 * you may not use this file except in compliance with the Licence.
 * You may obtain a copy of the Licence at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

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
    owner: string,
    isArchived: boolean,
    hazards: Hazard[],
    hazardList: HazardListItem[],
    backgroundColour: ExpiryColor,
    lastUpdatedBy: string,
}

export type HazardListItem = {
    title: Hazard,
    activated: boolean,
    value: string
}

export type Expiry = 'Any' | '< 30 Days' | 'Expired'

export type ExpiryColor = '' | typeof yellow | typeof red
export const yellow = 'rgb(255,255,0,0.6)'; 
export const red = 'rgb(255,0,0,0.6)';

export function allHazards(): Hazard[] {
    return ALL_HAZARDS.map((e) => e);
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
] as const;

type HazardTuple = typeof ALL_HAZARDS
export type Hazard = HazardTuple[number]

export type HazardCategory = {
    name: Hazard,
    selected: boolean
}

export const columnsForExport = [
    'CAS No.',
    'Name',
    'Hazards',
    'Location',
    'Cupboard',
    'Chemical No.',
    'State',
    'Quantity',
    'Added',
    'Expiry',
    'Safety data sheet',
    'Qualio link',
    'Storage temp',
    'Owner',
    'Comments'
];





