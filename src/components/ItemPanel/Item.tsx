import React from 'react';

export default (props) => {
    const { model, className,style } = props;
    return <div className={`flow-node-item-cls ${className}`} style={Object.assign({ },style || {})} data-item={model} draggable={true}>
        {props.children}
    </div>
}