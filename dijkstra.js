  var matrix = [ // adjacency matrix
    [0,        10,       14,       Infinity, Infinity, Infinity],
    [Infinity, 0,        3,        Infinity, Infinity, Infinity],
    [Infinity, 3,        0,        12,       17,       Infinity],
    [Infinity, Infinity, Infinity, 0,        3,        9],
    [Infinity, Infinity, 17,       Infinity, 0,        4],
    [Infinity, Infinity, Infinity, 9,        Infinity, 0]
  ];
  
  function findDijkstra(matrix, initialVertice) {
    var vertices = createVertices(initialVertice);
    var indexOfMin = initialVertice;
    
    while(indexOfMin != -1) {
      relableVertice(vertices, indexOfMin);
      vertices[indexOfMin].visited = true;
      indexOfMin = chooseMinVertice(vertices);
    }
    showResult(vertices);
  }
  
  var initialVertice = +prompt('Enter an initial vertice', 0);
  findDijkstra(matrix, initialVertice);
  
  function createVertices(initialVertice) {
    var vertices = [];
    for (var i = 0; i < matrix.length; i++) { //зависимость от наружной матрицы нужно убрать, какой смысл тогда передавать ее как параметр в функцию findDijkstra?
      vertices.push({
        value: Infinity,
        visited: false,
      });
    }
    vertices[initialVertice].value = 0; //логически, это не относится к созданию вершин, это уже шаг самого алгоритма поиска
      
    return vertices;
  }
  
  function relableVertice(vertices, indexOfMin) {
    for (var i = 0; i < matrix[indexOfMin].length; i++) { //matrix[indexOfMin] придумай этой штуке имя:) и убери зависимость от внешней матрицы
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
        
      if(!vertices[i].visited) { //зачем двойной if?
        if(vertices[i].value < minElement) {
          minElement = vertices[i].value;
          indexOfMin = i; 
        }
      }
    }
    return indexOfMin;
  }
  
  function showResult(vertices) { //по сути ввод данных и показ результата не относятся к самому алгоритму поиска. Вынеси их отдельно.
    var result = [];
    for (var i = 0; i < vertices.length; i++) {
      result.push(vertices[i].value);
    }
    alert(result);
  }
  
