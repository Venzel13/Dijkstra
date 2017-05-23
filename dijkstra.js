  var matrix = [ // adjacency matrix
    [0,        10,       14,       Infinity, Infinity, Infinity],
    [Infinity, 0,        3,        Infinity, Infinity, Infinity],
    [Infinity, 3,        0,        12,       17,       Infinity],
    [Infinity, Infinity, Infinity, 0,        3,        9],
    [Infinity, Infinity, 17,       Infinity, 0,        4],
    [Infinity, Infinity, Infinity, 9,        Infinity, 0]
  ];
  var vertices;
  var initialVertice = +prompt('Enter an initial vertice', 0);
  findDijkstra({matrix, initialVertice});
  showResult(vertices);
  animateGraph();
  
  function findDijkstra(options) {
    var matrix = options.matrix;
    var initialVertice = options.initialVertice;
    
    vertices = createVertices(matrix);
    var indexOfMin = initialVertice;
    
    while(indexOfMin != -1) {
      relableVertice({vertices, indexOfMin, matrix, initialVertice});
      vertices[indexOfMin].visited = true;
      indexOfMin = chooseMinVertice(vertices);
    }
  }
  
  function createVertices(matrix) {
    var vertices = [];
    for (var i = 0; i < matrix.length; i++) {
      vertices.push({
        value: Infinity,
        visited: false,
      });
    }
    return vertices;
  }
  
  function relableVertice(options) {
    var vertices = options.vertices;
    var indexOfMin = options.indexOfMin;
    var matrix = options.matrix;
    var initialVertice = options.initialVertice;
    
    vertices[initialVertice].value = 0;
    var minVerticeEdges = matrix[indexOfMin];
    
    for (var i = 0; i < minVerticeEdges.length; i++) {
      var edgeValue = minVerticeEdges[i];
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
        
      if(!vertices[i].visited && vertices[i].value < minElement) {
        minElement = vertices[i].value;
        indexOfMin = i; 
      }
    }
    return indexOfMin;
  }
  
  function showResult(vertices) {
    var result = [];
    for (var i = 0; i < vertices.length; i++) {
      result.push(vertices[i].value);
    }
    alert(result);
  }

  function animateGraph() {
    var sys = arbor.ParticleSystem(1000, 40,1);
    sys.parameters({gravity:true});
    sys.renderer = Renderer("#viewport");

    for (var i = 0; i < vertices.length; i++) {
      sys.addNode(i, {'color':'red','shape':'dot','label': 'n:' + i + ' w:' + vertices[i].value});
    }

    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix.length; j++) {
        if (matrix[i][j] != Infinity) {
          sys.addEdge(i, j, {'directed': true, 'length':matrix[i][j]})
        }
      }
    }
  }
