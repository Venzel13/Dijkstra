var matrix = [ // adjacency matrix
    [0,        10,       14,       Infinity, Infinity, Infinity],
    [Infinity, 0,        3,        Infinity, Infinity, Infinity],
    [Infinity, 3,        0,        12,       17,       Infinity],
    [Infinity, Infinity, Infinity, 0,        3,        9],
    [Infinity, Infinity, 17,       Infinity, 0,        4],
    [Infinity, Infinity, Infinity, 9,        Infinity, 0]
  ];
  
  function findDijkstra(matrix) {
    var vertices = [];
    
    function createVertices(start) { // add length
      for (var i = 0; i < matrix.length; i++) {
        vertices.push({
          value: Infinity,
          visited: false,
        });
      }
      vertices[start].value = 0;
    }
    
    createVertices(0);
    
    while(true) {
      var minElement = Infinity;
      var indexOfMin = -1;
      
      for (var i = 0; i < vertices.length; i++) {
        if(!vertices[i].visited) {  // only not visited vertices
        
          if(vertices[i].value < minElement) {
            minElement = vertices[i].value; // the min (unmarked) element from the current massive
            indexOfMin = i;
          }
        }
      }
      if (indexOfMin == -1) break;  // interrupt the infinite circle in case all vertices have been visited

      for (var i = 0; i < matrix[indexOfMin].length; i++) {
        if(matrix[indexOfMin][i] !== Infinity || matrix[indexOfMin][i] !== 0) {
          var newLength = vertices[indexOfMin].value + matrix[indexOfMin][i];
            
          if (newLength < vertices[i].value) { 
            vertices[i].value = newLength;
          }
        }
      }
      vertices[indexOfMin].visited = true;
    }
    
    function showResult() {
      var result = [];
      for (var i = 0; i < vertices.length; i++) {
        result.push(vertices[i].value);
      }
      alert(result);
    }
    
    showResult();
  }
  
  findDijkstra(matrix);
