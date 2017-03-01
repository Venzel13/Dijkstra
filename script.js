 var questions

   (function() {
   var xhr = new XMLHttpRequest();

   xhr.open('GET', 'questions.json', true);

   xhr.send();

   xhr.onreadystatechange = function() {
     if (xhr.readyState != 4) return;
     questions = JSON.parse(xhr.responseText);


     tmplVoluntary = _.template(createVoluntary());

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
                 <div><%=tmplVoluntary()%></div>
               <%}%>
               

             </div>
           <%}%>`
 }

 function createVoluntary() {
   return '<input type="textarea">'
 }
 
 function createSingle() {
   return '<input type="radio">'
 }
 

 
 
 
 
