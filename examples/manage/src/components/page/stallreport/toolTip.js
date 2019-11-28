import { template, templateSettings } from 'lodash';

const formatNumber = num => {
  if (!num) return;
  return num.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
};

const toolTip = {
  getTemplate({ title, items }) {
    const style = this.getStyle();
    const origin = items[0].point._origin;
    // return `<div  class="g2-tooltip">{{user}} !${style}</div>`
    const html = '<div class="g2-tooltip">';
    const titleDom = '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' + title + '</div>';
    var listDom = '<ul class="g2-tooltip-list">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      // console.log('item: ', item)
      var key = origin['data_' + i + '_indexDimension'];
      var dayBasis = origin['data_' + key + '_dayBasis'];
      var arrow = dayBasis > 0 ? 'g2-tooltip-icon-up' : 'g2-tooltip-icon-down';
      var itemDom =
        '' +
        '<li data-index={index}>' +
        '<span style="background-color:' +
        item.color +
        ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
        '<span class="g2-tooltip-title">' +
        item.name +
        '</span>' +
        '<span class="g2-tooltip-value">' +
        formatNumber(item.value) +
        '</span>' +
        '<span class="g2-tooltip-basis" style="display: ' +
        (items.length == 1 ? 'none' : '') +
        '">' +
        '<i class="g2-tooltip-icon ' +
        arrow +
        '" style="display: ' +
        (dayBasis == 0 || dayBasis == '/' ? 'none' : '') +
        ';"></i> ' +
        (dayBasis == '/' ? '-' : Math.abs(dayBasis) + '%') +
        '</span>' +
        '</li>';
      listDom += itemDom;
    }
    listDom += '</ul>';
    return html + titleDom + listDom + style + '</div>';
  },
  getStyle() {
    return `
            <style>
                ._toolTip{
                    position: absolute;
                    color: red;
                }
                #v-container {
                    background-color: #ebf0f0
                }
            
                .g2-tooltip {
                    position: absolute;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 3px;
                    color: rgb(87, 87, 87);
                    font-size: 12px;
                    line-height: 20px;
                    padding: 10px 10px 6px 10px;
                    box-shadow: 0px 0px 10px #aeaeae;
                }
                
                .g2-tooltip-list {
                    margin: 0;
                    padding: 0;
                    list-style-type: none;
                }
                
                .g2-tooltip-title{
                    width: 120px;
                    vertical-align: middle;
                }
                
                .g2-tooltip-value {
                    margin-left: 30px;
                    display: inline;
                    vertical-align: middle;
                }
                
                .g2-tooltip-icon {
                    width: 6px;
                    height: 12px;
                    background-size: cover;
                    display: inline-block;
                    
                }
                
                .g2-tooltip-icon-up {
                    background-image: url('https://pic6.zhuanstatic.com/zhuanzh/n_v21b1b79f4bb9145e096a20f22dbaac946.png');
                } 
                
                .g2-tooltip-icon-down {
                    -webkit-transform: rotateX(180deg);
                    background-image: url('https://pic6.zhuanstatic.com/zhuanzh/n_v23d06419d59a049b9a3c58c7df840a3f6.png');
                }
                
                .g2-tooltip-basis {
                    margin-left: 30px;
                    display: inline;
                    float: right;
                    vertical-align: middle;
                }
            </style>
        `;
  },
  launch({ title, items }) {
    // console.log('items: ', items)
    templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    const temp = this.getTemplate({ title, items });
    const compiled = template(temp);
    return compiled({ user: 'mustache' });
  },
};

export default toolTip;
