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
      var container = document.getElementById('questionnaire').appendChild(createContainer());
      container.appendChild(createHeader(questions[i].header));
      var question = container.appendChild(createQuestion(questions[i].question));
      
      if(questions[i].tip) {
        var tip = container.appendChild(createTip(questions[i].tip));
        var questionMark = question.appendChild(createQuestionMark());
      }
      
      switch(questions[i].type) {
        case "single":
          var single = new Single(questions[i].body);
          var elem = single.getElem();
          container.appendChild(elem);
          break;
        case "multiple":
          var multiple = new Multiple(questions[i].body);
          elem = multiple.getElem();
          container.appendChild(elem);
          break;
        case "voluntary":
          var voluntary = document.createElement('input');
          container.appendChild(voluntary)
          break;
          
        case "ranging":
          break;
      }
    }
  }
  
  function createContainer() {
    var container = document.createElement('div');
    container.className = 'container';
    
    return container;
  }
  
  function createHeader(text) {
    var header = document.createElement('p');
    header.innerHTML = text;
    
    return header;
  }
  
  function createQuestion(text) {
    var question = document.createElement('div');
    question.innerHTML = text;
    
    return question;
  }
  
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
  
  
  // Common constructor
  function Answers(options) {
    this._options = options;
  }
  
  Answers.prototype.getElem = function() {
    this.createList();
    return this._ul;
  }
  
  Answers.prototype.createList = function() {
    this._ul = document.createElement('ul');
    for (this._i = 0; this._i < this._options.length; this._i++) {
      this._li = document.createElement('li');
      this._ul.appendChild(this._li);
      this._label = document.createElement('label');
      this._label.innerHTML = this._options[this._i].text;
      this._li.appendChild(this._label);
      this.createCheck();
    }
  }
  
  Answers.prototype.createCheck = function() {
    throw Error("Not implemented");
  }
  
  function Single(options) {
    Answers.apply(this, arguments);
  }
  
  Single.prototype = Object.create(Answers.prototype);
  

  Single.prototype.createCheck = function() {
    var input = document.createElement('input');
    input.type = 'radio';
    input.name = this._i;
    this._label.insertBefore(input, this._label.firstChild);
  }
  

  function Multiple(options) {
    Answers.apply(this, arguments);
  }
  
  Multiple.prototype = Object.create(Answers.prototype);
  

  Multiple.prototype.createCheck = function() {
    var input = document.createElement('input');
    input.type = 'checkbox';
    this._label.insertBefore(input, this._label.firstChild);
    
  }
