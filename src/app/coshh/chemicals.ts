import * as moment from 'moment';
import { Chemical, Expiry } from './types';

export class Chemicals {
    private chemicals: Chemical[] = [];

    add = (chemical: Chemical) => this.chemicals.push(chemical);
    set = (chemicals: Chemical[]) => this.chemicals = chemicals;

    update = (chemical: Chemical) => {
        const chemicalIndex = this.chemicals.findIndex((chem) => chem.id === chemical.id);

        this.chemicals[chemicalIndex] = chemical;
    };

}
