// Sub-Stockist ROI Calculator.
// Core formula reconstructed from the prototype's own sample output (volume=2500,
// price=320, margin=8%, rotation=10 days -> turnover 8,00,000 / profit 64,000 /
// working capital 2,45,333 / ROI 313.0%) — verified to reproduce those figures.
// Payback period is a derived addition (workingCapital / monthlyProfit), not a
// new invented formula — it only reuses numbers the core model already produces.

function formatINR(n) {
  // Indian digit grouping (लाख/करोड़ style): last 3 digits, then groups of 2.
  var isNegative = n < 0;
  n = Math.round(Math.abs(n));
  var str = String(n);
  var lastThree = str.slice(-3);
  var rest = str.slice(0, -3);
  if (rest !== '') {
    lastThree = ',' + lastThree;
    rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  }
  return (isNegative ? '-' : '') + '₹ ' + rest + lastThree;
}

function formatINRCompact(n) {
  // Short form for chart labels: ₹3.2L instead of ₹3,20,000.
  n = Math.round(n);
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '₹' + n;
}

function renderROIChart(monthlyProfit, workingCapital, paybackMonths) {
  var el = document.getElementById('roi-chart');
  if (!el) return;

  // Hardcoded hex (not CSS var()) — this SVG is injected via innerHTML and
  // must render identically regardless of custom-property support/inheritance.
  var COLOR_INK = '#12181F';
  var COLOR_SLATE_SOFT = '#8B93A0';
  var COLOR_BORDER = '#DADEE4';
  var COLOR_AMBER = '#F26A1B';
  var COLOR_AMBER_HOVER = '#C94F0A';
  var COLOR_GREEN = '#2F7A56';
  var FONT = "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif";

  var months = 12;
  // viewBox is sized to the element's real rendered width (not a fixed 600
  // scaled down by CSS) so text and strokes stay true-pixel-sized at every
  // screen width instead of shrinking illegibly on narrow phones.
  var w = Math.max(Math.round(el.clientWidth) || 600, 240);
  // Height is clamped, not a fixed multiple of width — a pure aspect ratio
  // would crush the plot on a narrow phone (not enough room for gridlines +
  // curve + payback label without them colliding), and stretch it
  // unnecessarily tall on a very wide desktop container.
  var h = Math.max(260, Math.min(Math.round(w * 0.5), 380));
  var padL = 54, padR = 16, padT = 20, padB = 30;
  var plotW = w - padL - padR;
  var plotH = h - padT - padB;

  var annualProfit = monthlyProfit * months;
  var maxVal = Math.max(annualProfit, workingCapital, 1) * 1.15;

  function x(m) { return padL + (m / months) * plotW; }
  function y(v) { return padT + plotH - (v / maxVal) * plotH; }

  var points = [];
  for (var m = 0; m <= months; m++) {
    points.push(x(m) + ',' + y(monthlyProfit * m));
  }

  var capitalY = y(workingCapital);
  var zeroY = y(0);

  // Y-axis: gridline + tick label at fixed fractions of the scale. Fewer
  // ticks on a narrow chart (less vertical room per band), and any regular
  // tick whose label would land within 15px of the amber working-capital
  // label is drawn as a gridline only (no text) so the two never collide —
  // that collision is what made the mobile chart look cluttered.
  var axisBase = maxVal / 1.15;
  var tickFractions = w < 420 ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1];
  var yTicksSvg = tickFractions.map(function (f) {
    var gy = y(axisBase * f);
    var skipLabel = f !== 0 && Math.abs(gy - capitalY) < 15;
    var label = skipLabel ? '' : '<text x="' + (padL - 10) + '" y="' + (gy + 4) + '" font-size="11" fill="' + COLOR_SLATE_SOFT + '" text-anchor="end">' + (f === 0 ? '₹0' : formatINRCompact(axisBase * f)) + '</text>';
    return '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="' + COLOR_BORDER + '" stroke-width="1" stroke-dasharray="' + (f === 0 ? '0' : '2 4') + '"/>' + label;
  }).join('');
  var yAxisLine = '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + y(0) + '" stroke="' + COLOR_BORDER + '" stroke-width="1.2"/>';

  var monthTicks = [0, 3, 6, 9, 12];
  var ticksSvg = monthTicks.map(function (m) {
    return '<text x="' + x(m) + '" y="' + (h - 9) + '" font-size="11" fill="' + COLOR_SLATE_SOFT + '" text-anchor="middle">M' + m + '</text>';
  }).join('');

  var areaPath = 'M' + x(0) + ',' + zeroY + ' L' + points.join(' L') + ' L' + x(months) + ',' + zeroY + ' Z';

  var paybackMarker = '';
  if (isFinite(paybackMonths) && paybackMonths > 0 && paybackMonths <= months) {
    var px = x(paybackMonths), py = capitalY;
    var anchor = paybackMonths < 2 ? 'start' : (paybackMonths > 9.5 ? 'end' : 'middle');
    var labelX = anchor === 'start' ? px - 4 : (anchor === 'end' ? px + 4 : px);
    var labelText = (w < 360 ? '' : 'Payback: ') + paybackMonths.toFixed(1) + ' mo';
    paybackMarker =
      '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + zeroY + '" stroke="' + COLOR_GREEN + '" stroke-width="1" stroke-dasharray="3 3" opacity="0.55"/>' +
      '<circle cx="' + px + '" cy="' + py + '" r="5" fill="' + COLOR_GREEN + '" stroke="#fff" stroke-width="2"/>' +
      '<text x="' + labelX + '" y="' + (py - 16) + '" font-size="11.5" font-weight="700" fill="' + COLOR_INK + '" text-anchor="' + anchor + '">' + labelText + '</text>';
  }

  el.innerHTML =
    '<svg viewBox="0 0 ' + w + ' ' + h + '" font-family="' + FONT + '" role="img" aria-label="Cumulative gross profit over 12 months against required working capital">' +
      '<defs>' +
        '<linearGradient id="roiAreaFill" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="' + COLOR_GREEN + '" stop-opacity="0.16"/>' +
          '<stop offset="100%" stop-color="' + COLOR_GREEN + '" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>' +
      yTicksSvg +
      yAxisLine +
      '<path d="' + areaPath + '" fill="url(#roiAreaFill)"/>' +
      '<line x1="' + padL + '" y1="' + capitalY + '" x2="' + (w - padR) + '" y2="' + capitalY + '" stroke="' + COLOR_AMBER + '" stroke-width="1.5" stroke-dasharray="5 4"/>' +
      '<text x="' + (padL - 10) + '" y="' + (capitalY + 4) + '" font-size="11" fill="' + COLOR_AMBER_HOVER + '" font-weight="700" text-anchor="end">' + formatINRCompact(workingCapital) + '</text>' +
      '<polyline points="' + points.join(' ') + '" fill="none" stroke="' + COLOR_GREEN + '" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + x(months) + '" cy="' + y(annualProfit) + '" r="4" fill="' + COLOR_GREEN + '"/>' +
      ticksSvg +
      paybackMarker +
    '</svg>';
}

