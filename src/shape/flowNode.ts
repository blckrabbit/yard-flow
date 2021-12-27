import editorStyle from "../util/defaultStyle";

const taskDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 16,
    height: 16,
    left: 15,
    top: 0,
  },
  style:{
    ...editorStyle.nodeStyle,
    fill: '#fff',
    stroke:'#e0e0e0',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#95D6FB',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    }
  }
};

const gatewayDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 2,
    top: 2,
  },
  style:{
    ...editorStyle.nodeStyle,
    fill: '#E8FEFA',
    stroke:'#13C2C2',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#8CE8DE',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    }
  }
};

const startDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6,
  },
  style:{
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke:'#FA8C16',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    }
  }
};

const endDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 18,
    height: 18,
    left: 6,
    top: 6,
  },
  style:{
    ...editorStyle.nodeStyle,
    fill: '#EFF7E8',
    stroke:'#F5222D',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#CFD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    }
  }
};

const catchDefaultOptions = {
  icon: null,
  iconStyle: {
    width: 20,
    height: 20,
    left: -10,
    top: -8,
  },
  style:{
    ...editorStyle.nodeStyle,
    fill: '#FEF7E8',
    stroke:'#FA8C16',
    cursor: 'default',
  },
  stateStyles: {
    selected: {
      fill: '#FCD49A',
    },
    hover: {
      cursor: editorStyle.cursor.hoverNode,
    }
  }
};

