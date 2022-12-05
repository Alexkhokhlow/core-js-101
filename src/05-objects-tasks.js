/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return { width, height, getArea: () => width * height };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const item = JSON.parse(json);
  Object.setPrototypeOf(item, proto);
  return item;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: '',
  index: [],
  element(value) {
    if (this.index.includes(1)) {
      this.index = [];
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const result = { ...this };
    result.result = value;
    result.index = [];
    result.index.push(1);
    return result;
  },

  id(value) {
    if (this.index.includes(2)) {
      this.index = [];
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.index.forEach((item) => {
      if (item > 2) {
        this.index = [];
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    });
    this.index.push(2);
    this.result = this.result.concat(`#${value}`);
    return this;
  },

  class(value) {
    this.index.forEach((item) => {
      if (item > 3) {
        this.index = [];
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    });
    this.index.push(3);
    this.result = this.result.concat(`.${value}`);
    return this;
  },

  attr(value) {
    this.index.forEach((item) => {
      if (item > 4) {
        this.index = [];
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    });
    this.index.push(4);
    this.result = this.result.concat(`[${value}]`);
    return this;
  },

  pseudoClass(value) {
    this.index.forEach((item) => {
      if (item > 5) {
        this.index = [];
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    });
    this.index.push(5);
    this.result = this.result.concat(`:${value}`);
    return this;
  },

  pseudoElement(value) {
    this.index.forEach((item) => {
      if (item > 6) {
        this.index = [];
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    });
    if (this.index.includes(6)) {
      this.index = [];
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.index.push(6);
    this.result = this.result.concat(`::${value}`);
    return this;
  },

  combine(sel1, com, sel2) {
    this.result = sel1.stringify().concat(` ${com} `).concat(sel2.stringify());
    return this;
  },

  stringify() {
    const res = this.result;
    this.result = '';
    this.index = [];
    return res;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
