class Entry {
  constructor(elements, checkbox) {
    //elements is a array of all elements of the entry
    this.elements = elements || [];
    //the head item of this entry
    this.head = elements[0];
    //store the className added through this class
    this.classSet = new Set();
    // if the checkbox is unchecked, this entry will be deleted when format
    this.checkbox = checkbox || null;
  }

  removeAllElements() {
    this.elements.forEach((element) => {
      element.remove();
    });
  }

  addClassName(...className) {
    this.getClassListFunction('add')(...className);
    for (let i of className) {
      this.classSet.add(i);
    }
  }

  //   toggle(...className) {
  //     this.getClassListFunction('toggle')(...className);
  //   }

  removeClassName(...className) {
    this.getClassListFunction('remove')(...className);
    for (let i of className) {
      this.classSet.delete(i);
    }
  }

  getClassListFunction(string) {
    return (...className) => {
      for (let element of this.elements) {
        element.classList[string](...className);
      }
    };
  }
}
class Entries {
  constructor(entries) {
    //entries is a array contain the instance of Entry
    this.entries = entries;
  }

  addClassName(...className) {
    this.getGeneralFunction('addClassName')(...className);
  }

  removeClassName(...className) {
    this.getGeneralFunction('removeClassName')(...className);
  }

  getGeneralFunction(string) {
    return (...className) => {
      for (let entry of this.entries) {
        entry[string](...className);
      }
    };
  }

  addCheckbox(className) {
    // the index of entries is the id of checkbox
    // className is the className of checkbox, only able to add one className
    let id = 0;
    for (let entry of this.entries) {
      const checkbox = createCheckBox(id, className);
      const label = createLabel(id);
      entry.head.insertBefore(checkbox, entry.head.children[0]);
      if (entry.head.tagName == 'H1') {
        const h1textNode =
          entry.head.childNodes[entry.head.childNodes.length - 1];
        addParent(h1textNode, label);
      } else {
        //using different form to add label element
        const firstSpan = entry.head.querySelector('span');
        label.textContent = firstSpan.textContent;
        firstSpan.textContent = '';
        firstSpan.appendChild(label);
      }
      entry.checkbox = checkbox;
      id++;
    }

    function createCheckBox(id, className) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = className;
      checkbox.id = id;
      return checkbox;
    }

    function createLabel(htmlFor) {
      const label = document.createElement('label');
      label.htmlFor = htmlFor;
      return label;
    }

    function addParent(child, parent) {
      //child is node, parent is element
      const currentParent = child.parentNode;
      currentParent.replaceChild(parent, child);
      parent.appendChild(child);
    }
  }

  deleteUncheckedEntry() {
    for (let entry of this.entries) {
      if (!entry.checkbox.checked) {
        entry.removeAllElements();
      }
    }
  }

  static getEntries() {
    // return a array of element in the current 'div.content.api-content '
    const entries = [];
    const elements = document.body.querySelector('div.content.api-content ')
      .children;
    let entry;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (i === 0) {
        //if current element is the first element(a H1 element)
        entry = new Entry([element]);
      } else if (i == elements.length - 1) {
        //last element
        entry.elements.push(element);
        entries.push(entry);
      } else if (element.tagName == 'H1' || element.tagName == 'H2') {
        entries.push(entry);
        entry = new Entry([element]);
      } else {
        entry.elements.push(element);
      }
    }
    return entries;
  }
}

function addStylesheet(cssCode) {
  // add <style> before the fist <script>.
  const style = document.createElement('style');
  const rel = document.querySelector('script');
  rel.parentNode.insertBefore(style, rel);
  style.innerHTML = cssCode;
  return style;
}

function createButton(text, id, cssText) {
  // creat a button with given text and id
  const button = document.createElement('button');
  button.textContent = text;
  button.id = id || '';
  button.style.cssText = cssText || '';
  return button;
}
addStylesheet(`
@media print{
  input[type='checkbox'].checkbox,
  .tocify-wrapper,#formatButton{
    display: none;
  }
}
 `);
let checkboxClassName = 'checkbox';
let formatButton = createButton(
  'format',
  'formatButton',
  `position:sticky; top:0px; right:0px;z-index:99; `
);
let entries = new Entries(Entries.getEntries());
let darkBox = document.querySelector('.dark-box');
entries.addCheckbox(checkboxClassName);
darkBox.appendChild(formatButton);
formatButton.addEventListener('click', () => {
  entries.deleteUncheckedEntry();
});
