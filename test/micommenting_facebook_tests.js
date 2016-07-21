// $Header: svn+ssh://srcctl.devel.nandomedia.com/nm/devel/subversion/support/js-libs/tags/js-libs_1.3/MI_Commenting_Facebook/test/micommenting_facebook_tests.js 38 2013-11-21 19:29:34Z jwhetzel $
QUnit.test("test_createAsyncCall", function( assert ) {
	mi.commenting.setConf("fbapp_id", "436249433149897");
	var  startQty = document.getElementsByTagName("script").length;
	mi.commenting._createFBRoot();
	mi.commenting._createAsyncCall();
	var endQty = document.getElementsByTagName("script").length;
	var diffQty = endQty - startQty;
	var asyncjs = document.getElementById("facebook-jssdk");
	
	assert.ok(diffQty, "New script tag is present.");
	assert.ok( asyncjs, "script tag retrieved for further tests" );
	assert.equal( asyncjs.id, "facebook-jssdk", "script id is equal to 'facebook-jssdk'" );
	assert.equal( asyncjs.src.match(/(http:\/\/connect\.facebook\.net\/en_US\/all\.js#xfbml=1\&appId=)(\d*)/)[1], "http://connect.facebook.net/en_US/all.js#xfbml=1&appId=", "script src going to connect.facebook.net/en_US/all.js#xfbml=1&appID=" );
	assert.ok( mi.commenting.getConf("fbapp_id"), "fbapp_id is set in config" );
	
	//Cleanup
	asyncjs.parentNode.removeChild( asyncjs );
	setTimeout(function () {
		var fb_root = document.getElementById("fb-root" );
		fb_root.parentNode.removeChild( fb_root );
	}, 2000);
});

QUnit.test("test_createFBRoot", function( assert ) {
	mi.commenting._createFBRoot();
	var fb_root = document.getElementById("fb-root" );
	assert.ok( fb_root, "div id fb-root exists");
	assert.equal( QUnit.FBfirstChildElem( document.body ).id, "fb-root", "div id fb-root is first child element");
	
	//Cleanup
	fb_root.parentNode.removeChild( fb_root );
});

QUnit.asyncTest("test FB object has loaded.", 1, function( assert ){
	setTimeout(function(){
		assert.ok(window.FB, "FB has loaded/");
		start();
		delete(FB);
	}, 2000);
	
});

QUnit.test("test_createFBTarget with configuration", function( assert ) {
	mi.commenting.setConf("fb_comment_div", {"data-width" : "150",
											"data-colorscheme": "dark",
											"data-num-posts" : "12"});
	QUnit.FBtargetTestModule( assert );
});

QUnit.test("test_createFBTarget with defaults", function( assert ) {
	mi.commenting.setConf("fb_comment_div", undefined);
	QUnit.FBtargetTestModule( assert );
});

QUnit.test("test_displayCommentCountFacebook with configuration", function ( assert ) {
	mi.commenting.setConf("cc_iframe", {width: "140",
															height: "20"});
	QUnit.FBccTestModule( assert );
});

QUnit.test("test_displayCommentCountFacebook with defaults", function ( assert ) {
	mi.commenting.setConf("cc_iframe", undefined);
	QUnit.FBccTestModule( assert );
});

QUnit.test("test_displayCommentingFacebook", function( assert ) {
	assert.ok( mi.commenting._displayCommentingFacebook(), "_displayCommentingFacebook returned true");
	
	mi.commenting.setConf("fbapp_id", null);
	assert.ok( !mi.commenting._displayCommentingFacebook(), "_displayCommentingFacebook returns false due fbapp_id not configured.");
	assert.equal( mi.commenting.getConf("enabled"), 0, "'enabled' conf is set to 0");
});

QUnit.test("test_displayCommentCount is equal to _displayCommentCountFacebook", function ( assert ) {
	assert.deepEqual(mi.commenting._displayCommentCountFacebook, mi.commenting._displayCommentCount, "_displayCommentCount & _displayCommentCountFacebook are equivalent");
});

QUnit.test("test_renderCommenting is equal to _displayCommentingFacebook", function ( assert ) {
	assert.deepEqual(mi.commenting._displayCommentingFacebook, mi.commenting._renderCommenting, "_displayCommentingFacebook & _renderCommenting are equivalent");
});

/*********************************************************************
 * Helper Functions 
 *********************************************************************/
QUnit.FBtargetTestModule = function ( assert ) {
	mi.commenting._createFBTarget();
	var comment_div_conf = mi.commenting.getConf("fb_comment_div");
	var href = "http://" + window.location.host + window.location.pathname;
	/**
	 * @type object
	 * @memberOf QUnit.FBtargetTestModule
	 */
	var fb_target = jQuery(".fb-comments")[0];
	
	assert.ok( fb_target, "fb_target element exists." );
	//make testing easier by simplifying accessing of attribute data
	var target_attrs = {};
	if ( fb_target != null ) {
		for (var x=0; x < fb_target.attributes.length; x++) {
			target_attrs[ fb_target.attributes[x]["nodeName"]] = fb_target.attributes[x]["nodeValue"];
		};
		assert.equal( target_attrs["class"].match(/fb-comments/), "fb-comments", "fb target div exists with id of 'fb-comments'." );
		assert.equal( target_attrs["data-href"], href , "fb target div data-href attribute is the current window url." );
		if ( comment_div_conf && comment_div_conf["data-width"] ) {
			assert.ok( target_attrs["data-width"],"target_attrs['data-width'] is not undefined, thus, fb target div has a popluated data-width attribute." );
		}
		else {
			assert.equal( target_attrs["data-width"], "620", "fb target div data-width attribute defaults to '620'." );
		}
		if ( comment_div_conf && comment_div_conf["data-num-posts"] ) {
			assert.ok( target_attrs["data-num-posts"], "target_attrs['data-num-posts'] is not undefined, thus, fb target div has a populated data-num-posts attribute." );
		}
		else {
			assert.equal( target_attrs["data-num-posts"], "10", "fb target div data-num-posts attribute defaults to '10'." );
		}
		if ( comment_div_conf && comment_div_conf["data-colorscheme"] ) {
			assert.equal( target_attrs["data-colorscheme"], "dark", "fb target div data-colorscheme attribute is set to 'dark'.");
		}
		else {
			assert.ok( !target_attrs["data-colorscheme"], "fb target div data-colorscheme attribute is not present. default condition.")
		}
		if ( mi.commenting.getConf("target") !="commentingStage" ) {
			assert.equal( fb_target.parentNode.id, mi.commenting.getConf("target") , "fb target div parentNode is matches configured value." );
		}
		else {
			assert.equal( fb_target.parentNode.id, "commentingStage", "fb target div parentNode is 'commentingStage'." );
		}
	};
};

QUnit.FBccTestModule = function ( assert ) {
	mi.commenting._createFBTarget();
	mi.commenting._displayCommentCountFacebook();
	var cc_iframe_conf = mi.commenting.getConf("cc_iframe");
	var href = "http://" + window.location.host + window.location.pathname;
	
	var fb_comments = jQuery(".fb-comments")[0];
	var cc_iframe = ( fb_comments && jQuery(fb_comments).prev()[0]) ? jQuery(fb_comments).prev()[0]: null;
	assert.ok( cc_iframe, "fb_comments div has a previous sibling." );
	assert.equal( cc_iframe.tagName, "IFRAME", "fb_comments div previous sibling is an iframe." );
	assert.equal( cc_iframe.src.match(/http:\/\/www\.facebook\.com\/plugins\/comments\.php\?href=.*\&permalink=1/), "http://www.facebook.com/plugins/comments.php?href=" + href +"&permalink=1", "cc_iframe contains a workable src.");
	assert.equal( cc_iframe.scrolling, "no", "cc_iframe scrolling is set to 'no'.");
	assert.equal( cc_iframe.getAttribute("frameBorder"), "0", "cc_iframe frameborder is set to 0.");
	assert.equal( cc_iframe.style.overflow, "hidden", "cc_iframe style overflow is set to 'hidden'.");
	if ( cc_iframe_conf && cc_iframe_conf.width ) {
		assert.equal( cc_iframe.width, "140", "cc_iframe_conf.width is defined in config and matches the iframe width.");
	}
	else {
		assert.equal( cc_iframe.width, "130","cc_iframe_width is not undefined thus is populated with default.");
	}
	if ( cc_iframe_conf && cc_iframe_conf.height ) {
		assert.equal( cc_iframe.height, "20", "cc_iframe_conf.height is defined in config and matches the iframe height.");
	}
	else {
		assert.equal( cc_iframe.height, "16", "cc_iframe_height is not undefined thus is populated with default.");
	}
};

QUnit.FBgetMetaProperty = function () {
	var meta_set = document.getElementsByTagName("meta");
	var fb_meta;
	for ( var x=0; x < meta_set.length; x++ ) {
		fb_meta = meta_set[x];
		if ( fb_meta.getAttribute("property") == "fb:app_id") {
			return fb_meta;
		};
	};
}

QUnit.FBfirstChildElem = function ( parent ) {
	var el = parent.firstChild;
	while( el && el.nodeType !== 1 )
		el = el.nextSibling;
	return el;
};