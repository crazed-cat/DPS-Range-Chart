google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(init);

// 改為引入外部資料
const dataset = {
  none: '0', red: '1438024126', float: '545386183', black: '1326931744', angle: '265711189',
  alien: '1362318074', zombie:'205622714', relic: '2039091253', aku: '2140034265', traitless: '1738351081'
};

let chart;
let data;
let view;
let options;

function init() {
  //alert('dataview done')

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
    .addEventListener('change', loadTable);

  document
    .getElementById('metaOnly')
    .addEventListener('change', loadTable);

  document
    .getElementById('traitSelector')
    .addEventListener('change',loadTable);
 
  loadTable()
}

function loadTable() {
  const key =  document.getElementById('traitSelector').value

  const query = new google.visualization.Query(
    `https://docs.google.com/spreadsheets/d/1A6OllbUHCiVlk_gbyYRW2JkNIGpuqvv8oRGsTT-Nh0w/gviz/tq?gid=${dataset[key]}`
  );

  query.send(function (response) {
    if (response.isError()) {
      console.error('Error in query: ' + response.getMessage());
      return;
    }
  
    data = response.getDataTable();
  
    view = new google.visualization.DataView(data);
    view.setColumns([
      2, // X
      3, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,1)}` },
      4, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,1)}` },
      5, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,1)}` }
    ]);

  filter=document.getElementById('metaOnly').checked
  ? 1:0;
  const rows = [];

  for (let i = 0; i < data.getNumberOfRows(); i++) {
    if (data.getValue(i, 6) >= filter) {
      rows.push(i);
    }
  }
  
  view.setRows(rows);
  
  options.vAxis.logScale =
    document.getElementById('logToggle').checked;
  
  options.vAxis.minValue=document.getElementById('logToggle').checked
  ? 1000:0; 
  
  chart.draw(view, options);
  });
}




















