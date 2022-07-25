import * as moment from "moment";
import { Chemicals } from "./chemicals";
import { Chemical } from "./types";

describe('Chemicals', () => {


    describe('daysUntilExpiry', () => {
        
        let chem: Chemical = {
            id: 0,
            casNumber: "",
            name: "",
            photoPath: "",
            matterState: "solid",
            quantity: "",
            added: moment(),
            expiry: moment(),
            safetyDataSheet: "",
            coshhLink: "",
            storageTemp: "Shelf",
            location: "",
            isArchived: false,
            hazards: [],
            hazardList: [],
            backgroundColour: "",
            editCoshh: false,
            editSDS: false
        }

        it('should be 0 for chemical expiring today', () => {
            chem.expiry = moment()
            expect(Chemicals.daysUntilExpiry(chem)).toBe(0)
        });

        it('should be 1 for chemical expiring tomorrow', () => {
            chem.expiry = moment().add(1, 'days')
            expect(Chemicals.daysUntilExpiry(chem)).toBe(1)
        })

        it('should be -1 for chemical that expired yesterday', () => {
            chem.expiry = moment().subtract(1, 'days')
            expect(Chemicals.daysUntilExpiry(chem)).toBe(-1)
        })

        // >= because unknown amount of leap years exist in next 10 years
        it('should be >= 3650 for chemical that expires in 10 years', () => {
            chem.expiry = moment().add(10, 'years')
            expect(Chemicals.daysUntilExpiry(chem)).toBeGreaterThanOrEqual(3650)
        })

    })
  });
  