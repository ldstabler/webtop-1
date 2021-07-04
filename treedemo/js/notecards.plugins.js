/*
 *  jQuery Notecards Plugins and Widgets
 *
 *  Copyright (c) 2016 Kevin Duan
 *  http://www.myNotecards.com/js/plugin
 *
 *  Licensed under MIT
 */

( function($) {

		/*
		 * JQuery Icon Button Plugin
		 */

		$.fn.nc_iconButton = function(iconName, desc, clickHandler) {
			this.filter("div").each(function() {
				this.title = desc;
				$(this).addClass("nc_icon " + iconName);
				$(this).hover(function() {
					$(this).addClass("nc_icon_hover");
				}, function() {
					$(this).removeClass("nc_icon_hover");
				});
				if (clickHandler != null) {
					$(this).click(clickHandler);
				}
			});
			return this;
		};

		/*
		 * JQuery UI Tree Widget   v.1.2.1
		 */

		function defaultData() {
			/*folder1*/
			dummy11 = '{"key":"dummy11","name":"dummy11", "subnodes":[]}';
			/*folder11*/
			dummy111 = '{"key":"dummy111","name":"dummy111", "subnodes":[]}';
			dummy112 = '{"key":"dummy112","name":"dummy112", "subnodes":[]}';
			folder11 = '{"key":"folder11","name":"folder11","subnodes":[' + dummy111 + ',' + dummy112 + ']}';
			dummy12 = '{"key":"dummy12","name":"dummy12", "subnodes":[]}';
			folder1 = '{"key":"folder1","name":"folder1","subnodes":[' + dummy11 + ',' + folder11 + ',' + dummy12 + ']}';
			dummy1 = '{"key":"dummy1","name":"dummy1", "subnodes":[]}';
			root = '{"key":"root","name":"root","subnodes":[' + folder1 + ',' + dummy1 + ']}';
			return root;
		};

		function createNodes(obj) {
			var node = new nc_node(obj.key, obj.name);
			var previousnode = null;
			if (obj.subnodes.length) {
				obj.subnodes.forEach(function(item, index, array) {
					var subnode = createNodes(item);
					node.subnodes.push(subnode);
					subnode.parent = node;
					subnode.previous = previousnode;
					previousnode = subnode;
				});
			}
			return node;
		};

		function nc_node(key, name) {
			this.key = key;
			this.name = name;
			this.subnodes = [];
			this.parent = null;
			this.previous = null;
			this.ui_li = null;
			this.ui_span = null;
			this.ui_signblock = null;
			this.ui_ul = null;
		};

		function makeTreeNode(node) {
			var element = $("<li>");
			var span = $("<span>", {
				"class" : "nc_label",
				text : node.name
			}).data("node", node);
			element.append(span);

			var signblock = $("<div>").addClass("signblock hide");
			element.append(signblock);

			var branch = $("<ul>");
			element.append(branch);

			if (node.subnodes.length) {
				node.subnodes.forEach(function(item, index, array) {
					branch.append(makeTreeNode(item));
				});
				signblock.addClass("negative").removeClass("hide");
				branch.addClass("show");
			}
			//node.ui = element;
			node.ui_li = element;
			node.ui_span = span;
			node.ui_signblock = signblock;
			node.ui_ul = branch;
			return element;
		};
		/*
		 * Widget Tree
		 */
		$.widget("notecards.tree", {
			options : {
				data : defaultData(),
				tree_height : 600,
				tree_width : 350,
				nodeSelect : function(event, wrapper) {
					console.log($(wrapper.obj));
					return true;
				},
				nodeNew : function(event, wrapper) {
					var dummyNew = '{"key":"dummyNew","name":"dummyNew", "subnodes":[]}';
					wrapper.result = JSON.parse(dummyNew);
					return true;
				},
				nodeEdit : function(event, wrapper) {
					var node = wrapper.obj;
					node.name = "Ugly edited";
					return true;
				},
				nodeDelete : function(event, wrapper) {
					console.log($(wrapper.obj));
					return true;
				},
				nodeRelease : function(event, wrapper) {
					console.log($(wrapper.obj));
					console.log($(wrapper.target));
					return true;
				},
				nodeReleaseBefore : function(event, wrapper) {
					console.log($(wrapper.obj));
					console.log($(wrapper.target));
					return true;
				}
			},
			_create : function() {
				this.element.append(this._controlPanel());

				this.regular_tree = $("<ul>", {
					"id" : "regular_tree",
					"class" : "nc_tree show"
				});
				var obj = JSON.parse(this.options.data);
				var root = createNodes(obj);
				this.regular_tree.append(makeTreeNode(root));

				var container = $("<div>", {
					"id" : "nc_treecontainer"
				});
				this._on(container, {
					"resized" : function(event) {
						var container = event.target;
						var height = this.options.tree_height;
						var width = this.options.tree_width;
						if ($(container).height() > height) {
							$(container).height(height);
						}
						if ($(container).width() > width) {
							$(container).width(width);
						}
					}
				});
				container.append(this.regular_tree);
				this.element.append(container);

				this._signblockResponsive();
				//initial to enable select operation.
				this.labelSelected = null;
				this._labelResponsive();
				//initial to enable operation involving two-phases selections.
				this.labelOnhold = null;
				this._ctlPanelResponsive();

				$("#nc_treecontainer").trigger("resized");

			},

			_destroy : function() {
				this.regular_tree.remove();
				this.free_tree.remove();
			},

			_controlPanel : function() {
				var ui = $("<div>");
				var ul = $("<ul>", {
					"id" : "ctrlpanel_main",
					"class" : "ctrl_panel"
				});
				var btnCreate = $("<li>").append($("<div>", {
					"id" : "btn_create",
				}));

				var btnUpdate = $("<li>").append($("<div>", {
					"id" : "btn_update"
				}));
				var btnMove = $("<li>").append($("<div>", {
					"id" : "btn_move"
				}));
				var btnDelete = $("<li>").append($("<div>", {
					"id" : "btn_delete"
				}));
				ul.append(btnCreate).append(btnUpdate).append(btnMove).append(btnDelete);
				ui.append(ul);

				ul = $("<ul>", {
					"id" : "ctrlpanel_release",
					"class" : "ctrl_panel"
				}).css("display", "none");
				;
				var btnRelease = $("<li>").append($("<div>", {
					"id" : "btn_release"
				}));
				var btnInsertBf = $("<li>").append($("<div>", {
					"id" : "btn_releasebefore"
				}));
				var btnCancel = $("<li>").append($("<div>", {
					"id" : "btn_cancel"
				}));

				ul.append(btnRelease).append(btnInsertBf).append(btnCancel);
				ui.append(ul);

				return ui;
			},

			_ctlPanelResponsive : function() {
				$("#ctrlpanel_release").css("display", "none");
				$("#btn_create").nc_iconButton("ui-icon-circle-plus", "Create.", null);
				$("#btn_update").nc_iconButton("ui-icon-tag", "Upate.", null);
				$("#btn_move").nc_iconButton("ui-icon-transferthick-e-w", "Move...", null);
				$("#btn_delete").nc_iconButton("ui-icon-trash", "Delete", null);
				$("#btn_release").nc_iconButton("ui-icon-arrowthickstop-1-n", "Release to...", null);
				$("#btn_releasebefore").nc_iconButton("ui-icon-arrowthickstop-1-e", "Release before...", null);
				$("#btn_cancel").nc_iconButton("ui-icon-close", "Cancel", null);

				this._on(this.element, {
					"click .nc_icon" : function(event) {
						var button = event.target;
						var id = $(button).attr("id");
						switch (id) {
						case "btn_create":
							this._newNode();
							break;
						case "btn_update":
							this._editNode();
							break;
						case "btn_move":
							this._moveNode();
							break;
						case "btn_delete":
							this._deleteNode();
							break;
						case "btn_release":
							this._releaseNode();
							break;
						case "btn_releasebefore":
							this._releaseBeforeNode();
							break;
						case "btn_cancel":
							this._moveClean();
							break;
						default:
							alert("other button clicked");
						}
					}
				});

			},

			_signblockResponsive : function() {
				this._on(this.element, {
					"click .signblock" : function(event) {
						var signblock = event.target;
						$(signblock).toggleClass('negative').nextAll('ul:first').toggleClass('show');
					}
				});
				this._on(this.element, {
					"dblclick .signblock" : function(event) {
						var signblock = $(event.target);

						if (signblock.hasClass("negative")) {
							signblock.parent().find(".signblock").each(function() {
								$(this).removeClass("negative").nextAll('ul:first').removeClass("show");
							});
						} else {
							signblock.parent().find(".signblock").each(function() {
								$(this).addClass("negative").nextAll('ul:first').addClass("show");
							});

						}
					}
				});
			},

			_labelResponsive : function() {
				this._on(this.element, {
					"click .nc_label" : function(event) {
						var label = event.target;
						$(label).addClass('selected');
						if (this.labelSelected) {
							$(this.labelSelected).removeClass("selected");
						}
						if (this.labelSelected === label) {
							this.labelSelected = null;
						} else {
							this.labelSelected = label;
						}
						var wrapper = {};
						wrapper.obj = $(label).data("node");
						this._trigger("nodeSelect", null, wrapper);
					}
				});
			},

			_newNode : function() {
				if (this.labelSelected === null)
					return;
				var node = $(this.labelSelected).data("node");
				var wrapper = {};
				wrapper.obj = node;
				var flag = this._trigger("nodeNew", null, wrapper);
				if (flag) {
					var newnode = createNodes(wrapper.result);
					newnode.parent = node;
					var length = node.subnodes.length;
					if (length > 0) {
						newnode.previous = node.subnodes[length - 1];
					}
					node.subnodes.push(newnode);
					var li = makeTreeNode(newnode);
					node.ui_ul.append(li);
					node.ui_signblock.removeClass("hide").addClass("negative");
					node.ui_ul.addClass("show");
					$("#nc_treecontainer").trigger("resized");
				}
			},

			_editNode : function() {
				if (this.labelSelected === null)
					return;
				var node = $(this.labelSelected).data("node");
				var wrapper = {};
				wrapper.obj = node;
				var flag = this._trigger("nodeEdit", null, wrapper);
				if (flag) {
					$(this.labelSelected).text(node.name);
					$("#nc_treecontainer").trigger("resized");
				}
			},

			_moveNode : function() {
				if (this.labelSelected === null)
					return;
				this.labelOnhold = this.labelSelected;
				$(this.labelOnhold).removeClass("selected").addClass("prev_selected");
				$("#ctrlpanel_main").css("display", "none");
				$("#ctrlpanel_release").css("display", "inline");
			},

			_deleteNode : function() {
				if (this.labelSelected != null) {
					var node = $(this.labelSelected).data("node");
					var wrapper = {};
					wrapper.obj = node;
					var flag = this._trigger("nodeDelete", null, wrapper);
					if (flag) {
						var parentnode = node.parent;
						if (parentnode == null) {
							this._moveClean();
							return;
						}
						var pos = parentnode.subnodes.indexOf(node);
						var previousnode = null;
						if (pos > 0)
							previousnode = parentnode.subnodes[pos - 1];
						if (pos < parentnode.subnodes.length - 1)
							parentnode.subnodes[pos + 1].previous = previousnode;
						parentnode.subnodes.splice(pos, 1);
						node.parent = null;
						node.previous = null;
						this.labelSelected = null;
						node.ui_li.remove();
						if (parentnode.subnodes.length == 0) {
							parentnode.ui_signblock.addClass("hide");
							parentnode.ui_ul.removeClass("show");
						}

						$("#nc_treecontainer").trigger("resized");
					}
				}
			},

			_releaseNode : function() {
				if (this.labelSelected != null && this.labelOnhold != this.labelSelected) {
					var node = $(this.labelOnhold).data("node");
					var target = $(this.labelSelected).data("node");

					var parentnode = node.parent;
					if (parentnode == null || parentnode == target) {
						this._moveClean();
						return;
					}

					var tempnode = target;
					while (tempnode.parent != null) {
						if (tempnode.parent == node) {
							this._moveClean();
							return;
						}
						tempnode = tempnode.parent;
					}

					var wrapper = {};
					wrapper.obj = node;
					wrapper.target = target;
					var flag = this._trigger("nodeRelease", null, wrapper);
					if (flag) {

						var pos = parentnode.subnodes.indexOf(node);
						var previousnode = null;
						if (pos > 0)
							previousnode = parentnode.subnodes[pos - 1];
						if (pos < parentnode.subnodes.length - 1)
							parentnode.subnodes[pos + 1].previous = previousnode;
						parentnode.subnodes.splice(pos, 1);
						node.parent = null;
						node.previous = null;
						node.ui_li.detach();
						if (parentnode.subnodes.length == 0) {
							parentnode.ui_signblock.addClass("hide");
							parentnode.ui_ul.removeClass("show");
						}

						node.parent = target;
						if (target.subnodes.length > 0)
							node.previous = target.subnodes[length - 1];
						target.subnodes.push(node);
						target.ui_ul.append(node.ui_li);
						target.ui_signblock.removeClass("hide").addClass("negative");
						target.ui_ul.addClass("show");

						$("#nc_treecontainer").trigger("resized");
					}
				}
				this._moveClean();

			},

			_releaseBeforeNode : function() {
				if (this.labelSelected != null && this.labelOnhold != this.labelSelected) {
					var node = $(this.labelOnhold).data("node");
					var target = $(this.labelSelected).data("node");

					var parentnode = node.parent;
					if (parentnode == null) {
						this._moveClean();
						return;
					}

					var tempnode = target;
					while (tempnode.parent != null) {
						if (tempnode.parent == node) {
							this._moveClean();
							return;
						}
						tempnode = tempnode.parent;
					}

					var wrapper = {};
					wrapper.obj = node;
					wrapper.target = target;
					var flag = this._trigger("nodeReleaseBefore", null, wrapper);
					if (flag) {
						var pos = parentnode.subnodes.indexOf(node);
						var previousnode = null;
						if (pos > 0)
							previousnode = parentnode.subnodes[pos - 1];
						if (pos < parentnode.subnodes.length - 1)
							parentnode.subnodes[pos + 1].previous = previousnode;
						parentnode.subnodes.splice(pos, 1);
						node.parent = null;
						node.previous = null;
						node.ui_li.detach();
						if (parentnode.subnodes.length == 0) {
							parentnode.ui_signblock.addClass("hide");
							parentnode.ui_ul.removeClass("show");
						}

						pos = target.parent.subnodes.indexOf(target);
						node.parent = target.parent;
						node.previous = target.previous;
						target.previous = node;
						target.parent.subnodes.splice(pos, 0, node);
						target.ui_li.before(node.ui_li);

						$("#nc_treecontainer").trigger("resized");
					}
				}
				this._moveClean();

			},

			_moveClean : function() {
				$(this.labelOnhold).removeClass("prev_selected");
				this.labelOnhold = null;
				$("#ctrlpanel_release").css("display", "none");
				$("#ctrlpanel_main").css("display", "inline");
			}
		});

	}(jQuery));
