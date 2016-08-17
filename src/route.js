'use strict';

(function(){
	function route(){
		this.states={};
		this.defaultPath="";
		this.activeStates=[];
		this.isloaded=false;
		this.trackUrlPos=0;
		setTimeout(function(){
			this.init.call(this);
			window.onhashchange=this.init.bind(this);
		}.bind(this),0);
	}
	route.prototype.findView=function(urls,i){
		var url='/'+urls[i];
		console.log(i);
		for(var e in this.states){
			if(this.states[e].url===url){
				this.loadTemplate(this.states[e].templateUrl,function(html){
					var insertLocation;
					// if(this.activeStates[i]){//存在view的加载位置
						// insertLocation=this.activeStates[i].element;
					// }else{
						if(this.activeStates[i-1]){//查找父级view的位置，存在则从这里开始搜索
							insertLocation=locateView(this.activeStates[i-1].element,'view');
						}else{//默认从body开始搜索view的位置
							var body=document.getElementsByTagName('body')[0];
							insertLocation=locateView(body,'view');
						}
						this.activeStates[i]={element:insertLocation};
					// }
					// 插入模板
					insertLocation && (insertLocation.innerHTML=html);
					console.log(insertLocation);
					if(urls.length>i){
						this.findView(urls,++this.trackUrlPos);
					}
				}.bind(this));
			}else{
				// window.location.hash=this.defaultPath;
			}
		}
	}
	function locateView(startNode,condition){
		if(startNode){
			var children=startNode.children;
			for(var i=0;i<children.length;i++){
				if(children[i].getAttribute(condition)!==null){
					return children[i];
				}
			}
			for(var i=0;i<children.length;i++){
				var child=locateView(children[i],condition);
				if(child){
					return child;
				}
			}
		}
		return ;
	}
	route.prototype.init=function(){
		console.log(window.location.hash)
		this.trackUrlPos=0;
		var url=window.location.hash.slice(2);
		var urls=url.split('/');
		var self=this;
		// for(var i=0;i<urls.length;i++){
			// setInterval(function(i){
				// console.log(this.isloaded)
				// if(this.isloaded){
					self.findView(urls,this.trackUrlPos);
				// }
			// }.bind(self),20);
		// }
	}
	route.prototype.state=function(stateName,obj){
		this.states[stateName]=obj;
		return this;
	}
	route.prototype.otherwise=function(url){
		this.defaultPath=url;
	}
	route.prototype.loadTemplate=function(templateUrl,cb){
		var xhr=new XMLHttpRequest();
		xhr.open('GET',templateUrl,true);
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4 && xhr.status==200){
				cb(xhr.responseText);
			}
		}
		xhr.send();
	}

	window.route=new route();
})();