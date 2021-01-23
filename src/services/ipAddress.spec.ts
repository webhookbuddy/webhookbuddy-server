import { Request } from 'express';
import 'mocha';
import { expect } from 'chai';
import ipAddress from './ipAddress';

// assertions: https://www.chaijs.com/

describe('ipAddress', () => {
  it('should return x-forwarded-for if found', () => {
    const result = ipAddress({
      headers: {
        'x-forwarded-for': 'forwarded-123',
      },
      connection: {
        remoteAddress: 'remote-123',
      },
    } as any);
    expect(result).to.be.equal('forwarded-123');
  });

  it('should return remoteAddress if x-forwarded-for not found', () => {
    const result = ipAddress({
      headers: {},
      connection: {
        remoteAddress: 'remote-123',
      },
    } as any);
    expect(result).to.be.equal('remote-123');
  });

  it('should return last x-forwarded-for when there are multiple', () => {
    const result = ipAddress({
      headers: {
        'x-forwarded-for': 'forwarded-1, forwarded-2',
      },
      connection: {
        remoteAddress: 'remote-123',
      },
    } as any);
    expect(result).to.be.equal('forwarded-2');
  });

  it('should return last remoteAddress when there are multiple', () => {
    const result = ipAddress({
      headers: {},
      connection: {
        remoteAddress: 'remote-1, remote-2',
      },
    } as any);
    expect(result).to.be.equal('remote-2');
  });

  it('should return empty if there are none', () => {
    const result = ipAddress({
      headers: {},
      connection: {},
    } as any);
    expect(result).to.be.equal('');
  });
});
