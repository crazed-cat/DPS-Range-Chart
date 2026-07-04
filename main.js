google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(init);

// 外部資料
const dataset = {
  none: '0', red: '1438024126', float: '545386183', black: '1326931744', angle: '265711189',
  alien: '1362318074', zombie:'205622714', relic: '2039091253', aku: '2140034265', traitless: '1738351081'
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
      loadTable(this.value);
      applyFilter();
      chart.draw(view, options);
    })

  document
    .getElementByI('min-slider')
    .addEventListener('change', function(){
      applyFilter();
      chart.draw(view, options);
    })

  document
    .getElementByI('max-slider')
    .addEventListener('change', function(){
      applyFilter();
      chart.draw(view, options);
    })

  // 監聽滑動事件
  minSlider.addEventListener('input', updateSlider);
  maxSlider.addEventListener('input', updateSlider);
  
  // 網頁載入時先執行一次初始化外觀
  updateSlider();

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
  let minCD=document.getElementById('min-slider').value;
  let maxCD=document.getElementById('max-slider').value;
  
  for (let i = 0; i < data.getNumberOfRows(); i++) {
    if (data.getValue(i, 6) >= filter && data.getValue(i,7)>minCD*30 && data.getValue(i,7)<maxCD*30) {
      rows.push(i);
    }
  }

  view.setRows(rows);
}

//抓對應屬性的資料
function loadTable(key) {
  const query = new google.visualization.Query(
    `1A6OllbUHCiVlk_gbyYRW2JkNIGpuqvv8oRGsTT-Nh0w?gid=${dataset[key]}`
  );

  query.send(function (response) {
    if (response.isError()) {
      console.error(response.getMessage());
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
  });
}

//以下用來調整冷卻篩選器
const minSlider = document.getElementById('min-slider');
const maxSlider = document.getElementById('max-slider');
const track = document.getElementById('track');
const rangeText = document.getElementById('range-text');

const minGap = 30;

// 核心邏輯：更新軌道顏色與文字
function updateSlider() {
  let minVal = parseInt(minSlider.value);
  let maxVal = parseInt(maxSlider.value);

  // 【新增限制】：檢查兩者間隔是否小於 minGap
  if (maxVal - minVal < minGap) {
    // 如果是左邊滑塊在動，就把左邊卡在「右邊 - 間隔」的位置
    if (this === minSlider) {
      minSlider.value = maxVal - minGap;
      minVal = maxVal - minGap;
    } 
    // 如果是右邊滑塊在動，就把右邊卡在「左邊 + 間隔」的位置
    else {
      maxSlider.value = minVal + minGap;
      maxVal = minVal + minGap;
    }
  }

  // 計算百分比來渲染選取區間的綠色線條 (1-100範圍)
  const percent1 = ((minVal - 0) / (330 - 0)) * 100;
  const percent2 = ((maxVal - 0) / (330 - 0)) * 100;

  // 利用 CSS 漸層動態畫出綠色區間
  track.style.background = `linear-gradient(to right, #ddd ${percent1}%, #4CAF50 ${percent1}%, #4CAF50 ${percent2}%, #ddd ${percent2}%)`;

  // 更新文字顯示
  rangeText.textContent = `${minVal} ~ ${maxVal}`;
}
