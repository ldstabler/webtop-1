function disabledEventPropagation(event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
}

var windivContainer;
var windiv_initX,
    windiv_initY;
var windiv_initW,
    windiv_initH;
var windiv_pInitX,
    windiv_pInitY;
var windiv_flag;
var windiv_target;
//move, resize-e, resize-s, resize-se;
var maxZ = 0;
var windiv_serial = 1;

document.onmousemove = function(event) {
	event = event || window.event;
	l = windiv_initX;
	t = windiv_initY;
	width = windiv_initW;
	height = windiv_initH;
	pointX = event.clientX;
	pointY = event.clientY;
	switch(windiv_flag) {
	case "move":
		l = l + pointX - windiv_pInitX;
		t = t + pointY - windiv_pInitY;
		break;
	case "resize-e":
		width = width + pointX - windiv_pInitX;
		break;
	case "resize-s":
		height = height + pointY - windiv_pInitY;
		break;
	case "resize-se":
		width = width + pointX - windiv_pInitX;
		height = height + pointY - windiv_pInitY;
		break;
	default:
		return;
	}

	windiv_target.style.left = l + "px";
	windiv_target.style.top = t + "px";
	windiv_resize(width, height);
};

document.onmouseup = function(event) {
	if (windiv_flag == "move" || windiv_flag == "resize-e" || windiv_flag == "resize-s" || windiv_flag == "resize-se") {
		windiv_flag = "";
		document.body.style.cursor = "default";
	}
};

function windiv_mousedown(event) {
	event = event || window.event;
	obj = event.currentTarget;
	switch(obj.className) {
	case "windiv_titlebar":
		windiv_flag = "move";
		document.body.style.cursor = "move";
		break;
	case "windiv_right":
		windiv_flag = "resize-e";
		document.body.style.cursor = "e-resize";
		break;
	case "windiv_bottom":
		windiv_flag = "resize-s";
		document.body.style.cursor = "s-resize";
		break;
	case "windiv_corner":
		windiv_flag = "resize-se";
		document.body.style.cursor = "se-resize";
		break;
	default:
		return;
	}
	windiv = obj.parentElement;
	windiv_target = windiv;
	windiv_initX = parseInt(windiv.offsetLeft);
	windiv_initY = parseInt(windiv.offsetTop);
	windiv_initW = parseInt(windiv.offsetWidth) - 2;
	windiv_initH = parseInt(windiv.offsetHeight) - 2;
	windiv_pInitX = event.clientX;
	windiv_pInitY = event.clientY;
	if (windiv_flag != "move") {
		for (var i = 0; i < windiv.childNodes.length; i++) {
			if (windiv.childNodes[i].className == "windiv_content") {
				content.style.overflow = "auto";
			}
		}
	}
}

function windiv_resize(width, height) {
	for (var i = 0; i < windiv_target.childNodes.length; i++) {
		switch(windiv_target.childNodes[i].className) {
		case "windiv_right":
			rightbar = windiv_target.childNodes[i];
			break;
		case "windiv_bottom":
			bottombar = windiv_target.childNodes[i];
			break;
		case "windiv_corner":
			cornerblock = windiv_target.childNodes[i];
			break;
		case "windiv_titlebar":
			titlebar = windiv_target.childNodes[i];
			break;
		case "windiv_content":
			content = windiv_target.childNodes[i];
			break;
		default:
		}
	}
	windiv_target.style.width = width + "px";
	windiv_target.style.height = height + "px";
	rightbar.style.left = (width - 4) + "px";
	rightbar.style.height = (height - 4) + "px";
	bottombar.style.top = (height - 4) + "px";
	bottombar.style.width = (width - 4) + "px";
	cornerblock.style.left = (width - 4) + "px";
	cornerblock.style.top = (height - 4) + "px";
	titlebar.style.width = (width - 4) + "px";
	content.style.width = (width - 4) + "px";
	content.style.height = (height - 24) + "px";

}

function windiv_emerge(event) {
	windiv = event.currentTarget;
	windiv.style.zIndex = ++maxZ;
}

function windiv_res(event) {
	icon = event.target;
	panel = icon.parentElement;
	titlebar = panel.parentElement;
	windiv = titlebar.parentElement;
	windiv_target = windiv;
	for (var i = 0; i < windiv.childNodes.length; i++) {
		if (windiv.childNodes[i].className == "windiv_content") {
			content = windiv.childNodes[i];
			content.style.overflow = "hidden";
			obj = content.childNodes[0];
			w = parseInt(obj.offsetWidth) + 4;
			h = parseInt(obj.offsetHeight) + 24;
			windiv_resize(w, h);
			break;
		}
	}
	disabledEventPropagation(event);
}

