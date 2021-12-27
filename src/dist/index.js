"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Flow = exports.Item = exports.ItemPanel = void 0;
var React = require("react");
var index_less_1 = require("./index.less");
var lib_1 = require("@antv/g6/lib");
var clazz_1 = require("./util/clazz");
var index_1 = require("./locales/index");
var command_1 = require("./plugins/command");
var toolbar_1 = require("./plugins/toolbar");
var addItemPanel_1 = require("./plugins/addItemPanel");
var canvasPanel_1 = require("./plugins/canvasPanel");
var bpmn_1 = require("./util/bpmn");
var context_1 = require("./util/context");
var ItemPanel_1 = require("./components/ItemPanel");
exports.ItemPanel = ItemPanel_1["default"];
var Item_1 = require("./components/ItemPanel/Item");
exports.Item = Item_1["default"];
var Flow_1 = require("./Flow");
exports.Flow = Flow_1["default"];
var ToolbarPanel_1 = require("./components/ToolbarPanel");
var shape_1 = require("./shape");
var behavior_1 = require("./behavior");
var utils_1 = require("./util/utils");
require("./util/init");
shape_1["default"](lib_1["default"]);
behavior_1["default"](lib_1["default"]);
var Designer = /** @class */ (function (_super) {
    __extends(Designer, _super);
    function Designer(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.pageRef = React.createRef();
        _this.toolbarRef = React.createRef();
        _this.itemPanelRef = React.createRef();
        _this.detailPanelRef = React.createRef();
        _this.resizeFunc = function () { };
        _this.containerID = "flow-panel-" + utils_1.guid() + "-layout";
        _this.state = {
            graph: null,
            selectedModel: {},
            processModel: {
                id: '',
                name: '',
                clazz: 'process',
                dataObjs: [],
                signalDefs: [],
                messageDefs: []
            }
        };
        return _this;
    }
    Designer.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) {
        if (prevProps.data !== this.props.data) {
            if (this.graph) {
                this.graph.changeData(this.initShape(this.props.data));
                this.graph.setMode(this.props.mode);
                // this.graph.emit('canvas:click');
                if (this.cmdPlugin) {
                    this.cmdPlugin.initPlugin(this.graph);
                }
                if (this.props.isView) {
                    this.graph.fitView(5);
                }
            }
        }
    };
    // componentDidMount() {
    // const { isView,mode } = this.props;
    // const height = this.props.height-1;
    // const width = this.pageRef.current.offsetWidth;
    // let plugins = [];
    // if(!isView){
    //   this.cmdPlugin = new Command();
    //   const toolbar = new Toolbar({container:this.toolbarRef.current});
    //   const addItemPanel = new AddItemPanel({container:this.itemPanelRef.current});
    //   const canvasPanel = new CanvasPanel({container:this.pageRef.current});
    //   const minimap = new G6.Minimap({
    //     size: [150, 100],
    //   });
    //   plugins = [ this.cmdPlugin,toolbar,addItemPanel,canvasPanel,minimap ];//toolbar,
    // }
    // this.graph = new G6.Graph({
    //   plugins: plugins,
    //   container: this.pageRef.current,
    //   height: height,
    //   width: width,
    //   fitCenter:true,
    //   modes: {
    //     default: ['clickSelected'],
    //     view: [ ],
    //     edit: ['hoverNodeActived','hoverAnchorActived','dragNode','dragEdge',
    //       'dragPanelItemAddNode','clickSelected','deleteItem','itemAlign','dragPoint','brush-select'],
    //   },
    //   defaultEdge: {
    //     type: 'flow-polyline-round',
    //   },
    // });
    // this.graph.saveXML = (createFile = true) => exportXML(this.graph.save(),this.state.processModel,createFile);
    // if(isView){
    //   this.graph.setMode("view");
    // }else{
    //   this.graph.setMode(mode);
    // }
    // this.graph.data(this.props.data ? this.initShape(this.props.data) : {nodes:[],edges:[]});
    // this.graph.render();
    // if(isView && this.props.data && this.props.data.nodes){
    //   this.graph.fitView(5)
    // }
    // this.initEvents();
    // }
    Designer.prototype.updateGraph = function (data) {
        if (this.graph) {
            var layoutConfig = null;
            if (data.nodes && data.nodes.constructor === Array && data.nodes.length > 0) {
                if (!this.nodeNodeDist(data)) {
                    layoutConfig = {
                        type: 'grid',
                        begin: [0, 0],
                        preventOverlap: true,
                        preventOverlapPdding: 20,
                        condense: false,
                        sortBy: 'degree' // 可选
                    };
                }
                else {
                    this.nodeDist(data);
                }
            }
            this.graph.changeData(this.initShape(data));
            this.graph.setMode(this.props.mode);
            if (layoutConfig)
                this.graph.updateLayout(layoutConfig);
            // this.graph.emit('canvas:click');
            if (this.cmdPlugin) {
                this.cmdPlugin.initPlugin(this.graph);
            }
            if (this.props.isView) {
                this.graph.fitView(5);
            }
        }
    };
    Designer.prototype.componentDidMount = function () {
        var _this = this;
        var data = null;
        var _a = this.props, isView = _a.isView, mode = _a.mode, isViewMiniMap = _a.isViewMiniMap, setRef = _a.setRef;
        var _self = this;
        window.cb.events.init('showQueryDrawer', function (params) {
            var data = params[0];
            var containerID = params[1];
            var layoutConfig = {};
            if (data.nodes && data.nodes.constructor === Array && data.nodes.length > 0) {
                if (!_this.nodeNodeDist(data)) {
                    layoutConfig = {
                        type: 'grid',
                        begin: [0, 0],
                        preventOverlap: true,
                        preventOverlapPdding: 20,
                        condense: false,
                        sortBy: 'degree' // 可选
                    };
                }
                else {
                    _this.nodeDist(data);
                }
            }
            var cDiv = document.getElementById(containerID);
            var height = _self.props.height + 100;
            var width = cDiv.offsetWidth;
            var plugins = [];
            if (!isView) {
                _self.cmdPlugin = new command_1["default"]();
                var toolbar = new toolbar_1["default"]({ container: _self.toolbarRef.current });
                // const addItemPanel = new AddItemPanel({container:this.itemPanelRef.current});
                var canvasPanel = new canvasPanel_1["default"]({ container: cDiv });
                var minimap = new lib_1["default"].Minimap({
                    className: 'ff-gg111--00---111',
                    size: [120, 80]
                });
                plugins = [_self.cmdPlugin, toolbar, canvasPanel]; //toolbar,
                if (isViewMiniMap)
                    plugins.push(minimap);
            }
            _self.graph = new lib_1["default"].Graph({
                plugins: plugins,
                container: cDiv,
                height: height,
                width: width,
                fitCenter: true,
                layout: __assign({}, layoutConfig),
                modes: {
                    "default": ['clickSelected', 'drag-combo'],
                    view: [],
                    edit: ['hoverNodeActived', 'hoverAnchorActived', 'dragNode', 'dragEdge',
                        'dragPanelItemAddNode', 'clickSelected', 'deleteItem', 'itemAlign', 'dragPoint', 'brush-select']
                },
                defaultEdge: {
                    type: 'flow-polyline-round'
                }
            });
            _self.graph.saveXML = function (createFile) {
                if (createFile === void 0) { createFile = true; }
                return bpmn_1.exportXML(_self.graph.save(), _self.state.processModel, createFile);
            };
            if (isView) {
                _self.graph.setMode("view");
            }
            else {
                _self.graph.setMode(mode);
            }
            setRef && setRef(_self);
            _self.graph.data(data ? _self.initShape(data) : { nodes: [], edges: [] });
            _self.graph.render();
            // if(isView && data && data.nodes){
            //   _self.graph.fitView(5)
            // }
            _self.initEvents();
            window.cb.events.trigger('__showItemPanel');
            window.cb.events.trigger('__initFlowPanel', _self.graph);
            setTimeout(function () {
                _self.graph.fitCenter();
            });
        });
        window.cb.events.init('showItemPanel', function (params) {
            var cID = params[0];
            var cDiv = document.getElementById(cID);
            var addItemPanel = new addItemPanel_1["default"]({ container: cDiv });
            _self.graph.addPlugin(addItemPanel);
        });
        window.cb.events.init('__updateGraphData', function (params) {
            var data = params[0];
            _self.updateGraph(data);
        });
        window.cb.events.init('__updateGraphSize', function (params) {
            var data = params[0];
            var _cfg = _self.graph.cfg;
            _self.graph.changeSize(data.width || _cfg.width, data.height || data || _cfg.height);
        });
    };
    Designer.prototype.nodeNodeDist = function (data) {
        var isExists = false;
        if (data.nodes && data.nodes.constructor === Array) {
            var nodes = data.nodes;
            nodes.map(function (item) {
                if (item.x && item.y) {
                    isExists = true;
                }
            });
        }
        return isExists;
    };
    Designer.prototype.nodeDist = function (data) {
        var _this = this;
        var nodes = data.nodes, narr = [];
        nodes.map(function (iitm) {
            if (narr.includes(iitm.id))
                return;
            if (iitm.size) {
                if (iitm.size.constructor === String) {
                    iitm.size = iitm.size.split('*');
                }
            }
            else {
                iitm.size = [120, 45];
            }
            nodes.map(function (iimm) {
                if (iimm.size) {
                    if (iimm.size.constructor === String) {
                        iimm.size = iimm.size.split('*');
                    }
                }
                else {
                    iimm.size = [120, 45];
                }
                if (iimm.id !== iitm.id && iimm.y <= (iitm.y + iitm.size[1]) && (iimm.y + iimm.size[1]) >= (iitm.y + iitm.size[1]) && iimm.x <= (iitm.x + iitm.size[0]) && (iimm.x + iimm.size[0]) >= (iitm.x + iitm.size[0])) {
                    narr.push(iimm.id);
                    iimm.x = _this.nodeDistXNum(nodes, iimm.x, iimm.size[0]);
                    iimm.y = _this.nodeDistYNum(nodes, iimm.y, iimm.size[1]);
                }
            });
            console.log(data);
        });
        // let isExists = false;
        // if(data.nodes && data.nodes.constructor===Array){
        //   const nodes = data.nodes;
        //   nodes.map((item)=>{
        //       if(!item.x || !item.y){
        //         //  isExists=true;
        //         if(!item.x)
        //           item.x = this.nodeDistXNum(nodes,0,item.size[1]);
        //         if(!item.y)
        //           item.y = this.nodeDistYNum(nodes,0,item.size[0]);
        //       }else{
        //         if(nodes.findIndex((xitem)=>(xitem.x>=item.x && item.x<=(item.size[0]+xitem.x)))>=0){
        //            item.x = this.nodeDistYNum(nodes,item.y,item.size[1]);
        //         }
        //         if(nodes.findIndex((xitem)=>(xitem.y<=item.y && item.y<=(xitem.y+xitem.size[1])))>=0){
        //            item.y = this.nodeDistXNum(nodes,item.x,item.size[0]);
        //         }
        //       }
        //   })
        // }
        // return isExists;
    };
    Designer.prototype.nodeDistXNum = function (nodes, num, size) {
        var item = nodes.find(function (item) { return item.x === num; });
        if (item) {
            num = item.y + size + 50;
            return this.nodeDistXNum(nodes, num, size);
        }
        return num;
    };
    Designer.prototype.nodeDistYNum = function (nodes, num, size) {
        var item = nodes.find(function (item) { return item.y === num; });
        if (item) {
            num = item.x + size + 50;
            return this.nodeDistYNum(nodes, num, size);
        }
        return num;
    };
    Designer.prototype.initShape = function (data) {
        if (data && data.nodes) {
            return {
                nodes: data.nodes.map(function (node) {
                    return __assign({ type: clazz_1.getShapeName(node.clazz || 'userTask') }, node);
                }),
                edges: data.edges
            };
        }
        return data;
    };
    Designer.prototype.initEvents = function () {
        var _this = this;
        this.graph.on('afteritemselected', function (items) {
            if (items && items.length > 0) {
                var item = _this.graph.findById(items[0]);
                if (!item) {
                    item = _this.getNodeInSubProcess(items[0]);
                }
                _this.setState({ selectedModel: __assign({}, item.getModel()) });
            }
            else {
                _this.setState({ selectedModel: _this.state.processModel });
            }
        });
        var page = document.getElementById(this.containerID);
        var graph = this.graph;
        var height = this.props.height - 1;
        this.resizeFunc = function () {
            graph.changeSize(page.offsetWidth, height);
        };
        window.addEventListener("resize", this.resizeFunc);
    };
    Designer.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.resizeFunc);
        if (this.graph) {
            this.graph.getNodes().forEach(function (node) {
                node.getKeyShape().stopAnimate();
            });
        }
    };
    Designer.prototype.onItemCfgChange = function (key, value) {
        var _a, _b, _c;
        var items = this.graph.get('selectedItems');
        if (items && items.length > 0) {
            var item = this.graph.findById(items[0]);
            if (!item) {
                item = this.getNodeInSubProcess(items[0]);
            }
            if (this.graph.executeCommand) {
                this.graph.executeCommand('update', {
                    itemId: items[0],
                    updateModel: (_a = {}, _a[key] = value, _a)
                });
            }
            else {
                this.graph.updateItem(item, (_b = {}, _b[key] = value, _b));
            }
            this.setState({ selectedModel: __assign({}, item.getModel()) });
        }
        else {
            var canvasModel = __assign(__assign({}, this.state.processModel), (_c = {}, _c[key] = value, _c));
            this.setState({ selectedModel: canvasModel });
            this.setState({ processModel: canvasModel });
        }
    };
    Designer.prototype.getNodeInSubProcess = function (itemId) {
        var subProcess = this.graph.find('node', function (node) {
            if (node.get('model')) {
                var clazz = node.get('model').clazz;
                if (clazz === 'subProcess') {
                    var containerGroup = node.getContainer();
                    var subGroup = containerGroup.subGroup;
                    var item = subGroup.findById(itemId);
                    return subGroup.contain(item);
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });
        if (subProcess) {
            var group = subProcess.getContainer();
            return group.getItem(subProcess, itemId);
        }
        return null;
    };
    Designer.prototype.render = function () {
        var height = this.props.height;
        var _a = this.props, isView = _a.isView, mode = _a.mode, users = _a.users, groups = _a.groups, lang = _a.lang, style = _a.style;
        var _b = this.state, selectedModel = _b.selectedModel, processModel = _b.processModel, graph = _b.graph;
        var signalDefs = processModel.signalDefs, messageDefs = processModel.messageDefs;
        var i18n = index_1["default"][lang.toLowerCase()];
        var readOnly = mode !== "edit";
        return (React.createElement(context_1["default"].Provider, { value: { i18n: i18n, lang: lang, isView: isView, containerID: this.containerID } },
            React.createElement("div", { className: index_less_1["default"].root + " yard-flow-for-ksy-cls", style: Object.assign({}, style || {}) },
                !isView && React.createElement(ToolbarPanel_1["default"], { ref: this.toolbarRef }),
                this.props.children)));
    };
    Designer.defaultProps = {
        height: 500,
        isView: false,
        mode: 'edit',
        lang: 'zh'
    };
    return Designer;
}(React.Component));
exports["default"] = Designer;
