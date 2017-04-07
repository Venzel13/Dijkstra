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
  
  function createQuestionnaire(questions) {
    for (var i = 0; i < questions.length; i++) {
      var questionTitle = QuestionTitle({headerText: questions[i].header, questionText: questions[i].question});
      document.getElementById('questionnaire').appendChild(questionTitle);

      if (questions[i].tip) {
        var toolTip = Tip(questions[i].tip);
        var tip = toolTip.tip;
        var questionMark = toolTip.questionMark;
        questionTitle.question.appendChild(questionMark);
        questionTitle.appendChild(tip);
      }
      
      switch (questions[i].type) {
        case "single":
          var single = Single(questions[i].body, i);
          questionTitle.appendChild(single);
          break;
        case "multiple":
          var multiple = Multiple(questions[i].body);
          questionTitle.appendChild(multiple);
          break;
        case "voluntary":
          var voluntary = Voluntary(questions[i].body);
          questionTitle.appendChild(voluntary);
          break;
        case "ranging":
          var ranging = Ranging(questions[i].body);
          questionTitle.appendChild(ranging);
          break;
      }
    }
  }
  
  function QuestionTitle(text) {
    text.headerText;
    text.questionText;
    
    function createContainer() {
      var container = document.createElement('div');
      container.className = 'container';
      return container;
    }
    var container = createContainer();
    
    function createHeader() {
      var header = document.createElement('p');
      header.innerHTML = text.headerText;
      return header;
    }
    container.appendChild(createHeader());
    
    function createQuestion() {
      var question = document.createElement('div');
      question.innerHTML = text.questionText;
      return question;
    }
    container.question = createQuestion();
    container.appendChild(container.question);
    
    return container;
  }
  
  
  function Tip(text) {
    function createTip() {
      var tip = document.createElement('div');
      tip.innerHTML = text;
      tip.className = 'tip';
      tip.hidden = true;
      return tip;
    }
    var tip = createTip();
    
    function showTip(e) {
      e.stopPropagation();
      this.hidden = false;
    }
    
    function hideTip() {
      this.hidden = true;
    }
    
    function createQuestionMark() {
      var questionMark = document.createElement('span');
      questionMark.innerHTML = '?';
      questionMark.className = 'toggleTip';
      
      questionMark.addEventListener('click', showTip.bind(tip));
      document.body.addEventListener('click', hideTip.bind(tip));
      return questionMark;
    }
    var questionMark = createQuestionMark();
    
    return {tip, questionMark};
  }
  
  
  function disable(answers, clarification)  {
    for (var i = 0; i < answers.length; i++) {
      answers[i].disabled = !answers[i].disabled;
    }
    disableClarification(clarification);
  }
    
    
    // как то надо вынести 3 функции в отдельный модуль Clarification например, а потом вызывать снаружи Clarification.createCLarification Clarification.createCLarification = createCLarification
      function createClarification() {
        var clarification = document.createElement('input');
        clarification.hidden = true;
        return clarification;
      }
      
      function toggleClarification(clarification) {
        clarification.hidden = !clarification.hidden;
      }
      
      function disableClarification(clarification) {
        clarification.disabled = !clarification.disabled;
      }
      
  function Single(answers, name) {
    function createSingleList() {
      var ul = document.createElement('ul');
      var notNone = [];
      
      for (var i = 0; i < answers.length; i++) {
        var li = document.createElement('li');
        ul.appendChild(li);
        label = document.createElement('label');
        label.innerHTML = answers[i].text;
        li.appendChild(label);
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = name;                   
        label.insertBefore(input, label.firstChild);
        
        if(!answers[i].none) {
          notNone.push(input);
        } else {
          uncheckSingle(input);
          input.onclick = function() {
            disable(notNone, clarification);
          }
        }
        if(answers[i].other) {
          var clarification = createClarification();
          label.appendChild(clarification);
          input.onclick = function() {
            toggleClarification(clarification);
          }
        }
      }
      return ul;
    }
    
    function uncheckSingle(uncheckedElem) {
      uncheckedElem.addEventListener('mousedown', mousedown.bind(uncheckedElem));
      uncheckedElem.addEventListener('click', click.bind(uncheckedElem));
      
      function mousedown() {
        this.isChecked = this.checked;
      }
      function click() {
        this.checked = !this.isChecked;
      }
    }
    return createSingleList();
  }

  function Multiple(answers) {
    function createMultipleList() {
      var ul = document.createElement('ul');
      var notNone = [];
      
      for (var i = 0; i < answers.length; i++) {
        var li = document.createElement('li');
        ul.appendChild(li);
        label = document.createElement('label');
        label.innerHTML = answers[i].text;
        li.appendChild(label);
        var input = document.createElement('input');
        input.type = 'checkbox';
        label.insertBefore(input, label.firstChild);
        
        if(!answers[i].none) {
          notNone.push(input);
        } else {
          input.onclick = function() {
            disable(notNone, clarification);
          }
        }
        if(answers[i].other) {
          var clarification = createClarification();
          label.appendChild(clarification);
          input.onclick = function() {
            toggleClarification(clarification);
          }
        }
      }
      return ul;
    }
    return createMultipleList();
  }
  
  
  function Voluntary(answers) {
    var input = document.createElement('input');
    input.className = 'voluntary';
    
    return input;
  }
  
  
  function Ranging(answers) {
    answers = answers.sort(compare);
    
    function compare(a, b) {
      return a.text.localeCompare(b.text);
    }
    
    var selectButton;  // возможно ли избавиться от глобальной переменной?
    var returnButton; // возможно ли избавиться от глобальной переменной?
    
    function createRangingBlock() {
      var rangingBlock = document.createElement('div');
      
      var availableBlock = createAvailableBlock();
      rangingBlock.appendChild(availableBlock);
      
      var buttonsBlock = createButtons();
      rangingBlock.appendChild(buttonsBlock);
      
      var selectedBlock = createSelectedBlock();
      rangingBlock.appendChild(selectedBlock);
      
      selectButton.onclick = function() {
        selectOption(availableBlock, selectedBlock);
      };
      returnButton.onclick = function() {
        returnOption(availableBlock, selectedBlock);
      };
      return rangingBlock;
    }
    
    var rangingBlock = createRangingBlock();
    
    function createAvailableBlock() {
      var availableBlock = document.createElement('select');
      availableBlock.className = 'availableBlock';
      availableBlock.size = answers.length;
      for (var i = 0; i < answers.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = answers[i].text;
        option.i = i;                                           // сменить i на name   save initial index
        availableBlock.appendChild(option);
      }
      return availableBlock;
    }
    
    function createSelectedBlock() {
      var selectedBlock = document.createElement('select');
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
    
    function selectOption(availableBlock, selectedBlock) {
      for (var i = 0; i < availableBlock.length; i++) {
        var option = availableBlock.options[i];
        
        if(option.selected) {
          selectedBlock.appendChild(option);
        }
      }
    }
    
    function returnOption(availableBlock, selectedBlock) {
      for (var i = 0; i < selectedBlock.length; i++) {
        var option = selectedBlock.options[i];
        // search for a convenient index so as to put an element into a correct place
        for (var j = 0; j < availableBlock.length; j++) {
          
          if (availableBlock.options[j].i >= selectedBlock.options[i].i) {
            break;
          }
        }
        
        if (option.selected) {
          availableBlock.insertBefore(option, availableBlock.options[j]);
        }
      }
    }
    return createRangingBlock();
  }
