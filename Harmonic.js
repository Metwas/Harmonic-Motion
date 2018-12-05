/*
        Code by: Metwas,
        Description: Harmonic motion using the sin function,
        Date: 17/11/18,
        
        You can give this code a like or a review.
        Any questions or suggestions are welcome.

        Thanks for viewing my code.
 */


//==================================================================== Class definitions ====================================================================//

/**
 * @summary Draws a rectangle that oscillates the height of the shape
 */
class HarmonicLine {
    constructor(posX, posY, width, height,margin) {
        this.width = width || 12;
        this.margin = margin || 5;
        this.lineHeight = Math.round(height - (this.margin * 2));
        this.height = this.lineHeight;
        this.x = posX * (this.margin * this.width);
        this.y = posY * this.margin;
        this.position = 0;

        this.velocity = 60;
        this.color = getRandomColor();
    }

    // Draws the rectangle
    draw(width) {       
        _ctx.fillStyle = this.color;
        _ctx.opacity = this.opacity;
        drawCenteredRect(this.x, this.y, width, this.height);
        // restore any previous configuration state
        _ctx.restore();
    }

    // oscillates the rectangle using the Math.sin function
    oscillate(velocity,amplitudeFactor) {
        this.position += velocity;
        this.height = oscillate(this.position, this.lineHeight, amplitudeFactor);
    }
}


/**
 * @summary This class holds and manages registered HTML elements
 */
class DOMObjectCollection {
    constructor() {

        // used to hold a collection of DOM elements
        this.collection = [];
    }
}


/**
 * @summary Registers a new HTMLElementProperty to the collection
 * @param {HTMLElementProperty} property A property of type HTMLElementProperty
 * @returns The name of the newly registered element
 */
DOMObjectCollection.prototype.register = function (property) {
    if (property === null || property === 'undefined')
        return;

    if (!property instanceof HTMLElementProperty)
        return;

    if (this.collection === null) {
        this.collection = [];
    }

    // checks to see if the property has already been added
    if (!this.collection.includes(property)) {
        // check to see if the element has a custom name set, else create a new unique name
        if (property.name === null || property.name === 'undefined') {
            property.name = property.tagName + this.collection.length;

        }

        this.collection.push(property);
    }

    return property.name;
};


/**
 * @summary Registers a single or a range of HTMLElements that match a query
 * @param {String} query The query to match what elements to get
 * @param {Boolean} range The option to get a single element or a range of elements that match the query
 */
DOMObjectCollection.prototype.registerElements = function (query, range) {
    if (query === null || query === 'undefined' && !(query instanceof String))
        return;

    var _elements = {};
    if (typeof range !== null || typeof range !== 'undefined' || typeof range !== "boolean") {
        if (range)
            _elements = document.querySelectorAll(query);
        else
            _elements = document.querySelector(query);
    } else {
        _elements = document.querySelector(query);
    }

    let _length = _elements.length || 1;

    for (let i = 0; i < _length; i++) {
        let _element = _elements[i] || _elements;
        var _htmlProperty = new HTMLElementProperty(_element, true);
        // register and set the name for the input in the DOM
        _element.name = this.register(_htmlProperty);
    }
}


/**
 * @summary Updates the specified HTML element in the collection
 * @param {String} name The name of the property
 * @param {Object} newValue The new value
 * @returns {HTMLElementProperty} Returns the the newly updated property
 */
DOMObjectCollection.prototype.update = function (name, newValue) {
    if (this.collection === null || this.collection === 'undefined')
        return;

    var _property = this.getByName(name) || this.getById(name);

    if (_property === null || typeof _property === 'undefined') {
        return;
    }

    var _type = typeof _property.value;

    if (_type !== null || _type !== 'undefined' && _type === typeof newValue) {
        // update the value
        _property.set(newValue);
    }

    return _property;
};


/**
 * @summary Gets the HTMLElementProperty stored in the collection
 * @param {String} name The name of the property
 * @returns {Property} The property
 */
DOMObjectCollection.prototype.getByName = function (name) {
    if (this.collection === null || this.collection === 'undefined')
        return;

    var _property = this.collection.where(function (element, index, array) {
        if (array[index].name === name)
            return element;
    })[0];

    if (_property === null || typeof _property === 'undefined') {
        return;
    }

    return _property;
};


/**
 * @summary Gets the HTMLElementProperty stored in the collection
 * @param {String} name The name of the property
 * @returns {Property} The property
 */
