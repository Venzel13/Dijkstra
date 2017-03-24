  (function() {
    
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'questions.json', true);

    xhr.send();
    
    function loadQuestions() {
      if (xhr.readyState != 4) return;
      var questions = JSON.parse(xhr.responseText);
      
      createQuestionnaire(questions);
    }

    xhr.onreadystatechange = loadQuestions

  })();


  function createQuestionnaire(questions) {
    var lastTip;
    for (var i = 0; i < questions.length; i++) {
      var container = createElem({type: "div", html: null, className: "container"});
      document.getElementById('questionnaire').appendChild(container);
      var header = createElem({type: "p", html: questions[i].header});
      container.appendChild(header);
      var question = createElem({type: "div", html: questions[i].question});
      container.appendChild(question);
      
      if (questions[i].tip) {
        var {tip, questionMark} = createTip(questions[i].tip);
        container.appendChild(tip);
        question.appendChild(questionMark);
        
        (function(tip) {
        questionMark.onclick = function(ev) {
          ev.stopPropagation();
          if (lastTip)
            lastTip.hidden = true;
          tip.hidden = false;
          lastTip = tip;
        };
        })(tip)
      }
      
      switch (questions[i].type) {
        case "single":
          var single = createAnswers({answers: questions[i].body, type: "radio", name: i});
          container.appendChild(single);
          break;
        case "multiple":
          var multiple = createAnswers({answers: questions[i].body, type: "checkbox"});
          container.appendChild(multiple);
          break;
        case "voluntary":
          var voluntary = createElem({type: "input"});
          container.appendChild(voluntary);
          break;
        case "ranging":
          var blockOfAnswers = createRangingBlock(questions[i].body);
          container.appendChild(blockOfAnswers);
          break;
      }
    }
    
    document.body.onclick = function() {
      if (lastTip) {
        lastTip.hidden = true;
      }
    };
  }

  function createAnswers({answers, type, name}) {
    var notNone = [];
    var uncheckedElements = [];
    var clarification;
    var elem;
    
    var blockOfAnswers = createElem({type: "div"});
    
    for (var i = 0; i < answers.length; i++) {
      var label = createElem({type: "label"});
      blockOfAnswers.appendChild(label);
      elem = createElem({type: "input"});
      label.appendChild(elem)
      elem.type = type;
      elem.name = name;
      
      uncheckElem(uncheckedElements, elem);
      
      var span = createElem({type: "span", html: answers[i].text});
      label.appendChild(span);
      
      if(answers[i].other) {
        clarification = createElem({type: "input"});
        label.appendChild(clarification);
        clarification.hidden = true;
        elem.onclick = function() {
          clarification.hidden = !clarification.hidden;
        }
      }

      if(!answers[i].none) {
        notNone.push(elem);
      } else {
        elem.onclick = function() {
          disableAnswers(notNone, clarification)
        }
      }
    }
    return blockOfAnswers
    
  }

  function createElem({type, html, className}) {
    var element = document.createElement(type);
    if (className) {
      element.classList.add(className);
    }
    if (html) {
      element.innerHTML = html;
    }
    return element;
  }
  
  function createRangingBlock(answers) {
   answers = answers.sort(compareRangingAnswers);
    
    var blockOfAnswers = createElem({type: "div"});

    var availableBlock = createElem({type: "select", html: null, className: "availableBlock"});
    var selectedBlock = createElem({type: "select", html: null, className: "selectedBlock"});
    availableBlock.size = answers.length;
    availableBlock.multiple = true;
    selectedBlock.size = answers.length;
    selectedBlock.multiple = true;
    var ASbutton = createElem({type: "button", html: ">>", className: "ASbutton"});
    var SAbutton = createElem({type: "button", html: "<<", className: "SAbutton"});
    
    blockOfAnswers.appendChild(availableBlock);
    blockOfAnswers.appendChild(ASbutton);
    blockOfAnswers.appendChild(SAbutton);
    blockOfAnswers.appendChild(selectedBlock);
    
    for (var i = 0; i < answers.length; i++) {
      var option = createElem({type: "option", html: answers[i].text});
      availableBlock.appendChild(option);
      
    }
    
    ASbutton.onclick = function() {
      for (var i = 0; i < availableBlock.options.length; i++) {
        var option = availableBlock.options[i];
        if(option.selected) {
          selectedBlock.appendChild(option);
        }
      }
    }
    
    SAbutton.onclick = function() {
      for (var i = 0; i < selectedBlock.options.length; i++) {
        var option = selectedBlock.options[i];
        if(option.selected) {
          availableBlock.insertBefore(option, availableBlock.options[1]); // correct later
        }

      }
    }
    return blockOfAnswers;
  }
  
  function compareRangingAnswers(a, b) {
    return a.text.localeCompare(b.text);
  }
  
  function mousedown() {
    this.isChecked = this.checked;
  }
  function click() {
    this.checked = !this.isChecked;
  }

// uncheck radio-button when element is clicked again
  function uncheckElem(uncheckedElements, elem) {
    uncheckedElements.push(elem);
    
    for(var i = 0; i < uncheckedElements.length; i++) {
      uncheckedElements[i].addEventListener("mousedown", mousedown.bind(uncheckedElements[i])); // onclick handler won't be rewritten
      uncheckedElements[i].addEventListener("click", click.bind(uncheckedElements[i]));
    }
  }
  
  function createTip(text) {
    var questionMark = createElem({type: "span", html: "?", className: "toggleTip"});
    var tip = createElem({type: "div", html: text, className: "tip"});
    tip.hidden = true;
    return {tip, questionMark};
  }
  
// disable not none elements
  function disableAnswers(notNone, clarification) {
    for(var i = 0; i < notNone.length; i++) {
      notNone[i].disabled = !notNone[i].disabled;
    }
    clarification.disabled = !clarification.disabled;
  }
          
