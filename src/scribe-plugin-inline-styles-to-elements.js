define([
  './inline-styles-formatter',
  './as-html-formatter'
], function (
  inlineStylesFormatter,
  asHtmlFormatter
) {

  'use strict';

  return function () {

    return function (scribe) {
      scribe.htmlFormatter.formatters.push(
        asHtmlFormatter(inlineStylesFormatter)
      );
    };
  };

});
