function FindStep(mt)
{
    var my=this;
    //this.bgMatrix=mt;
    this.bgMatrix=[[2,1,3],[0,4,5],[7,8,6]];
    //this.ok=[[1,2,3,4],[5,6,7,8,9],[10,11,12,0]];
    this.ok=[[1,2,3],[4,5,6],[7,8,0]];
    this.resultSource=[];
    this.col=3;
    this.row=3;
    this.sameSpace=[];
    this.Begin=function()
    {
        var isOk=false;
        my.sameSpace=[[0,-1,my.bgMatrix]];
        var code=1;
        var para=[[0,-1,my.bgMatrix]];
        var temPara;
        var cS=0,cUS=0;
        while(isOk==false)
        {
            temPara=[];
            var countPara=para.length;
            for(var a=0;a<countPara;a++)//for 1
            {
                var sameMx=para[a][2];
                var key=para[a][0];
                var zeroRC=my.Find0(sameMx);
                var result=my.MakeMove(sameMx,zeroRC[0],zeroRC[1]);
                var count=result.length;
                for(var i=0;i<count;i++)//for 2
                {
                    var check=my.CheckOk(result[i]);
                    if(check==true)
                    {
                        isOk=true;
                        my.sameSpace.push([code,key,result[i]]);
                        my.EndFind();
                        return;
                    }
                    else
                    {
                        var checkSame=my.CheckSame(result[i]);
                        if(checkSame==false)//add to same space
                        {
                            my.sameSpace.push([code,key,result[i]]);
                            temPara.push([code,key,result[i]]);
                            code++;
                            cS++;
                        }
                        else
                        {
                            cUS++;
                        }
                        
                        
                    }
                    
                }//end for2
                
            }//end for 1
            if(temPara.length==0)
            {
                console.log('Code: '+code+' no way ');
                return;
            }
            console.log('Code: '+code);
            para=temPara;
            if(code>100000)
            {
                console.log('same: '+cS);
                console.log('un same:'+cUS);
                return;
            }
        }//end while
    }//end
    
    this.EndFind=function()
    {
        var count=my.sameSpace.length;
        console.log(my.sameSpace[count-1]);
        console.log(count);
    }
    
    this.Find0=function(mx)
    {
        for(var i=0;i<my.row;i++)
        {
            for(var j=0;j<my.col;j++)
            {
                if(mx[i][j]==0)
                {
                    return [i,j];
                }
            }
        }
        return [];
    }//end
    
    this.MakeMove=function(mx,rIndex,cIndex)
    {
        var result=[];
        if(cIndex>0)//move left
        {
            var lMove=my.CopyMatrix(mx);
            lMove[rIndex][cIndex]= lMove[rIndex][cIndex-1];
            lMove[rIndex][cIndex-1]=0;
            result.push(lMove);
        }
        if(cIndex<my.col-1)//move right
        {
            var rMove=my.CopyMatrix(mx);
            rMove[rIndex][cIndex]=rMove[rIndex][cIndex+1];
            rMove[rIndex][cIndex+1]=0;
            result.push(rMove);
        }
        if(rIndex>0)//move down
        {
            var dMove=my.CopyMatrix(mx);
            dMove[rIndex][cIndex]=dMove[rIndex-1][cIndex];
            dMove[rIndex-1][cIndex]=0;
            result.push(dMove);
        }
        if(rIndex<my.row-1)//move up
        {
            var uMove=my.CopyMatrix(mx);
            uMove[rIndex][cIndex]=uMove[rIndex+1][cIndex];
            uMove[rIndex+1][cIndex]=0;
            result.push(uMove);
        }
        return result;
    }//end
    
    this.CopyMatrix=function(mt)
    {
        var result=[];
        for(var i=0;i<my.row;i++)
        {
            var rowItem=[];
            for(var j=0;j<my.col;j++)
            {
                var tem=mt[i][j];
                rowItem.push(tem);
            }
            result.push(rowItem);
        }
        return result;
    }//end
    this.CheckOk=function(mx)
    {
        return my.Compare(my.ok,mx);
    }
    this.ReCheck=function()
    {
        var count=my.sameSpace.length;
        for(var i=0;i<count;i++)
        {
            var check= my.Compare(my.sameSpace[i][2],my.ok);
            if(check==true)
            {
                console.log('ok at: '+i);
            }
            
        }
        console.log('all false');
    }
    this.CheckSame=function(mx)
    {
        var count=my.sameSpace.length;
        for(var i=0;i<count;i++)
        {
            var sameMx=my.sameSpace[i][2];
            var check=my.Compare(sameMx,mx);
            if(check==true)
            {
                return true;
            }
        }
        return false;
    }//end
    this.Compare=function(mx1,mx2)
    {
        for(var i=0;i<my.row;i++)
        {
            for(var j=0;j<my.col;j++)
            {
                if(mx1[i][j]!=mx2[i][j])
                {
                    return false;
                }
            }
        }
        return true;
    }
    my.Begin();
}//end class