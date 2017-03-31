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
      var elem = question.createContainer();
      var container = document.getElementById('questionnaire').appendChild(elem);
      
      if (questions[i].tip) {
        question.createQuestionMark();
        
        var tip = new Tip(questions[i].tip);
        elem = tip.createTip();
        container.appendChild(elem);
      }
      
      switch (questions[i].type) {
        case "single":
          var single = new Single(questions[i].body);
          elem = single.createElemList();
          container.appendChild(elem);
          break;
        case "multiple":
          var multiple = new Multiple(questions[i].body);
          elem = multiple.createElemList();
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
  
  Question.prototype.createContainer = function() {
    this._container = document.createElement('div');
    this._container.className = 'container';
    this._createHeader(this._optionsHeader);
    this._createQuestion(this._optionsQuestion);
    
    return this._container;
  };
  
  Question.prototype._createHeader = function(text) {
    var header = document.createElement('p');
    header.innerHTML = text;
    this._container.appendChild(header);
  };
  
  Question.prototype._createQuestion = function(text) {
    this._question = document.createElement('div');
    this._question.innerHTML = text;
    this._container.appendChild(this._question);
  };
  
  Question.prototype.createQuestionMark = function() {
    var questionMark = document.createElement('span');
    questionMark.innerHTML = '?';
    questionMark.className = 'toggleTip';
    this._question.appendChild(questionMark);
  };
  
  function Tip(options) {
    this._options = options;
  }
  
  Tip.prototype.createTip = function() {
    var tip = document.createElement('div');
    tip.innerHTML = this._options;
    tip.className = 'tip';
    
    return tip;
  };

  function Answer(options) {
    this._options = options;
  }
  
  Answer.prototype.createElemList = function() {
    this._ul = document.createElement('ul');
    this._notNone = [];
    for (var i = 0; i < this._options.length; i++) {
      var li = document.createElement('li');
      this._ul.appendChild(li);
      this._label = document.createElement('label');
      this._label.innerHTML = this._options[i].text;
      li.appendChild(this._label);
      this._createCheck();
      
      if (!this._options[i].none) {
        this._notNone.push(this._input);
      }
      if (this._options[i].other) {                  
        this.toggleClarification();                    
      }
      
      this.disable(i);          
    }
    return this._ul;
  };
  
  Answer.prototype._createCheck = function() {
    throw Error("Not implemented");
  };
  
  Answer.prototype.createClarification = function() {
    this._clarification = document.createElement('input');
    this._clarification.hidden = true;
    this._label.appendChild(this._clarification);
  };
  
  Answer.prototype.toggleClarification = function() {
    this.createClarification();
    var self = this;
    
    this._input.onclick = function() {
      self._clarification.hidden = !self._clarification.hidden;
    };
  };
  
  Answer.prototype.disable = function(i) {
    if(this._options[i].none) {
      var self = this;
      
      this._input.onclick = function() {
        for (i = 0; i < self._notNone.length; i++) {
          self._notNone[i].disabled = !self._notNone[i].disabled;
        }
        self._clarification.disabled = !self._clarification.disabled;
      };
    }
  };
  
  function Single(options) {
    Answer.apply(this, arguments);
  }
  
  Single.prototype = Object.create(Answer.prototype);

  Single.prototype._createCheck = function(i) {
    this._input = document.createElement('input');
    this._input.type = 'radio';
    this._input.name = i;
    this._label.insertBefore(this._input, this._label.firstChild);
  };
  
  function Multiple(options) {
    Answer.apply(this, arguments);
  }
  
  Multiple.prototype = Object.create(Answer.prototype);
  
  Multiple.prototype._createCheck = function() {
    this._input = document.createElement('input');
    this._input.type = 'checkbox';
    this._label.insertBefore(this._input, this._label.firstChild);
  };
  
