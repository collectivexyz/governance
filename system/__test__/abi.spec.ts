import { getKeyAsEthereumKey } from '../abi';

describe('getKeyAsEthereumKey', () => {
  it('must return a valid eth key', () => {
    const key = getKeyAsEthereumKey('13l43k3k34jkj3kl');
    expect(key.startsWith('0x')).toBeTruthy();
  });
  it('must not alter a valid eth key', () => {
    const key = '0xarglebargleglophgliph';
    expect(getKeyAsEthereumKey(key)).toBe('0xarglebargleglophgliph');
  });
});
