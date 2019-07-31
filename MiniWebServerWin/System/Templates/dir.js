
// (C) 2009  Joerg Rosenthal, www.aidex.de/webserver


var ThumbnailSize=100;

var RowColor1='#E8F4E8';
var RowColor2='#FFFFFF';


// Thumbnail functions

function ShowTn(ImgObj) {
	var s=ImgObj.getAttribute('url',0);
	if (s!='') ImgObj.src=s+'?tn='+ThumbnailSize;
}

var AllTnImages;
var NextTnIndex=0;
var ThumbnailInterval;

function ShowNextThumbnail() {
	if (NextTnIndex<AllTnImages.length) {ShowTn(AllTnImages[NextTnIndex]); NextTnIndex++;}
	else window.clearInterval(ThumbnailInterval);
}

function ShowAllThumbnails() {
	AllTnImages=document.getElementsByName('TnImg');
	NextTnIndex=0;
	ThumbnailInterval=window.setInterval('ShowNextThumbnail()',200);
}

// FileTable functions

function setBg(theRow,theColor) {
	if (document.getElementsByTagName) var theCells=theRow.getElementsByTagName('td');
	else if (theRow.cells) var theCells=theRow.cells;
	     else return false;
	var rowCellsCnt=theCells.length;
	if (theRow.style) for (var c=0; c<rowCellsCnt; c++) theCells[c].style.backgroundColor=theColor;
}

function InitFileTable() {
	var TRs=document.getElementById('FileTable').getElementsByTagName('tr');
	var newColor;
	var thisTR;
	for (var i=0; i<TRs.length; i++) { 
		thisTR=TRs[i];
		if (i%2==0) newColor=RowColor1; else newColor=RowColor2;
		setBg(thisTR,newColor);
		thisTR.setAttribute('onmouseover',"setBg(this,'#FFFF80')");
		thisTR.setAttribute('onmouseout', "setBg(this,'"+newColor+"')");
		}
}

function Init() {
	InitFileTable();
}
