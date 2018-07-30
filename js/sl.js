/**
 * Created by liyanxiang on 2017/7/17.
 */
var jichuangDom = document.getElementById('jichuang');
var cailiaoDom = document.getElementById('cailiao');
var zhijingDom = document.getElementById('zhijing');
var changduDom = document.getElementById('changdu');
var submitButton = document.getElementById('submit');
var search = {
    jichuang: undefined,
    cailiao: undefined,
    zhijing: undefined,
    changdu: undefined
};
var JICHAUNG = ['机床1', '机床2', '机床3', '机床4', '机床5'];
var CAILIAO = ['材料1', '材料2', '材料3', '材料4'];
var ZHIJING = [17, 27, 37, 57, 77];
var CHANGDU = [100, 120, 150];

var random = new Array(300);

for (var i = 0; i < random.length; ++i) {
    random[i] = i;
}

var shuzu = [[300, 100, 1.2], [400, 120, 1.5], [500, 130, 1.7]];

submitButton.onclick = function (event) {
    event.preventDefault();
    search.jichuang = jichuangDom.value;
    search.cailiao = cailiaoDom.value;
    search.zhijing = zhijingDom.value;
    search.changdu = changduDom.value;
    console.log(search);
    if (isValid(search)) {
        if (search.changdu == 120) {
            var zhuansu =  shuzu[0][0];
            jinji = shuzu[0][1];
            qiexue = shuzu[0][2];
        } else if (search.changdu == 100) {
            zhuansu =  shuzu[1][0];
            jinji = shuzu[1][1];
            qiexue = shuzu[1][2];
        } else if (search.changdu == 150) {
            zhuansu =  shuzu[2][0];
            jinji = shuzu[2][1];
            qiexue = shuzu[2][2];
        }
        /*
         zhuansu = Math.random() * 300;
         jinji = Math.random() * 100;
         qiexue = Math.random();
         */
        document.getElementById('zhuansuDiv').innerHTML = '主轴转速: ' + zhuansu + 'r/min';
        document.getElementById('jinjiDiv').innerHTML = '进给速度: ' + jinji + 'mm/min';
        document.getElementById('qiexueDiv').innerHTML = '切削速度: ' + qiexue + 'mm';
    }
};

// 刀具直径[5, 80]，刀具长度[10， 100]
function isValid(search) {
    if (JICHAUNG.indexOf(search.jichuang) >= 0) {
        if (CAILIAO.indexOf(search.cailiao) >= 0) {
            if (search.zhijing < 5) {
                alert("输入刀具直径过小！");
                return false;
            } else if (search.zhijing > 80) {
                alert("输入刀具直径过大！");
                return false;
            } else {
                if (search.changdu < 10) {
                    alert("输入刀具长度过小！");
                    return false;
                } else if (search.zhijing > 100) {
                    alert("输入刀具长度过大！");
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            alert("输入材料型号错误！");
            return false;
        }
    } else {
        alert("输入机床型号错误！");
        return false;
    }
}
