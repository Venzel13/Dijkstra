  (function() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'questions.json', true);

    xhr.send();

    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      var questions = JSON.parse(xhr.responseText);

      createQuestionContainer(questions);
    };
  })();


  function createQuestionContainer(options) { // options объект аргументов
    var tipArr = [];
    
    for (var i = 0; i < options.length; i++) {
      var container = createContainer("div", document.getElementById('questionnaire'), null, "container");
      createContainer("p", container, options[i].header);
      var question = createContainer("div", container, options[i].question);
      

      if (options[i].tip) { // для вопросов с подсказкой
        var questionMark = createContainer("span", question, "?", "toggleTip");
        let tip = createContainer("div", container, options[i].tip, "tip"); // let решает проблему с замыканием (свой tip при каждой итерации), т.к в var tip попадает только последняя итерация i
        tip.hidden = true;
        tipArr.push(tip)

        // обработчик при клике на вопрос
        questionMark.onclick = function(event) {
          event.stopPropagation(); // событие не должно всплывать для скрытия по документу
          tip.hidden = false;
        };
      }
      // ответы для разных типов вопросов
      switch (options[i].type) {
        case "single": // radio-button
          createAnswer(container, options[i].body, "radio", i);
          
          break;
        case "multiple": // checkbox
          createAnswer(container, options[i].body, "checkbox");
          break;
        default: // textarea
          createContainer("input", container);
          break;
      }
    }
    
    // отслеживаем клик на документе
    document.body.onclick = function() {
      for (var i = 0; i < tipArr.length; i++) {
        tipArr[i].hidden = true;
      }
    };
  }

  function createAnswer(parent, answers, type, name) {
    var notNone = [];
    var radioArr = [];
    var clarification;
    var elem
    
    answers.forEach(answer => {
      var label = createContainer("label", parent);
      elem = createContainer("input", label);
      elem.type = type;
      elem.name = name;
      radioArr.push(elem);
      
      radioArr.forEach(radio => {
      radio.addEventListener("mousedown", mousedown.bind(radio));
      radio.addEventListener("click", click.bind(radio));
      });
      
      function mousedown() {
        this.isChecked = this.checked
      }
      function click() {
        this.checked = !this.isChecked
      }
      createContainer("span", label, answer.text);
      
      if(answer.other) {
        clarification = createContainer("input", label);
        clarification.hidden = true;
        elem.onclick = function() {
          clarification.hidden = !clarification.hidden;
        }
      }

      if(!answer.none) {
        notNone.push(elem);
      } else {
        elem.onclick = function() {
          notNone.forEach(function(notNoneElem) {
            notNoneElem.disabled = !notNoneElem.disabled;
          });
          clarification.disabled = !clarification.disabled;
        }
      }
    });
    return elem
  }

  function createContainer(type, parent, html, className) {
    var container = document.createElement(type);
    if (className) {
      container.classList.add(className);
    }
    if (html) {
      container.innerHTML = html;
    }
    parent.appendChild(container);
    return container;
  }
  
  
