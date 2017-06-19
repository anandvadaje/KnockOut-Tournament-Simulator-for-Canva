
// Model Base class

class Model {

  //Getter method for model properties
  get(property) {
    return this[property];
  }
  
  //Setter method for model properties.
  set(property, value) {
    return this[property] = value;
  }
}
