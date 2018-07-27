/**
 * @jest-environment jsdom
 */
import {
  getVariant,
  createOptionArrayFromOptionCollection
} from './theme-product';
import productJson from './__fixtures__/product.json';

describe('getVariant()', () => {
  test('is a function exported by theme-product.js', () => {
    expect(typeof getVariant).toBe('function');
  });

  test('throws an error if parameters are missing', () => {
    expect(() => {
      getVariant();
    }).toThrow();

    expect(() => {
      getVariant({});
    }).toThrow();

    expect(() => {
      getVariant(null, {});
    }).toThrow();
  });

  test('throws an error if product json object is empty', () => {
    expect(() => {
      getVariant({}, 6908023078973);
    }).toThrow();
  });

  test('returns a product variant object when a match is found', () => {
    const variant = getVariant(productJson, 6908023078973);
    expect(variant).toEqual(productJson.variants[0]);
  });

  test('returns an empty object when called with arguments with no succesful matches', () => {
    const variant = getVariant(productJson, 6909083098073);
    expect(variant).toEqual({});
  });

  test("returns a product variant object when called with an object with 'id' key", () => {
    const variant = getVariant(productJson, { id: 6908198649917 });
    expect(variant).toEqual(productJson.variants[2]);
  });

  test("returns a product variant object when called with collection's options with 'name' and 'value' keys", () => {
    const collections = [
      {
        name: 'Size',
        value: '36'
      },
      {
        name: 'Color',
        value: 'Black'
      }
    ];

    const variant = getVariant(productJson, collections);
    expect(variant).toEqual(productJson.variants[0]);
  });

  test('returns an empty object when called with a collection of options with invalid values', () => {
    const collections = [
      {
        name: 'Size',
        value: '10'
      },
      {
        name: 'Color',
        value: 'Purple'
      }
    ];

    const variant = getVariant(productJson, collections);
    expect(variant).toEqual({});
  });

  test('returns a product variant object when called with an array of values', () => {
    const arrayValues = ['38', 'Black'];
    const variant = getVariant(productJson, arrayValues);
    expect(variant).toEqual(productJson.variants[2]);
  });

  test('returns an empty object when when called with an array of invalid values', () => {
    const arrayValues = ['45', 'Black'];

    const variant = getVariant(productJson, arrayValues);
    expect(variant).toEqual({});
  });
});

describe('createOptionArrayFromOptionCollection', () => {
  test('is a function exported by theme-product.js', () => {
    expect(typeof createOptionArrayFromOptionCollection).toBe('function');
  });

  test('throws an error if parameters are missing', () => {
    expect(() => {
      createOptionArrayFromOptionCollection();
    }).toThrow();

    expect(() => {
      createOptionArrayFromOptionCollection(productJson);
    }).toThrow();
  });

  test('throws an error if the second parameter has invalid type', () => {
    expect(() => {
      createOptionArrayFromOptionCollection(productJson, false);
    }).toThrow();

    expect(() => {
      createOptionArrayFromOptionCollection(productJson, {});
    }).toThrow();

    expect(() => {
      createOptionArrayFromOptionCollection(productJson, '');
    }).toThrow();

    expect(() => {
      createOptionArrayFromOptionCollection(productJson, 'test');
    }).toThrow();

    expect(() => {
      createOptionArrayFromOptionCollection(productJson, null);
    }).toThrow();

    expect(() => {
      createOptionArrayFromOptionCollection(productJson, undefined);
    }).toThrow();
  });

  test('returns an array of options when called with an object of valid keys and values', () => {
    const criteria = [
      { name: 'Size', value: '36' },
      { name: 'Color', value: 'Black' }
    ];
    const variant = createOptionArrayFromOptionCollection(
      productJson,
      criteria
    );
    const expected = ['36', 'Black'];
    expect(variant).toEqual(expected);
  });

  test("returns an empty array when called with an object of unmatched 'name' key", () => {
    const criteria = [
      { name: 'Random', value: 'test' },
      { name: 'House', value: 'Wall' }
    ];
    const variant = createOptionArrayFromOptionCollection(
      productJson,
      criteria
    );
    expect(variant).toEqual([]);
  });

  test("throws an error message when called with an object with 'name' key as absent", () => {
    const criteria = [
      { color: 'Red', image: 'myimage.jpg' },
      { property: 'Name', value: 'Random' }
    ];

    expect(() => {
      createOptionArrayFromOptionCollection(productJson, criteria);
    }).toThrow();
  });
});
