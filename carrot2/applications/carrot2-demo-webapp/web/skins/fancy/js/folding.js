function show(elementId)
{
  var element = document.getElementById(elementId);
  if (!element)
  {
    return;
  }

  if (element.style.display != "none")
  {
    element.style.display = "none";
  }
  else
  {
    element.style.display = "";
  }
}

function fold(elementId)
{
  show(elementId);
  hl(elementId.substring(3));
};

function hl(elementId)
{
  clearHighlights();
  var textTd = document.getElementById('t' + elementId);
  if (textTd)
  {
    if (textTd.className.indexOf("sic") >= 0)
    {
      textTd.className = 'text hl sic';
    }
    else
    {
      textTd.className = 'text hl';
    }
  }
}

function foldRange(prefix, morePrefix, start, end)
{
  for(var i = start; i <= end; i++)
  {
    show(prefix + i);
  }
  show(prefix + morePrefix + (start-1));
  show(prefix + morePrefix + (end));
};

function clearHighlights()
{
  var nodes = document.getElementsByTagName('td');
  for (var i = 0; i < nodes.length; i++)
  {
    if (nodes[i].className && nodes[i].className.indexOf('text hl') >= 0)
    {
      if (nodes[i].className.indexOf('sic') >= 0) {
        nodes[i].className = 'text sic';
      }
      else {
        nodes[i].className = 'text';
      }
    }
  }
}

function contains(array, value)
{
  for (var i = 0; i < array.length; i++)
  {
    if (array[i]+"" == value+"")
    {
      return true;
    }
  }

  return false;
}

function sel(refids)
{
  var documentElements = parent.documents.document.getElementsByTagName('table');
  for (var i = 0; i < documentElements.length; i++)
  {
    if (documentElements[i].className == 'd')
    {
      if (contains(refids, documentElements[i].id))
      {
        documentElements[i].style.display = "block";
      }
      else
      {
      	if (documentElements[i].style.display != "none") {
        	documentElements[i].style.display = "none";
        }
      }
    }
  }
  
  parent.documents.scrollBy(0,-10000);
}
function hlw(clusterIds)
{
  var docs = parent.documents.document;
  if (!docs.styleSheets) {
    hlwSlow(clusterIds);
    return;
  }

  for (var s = 0; s < docs.styleSheets.length; s++)
  {
    var sheet = docs.styleSheets[s];
    if (sheet.href.indexOf(".css") >= 0)
    {
      continue;
    }

    var rules;
    if (sheet.cssRules) {
      rules = sheet.cssRules;
    }
    else if (sheet.rules) {
      rules = sheet.rules;
    }
    else { 
      hlwSlow(clusterIds);
      return;
    }

    for (var i = 0; i < rules.length; i++)
    {
      if (contains(clusterIds, rules[i].selectorText.toLowerCase().substring(2))) {
        rules[i].style.fontWeight = 'bold';
      }
      else {
        if (rules[i].style.fontWeight == 'bold') {
        	rules[i].style.fontWeight = 'normal';
        }
      }
    }
  }
}

function hlwSlow(wordids)
{
  var documentElements = parent.documents.document.getElementsByTagName('b');
 
  for (var i = 0; i < documentElements.length; i++)
  {
    if (documentElements[i].className) {
      for (var j = 0; j < wordids.length; j++)
      {
        if (documentElements[i].className.indexOf('w' + wordids[j]) >= 0)
        {
          documentElements[i].style.fontWeight = "bold";
        }
        else
        {
	        if (rules[i].style.fontWeight == 'bold') {
	          documentElements[i].style.fontWeight = "normal";
	        }
        }
      }
    }
  }
} 

function showAll()
{
  var documentElements = parent.documents.document.getElementsByTagName('table');
  for (var i = 0; i < documentElements.length; i++)
  {
    if (documentElements[i].className == 'd')
    {
      documentElements[i].style.display = "block";
    }
  }
  parent.documents.scrollBy(0,-10000);
}

function showAllClusters()
{
  var trElements = document.getElementsByTagName('tr');
  for (var i = 0; i < trElements.length; i++)
  {
    if (trElements[i].id && trElements[i].id.lastIndexOf('cld') != 0) {
      if (trElements[i].id.indexOf('more') >= 0)
      {
        trElements[i].style.display = "none";
      }
      else
      {
        trElements[i].style.display = "";
      }
    }
  }
}

function showInClusters(id)
{
  for (var t in clusterDocs) {
    if (contains(clusterDocs[t], id)) {
      var textTd = document.getElementById('t' + t);
      if (textTd)
      {
      	if (textTd.parentNode.style.display == 'none')
      	{
					showAllClusters();
      	}
      
        if (textTd.className.indexOf("hl") >= 0)
        {
          textTd.className = 'text hl sic';
        }
        else
        {
          textTd.className = 'text sic';
        }
      }
    }
  }
}

function clearInClusters()
{
  var nodes = document.getElementsByTagName('td');
  for (var i = 0; i < nodes.length; i++)
  {
    if (nodes[i].className && nodes[i].className.indexOf('sic') >= 0)
    {
      if (nodes[i].className.indexOf('hl') >= 0) {
        nodes[i].className = 'text hl';
      }
      else {
        nodes[i].className = 'text';
      }
    }
  }
}

function hlDoc(id)
{
  parent.clusters.clearInClusters();
  var docNodes = document.getElementsByTagName("table");
  var showInClusters = true;
  for (var i = 0; i < docNodes.length; i++) 
  {
    if (docNodes[i].className && docNodes[i].className == "d")
    {
      if (docNodes[i].id == id)
      {
        if (docNodes[i].rows[0].cells[0].className == "r hl")
        {
          docNodes[i].rows[0].cells[0].className = "r";
          showInClusters = false;
        }
        else
        {
          docNodes[i].rows[0].cells[0].className = "r hl";
        }
      }
      else
      {
        docNodes[i].rows[0].cells[0].className = "r";
      }
    }
  }
  if (showInClusters) {
  	parent.clusters.showInClusters(id);
  }
}