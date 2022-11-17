/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 73.51485148514851, "KoPercent": 26.485148514851485};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6589103291713961, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.136986301369863, 500, 1500, ""], "isController": true}, {"data": [0.5408163265306123, 500, 1500, "-1"], "isController": false}, {"data": [1.0, 500, 1500, "-2"], "isController": false}, {"data": [1.0, 500, 1500, "-3"], "isController": false}, {"data": [1.0, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [1.0, 500, 1500, "-6"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [0.0, 500, 1500, "-9"], "isController": false}, {"data": [0.0, 500, 1500, "-10"], "isController": false}, {"data": [0.0, 500, 1500, "-11"], "isController": false}, {"data": [0.0, 500, 1500, "-12"], "isController": false}, {"data": [0.0, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-14"], "isController": false}, {"data": [1.0, 500, 1500, "-15"], "isController": false}, {"data": [1.0, 500, 1500, "-1-0"], "isController": false}, {"data": [1.0, 500, 1500, "-16"], "isController": false}, {"data": [0.7959183673469388, 500, 1500, "-1-2"], "isController": false}, {"data": [0.8163265306122449, 500, 1500, "-1-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 808, 214, 26.485148514851485, 154.2054455445544, 11, 1718, 80.0, 301.4000000000001, 582.7999999999993, 1448.2099999999991, 162.54274793804063, 3522.6520852192716, 83.67319515691008], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 73, 33, 45.205479452054796, 1134.3150684931502, 414, 2379, 855.0, 2146.6000000000004, 2235.4999999999995, 2379.0, 14.44972288202692, 1740.1553144175575, 61.63709916864609], "isController": true}, {"data": ["-1", 49, 9, 18.367346938775512, 686.3265306122448, 48, 1718, 342.0, 1656.0, 1686.0, 1718.0, 10.476801368398547, 1856.3517696306394, 12.49423709108403], "isController": false}, {"data": ["-2", 49, 0, 0.0, 194.9183673469387, 69, 481, 226.0, 337.0, 425.0, 481.0, 14.527127186480879, 3.9722613400533646, 6.979830640379483], "isController": false}, {"data": ["-3", 47, 0, 0.0, 60.61702127659574, 54, 88, 59.0, 67.80000000000001, 72.19999999999999, 88.0, 15.38965291421087, 3.4716892804518666, 7.4844210461689595], "isController": false}, {"data": ["-4", 47, 0, 0.0, 78.46808510638299, 56, 119, 66.0, 106.2, 109.6, 119.0, 15.093127809890815, 3.4047973868015418, 7.443388226557483], "isController": false}, {"data": ["-5", 46, 0, 0.0, 59.30434782608696, 54, 75, 58.0, 67.30000000000001, 70.6, 75.0, 15.410385259631491, 3.476366206030151, 7.569749790619766], "isController": false}, {"data": ["-6", 44, 0, 0.0, 82.88636363636364, 77, 183, 79.0, 86.0, 91.75, 183.0, 14.96089765385923, 3.550291142468548, 7.524279581774907], "isController": false}, {"data": ["-7", 42, 0, 0.0, 83.14285714285715, 38, 263, 66.0, 207.9000000000001, 221.85, 263.0, 14.799154334038054, 4.176026250880902, 7.1538880813953485], "isController": false}, {"data": ["-8", 40, 0, 0.0, 59.675, 56, 85, 58.0, 65.8, 71.89999999999999, 85.0, 15.337423312883436, 3.4599070168711656, 7.5938218941717786], "isController": false}, {"data": ["-9", 40, 40, 100.0, 136.725, 76, 728, 84.0, 180.39999999999998, 663.55, 728.0, 15.203344735841885, 3.5632839224629422, 7.393814139110605], "isController": false}, {"data": ["-10", 40, 40, 100.0, 83.45000000000003, 74, 96, 83.0, 89.0, 90.94999999999999, 96.0, 15.723270440251572, 3.6851415094339623, 7.646668632075472], "isController": false}, {"data": ["-11", 39, 39, 100.0, 92.76923076923076, 73, 206, 84.0, 104.0, 191.0, 206.0, 16.934433347807207, 3.9690078158923146, 8.235691217976553], "isController": false}, {"data": ["-12", 39, 39, 100.0, 85.84615384615383, 75, 135, 84.0, 103.0, 128.0, 135.0, 16.72384219554031, 3.91965051457976, 8.133274817753001], "isController": false}, {"data": ["-13", 38, 38, 100.0, 84.63157894736841, 76, 118, 81.0, 94.10000000000002, 114.19999999999999, 118.0, 17.241379310344826, 4.0409482758620685, 8.384967672413792], "isController": false}, {"data": ["-14", 37, 0, 0.0, 152.83783783783787, 68, 322, 89.0, 256.2, 273.4000000000001, 322.0, 16.584491259524878, 4.534821828776334, 8.033112953832363], "isController": false}, {"data": ["-15", 33, 0, 0.0, 70.6969696969697, 55, 148, 58.0, 137.6, 144.5, 148.0, 15.699333967649858, 3.541548971217888, 7.7730100796860135], "isController": false}, {"data": ["-1-0", 49, 0, 0.0, 37.12244897959183, 11, 138, 28.0, 101.0, 138.0, 138.0, 10.558069381598793, 1.3197586726998491, 4.49837386877828], "isController": false}, {"data": ["-16", 31, 0, 0.0, 69.03225806451611, 54, 136, 59.0, 97.4, 136.0, 136.0, 15.09985387238188, 3.4063146919142717, 7.34348362152947], "isController": false}, {"data": ["-1-2", 49, 9, 18.367346938775512, 281.97959183673464, 18, 590, 282.0, 460.0, 518.0, 590.0, 14.390602055800294, 2546.1298871145377, 4.899160242290749], "isController": false}, {"data": ["-1-1", 49, 0, 0.0, 364.75510204081627, 13, 1130, 34.0, 1127.0, 1128.5, 1130.0, 10.862336510751497, 1.4320463173354023, 4.628010003325205], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 196, 91.58878504672897, 24.257425742574256], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,843; actual size: 3,986)", 2, 0.9345794392523364, 0.24752475247524752], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,840; actual size: 3,986)", 4, 1.8691588785046729, 0.49504950495049505], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,839; actual size: 3,986)", 2, 0.9345794392523364, 0.24752475247524752], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: kyivstar.ua:443 failed to respond", 10, 4.672897196261682, 1.2376237623762376], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 808, 214, "400/Bad Request", 196, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: kyivstar.ua:443 failed to respond", 10, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,840; actual size: 3,986)", 4, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,843; actual size: 3,986)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,839; actual size: 3,986)", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["-1", 49, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: kyivstar.ua:443 failed to respond", 5, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,840; actual size: 3,986)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,843; actual size: 3,986)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,839; actual size: 3,986)", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-9", 40, 40, "400/Bad Request", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["-10", 40, 40, "400/Bad Request", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["-11", 39, 39, "400/Bad Request", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["-12", 39, 39, "400/Bad Request", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["-13", 38, 38, "400/Bad Request", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-1-2", 49, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: kyivstar.ua:443 failed to respond", 5, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,840; actual size: 3,986)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,843; actual size: 3,986)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 6,839; actual size: 3,986)", 1, "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
