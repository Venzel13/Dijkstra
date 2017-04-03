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
    this._questionMark = document.createElement('span');
    this._questionMark.innerHTML = '?';
    this._questionMark.className = 'toggleTip';
    this._question.appendChild(this._questionMark); // убрать appendChild из createFunc(), а в других методах вызывать parentNode.appendChild(createFunc());
  };
  
  Question.prototype.createTip = function(text) {
    this._tip = document.createElement('div');
    this._tip.innerHTML = text;
    this._tip.className = 'tip';
    this.toggleTip();
    
    return this._tip;
  };
  
  Question.prototype.toggleTip = function() {
    var self = this;
    
    this._questionMark.onclick = function(e) {
      e.stopPropagation();
      self._tip.hidden = true;
    };
    document.body.onclick = function() {
      self._tip.hidden = false;
    };
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
        this.toggleClarification();                                // СКОРРЕКТИРОВАТЬ ВСЕ НЕОБХОДИМЫЕ this._ В ДОКУМЕНТЕ (на черточку)
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
    this._label.appendChild(this._clarification); //  убрать appendChild из createFunc(), а в других методах вызывать parentNode.appendChild(createFunc());
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
    
    this._createAvailableBlock();
    this._createButtons();
    this._createSelectedBlock();
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
    
    this._rangingBlock.appendChild(this._availableBlock);
  };
  
  Ranging.prototype._createSelectedBlock = function() {
    this._selectedBlock = document.createElement('select');
    this._selectedBlock.className = 'selectedBlock';
    this._selectedBlock.size = this._options.length;
    
    this._rangingBlock.appendChild(this._selectedBlock);
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
    
    this._rangingBlock.appendChild(buttonsBlock);
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
        
        // search for a convenient index so as to put an element
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
  
