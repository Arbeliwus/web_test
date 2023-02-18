var Data=new Array();
//初始化位置陣列
var Pointlist=new Array();
var inputname;
var column=0;
function setpointlist()
{
    for(let j=0;j<Data.length;j++){
        Pointlist[j]={pointX:0,pointY:0,line:0};
    }
}
function ranData()//隨機給資料
{
    let ranNum;
    let Max=1;//有多少資料
    for(let i=0;i<Max;i++)
    {
        ranNum=Math.random()*100;
        ranNum=Math.round(ranNum);
        Data.push(ranNum);
    }
}
function showResult(i,elementLeft,elementTop,context){//創建div
	
    let treeElement=document.createElement("div");	
    treeElement.setAttribute("id","tree"+i);
    treeElement.setAttribute('class','random animation -delay');
    treeElement.style.animationDelay=Math.random()*1.5+'s';
    treeElement.textContent=context;			
    treeElement.style.left=elementLeft-16+"px";
    treeElement.style.top=elementTop-16+"px";	
    document.querySelector('.overbord').appendChild(treeElement);	
}
function setRandomPosOnClass2_0()//給予隨機位置
{
    //ranData();
    let temp;
    let count=0;
    let bor=0.29;
    let treeX;
    let treeY;
    let sw=0;
    //初始化位置陣列
    let position=new Array();
    for(let i=0;i<window.innerWidth+800;i++){
        position[i]=new Array();
        for(let j=0;j<window.innerHeight;j++){
            position[i][j]={radius:0,isPlanted:0,line:0};//周圍距離 是否種植 連線數
        }
    }
    for(let i=0;i<Data.length;i++)
        if(Data[i]===inputname){
            Pointlist[i]={pointX:window.innerWidth/2,pointY:window.innerHeight/2,line:0}; 
            temp=i;
        }
    for(let i=0;i<Data.length;i++){
    if(Data[i]==='-1')
    {
        console.log(Data[i]);
        continue;
    }
    console.log('I:',i,'DL:',Data[i]);
    //let MinHeight=(window.innerHeight*bor);
    let MinHeight=(window.innerHeight/2)-(window.innerHeight*bor);
    let MaxHeight=(window.innerHeight/2)+(window.innerHeight*(bor+0.1));

    let MinWidth=window.innerWidth*(0.1);
    let MaxWidth=window.innerWidth-(window.innerWidth*(0.1));
    
    if(sw%2===0)//右邊的資料
    {
        treeX=Math.floor(sw*36+(window.innerWidth/2)+40);
        console.log('sw',sw);
        sw++;
    }else{

        treeX=Math.floor((window.innerWidth/2)-40-sw*36);
        if(treeX<0)
            treeX=Math.floor(sw*36+(window.innerWidth/2)+40);
        console.log('2sw',sw);
        sw++;
    }
    if(Data[i]===inputname){
        let treeX=Math.floor(window.innerWidth/2);
        let treeY=Math.floor(window.innerHeight/2);
        let elementLeft=Math.max(treeX-position[treeX][treeY].radius,16);
        let elementTop=Math.max(treeY-position[treeX][treeY].radius,16);				
        showResult(i,elementLeft,elementTop,Data[i]);	
        creatcolumn(i);
        Pointlist[count++]={pointX:elementLeft,pointY:elementTop,line:0};
        continue;
    }
    //隨機選擇位置
   // let treeX=Math.floor(Math.random()*(MaxWidth-MinWidth)+MinWidth);
    treeY=Math.floor(Math.random()*(MaxHeight-MinHeight)+MinHeight);	

    let stoptime=0;
    position[treeX][treeY].isPlanted=1;
    //假如選擇的位址已經有了，則重選 假如選擇位置有重疊到，則重選
    while(position[treeX][treeY].isPlanted===1||CheckHaveSame(position,treeX,treeY))
    {
        if(stoptime===100000){
          // alert('break');
          position[treeX][treeY].isPlanted=1; 
          break;
        }
        MinWidth=0;
        MaxWidth=window.innerWidth+800;
        treeY=Math.floor(Math.random()*(MaxHeight-MinHeight)+MinHeight);	

        stoptime++;
    }
    //假如種植成功則創建div
    if(position[treeX][treeY].isPlanted==1){	

        //顯示資料
        let elementLeft=Math.max(treeX-position[treeX][treeY].radius,16);
        let elementTop=Math.max(treeY-position[treeX][treeY].radius,16);				
        showResult(i,elementLeft,elementTop,Data[i]);	
        //紀錄有哪些點			
        Pointlist[count++]={pointX:elementLeft,pointY:elementTop,line:0};     
    }

    }
    console.log('a',Data[temp]);
   //尋找適合的點並畫線
    findleftpoint2_1(temp);
    findrightpoint2_1(temp);
}
function CheckHaveSame(position,treeX,treeY)//判斷是否有重疊
{
    //設定半徑
    let treeRadius=60;
    //初始設定為可以種植			
    position[treeX][treeY].radius=0;	
    position[treeX][treeY].isPlanted=1;

    //設定檢測範圍    
    for(let i=0;i<Pointlist.length;i++){

  		let x=Pointlist[i].pointX;
        let y=Pointlist[i].pointY;

        //比較兩點的距離判斷是否重疊		
        let xdistance=Math.sqrt(Math.pow(treeX-x,2));						
        let ydistance=Math.sqrt(Math.pow(treeY-y,2));
        let PointDistance=Math.sqrt(Math.pow(treeX-x,2),Math.pow(treeY,2));
        if(ydistance<treeRadius){
            //有重疊到則設定為不能選此位置		
            position[treeX][treeY].radius=0;
            position[treeX][treeY].isPlanted=0;
            return true;
        }													
    }
    //回傳是否有重疊
    if(position[treeX][treeY].isPlanted===0)
    {
        return true;
    }
    else
    {
       // console.log('treeRadius',treeRadius);

        return false;
    }
}
function createLine(x1, y1, x2, y2) //創建連線
{
    //抓取canvas
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    let maxdistance=100;
    let distance=Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
    let ranNum=(Math.random()*(1.2-0.8)+0.8);
    //let ranNum=1;
    let controlpointX=((x1+x2)/2)*ranNum;
    let controlpointY=((y1+y2)/2)*ranNum;
    //假如控制點超過螢幕範圍則重新取
    while(controlpointX>window.innerWidth||controlpointY>window.innerHeight)
    {
        ranNum=(Math.random()*(1.2-0.8)+0.8);
        controlpointX=((x1+x2)/2)*ranNum;
        controlpointY=((y1+y2)/2)*ranNum;
    }
    if(distance<maxdistance)
    {
        ranNum=1.02;
        controlpointX=((x1+x2)/2)*ranNum;
        controlpointY=((y1+y2)/2)*ranNum;
    }
    ctx.quadraticCurveTo(controlpointX,controlpointY,x2,y2);
    ctx.stroke();
}
function creatcanva()//初始化canvas
{
    let setcanvas = document.createElement("canvas");
    //設定canvas畫布大小
    setcanvas.width=window.innerWidth+800;
    setcanvas.height=window.innerHeight;
    //加上動畫效果
    setcanvas.setAttribute('class','line animation -delay');
    //新增在body裡面
    document.querySelector('.overbord').appendChild(setcanvas);
}
function HaveSameLine(linelist,p1,p2)//判斷是否重新連線
{
    if(linelist[p1].point1==p2)
        return true;
    if(linelist[p1].point2==p2)
        return true;
    else
    {
        return false;
    }
}
function Updateslinelist(linelist,p1,p2)//更新連線的資料
{
    if(linelist[p1].point1==-1)
        linelist[p1].point1=p2;
    else
    {
        linelist[p1].point2=p2;
    }
    if(linelist[p2].point1==-1)
        linelist[p2].point1=p1;
    else
    {
        linelist[p2].point2=p1;
    }

}
function GetName()//創建文字輸入框
{
    let container=document.createElement('div');	
    container.setAttribute('class','container input-container');
    document.querySelector('body').appendChild(container);

    let input=document.createElement('input');
    input.type='text';
    input.setAttribute('id','nameInput');
    input.style.display='block';
    input.style.border='2px solid';
    input.style.marginBottom='10px';
    document.querySelector('div').appendChild(input);

    let button=document.createElement('button');
    button.setAttribute('id','confirmButton');
    button.textContent="enter";
    button.onclick= function(){ //按鈕function
        onConfirm();
    };
    document.querySelector('div').appendChild(button);
}
function onConfirm() //輸入文字後輸出資料
{
    let nameInput = document.getElementById("nameInput");
    let confirmButton = document.getElementById("confirmButton");
    let nameDisplay = document.createElement("div");
    nameDisplay.innerText = nameInput.value;//抓取輸入的名稱
    inputname=nameInput.value;
    if(!findData())
    {
        alert("查無資料");
        return;
    }
    nameInput.style.display = "none";
    confirmButton.style.display = "none";
    confirmButton.innerHTML="";
    let parentObj =confirmButton.parentNode;
    parentObj.removeChild(confirmButton);
    parentObj.removeChild(nameInput);
    let temp=parentObj.parentNode;
    temp.removeChild(parentObj);
    //初始化canva畫布
    creatoverbord();
    creatcanva();
    //設定文字框
    setpointlist();
    setRandomPosOnClass2_0();
}
function findleftpoint2_1(point)//尋找連接點
{   
    let MinPoint=new Array();//儲存要連接的點
    let linelist=new Array();
    //初始化陣列
    for(let i in Pointlist)
        linelist[i]={point1:-1,point2:-1};//第i個點 連接到哪兩個點

    let i=point;

    //儲存點i的x y
    let treeX=Pointlist[i].pointX;
    let treeY=Pointlist[i].pointY;

    MinPoint[0]={pointX:0,pointY:0,PointDistance:1000};//此點的x y 跟點i的距離
    let temp;//儲存連接哪個點
    
    if(Pointlist[i].line===2)//假如此節點連線數超過2則不執行
    {
        return;
    }    
    for(let j=0;j<Pointlist.length;j++)
    {
        if(i==j)continue;

        if(Pointlist[j].line<2){//假如連線數大於2則不選此點

            let x=Pointlist[j].pointX;
            let y=Pointlist[j].pointY;
          //let distance=Math.sqrt(Math.pow(treeX-x,2)+Math.pow(treeY-y,2));
            let  distance=Math.sqrt(Math.pow(treeX-x,2));
            if(MinPoint[0].PointDistance>distance&&x<treeX)
            {
                if(HaveSameLine(linelist,i,j))continue;//判斷是否有重複連線
                temp=j;//紀錄連接到哪個點
                MinPoint.shift();
                MinPoint.push({pointX:x,pointY:y,PointDistance:distance});
            }
        }
    }
        
    if(MinPoint[0].pointX==0&&MinPoint[0].pointY==0)
    {
        return;
    }
    connectDots(treeX,treeY,MinPoint[0].pointX,MinPoint[0].pointY);//畫線連接兩個點
    Updateslinelist(linelist,i,temp);//更新linelist(儲存i點連接到哪個點)
    Pointlist[i].line+=1;//i點的連線數+1
    Pointlist[temp].line+=1;//i點連接到的點連線數+1
    findleftpoint2_1(temp);
}
function findrightpoint2_1(point)//尋找連接點
{   
    let MinPoint=new Array();//儲存要連接的點
    let linelist=new Array();
    //初始化陣列
    for(let i in Pointlist)
        linelist[i]={point1:-1,point2:-1};//第i個點 連接到哪兩個點

    let i=point;
    //儲存點i的x y
    let treeX=Pointlist[i].pointX;
    let treeY=Pointlist[i].pointY;

    MinPoint[0]={pointX:0,pointY:0,PointDistance:1000};//此點的x y 跟點i的距離
    let temp;//儲存連接哪個點
    
    if(Pointlist[i].line===2)//假如此節點連線數超過2則不執行
    {
        return;
    }    
    for(let j=0;j<Pointlist.length;j++)
    {
        if(i==j)continue;

        if(Pointlist[j].line<2){//假如連線數大於2則不選此點

            let x=Pointlist[j].pointX;
            let y=Pointlist[j].pointY;
          //let distance=Math.sqrt(Math.pow(treeX-x,2)+Math.pow(treeY-y,2));
            let  distance=Math.sqrt(Math.pow(x-treeX,2));
            if(MinPoint[0].PointDistance>distance&&x>treeX)
            {
                if(HaveSameLine(linelist,i,j))continue;//判斷是否有重複連線
                temp=j;//紀錄連接到哪個點
                MinPoint.shift();
                MinPoint.push({pointX:x,pointY:y,PointDistance:distance});
            }
        }
    }
        
    if(MinPoint[0].pointX==0&&MinPoint[0].pointY==0)
    {
        return;
    }
    connectDots(treeX,treeY,MinPoint[0].pointX,MinPoint[0].pointY);//畫線連接兩個點
    Updateslinelist(linelist,i,temp);//更新linelist(儲存i點連接到哪個點)
    Pointlist[i].line+=1;//i點的連線數+1
    Pointlist[temp].line+=1;//i點連接到的點連線數+1
    findrightpoint2_1(temp);
   // for(let i in Pointlist)
        //console.log("第i點 :",i,"連線數",Pointlist[i].line);
}
function creatbord()
{
    let container=document.createElement('div');	
    container.setAttribute('class','img-container');
    document.querySelector('body').appendChild(container);
}
function findData()
{
    let sw=0;
    console.log(mainlist.length);
    for(let  i=0;i<mainlist.length;i++)
        for(let j=0;j<mainlist[i].length;j++)
            if(mainlist[i][j].includes(inputname))
            {
                console.log(mainlist[i][j]);
                sw=1;
                Data=nodelist[i];
                column=j+1;
            }
    if(sw===1)
        return true;
    else{
        return false;
    }
}
function creatcolumn(num)
{
    let columnbox=document.createElement('div');
    columnbox.textContent="第"+column+"行";
    columnbox.setAttribute('class','columnbox');
    document.querySelector('#tree'+num).appendChild(columnbox);	
}
function connectDots(x1,y1,x2,y2)//創建連線
 {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 3;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    let randnum=Math.random()*(50+50)-50;
    ctx.bezierCurveTo(x1 + (x2 - x1)+randnum / 2, y1, x1 + (x2 - x1) / 2, y2, x2, y2);
    ctx.stroke();
}
function creatoverbord()
{
    let over=document.createElement('div');
    over.setAttribute('class','overbord');
    document.querySelector('.img-container').appendChild(over);
    let bord=document.querySelector('.overbord');
    bord.style.position = 'fixed';
    bord.style.width = '80%'; // set the width to 400 pixels
    bord.style.height = '60%'; // set the height to 300 pixels
    bord.style.transform = 'translate(-50%, -50%)';
}
function findtemppoint(treeX,treeY)
{
    //設定半徑
    let treeRadius=60;
    //設定檢測範圍    
    for(let i=0;i<Pointlist.length;i++){

  		let x=Pointlist[i].pointX;
        let y=Pointlist[i].pointY;
        console.log()
        //比較兩點的距離判斷是否重疊		
        let PointDistance=Math.sqrt(Math.pow(treeX-x,2),Math.pow(treeY,2));
        let xdistance=Math.sqrt(Math.pow(treeX-x,2));						
        let ydistance=Math.sqrt(Math.pow(treeY-y,2));
        //if(x===treeX||y===treeY)
           // return false;
        if(ydistance<treeRadius){
            //有重疊到則設定為不能選此位置		
            return false;
        }													
    }
     return true;
    
}