function windiv_min(event) {
	icon = event.target;
	panel = icon.parentElement;
	titlebar = panel.parentElement;
	windiv = titlebar.parentElement;
	windiv.style.display = "none";
	windiv.style.visibility = "hidden";

	mins = document.getElementById("windiv_mins");
	btn = document.createElement("div");
	btn.setAttribute("class", "windiv_mins_btn");
	btn.onclick = function(event) {
		windiv_minbtn_click(event);
	}
	mins.appendChild(btn);
	btn.appendChild(windiv);
	title = document.createElement("div");
	title.setAttribute("class", "windiv_mins_title");
	title.innerHTML = "Caption here";
	btn.appendChild(title);
	icon = document.createElement("div");
	icon.setAttribute("class", "windiv_icon windiv_max");
	icon.title = windiv.id;
	btn.appendChild(icon);

	disabledEventPropagation(event);
}

function windiv_minbtn_click(event) {
	btn = event.currentTarget;
	for (var i = 0; i < btn.childNodes.length; i++) {
		if (btn.childNodes[i].className == "windiv") {
			windiv = btn.childNodes[i];
			windivContainer = document.getElementById("windiv_container");
			windivContainer.appendChild(windiv);
			btn.remove();
			windiv.style.display = "block";
			windiv.style.visibility = "visible";

			break;
		}
	}
	disabledEventPropagation(event);

}

function windiv_close(event) {
	icon = event.target;
	panel = icon.parentElement;
	titlebar = panel.parentElement;
	windiv = titlebar.parentElement;
	windiv.remove();
}

function windiv_new(title, html) {
	index = windiv_serial++;

	windiv = document.createElement("div");
	windiv.setAttribute("id", "windiv_" + index);
	windiv.setAttribute("class", "windiv");
	windiv.style.zIndex = ++maxZ;
	windiv.onclick = function(event) {
		windiv_emerge(event);
	}
	right = document.createElement("div");
	right.setAttribute("class", "windiv_right");
	right.onmousedown = function(event) {
		windiv_mousedown(event);
	}
	windiv.appendChild(right);

	bottom = document.createElement("div");
	bottom.setAttribute("class", "windiv_bottom");
	bottom.onmousedown = function(event) {
		windiv_mousedown(event);
	}
	windiv.appendChild(bottom);

	corner = document.createElement("div");
	corner.setAttribute("class", "windiv_corner");
	corner.onmousedown = function(event) {
		windiv_mousedown(event);
	}
	windiv.appendChild(corner);

	titlebar = document.createElement("div");
	titlebar.setAttribute("class", "windiv_titlebar");
	titlebar.onmousedown = function(event) {
		windiv_mousedown(event);
	}
	windiv.appendChild(titlebar);

	caption = document.createElement("div");
	caption.setAttribute("class", "windiv_caption");
	caption.innerHTML = title;
	titlebar.appendChild(caption);

	icon = document.createElement("div");
	icon.setAttribute("class", "windiv_icon windiv_shape");
	caption.appendChild(icon);

	panel = document.createElement("div");
	panel.setAttribute("class", "windiv_panel");
	panel.onmousedown = function(event) {
		disabledEventPropagation(event);
	};
	titlebar.appendChild(panel);

	icon = document.createElement("div");
	icon.setAttribute("class", "windiv_icon windiv_close");
	icon.onclick = function(event) {
		windiv_close(event);
	};
	panel.appendChild(icon);

	icon = document.createElement("div");
	icon.setAttribute("class", "windiv_icon windiv_res");
	icon.onclick = function(event) {
		windiv_res(event);
	};
	panel.appendChild(icon);

	icon = document.createElement("div");
	icon.setAttribute("class", "windiv_icon windiv_min");
	icon.onclick = function(event) {
		windiv_min(event);
	};
	panel.appendChild(icon);

	content = document.createElement("div");
	content.setAttribute("class", "windiv_content");
	content.innerHTML = html;
	windiv.appendChild(content);

	windivContainer = document.getElementById("windiv_container");
	windivContainer.appendChild(windiv);

}

function test() {
	str = '<img src="https://www.w3schools.com/html/pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;" onclick="sayhello();">';
	windiv_new("hello world", str);
	//loadScript("helloworld.js", sayhello);
}

function loadScript(url, callback)
{
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
		if(scripts[i].src.indexOf(url) != -1) {
			alert("script already loaded!");
			callback();
			return;
		}
	}	
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);   
}
