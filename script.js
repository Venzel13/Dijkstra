  (function() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'questions.json', true);
    xhr.send();
    
    function loadQuestions() {
      if (xhr.readyState != 4) return;
      var questions = JSON.parse(xhr.responseText);
      
      createQuestionnaire(questions);
    }
    xhr.onreadystatechange = loadQuestions;
  })();
  
  function createQuestionnaire(questions) { // функция получается очень большая, хоть она и основная. Ничего? или стоит как то разбить функционал?
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
          var elem = multiple.getElem();
          container.appendChild(elem);
          break;
          
        case "voluntary":
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
  
  
  function Single(options) {
    this._options = options;
    this._ul;
  }
  
  Single.prototype.getElem = function() {
    if(!this._ul) this.createList();
    return this._ul;
  }
  
  Single.prototype.createList = function() {
    this._ul = document.createElement('ul');
    for (var i = 0; i < this._options.length; i++) {
      var li = document.createElement('li');
      this._ul.appendChild(li);
      var label = document.createElement('label');
      label.innerHTML = this._options[i].text;
      li.appendChild(label);
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = i;
      label.appendChild(input);
    }
  }
  
  function Multiple(options) {
    this._options = options;
    this._ul;
  }
  
  Multiple.prototype.getElem = function() {
    if(!this._ul) this.createList();
    return this._ul;
  }
  
  Multiple.prototype.createList = function() {
    this._ul = document.createElement('ul');
    for (var i = 0; i < this._options.length; i++) {
      var li = document.createElement('li');
      this._ul.appendChild(li);
      var label = document.createElement('label');
      label.innerHTML = this._options[i].text;
      li.appendChild(label);
      var input = document.createElement('input');
      input.type = 'checkbox';
      label.appendChild(input);
    }
  }
