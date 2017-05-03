  var matrix = [ // adjacency matrix
    [0,        10,       14,       Infinity, Infinity, Infinity],
    [Infinity, 0,        3,        Infinity, Infinity, Infinity],
    [Infinity, 3,        0,        12,       17,       Infinity],
    [Infinity, Infinity, Infinity, 0,        3,        9],
    [Infinity, Infinity, 17,       Infinity, 0,        4],
    [Infinity, Infinity, Infinity, 9,        Infinity, 0]
  ];
  
  function findDijkstra(matrix) {
    
    function createVertices(start) {
      var vertices = [];
      for (var i = 0; i < matrix.length; i++) {
        vertices.push({
          value: Infinity,
          visited: false,
        });
      }
      vertices[start].value = 0;
      
      return vertices;
    }
    
    var vertices = createVertices(0);
    
    
    function chooseMinVertice(list) {
      var minElement = Infinity;
      var indexOfMin = -1;
          
      for (var i = 0; i < list.length; i++) {
        if(!list[i].visited) {
          if(list[i].value < minElement) {
            minElement = list[i].value;
            indexOfMin = i; 
          }
        }
      }
      return indexOfMin;
    }
       
    while(true) {    
      var indexOfMin = chooseMinVertice(vertices);
      
      if (indexOfMin == -1) break;
  
      function relableVertice(currentPos) {
        for (var i = 0; i < matrix[currentPos].length; i++) {
          var edge = matrix[currentPos][i];
          var newLength = vertices[currentPos].value + edge;
              
          if (newLength < vertices[i].value) {
            vertices[i].value = newLength;
          }
        }
        return currentPos;
      }
      
      indexOfMin = relableVertice(indexOfMin);
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
  
