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
    
    function createVertices(start) {
      start = +prompt('Введите начальную вершину', 0);
      for (var i = 0; i < matrix.length; i++) {
        vertices.push({
          value: Infinity,
          visited: false,
        });
      }
      vertices[start].value = 0;
    }
    createVertices();
    
    function chooseMinVertice() {
      if(!vertices[i].visited) {
        
        if(vertices[i].value < minElement) {
          minElement = vertices[i].value;
          indexOfMin = i; 
        }
      }
    }
    
    function relableVertice() {
      var newLength = vertices[indexOfMin].value + matrix[indexOfMin][i];
            
        if (newLength < vertices[i].value) { 
          vertices[i].value = newLength;
        }
    }
    
    function showResult() {
      var result = [];
      for (var i = 0; i < vertices.length; i++) {
        result.push(vertices[i].value);
      }
      alert(result);
    }
    
    while(true) {
      var minElement = Infinity;
      var indexOfMin = -1;
      
      for (var i = 0; i < vertices.length; i++) {
        chooseMinVertice();
      }
      
      if (indexOfMin == -1) break;  // interrupt the infinite circle in case all vertices have been visited

      for (var i = 0; i < matrix[indexOfMin].length; i++) {
        if(matrix[indexOfMin][i] !== Infinity || matrix[indexOfMin][i] !== 0) {
          relableVertice();
        }
      }
      vertices[indexOfMin].visited = true;
    }
    showResult();
  }
  
  findDijkstra(matrix);
