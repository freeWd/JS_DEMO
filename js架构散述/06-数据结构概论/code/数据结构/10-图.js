// 图和图的算法

function Graph(v) {
  this.vertices = v; // v - 顶点的个数
  this.edges = 0; // edge - 边的个数
  this.adject = []; // 点与点的连接表
  this.marked = []; // 标记是否访问过，用于遍历
  for (let index = 0; index < this.vertices; index++) {
    this.adject[index] = [];
    this.marked[index] = false;
  }

  this.addEdge = addEdge;
  this.showGraph = showGraph;
  this.deepSearch = deepSearch;
  this.scopeSearch = scopeSearch;
}

function addEdge(v, w) {
  // v, w是两个连接点
  this.adject[v].push(w);
  this.adject[w].push(v);
  this.edges++;
}

function showGraph() {
  for (let i = 0; i < this.vertices; i++) {
    var showEdge = "";
    for (let j = 0; j < this.vertices; j++) {
      var adjectPoint = this.adject[i][j];
      if (adjectPoint != null) {
        showEdge += adjectPoint + ",";
      }
    }
    console.log(i + "===>", showEdge);
  }
}

// 深度搜索 - 深度优先搜索，比如以0为开始，查考0连接的其他的点 --》 1, 再查1的非0连接点 ---》 3,3没有其他连接点了，就再返回到0的另一个连接点2...
function deepSearch(v) {
  this.marked[v] = true;
  if (this.adject[v] !== undefined) {
    console.log(v + "节点已经被访问了");
  }
  for (const w in this.adject[v]) {
    var current = this.adject[v][w];
    if (!this.marked[current]) {
      this.deepSearch(current);
    }
  }
}

// 广度优先
function scopeSearch(v) {
  const adjectArr = Array.isArray(v) ? [...v] : [v];
  const temp = [];
  adjectArr.forEach((item) => {
    if (this.adject[item] !== undefined && !this.marked[item]) {
      this.marked[item] = true;
      console.log(item + "节点已经被访问");
    }
    for (const w in this.adject[item]) {
      var current = this.adject[item][w];
      if (!this.marked[current]) {
        this.marked[current] = true;
        console.log(current + "节点已经被访问");
        temp.push(current);
      }
    }
  });
  if (temp.length > 0) {
    this.scopeSearch(temp);
  }
}

// 某个点是否有与其他点的连接边
function hasPathTo(v) {
  return this.marked[v];
}

// 计算0到v最短路径
// function pathTo(v) {
//     var source = 0;
//     if (!this.hasPathTo(v)) {
//         return undefined;
//     }
//     var path = [];
// }

// ====> example
var graph = new Graph(5);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 4);
// graph.showGraph()
graph.deepSearch(1);
// graph.scopeSearch(0);
