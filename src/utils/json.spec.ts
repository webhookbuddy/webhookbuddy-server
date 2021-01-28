import 'mocha';
import { expect } from 'chai';
import { isJSON } from './json';

describe('isJSON', () => {
  it('should return false for undefined json', () => {
    expect(isJSON(undefined)).to.be.false;
  });

  it('should return false for invalid json', () => {
    expect(isJSON(`{"id: 1}`)).to.be.false;
  });

  it('should return false for string', () => {
    expect(isJSON('hello')).to.be.false;
  });

  it('should return true for json string', () => {
    expect(isJSON(`"hello"`)).to.be.true;
  });

  it('should return true for valid json', () => {
    expect(isJSON(`{"id": 1}`)).to.be.true;
  });
});
