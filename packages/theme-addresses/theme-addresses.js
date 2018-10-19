/**
 * CountryProvinceSelector Constructor
 * @param {Object} countryOptions Country JSON object
 */
export function CountryProvinceSelector(countryOptions) {
  this.countryOptions = countryOptions
}

/**
 * Helper function that builds the province selector
 */
var buildProvince = function (provinceNodeElement, provinces) {
  var defaultValue = provinceNodeElement.getAttribute('data-default');

  provinceNodeElement.innerHTML = provinces.map(function (option) {
    return '<option value="' + option[0] + '">' + option[1] + '</option>';
  }).join('');
  provinceNodeElement.value = defaultValue
}

/**
 * Helper function that determines if province selector needs to be build
 */
var resolveProvinces = function(countryNodeElement, provinceNodeElement, selectedValue, options) {
  var selectedOption = countryNodeElement.querySelectorAll('option[value="' + selectedValue +'"]')[0];
  var provinces = JSON.parse(selectedOption.getAttribute('data-provinces'));

  if (provinces.length) {
    buildProvince(provinceNodeElement, provinces)
    options && options.hideClass && provinceNodeElement.classList.remove(options.hideClass);
  }
}

/**
 * Builds the country and province selector with the given node element
 * @param {Node} countryNodeElement The select Node element for country
 * @param {Node} provinceNodeElement The select Node element for province
 * @param {Object} options Additional settings available
 *   hideClass        - The classname that will be toggled for province selector
 */
CountryProvinceSelector.prototype.build = function (countryNodeElement, provinceNodeElement, options) {
  var defaultValue = countryNodeElement.getAttribute('data-default');

  countryNodeElement.innerHTML = this.countryOptions;
  countryNodeElement.value = defaultValue;
  options && options.hideClass && provinceNodeElement.classList.add(options.hideClass);

  if (defaultValue) {
    resolveProvinces(countryNodeElement, provinceNodeElement, defaultValue, options)
  }

  // Listen for value change on the country select
  countryNodeElement.addEventListener('change', function (event) {
    var target = event.target;
    var selectedValue = target.value;
    
    provinceNodeElement.innerHTML = ''
    options && options.hideClass && provinceNodeElement.classList.add(options.hideClass);
    resolveProvinces(target, provinceNodeElement, selectedValue, options)
  });
}
