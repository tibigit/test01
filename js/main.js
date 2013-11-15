$(document).ready(function() {

	var canvas, stage, preload, _mcs, _msks;
	var $cnvs = $('#cnvs')
	canvas = $cnvs[0];
    stage = new createjs.Stage(canvas);
    stage.scaleX = stage.scaleY = 1;
    createjs.Ticker.setFPS(60);

	// Create an array of items to be load
	var top = 100;
	var left = 51;
	var manifest = [

		{id:"2", src:"02.png", xPos:106, yPos:1, haveMask: 1, maskY:-335, maskHeight:342},
		{id:"3", src:"03.png", xPos:169, yPos:1, haveMask: 1, maskY:345, maskHeight:335},
		{id:"4", src:"04.png", xPos:276, yPos:1, haveMask: 1, maskY:-335, maskHeight:342},
		{id:"5shadow", src:"05s.png", xPos:390, yPos:139, haveMask: 0},
		{id:"5", src:"05.png", xPos:412, yPos:228, haveMask: 1, maskY:345, maskHeight:107},
		{id:"1", src:"01.png", xPos:0, yPos:0, haveMask: 1, maskY:335, maskHeight:345},

		{id:"mooverang", src:"mooverang.png", xPos:113, yPos:392, haveMask: 0},
		{id:"ocu", src:"ocu.png", xPos:170, yPos:778, haveMask: 0},

	];
	
	// If there is an open preload queue, close it.
    if (preload != null) { preload.close(); }

	// Create a preloader
    preload = new createjs.LoadQueue(false, "assets/");
	preload.addEventListener("fileload", handleFileLoad);
    preload.addEventListener("complete", handleComplete);
	
	preload.loadManifest(manifest);



 	_mcs = [];
 	_msks = [];
	function handleFileLoad(e) {

		var image = e.result;
		var w = image.width;
        var h = image.height;
        var movieClip;
		
		var bmp = new createjs.Bitmap(image)

		movieClip = new createjs.Container();
	    movieClip.addChild(bmp);
	    movieClip.set({
			x: e.item.xPos + left,
			y: e.item.yPos + top,
			alpha: 0
        });

        if(e.item.haveMask == 1) {
	        var msk = new createjs.Shape();;
	        msk.graphics.beginFill("#00F").drawRect(e.item.xPos + left, e.item.maskY + top-7, 230, e.item.maskHeight).endFill();
	        _msks.push({_msk: msk, id: e.item.id, maskY: e.item.maskY});
	        movieClip.mask = msk;
	    } 
		_mcs.push({_mc: movieClip, id: e.item.id, haveMask: e.item.haveMask});
    	stage.addChild(movieClip); 

		stage.update();
	}

	function handleComplete() {

		$(window).trigger('resize');

		for(var i=0; i<_mcs.length; i++) {
			if(_mcs[i].haveMask == 1) {
				_mcs[i]._mc.set({alpha: 1});
			}
		}
		stage.update();
		startAnimation();

		$cnvs.click(function(evt) {
			restartAnimation();
		});
	}

	function startAnimation() {		
		var tween = createjs.Tween.get( getMaskById('1'), {override:true}).to({y:-337}, 200, createjs.Ease.linear ).call(go1);
		tween.addEventListener("change", handleTweenChange);
	}

	function restartAnimation() {
		location.reload(); 
	}

	function go1() {
		var tween = createjs.Tween.get( getMaskById('2'), {override:true}).to({y:335}, 200, createjs.Ease.linear ).call(go2);
		tween.addEventListener("change", handleTweenChange);
	}

	function go2() {
		var tween = createjs.Tween.get( getMaskById('3'), {override:true}).to({y:-337}, 200, createjs.Ease.linear ).call(go3);
		tween.addEventListener("change", handleTweenChange);
	}

	function go3() {
		var tween = createjs.Tween.get( getMaskById('4'), {override:true}).to({y:337}, 200, createjs.Ease.linear ).call(go4);
		tween.addEventListener("change", handleTweenChange);
	}

	function go4() {
		var tween = createjs.Tween.get( getMaskById('5'), {override:true}).to({y:-107}, 200, createjs.Ease.cubicOut ).call(showMooverang);
		var tween = createjs.Tween.get( getMcById('5shadow'), {override:true}).to({alpha:1}, 200, createjs.Ease.sineInOut );
		tween.addEventListener("change", handleTweenChange);
	}

	function showMooverang() {
		var tween = createjs.Tween.get( getMcById('mooverang'), {override:true}).to({alpha:1}, 400, createjs.Ease.linear ).call(showOcu);
		tween.addEventListener("change", handleTweenChange);
	}

	function showOcu() {
		var tween = createjs.Tween.get( getMcById('ocu'), {override:true}).to({alpha:1}, 1000, createjs.Ease.cubicOut );
		tween.addEventListener("change", handleTweenChange);
	}

	function handleTweenChange(tween) {
		stage.update();           
	}


	function getMaskById( id ) {
		var msk;
		$.each(_msks, function( i, val ) {
			if(val.id == id) {
				msk = val._msk;
				return false;
			}
		});
		return msk;
	}

	function getMcById( id ) {
		var mc;
		$.each(_mcs, function( i, val ) {
			if(val.id == id) {
				mc = val._mc;
				return false;
			}
		});
		return mc;
	}

	$(window).resize(function() {


	    if($(window).width() < 650) {
	    	$cnvs.width( $(window).width() );
	    } else {
	    	$cnvs.width( 650 );
	    }

		$cnvs.height($(window).height());
		
		var scale = $cnvs.width()/650;
        stage.canvas.height = ( $(window).height()-2 ) /scale;
        if(getMcById('ocu') != undefined) {
			getMcById('ocu').set({
				y: stage.canvas.height - 100
	        });
	        if( getMcById('ocu').y < 600) {
	        	$cnvs.width( 650 * getMcById('ocu').y/600 * scale);
	        	stage.canvas.height = ( $(window).height()-2 ) / (scale* getMcById('ocu').y/600);
	        }
	        getMcById('ocu').set({
				y: stage.canvas.height - 100
	        });
	    }

	    stage.update();
	});

	$(window).trigger('resize');
});