  (function() {
    
    var xhr = new XMLHttpRequest();
    
    function configureRequest() {
      xhr.open('GET', 'questions.json', true);
      xhr.send();
    }
    
    configureRequest();

    function loadQuestions() {
      if (xhr.readyState != 4) return;
      var questions = JSON.parse(xhr.responseText);
      
      createQuestionnaire(questions);
    }
    xhr.onreadystatechange = loadQuestions;
  })();
  
  var lastTip;
  
  function createQuestionnaire(questions) {
    for (var i = 0; i < questions.length; i++) {
      var questionTitle = createQuestionTitle(questions[i].header, questions[i].question);
      document.getElementById('questionnaire').appendChild(questionTitle);

      if (questions[i].tip) {
        var toolTip = createTip(questions[i].tip);
        questionTitle.appendChild(toolTip);
      }
      
      var answer;
      switch (questions[i].type) {
        case "single":
          answer = createSingle;
          break;
        case "multiple":
          answer = createMultiple;
          break;
        case "voluntary":
          answer = createVoluntary;
          break;
        case "ranging":
          answer = createRanging;
          break;
      }
      questionTitle.appendChild(answer(questions[i].body, i));
    }
    document.body.addEventListener('click', function() {
      if (lastTip) { 
        lastTip.hidden = true;
      }
    });
  }
  
  function createQuestionTitle(headerText, questionText) {
    var questionBlock = document.createElement('div');
    questionBlock.className = 'container';

    var header = document.createElement('p');
    header.innerHTML = headerText;
    questionBlock.appendChild(header);
    
    var question = document.createElement('div');
    question.innerHTML = questionText;
    questionBlock.appendChild(question);
    
    return questionBlock;
  }
  
  function createTip(text) {
    var tip = document.createElement('div');
    tip.innerHTML = text;
    tip.className = 'tip';
    tip.hidden = true;
    
    var questionMark = document.createElement('span');
    questionMark.innerHTML = '?';
    questionMark.className = 'toggleTip';
    
    questionMark.addEventListener('click', showTip.bind(tip));
    function showTip(e) {
      e.stopPropagation();
      if(lastTip) {
        lastTip.hidden = true;
      }
      lastTip = this;
      this.hidden = false;
    }
    
    var toolTip = document.createElement('div');
    toolTip.className = 'toolTip';
    toolTip.appendChild(questionMark);
    toolTip.appendChild(tip);
    
    return toolTip;
  }
  
  function disable(answers, clarification)  {
    for (var i = 0; i < answers.length; i++) {
      answers[i].disabled = !answers[i].disabled;
    }
    clarification.disabled = !clarification.disabled;
  }
    
  function createClarification() {
    var clarification = document.createElement('input');
    clarification.hidden = true;
    
    return clarification;
  }
      
  function createSingle(answers, name) {
    var ul = document.createElement('ul');
    var notNone = [];
    var clarification;
    
    for (var i = 0; i < answers.length; i++) {
      ul.appendChild(createSingleAnswers(i));
    }
    
    function createSingleAnswers(i) {
      var li = document.createElement('li');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      label = document.createElement('label');
      label.innerHTML = answers[i].text;
      li.appendChild(label);
      label.insertBefore(input, label.firstChild);
          
      if(!answers[i].none) {
        notNone.push(input);
      } else {
        input.onclick = function() {
          disable(notNone, clarification);
        }
      }
        
      if(answers[i].other) {
        clarification = createClarification();
        label.appendChild(clarification);
        input.onclick = function() {
          clarification.hidden = !clarification.hidden;
        }
      }
      return li;
    }
    return ul;
  }

  function createMultiple(answers) {
    var ul = document.createElement('ul');
    var notNone = [];
    var clarification;
    
    for (var i = 0; i < answers.length; i++) {
      ul.appendChild(createMultipleAnswers());
    }
    
    function createMultipleAnswers() {
      var li = document.createElement('li');
      var input = document.createElement('input');
      input.type = 'checkbox';
      var label = document.createElement('label');
      label.innerHTML = answers[i].text;
      li.appendChild(label);
      label.insertBefore(input, label.firstChild);
      
      if(!answers[i].none) {
        notNone.push(input);
      } else {
        input.onclick = function() {
          disable(notNone, clarification);
        }
      }
      
      if(answers[i].other) {
        clarification = createClarification();
        label.appendChild(clarification);
        input.onclick = function() {
          clarification.hidden = !clarification.hidden;
        }
      }
      return li;
    }
    return ul
  }
    
  function createVoluntary() {
    var input = document.createElement('input');
    input.className = 'voluntary';
    
    return input;
  }
  
  function createRanging(answers) {
    answers = answers.sort(compare);
    
    function compare(a, b) {
      return a.text.localeCompare(b.text);
    }
    
    var selectButton;
    var returnButton;
    var availableBlock;
    var selectedBlock;
    
    function createRangingBlock() {
      var rangingBlock = document.createElement('div');
      
      availableBlock = createAvailableBlock();
      rangingBlock.appendChild(availableBlock);
      
      var buttonsBlock = createButtons();
      rangingBlock.appendChild(buttonsBlock);
      
      selectedBlock = createSelectedBlock();
      rangingBlock.appendChild(selectedBlock);
      
      selectButton.onclick = function() {
        selectOption();
      };
      returnButton.onclick = function() {
        returnOption();
      };
      return rangingBlock;
    }
    
    function createAvailableBlock() {
      availableBlock = document.createElement('select');
      availableBlock.className = 'availableBlock';
      availableBlock.size = answers.length;
      for (var i = 0; i < answers.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = answers[i].text;
        option.name = i;
        availableBlock.appendChild(option);
      }
      return availableBlock;
    }
    
    function createSelectedBlock() {
      selectedBlock = document.createElement('select');
      selectedBlock.className = 'selectedBlock';
      selectedBlock.size = answers.length;
      
      return selectedBlock;
    }
    
    function createButtons() {
      var buttonsBlock = document.createElement('div');
      buttonsBlock.className = 'buttonsBlock';
      
      selectButton = document.createElement('button');
      selectButton.innerHTML = '->';
      selectButton.className = 'selectButton';
      buttonsBlock.appendChild(selectButton);
      
      returnButton = document.createElement('button');
      returnButton.innerHTML = '<-';
      returnButton.className = 'returnButton';
      buttonsBlock.appendChild(returnButton);
      
      return buttonsBlock;
    }
    
    function selectOption() {
      for (var i = 0; i < availableBlock.length; i++) {
        var option = availableBlock.options[i];
        
        if(option.selected) {
          var returnedOption = option.cloneNode(true);
          returnedOption.name = option.name;
          selectedBlock.appendChild(returnedOption);
          option.hidden = true;
        }
      }
    }
    
    function returnOption() {
      for (var i = 0; i < selectedBlock.length; i++) {
        var option = selectedBlock.options[i];
        
        if (option.selected) {
          selectedBlock.removeChild(option);
            availableBlock.options[option.name].hidden = false;
        }
      }
    }
    return createRangingBlock();
  }
