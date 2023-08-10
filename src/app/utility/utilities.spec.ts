import { TestBed } from '@angular/core/testing';
import { isValidHttpUrl } from './utilities';

describe('isValidHttpUrl function', () => {

    it('can check for valid http URLs', () => {
        const url = "http://www.a.url.com"
        let value = isValidHttpUrl(url)
        expect(value).toBeTruthy()
    });

    it('can check for valid https URLs', () => {
        const url = "https://www.a.url.com"
        let value = isValidHttpUrl(url)
        expect(value).toBeTruthy()
    });

    it('will reject file URLs', () => {
        const url = "file://www.a.url.com"
        let value = isValidHttpUrl(url)
        expect(value).toBeFalse()
    });

    it(`can check for invalid URLs`, () => {
        const url = "This is not a url"
        let value = isValidHttpUrl(url)
        expect(value).toBeFalse()
    });

});