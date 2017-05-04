  var matrix = [ // adjacency matrix
    [0,        10,       14,       Infinity, Infinity, Infinity],
    [Infinity, 0,        3,        Infinity, Infinity, Infinity],
    [Infinity, 3,        0,        12,       17,       Infinity],
    [Infinity, Infinity, Infinity, 0,        3,        9],
    [Infinity, Infinity, 17,       Infinity, 0,        4],
    [Infinity, Infinity, Infinity, 9,        Infinity, 0]
  ];
  
  function findDijkstra(matrix) {
    initialVertice = +prompt('Enter an initial vertice', 0);
    var vertices = createVertices(initialVertice);
    var indexOfMin = initialVertice;
    
    while(indexOfMin != -1) {
      relableVertice(vertices, indexOfMin);
      vertices[indexOfMin].visited = true;
      indexOfMin = chooseMinVertice(vertices);
    }
    showResult(vertices);
  }
  
  findDijkstra(matrix);
  
  function relableVertice(vertices, indexOfMin) {
    for (var i = 0; i < matrix[indexOfMin].length; i++) {
      var edgeValue = matrix[indexOfMin][i];
      var newVerticeValue = vertices[indexOfMin].value + edgeValue;
              
      if (newVerticeValue < vertices[i].value) {
        vertices[i].value = newVerticeValue;
      }
    }
  }
  
  function chooseMinVertice(vertices) {
    var minElement = Infinity;
    var indexOfMin = -1;
    for (var i = 0; i < vertices.length; i++) {
        
      if(!vertices[i].visited) {
        if(vertices[i].value < minElement) {
          minElement = vertices[i].value;
          indexOfMin = i; 
        }
      }
    }
    return indexOfMin;
  }
  
  function createVertices(initialVertice) {
    var vertices = [];
    for (var i = 0; i < matrix.length; i++) {
      vertices.push({
        value: Infinity,
        visited: false,
      });
    }
    vertices[initialVertice].value = 0;
      
    return vertices;
  }
  
  function showResult(vertices) {
    var result = [];
    for (var i = 0; i < vertices.length; i++) {
      result.push(vertices[i].value);
    }
    alert(result);
  }
  
