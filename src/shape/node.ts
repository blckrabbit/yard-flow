import editorStyle from "../util/defaultStyle";
import Anchor from '../item/anchor';
import { ShapeOptions } from '@antv/g6/lib/interface/shape';

const dashArray = [
  [0,1],
  [0,2],
  [1,2],
  [0,1,1,2],
  [0,2,1,2],
  [1,2,1,2],
  [2,2,1,2],
  [3,2,1,2],
  [4,2,1,2]
];
const interval = 9;
const lineDash = [4, 2, 1, 2];
const nodeDefinition:ShapeOptions = {
  options:{
    icon: null,
    iconStyle: {
      width: 14,
      height: 14,
      left: 0,
      top: 0,
    },
    style:{
      fill: '#f9f9f9',
      stroke:'#bbb',
      cursor: 'default',
    },
    stateStyles: {
      selected: {
        fill: '#eee',
      },
      hover: {
        cursor: editorStyle.cursor.hoverNode,
      }
    }
  },
  drawLabel(cfg, group) {
      const labelCfg = cfg.labelCfg || {};
      const labelStyle = this.getLabelStyle(cfg, labelCfg, group);
      const label = group.addShape('text', {
        attrs: {...labelStyle,fill:this.options.style.labelFill,textAlign: 'center'},
        capture: true,
        draggable:true
      });
      // const labelBBox = label.getBBox();
      // const label = group.addShape('text',{
      //   className: 'edge-labelRect',
      //   attrs: {
      //     x:labelBBox.x-editorStyle.edgeLabelRectPadding/2,
      //     y:labelBBox.y-editorStyle.edgeLabelRectPadding/2,
      //     width: labelBBox.width+editorStyle.edgeLabelRectPadding,
      //     height: labelBBox.height+editorStyle.edgeLabelRectPadding,
      //     fill:'transparent',
      //     stroke:'transparent',
      //   }
      // });
      // group.toBack();
      // label.toFront();
      return label;
    },
  drawAnchor(group) {
    const bbox = group.get('children')[0].getBBox();
    this.getAnchorPoints().forEach((p, i) => {
      if(group.isNoDrag){
        if(p[0]===1) return;
      }else{
        if(p[0]===0) return;
      }
      const anchorContainer = group.addGroup();
      const anchor = new Anchor({
        group: anchorContainer,
        index: i,
        model:{
          style:{
              x: bbox.minX + bbox.width * p[0],
              y: bbox.minY + bbox.height * p[1]
            }
          }
        });
      group.anchorShapes.push(anchorContainer);
    });
  },
  initAnchor(group){
    group.anchorShapes = [];
    group.showAnchor = () => {
      this.drawAnchor(group);
    };
    group.getAllAnchors = () => {
      return group.anchorShapes.map(c => {
        c.filter(a => a.isAnchor)
      })
    };
    group.getAnchor = (i) => {
      return group.anchorShapes.filter(a => a.get('index') === i)
    };
    group.clearAnchor = () => {
      group.anchorShapes && group.anchorShapes.forEach(a => a.remove());
      group.anchorShapes = [];
    };
    group.clearHotpotActived = () => {
      group.anchorShapes && group.anchorShapes.forEach(a => {
        if (a.isAnchor)
          a.setHotspotActived(false);
      });
    };
  },
  drawShape(cfg, group) {
    const shapeType = this.shapeType;
    let style = this.getShapeStyle(cfg);
    const shape = group.addShape(shapeType, {
      attrs: {
        ...style,
      }
    });
    this.drawIcon(cfg,group);
    this.initAnchor(group);
    return shape;
  },
  drawIcon(cfg,group){
    let style = this.getShapeStyle(cfg);
    if(this.options.icon){
      let attrs = {
        x: style.x + this.options.iconStyle.left,
        y: style.y+14 + this.options.iconStyle.top,
        width: this.options.iconStyle.width,
        height: this.options.iconStyle.height,
      };
      if(this.shapeType === 'circle'){
        attrs = {
          x: style.x- style.r + this.options.iconStyle.left,
          y: style.y - style.r + this.options.iconStyle.top,
          width: this.options.iconStyle.width,
          height: this.options.iconStyle.height,
        }
      }else if(this.shapeType === 'path'){
        attrs = {
          x: this.options.iconStyle.left,
          y: this.options.iconStyle.top,
          width: this.options.iconStyle.width,
          height: this.options.iconStyle.height,
        }
      }
      group.icon = group.addShape('image', {
        attrs: {
          img:this.options.icon,
          ...attrs,
        },
        draggable: true,
      });
      if(cfg.hideIcon){
        group.icon.hide();
      }
    }
  },
  setState(name, value, item) {
    const group = item.getContainer();
    const rect = group.getChildByIndex(0);
    if (name === 'show-anchor') {
      if (value) {
        if(!item._cfg.selected)
          rect.attr('fill', this.options.stateStyles.hover.fill);
        (group as any).showAnchor();
      } else {
        if(!item._cfg.selected)
          rect.attr('fill', this.options.style.fill);
        (group as any).clearAnchor();
      }
    } else if (name === 'selected') {
      const text = group.getChildByIndex(2);
      const image:any = group.getChildByIndex(1);
      if (value) {
        item._cfg.selected=true;
        rect.attr('fill', this.options.stateStyles.selected.fill);
        if(text)
          text.attr('fill', this.options.stateStyles.selected.labelFill);
        if(image)
          image._setImage(require(`../assets/icons/flow/${this.options.stateStyles.selected.icon}`));
          // image.attr('img', require(`../assets/icons/flow/${this.options.stateStyles.selected.icon}`));
      } else {
        item._cfg.selected=undefined;
        rect.attr('fill', this.options.style.fill);
        if(text)
          text.attr('fill', this.options.style.labelFill);
        if(image)
          image._setImage(require(`../assets/icons/flow/${this.options.style.icon}`));
          // image.attr('img', require(`../assets/icons/flow/${this.options.style.icon}`));
      }
    } else if (name === 'hover') {
      const text = group.getChildByIndex(2);
      if (value) {
        rect.attr('cursor', this.options.stateStyles.hover.cursor);
        if(text)
          text.attr('cursor', this.options.stateStyles.hover.cursor);
      } else {
        rect.attr('cursor', this.options.style.cursor);
        if(text)
          text.attr('cursor', this.options.style.cursor);
      }
    }
    this.setCustomState(name, value, item);
  },
  setCustomState(name, value, item){

  },
  getAnchorPoints() {
    return [
      // [0.5, 0], // top
      [1, 0.5], // right
      // [0.5, 1], // bottom
      [0, 0.5], // left
    ]
  },
  runAnimate(cfg, group){
    if(cfg.active){
      let totalArray = [];
      let index = 0;
      const shape = group.getFirst();
      shape.animate(
        (ratio)=>{
          for (let i = 0; i < 9; i += interval) {
            totalArray = totalArray.concat(lineDash);
          }
          const cfg = {
            lineDash: dashArray[index].concat(totalArray)
          };
          index = (index + 1) % interval;
          return cfg;
        },
      {
        repeat: true,
        duration: 5000
      });
    }
  },
  afterDraw(cfg, group) {
    this.runAnimate(cfg,group);
  },
  afterUpdate(cfg, group) {
    const icon = group.get('group').icon;
    if(cfg.hideIcon && icon && icon.get('visible')){
      icon.hide();
    }else if(!cfg.hideIcon && icon && !icon.get('visible')){
      icon.show();
    }
  },
};
export default function(G6) {
  G6.registerNode('base-node', nodeDefinition, 'single-node');
}
