function parseContent(xml) {
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(xml, "text/xml");

	alert(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue);
}

function testXML() {
	xml = "<bookstore><book>" + "<title>Everyday Italian</title>" + "<author>Giada De Laurentiis</author>" + "<year>2005</year>" + "</book></bookstore>";
	//xml = "<scripts></scripts>"
	parseContent(xml);
	installScript("js/dummy.js");
}

function installScript(src){
	for (var i = 0; i < document.scripts.length; i++) {
		if(src==document.scripts[i].getAttribute("src")) {
			alert(src + " script already installed.");
			return;
		}
	}
	script = document.createElement("script");
	script.setAttribute("src", src);
	document.head.appendChild(script);	
	alert(src + " script is installed successfully.");
}
