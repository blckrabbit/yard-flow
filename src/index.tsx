import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6/lib';
import { getShapeName } from './util/clazz'
import locale from './locales/index';
import Command from './plugins/command'
import Toolbar from './plugins/toolbar'
import AddItemPanel from './plugins/addItemPanel'
import CanvasPanel from './plugins/canvasPanel'
import { exportXML } from "./util/bpmn";
import LangContext from "./util/context";
import ItemPanel from "./components/ItemPanel";
import Item from "./components/ItemPanel/Item";
import Flow from "./Flow";
import ToolbarPanel from "./components/ToolbarPanel";
import registerShape from './shape'
import registerBehavior from './behavior'
import { IDefaultModel, IProcessModel, ISelectData } from './types';
import { guid } from './util/utils'
import './util/init'
registerShape(G6);
registerBehavior(G6);

export interface DesignerProps {
  /** 画布高度 */
  height?: number;
  /** 是否只显示中间画布 */
  isView?: boolean;
  isViewMiniMap?: boolean;
  /** 模式为只读或编辑 */
  mode: 'default' | 'view' | 'edit';
  /** 语言 */
  lang?: 'en' | 'zh';
  /** 流程数据 */
  data: any;
  /** 审核人 */
  users?: ISelectData[];
  /** 审核组 */
  groups?: ISelectData[];
  setRef?:any;
  style?:any;
}

export interface DesignerStates {
  selectedModel: IDefaultModel;
  processModel: IProcessModel;
  graph: any
}


export {
  ItemPanel,
  Item,
  Flow
}

export default class Designer extends React.Component<DesignerProps, DesignerStates> {
  static defaultProps = {
    height: 500,
    isView: false,
    mode: 'edit',
    lang: 'zh',
  };
  private readonly pageRef: React.RefObject<any>;
  private readonly toolbarRef: React.RefObject<any>;
  private readonly itemPanelRef: React.RefObject<any>;
  private readonly detailPanelRef: React.RefObject<any>;
  private fitCenter:boolean;
  private resizeFunc: (...args: any[]) => any;
  public graph: any;
  public cmdPlugin: any;
  private containerID:string;

  constructor(cfg: DesignerProps) {
    super(cfg);
    this.pageRef = React.createRef();
    this.toolbarRef = React.createRef();
    this.itemPanelRef = React.createRef();
    this.detailPanelRef = React.createRef();
    this.resizeFunc = () => { };
    this.containerID = `flow-panel-${guid()}-layout`;
    this.state = {
      graph: null,
      selectedModel: {},
      processModel: {
        id: '',
        name: '',
        clazz: 'process',
        dataObjs: [],
        signalDefs: [],
        messageDefs: [],
      },
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      if (this.graph) {
        this.graph.changeData(this.initShape(this.props.data));
        this.graph.setMode(this.props.mode);
        // this.graph.emit('canvas:click');
        if (this.cmdPlugin) {
          this.cmdPlugin.initPlugin(this.graph);
        }
        if (this.props.isView) {
          this.graph.fitView(5)
        }
      }
    }
  }

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

  updateGraph(data) {
    if (this.graph) {
      let layoutConfig = null;
      if( data.nodes && data.nodes.constructor===Array && data.nodes.length>0){
        if(!this.nodeNodeDist(data)){
          layoutConfig = {
            type: 'grid',
            begin: [ 0, 0 ],          // 可选，
            preventOverlap: true,     // 可选，必须配合 nodeSize
            preventOverlapPdding: 20, // 可选
            condense: false,          // 可选
            sortBy: 'degree'          // 可选
          };
        }else{
          this.nodeDist(data);
        }
      }
      this.graph.changeData(this.initShape(data));
      this.graph.setMode(this.props.mode);
      if(layoutConfig)
        this.graph.updateLayout(layoutConfig);
      // this.graph.emit('canvas:click');
      if (this.cmdPlugin) {
        this.cmdPlugin.initPlugin(this.graph);
      }
      if (this.props.isView) {
        // this.graph.fitView();
        this.graph.zoomTo(1);
        this.graph.fitCenter();

      }
    }
  }

