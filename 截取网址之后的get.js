
var str="www.baidu.com?a=1&b=2&c=3&d=xxx";
ti(str);
function ti(str){
	var arr=[];
	var obj={};
	var index=str.indexOf("?");
	str=str.substr(index+1);
	arr=str.split("&");
	for (var i = 0; i < arr.length; i++) {
		var newarr=arr[i].split("=");
		obj[newarr[0]]=newarr[1];
	};
	console.log(obj)
}