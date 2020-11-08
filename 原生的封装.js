// 1.获取类名的兼容问题
// father  父容器
// classname   类名
function getClass(classname,father){
	father=father||document;
	if(father.getElementsByClassName){
		return father.getElementsByClassName(classname);
	}else{
		var all=father.getElementsByTagName("*");
		var newarr=[];
		for(var i in all){
			if(clickPre(all[i].className,classname)){
				newarr.push(all[i]);
			}
		}
		return newarr;
	}
}
function clickPre(str,classname){
	var arr=str.split(" ");
	for(var i in arr){
		if(arr[i]==classname){
			return true;
		}
	}
	return false;
}


//2. 获取样式的通用兼容
// obj:对象
// attr:属性
// attribute属性
function getStyle(obj,attr){
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,null)[attr];
	}
}


// 3.获取函数的兼容函数
function $(selecter,father){
	if(typeof selecter=="string"){
		father=father||document;
		selecter=selecter.replace(/^\s*|\s*$/g,"");//去前后所有空格
		if(selecter.charAt(0)=="."){
			return getClass(selecter.slice(1),father);
		}else if(selecter.charAt(0)=="#"){
			return document.getElementById(selecter.slice(1));
		}else if(/^[a-z]+\d*$/g.test(selecter)){
			return father.getElementsByTagName(selecter);
		}else if(/^<[a-z]+\d*>$/g.test(selecter)){
			return document.createElement(selecter.slice(1,-1));
		}
	}else if(typeof selecter=="function"){
		window.onload=function(){
			selecter();//运行这个函数；
		}
	}
}


// 4.获取节点中的子节点
// father  父节点
// type  "a"  子节点只有元素节点
//   	"b"   有元素节点和文本节点
function getChilds(father,type){
	type=type||"a";
	var arr=[];
	var all=father.childNodes;
		for(var i=0;i<all.length;i++){
			if(type=="a"){
				if(all[i].nodeType==1){
					arr.push(all[i]);
				}
			}else if(type=="b"){
				if(all[i].nodeType==1||(all[i].nodeType==3 && all[i].nodeValue.replace(/^\s*|\s*$/g,""))!=""){
					arr.push(all[i]);
				}
			}
		}
	return arr;
}


// 5.获取第一个子节点
function getFirst(father,type){
	return getChilds(father,type)[0];
}


// 6.获取最后一个节点
function getLast(father,type){
	var i=getChilds(father,type).length-1;
	return getChilds(father,type)[i];
}


// 7.获取指定节点
function getNum(father,num,type){
	return getChilds(father,type)[num-1];
}


// 8.获取下一个兄弟节点
function getNext(obj,type){
	var type=type||"no";
	var next=obj.nextSibling;
	if(!next){
		return false;
	}
	if(type=="no"){
		while(next.nodeType==3 || next.nodeType==8){
			next=next.nextSibling;
			if(!next){
				return false;
			}
		}
	}else if(type=="yes"){
		while(next.nodeType==3&&!next.nodeValue.replace(/^\s*|\s*$/g,"")||next.nodeType==8){
			next=next.nextSibling;
			if(!next){
				return false;
				}
		}
	}
	return next;
}


// 9.获取上一个兄弟节点
function getPre(obj,type){
	var type=type||"no";
	var pre=obj.previousSibling;
	if(!pre){
		return false;
	}
	if(type=="no"){
		while(pre.nodeType==3 || pre.nodeType==8){
			pre=pre.previousSibling;
			if(!pre){
				return false;
			}
		}
	}else if(type=="yes"){
		while(pre.nodeType==3&&!pre.nodeValue.replace(/^\s*|\s*$/g,"")||pre.nodeType==8){
			pre=pre.previousSibling;
			if(!pre){
				return false;
				}
		}
	}
	return pre;
}


