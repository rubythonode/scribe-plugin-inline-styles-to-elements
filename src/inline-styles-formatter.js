define([], function () {

  'use strict';

  /* API helpers */
  // TODO: move to shared place?

  function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }


  function appendTraversedChildrenTo(n, parentNode, mapper) {
    var child = n.firstChild;
    while (child) {
      var mappedChild = traverse(child, mapper);
      if (mappedChild) {
        parentNode.appendChild(mappedChild);
      }
      child = child.nextSibling;
    }
    return parentNode;
  }

  function appendTraversedChildren(n, mapper) {
    return appendTraversedChildrenTo(n, n.cloneNode(false), mapper);
  }

  function traverse(node, mapper) {
    return mapper(node, mapper);
  }



  /* Map style property to an element */

  function styleToElement(styleProp, styleValue, elName) {
    return function(n, mapper) {
      if (isElement(n) && n.style[styleProp] === styleValue) {
        var strongWrapper = document.createElement(elName);
        var child = n.firstChild;
        while (child) {
          // FIXME: avoid deep cloneNode here somehow? traverse?
          strongWrapper.appendChild(child.cloneNode(true));
          child = child.nextSibling;
        }

        var nCopy = n.cloneNode(false);
        nCopy.style[styleProp] = null;
        nCopy.appendChild(traverse(strongWrapper, mapper));
        return nCopy;
      } else {
        return appendTraversedChildren(n, mapper);
      }
    };
  }


  var filters = [
    styleToElement('fontWeight', 'bold',   'b'),
    styleToElement('fontStyle',  'italic', 'i'),
    styleToElement('text-decoration', 'underline',    'u'),
    styleToElement('text-decoration', 'line-through', 'strike')
    // TODO: headings?
    // TODO: clear empty styles?
  ];

  function applyFilters(node) {
    return filters.reduce(traverse, node);
  }

  return applyFilters;

});