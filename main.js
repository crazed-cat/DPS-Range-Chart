google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnCallBack(init);

// 外部資料
const sheetId = {
  none: '0', red: '1438024126', float: '545386183', black: '1326931744', angle: '265711189',
  alien: '1362318074', zombie:'205622714', relic: '2039091253', aku: '2140034265', traitless: '1738351081'
};

let chart;
let data= new Map();
let view;
let options;

function loadTable() {
  const key =  document.getElementById('traitSelector').value
  if (!data.has(key)){
    const query = new google.visualization.Query(
    	`1A6OllbUHCiVlk_gbyYRW2JkNIGpuqvv8oRGsTT-Nh0w?gid=${sheetId[key]}`
  	);

  	query.send(function (response) {
    	if (response.isError()) {
      	console.error(response.getMessage());
      	return;
    	}
  
    	data.set (key, response.getDataTable());
  	);
  }
  
  view = new google.visualization.DataView(data.get(key));
  view.setColumns([
    2, // X
    3, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,1)}` },
    4, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,1)}` },
    5, { type: 'string', role: 'tooltip', calc: (dt, row) => `${dt.getValue(row,1)}` }
  ]);
  
  if (document.getElementById('metaOnly').checked){
    const rows = [];

  	for (let i = 0; i < data.getNumberOfRows(); i++) {
    	if (data.getValue(i, 6) == 1) {rows.push(i);}
  	}
    
    view.setRows(rows);
  }
  chart.draw(view, options);
}


function init(){
  options = {
    title: 'DPS-射程 比較表',
    hAxis: { title: '射程(接觸點)' },
    vAxis: { title: 'DPS(秒平均輸出)', logScale:'false' },
    legend: { position: 'top' },
    explorer: {
      actions: ['scrollToZoom', 'dragToPan', 'rightClickToReset'],
      axis: 'both',
      keepInBounds: true,
      maxZoomIn: 0.1, maxZoomOut:1.2, zoomDelta:1.2
    }
  };//初始化選項

  chart = new google.visualization.ScatterChart(
    document.getElementById('chart_div')
  );//綁定圖表

	loadTable();
}

document
  .getElementById('logToggle')
  .addEventListener('change', function(){
    options.vAxis.logScale = document.getElementById('logToggle').checked;
    chart.draw(view, options);
  });

document
  .getElementById('metaOnly')
  .addEventListener('change', loadTable);

document
  .getElementById('traitSelector')
  .addEventListener('change', loadTable);