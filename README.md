# scrutinise

Flexible A/B/n testing script with Google Tag Manager.

Script that supports A/B/n testing with [Google Tag Manager](http://tagmanager.google.com/).

Inspiration taken from the fantasic [CRO](https://github.com/thenextweb/cro).

## Features
------
* Supports: A/B/n testing and multivariant testing
* Integration with Google Analytics, will send data for event to the dataLayer.
* Supported via Google Tag Manager but also easily configurable to run natively.

## Usage
-------

For best results use this script in conjunction with GTM

* `testDays` - a number that is going to determine the length of time the cookie lasts
* `variantsLength` - a number that determines the number of variants per change. Make sure there are an
equal number of variants per change
* `changeRunPercentage` - a number that determines the how often (in %) that each change is shown. The remaining percentage
is the amount the vanilla cariant will show. I.E if there are 3 changes, that are shown 10% each then the original will show 70%
of the time.
* `prefix` - a string that is going to be used when the cookie name is set.
* `GATestName` - Adds a name to the data sent to GA.
* `changeLookUp` - a lookup table that replaces changeIds with labels for clearer ga reporting.
* `variantLookUp` - a lookup table that replaces variantIds with labels for clearer ga reporting.

### Add your changes and variants to this object
 ```$xslt
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
```
#### Google Analytics
To measure the variants + experiments in Google Analytics we send the data to
Google Analytics via the dataLayer. 

You'll have to create a custom report in Google Analytics to show you the
specific data for your variants.


#### Cookies
We set the cookies for the length of the test that is added in the variables at
the beginning of a test. The names and values of the cookies look like:

*Note:* We prepend the cookie name: `ab-cookie` but obviously you can change this to
whatever you'd like by changing the prefix variable: `prefix`.

