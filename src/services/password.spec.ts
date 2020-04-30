import 'mocha';
import { expect } from 'chai';
import { hashPassword, verifyPassword } from './password';

// assertions: https://www.chaijs.com/

describe('hashPassword', () => {
  it('should return hash and salt', () => {
    const result = hashPassword('1Password');
    expect(result).to.have.property('hash');
    expect(result).to.have.property('salt');
  });

  it('should return 1024 length hash and 32 length salt', () => {
    const result = hashPassword('1Password');
    expect(result.hash).to.have.lengthOf(1024);
    expect(result.salt).to.have.lengthOf(32);
  });

  it('should throw for null password', () => {
    expect(() => hashPassword(null)).to.throw();
  });
});

describe('verifyPassword', () => {
  it('should return true if password hash matches', () => {
    const password = '1Password';
    const hash = hashPassword(password);
    const result = verifyPassword(password, hash.hash, hash.salt);
    expect(result).to.equal(true);
  });

  it('should return true for correct password', () => {
    const result = verifyPassword(
      `1Password`,
      'b9e5e7d8c23c74cb13ca3ac29067959d46785786e89fd781acf724c9946e415113ed4a3e5661c1e909a8652b9cfe04919a6ecd491e21e73cab14b760033184edd11ec17a851aae5b439df716242fcafeac5fc02dc3a2b64a41f2bf4ba5c1573d7290353d7e86741735f69f82090f53030e4c8e6cbf737d4431112be57f91546653a8282d11f6d1ef23282fb8f8cc02634e317ddae6757f39a0b55ef2fdfc612f2bf921350e49f0c55565f90d0c4a2e95bb13889d4838a8aed013c87419ded41f4a392e7f1f38c16590a69c53a3decaa11938bcda81aeb395069f3a09733408fc5f792c026883974e72e0c788a75936cb0a189eef1c0ffb27e733cbe929d434ea4e3380a18839f4eaf11852185bf0c48bf25a2df8675072f9e8d29ff374e19a2cf6ccb749ba1cb90917d495d4d9a9d632b4161e3107411ae2a15b02a2d09a1ff24b7f939bdb3d15c5df618063ec0f8188164c411accb06b594e26ba0bcb8bf1e97a5ed694e6fba4746b10ee3b99bdac46e2fcc0414a66ff4956824522601c42f1891a1159c7d56f3222b8f349cbd17f2451eb9e5168bd9edcc08e95a5d476fcbe50758cae6c122d75b4e85d99e11a6acf1ec399508f31ecf700739b61464243da31a599b414b0b4c6417d7295a50b1d4a2d29e24b2dfca5005e3b16a4102944b3aab5eeacecb31bd199c0cbedee175b855804778f30d58d6d2eb3ce5c5be7c2ff',
      '2d2c69463bbcbec8b271b5fd610197c6',
    );
    expect(result).to.equal(true);
  });

  it('should return false for incorrect password', () => {
    const result = verifyPassword(
      `2Password`,
      'b9e5e7d8c23c74cb13ca3ac29067959d46785786e89fd781acf724c9946e415113ed4a3e5661c1e909a8652b9cfe04919a6ecd491e21e73cab14b760033184edd11ec17a851aae5b439df716242fcafeac5fc02dc3a2b64a41f2bf4ba5c1573d7290353d7e86741735f69f82090f53030e4c8e6cbf737d4431112be57f91546653a8282d11f6d1ef23282fb8f8cc02634e317ddae6757f39a0b55ef2fdfc612f2bf921350e49f0c55565f90d0c4a2e95bb13889d4838a8aed013c87419ded41f4a392e7f1f38c16590a69c53a3decaa11938bcda81aeb395069f3a09733408fc5f792c026883974e72e0c788a75936cb0a189eef1c0ffb27e733cbe929d434ea4e3380a18839f4eaf11852185bf0c48bf25a2df8675072f9e8d29ff374e19a2cf6ccb749ba1cb90917d495d4d9a9d632b4161e3107411ae2a15b02a2d09a1ff24b7f939bdb3d15c5df618063ec0f8188164c411accb06b594e26ba0bcb8bf1e97a5ed694e6fba4746b10ee3b99bdac46e2fcc0414a66ff4956824522601c42f1891a1159c7d56f3222b8f349cbd17f2451eb9e5168bd9edcc08e95a5d476fcbe50758cae6c122d75b4e85d99e11a6acf1ec399508f31ecf700739b61464243da31a599b414b0b4c6417d7295a50b1d4a2d29e24b2dfca5005e3b16a4102944b3aab5eeacecb31bd199c0cbedee175b855804778f30d58d6d2eb3ce5c5be7c2ff',
      '2d2c69463bbcbec8b271b5fd610197c6',
    );
    expect(result).to.equal(false);
  });

  it('should throw for null password', () => {
    expect(() =>
      verifyPassword(
        null,
        'b9e5e7d8c23c74cb13ca3ac29067959d46785786e89fd781acf724c9946e415113ed4a3e5661c1e909a8652b9cfe04919a6ecd491e21e73cab14b760033184edd11ec17a851aae5b439df716242fcafeac5fc02dc3a2b64a41f2bf4ba5c1573d7290353d7e86741735f69f82090f53030e4c8e6cbf737d4431112be57f91546653a8282d11f6d1ef23282fb8f8cc02634e317ddae6757f39a0b55ef2fdfc612f2bf921350e49f0c55565f90d0c4a2e95bb13889d4838a8aed013c87419ded41f4a392e7f1f38c16590a69c53a3decaa11938bcda81aeb395069f3a09733408fc5f792c026883974e72e0c788a75936cb0a189eef1c0ffb27e733cbe929d434ea4e3380a18839f4eaf11852185bf0c48bf25a2df8675072f9e8d29ff374e19a2cf6ccb749ba1cb90917d495d4d9a9d632b4161e3107411ae2a15b02a2d09a1ff24b7f939bdb3d15c5df618063ec0f8188164c411accb06b594e26ba0bcb8bf1e97a5ed694e6fba4746b10ee3b99bdac46e2fcc0414a66ff4956824522601c42f1891a1159c7d56f3222b8f349cbd17f2451eb9e5168bd9edcc08e95a5d476fcbe50758cae6c122d75b4e85d99e11a6acf1ec399508f31ecf700739b61464243da31a599b414b0b4c6417d7295a50b1d4a2d29e24b2dfca5005e3b16a4102944b3aab5eeacecb31bd199c0cbedee175b855804778f30d58d6d2eb3ce5c5be7c2ff',
        '2d2c69463bbcbec8b271b5fd610197c6',
      ),
    ).to.throw();
  });

  it('should return false for null hash', () => {
    const result = verifyPassword(
      `1Password`,
      null,
      '2d2c69463bbcbec8b271b5fd610197c6',
    );
    expect(result).to.equal(false);
  });
});
