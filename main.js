google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(init);

// 內建測資
  const datasets = {
  none: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['p1', 1, 10, 20, 30, 0],
    ['p2', 2, 15, 25, 35, 0],
    ['p3', 3, 5,  30, 40, 1]
  ],
  red: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['q1', 1, 50, 10, 5,0],
    ['q2', 2, 40, 20, 15,1],
    ['q3', 3, 30, 25, 20,0]
  ],
  float: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['r1', 1, 5,  60, 10,0],
    ['r2', 2, 10, 55, 20,1],
    ['r3', 3, 15, 50, 30,1]
  ],
  black: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['p1', 1, 10, 20, 30,1],
    ['p2', 2, 15, 25, 35,0],
    ['p3', 3, 5,  30, 40,0]
  ],
  angle: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['q1', 1, 50, 10, 5,1],
    ['q2', 2, 40, 20, 15,0],
    ['q3', 3, 30, 25, 20,1]
  ],
  alien: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['r1', 1, 5,  60, 10,1],
    ['r2', 2, 10, 55, 20,1],
    ['r3', 3, 15, 50, 30,0]
  ],
  zombie: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['p1', 1, 10, 20, 30,0],
    ['p2', 2, 15, 25, 35,1],
    ['p3', 3, 5,  30, 40,1]
  ],
  relic: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['q1', 1, 50, 10, 5,0],
    ['q2', 2, 40, 20, 15,1],
    ['q3', 3, 30, 25, 20,0]
  ],
  aku: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['r1', 1, 5,  60, 10,1],
    ['r2', 2, 10, 55, 20,0],
    ['r3', 3, 15, 50, 30,1]
  ],
  traitless: [
    ['label', 'x', 'y1', 'y2', 'y3','有料?'],
    ['r1', 1, 5,  60, 10,1],
    ['r2', 2, 10, 55, 20,1],
    ['r3', 3, 15, 50, 30,0]
  ]
};

let chart;
let data;
let view;
let options;

function init() {
  loadTable('none')

  //alert('check')

  options = {
    title: 'DPS-射程 比較表',
    hAxis: { title: '射程(接觸點)' },
    vAxis: { title: 'DPS(秒平均輸出)', logScale:'false' },
    legend: { position: 'right' },
    height: 700,
    explorer: {
      actions: ['scrollToZoom', 'dragToPan', 'rightClickToReset'],
      axis: 'both',
      keepInBounds: true,
      maxZoomIn: 0.1, maxZoomOut:1.2, zoomDelta:1.2
    }
  };

  chart = new google.visualization.ScatterChart(
    document.getElementById('chart_div')
  );

  // UI 綁定
  document
    .getElementById('logToggle')
    .addEventListener('change', toggleLogScale);

  document
    .getElementById('metaOnly')
    .addEventListener('change', function(){
      applyFilter();
      chart.draw(view, options);
    })

  document
    .getElementById('traitSelector')
    .addEventListener('change',function(){
      //alert(this.value)
      loadTable(this.value)
      applyFilter();
      chart.draw(view, options);
    })

  chart.draw(view, options);
}

function toggleLogScale() {
  options.vAxis.logScale =
    document.getElementById('logToggle').checked;
  
  chart.draw(view, options);
}

function applyFilter() {
  filter=document.getElementById('metaOnly').checked
  ? 1:0;
  const rows = [];

  for (let i = 0; i < data.getNumberOfRows(); i++) {
    if (data.getValue(i, 5) >= filter) {
      rows.push(i);
    }
  }

  view.setRows(rows);
}

function loadTable(key) {
  data = google.visualization.arrayToDataTable(datasets[key]);

  view = new google.visualization.DataView(data);
  view.setColumns([
    1, // X
    2, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,0)}` },
    3, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,0)}` },
    4, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,0)}` }
  ]);
  //alert('loaded')
}