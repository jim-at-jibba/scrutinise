/**
 * @desc scrutinise is a flxible A/B testing script. The script was written to be used in Google Tag Manager (GTM) Environment
 * But can just as easily be used in different settings.
 *
 * @name Scrutinise
 */

var testDays = 8;
var randomNumber = Math.round(Math.random() * 100);
var variantsLength = 2;
var changeRunPercentage = 10;
var prefix = 'ab-cookie';
var GATestName = 'ABHomePageTesting';
var percents = [];
var variants = [];
var changes;
var changeLookUp;
var variantLookUp;
var DEV = true;

/**
 * @desc The lookup table used to match labels to changeIds when adding event tracking
 *
 * @type {Object}
 */
changeLookUp = {
  0: function() {
    return '';
  },
  1: function() {
    return '';
  },

};

/**
 * @desc The lookup table used to match labels to variantIds when adding event tracking
 *
 * @type {Object}
 */
variantLookUp = {
  0: function() {
    return '';
  },
  1: function() {
    return '';
  }
};

/**
 * @desc The lookup table used giving percentages for test coverage
 *
 * @type {Object}
 */
var percentageLookup = {
  // 2 variants - 50%
  2: function() {
    return percents = [50,100];
  },
  3: function() {
    // 3 variants - 33%ish
    return percents = [33, 67, 100];
  },
  4: function() {
    // 4 variants - 25%
    return percents = [25, 50, 75, 100];
  },
  5: function() {
    // 5 variants - 20%
    return percents = [20, 40, 60, 80, 100];
  }
};

/**
 * @desc The object containing the test variants
 *
 * @type {Object}
 */
changes = {
  0: {
    variants: {
      0: {
        execute: function () {
          //
        }
      },
      1: {
        execute: function () {
          //
        }
      }
    }
  },
  1: {
    variants: {
      0: {
        execute: function () {
          //
        }
      },
      1: {
        execute: function () {
          //
        }
      }
    }
  },
  2: {
    variants: {
      0: {
        execute: function () {
          //
        }
      },
      1: {
        execute: function () {
          //
        }
      }
    }
  }
};


/**
 * @desc return array index based on comparison of random number and percentage
 *
 * @param {Array} percentageArray - contains max value for percentage bracket.
 *
 * @returns {number} - The index of the percentage
 */
function generateTestBracket(percentageArray) {
  var ranNum = Math.round(Math.random() * 100);

  if(DEV) {
    console.log(percentageArray);
    console.log('Random Number', ranNum);
  }

  for(var i = 0; percentageArray.length; i++) {
    if(percentageArray[i] >= ranNum) {
      if(DEV) {
        console.log('Percentage position', i);
        console.log('Variable %:', percentageArray[i]);
      }
      return i;
      break;
    }
  }
}

/**
 * @desc creates tests and sends data to GA via GTM datelayer
 */
function createABtest() {

  var changesLength = Object.keys(changes).length;
  var noVariant = 100 - (Object.keys(changes).length * changeRunPercentage);
  var remainingPercentage = 100 - noVariant;

  if(DEV) {
    console.log('====== Test variants are being added to ' + remainingPercentage + '% of page views ======');
    console.log(randomNumber);
  }

  // No variants showing - normal view
  if (randomNumber <= noVariant) {
    sendDimension(null);
  } else {
    var changePercent = percentageLookup[changesLength]();
    var variantPercent = percentageLookup[variantsLength]();
    var changeID = generateTestBracket(changePercent);
    var variantID = generateTestBracket(variantPercent);

    var variantCookieValue = changeID + '.' + variantID;
    createCookie(prefix + '-cookie', variantCookieValue, testDays);

    changes[changeID]['variants'][variantID].execute();
    sendDimension(changeID, variantID);
  }
}

function sendDimension(changeID, variantID) {
  if (changeID != null) {
    if(DEV) { console.log('Sending to GA:', changeLookUp[ changeID ](), variantLookUp[ variantID ]()); }
    dataLayer.push({ 'event': GATestName, 'eventCategory': GATestName, 'eventAction': prefix + '-' + changeLookUp[ changeID ]() + '-' + variantLookUp[ variantID ](), 'eventLabel': prefix + '-' + changeLookUp[ changeID ]() + '-' + variantLookUp[ variantID ](), 'eventNonInteraction': 1 });
  } else {
    if(DEV) { console.log('Tracking Non variants view'); }
    dataLayer.push({ 'event': GATestName, 'eventCategory': GATestName, 'eventAction': prefix + '-orignal-layout', 'eventLabel': prefix + '-orignal-layout', 'eventNonInteraction': 1 });
  }
}

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * @desc Creates cookie
 *
 * @param name
 * @param value
 * @param days
 *
 * @returns {*}
 */
function createCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

/**
 * @desc Reads Cookie
 *
 * @param name
 *
 * @returns {*}
 */
function readCookie(name) {
  var nameString = name + '=';
  var testCookie = document.cookie.split(';');

  for (var i = 0; i < testCookie.length; i++) {
    var c = testCookie[ i ];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameString) == 0) {
      return c.substring(nameString.length, c.length);
    }
  }
  return null;
}

/**
 * @desc Check Cookie
 *
 * @param name
 *
 * @returns {boolean}
 */
function checkCookie(name) {
  var testCookie = document.cookie.split(';');
  for (var i = 0; i < testCookie.length; i++) {
    var c = testCookie[ i ];
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(name) > -1) {
      return true;
    }
  }
  return false;
}

/**
 * @desc Erase cookie
 *
 * @param name
 *
 * @return {*}
 */
function eraseCookie(name) {
  createCookie(name, '', -1);
}


/**
 * Set up and run ab testing script
 */
for (var j in changes) {
  for (var x in changes[ j ][ 'variants' ]) {
    variants.push(j + '.' + x);
  }
}

if (readCookie(prefix + '-cookie')) {
  if(variants.indexOf(readCookie(prefix + '-cookie')) != -1) {
    var currentCookie = readCookie(prefix + '-cookie').split('.');
    var currentChangeID = currentCookie[ 0 ];
    var currentVariantID = currentCookie[ 1 ];

    changes[currentChangeID]['variants'][currentVariantID].execute();
    sendDimension(currentChangeID, currentVariantID);
  } else {
    eraseCookie(prefix + '-cookie');
    createABtest();
  }
} else {
  createABtest();
}