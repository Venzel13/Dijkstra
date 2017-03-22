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


  function createQuestionnaire(questions) { // questions объект аргументов
    var lastTip;
    for (var i = 0; i < questions.length; i++) {
      var container = createElem({type: "div", html: null, className: "container"});
      document.getElementById('questionnaire').appendChild(container);
      var header = createElem({type: "p", html: questions[i].header});
      container.appendChild(header);
      var question = createElem({type: "div", html: questions[i].question});
      container.appendChild(question);
      
      if (questions[i].tip) {
        let {tip, questionMark} = createTip(questions[i].tip);
        container.appendChild(tip);
        question.appendChild(questionMark);
        
        // обработчик при клике на вопрос
        questionMark.onclick = function(ev) {
          ev.stopPropagation();
          if (lastTip)
            lastTip.hidden = true;
          tip.hidden = false;
          lastTip = tip;
        };
      }
      
      // ответы для разных типов вопросов
      switch (questions[i].type) {
        case "single":
          createAnswers({parent: container, answers: questions[i].body, type: "radio", name: i});
          break;
        case "multiple":
          createAnswers({parent: container, answers: questions[i].body, type: "checkbox"});
          break;
        case "voluntary":
          var voluntary = createElem({type: "input"});
          container.appendChild(voluntary);
          break;
      }
    }
    // отслеживаем клик на документе
    document.body.onclick = function() {
      if (lastTip) {
        lastTip.hidden = true;
      }
    };
  }

// создает варианты ответов для каждого контейнера с вопросом
  function createAnswers(answersProperty) {
    var parent = answersProperty.parent;
    var answers = answersProperty.answers;
    var type = answersProperty.type;
    var name = answersProperty.name
    
    var notNone = [];
    var uncheckedElements = [];
    var clarification;
    var elem;
    
    for(var i = 0; i < answers.length; i++) {
      var label = createElem({type: "label"});
      parent.appendChild(label);
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
    return elem
    
  }

// создает контейнер с вопросом
  function createElem(elementProperty) {
    var type = elementProperty.type;
    var html = elementProperty.html;
    var className = elementProperty.className;
    
    var element = document.createElement(type);
    if (className) {
      element.classList.add(className);
    }
    if (html) {
      element.innerHTML = html;
    }
    return element;
  }
  
  function mousedown() {
    this.isChecked = this.checked;
  }
  function click() {
    this.checked = !this.isChecked;
  }

// снимает выделение с radio при повторном клике  
  function uncheckElem(uncheckedElements, elem) {
    uncheckedElements.push(elem);
    
    for(var i = 0; i < uncheckedElements.length; i++) {
      uncheckedElements[i].addEventListener("mousedown", mousedown.bind(uncheckedElements[i])); // не перезапишет обработчик onclick
      uncheckedElements[i].addEventListener("click", click.bind(uncheckedElements[i]));
    }
  }
  
// создает всплывающую подсказку
  function createTip(text) {
    var questionMark = createElem({type: "span", html: "?", className: "toggleTip"});
    var tip = createElem({type: "div", html: text, className: "tip"});
    tip.hidden = true;
    return {tip, questionMark};
  }
  
// дизейблит все !none элементы
  function disableAnswers(notNone, clarification) {
    for(var i = 0; i < notNone.length; i++) {
      notNone[i].disabled = !notNone[i].disabled;
    }
    clarification.disabled = !clarification.disabled;
  }
  
          
