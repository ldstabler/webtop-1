function showTree() {
	str = "<div  id='tree'></div>";
	windiv_new("Tree demo", str);
	jQuery(function($) {
		$("#tree").tree({
			nodeEdit : function(event, wrapper) {
				var node = wrapper.obj;
				var newname = prompt("Please enter a new name", node.name);
				console.log(newname);
				if (newname != null) {
					node.name = newname;
					return true;
				}
				return false;
			},
			tree_height : 300,
			tree_width : 150
		});

	});
};