// 10.把一个元素插入到某一个元素之前
function insertBefore(newobj,oldobj){
	var father=oldobj.parentNode;
	father.insertBefore(newobj,oldobj);
}


// 11.把一个元素插入到某一个元素之后
function insertAfter(newobj,oldobj){
	var next=getNext(oldobj,"yes");
	var father=oldobj.parentNode;
	if(next){
		father.insertBefore(newobj,next);
	}else{
		father.appendChild(newobj);
	}
}


// 12.绑定事件的兼容函数
function addEvent(obj,event,fun){
	if(obj.attachEvent){
		obj.attachEvent("on"+event,funEvent);
	}else{
		obj.addEventListener(event,funEvent,false);
	}
	return funEvent;
	 function funEvent (e) {
     	var e=e||window.event;
     	fun.call(obj,e);
 	}
}


// 13.删除事件的兼容函数
function removeEvent(obj,event,fun){
	if(obj.attachEvent){
		obj.detachEvent("on"+event,fun);
	}else{
		obj.removeEventListener(event,fun,false);
	}
}


// 14.兼容鼠标滚轮的函数
function mouseWheel(obj,upfun,downfun){
	if(document.attachEvent){
		document.attachEvent("onmousewheel",scrollFn);
	}else if(document.addEventListener){
		document.addEventListener("mousewheel",scrollFn,false);
		document.addEventListener("DOMMouseScroll",scrollFn,false);
	}
	function scrollFn(e){
		var eve=e||event;
		if(eve.returnValue){
			eve.returnValue=false;
		}else{
			eve.preventDefault();
		}
		var fangxiang=eve.wheelDelta||eve.detail;
		if(fangxiang==-3||fangxiang==120){
			if(upfun){
				upfun.call(obj);
			}
		}
		if(fangxiang==3||fangxiang==-120){
			if(downfun){
				downfun.call(obj);
			}
		}
	}
}


//15.hover
//判断某个元素是否包含有另外一个元素
 function contains (parent,child) {
	if(parent.contains){
	    return parent.contains(child) && parent!=child;
	}else{
	    return (parent.compareDocumentPosition(child)===20);
	}
 }


//16.判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
function checkHover (e,target) {
    if(getEvent(e).type=="mouseover"){
    	return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&!((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
   }else{
    	return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&!((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
    }
}


//17.鼠标移入移出事件
/*
  obj   要操作的对象
  overfun   鼠标移入需要处理的函数
  outfun     鼠标移除需要处理的函数
*/
function hover (obj,overfun,outfun) {
    if(overfun){
	    obj.onmouseover=function  (e) {
	        if(checkHover(e,obj)){
	           overfun.call(obj,[e]);
	        }
	    }
    }
    if(outfun){
    	obj.onmouseout=function  (e) {
	        if(checkHover(e,obj)){
	           outfun.call(obj,[e]);
	        }
      }
    }
}
function getEvent (e){
      return e||window.event;
}


//18.cookie
//cookie设置
function setCookie(attr,value,time){
 	if(time){
 		var nowtime=new Date();
 		nowtime.setTime(nowtime.getTime()+time*1000);
 		document.cookie=attr+"="+value+";expires="+nowtime.toGMTString();
 	}else{
 		document.cookie=attr+"="+value;
 	}
}


// 19.cookie获取
// ["aa=bb","bb=cc","cc=dd"]
// [[aa,bb],[bb,cc],[cc,dd]]
function getCookie(attr){
 	var cookies=document.cookie;
 	var arr=cookies.split("; ");
 	for (var i = 0; i < arr.length; i++) {
 		var brr=arr[i].split("=");
 		if(brr[0]==attr){
 			return brr[1];
 		}
 	};
 	return false;
}


 // 20.cookie删除
 function delCookie(attr){
 	var nowtime=new Date();
 	nowtime.setTime(nowtime.getTime()-1);
 	document.cookie=attr+"=asd;expires="+nowtime.toGMTString();
 }