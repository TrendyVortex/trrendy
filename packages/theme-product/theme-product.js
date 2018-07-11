export function validate(product) {}

/**
 * Search through the product object and return a variant
 *
 * @param {Object} product - Product JSON object
 * @param {*} value - The targeted value. It accepts :
 * - Strings/Number (e.g. 520670707773)
 * - Object with ID key (e.g. { id: 6908198649917 })
 * - Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * - Array of values: (e.g. ["38", "Black"])
 */
export function getVariant(product, value) {
  let variant;

  if (typeof value === "string" || typeof value === "number") {
    // If value is an id
    variant = _getVariantFromId(product, value);
  } else if (typeof value === "object" && typeof value.id === "number") {
    // If value is a variant object containing an id key
    variant = _getVariantFromId(product, value.id);
  } else if (Array.isArray(value)) {
    // If value is an array of options
    if (typeof value[0] === "object") {
      // If value is a collection of options with name and value keys
      variant = _getVariantFromOptionCollection(product, value);
    } else {
      // If value is an array of option values, ordered by index of array
      variant = _getVariantFromOptionArray(product, value);
    }
  }

  return variant;
}

/**
 * Creates an array of selected values from the object
 * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
 *
 * Input ('collection' parameter): [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }];
 * Output: ['36', 'Black']
 *
 * @param {Object} product - Product JSON object
 * @param {Array} collection - Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Array} the result of the matched values.
 */
export function optionArrayFromOptionCollection(product, collection) {
  var optionArray = [];
  var indexOption = -1;

  collection.forEach(option => {
    if (typeof option.name !== "string") {
      throw Error(
        `Invalid value type passed for name of option ${indexOption}. Value should be string.`
      );
    }

    for (var i = 0; i < product.options.length; i++) {
      if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
        indexOption = i;
        break;
      }
    }

    if (indexOption === -1) {
      throw Error(`Invalid option name, ${option.name}`);
    }

    optionArray[indexOption] = option.value;
  });

  return optionArray;
}

/**
 * Find a match in the project JSON (using Object "id" key or string/number directly) and return the variant (as an Object)
 * @param {Object} product - Product JSON object
 * @param {*} id - Accepts String/Number (e.g. 6908023078973) or Object with "id" key (e.g. { id: 6908198649917 })
 * @returns {Object} the variant object once a match has been successful. Otherwise false will be returned
 */
function _getVariantFromId(product, id) {
  if (typeof product === "object") {
    return product.variants
      .filter(function(variant) {
        return variant.id === id;
      })
      .shift();
  }
  return false;
}

function _getVariantFromOptionCollection(product, collection) {
  var optionArray = optionArrayFromOptionCollection(product, collection);
  return _getVariantFromOptionArray(product, optionArray);
}

/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param {Object} product - Product JSON object
 * @param {Array} options - List of submitted values (e.g. ['36', 'Black'])
 * @returns {Object} the variant object once a match has been successful. Otherwise false will be returned
 */
function _getVariantFromOptionArray(product, options) {
  var test = product.variants
    .filter(function(variant) {
      return options.every(function(option, index) {
        return variant.options[index] === option;
      });
    })
    .shift();

  return test;
}
