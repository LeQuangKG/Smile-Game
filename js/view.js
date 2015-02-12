/*
	Name : Mini Game
	Create : Le Viet Quang (quang.le@ringierstudios.com)
	Date : 2 - 7 - 2012
	Version : 1.0
	Project : Burgerstein App
*/

var imgList=['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg','img/11.jpg','img/12.jpg','img/13.jpg','img/14.jpg','img/15.jpg',''];
var imgListC=['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg','img/11.jpg','img/12.jpg','img/13.jpg','img/14.jpg','img/15.jpg',''];
var winList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var _replay, _sound, _win, _vid, _au;
var img;
var flag = false;
var test =0;
var trick = false;
window.onload=function()
{
	//test = document.getElementById("test");
    var gm=new CardGame();
    
}
//create random 0 -> num;
function Random(num)
{
    num++;
    return Math.floor( Math.random()*num );
}
function CardGame()
{
    var my=this;
    this.col=4;
    this.row=4;
    this.items=[];
    this.UI=null;
    this.w=580;
    this.h=580;
    this.itemW=145;
    this.itemH=145
    this.focusItem=null;
    this.paddingL=0;
    this.paddingT=0;
    this.blankRow=0;
    this.blankCol=0;
    this.bkImgList=[];
    this.blankDiv=null;
	this.p = 0;
	this.curX, this.curY, this.dx, this.dy;
    
    this.IniGame=function()
    {
        var count=imgList.length;
        for(var i=0;i<count;i++)
        {
            var url=imgList[i];
            my.bkImgList.push(url);
        }
        my.IniUI();
        my.IniCardLayout();
        
        CardGame.Ins=my;
    }
    
    this.IniUI=function()
    {
		img = new Image();
		img.src = 'img/Sound_off.png';
		_replay = document.getElementById("replay");
		_sound = document.getElementById("sound");
		_win = document.getElementById("win");
		//_vid = document.getElementById("vid");
		_au = document.getElementById("au");
		_vid= document.getElementById("vid");
        my.UI=document.createElement('div');
        my.UI.style.position='absolute';
        my.UI.style.top='0px';
        my.UI.style.left='0px';
        my.UI.style.width=my.w+'px';
        my.UI.style.height=my.h+'px';
        my.UI.style.background='url(img/bg.jpg)';
        document.getElementById("game").appendChild(my.UI);
        
        my.blankDiv=document.createElement('div');
        my.blankDiv.style.position='absolute';
        my.blankDiv.style.width=my.itemW+'px';
        my.blankDiv.style.height=my.itemH+'px';
        my.blankDiv.style.backgroundImage='url(img/16.jpg)';
        my.blankDiv.style.backgroundRepeat='no-repeate';
        document.getElementById("game").appendChild(my.blankDiv);
        
        
        my.UI.addEventListener('mousemove',my.MouseMove,false);
        my.UI.addEventListener('mouseup',my.MouseUp,false);
        my.UI.addEventListener('touchmove',my.MouseMove,false);
        my.UI.addEventListener('touchend',my.MouseUp,false);
		_replay.addEventListener('touchstart',my.RePlay,false);
		_sound.addEventListener('touchstart',my.PlayMusic,false);
		//document.body.addEventListener('touchmove',function(){e.preventDeault();},false);
        //document.getElementById("wrapper").addEventListener('touchmove',function(){e.preventDeault();},false);
    }
	
	this.PlayMusic =function(){
		if(_au.paused){			
			_au.play();
			_sound.style.background ='url('+img.src+')';
		}
		else{
			_au.pause();
			_sound.style.background ='url(img/Sound_on.png)';
		}
	}
    
    this.IniCardLayout=function()
    {
        var left = (my.w - my.itemW*my.col)/2;
        var top= ( my.h - my.itemH*my.row )/2;
        my.paddingL=left;
        my.paddingT=top;
		var count = 0;
        for(var i=0;i<my.row;i++)
        {
            var rowItem=[];
            
            for(var j=0;j<my.col;j++)
            {
                var imgIndex=Random(imgList.length-2);
                var url=imgList[imgIndex];
                var t=(top+i*my.itemH);
                var l=(left+j*my.itemW);
                if(count<15 )
                {
                    var item=new Card(url,my.itemW,my.itemH);
                    item.colIndex=j;
                    item.rowIndex=i;
                    item.img = imgIndex;
                    item.UI.style.top=t+'px';
                    
                    item.UI.style.left=l+'px';
                    my.UI.appendChild(item.UI);
                    item.NotifyMoving=my.ItemBeginMoveAction;
                    item.NotifyEndMove=my.ItemEndMoveAction;
					if(winList[i+j]==imgIndex+1) my.p = my.p+1;
                    rowItem.push(item);
                }
                else
                {
                    my.blankCol=j;
                    my.blankRow=i;
                    my.blankDiv.style.top=435+'px';
                    my.blankDiv.style.left=435+'px';
                    rowItem.push(null);
                }
                imgList.splice(imgIndex,1);
				count = count + 1;
            }
            my.items.push(rowItem);
        }
        imgList=[];
        var count=my.bkImgList.length;
        for(var i=0;i<count;i++)
        {
            var url=my.bkImgList[i];
            imgList.push(url);
        }
        
    }
    
    this.MouseMove=function(e)
    {
        var x,y;
        if(e.clientX!=undefined)
        {
            x=e.clientX-83;
            y=e.clientY-84;
        }
        else
        {
            if(e.touches.length==3)
            {
                
                my.Finish();
                return;
            }           
        }
        
        if(my.focusItem==null)
        {
            return;
        }
        if(my.focusItem.colIndex==my.blankCol)
        {
            var tIndex,bIndex;
            if(my.focusItem.rowIndex>my.blankRow)
            {
                tIndex=my.blankRow;
                bIndex=my.focusItem.rowIndex;
            }
            else
            {
                tIndex=my.focusItem.rowIndex;
                bIndex=my.blankRow;
            }
            var t=(y-my.focusItem.clickY);
            var bCard = t+my.itemH;
            var blankT=my.paddingT + tIndex * my.itemH;
            var cardBottom = my.paddingT +  (bIndex + 1 )* my.itemH;
            if(blankT < t && bCard <cardBottom)
            {
                my.focusItem.UI.style.top=t+'px';
            }
        }
        else
        {
            var lIndex,rIndex;
            if(my.focusItem.colIndex > my.blankCol)
            {
                lIndex = my.blankCol;
                rIndex = my.focusItem.colIndex;
            }
            else
            {
                lIndex = my.focusItem.colIndex;
                rIndex = my.blankCol;
            }
            var l=(x-my.focusItem.clickX);
            var rCard=l + my.itemW;
            var blankL = my.paddingL + lIndex * my.itemW;
            var cardR= my.paddingL +( rIndex + 1 )*my.itemW;
            if(blankL< l&& rCard <cardR)
            {
                my.focusItem.UI.style.left=l+'px';
            }
            
        }
		my.dx = x - my.curX;
		my.dy = y - my.curY;
		my.curX = x;
		my.curY = y;
        
    }
    
    this.MouseUp=function(e)
    {
        if(my.focusItem==null)
        {
            return;
        }
        //var x=my.paddingL + (my.blankCol + 1) * my.itemW ;
        //var y = my.paddingT + ( my.blankRow +1) * my.itemH;
		var x,y;
        if(e.clientX!=undefined)
        {
            x=e.clientX-83;
            y=e.clientY-84;
        }
        else
        {
            if(e.touches.length==3)
            {
                
                my.Finish();
                return;
            }
            x=e.touches[0].clientX-83;
            y=e.touches[0].clientY-84;
        }
        my.ItemEndMoveAction(my.focusItem,x,y);
    }
	
	this.Win = function(){
		var num = my.items.length;
		for(var i=0; i< num; i++){
			for(var j=0; j<num;j++){
				if(i==3&&j==3) break;
				var item = my.items[i][j];
				if(item!=null){
					var j1 = item.colIndex;
					var i1 = item.rowIndex;
					var m = j1 + (i1)*4;
					if(winList[m]!=item.img+1) return false;
				}
			}
		}
		return true;
	}
	
	this.ShowLink=function(){
		alert('you win');
	}
    
    this.ItemBeginMoveAction=function(item)
    {
        if(my.focusItem!=null)
        {
            my.focusItem.EndAni();
        }
        
        if(item.urlImg=='')
        {
            my.focusItem=null;
        }
        else
        {
            var check=my.CheckMoveAble(item);
            //console.log(check);
            if(check==true)
            {
                my.focusItem=item;
            }
        }
    }
    
    this.ItemEndMoveAction=function(item,x,y)
    {
        if(item!=my.focusItem)
        {
            return;
        }
        
        var rowCol=my.FindRowCol(x,y);
        var card = my.items[rowCol[0]][rowCol[1]];
        if(card == null&&my.focusItem!=null)
        {
            my.items[rowCol[0]][rowCol[1]]=item;
            my.items[item.rowIndex][item.colIndex]=null;
            my.blankRow=item.rowIndex;
            my.blankCol=item.colIndex;
            item.rowIndex = rowCol[0];
            item.colIndex = rowCol[1];
			//console.log(rowCol[0]);
            var l = my.paddingL + rowCol[1]*my.itemW;
            var t = my.paddingT + rowCol[0]*my.itemH;
            var oldL= my.paddingL + my.blankCol*my.itemW;
            var oldT= my.paddingT + my.blankRow*my.itemH;
            my.blankDiv.style.top=oldT+'px';
            my.blankDiv.style.left=oldL+'px';
            item.PlayAni(l,t);
        }
       else
       {
            item.PlayAni(item.oldL,item.oldT);
        }
        
        my.focusItem=null;
		var result = my.Win();
		if(result==true) {
			//_vid.style.visibility = 'visible';
			_win.style.visibility = 'visible';
		};
    }
    
    this.CheckMoveAble=function(card)
    {
        var item;
        var top=[card.rowIndex-1,card.colIndex];
        if(top[0]>=0)
        {
            item=my.items[top[0]][top[1]];
            if(item==null)
            {
                return true;
            }
        }
        var bottom=[card.rowIndex+1,card.colIndex];
        if(bottom[0]<my.row)
        {
            item=my.items[bottom[0]][bottom[1]];
            if(item==null)
            {
                return true;
            }
        }
        var left=[card.rowIndex,card.colIndex-1];
        if(left[1]>=0)
        {
            item=my.items[left[0]][left[1]];
            if(item==null)
            {
                return true;
            }
        }
        var right=[card.rowIndex,card.colIndex+1];
        if(right[1]<my.col)
        {
            item=my.items[right[0]][right[1]];
            if(item==null)
            {
                return true;
            }
        }
        return false ;
    }
    
    this.FindRowCol=function(x,y)
    {   
		/*if(Math.abs(my.dx)>Math.abs(my.dy)){
			if(my.dx>0) x = x+30;
			else x = x-30;
		}
		else{
			if(my.dy>0) y = y+30;
			else y = y-30;
		}
        var mod = x % my.itemW;
        var div= (x-mod)/my.itemW;
        var col = div;
        mod = y % my.itemH;
        div = (y-mod) /my.itemH;
        var row = div;		
		if(col>3) col=3;
		if(row>3) row=3;
		var text ='dx= '+my.dx+'<br/>dy='+my.dy+'<br/>mod= '+mod+'<br/>row= '+row+'<br/>div='+div;
		test.innerHTML = text;*/
		row = my.blankRow;
        col = my.blankCol;
        return [row,col];
    }
	
	this.RePlay = function(){
		//_vid.style.visibility = 'hidden';
		_vid.currentTime=0;
		_vid.pause();
		_win.style.visibility = 'hidden';
		var a=0;
		for(var i=0;i<my.row;i++)
		{
			for(var j=0;j<my.col;j++)
			{
				if(my.items[i][j]!=null)
					my.UI.removeChild(my.items[i][j].UI);
				
			}
		}
		my.items=[];
		_sound.style.background ='url(img/Sound_on.png)';
		my.IniCardLayout();
	}
    
    this.Finish=function()
    {
        test = test+1;
		trick = true;
		console.log(test);
        var left = (my.w - my.itemW*my.col)/2;
        var top= ( my.h - my.itemH*my.row )/2;
        my.paddingL=left;
        my.paddingT=top;
        var a=0;
        for(var i=0;i<my.row;i++)
        {
            for(var j=0;j<my.col;j++)
            {
                if(my.items[i][j]!=null)
                    if(my.items[i][j].UI) my.UI.removeChild(my.items[i][j].UI);
                
            }
        }
        my.items=[];
        
        for(var i=0;i<my.row;i++)
        {
            var rowItem=[];
            for(var j=0;j<my.col;j++)
            {
                var url=imgListC[a];
                var t=(top+i*my.itemH);
                var l=(left+j*my.itemW);
                if(url!='')
                {
                    var item=new Card(url,my.itemW,my.itemH);
                    item.colIndex=j;
                    item.rowIndex=i;
                    item.img = a;
                    item.UI.style.top=t+'px';
                    
                    item.UI.style.left=l+'px';
                    my.UI.appendChild(item.UI);
                    item.NotifyMoving=my.ItemBeginMoveAction;
                    item.NotifyEndMove=my.ItemEndMoveAction;
                    rowItem.push(item);
                }
                else
                {
                    my.blankCol=3;
                    my.blankRow=3;
					var t=(top+3*my.itemH);
                	var l=(left+3*my.itemW);
                    my.blankDiv.style.top=t+'px';
                    my.blankDiv.style.left=l+'px';
                    rowItem.push(null);
                }
                a++;
				//console.dir(rowItem);
            }
			if(rowItem!=null) my.items.push(rowItem);
			//console.dir(my.items);
			
        }
		if(true){
			//_vid.style.visibility = 'visible';
			//console.log(_vid);
			//_au.stop;
			if(_au.paused){	
				_sound.style.background ='url('+img.src+')';
			}
			else{
				_au.pause();
				_sound.style.background ='url(img/Sound_on.png)';
			}
			_vid.play();
			_win.style.visibility = 'visible';
		}
    }
    my.IniGame();
}
CardGame.isAni=false;
CardGame.Ins=null;
function Card(urlImg,w,h)
{
    var my=this;
    this.urlImg=urlImg;
    this.UI=null;
    this.colIndex=0;
    this.rowIndex=0;
	this.img=0;
    this.w=w;
    this.h=h;
    this.NotifyMoving=null;
    this.NotifyEndMove=null; 
    this.clickX=0;
    this.clickY=0;
    this.oldT='';
    this.oldL='';
    this.dur=0.2;
    
    this.IniCard=function()
    {
        var card=document.createElement('div');
        card.style.backgroundImage='url('+urlImg+')';
        card.style.position='absolute';
        card.style.width=(my.w)+'px';
        card.style.height=(my.h)+'px';
        card.style.backgroundRepeat='no-repeat';
        
        my.UI=card;
        
        my.UI.addEventListener('mousedown',my.BeginMove,false);
        my.UI.addEventListener('mouseup',my.EndMove,false);
        my.UI.addEventListener('webkitTransitionEnd',my.EndAni,false);
        my.UI.addEventListener('touchstart',my.BeginMove,false);
        my.UI.addEventListener('touchend',my.EndMove,false);
    }
    
    this.BeginMove=function(e)
    {
		trick = false;
        
        var x,y;
        if(e.clientX!=undefined)
        {
            x=e.clientX-83;
            y=e.clientY-84;
        }
        else
        {
            e.preventDefault();
            x=e.touches[0].clientX-83;
            y=e.touches[0].clientY-84;
        }
        
        
        var t=my.UI.offsetTop,l=my.UI.offsetLeft;
        my.clickX=x-l;
        my.clickY=y-t;
        
        if(my.NotifyMoving!=null)
        {
            my.NotifyMoving(my);
        }
        
        my.UI.style.zIndex=5;
        my.oldT=Number( my.UI.style.top.replace('px','') );
        my.oldL= Number( my.UI.style.left.replace('px','') );
    }
    
    this.EndMove=function(e)
    {
		if(trick==true) return;
        var x,y;
        if(e.clientX!=undefined)
        {
            x=e.clientX-83;
            y=e.clientY-84;
        }
        else
        {
            x=e.changedTouches[0].clientX-83;
            y=e.changedTouches[0].clientY-84;
        }
        
        if(my.NotifyEndMove!=null)
        {
            my.NotifyEndMove(my,x,y);
        }
        //my.PlayAni(my.oldL,my.oldT);
    }
    
    this.PlayAni=function(x,y)
    {
        
        my.UI.style.webkitTransitionDuration=my.dur+'s';
        setTimeout(function(){
			my.UI.style.left=x+'px';
			my.UI.style.top=y+'px';
		},0);
    }
    
    this.EndAni=function()
    {
        my.UI.style.webkitTransitionDuration='';
        my.UI.style.zIndex='';
    }
    
    this.IniCard();
}