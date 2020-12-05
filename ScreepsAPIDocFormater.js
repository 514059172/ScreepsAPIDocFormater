//need to refactor to make every print entry object
//
// first get every entry object then doing other operation
let apiContent = document.body.querySelector('div.content.api-content ');
let allChild = apiContent.children;
let formatClass = 'toPrint';
let formatButtonId = 'formatButton';
let cssCode = ` `;
let checkboxHeadRef = addCheckboxToPage();
let formatButton = createButton('Format', formatButtonId);
let formatButtonRel = document.querySelector('.search');

addButtonToPage(
  formatButton,
  formatButtonRel,
  format,
  checkboxHeadRef,
  formatClass,
  cssCode
);

function addButtonToPage(button, rel, callback, ...callbackParameter) {
  //add one element before given rel element.
  button.addEventListener('click', () => callback(...callbackParameter));
  rel.parentElement.insertBefore(button, rel);
}

function createButton(text, id) {
  // creat a button
  let button = document.createElement('button');
  button.textContent = text;
  button.id = id;
  return button;
}

function format(rel, formatClass, cssCode) {
  // need to hide the asider, using css or js
  // need to hide the asider, using css or js

  //add the formatClass to the element want to print
  addStylesheet(cssCode);
  // let asider = document.querySelector('.tocify-wrapper');
  // ASIDER.REMOVE();
  changeClass(getToPrintElement(rel), formatClass);
  deleteUnnecessaryElement(formatClass);
}

function createCheckBox(id, className) {
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = className;
  checkbox.id = id;
  return checkbox;
}

function createLabel(htmlFor) {
  let label = document.createElement('label');
  label.htmlFor = htmlFor;
  return label;
}

function addParent(child, parent) {
  //child is node, parent is element
  let currentParent = child.parentNode;
  currentParent.replaceChild(parent, child);
  parent.appendChild(child);
}

function addStylesheet(cssCode) {
  let style = document.createElement('style');
  let rel = document.querySelector('script');
  rel.parentNode.insertBefore(style, rel);
  style.innerHTML = cssCode;
}

function addCheckboxToPage() {
  let checkboxHead = new Map();
  let id = 0;
  let checkbox;
  for (let i = 0; i < allChild.length; i++) {
    let currentChild = allChild[i];
    let label = createLabel(id);
    if (currentChild.tagName == 'H1') {
      let h1textNode = currentChild.childNodes[1];
      checkbox = createCheckBox(id, 'H1CheckBox');
      currentChild.insertBefore(checkbox, currentChild.children[0]);
      addParent(h1textNode, label);
      checkbox.addEventListener('click', checkH1);
      checkboxHead.set(checkbox, currentChild);
      id++;
    } else if (currentChild.tagName == 'H2') {
      //using different form to add label element
      let firstSpan = currentChild.querySelector('span');
      checkbox = createCheckBox(id, 'H2CheckBox');
      label.textContent = firstSpan.textContent;
      firstSpan.textContent = '';
      currentChild.insertBefore(checkbox, firstSpan);
      firstSpan.appendChild(label);
      checkboxHead.set(checkbox, currentChild);
      id++;
    }
  }
  return checkboxHead;
}

function changeClass(nodes, className) {
  // add the className on the checked entry, remove the className on the unchecked entry
  let toPrintElements = document.querySelectorAll(className);
  for (let i of toPrintElements) {
    i.classList.remove(className);
  }
  addClass(nodes, className);
}

function addClass(nodes, className) {
  //add to one class to the given array of nodes
  //nodes is array , class is string.
  for (let element of nodes) {
    element.classList.toggle(className);
  }
}

function getToPrintElement(rel) {
  //need to refactor. after refactoring, this function don't rely on rel
  // rel is a map.
  // The key is the rel of checkbox,value is the head.
  // return a array the array contain all the elements need
  // to be printed according the order of appearance.
  //currentHead is the H1 or H2 element with checkbox
  let toPrintElements = [];
  for (let checkbox of rel.keys()) {
    let currentHead = rel.get(checkbox);
    if (checkbox.checked == true) {
      let currentElement = currentHead;
      do {
        toPrintElements.push(currentElement);
        console.log(currentElement.tagName);
        currentElement = currentElement.nextElementSibling;
      } while (
        currentElement.tagName !== 'H2' &&
        currentElement.tagName !== 'H1'
      );
    }
  }
  return toPrintElements;
}

function deleteUnnecessaryElement(formatClass) {
  let mainContent = document.querySelector('.content.api-content');
  Array.from(mainContent.children).forEach((element) => {
    if (!element.classList.contains(formatClass)) {
      element.remove();
    }
  });
  // the below approach is wrong , because the when delete element,
  //  the index of other element will change .

  // for (let i = 0; i < mainContent.children.length; i++) {
  //   let element = mainContent.children[i];
  //   console.log(element.classList.contains(formatClass));
  //   if (!element.classList.contains(formatClass)) {
  //     element.remove();
  //   }
  // }
}
function checkH1() {}
