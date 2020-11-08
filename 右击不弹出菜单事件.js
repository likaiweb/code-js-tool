
window.onload = function(){ 
	// 右击菜单事件
	document.oncontextmenu=function(){
		return false; // 返回false不能右击，返回true可以右击弹出菜单。
	} 
} 