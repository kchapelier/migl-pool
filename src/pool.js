"use strict";

var poolId = 0,
    noop = function () {};

var Pool = function (name, factory, initialize, firstAllocationNumber, allocationNumber) {
    this.name = name;
    this.factoryFunction = factory;
    this.initializeFunction = initialize;
    this.totalInstances = 0;

    this.allocationNumber = allocationNumber;

    this.availableInstances = [];

    this.allocate(firstAllocationNumber);
};

Pool.prototype.name = null;
Pool.prototype.availableInstances = null;
Pool.prototype.totalInstances = null;
Pool.prototype.factoryFunction = null;
Pool.prototype.initializeFunction = null;
Pool.prototype.allocationNumber = null;

/**
 * Instantiate a given number of elements and add them to the collection of available instances
 * @param {number} number Number of elements to allocate
 * @private
 * @returns {Pool} Own instance for fluent interface
 */
Pool.prototype.allocate = function (number) {
    var i;

    this.totalInstances += number;

    for (i = 0; i < number; i++) {
        this.availableInstances.push(this.factoryFunction());
    }

    return this;
};

/**
 * Retrieve an element for the collection of available instances, (re)initialize and return it.
 * @param {Object} initializationOptions Options to pass to the initialize function
 * @returns {Object} Initialized element
 */
Pool.prototype.get = function (initializationOptions) {
    var element;

    // check if we still have enough available instances, instantiate new ones
    if (this.availableInstances.length < 1) {
        this.allocate(this.allocationNumber);
    }

    element = this.availableInstances.pop();

    this.initializeFunction(element, initializationOptions);

    return element;
};

/**
 * Add a given element to the pool.
 * @param {Object} element Element to add to the pool
 * @returns {Pool} Own instance for fluent interface
 */
Pool.prototype.free = function (element) {
    if (this.availableInstances.indexOf(element) === -1) {
        this.availableInstances.push(element);
    }

    return this;
};

/**
 * Clear all references.
 * @returns {Pool} Own instance for fluent interface
 */
Pool.prototype.clear = function () {
    while (this.availableInstances.length) {
        this.availableInstances.pop();
    }

    this.totalInstances = 0;

    return this;
};

/**
 * Obtain a string containing information about the pool
 * @returns {string} Information about the pool
 */
Pool.prototype.toString = function () {
    return this.name + ' : ' + this.totalInstances + ' total instances, ' + this.availableInstances.length + ' available instances';
};

module.exports = {
    /**
     * Create an object pool
     * @param {Object} options Pool options (name, factory, initialize, firstAllocationNumber, allocationNumber)
     * @returns {Pool} Instance of the object pool
     */
    create: function (options) {
        poolId++;

        return new Pool(
            options.name ? options.name + ' (pool #' + poolId + ')' : 'pool #' + poolId,
            options.factory,
            options.initialize || noop,
            options.firstAllocationNumber || 20,
            options.allocationNumber || 1
        );
    }
};