DOMObjectCollection.prototype.getById = function (id) {
    if (this.collection === null || this.collection === 'undefined')
        return;

    var _property = this.collection.where(function (element, index, array) {
        if (array[index].id === id)
            return element;
    })[0];

    if (_property === null || typeof _property === 'undefined') {
        console.log("Property: " + name + " was not found in the collection");
        return null;
    }

    return _property;
};


/**
 * @summary Executes a user defined function for every element in the collection
 * @param {Function} callback The user-defined function to execute for each of the elements
 */
DOMObjectCollection.prototype.forEach = function (callback) {
    if (typeof callback !== 'function')
        return;

    for (var i = 0; i < this.collection.length; i++) {
        callback(this.collection[i]);
    }
};


/**
 * @summary This class holds information about a passed in HTML element
 */
class HTMLElementProperty {
    /**
 * @param {HTMLElement} element A HTML element present in the current document
 * @param {Boolean} createObserableProperty The option to create a obseravable attached property
 */
    constructor(element, createObserableProperty) {
        this.name = "";
        this.id = "";
        this.tagName = "";
        this.type = "";
        this.value = {};
        this.element = {};

        // Collection of complex or native javascript objects
        this.attachedProperty = {};
        this.fillProperties(element);
        if (typeof createObserableProperty === 'boolean' && createObserableProperty === true)
            this.createObservableProperty();
    }

    /**
    * @summary Searches for the element from the query in the present DOM
    * @param {String} query The query string to find a element in the document
    * @returns {HTMLElementProperty} Returns a new instance of HTMLElementProperty
    */
    static getElement(query) {
        var _element = document.querySelector(query);

        if (_element === null || typeof _element === 'undefined')
            return;

        if (!_element instanceof HTMLElement)
            return;

        return new HTMLElementProperty(_element);
    }
}


/**
 * @summary Fills in the properties from the passed in HTML element
 * @param {HTMLElement} element The HTML element present in the current document
 */
HTMLElementProperty.prototype.fillProperties = function (element) {

    if (element === null || typeof element === 'undefined')
        return;

    if (element instanceof HTMLElement) {
        this.name = element.name || element.dataset.name || null;
        this.element = element;
        this.type = element.type || element.dataset.type || null;
        this.tagName = element.tagName;
        this.id = element.id;
        this.value = element.value || element.innerHTML || "";
    }
};


/**
 * @summary Sets the value to this class and reflects the new value in the DOM. It will also updates any attached properties
 * @param {Object} value The new value to be set
 */
HTMLElementProperty.prototype.set = function (value) {
    if (value === null || typeof value === 'undefined')
        return;

    if (typeof value !== typeof this.value)
        return;

    this.value = value;
    this.refresh();
};


/**
 * @summary Refreshes all the attached properties and the HTML DOM element values to this most recent updated value
 * @param {Object} value The new value to be set
 */
HTMLElementProperty.prototype.refresh = function () {
    if (this.element === null || typeof this.element === 'undefined')
        this.element = document.getElementsByName(this.name) || document.getElementById(this.id);

    this.element.value = this.value;
    this.attachedProperty.set(this.value);
};


/**
 * @summary Attaches a observable property and syncs the values whenever they change
 * @param {ObservableProperty} observableProperty The observable property to attach and listen for changes
*/
HTMLElementProperty.prototype.attachObservableProperty = function (observableProperty) {
    if (observableProperty === null || typeof observableProperty === 'undefined')
        this.attachedProperty = observableProperty;
};


/**
 * @summary Creates a new observable property based off this property's id
*/
HTMLElementProperty.prototype.createObservableProperty = function () {
    var _observableProperty = new ObservableProperty(this.id, this.value, function (property) {
        /* 
            This callback is set call if the observable property has any changes made 
        */
        // check to see if the new value from the observable property is the same as this html element property
        if (property.value === this.value)
            return;

        this.value = property.value;
    });

    this.attachedProperty = _observableProperty;
};


/** 
* @summary This class acts as event-based wrapper for native objects
**/
class ObservableProperty {
    /**
    * @param {Object} obj A native javascript object
    */
    constructor(name, value, callback) {
        this.name = name;
        this.value = value;
        this.type = typeof this.value;

        if (typeof callback === 'function')
            this.callback = callback;
    }
}


