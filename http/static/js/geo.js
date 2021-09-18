var chartDom = document.getElementById("main");
var myChart = echarts.init(chartDom);
var option;

console.log(userDistCountryData, countryCoordsMap);

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = countryCoordsMap[data[i].country];
        if (geoCoord) {
            res.push({
                name: geoCoord.name,
                value: [geoCoord.long, geoCoord.lat, data[i].count],
            });
        }
    }
    return res;
};

function convertDataCity(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = cityCoordsMap[data[i].city.toLowerCase()];
        if (geoCoord) {
            res.push({
                name: geoCoord.city,
                value: [geoCoord.long, geoCoord.lat, data[i].count],
            });
        }
    }
    return res;
}

option = {
    leaflet: {
        center: [78, 21],
        zoom: 2.2,
        roam: true,
        tiles: [
            {
                label: "OpenStreetMap",
                urlTemplate: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
                options: {
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
                },
            },
        ],
    },
    tooltip: {
        trigger: "item",
        formatter: function (params) {
            return `${params.value[2]} ${params.seriesName}`;
        },
    },
};

myChart.setOption({
    ...option,
    series: [
        {
            name: "Top users count",
            type: "effectScatter",
            coordinateSystem: "leaflet",
            data: convertData(
                userDistCountryData
                    .sort(function (a, b) {
                        return b.value - a.value;
                    })
                    .slice(0, 6)
            ),
            symbolSize: function (val) {
                return val[2] / 1000;
            },
            showEffectOn: "emphasis",
            rippleEffect: {
                brushType: "stroke",
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: "{b}",
                    position: "right",
                    show: true,
                },
            },
            itemStyle: {
                normal: {
                    color: "#f4e925",
                    shadowBlur: 10,
                    shadowColor: "#333",
                },
            },
            zlevel: 1,
        },
    ],
});

// https://developer.mozilla.org/en-US/docs/Web/Events/resize
(function () {
    var throttle = function (type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function () {
            if (running) {
                return;
            }
            running = true;
            requestAnimationFrame(function () {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

// handle event
window.addEventListener("optimizedResize", function () {
    myChart.resize({
        width: "auto",
        height: "auto",
    });
});

let isContryLoaded = true;
let isCitiesLoaded = false;

myChart.on("leafletroam", function () {
    let leaflet = myChart.getModel().getComponent("leaflet").getLeaflet();

    if (leaflet.getZoom() > 4 && isCitiesLoaded === false) {
        option.leaflet.zoom = leaflet.getZoom();
        delete option.leaflet.center;
        let newOpt = {
            ...option,
            series: [
                {
                    name: "Users",
                    type: "scatter",
                    coordinateSystem: "leaflet",
                    data: convertDataCity(userDistCityData),
                    symbolSize: function (val) {
                        return val[2] / 250;
                    },
                    label: {
                        normal: {
                            formatter: function (b) {
                                let name = b.name.trim();
                                name = name.charAt(0).toUpperCase() + name.slice(1);
                                return name;
                            },
                            position: "right",
                            show: false,
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "#ddb926",
                        },
                    },
                },
                {
                    name: "Top users count",
                    type: "effectScatter",
                    coordinateSystem: "leaflet",
                    data: convertDataCity(
                        userDistCityData
                            .sort(function (a, b) {
                                return b.value - a.value;
                            })
                            .slice(0, 6)
                    ),
                    symbolSize: function (val) {
                        return val[2] / 250;
                    },
                    showEffectOn: "emphasis",
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: function (b) {
                                let name = b.name.trim();
                                name = name.charAt(0).toUpperCase() + name.slice(1);
                                return name;
                            },
                            position: "right",
                            show: true,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "#f4e925",
                            shadowBlur: 10,
                            shadowColor: "#333",
                        },
                    },
                    zlevel: 1,
                },
            ],
        };
        myChart.setOption(newOpt);
        isCitiesLoaded = true;
        isContryLoaded = false;
    }

    if (leaflet.getZoom() < 4 && isContryLoaded === false) {
        option.leaflet.zoom = leaflet.getZoom();
        delete option.leaflet.center;
        let newOpt = {
            ...option,
            series: [
                {
                    name: "Users",
                    type: "scatter",
                    coordinateSystem: "leaflet",
                    data: convertData(userDistCountryData),
                    symbolSize: function (val) {
                        return val[2] / 1000;
                    },
                    label: {
                        normal: {
                            formatter: "{b}",
                            position: "right",
                            show: false,
                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "#ddb926",
                        },
                    },
                },
                {
                    name: "Top users count",
                    type: "effectScatter",
                    coordinateSystem: "leaflet",
                    data: convertData(
                        userDistCountryData
                            .sort(function (a, b) {
                                return b.value - a.value;
                            })
                            .slice(0, 6)
                    ),
                    symbolSize: function (val) {
                        return val[2] / 1000;
                    },
                    showEffectOn: "emphasis",
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: "{b}",
                            position: "right",
                            show: true,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "#f4e925",
                            shadowBlur: 10,
                            shadowColor: "#333",
                        },
                    },
                    zlevel: 1,
                },
            ],
        };
        myChart.setOption(newOpt);
        isCitiesLoaded = false;
        isContryLoaded = true;
    }
});