  componentDidMount() {
    let data=null;
    const { isView,mode,isViewMiniMap,setRef } = this.props;
    const _self = this;
    (window as any).cb.events.init('showQueryDrawer', params => { 
      let data = params[0];
      let containerID = params[1];
      let layoutConfig = {};
      if( data.nodes && data.nodes.constructor===Array && data.nodes.length>0){
        if(!this.nodeNodeDist(data)){
          layoutConfig = {
            type: 'grid',
            begin: [ 0, 0 ],          // 可选，
            preventOverlap: true,     // 可选，必须配合 nodeSize
            preventOverlapPdding: 20, // 可选
            condense: false,          // 可选
            sortBy: 'degree'          // 可选
          };
        }else{
          this.nodeDist(data);
        }
      }

      const cDiv = document.getElementById(containerID);
      const height = _self.props.height+100;
      const width = cDiv.offsetWidth;
      let plugins = [];
      if(!isView){
        _self.cmdPlugin = new Command();
        const toolbar = new Toolbar({container:_self.toolbarRef.current});
        // const addItemPanel = new AddItemPanel({container:this.itemPanelRef.current});
        const canvasPanel = new CanvasPanel({container:cDiv});
        const minimap = new G6.Minimap({
          className:'ff-gg111--00---111',
          size: [120, 80],
        });
        plugins = [ _self.cmdPlugin,toolbar,canvasPanel ];//toolbar,
        if(isViewMiniMap)
          plugins.push(minimap);
      }

      let edits = ['hoverNodeActived','hoverAnchorActived','dragNode','dragEdge',
      'dragPanelItemAddNode','clickSelected','deleteItem','itemAlign','dragPoint','brush-select'];
      let defaults = ['clickSelected','drag-combo'];
      if(isView){
        defaults = [];
        edits = [];
      }

      _self.graph = new G6.Graph({
        plugins: plugins,
        container: cDiv,
        height: height,
        width: width,
        fitCenter:true,
        layout: { ...layoutConfig },
        modes: {
          default: defaults,  //'drag-canvas',
          view: [],
          edit: edits,  //'drag-canvas',
        },
        defaultEdge: {
          type: 'flow-polyline-round',
        }
      });
      _self.graph.saveXML = (createFile = true) => exportXML(_self.graph.save(),_self.state.processModel,createFile);
      if(isView){
        _self.graph.setMode("view");
      }else{
        _self.graph.setMode(mode);
      }
      _self.graph.isView=isView;
      setRef && setRef(_self);
      _self.graph.data(data ? _self.initShape(data) : {nodes:[],edges:[]});
      _self.graph.render();
      // if(isView && data && data.nodes){
      //   _self.graph.fitView(5)
      // }
      _self.initEvents();
      (window as any).cb.events.trigger('__showItemPanel');
      (window as any).cb.events.trigger('__initFlowPanel',_self.graph);
      setTimeout(()=>{
        _self.graph.fitCenter();
      })
    });

    (window as any).cb.events.init('showItemPanel', params => { 
      let cID = params[0];
      const cDiv = document.getElementById(cID);
      const addItemPanel = new AddItemPanel({container:cDiv});
      _self.graph.addPlugin(addItemPanel);
    });

    (window as any).cb.events.init('__selectNode', params => { 
      let item = params[0];
      if(!item || !_self.graph) return;
      _self.graph.setItemState(item, 'selected', true);
      let selectedItems = _self.graph.get('selectedItems');
      if (!selectedItems)
        selectedItems = [];
      selectedItems = [item.get('id')];
      _self.graph.set('selectedItems', selectedItems);
      _self.graph.emit('afteritemselected', selectedItems);
    });    

    (window as any).cb.events.init('__updateGraphData', params => { 
      let data = params[0];
      _self.updateGraph(data);
    });

    (window as any).cb.events.init('__updateGraphSize', params => { 
      let data = params[0];
      const _cfg = _self.graph.cfg;
      _self.graph.changeSize(data.width || _cfg.width,data.height || data || _cfg.height);
    });

  }


  nodeNodeDist(data){
    let isExists = false;
    if(data.nodes && data.nodes.constructor===Array){
      const nodes = data.nodes;
      nodes.map((item)=>{
        if(item.x && item.y){
          isExists=true;
        }
      })
    }
    return isExists;
  }

