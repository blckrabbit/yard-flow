import React, { forwardRef, RefAttributes, useContext, useEffect,createRef } from 'react';
import styles from "./index.less";
import LangContext from "../../util/context";
// import Item from './Item'
import { guid } from '../../util/utils'

// export interface ItemPanelProps {
//   height:number;
//   children:any;
// }
const ID = `flow-node-${guid()}-layout`;
const ItemPanel = forwardRef<any, any>((props, ref:any) => {
     const { height, children,style } = props;
     const { i18n } = useContext(LangContext);
     useEffect(()=>{
          (window as any).cb.events.init('__showItemPanel', params => { 
               (window as any).cb.events.trigger('showItemPanel',ID);
          });
     },[])
     return (
          <div ref={ref} id={ID} className={`flow-node-item-x-d-c-cls ${styles.itemPanel}`} style={Object.assign({ height },style || {})}>
               {children}
               {/* <Collapse bordered={false} defaultActiveKey={["2"]}> */}
               {/* <Panel header={i18n['start']} key="1" forceRender>
          <Item className="item" model={"{clazz:'start',size:'30*30',label:''}"}>
               <img src={require('../assets/flow/start.svg')} style={{width: 42, height: 42}}/>
               {i18n['startEvent']}
          </Item>
          <Item className="item" model={"{clazz:'timerStart',size:'30*30',label:''}"}>
               <img src={require('../assets/flow/timer-start.svg')} style={{width: 42, height: 42}}/>
               {i18n['timerEvent']}
          </Item>
          <Item className="item" model={"{clazz:'messageStart',size:'30*30',label:''}"}>
               <img src={require('../assets/flow/message-start.svg')} style={{width: 42, height: 42}}/>
               {i18n['messageEvent']}
          </Item>
          <Item className="item" model={"{clazz:'signalStart',size:'30*30',label:''}"}>
               <img src={require('../assets/flow/signal-start.svg')} style={{width: 42, height: 42}}/>
               {i18n['signalEvent']}
          </Item>
        </Panel> */}
               {/* <Panel header={null} key="2" forceRender> */}
               {/* <Item className="item" model={"{clazz:'userTask',size:'80*44',label:'"+i18n['userTask']+"'}"}>
               <img data-item={"{clazz:'messageCatch',size:'50*30',label:''}"} src={require('../assets/flow/user-task.svg')} style={{width: 80, height: 44}}/>
               <div>{i18n['userTask']}</div>
          </Item>
          <Item className="item" model={"{clazz:'subProcess',size:'80*44',label:'"+i18n['subProcess']+"'}"}>
               <img src={require('../assets/flow/sub-process.svg')} style={{width: 80, height: 44}}/>
               <div>{i18n['subProcess']}</div>
          </Item>
          <Item className="item" model={"{clazz:'scriptTask',size:'80*44',label:'"+i18n['scriptTask']+"'}"}>
               <img src={require('../assets/flow/script-task.svg')} style={{width: 80, height: 44}}/>
               <div>{i18n['scriptTask']}</div>
          </Item>
          <Item className="item" model={"{clazz:'javaTask',size:'80*44',label:'"+i18n['javaTask']+"'}"}>
               <img src={require('../assets/flow/java-task.svg')} style={{width: 80, height: 44}}/>
               <div>{i18n['javaTask']}</div>
          </Item>
          <Item className="item" model={"{clazz:'mailTask',size:'80*44',label:'"+i18n['mailTask']+"'}"}>
               <img data-item={"{clazz:'mailTask',size:'80*44',label:'"+i18n['mailTask']+"'}"}
                    src={require('../assets/flow/mail-task.svg')} style={{width: 80, height: 44}}/>
               <div>{i18n['mailTask']}</div>
          </Item>
          <Item className="item" model={"{clazz:'receiveTask',size:'80*44',label:'"+i18n['receiveTask']+"'}"}>
               <img src={require('../assets/flow/receive-task.svg')} style={{width: 80, height: 44}}/>
               <div>{i18n['receiveTask']}</div>
          </Item> */}
               {/* </Panel> */}
               {/* <Panel header={i18n['gateway']} key="3" forceRender>
          <img data-item="{clazz:'exclusiveGateway',size:'40*40',label:''}"
               src={require('../assets/flow/exclusive-gateway.svg')} style={{width: 48, height: 48}}/>
          <div>{i18n['exclusiveGateway']}</div>
          <img data-item="{clazz:'parallelGateway',size:'40*40',label:''}"
               src={require('../assets/flow/parallel-gateway.svg')} style={{width: 48, height: 48}}/>
          <div>{i18n['parallelGateway']}</div>
          <img data-item="{clazz:'inclusiveGateway',size:'40*40',label:''}"
               src={require('../assets/flow/inclusive-gateway.svg')} style={{width: 48, height: 48}}/>
          <div>{i18n['inclusiveGateway']}</div>
        </Panel>
        <Panel header={i18n['catch']} key="4" forceRender>
          <img data-item={"{clazz:'timerCatch',size:'50*30',label:''}"}
               src={require('../assets/flow/timer-catch.svg')} style={{width: 58, height: 38}}/>
          <div>{i18n['timerEvent']}</div>
          <img data-item={"{clazz:'messageCatch',size:'50*30',label:''}"}
               src={require('../assets/flow/message-catch.svg')} style={{width: 58, height: 38}}/>
          <div>{i18n['messageEvent']}</div>
          <img data-item={"{clazz:'signalCatch',size:'50*30',label:''}"}
               src={require('../assets/flow/signal-catch.svg')} style={{width: 58, height: 38}}/>
          <div>{i18n['signalEvent']}</div>
        </Panel>
        <Panel header={i18n['end']} key="5" forceRender>
          <img data-item={"{clazz:'end',size:'30*30',label:''}"}
               src={require('../assets/flow/end.svg')} style={{width: 42, height: 42}}/>
          <div>{i18n['endEvent']}</div>
        </Panel> */}
               {/* </Collapse> */}
          </div>
     )
});

export default ItemPanel;
