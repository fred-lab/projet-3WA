webpackJsonp([0,2],[
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(73)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = { css: css, media: media, sourceMap: sourceMap }
    if (!newStyles[id]) {
      part.id = parentId + ':0'
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      part.id = parentId + ':' + newStyles[id].parts.length
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')
  var hasSSR = styleElement != null

  // if in production mode and style is already provided by SSR,
  // simply do nothing.
  if (hasSSR && isProduction) {
    return noop
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = styleElement || createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (!hasSSR) {
    update(obj)
  }

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(72)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(39),
  /* template */
  __webpack_require__(65),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/AdminGalleriesIndex.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AdminGalleriesIndex.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d90bff38", Component.options)
  } else {
    hotAPI.reload("data-v-d90bff38", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(67)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(40),
  /* template */
  __webpack_require__(60),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/AdminGallery.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AdminGallery.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-30781ca0", Component.options)
  } else {
    hotAPI.reload("data-v-30781ca0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(69)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(42),
  /* template */
  __webpack_require__(62),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/GalleryForm.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] GalleryForm.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7226a3a9", Component.options)
  } else {
    hotAPI.reload("data-v-7226a3a9", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 19 */,
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes_js__ = __webpack_require__(47);

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */



/**
 * Import routes file
 */


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('admin-nav', __webpack_require__(55));
Vue.component('picture-form', __webpack_require__(58));
Vue.component('gallery-form', __webpack_require__(18));
Vue.component('admin-galleries', __webpack_require__(16));
Vue.component('admin-gallery', __webpack_require__(17));
Vue.component('gallery-preview', __webpack_require__(56));
Vue.component('main-preview', __webpack_require__(57));

Vue.directive('focus', function (el, value) {
    if (value) {
        Vue.nextTick(function (_) {
            el.focus();
        });
    }
});

Vue.directive('area', function (el) {
    Vue.nextTick(function (_) {
        el.style.height = el.scrollHeight + 'px';
    });
});

var app = new Vue({
    el: '#app',
    router: __WEBPACK_IMPORTED_MODULE_1__routes_js__["a" /* default */],
    mounted: function mounted() {
        console.log('App is ready to rock !');
    }
});

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
    data: function data() {
        return {
            galleries: [],
            categories: [{ id: 0, value: 'Portrait' }, { id: 1, value: 'Voyage' }, { id: 2, value: 'Mariage' }, { id: 3, value: 'Street' }]
        };
    },

    methods: {
        category: function category(category_id) {
            for (var key in this.categories) {
                if (this.categories[key].id == category_id) {
                    return this.categories[key].value;
                }
            }
        }
    },
    created: function created() {
        var _this = this;

        axios.get('/studio/gallery').then(function (_ref) {
            var data = _ref.data;
            return _this.galleries = data;
        });
    }
};

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
    data: function data() {
        return {
            gallery: {},
            target: null,
            oldValue: null,
            checked: false,
            upload: false,
            focus: null
        };
    },
    created: function created() {
        var _this = this;

        axios.get('/studio/gallery/' + this.$route.params.id).then(function (_ref) {
            var data = _ref.data;

            _this.gallery = data;
            _this.setFocus(data);
        });
    },
    mounted: function mounted() {
        console.log('composant monté');
    },

    methods: {
        onEdit: function onEdit(e) {
            this.target = e.target.dataset.key;

            for (var key in this.gallery) {
                if (key == this.target) {
                    this.oldValue = this.gallery[key];
                }
            }
        },
        pictureEdit: function pictureEdit(picture, e) {
            this.target = e.target.dataset.key;

            if (e.target.dataset.field == 'description') {
                this.oldValue = picture.description;
            } else if (e.target.dataset.field == 'visible') {
                this.oldValue = picture.visible;
            }
        },
        form: function form() {
            var formData = new FormData(this.$refs.form);
            formData.append('_method', 'PUT');
            formData.append('category', this.gallery.category_id);
            formData.append('has_focus', this.focus);
            formData.delete('focus');

            return formData;
        },
        onSave: function onSave() {
            var formData = this.form();

            for (var key in this.gallery) {
                if (key == this.target && this.gallery[key] != this.oldValue) {
                    axios.post('/studio/gallery/' + this.gallery.id, formData);
                }
            }

            if (this.target == 'focus' && this.focus != this.oldValue) {
                axios.post('/studio/gallery/' + this.gallery.id, formData);

                for (var _key in this.gallery.pictures) {
                    if (this.gallery.pictures[_key].id != this.focus && this.gallery.pictures[_key].has_focus == 1) {
                        this.gallery.pictures[_key].has_focus = 0;
                    } else if (this.gallery.pictures[_key].id == this.focus && this.gallery.pictures[_key].has_focus == 0) {
                        this.gallery.pictures[_key].has_focus = 1;
                    }
                }
            }

            this.target = null;
            this.oldValue = null;
        },
        pictureUpdate: function pictureUpdate(picture) {
            if (this.target == picture.id && picture.description != this.oldValue) {
                axios.patch('/studio/picture/' + picture.id, {
                    description: picture.description,
                    visible: picture.visible
                });
            }

            this.target = null;
            this.oldValue = null;
        },
        visibiltyUpdate: function visibiltyUpdate(picture) {
            axios.patch('/studio/picture/' + picture.id, {
                description: picture.description,
                visible: picture.visible
            });
        },
        onUpload: function onUpload() {
            var _this2 = this;

            var formData = this.form();

            if (formData.getAll('pictures[]')[0].size > 0) {
                axios.post('/studio/gallery/' + this.gallery.id, formData).then(function (_ref2) {
                    var data = _ref2.data;
                    return _this2.gallery = data;
                });
            }
            this.upload = false;
        },
        onAbort: function onAbort() {
            if (isNaN(this.target)) {
                for (var key in this.gallery) {
                    if (key == this.target) {
                        this.gallery[key] = this.oldValue;
                    }
                }
            } else {
                for (var _key2 in this.gallery.pictures) {
                    if (this.gallery.pictures[_key2].id == this.target) {
                        this.gallery.pictures[_key2].description = this.oldValue;
                    }
                }
            }

            this.target = null;
            this.oldValue = null;
        },
        destroyGallery: function destroyGallery() {
            var prompt = confirm("Voulez-vous supprimer cette galerie ?\nCette action est irreversible !");

            if (prompt) {
                axios.delete('/studio/gallery/' + this.gallery.id).then(this.$router.push({ name: 'gallery.index' }));
            }
        },
        destroyPicture: function destroyPicture(picture) {

            if (picture.has_focus == 1 && this.gallery.pictures.length > 1) {
                alert("Vous ne pouvez pas supprimer l'image de preview de la galerie");
                console.log('image preview');
            } else if (this.gallery.pictures.length == 1) {
                alert("La galerie doit avoir au moins une photo, vous ne pouvez pas supprimer cette dernière photo.");
                this.destroyGallery();

                console.log('dernière image');
            } else {
                var prompt = confirm("Voulez-vous supprimer cette photo ?\nCette action est irreversible !");

                console.log(this.gallery.pictures.indexOf(picture));
                console.log('suppression classique image');
            }

            if (prompt) {
                axios.delete('/studio/picture/' + picture.id).then(console.log('photo supprimée'));
            }
            this.gallery.pictures.splice(this.gallery.pictures.indexOf(picture), 1);
        },
        isFocus: function isFocus(picture, event) {
            this.target = event.target.dataset.key;

            this.oldValue = this.focus;
            this.focus = picture.id;
        },
        setFocus: function setFocus(data) {
            for (var key in data.pictures) {
                if (data.pictures[key].has_focus == 1) {
                    this.focus = data.pictures[key].id;
                }
            }
        },
        submit: function submit() {
            this.upload = true;
        },
        console: function (_console) {
            function console() {
                return _console.apply(this, arguments);
            }

            console.toString = function () {
                return _console.toString();
            };

            return console;
        }(function () {
            return console.log('toto');
        })
    }
};

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {};

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
    data: function data() {
        return {
            categories: [{ name: 'Portrait', value: 1 }, { name: 'Voyage', value: 2 }, { name: 'Mariage', value: 3 }, { name: 'Street', value: 4 }],
            upload: false,
            countFiles: 0,
            date: 'text',
            title: '',
            public: 0
        };
    },

    computed: {
        valid: function valid() {
            return this.upload && this.title;
        }
    },
    methods: {
        onSubmit: function onSubmit() {
            var _this = this;

            /**
             * this.$refs.form correspond au formulaire, sélectionner dans le DOM, passer en argument
             * du constructeur FormData pour récupérer tout les champs du formulaire et les passer dans la requête AJAX
             **/
            var formData = new FormData(this.$refs.form);

            if (formData.get('title') && formData.getAll('pictures[]').length > 0) {
                axios.post('/studio/gallery', formData).then(function (_ref) {
                    var data = _ref.data;
                    return _this.$router.push({
                        name: 'gallery.show',
                        params: { id: data.id }
                    });
                });
            }
        },
        onUpload: function onUpload() {
            this.upload = true;
            var formData = new FormData(this.$refs.form);
            this.countFiles = formData.getAll('pictures[]').length;
        }
    }
};

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
    props: ['path', 'title', 'route', 'galleryTitle'],
    data: function data() {
        return {
            width: 0,
            height: 0,
            ratio: 0
        };
    },
    mounted: function mounted() {
        console.log(this.$refs.picture);
        this.width = this.$refs.picture.naturalWidth;
        this.height = this.$refs.picture.naturalHeight;
        this.ratio = Math.round(this.height / this.width * 10000) / 100;
    }
};

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
    data: function data() {
        return {
            galleries: []
        };
    },
    created: function created() {
        var _this = this;

        axios.get('/preview').then(function (_ref) {
            var data = _ref.data;
            return _this.galleries = data;
        });
    }
};

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = {
    props: ['pictures'],
    data: function data() {
        return {
            pictures: []
        };
    }
};

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(6);

window._ = __webpack_require__(9);

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

window.$ = __webpack_provided_window_dot_jQuery = __webpack_require__(5);

// require('bootstrap-sass');

/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */

window.Vue = __webpack_require__(10);



Vue.use(__WEBPACK_IMPORTED_MODULE_0_vue_router__["default"]);

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(8);

window.axios.defaults.headers.common = {
  'X-CSRF-TOKEN': window.Laravel.csrfToken,
  'X-Requested-With': 'XMLHttpRequest'
};

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo"

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(6);
/**
 * Import Vue-Router
 */


var routes = [
/** Homepage **/
// {
//     path: '/',
//     component: require('./components/MainPreview')
// },
/** Studio **/
{
    path: '/gallery',
    name: 'gallery.index',
    component: __webpack_require__(16)
}, {
    path: '/gallery/create',
    name: 'gallery.create',
    component: __webpack_require__(18)
}, {
    path: '/gallery/:id(\\d+)',
    name: 'gallery.show',
    component: __webpack_require__(17)
}];

/* harmony default export */ __webpack_exports__["a"] = new __WEBPACK_IMPORTED_MODULE_0_vue_router__["default"]({
    routes: routes
});

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.preview {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n.preview .focus {\n    margin: 2em 0;\n}\n.row {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.item {\n  width: 48em;\n  height: 32em;\n  margin: 1em 2em;\n}\n", ""]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n* List of variables\n**/\n/** Colors **/\n/** Fonts **/\n/**\n* List of mixins\n**/\n/** Material Shadow for block, depth between 0 and 5 **/\n/** Effects **/\n/**\n* List of function\n**/\n/** shadow function **/\n.gallery-show {\n  text-align: center;\n  line-height: 2em;\n  color: #000;\n}\n.gallery-show .focus {\n    color: #FFFFFF;\n    background-color: #FF0C64 !important;\n}\n.gallery-show h1, .gallery-show input[name=\"title\"] {\n    font-size: 3em;\n    color: #FF0C64;\n    text-align: center;\n}\n.gallery-show p {\n    color: #000;\n}\n.gallery-show .info-gallery {\n    position: relative;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-flow: column;\n            flex-flow: column;\n    width: 80%;\n    padding: 1em;\n    margin: 3em auto;\n    text-align: left;\n    background-color: #FFFFFF;\n}\n.gallery-show .info-gallery .destroy {\n      visibility: hidden;\n      opacity: 0;\n      position: absolute;\n      top: -0.2em;\n      right: -1.2em;\n      width: 1em;\n      margin: 0em;\n      font-size: 5em;\n      color: #FFFFFF;\n      cursor: pointer;\n      -webkit-transition: all 0.5s;\n      transition: all 0.5s;\n}\n.gallery-show .info-gallery:hover .destroy {\n      visibility: visible;\n      opacity: 100;\n      -webkit-transition: all 0.3s;\n      transition: all 0.3s;\n}\n.gallery-show .admin-picture {\n    position: relative;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-flow: column;\n            flex-flow: column;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    padding: 0.8em;\n    margin: 1em;\n    background-color: #fff;\n    text-align: left;\n}\n.gallery-show .admin-picture span {\n      width: 50%;\n      margin-right: 10em;\n}\n.gallery-show .admin-picture .destroy {\n      visibility: hidden;\n      opacity: 0;\n      position: absolute;\n      top: -0.2em;\n      right: -1.2em;\n      width: 1em;\n      margin: 0em;\n      font-size: 5em;\n      color: #FFFFFF;\n      cursor: pointer;\n      -webkit-transition: all 0.5s;\n      transition: all 0.5s;\n}\n.gallery-show .admin-picture:hover .destroy {\n      visibility: visible;\n      opacity: 100;\n      -webkit-transition: all 0.3s;\n      transition: all 0.3s;\n}\n.editable:hover .label:after {\n  content: '\\F040';\n  font-family: FontAwesome;\n  position: absolute;\n  font-size: 0.8rem;\n  margin: 0 0 0 0.8em;\n  color: #3c3f41;\n}\ntextarea, input {\n  outline: none;\n  border: none;\n  resize: none;\n}\n.details {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n}\n.form-item {\n  text-align: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: column;\n          flex-flow: column;\n}\n.form-item .additionnal-info {\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n}\n.form-item:hover .label:after {\n    content: '\\F040';\n    font-family: FontAwesome;\n    position: absolute;\n    font-size: 0.8rem;\n    margin: 0 0 0 0.8em;\n    color: #3c3f41;\n}\n.area {\n  width: 100%;\n  height: 8em;\n}\ninput[name=\"title\"] + .editing {\n  display: block;\n}\n.field {\n  display: none;\n}\n.label {\n  cursor: pointer;\n  text-shadow: none;\n}\n.consigne {\n  font-size: 0.8em;\n}\n.editing {\n  display: inline;\n}\n.editing + .label {\n  display: none;\n}\n.additionnal-info {\n  font-size: 0.8em;\n}\n.validation {\n  padding: 0.3em 1em;\n  margin: 0 0.5em !important;\n  border-radius: 1em;\n  background-color: #e65e5e;\n  color: #FFFFFF;\n  text-align: center;\n  cursor: pointer;\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n.validation:hover {\n    background-color: #5bbf5b;\n    -webkit-transition: all 0.3s;\n    transition: all 0.3s;\n}\n.visible-label {\n  display: inline-block;\n  width: 23em !important;\n  margin: 0 !important;\n}\n.public-label {\n  display: inline-block;\n  width: 17em;\n}\n.new-upload {\n  width: 80%;\n  padding: 2em;\n  margin: 3em auto 10em;\n  background-color: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.gallery-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: column;\n          flex-flow: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin: 2em 2em 15em 2em;\n  text-align: center;\n}\n.gallery-form h1,\n  .gallery-form select,\n  .gallery-form input[type=\"file\"] {\n    color: #fff;\n}\n.gallery-form .form-item {\n    margin: 2em;\n}\n.gallery-form .form-item span {\n      padding: 0.8em;\n      color: #fff;\n}\n.gallery-form input[type=\"text\"] {\n    width: 30vw;\n}\n.gallery-form select,\n  .gallery-form input[type=\"file\"] {\n    background-color: #4e4466;\n    margin: 0 auto;\n}\n.gallery-form input[type=\"file\"] {\n    display: none;\n}\n.gallery-form textarea {\n    width: 30vw;\n    height: 10vw;\n}\n.gallery-form input[type=\"submit\"] {\n    width: 10vw;\n    height: 3vw;\n    background-color: transparent;\n    color: #fff;\n    border-style: solid;\n    border-radius: 10em;\n    -webkit-transition: all 0.5s linear;\n    transition: all 0.5s linear;\n}\n.gallery-form input[type=\"submit\"]:hover {\n      background-color: #5bbf5b;\n      -webkit-transition: all 0.5s linear;\n      transition: all 0.5s linear;\n}\n.gallery-form label {\n    width: 25em;\n    color: #ffffff;\n    border-style: dashed;\n    border-radius: 10em;\n    padding: 0.5em;\n    margin: 0 auto;\n    cursor: pointer;\n    -webkit-transition: all 0.5s linear;\n    transition: all 0.5s linear;\n}\n.gallery-form label:hover {\n      border-style: solid;\n      -webkit-transition: all 0.5s linear;\n      transition: all 0.5s linear;\n}\n.gallery-form input, .gallery-form textarea {\n    padding: 0.8em;\n}\n.gallery-form .public {\n    display: inline-block;\n}\n.gallery-form input[type=\"checkbox\"] {\n    padding: 0.8em;\n}\n.gallery-form .form-submit {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n}\n.gallery-form .empty {\n    color: #ff3f49;\n}\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n.gallery-wrapper {\n  display: -webkit-inline-box;\n  display: -ms-inline-flexbox;\n  display: inline-flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: relative;\n  overflow: hidden;\n  text-align: center;\n  box-shadow: #968e95 7px 7px 15px;\n  -webkit-transition: all 1s;\n  transition: all 1s;\n  width: inherit;\n  height: inherit;\n}\n.gallery-wrapper:hover {\n    -webkit-transform: scale(0.98, 0.98);\n            transform: scale(0.98, 0.98);\n    box-shadow: none;\n    -webkit-transition: all 1s;\n    transition: all 1s;\n}\n.gallery-wrapper:hover .gallery-title {\n    opacity: 100;\n    color: #FF0C64;\n    -webkit-filter: blur(0px);\n            filter: blur(0px);\n    -webkit-transition: all 1s;\n    transition: all 1s;\n}\n.gallery-wrapper:hover .gallery-picture {\n    -webkit-filter: blur(6px);\n            filter: blur(6px);\n    -webkit-transition: all 0.3s;\n    transition: all 0.3s;\n}\n.gallery-picture {\n  max-width: 100%;\n  -webkit-transition: all 1s;\n  transition: all 1s;\n}\n.gallery-title {\n  position: absolute;\n  left: 1px;\n  z-index: 3;\n  opacity: 0;\n  -webkit-filter: blur(6px);\n          filter: blur(6px);\n  -webkit-transition: all 0.7s;\n  transition: all 0.7s;\n  width: inherit;\n  color: white;\n  font-size: 3em;\n  font-family: Caveat, 'cursive';\n}\n", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/**\n* List of variables\n**/\n/** Colors **/\n/** Fonts **/\n/**\n* List of mixins\n**/\n/** Material Shadow for block, depth between 0 and 5 **/\n/** Effects **/\n/**\n* List of function\n**/\n/** shadow function **/\n.admin-galleries {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-flow: column;\n          flex-flow: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin: 1em 0 10em;\n}\n.admin-galleries h1 {\n    color: #FFFFFF;\n}\n.gallery-item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  padding: 4em;\n  margin: 2em;\n  background-color: #FFFFFF;\n}\n.gallery-item a {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n}\n.gallery-item .gallery-info {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-flow: column;\n            flex-flow: column;\n}\n.gallery-item .gallery-info p {\n      padding: 1em;\n      color: #000000;\n      text-shadow: none;\n}\n.gallery-item .gallery-info p span {\n        color: #FF0C64;\n}\n.private {\n  border-style: solid;\n  border-color: #FF0C64;\n  border-width: 0.2em;\n}\n", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(71)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(41),
  /* template */
  __webpack_require__(64),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/AdminNav.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] AdminNav.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bb976e1e", Component.options)
  } else {
    hotAPI.reload("data-v-bb976e1e", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(70)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(43),
  /* template */
  __webpack_require__(63),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/GalleryPreview.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] GalleryPreview.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8064661a", Component.options)
  } else {
    hotAPI.reload("data-v-8064661a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(66)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(44),
  /* template */
  __webpack_require__(59),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/MainPreview.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MainPreview.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2c3af3c2", Component.options)
  } else {
    hotAPI.reload("data-v-2c3af3c2", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(68)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(45),
  /* template */
  __webpack_require__(61),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "/home/fred/web/bokehlicious/resources/assets/js/components/PictureForm.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] PictureForm.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3db01d55", Component.options)
  } else {
    hotAPI.reload("data-v-3db01d55", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c("div")
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2c3af3c2", module.exports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gallery-show"
  }, [_c('form', {
    ref: "form"
  }, [_c('div', {
    staticClass: "info-gallery"
  }, [_c('div', {
    staticClass: "form-item"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.gallery.title),
      expression: "gallery.title",
      modifiers: {
        "trim": true
      }
    }, {
      name: "focus",
      rawName: "v-focus",
      value: (_vm.target == 'title'),
      expression: "target == 'title'"
    }],
    staticClass: "field",
    class: {
      editing: _vm.target == 'title'
    },
    attrs: {
      "name": "title",
      "type": "text"
    },
    domProps: {
      "value": _vm._s(_vm.gallery.title)
    },
    on: {
      "blur": [_vm.onSave, function($event) {
        _vm.$forceUpdate()
      }],
      "keyup": [function($event) {
        if (_vm._k($event.keyCode, "enter", 13)) { return; }
        _vm.onSave($event)
      }, function($event) {
        if (_vm._k($event.keyCode, "esc", 27)) { return; }
        _vm.onAbort($event)
      }],
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gallery.title = $event.target.value.trim()
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "field consigne",
    class: {
      editing: _vm.target == 'title'
    }
  }, [_vm._v("ctrl+enter pour enregistrer")]), _vm._v(" "), _c('h1', {
    staticClass: "label",
    attrs: {
      "data-key": "title"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v(_vm._s(_vm.gallery.title))])]), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.gallery.description),
      expression: "gallery.description",
      modifiers: {
        "trim": true
      }
    }, {
      name: "focus",
      rawName: "v-focus",
      value: (_vm.target == 'description'),
      expression: "target == 'description'"
    }, {
      name: "area",
      rawName: "v-area"
    }],
    staticClass: "field area",
    class: {
      editing: _vm.target == 'description'
    },
    attrs: {
      "name": "description"
    },
    domProps: {
      "value": _vm._s(_vm.gallery.description)
    },
    on: {
      "blur": [_vm.onSave, function($event) {
        _vm.$forceUpdate()
      }],
      "keyup": [function($event) {
        if (_vm._k($event.keyCode, "enter", 13)) { return; }
        if (!$event.ctrlKey) { return; }
        _vm.onSave($event)
      }, function($event) {
        if (_vm._k($event.keyCode, "esc", 27)) { return; }
        _vm.onAbort($event)
      }],
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gallery.description = $event.target.value.trim()
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "field consigne",
    class: {
      editing: _vm.target == 'description'
    }
  }, [_vm._v("ctrl+enter pour enregistrer")]), _vm._v(" "), (_vm.gallery.description) ? _c('p', {
    staticClass: "label",
    attrs: {
      "data-key": "description"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v(_vm._s(_vm.gallery.description))]) : _c('p', {
    staticClass: "label",
    attrs: {
      "data-key": "description"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v("Aucune description")])]), _vm._v(" "), _c('div', {
    staticClass: "is-public"
  }, [_c('span', {
    staticClass: "public-label"
  }, [_vm._v("Afficher la galerie publiquement ?")]), _vm._v(" "), _c('label', {
    attrs: {
      "for": "true"
    }
  }, [_vm._v("Oui")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gallery.public),
      expression: "gallery.public"
    }],
    attrs: {
      "type": "radio",
      "id": "true",
      "name": "public",
      "value": "1",
      "data-key": "public"
    },
    domProps: {
      "checked": _vm._q(_vm.gallery.public, "1")
    },
    on: {
      "focus": _vm.onEdit,
      "change": _vm.onSave,
      "click": function($event) {
        _vm.gallery.public = "1"
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "false"
    }
  }, [_vm._v("Non")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gallery.public),
      expression: "gallery.public"
    }],
    attrs: {
      "type": "radio",
      "id": "false",
      "name": "public",
      "value": "0",
      "data-key": "public"
    },
    domProps: {
      "checked": _vm._q(_vm.gallery.public, "0")
    },
    on: {
      "focus": _vm.onEdit,
      "change": _vm.onSave,
      "click": function($event) {
        _vm.gallery.public = "0"
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "details"
  }, [_c('div', {
    staticClass: "form-item"
  }, [_c('span', {
    staticClass: "additionnal-info"
  }, [_vm._v("Galerie créé le : " + _vm._s(_vm.gallery.created_at) + " ")]), _vm._v(" "), _c('span', {
    staticClass: "additionnal-info"
  }, [_vm._v("Dernière modification : " + _vm._s(_vm.gallery.updated_at))])]), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('span', {
    staticClass: "additionnal-info"
  }, [_vm._v("Date du shooting :\n                        "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gallery.date),
      expression: "gallery.date"
    }, {
      name: "focus",
      rawName: "v-focus",
      value: (_vm.target == 'date'),
      expression: "target == 'date'"
    }],
    staticClass: "field",
    class: {
      editing: _vm.target == 'date'
    },
    attrs: {
      "name": "date",
      "type": "date"
    },
    domProps: {
      "value": _vm._s(_vm.gallery.date)
    },
    on: {
      "blur": _vm.onSave,
      "change": _vm.onSave,
      "keyup": function($event) {
        if (_vm._k($event.keyCode, "esc", 27)) { return; }
        _vm.onAbort($event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gallery.date = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.gallery.date != null) ? _c('span', [_vm._v(_vm._s(_vm.gallery.date))]) : _c('span', {
    staticClass: "label",
    attrs: {
      "data-key": "date"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v("Non renseigné")])])]), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('span', {
    staticClass: "additionnal-info"
  }, [_vm._v("Lieu du shooting :\n                        "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gallery.city),
      expression: "gallery.city"
    }, {
      name: "focus",
      rawName: "v-focus",
      value: (_vm.target == 'city'),
      expression: "target == 'city'"
    }],
    staticClass: "field",
    class: {
      editing: _vm.target == 'city'
    },
    attrs: {
      "name": "city",
      "type": "text",
      "placeholder": "Ville"
    },
    domProps: {
      "value": _vm._s(_vm.gallery.city)
    },
    on: {
      "blur": _vm.onSave,
      "keyup": [function($event) {
        if (_vm._k($event.keyCode, "enter", 13)) { return; }
        _vm.onSave($event)
      }, function($event) {
        if (_vm._k($event.keyCode, "esc", 27)) { return; }
        _vm.onAbort($event)
      }],
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gallery.city = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.gallery.city != null) ? _c('span', {
    staticClass: "label",
    attrs: {
      "data-key": "city"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v("\n                            " + _vm._s(_vm.gallery.city) + "\n                        ")]) : _c('span', {
    staticClass: "label",
    attrs: {
      "data-key": "city"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v("Non renseigné")])])]), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('span', {
    staticClass: "additionnal-info"
  }, [_vm._v("Coût du shooting :\n                "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.gallery.price),
      expression: "gallery.price"
    }, {
      name: "focus",
      rawName: "v-focus",
      value: (_vm.target == 'price'),
      expression: "target == 'price'"
    }],
    staticClass: "field",
    class: {
      editing: _vm.target == 'price'
    },
    attrs: {
      "name": "price",
      "type": "text",
      "placeholder": "Prix en €"
    },
    domProps: {
      "value": _vm._s(_vm.gallery.price)
    },
    on: {
      "blur": _vm.onSave,
      "keyup": [function($event) {
        if (_vm._k($event.keyCode, "enter", 13)) { return; }
        _vm.onSave($event)
      }, function($event) {
        if (_vm._k($event.keyCode, "esc", 27)) { return; }
        _vm.onAbort($event)
      }],
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.gallery.price = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.gallery.price != null) ? _c('span', {
    staticClass: "label",
    attrs: {
      "data-key": "price"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v(_vm._s(_vm.gallery.price) + "€")]) : _c('span', {
    staticClass: "label",
    attrs: {
      "data-key": "price"
    },
    on: {
      "dblclick": _vm.onEdit
    }
  }, [_vm._v("Non renseigné")])])])]), _vm._v(" "), _c('span', {
    staticClass: "destroy",
    attrs: {
      "title": "Supprimer cette galerie ?"
    },
    on: {
      "click": _vm.destroyGallery
    }
  }, [_c('i', {
    staticClass: "fa fa-trash",
    attrs: {
      "aria-hidden": "true"
    }
  })])]), _vm._v(" "), _vm._l((_vm.gallery.pictures), function(picture) {
    return _c('div', {
      staticClass: "admin-picture",
      class: {
        focus: picture.has_focus == 1
      }
    }, [_c('span', {
      staticClass: "destroy",
      attrs: {
        "title": "Supprimer cette photo ?"
      },
      on: {
        "click": function($event) {
          _vm.destroyPicture(picture)
        }
      }
    }, [_c('i', {
      staticClass: "fa fa-trash",
      attrs: {
        "aria-hidden": "true"
      }
    })]), _vm._v(" "), _c('img', {
      attrs: {
        "src": picture.path + '/' + picture.title,
        "alt": _vm.gallery.title
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "info-picture"
    }, [_c('span', [_vm._v("Nom : " + _vm._s(picture.title))]), _vm._v(" "), _c('span', [_vm._v("Nom original : " + _vm._s(picture.original_name))]), _vm._v(" "), _c('span', [_vm._v("Ajouter le : " + _vm._s(picture.created_at))]), _vm._v(" "), _c('br'), _vm._v(" "), _c('textarea', {
      directives: [{
        name: "model",
        rawName: "v-model.trim",
        value: (picture.description),
        expression: "picture.description",
        modifiers: {
          "trim": true
        }
      }, {
        name: "focus",
        rawName: "v-focus",
        value: (_vm.target == picture.id),
        expression: "target == picture.id"
      }],
      staticClass: "field",
      class: {
        editing: _vm.target == picture.id
      },
      domProps: {
        "value": _vm._s(picture.description)
      },
      on: {
        "keyup": [function($event) {
          if (_vm._k($event.keyCode, "enter", 13)) { return; }
          if (!$event.ctrlKey) { return; }
          _vm.pictureUpdate(picture)
        }, function($event) {
          if (_vm._k($event.keyCode, "esc", 27)) { return; }
          _vm.onAbort($event)
        }],
        "blur": [function($event) {
          _vm.pictureUpdate(picture)
        }, function($event) {
          _vm.$forceUpdate()
        }],
        "input": function($event) {
          if ($event.target.composing) { return; }
          picture.description = $event.target.value.trim()
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "field consigne",
      class: {
        editing: _vm.target == picture.id
      }
    }, [_vm._v("ctrl+enter pour enregistrer")]), _vm._v(" "), _c('span', {
      staticClass: "editable"
    }, [(!picture.description) ? _c('span', {
      staticClass: "label",
      attrs: {
        "data-key": picture.id
      },
      on: {
        "dblclick": function($event) {
          _vm.pictureEdit(picture, $event)
        }
      }
    }, [_vm._v(" Aucun description\n                    ")]) : _c('span', {
      staticClass: "label",
      attrs: {
        "data-key": picture.id,
        "data-field": "description"
      },
      on: {
        "dblclick": function($event) {
          _vm.pictureEdit(picture, $event)
        }
      }
    }, [_vm._v("\n                        Description : " + _vm._s(picture.description) + "\n                    ")])]), _vm._v(" "), _c('br'), _c('span', [_vm._v("Dimensions : (Largeur) " + _vm._s(picture.width) + "px * (Hauteur) " + _vm._s(picture.height) + "px")]), _vm._v(" "), (picture.has_focus == 1) ? _c('span', [_vm._v("Ceci est la photo de prévisualisation de cette galerie")]) : _vm._e(), _vm._v(" "), (picture.has_focus < 1) ? _c('div', [_c('label', {
      attrs: {
        "for": "focus"
      }
    }, [_vm._v("Faire de cette photo l'aperçu de la galerie :")]), _vm._v(" "), _c('input', {
      attrs: {
        "type": "radio",
        "data-key": "focus",
        "id": "focus",
        "name": "focus"
      },
      domProps: {
        "checked": picture.id == _vm.focus
      },
      on: {
        "change": function($event) {
          _vm.isFocus(picture, $event)
        }
      }
    }), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (picture.id == _vm.focus),
        expression: "picture.id == focus"
      }],
      staticClass: "validation",
      on: {
        "click": _vm.onSave
      }
    }, [_vm._v("Valider")]), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (picture.id == _vm.focus),
        expression: "picture.id == focus"
      }],
      staticClass: "validation",
      on: {
        "click": function($event) {
          _vm.focus = _vm.oldValue
        }
      }
    }, [_vm._v("Annuler")])]) : _vm._e(), _vm._v(" "), (picture.has_focus < 1) ? _c('div', {
      staticClass: "is-visible"
    }, [_c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (!picture.visible),
        expression: "!picture.visible"
      }],
      staticClass: "visible-label"
    }, [_vm._v("Cocher pour afficher la photo publiquement :")]), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (picture.visible),
        expression: "picture.visible"
      }],
      staticClass: "visible-label"
    }, [_vm._v("Décocher pour masquer la photo publiquement :")]), _vm._v(" "), _c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (picture.visible),
        expression: "picture.visible"
      }],
      attrs: {
        "type": "checkbox",
        "data-key": picture.id,
        "data-field": "visible"
      },
      domProps: {
        "checked": Array.isArray(picture.visible) ? _vm._i(picture.visible, null) > -1 : (picture.visible)
      },
      on: {
        "change": function($event) {
          _vm.visibiltyUpdate(picture)
        },
        "click": function($event) {
          var $$a = picture.visible,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = null,
              $$i = _vm._i($$a, $$v);
            if ($$c) {
              $$i < 0 && (picture.visible = $$a.concat($$v))
            } else {
              $$i > -1 && (picture.visible = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            picture.visible = $$c
          }
        }
      }
    })]) : _vm._e()])])
  }), _vm._v(" "), _c('div', {
    staticClass: "new-upload"
  }, [_c('span', [_vm._v("Ajouter de nouvelles photos à la galerie :")]), _vm._v(" "), _c('input', {
    attrs: {
      "type": "file",
      "multiple": "",
      "name": "pictures[]"
    },
    on: {
      "change": function($event) {
        _vm.submit()
      }
    }
  }), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.upload),
      expression: "upload"
    }],
    staticClass: "validation",
    on: {
      "click": _vm.onUpload
    }
  }, [_vm._v("Envoyer")])])], 2)])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-30781ca0", module.exports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "picture-form"
  }, [_c('form', {
    attrs: {
      "action": "#"
    }
  }, _vm._l((_vm.pictures), function(picture) {
    return _c('div', {
      staticClass: "form-item"
    }, [_c('img', {
      attrs: {
        "src": picture.path + '/' + picture.title,
        "alt": picture.title,
        "title": picture.title
      }
    }), _vm._v(" "), _c('label', {
      attrs: {
        "for": "focus"
      }
    }, [_vm._v("Choisir cette photo en preview de la gallerie")]), _vm._v(" "), _c('input', {
      attrs: {
        "type": "radio",
        "id": "focus",
        "name": "has_focus"
      },
      domProps: {
        "value": picture.id,
        "checked": picture.has_focus
      }
    }), _vm._v(" "), _c('textarea', {
      attrs: {
        "name": "description",
        "placeholder": "Ajouter une description à cette photo"
      }
    })])
  }))])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3db01d55", module.exports)
  }
}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "gallery-form"
  }, [_c('form', {
    ref: "form",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.onSubmit($event)
      }
    }
  }, [_c('h1', [_vm._v("Création d'une galerie")]), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.title),
      expression: "title"
    }],
    attrs: {
      "name": "title",
      "type": "text",
      "id": "title",
      "placeholder": "Quel est le titre de la galerie (obligatoire)"
    },
    domProps: {
      "value": _vm._s(_vm.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.title = $event.target.value
      }
    }
  })]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('span', [_vm._v("Choix de la catégorie :")]), _vm._v(" "), _c('select', {
    attrs: {
      "name": "category"
    }
  }, _vm._l((_vm.categories), function(category) {
    return _c('option', {
      domProps: {
        "value": category.value
      }
    }, [_vm._v(_vm._s(category.name))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "form-item"
  }, [_c('label', {
    attrs: {
      "for": "upload"
    }
  }, [_vm._v("Ajouter de nouvelles photos à la gallerie")]), _c('br'), _vm._v(" "), _c('input', {
    attrs: {
      "type": "file",
      "multiple": "",
      "name": "pictures[]",
      "id": "upload"
    },
    on: {
      "change": function($event) {
        _vm.onUpload()
      }
    }
  }), _vm._v(" "), (_vm.countFiles > 1) ? _c('span', [_vm._v(_vm._s(_vm.countFiles) + " fichiers sélectionnés")]) : _c('span', [_vm._v(_vm._s(_vm.countFiles) + " fichier sélectionné")])]), _vm._v(" "), _c('div', {
    staticClass: "form-aside"
  }, [_c('div', {
    staticClass: "form-item"
  }, [_c('input', {
    attrs: {
      "type": _vm.date,
      "name": "date",
      "placeholder": "Date du shooting (optionnel)"
    },
    on: {
      "focus": function($event) {
        _vm.date = 'date'
      },
      "blur": function($event) {
        _vm.date = 'text'
      }
    }
  })]), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2)]), _vm._v(" "), _c('div', {
    staticClass: "form-item public"
  }, [_c('span', [_vm._v("Cocher pour publier publiquement automatiquement la galerie")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.public),
      expression: "public"
    }],
    attrs: {
      "type": "checkbox",
      "name": "public",
      "true-value": 1,
      "false-value": 0
    },
    domProps: {
      "value": _vm.public,
      "checked": Array.isArray(_vm.public) ? _vm._i(_vm.public, _vm.public) > -1 : _vm._q(_vm.public, 1)
    },
    on: {
      "click": function($event) {
        var $$a = _vm.public,
          $$el = $event.target,
          $$c = $$el.checked ? (1) : (0);
        if (Array.isArray($$a)) {
          var $$v = _vm.public,
            $$i = _vm._i($$a, $$v);
          if ($$c) {
            $$i < 0 && (_vm.public = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.public = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.public = $$c
        }
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "form-submit"
  }, [(!_vm.valid) ? _c('span', {
    staticClass: "empty"
  }, [_vm._v("Choisir un titre et sélectionner des fichiers pour pouvoir enregistrer la gallerie")]) : _c('input', {
    attrs: {
      "type": "submit",
      "value": "Enregistrer"
    }
  })])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "form-item"
  }, [_c('textarea', {
    attrs: {
      "name": "description",
      "id": "description",
      "placeholder": "Décrivez cette galerie (optionnel)"
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "form-item"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "name": "city",
      "placeholder": "Lieu du shooting (optionnel)"
    }
  })])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "form-item"
  }, [_c('input', {
    attrs: {
      "type": "number",
      "name": "price",
      "placeholder": "Coût du shooting en € (optionnel)"
    }
  })])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7226a3a9", module.exports)
  }
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('a', {
    staticClass: "gallery-wrapper",
    style: ({
      height: _vm.ratio + 'vw'
    }),
    attrs: {
      "href": _vm.route
    }
  }, [_c('img', {
    ref: "picture",
    staticClass: "gallery-picture",
    attrs: {
      "src": _vm.path + '/' + _vm.title,
      "alt": _vm.title
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "gallery-title"
  }, [_vm._v(_vm._s(_vm.galleryTitle))]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.ratio))])])
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-8064661a", module.exports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('nav', {
    staticClass: "admin-nav"
  }, [_c('h2', [_vm._v("Galleries")]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": {
        name: 'gallery.index'
      },
      "title": "Index des galleries",
      "exact": ""
    }
  }, [_vm._v("Index des galleries")]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": {
        name: 'gallery.create'
      },
      "title": "Créer une gallerie"
    }
  }, [_vm._v("Créer une gallerie")]), _vm._v(" "), _c('h2', [_vm._v("Utilisateur")]), _vm._v(" "), _c('a', {
    attrs: {
      "href": "#",
      "title": "Work in progress"
    }
  }, [_vm._v("Liste des utilisateurs")]), _vm._v(" "), _c('a', {
    attrs: {
      "href": "#",
      "title": "Work in progress"
    }
  }, [_vm._v("Ajouter un utilisateur")])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-bb976e1e", module.exports)
  }
}

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "admin-galleries"
  }, [_c('h1', [_vm._v("Index des " + _vm._s(_vm.galleries.length) + " galeries du site")]), _vm._v(" "), _vm._l((_vm.galleries), function(gallery) {
    return _c('div', {
      staticClass: "gallery-item",
      class: {
        private: !gallery.public
      }
    }, [_vm._l((gallery.pictures), function(picture) {
      return [_c('router-link', {
        attrs: {
          "to": {
            name: 'gallery.show',
            params: {
              id: gallery.id
            }
          }
        }
      }, [_c('div', [_c('img', {
        attrs: {
          "src": picture.path + '/' + picture.thumb_name,
          "alt": picture.title
        }
      })]), _vm._v(" "), _c('div', {
        staticClass: "gallery-info"
      }, [_c('p', [_c('span', [_vm._v("Gallerie ")]), _vm._v(": " + _vm._s(gallery.title))]), _vm._v(" "), (gallery.description) ? _c('p', [_c('span', [_vm._v("Description")]), _vm._v(" : " + _vm._s(gallery.description))]) : _vm._e(), _vm._v(" "), _c('p', [_c('span', [_vm._v("Catégorie")]), _vm._v(" : " + _vm._s(_vm.category(gallery.category_id)))]), _vm._v(" "), (gallery.date) ? _c('p', [_c('span', [_vm._v("Date du shooting")]), _vm._v(" : " + _vm._s(gallery.date))]) : _vm._e(), _vm._v(" "), (gallery.city) ? _c('p', [_c('span', [_vm._v("Lieux du shooting")]), _vm._v(" : " + _vm._s(gallery.city))]) : _vm._e(), _vm._v(" "), (gallery.price) ? _c('p', [_c('span', [_vm._v("Coût du shooting")]), _vm._v(" : " + _vm._s(gallery.price) + "€")]) : _vm._e(), _vm._v(" "), (gallery.total_pictures > 0) ? _c('p', [_c('span', [_vm._v(_vm._s(gallery.total_pictures) + " ")]), _vm._v(" photos")]) : _vm._e(), _vm._v(" "), (gallery.public) ? _c('p', [_c('span', [_vm._v("Galerie public")])]) : _c('p', [_c('span', [_vm._v("Galerie privé")])])])])]
    })], 2)
  })], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d90bff38", module.exports)
  }
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("effa0606", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2c3af3c2!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./MainPreview.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2c3af3c2!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./MainPreview.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("b306e46e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-30781ca0!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AdminGallery.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-30781ca0!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AdminGallery.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("069cb2d3", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3db01d55!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PictureForm.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-3db01d55!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./PictureForm.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("06702db0", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7226a3a9!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GalleryForm.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-7226a3a9!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GalleryForm.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("4376551d", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-8064661a!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GalleryPreview.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-8064661a!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./GalleryPreview.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("3c0d948c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-bb976e1e!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AdminNav.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-bb976e1e!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AdminNav.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(3)("1d62e3ec", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-d90bff38!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AdminGalleriesIndex.vue", function() {
     var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-d90bff38!./../../../../node_modules/sass-loader/index.js!./../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AdminGalleriesIndex.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 73 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 74 */,
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(20);
module.exports = __webpack_require__(21);


/***/ })
],[75]);