function updateCalculator() {
  var volume = Number(document.getElementById('input-volume').value);
  var price = Number(document.getElementById('input-price').value);
  var margin = Number(document.getElementById('input-margin').value);
  var rotation = Number(document.getElementById('input-rotation').value);

  document.getElementById('val-volume').textContent = volume.toLocaleString('en-IN') + ' cartons';
  document.getElementById('val-price').textContent = formatINR(price);
  document.getElementById('val-margin').textContent = margin.toFixed(1) + '%';
  document.getElementById('val-rotation').textContent = rotation + ' days';

  var turnover = volume * price;
  var profit = turnover * (margin / 100);
  var costOfGoods = turnover - profit;
  var workingCapital = costOfGoods * (rotation / 30);
  var annualProfit = profit * 12;
  var roi = workingCapital > 0 ? (annualProfit / workingCapital) * 100 : 0;
  var paybackMonths = profit > 0 ? workingCapital / profit : Infinity;

  document.getElementById('res-roi').textContent = roi.toFixed(1) + '%';
  document.getElementById('res-roi-caption').textContent = 'based on ' + formatINR(workingCapital) + ' working capital';
  document.getElementById('res-monthly-rev').textContent = formatINR(turnover);
  document.getElementById('res-monthly-profit').textContent = formatINR(profit);
  document.getElementById('res-working-cap').textContent = formatINR(workingCapital);
  document.getElementById('res-payback').textContent = isFinite(paybackMonths) ? paybackMonths.toFixed(1) + ' months' : '—';

  lastChartValues = { profit: profit, workingCapital: workingCapital, paybackMonths: paybackMonths };
  renderROIChart(profit, workingCapital, paybackMonths);
}

var lastChartValues = null;

function debounce(fn, wait) {
  var t;
  return function () {
    window.clearTimeout(t);
    t = window.setTimeout(fn, wait);
  };
}

document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('input-volume')) return;
  ['input-volume', 'input-price', 'input-margin', 'input-rotation'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', updateCalculator);
  });
  updateCalculator();

  // The chart's viewBox tracks the container's real pixel width (see
  // renderROIChart), so it needs a redraw whenever that width changes —
  // orientation change, window resize, or the browser's own responsive
  // reflow — not just when an input changes.
  window.addEventListener('resize', debounce(function () {
    if (lastChartValues) {
      renderROIChart(lastChartValues.profit, lastChartValues.workingCapital, lastChartValues.paybackMonths);
    }
  }, 150));
});
