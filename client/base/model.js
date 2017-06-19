/**
 * Base model class.
 */
class Model {
  /**
   * Getter method for model properties.
   *
   * @param {string} property - Property to get.
   * @returns {any} Property stored by @see {set}.
   */
  get(property) {
    // this.notifyAll('get', property, this[property]);
    return this[property];
  }

  /**
   * Setter method for model properties.
   *
   * @param {string} property - Property name to set.
   * @param {any} value - Value associated to property.
   * @returns {any} Value that was set.
   */
  set(property, value) {
    // this.notifyAll('set', property, this[property]);
    return this[property] = value;
  }
}
