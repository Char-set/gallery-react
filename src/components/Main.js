require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
let imagesDatas = require('../../data/imagesDatas.json');
// console.log(imagesDatas);
// 自执行函数，生成图片文件地址数据
(function genImageURL(imagesArr) {
    for (var i = 0, j = imagesArr.length; i < j; i++) {
        var temImageData = imagesArr[i];
        temImageData.imageUrl = require('../images/' + temImageData.fileName);
        imagesArr[i] = temImageData;
    }
    return imagesArr;
})(imagesDatas);

//获取区间内的一个随机值
function getRangeRandom(low, high){
    return Math.ceil(Math.random() * (high - low) + low);
}
//获取正负30度的一个随机数
function get30DegRandoe(){
    return Math.random() > 0.5 ? '' : '-' + Math.ceil(Math.random() * 30);
}
class ControllerNav extends React.Component {
    constructor (props) {
        super(props);
    }
    handlClick () {
        if(this.props.unitsItem.isCenter){
            this.props.inverse();
        } else{
            this.props.toCenter();
        }
        event.stopPropagation();
        event.preventDefault();
    }
    render () {
        var className = 'controller-units';
        if(this.props.unitsItem.isCenter){
            className += ' isCenter';
        }
        if(this.props.unitsItem.isInverse){
            className += ' isInverse';
        }
        return (
            <span className={className} onClick={() => this.handlClick()}> </span>
        )
    }
}
class ImgFigure extends React.Component {
    constructor (props) {
        super(props);
        // this.handlClick = this.handlClick.bind(this);
    }
    handlClick () {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        } else{
            this.props.toCenter();
        }
        event.stopPropagation();
        event.preventDefault();
    }
    render() {
        var styleObj = {};
        if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
        }
        if(this.props.arrange.rotate){
            ['Moz','Ms','Webkit',''].forEach((value) => {
                styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate +'deg)';
            })
        }
        if(this.props.arrange.isCenter){
            styleObj['zIndex'] = 11;
        }
        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' isInverse' : '';
        return (
            <figure className={imgFigureClassName} style={styleObj} ref={'img' + this.props.index} onClick={() => this.handlClick()}>
                <img src={this.props.data.imageUrl}
                    alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back">
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

class AppComponent extends React.Component {
     
    reRange (centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            controllerUnits = this.state.controllerUnits,
            constant = this.state.constant,
            centerPos = constant.centerPos,
            hPosRange = constant.hPosRange,
            vPosRange = constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
        //居中的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isInverse:false,
            isCenter:true
        };
        //上面的图片
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        imgsArrangeTopArr.forEach((value, index) => {
            imgsArrangeTopArr[index] = {
                pos : {
                    top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                    left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                },
                rotate:get30DegRandoe(),
                isInverse:false,
                isCenter:false
            }
        });

        //布局两侧图片信息
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2;i < j; i++){
            var hPosRangeLORX = null;
            if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
            } else{
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imgsArrangeArr[i] = {
                pos : {
                    top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                },
                rotate:get30DegRandoe(),
                isInverse:false,
                isCenter:false
            }
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex, 0 , imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0 , imgsArrangeCenterArr[0]);
        //初始化控制条的状态
        controllerUnits.forEach((value,index) => {
            controllerUnits[index] = {
                isCenter:false,
                isInverse:false
            };
        });
        controllerUnits[centerIndex].isCenter = true;
        this.setState({
            imgsArrangeArr:imgsArrangeArr,
            controllerUnits:controllerUnits
        });
    }
    inverseImg (index) {
         var imgsArrangeArr = this.state.imgsArrangeArr,
             controllerUnits = this.state.controllerUnits;
         imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
         controllerUnits[index].isInverse = !controllerUnits[index].isInverse;
         this.setState({
             imgsArrangeArr:imgsArrangeArr,
             controllerUnits:controllerUnits
         })
    }
    constructor (props) {
        super(props);
        this.state = {
            imgsArrangeArr:[],
            controllerUnits:[],
            constant : {
                centerPos:{
                    letf:0,
                    top:0
                },
                hPosRange:{
                    leftSecX:[0,0],
                    rightSecX:[0,0],
                    y:[0,0]
                },
                vPosRange:{
                    x:[0,0],
                    topY:[0,0]
                }
            }
        };
    }
    //组件加载后，计算图片的位置范围
    componentDidMount() {
        //首先拿到舞台大小
        var stageDom = this.refs.stage,
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        //拿到一个图片组件的大小
        var ImgFigureDom = this.refs.imgFigures0.refs.img0,
            imgH = ImgFigureDom.scrollHeight,
            imgW = ImgFigureDom.scrollWidth,
            halfImgH = Math.ceil(imgH / 2),
            halfImgW = Math.ceil(imgW / 2);
        var constant = this.state.constant;
        constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };
        constant.hPosRange.leftSecX[0] = -halfImgW;
        constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        constant.hPosRange.y[0] = -halfImgH;
        constant.hPosRange.y[1] = stageH - halfImgH;

        constant.vPosRange.topY[0] = -halfImgH;
        constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        constant.vPosRange.x[0] = halfStageW - imgW;
        constant.vPosRange.x[1] = halfStageW;
        this.reRange(getRangeRandom(0,this.state.imgsArrangeArr.length));
    }
    render() {
        var controllerUnits = [],
            imgFigures = [];
        imagesDatas.forEach(function(value,index){
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                }
            }
            if(!this.state.controllerUnits[index]){
                this.state.controllerUnits[index] = {
                    isCenter:false,
                    isInverse:false
                }
            }
            imgFigures.push(<ImgFigure data={value} key={index} index={index} toCenter={() => this.reRange(index)} inverse={() => this.inverseImg(index)}  ref={'imgFigures' + index} arrange = {this.state.imgsArrangeArr[index]}/>);
            controllerUnits.push(<ControllerNav unitsItem={this.state.controllerUnits[index]} toCenter={() => this.reRange(index)} inverse={() => this.inverseImg(index)}  key={index} />)
        }.bind(this))
        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
