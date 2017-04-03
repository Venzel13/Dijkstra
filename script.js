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
        elem = question.createTip(questions[i].tip);
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
          var ranging = new Ranging(questions[i].body);
          elem = ranging.createRangingBlock();
          container.appendChild(elem);
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
    
    var header = this._createHeader(this._optionsHeader);
    this._container.appendChild(header);
    
    var question = this._createQuestion(this._optionsQuestion);
    this._container.appendChild(question);
    
    return this._container;
  };
  
  Question.prototype._createHeader = function(text) {
    var header = document.createElement('p');
    header.innerHTML = text;
    
    return header;
  };
  
  Question.prototype._createQuestion = function(text) {
    this._question = document.createElement('div');
    this._question.innerHTML = text;
    
    return this._question;
  };
  
  Question.prototype.createQuestionMark = function() {
    this._questionMark = document.createElement('span');
    this._questionMark.innerHTML = '?';
    this._questionMark.className = 'toggleTip';
    this._question.appendChild(this._questionMark);
  };
  
  Question.prototype.createTip = function(text) {
    this._tip = document.createElement('div');
    this._tip.innerHTML = text;
    this._tip.className = 'tip';
    this._tip.hidden = true;
    this._questionMark.addEventListener('click', this.showTip.bind(this._tip));
    document.body.addEventListener('click', this.hideTip.bind(this._tip));

    return this._tip;
  };

  Question.prototype.showTip = function(e) {
    e.stopPropagation(); // the handler shouldn't be rewritten
    this.hidden = false;
  };
  
  Question.prototype.hideTip = function() {
    this.hidden = true;
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
      } else {
        this.uncheckSingle();
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
    
    return this._clarification;
  };
  
  Answer.prototype.toggleClarification = function() {
    var clarification = this.createClarification();
    this._label.appendChild(clarification);
    
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
    this._input.name = i;                                             // изменить поведение, чтобы name внутри одного блока был одинаков
    this._label.insertBefore(this._input, this._label.firstChild);
  };
  
  Single.prototype.uncheckSingle = function() {
    this._input.addEventListener('mousedown', this.mousedown.bind(this._input));
    this._input.addEventListener('click', this.click.bind(this._input));
  };
  
  Single.prototype.mousedown = function() {
    this._isChecked = this.checked;
  };
  
  Single.prototype.click = function() {
    this.checked = !this._isChecked;
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
  
  Multiple.prototype.uncheckSingle = function() {
  };
  
  
  function Ranging(options) {
    this._options = options;
    this._options = this._options.sort(this.compare);
  }
  
  Ranging.prototype.compare = function(a, b) {
    return a.text.localeCompare(b.text);
  };
  
  Ranging.prototype.createRangingBlock = function() {
    this._rangingBlock = document.createElement('div');
    
    var availableBlock = this._createAvailableBlock();
    this._rangingBlock.appendChild(availableBlock);
    
    var buttonsBlock = this._createButtons();
    this._rangingBlock.appendChild(buttonsBlock);
    
    var selectedBlock = this._createSelectedBlock();
    this._rangingBlock.appendChild(selectedBlock);
  
    this.selectOption();
    this.returnOption();
    
    return this._rangingBlock;
  };
  
  Ranging.prototype._createAvailableBlock = function() {
    this._availableBlock = document.createElement('select');
    this._availableBlock.className = 'availableBlock';
    this._availableBlock.size = this._options.length;
    
    for (var i = 0; i < this._options.length; i++) {
      var option = document.createElement('option');
      option.innerHTML = this._options[i].text;
      option.i = i;                                       // save initial index
      this._availableBlock.appendChild(option);
    }
    return this._availableBlock;
  };
  
  Ranging.prototype._createSelectedBlock = function() {
    this._selectedBlock = document.createElement('select');
    this._selectedBlock.className = 'selectedBlock';
    this._selectedBlock.size = this._options.length;
    
    return this._selectedBlock;
  };
  
  Ranging.prototype._createButtons = function() {
    var buttonsBlock = document.createElement('div');
    buttonsBlock.className = 'buttonsBlock';
    
    this._selectButton = document.createElement('button');
    this._selectButton.innerHTML = '->';
    this._selectButton.className = 'selectButton';
    buttonsBlock.appendChild(this._selectButton);
    
    this._returnButton = document.createElement('button');
    this._returnButton.innerHTML = '<-';
    this._returnButton.className = 'returnButton';
    buttonsBlock.appendChild(this._returnButton);
    
    return buttonsBlock;
  };
  
  Ranging.prototype.selectOption = function() {
    var self = this;
  
    this._selectButton.onclick = function() {
      for (var i = 0; i < self._availableBlock.length; i++) {
        var option = self._availableBlock.options[i];
        
        if(option.selected) {
          self._selectedBlock.appendChild(option);
        }
      }
    };
  };
  
  Ranging.prototype.returnOption = function() {
    var self = this;
    
    this._returnButton.onclick = function() {
      for (var i = 0; i < self._selectedBlock.length; i++) {
        var option = self._selectedBlock.options[i];
        
        // search for a convenient index so as to put an element into a correct place
        for (var j = 0; j < self._availableBlock.length; j++) {
          if(self._availableBlock.options[j].i >= self._selectedBlock.options[i].i) {
            break;
          }
        }
        
        if(option.selected) {
          self._availableBlock.insertBefore(option, self._availableBlock.options[j]);
        }
      }
    };
  };
  