/**
 * @summary Sets the property with the new specified value
 * @param {Object} value  The new value to be set
 * @param {Function} callback The callback function that executes after an objects value or property has changed
*/
ObservableProperty.prototype.set = function (value) {
    if (value === null || typeof value === 'undefined')
        return;

    if (typeof value === typeof this.value) {
        this.value = value;
        this.callback(this);
    }
};


//==================================================================== Global definitions ====================================================================//


// global variables for the the canvas and drawing context
var _canvas = {};
var _ctx = {};

// Window and canvas properties
var _width = window.innerWidth;
var _height = window.innerHeight;
var _backColor = "#111";


var defaults = {
    "margin" : 5,
    "width" : 12,
};

// Drawing interval
var _frames = {};

// Array for the harmonic lines to be stored
var _lines = [];

// Default number of harmonic lines
var _lineCount = _width / (defaults.width + (defaults.margin * 2));

// Start positioning
var _posX = 0;
var _posY = 0;
var _globalOffset = 0;

// set DOMObjectCollection to hold HTML elements
var _DOMObjectCollection = new DOMObjectCollection();

//==================================================================== Event handlers ====================================================================//


/**
 * @summary Event gets trigger once the window has initialized
 * @param {Event} event The event object that gets passed
 */
window.onload = function (event) {
    _canvas = document.getElementsByTagName("CANVAS")[0];
    _ctx = _canvas.getContext("2d");

    _DOMObjectCollection.registerElements("input[type=range]", true);

    load();

    _frames = window.setInterval(sketch, 1000 / 60, false);
};


/**
 * @summary Event handler for when the window detects a change in size
 * @param {Event} event The event object that gets passed
 */
window.onresize = function (event) {
    // reload the window to update the canvas dimesions and properties
    // location.reload();

    // re-load all settings required for the canvas, instead of re-loading the entire page
    load();
};


/**
 * @summary handles the range slider event
 * @param {Event} event The event object that gets passed
 */
function rangeHandler(event) {
    var _property = _DOMObjectCollection.update(event.id,event.value);
    
    // refresh the canvas if the offset range input has changed
    if(_property.id === "input-offset")
        refreshCanvas();

    setRangeValue(_property.element);
}


/**
 * @summary Begins the animation and draws the cycle for each frame
 * @param {Event} event The event object that gets passed
 */
function sketch(event) {
    _ctx.fillStyle = _backColor;
    _ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < _lines.length; i++) {
        _lines[i].draw(_DOMObjectCollection.getById("input-width").attachedProperty.value);
        _lines[i].oscillate(_DOMObjectCollection.getById("input-velocity").attachedProperty.value/200,_DOMObjectCollection.getById("input-amplitude").attachedProperty.value/100);
    }
}


//==================================================================== Helper functions =================================================================================//

/**
 * @summary Creates simple oscillation motion
 * @param {Number} angle The angle value
 * @param {Number} amplitude The amplitude value
 * @param {Number} padding the minimum stopping distance in the harmonic motion
 * @returns {Number} a value thats mapped from the padding and amplitude to values between -1 to 1 
 */
function oscillate(angle, height, amplitudeFactor) {
    return map(Math.sin(angle), -1, 1, height * amplitudeFactor, height);
}


/**
 * @summary Maps a value to a range between a specifed maximum and minimum
 * @param {Number} value The arbitrary number to be mapped
 * @param {Number} minFrom The minimum value to start
 * @param {Number} maxFrom The maximum value to start
 * @param {Number} minTo The minimum end value
 * @param {Number} maxTo The maximum end value
 * @returns {Number} a new value thats mapped correspondingly between the enter parameters
 */
function map(value, minFrom, maxFrom, minTo, maxTo) {

    if (value === null || value === 'undefined')
        return;

    return (value - minFrom) * (maxTo - minTo) / (maxFrom - minFrom) + minTo;
}


/**
 * @summary returns the center of the object based of its position and dimension
 * @param {Number} position The cartisian axis value
 * @param {Number} dimension A dimesion of a cartisian mapped shape, either width,height, radius, etc...
 * @returns {Number} The centered cartisian axis point
 */
function getCenteredCoordinates(position, dimension) {
    return (position - dimension) / 2;
}


/**
 * @summary fills a rect from the center of the rectangle first rather than the default x : 0  y : 0
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 * @param {Number} width the width of the rectangle
 * @param {Number} height the height of the rectangle
 */
