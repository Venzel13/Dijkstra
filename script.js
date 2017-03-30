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
      var question = new Question({header:questions[i].header, question:questions[i].question});
      var elem = question.getElem();
      var container = document.getElementById('questionnaire').appendChild(elem);
      
      switch(questions[i].type) {
        case "single":
          var single = new Single(questions[i].body);
          elem = single.getElem();
          container.appendChild(elem);
          break;
        case "multiple":
          var multiple = new Multiple(questions[i].body);
          elem = multiple.getElem();
          container.appendChild(elem);
          break;
        case "voluntary":
          var voluntary = document.createElement('input');
          voluntary.className = 'voluntary';
          container.appendChild(voluntary);
          break;
        case "ranging":
          break;
      }
    }
  }

  function Question(options) {
    this._optionsHeader = options.header;
    this._optionsQuestion = options.question;
  }
  
  Question.prototype.getElem = function() {
    this._createContainer();
    this._createHeader(this._optionsHeader);
    this._createQuestion(this._optionsQuestion);
    return this._container;
  };
  
  Question.prototype._createContainer = function() {
    this._container = document.createElement('div');
    this._container.className = 'container';
  };
  
  Question.prototype._createHeader = function(text) {
    this._header = document.createElement('p');
    this._header.innerHTML = text;
    this._container.appendChild(this._header);
  };
  
  Question.prototype._createQuestion = function(text) {
    this._question = document.createElement('div');
    this._question.innerHTML = text;
    this._container.appendChild(this._question);
  };
  

  function createTip(text) {
    var tip = document.createElement('div');
    tip.innerHTML = text;
    tip.className = 'tip';
    
    return tip;
  }
  
  function createQuestionMark() {
    var questionMark = document.createElement('span');
    questionMark.innerHTML = '?';
    questionMark.className = 'toggleTip';
    
    return questionMark;
  }

  function Answer(options) {
    this._options = options;
  }
  
  Answer.prototype = Object.create(Question.prototype);
  
  Answer.prototype.getElem = function() {
    this.createList();
    return this._ul;
  };
  
  Answer.prototype.createList = function() {
    this._ul = document.createElement('ul');
    for (var i = 0; i < this._options.length; i++) {
      this._li = document.createElement('li');
      this._ul.appendChild(this._li);
      this._label = document.createElement('label');
      this._label.innerHTML = this._options[i].text;
      this._li.appendChild(this._label);
      this.createCheck();
    }
  };
  
  Answer.prototype.createCheck = function() {
    throw Error("Not implemented");
  };
  
  function Single(options) {
    Answer.apply(this, arguments);
  }
  
  Single.prototype = Object.create(Answer.prototype);

  Single.prototype.createCheck = function(i) {
    var input = document.createElement('input');
    input.type = 'radio';
    input.name = i;
    this._label.insertBefore(input, this._label.firstChild);
  };
  
  function Multiple(options) {
    Answer.apply(this, arguments);
  }
  
  Multiple.prototype = Object.create(Answer.prototype);
  
  Multiple.prototype.createCheck = function() {
    var input = document.createElement('input');
    input.type = 'checkbox';
    this._label.insertBefore(input, this._label.firstChild);
  };
  
