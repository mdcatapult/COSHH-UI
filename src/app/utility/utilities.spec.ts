import { isValidHttpUrl, checkDuplicates, formatString } from './utilities';

describe('isValidHttpUrl', () => {

    it('can check for valid http URLs', () => {
        const url = 'http://www.a.url.com';

        const value = isValidHttpUrl(url);

        expect(value).toBeTruthy();
    });

    it('can check for valid https URLs', () => {
        const url = 'https://www.a.url.com';

        const value = isValidHttpUrl(url);

        expect(value).toBeTruthy();
    });

    it('will reject file URLs', () => {
        const url = 'file://www.a.url.com';

        const value = isValidHttpUrl(url);

        expect(value).toBeFalse();
    });

    it('can check for invalid URLs', () => {
        const url = 'This is not a url';

        const value = isValidHttpUrl(url);

        expect(value).toBeFalse();
    });

});

describe('checkDuplicates', () => {

    it('will lower case and trim duplicate strings', () => {
        const strings = ['A', 'a', 'A ', ' a', 'a '];

        const value = checkDuplicates(strings);

        expect(value).toEqual(['a']);
    });

});


describe('formatString', () => {

    it('will replace multiple consecutive whitespace characters with a single space', () => {
        const stringToFormat = 'This is    a        string.';
        const actual = formatString(stringToFormat);
        const expected = 'this is a string.';
        expect(actual).toEqual(expected);
    });

});