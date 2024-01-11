import { Chemical } from './types';

export class Chemicals {
    private chemicals: Chemical[] = [];

    add = (chemical: Chemical) => this.chemicals.push(chemical);
    set = (chemicals: Chemical[]) => this.chemicals = chemicals;



}
