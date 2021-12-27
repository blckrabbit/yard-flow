import { deepMix, each } from '@antv/util';
import { createDom } from '@antv/dom-util';

class AddItemPanel {
  private readonly _cfgs: any;

  constructor(cfgs) {
    this._cfgs = deepMix(this.getDefaultCfg(), cfgs);
  }
  getDefaultCfg() {
    return { container: null };
  }

  get(key) {
    return this._cfgs[key];
  }
  set(key, val) {
    this._cfgs[key] = val;
  }

  initPlugin(graph) {
    const parentNode = this.get('container');
    const ghost = createDom('<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"' + ' style="opacity:0"/>');
    const children = parentNode.querySelectorAll('div > .flow-node-item-x-d-c-cls .flow-node-item-cls[data-item]');
    var userAgent = navigator.userAgent;
    each(children, (child, i) => {
      const addModel = (new Function("return " + child.getAttribute('data-item')))();
      let isdragging = false;
      child.addEventListener('dragstart', e => {
        isdragging = false;
        e.dataTransfer.setDragImage(ghost, 0, 0);
        graph.set('addNodeDragging', true);
        graph.set('addModel', addModel);
      });
      child.addEventListener('dragend', e => {
        if (userAgent.indexOf("Firefox") >= 0) {
          setInterval(()=>{
            console.log(window.event);
          },200)
          document.body.addEventListener('mousemove', (e) => {
            if (!isdragging) {
              isdragging = true;
              graph.emit('canvas:mouseup', e);
              graph.set('addNodeDragging', false);
              graph.set('addModel', null);
            }
          })
        } else {
          graph.emit('canvas:mouseup', e);
          graph.set('addNodeDragging', false);
          graph.set('addModel', null);
        }
      });
    })
  }

  destroy() {
    this.get('canvas').destroy();
    const container = this.get('container');
    container.parentNode.removeChild(container);
  }
}

export default AddItemPanel;
