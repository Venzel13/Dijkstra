 var questions

   (function() {
   var xhr = new XMLHttpRequest();

   xhr.open('GET', 'questions.json', true);

   xhr.send();

   xhr.onreadystatechange = function() {
     if (xhr.readyState != 4) return;
     questions = JSON.parse(xhr.responseText);


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
                  <div class='tip' ><%-list[i].tip%></div>
                <% } else { %>
                  <div><%-list[i].question%></div>
                <%}%>
              
               <%if(list[i].type == 'voluntary') { %>
                 <div><%=createVoluntary()%></div>
               <%}%>
               
               <%if(list[i].type == 'multiple') { %>
                 <div><%=createMultiple(list[i].body)%></div>
               <%}%>
               
               <%if(list[i].type == 'single') { %>
                 <div><%=createSingle(list[i].body)%></div>
               <%}%>
               

             </div>
           <%}%>`
 }

 function createVoluntary() {
   return '<input type="textarea">'
 }
 
 function createMultiple(answersArray) {


   let resultArray = answersArray.map(function(answer) {

     return "<label><input type='checkbox'>" + answer.text + "</label><br>";
   });
   

  return resultArray.join("")
 }
 
 
 function createSingle(answersArray) {



   let resultArray = answersArray.map(function(answer) {

     return "<label><input type='radio'>" + answer.text + "</label><br>";
   });

  return resultArray.join("")
 }
 

 
 function disableAnswers(disabledElements) {
   disabledElements.forEach(function(item) {
     item.disabled = !item.disabled;
   })
 }
 

 
 
 
 
