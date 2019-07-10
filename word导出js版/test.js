
var myChart = echarts.init(document.getElementById('echarts'));
var myChart1 = echarts.init(document.getElementById('chinaE'));

option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            animation: false,
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
option1 = {
    
			tooltip: {
				trigger: 'item',
				"formatter": function(params) {
					var obj = JSON.parse(JSON.stringify(params));
					var itemName = obj.name;
					var dataIndex = obj.dataIndex;
					var str = "<p class='center_title'><b></b><b></b><span>企业数量<span></p>";
					str = str + "<p class='center_number'>9999999</p>";
					return str;
				}
			},
			//左侧小导航图标
			visualMap: {
				show: false,
				splitList: [{
						start: 1250
					}, {
						start: 1000,
						end: 1250
					},
					{
						start: 750,
						end: 1000
					}, {
						start: 500,
						end: 750
					},
					{
						start: 250,
						end: 500
					}, {
						start: 0,
						end: 250
					},
				],
				color: ['rgb(13,71,161)', 'rgb(21,101,192)', 'rgb(25,118,210)', 'rgb(30,136,229)', 'rgb(33,150,243)', 'rgb(66,165,245)']
			},
			//配置属性
			series: [{
				name: '数据',
				type: 'map',
				mapType: 'china',
				roam: false,
				itemStyle: {
					normal: {
						label: {
							show: true
						},
						borderWidth: 1, //省份的边框宽度
						borderColor: 'rgb(159,195,223)', //省份的边框颜色
						//color:'#fff',//地图背景颜色
						areaColor: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: 'rgb(20,84,125)' // 0% 处的颜色
							}, {
								offset: 1,
								color: 'rgb(15,168,189)' // 100% 处的颜色
							}],
							global: false // 缺省为 false
						} //设置地图颜色
					},
					emphasis: {
						label: {
							show: true
						},
						//color: 'auto',
						areaColor: 'rgba(4,254,255,0.6)',
					}
				},
				label: {
					normal: {
						show: false, //省份名称  
						//color:'white',
						//fontSize: 10,
					},
					emphasis: {
						show: false
					},
				},
				data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //数据
			}]
};

myChart.setOption(option);
myChart1.setOption(option1);
$(function(){
    var imgSrc = myChart.getDataURL({
        type:"png"
    }) 
    var imgSrc2 = myChart1.getDataURL({
        type:"png"
    }) 
    var node=$("<div>").attr({id:'container'}).css({"text-align":"center"})
        .append($('<img>').attr("src",imgSrc))
        .append($('<img>').attr("src",imgSrc2))
        .append($('<p>').html("来了,老弟").css({"font-size":"12px","text-align":"center","color":"red"}))
    
    $("#word-export").click(function(event) {
        node.wordExport("测试");
    });
})