import React, { forwardRef, useContext, useEffect,createRef,memo,useMemo } from 'react'
import G6 from '@antv/g6/lib';
import Edge from '@antv/g6/lib/item/edge';
import Node from '@antv/g6/lib/item/node';
import Command from './plugins/command'
import Toolbar from './plugins/toolbar'
import AddItemPanel from './plugins/addItemPanel'
import CanvasPanel from './plugins/canvasPanel'
import styles from './index.less';
import { guid } from './util/utils'
import LangContext from "./util/context";

export default memo((props:any) => {
    const { height,mode,data,style } = props;
    const {containerID,isView} = useContext(LangContext);
    useEffect(()=>{
      (window as any).cb.events.init('_fonCanvasClick',(data)=>{
        data && data[0] && props.onCanvasClick && props.onCanvasClick(data[0]);
      });

      (window as any).cb.events.init('_fonCanvasDrag',(data)=>{
        data && data[0] && props.onCanvasDrag && props.onCanvasDrag(data[0]);
      });
      (window as any).cb.events.init('_fonCanvasMouseMove',(data)=>{
        data && data[0] && props.onCanvasMouseMove && props.onCanvasMouseMove(data[0]);
      });
      
      (window as any).cb.events.init('_fonNodeClick',(data)=>{
        data && data[0] && props.onNodeClick && props.onNodeClick(data[0]);
      });

      (window as any).cb.events.init('_dragEndNode',(data)=>{
        data && data[0] && props.onDragEndNode && props.onDragEndNode(data[0]);
      });

      (window as any).cb.events.init('_graphCommand',(data)=>{
        data && data[0] && props.onGraphCommand && props.onGraphCommand(data[0]);
      });

      (window as any).cb.events.init('__initFlowPanel',(graph)=>{
        graph[0].on('afteradditem',(data)=>{
          const item = data.item;
          if(item.constructor===Edge){
            if(!(window as any).cb.isAddFlowItem) return;
            (window as any).cb.isAddFlowItem = undefined;
            data && props.onAfterConnect && props.onAfterConnect({...data,edge:item});
          }else if(item.constructor===Node){
            data && props.onAfterAddItem && props.onAfterAddItem(data);
          }
        });
        graph[0].on('beforeremoveitem',(data)=>{
          data && props.onBeforeRemoveItem && props.onBeforeRemoveItem(data);
        });
      });
      (window as any).cb.events.trigger('showQueryDrawer',data,containerID);
    },[])

    useEffect(()=>{
      (window as any).cb.events.trigger('__updateGraphData',data);
    },[data])

    // useEffect(()=>{
    //   (window as any).cb.events.trigger('__updateGraphSize',height);
    // },[height]);

    return <div id={containerID} className={styles.canvasPanel} style={Object.assign({ height, width: isView ? '100%' : 'calc(100% - 90px)', borderBottom: isView ? 0 : null },style || {})} />;
})