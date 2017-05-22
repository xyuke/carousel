;(function($){
	var Carousel = function(poster){
		var self = this;
		this.poster = poster;
		this.posterItemMain = poster.find("ul.poster-list");
		this.nextBtn  = poster.find("div.poster-next-btn");
		this.prevBtn  = poster.find("div.poster-prev-btn");
		this.posterItems = poster.find("li.poster-item");
		if(this.posterItems.size()%2 == 0){
			this.posterItemMain.append(this.posterItems.eq(this.posterItems.size()/2).clone());
			this.posterItems = this.posterItemMain.children()
		}
		this.posterFristItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.rotateFlag = true;
		this.setting = {
						"width" : 1000,
						"height" : 270,
						"posterWidth" : 640,
						"posterHeight" : 270,
						"verticalAlign" : "middle",
						"scale" : 0.9,
						"speed" : 500,
						"autoPlay":true,
						"delay":2000
		};
		$.extend(this.setting,this.getSetting())
		this.setSettingValue()
		this.setPosterPos()
		this.nextBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("left")
			}
		});
		this.prevBtn.click(function(){
			if(self.rotateFlag){
				self.rotateFlag = false;
				self.carouseRotate("right")
			}
		});
		//判断是否开启自动播放
		if(this.setting.autoPlay){
			this.autoPlay()
			this.poster.hover(function(){
				window.clearInterval(self.timer);
			},function(){
				self.autoPlay();
			})
		}
	};

	Carousel.prototype = {
		autoPlay:function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.nextBtn.click();
			},self.setting.delay)
		},
		//设置右边的旋转
		carouseRotate:function(direction){
			var _this_ = this;
			var zIndexArr = [];
			if(direction==="left"){
				this.posterItems.each(function(){
					var self = $(this),
						prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
						width = prev.width(),
						height = prev.height(),
						zIndex = prev.css("zIndex"),
						opacity = prev.css("opacity"),
						left = prev.css("left"),
						top = prev.css("top");
						zIndexArr.push(zIndex);
					self.animate({
								width:width,
								height:height,
								opacity:opacity,
								left:left,
								top:top
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i])
				})
			}else if(direction==="right"){
				this.posterItems.each(function(){
					var self = $(this),
						next = self.next().get(0)?self.next():_this_.posterFristItem,
						width = next.width(),
						height = next.height(),
						zIndex = next.css("zIndex"),
						opacity = next.css("opacity"),
						left = next.css("left"),
						top = next.css("top");
						zIndexArr.push(zIndex);
					self.animate({
								width:width,
								height:height,
								opacity:opacity,
								left:left,
								top:top
					},_this_.setting.speed,function(){
						_this_.rotateFlag = true;
					});
				});
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i])
				})
			}
		},
		//获取人工配置参数
		getSetting:function(){
			var setting = this.poster.attr("data-setting")
			if(setting&&setting!==""){
			return $.parseJSON(setting)
			}else{
				return {}
			}
		},
		setSettingValue:function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.posterItemMain.css({
				width:this.setting.width,
				height:this.setting.height
			});
			//计算上下按钮宽度
			var w = (this.setting.width-this.setting.posterWidth)/2;
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.posterFristItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.floor(this.posterItems.size()/2)
			})
		},
		//设置剩余的帧的位置
		setPosterPos:function(){
			var self = this;
			var sliceItems = this.posterItems.slice(1),
				slicesize = sliceItems.size()/2,
				rightSlice = sliceItems.slice(0,slicesize),
				leftSlice = sliceItems.slice(slicesize),
				level = Math.floor(this.posterItems.size()/2);

			var rw = this.setting.posterWidth,
				rh = this.setting.posterHeight,
				gap = ((this.setting.width-this.setting.posterWidth)/2)/level;	
			var fristLeft = (this.setting.width-this.setting.posterWidth)/2;
			var fixOffsetLeft = fristLeft+rw;	
			//设置右边帧的位置关系
			rightSlice.each(function(i){
				level--;
				rw = rw*self.setting.scale;
				rh = rh*self.setting.scale;
				var j = i;
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++j),
					left:fixOffsetLeft+(++i)*gap-rw,
					top:self.setVertucalAlign(rh)
				})
			});
			//设置左边帧的位置关系
			var lw = rightSlice.last().width(),
				lh = rightSlice.last().height(),
				oloop = Math.floor(this.posterItems.size()/2);
			leftSlice.each(function(i){
				$(this).css({
					zIndex:i,
					width:lw,
					height:lh,
					opacity:1/oloop,
					left:i*gap,
					top:self.setVertucalAlign(lh)
				})
				lw = lw/self.setting.scale;
				lh = lh/self.setting.scale;
				oloop--;
			});	
		},
		//设置垂直排列对齐
		setVertucalAlign:function(height){
			var verticalType = this.setting.verticalAlign,
				top = 0;
			;
			if(verticalType==="middle"){
				top = (this.setting.height-height)/2
			}else if(verticalType==="top"){
				top = 0;
			}else if(verticalType==="bottom"){
				top = this.setting.height-height
			}else{
				top = (this.setting.height-height)/2
			}
			return top;
		}
	};
	Carousel.init = function(posters){
		var _this_ = this;
		posters.each(function(){
			new _this_($(this))
		})
	}
	window["Carousel"] = Carousel;
})(jQuery);