export default function(G6) {
  G6.registerNode('task-node', {
    shapeType: 'rect',
    options:{
      ...taskDefaultOptions
    },
    getShapeStyle(cfg) {
      if(cfg.size && (cfg.size.indexOf('*')>0 || cfg.size.constructor===Array)){
        if(cfg.size.indexOf('*')>0){
          cfg.size =Array.from(Int16Array.from(cfg.size.split('*')));
        }
      }else{
        cfg.size = [120, 45];
      }
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        ...this.options.style,
      };
      return style;
    }
  }, 'base-node');
  G6.registerNode('gateway-node', {
    shapeType: 'path',
    labelPosition: 'bottom',
    options:{
      ...gatewayDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [40, 40];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const gap = 4;
      const style = {
        path: [
          ['M', 0 - gap, 0 - height / 2 + gap],
          ['Q', 0, 0 - height / 2, gap, 0 - height / 2 + gap],
          ['L', width / 2 - gap, 0 - gap],
          ['Q', width / 2, 0, width / 2 - gap, gap],
          ['L', gap, height / 2 - gap],
          ['Q', 0, height / 2, 0 - gap, height / 2 - gap],
          ['L', -width / 2 + gap, gap],
          ['Q', -width / 2, 0, -width / 2 + gap, 0 - gap],
          ['Z']
        ],
        ...this.options.style,
      };
      return style;
    },
  }, 'base-node');
  G6.registerNode('exclusive-gateway-node', {
    afterDraw(cfg, group) {
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', -8, -8],
            ['L', 8, 8],
            ['Z'],
            ['M', 8, -8],
            ['L', -8, 8],
            ['Z']
          ],
          lineWidth: 2,
          stroke: this.options.style.stroke,
        }
      });
      this.runAnimate(cfg,group);
    },
  }, 'gateway-node');
  G6.registerNode('parallel-gateway-node', {
    afterDraw(cfg, group) {
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', 0, -10],
            ['L', 0, 10],
            ['Z'],
            ['M', -10, 0],
            ['L', 10, 0],
            ['Z']
          ],
          lineWidth: 2,
          stroke: this.options.style.stroke,
        }
      });
      this.runAnimate(cfg,group);
    },
  }, 'gateway-node');
  G6.registerNode('inclusive-gateway-node', {
    afterDraw(cfg, group) {
      group.icon = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: 10,
          lineWidth: 2,
          stroke: this.options.style.stroke,
        }
      });
      this.runAnimate(cfg,group);
    },
  }, 'gateway-node');
  G6.registerNode('start-node', {
    shapeType: 'circle',
    labelPosition: 'bottom',
    options: {
      ...startDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [30, 30];
      const width = cfg.size[0];
      const style = {
        x: 0,
        y: 0,
        r: width / 2,
        ...this.options.style,
      };
      return style;
    },
    afterDraw(cfg, group) {
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', -4 , -6],
            ['L', 6, 0],
            ['L', -4, 6],
            ['Z'] // close
          ],
          fill: this.options.style.stroke,
          stroke: this.options.style.stroke,
        },
        draggable: true,
      });
    },
    getAnchorPoints() {
      return [
        // [0.5, 0], // top
        [1, 0.5], // right
        // [0.5, 1], // bottom
      ]
    }
  }, 'base-node');
  G6.registerNode('end-node', {
    shapeType: 'circle',
    labelPosition: 'bottom',
    options: {
      ...endDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [30, 30];
      const width = cfg.size[0];
      const style = {
        x: 0,
        y: 0,
        r: width / 2,
        ...this.options.style,
      };
      return style;
    },
    afterDraw(cfg, group) {
      group.icon = group.addShape('path', {
        attrs: {
          path: [
            ['M', -4 , -4],
            ['L', 4, -4],
            ['L', 4, 4],
            ['L', -4, 4],
            ['Z'] // close
          ],
          fill: this.options.style.stroke,
          stroke: this.options.style.stroke,
        },
        draggable: true,
      });
    },
    getAnchorPoints() {
      return [
        // [0.5, 0], // top
        // [0.5, 1], // bottom
        [0, 0.5], // left
      ]
    }
  }, 'base-node');
  G6.registerNode('catch-node', {
    shapeType: 'path',
    labelPosition: 'bottom',
    options: {
      ...catchDefaultOptions
    },
    getShapeStyle(cfg) {
      cfg.size = [50, 30];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        path: [
          ['M', 0 , -height/3],
          ['L', width/2, -height/3],
          ['L', 0, height/3*2],
          ['L', -width/2, -height/3],
          ['Z'] // close
        ],
        ...this.options.style,
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [0.5, 0], // top
        [0.8, 0.38], // right
        [0.5, 1], // bottom
        [0.2, 0.38], // left
      ]
    }
  }, 'base-node');
  G6.registerNode('user-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowright.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowright.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowrightselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');
  G6.registerNode('script-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowleft.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowleft.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowleftselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');

  G6.registerNode('level-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowleft.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowleft.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowleftselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');

  G6.registerNode('other-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowleft.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowleft.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowleftselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');


  G6.registerNode('set-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowset.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowset.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowsetselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');


  G6.registerNode('join-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowjoin.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowjoin.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowjoinselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');


  G6.registerNode('filter-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowfilter.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowfilter.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowfilterselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');


  G6.registerNode('group-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowgroup.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowgroup.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowgroupselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');

  G6.registerNode('full-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/flowfull.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowfull.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
          labelFill:'#ffffff',
          icon:'flowfullselect.svg'
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');


  G6.registerNode('java-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/icon_java.svg'),
      style: {
        fill: '#FFF1F0',
        stroke: '#FF4D4F',
        labelFill:'#000000',
        icon:'flowright.svg'
      },
      stateStyles: {
        selected: {
          fill: '#FFCCC7',
        },
      }
    }),
  }, 'task-node');
  G6.registerNode('mail-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/icon_mail.svg'),
      style: {
        fill: '#F6FFED',
        stroke: '#73D13D',
        labelFill:'#000000',
        icon:'flowright.svg'
      },
      stateStyles: {
        selected: {
          fill: '#D9F7BE',
        },
      }
    }),
  }, 'task-node');
  G6.registerNode('receive-task-node', {
    options: G6.Util.deepMix({},taskDefaultOptions,{
      icon: require('../assets/icons/flow/icon_receive.svg'),
      style: {
        fill: '#fff',
        stroke: '#e0e0e0',
        labelFill:'#000000',
        icon:'flowright.svg'
      },
      stateStyles: {
        selected: {
          fill: '#95D6FB',
        },
        hover: {
          fill:'#f6f6f6'
        }
      }
    }),
  }, 'task-node');
  G6.registerNode('timer-start-node', {
    options: G6.Util.deepMix({},startDefaultOptions,{icon: require('../assets/icons/flow/icon_timer.svg')}),
    afterDraw(cfg, group) { this.runAnimate(cfg,group) },
  }, 'start-node');
  G6.registerNode('message-start-node', {
    options: G6.Util.deepMix({},startDefaultOptions,{icon: require('../assets/icons/flow/icon_message.svg')}),
    afterDraw(cfg, group) { this.runAnimate(cfg,group) },
  }, 'start-node');
  G6.registerNode('signal-start-node', {
    options: G6.Util.deepMix({},startDefaultOptions,{icon: require('../assets/icons/flow/icon_signal.svg')}),
    afterDraw(cfg, group) { this.runAnimate(cfg,group) },
  }, 'start-node');
  G6.registerNode('timer-catch-node', {
    options: G6.Util.deepMix({},catchDefaultOptions,{icon: require('../assets/icons/flow/icon_timer.svg')}),
  }, 'catch-node');
  G6.registerNode('signal-catch-node', {
    options: G6.Util.deepMix({},catchDefaultOptions,{icon: require('../assets/icons/flow/icon_signal.svg')}),
  }, 'catch-node');
  G6.registerNode('message-catch-node', {
    options: G6.Util.deepMix({},catchDefaultOptions,{icon: require('../assets/icons/flow/icon_message.svg')}),
  }, 'catch-node');
}