function drawCenteredRect(x, y, width, height) {
    _ctx.fillRect(getCenteredCoordinates(x, width), getCenteredCoordinates(y, height), width, height);
}


/**
 * @summary Setup for the canvas properties and dimesions
 */
function load() {
    // get window dimensions
    _width = window.innerWidth;
    _height = window.innerHeight;

    _canvas.width = _width;
    _canvas.height = _height / 2;

    for (var i = 0; i < _lineCount; i++) {
        _lines[i] = new HarmonicLine(i, _canvas.height / 5, _DOMObjectCollection.getById("input-width").attachedProperty.value, _canvas.height);
        _lines[i].position += _globalOffset;
        _globalOffset += _DOMObjectCollection.getById("input-offset").attachedProperty.value/10;
    }

    var _rangeInputs = document.querySelectorAll("input[type=range]");

    for (let i = 0; i < _rangeInputs.length; i++) {
        setRangeValue(_rangeInputs[i]);
    }
}

function refreshCanvas(){
    _globalOffset = 0;

    for (var i = 0; i < _lineCount; i++) {
        _lines[i].position = 0;
        _lines[i].position += _globalOffset;
        _globalOffset += _DOMObjectCollection.getById("input-offset").attachedProperty.value/10;
    }
}


/**
 * @summary Generates a random rgb color and returns it as a string
 */
function getRandomColor() {
    return 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',1)';
}


/**
 * @summary Gets a random value between the specified minimum and maximum, with a optinal round boolean parameter
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 * @param {Boolean} round round value
 * @returns {Number} Random number
 */
function getRandomValue(min, max, round) {
    let _min = min || 0;
    let _max = max || 1;
    var _randomValue = (Math.random() * _max) - _min;

    if (round !== null || typeof round !== 'undefined' && typeof round === 'boolean')
        if (round)
            Math.floor(_randomValue);

    return _randomValue;
}


/**
 * @summary Gets the current value of a range slider and sets the value and positioning of the output container
 * @param {HTMLObjectElement} element The input range 
 */
function setRangeValue(element) {

    if (element === null || element === 'undefined')
        return;

    var _output = element.nextElementSibling;

    if (_output === null || typeof _output === 'undefined')
        return;

    var _range = element.max - element.min;
    var _position = ((element.value - element.min) / _range) * 100;
    var _posOffset = 0;
    var _datasetWidth = _output.dataset.width;

    if (_datasetWidth === null || typeof _datasetWidth === 'undefined')
        return;

    _posOffset = Math.round((_datasetWidth * _position / 100) - (_datasetWidth / 2));
    _position -= _posOffset;

    _output.innerHTML = element.value;
    _output.style.left = _position + "px";
}


/**
 * @summary Attempts to retrieve a value based of a specified key in an array
 * @param {Object} key The key or name of the element to begin the search in the array
 */
Array.prototype.get = function (key) {
    if (this.includes(key))
        return this[this.indexOf(key)];
};


/**
 * @summary Filters out the array and returns the elements that meet the condition in the callback function
 * @param {Function} filterFunction The user-defined function that takes in each of the elements in the array to be filtered
 */
Array.prototype.where = function (filterFunction) {
    if (typeof filterFunction !== 'function')
        // return the base array and don't filter anything  
        return this;

    return this.filter(filterFunction);
};


/**
 * @summary Gets the declared name of the property or variable as a string
 */
Object.prototype.getDeclarationString = function () {
    // Object.keys will return both the name and value of the object, therefore only index 0 to get the name as a string
    return Object.keys(this)[0];
};


/**
 * @summary Gets the declaration value of the object
 */
Object.prototype.getDeclarationValue = function () {
    return Object.keys(this)[1] || this.getValue(this.getDeclarationString());
};


/**
 * @summary Gets the value of the property from the object
 * @param {String} propertyName The name of the property to be retrieved
 */
Object.prototype.getValue = function (propertyName) {
    return this[this.getProperty(propertyName)];
}


/**
 * @summary Gets the specified property that is owned by the object
 * @param {String} propertyName The name of the property to be retrieved
 */
Object.prototype.getProperty = function (propertyName) {
    if (typeof propertyName !== 'string')
        return;

    for (var _prop in this) {
        if (this.hasOwnProperty(_prop) && _prop.toString().toLowerCase() === propertyName.toLowerCase()) {
            return _prop;
        }
    }
};