  nodeDist(data){
    const nodes = data.nodes,narr=[];
    nodes.map((iitm)=>{
      if(narr.includes(iitm.id)) return;
      if(iitm.size){
        if(iitm.size.constructor===String){
          iitm.size = iitm.size.split('*');
        }
      }else{
        iitm.size = [120, 45];
      }
      nodes.map((iimm)=>{
        if(iimm.size){
          if(iimm.size.constructor===String){
            iimm.size = iimm.size.split('*');
          }
        }else{
          iimm.size = [120, 45];
        }
        if(iimm.id!==iitm.id && iimm.y<=(iitm.y +iitm.size[1]) &&  (iimm.y+iimm.size[1])>=(iitm.y +iitm.size[1])  && iimm.x<=(iitm.x +iitm.size[0]) && (iimm.x+iimm.size[0])>=(iitm.x +iitm.size[0])){
          narr.push(iimm.id);
          iimm.x = this.nodeDistXNum(nodes,iimm.x,iimm.size[0]);
          iimm.y = this.nodeDistYNum(nodes,iimm.y,iimm.size[1]);
        }
      });
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
  }

  nodeDistXNum(nodes,num,size){
      const item = nodes.find((item)=>item.x===num);
      if(item){
        num = item.y+size+50;
        return this.nodeDistXNum(nodes,num,size);
      }
      return num;
  }

  nodeDistYNum(nodes,num,size){
    const item = nodes.find((item)=>item.y===num);
    if(item){
      num = item.x+size+50
      return this.nodeDistYNum(nodes,num,size);
    }
    return num;
}

  initShape(data) {
    if (data && data.nodes) {
      return {
        nodes: data.nodes.map(node => {
          return {
            type: getShapeName(node.clazz || 'userTask'),
            ...node,
          }
        }),
        edges: data.edges
      }
    }
    return data;
  }

  initEvents() {
    this.graph.on('afteritemselected', (items) => {
      if (items && items.length > 0) {
        let item = this.graph.findById(items[0]);
        if (!item) {
          item = this.getNodeInSubProcess(items[0])
        }
        this.setState({ selectedModel: { ...item.getModel() } });
      } else {
        this.setState({ selectedModel: this.state.processModel });
      }
    });
    const page = document.getElementById(this.containerID);
    const graph = this.graph;
    const height = this.props.height - 1;
    this.resizeFunc = () => {
      graph.changeSize(page.offsetWidth, height);
    };
    window.addEventListener("resize", this.resizeFunc);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunc);
    if (this.graph) {
      this.graph.getNodes().forEach(node => {
        node.getKeyShape().stopAnimate();
      });
    }
  }

  onItemCfgChange(key, value) {
    const items = this.graph.get('selectedItems');
    if (items && items.length > 0) {
      let item = this.graph.findById(items[0]);
      if (!item) {
        item = this.getNodeInSubProcess(items[0])
      }
      if (this.graph.executeCommand) {
        this.graph.executeCommand('update', {
          itemId: items[0],
          updateModel: { [key]: value }
        });
      } else {
        this.graph.updateItem(item, { [key]: value });
      }
      this.setState({ selectedModel: { ...item.getModel() } });
    } else {
      const canvasModel = { ...this.state.processModel, [key]: value };
      this.setState({ selectedModel: canvasModel });
      this.setState({ processModel: canvasModel });
    }
  }

  getNodeInSubProcess(itemId) {
    const subProcess = this.graph.find('node', (node) => {
      if (node.get('model')) {
        const clazz = node.get('model').clazz;
        if (clazz === 'subProcess') {
          const containerGroup = node.getContainer();
          const subGroup = containerGroup.subGroup;
          const item = subGroup.findById(itemId);
          return subGroup.contain(item);
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    if (subProcess) {
      const group = subProcess.getContainer();
      return group.getItem(subProcess, itemId);
    }
    return null;
  }

  render() {
    const height = this.props.height;
    const { isView, mode, users, groups, lang,style } = this.props;
    const { selectedModel, processModel, graph } = this.state;
    const { signalDefs, messageDefs } = processModel;
    const i18n = locale[lang.toLowerCase()];
    const readOnly = mode !== "edit";
    return (
      <LangContext.Provider value={{ i18n, lang,isView,containerID:this.containerID, }}>
        <div className={`${styles.root} yard-flow-for-ksy-cls`} style={Object.assign({},style || {})}>
          {!isView && <ToolbarPanel ref={this.toolbarRef} />}
          {this.props.children}
          {/* {!isView && <div ref={this.itemPanelRef}>{this.props.children}</div>} */}
          {/* { !isView && <ItemPanel ref={this.itemPanelRef} height={height}/> }
          <Flow ref={this.pageRef} height={height} isView={isView}/> */}
          {/* <div ref={this.pageRef} className={styles.canvasPanel} style={{height,width:isView?'100%':'calc(100% - 90px)',borderBottom:isView?0:null}}/> */}
          {/* { !isView && <DetailPanel ref={this.detailPanelRef}
                                    height={height}
                                    model={selectedModel}
                                    readOnly={readOnly}
                                    users={users}
                                    groups={groups}
                                    signalDefs={signalDefs}
                                    messageDefs={messageDefs}
                                    onChange={(key,val)=>{this.onItemCfgChange(key,val)}} />
          } */}
        </div>
      </LangContext.Provider>
    );
  }
}