  (function() {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', 'questions.json', true);

    xhr.send();

    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      var questions = JSON.parse(xhr.responseText);

    tmplCommonContainer = _.template(createCommonContainer());

    document.getElementById('template').innerHTML = tmplCommonContainer({
      list: questions
    });
    }
  })();

  function createCommonContainer() {
    return `<% for(let i=0 ; i < list.length; i++) { %>
              <div class='container'>
                <p><%-list[i].header%></p>
               
                <%if(list[i].tip) { %>
                  <div> <%-list[i].question%><span class='toggleTip'>?</span></div>
                  <div class='tip' hidden><%-list[i].tip%></div>
                <% } else { %>
                  <div><%-list[i].question%></div>
                <%}%>
              
                <%if(list[i].type == 'voluntary') { %>
                  <div><%=createVoluntary()%></div>
                <%}%>
               
                <%if(list[i].type == 'multiple') { %>
                  <div><%=createMultiple(list[i].body, i)%></div>
                <%}%>
               
                <%if(list[i].type == 'single') { %>
                  <div><%=createSingle(list[i].body, i)%></div>
                <%}%>
              </div>
            <%}%>`
  }

  function createVoluntary() {
    return '<input type="textarea">'
  }

  function createMultiple(answersArray, i) {
    let resultArray = answersArray.map(function(answer) {
    if (answer.other) {
      return "<label><input type='checkbox' onclick='toggleClarification(" + i + ")' class='notNone" + i + "'>" + answer.text + "<input class='clarification" + i + "' hidden></label><br>"
    }
    
    if (!answer.none) {
      return "<label><input type='checkbox' class='notNone" + i + "'>" + answer.text + "</label><br>";
    } else {
      return "<label><input type='checkbox' onclick='disableAnswers(" + i + ")'>" + answer.text + "</label><br>";
    }
    });
    return resultArray.join("")
  }

  function createSingle(answersArray, i) {
    let resultArray = answersArray.map(function(answer) {
      if (answer.other) {
        return "<label><input type='radio' name=" + i + " onclick='toggleClarification(" + i + ")' class='notNone" + i + "'>" + answer.text + "<input class='clarification" + i + "' hidden></label><br>"
      }

      if (!answer.none) {
        return "<label><input type='radio' name=" + i + " class='notNone" + i + "'>" + answer.text + "</label><br>";
      } else {
        return "<label><input type='radio' name=" + i + " onclick='disableAnswers(" + i + ")'>" + answer.text + "</label><br>";
      }
    });
    return resultArray.join("")
  }

  function disableAnswers(n) {
    let notNone = document.getElementsByClassName('notNone' + n);
    for (let i = 0; i < notNone.length; i++) {
      notNone[i].disabled = !notNone[i].disabled
    }
  }

  function toggleClarification(n) {
    let clarification = document.querySelector('.clarification' + n);
    clarification.hidden = !clarification.hidden;
  }

  document.onclick = function(event) {
    if (event.target.className == 'toggleTip') {
      openTip();
    } else {
      closeTip();
    }
  }

  function openTip() {
    event.target.closest('.container').querySelector('.tip').hidden = false;
  }

  function closeTip() {
    event.target.closest('.container').querySelector('.tip').hidden = true;
  }

  var radio = document.querySelector('input[type="radio"]');

  radio.addEventListener('click', function() {
    this.isChecked = !this.checked
  })
  
  radio.addEventListener('mousedown', function() {
    this.checked = !this.isChecked
  })
  
  
  
  
  
