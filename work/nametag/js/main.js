var view, ui, data, ta_names, class_name, car_name, car_tel, sel_ptype, bt_build, bt_print;

var buildCircleTag = function(cname) {
    var template = ''
        + '<div contenteditable="true" class="alias">%alias%</div>'
        + '<div contenteditable="true" class="name">%name%</div>'
        + '<div contenteditable="true" class="tel">%tel%</div>'
        + '<div contenteditable="true" class="cname">%cname%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        var el = document.createElement('div');
        el.className = 'circle';
        
        var html = template;
        html = html.replace('%alias%', p['차량']);
        html = html.replace('%name%', p['이름']);
        html = html.replace('%tel%', p['전화번호']);
        html = html.replace('%cname%', p['반']);
        
        el.innerHTML = html;
        if(p['이름'].length > 3) {
            el.querySelector('.name').style['font-size'] = '0.75cm';
        }
        view.appendChild(el);
    }    
};

var buildBagTag = function(cname) {
    var template = ''
        + '<img class="symbol" src="./img/%url%">'
        + '<div contenteditable="true" class="cname">%cname%</div>'
        + '<div contenteditable="true" class="name">%name%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'bag';
            
            var html = template;
            html = html.replace('%url%', cname + '.jpg');
            html = html.replace('%cname%', p['반']);
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '0.5cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildBagTag2023 = function(cname) {
    var template = ''
        + '<img class="symbol" src="./img/%url%">'
        + '<div contenteditable="true" class="cname">%cname%</div>'
        + '<div contenteditable="true" class="name">%name%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'bag2023';
            
            var html = template;
            html = html.replace('%url%', cname + '.jpg');
            html = html.replace('%cname%', p['반']);
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '0.5cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildShoeTag = function(cname) {
    var template = ''
        + '<div contenteditable="true" class="name">%name%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'shoe';
            
            var html = template;
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '1.5cm';
                el.querySelector('.name').style['padding-top'] = '0.4cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildLetterATag = function(cname) {
    var template = ''
        + '<div contenteditable="true" class="name">%name%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'letter_a';
            
            var html = template;
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '0.7cm';
                el.querySelector('.name').style['padding-top'] = '0.15cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildLetterBTag = function(cname) {
    var template = ''
        + '<div contenteditable="true" class="name">%name%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'letter_b';
            
            var html = template;
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '1.3cm';
                el.querySelector('.name').style['padding-top'] = '0.7cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildTowelTag = function(cname) {
    var template = ''
        + '<div contenteditable="true" class="name">%name%</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'towel';
            
            var html = template;
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '0.3cm';
                el.querySelector('.name').style['padding-top'] = '0.08cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildChildrenTag = function(cname) {
  for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'children';
            
            var html = `
                <div contenteditable="true" class="cname">${p['반']}</div>
                <!--<img class="symbol" src="./img/hanmi.png">-->
                <img class="new-symbol" src="./img/hanmi_logotype.png"">
                <div contenteditable="true" class="name">${p['이름']}</div>
                <div contenteditable="true" class="tel">975-6567</div>
            `.trim();
            //html = html.replace('%cname%', p['반']);
            //html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '1.7cm';
                el.querySelector('.name').style['padding-bottom'] = '0.35cm';
            }
            view.appendChild(el);    
        }
    }    
};

var buildParentTag = function(cname) {
    var template = ''
		+ '<img contenteditable="true" class="symbol" src="./img/hanmi_logotype.svg">'
        + '<div contenteditable="true" class="cname">%cname%</div>'
        + '<div contenteditable="true" class="name">%name%</div>'
        + '<div contenteditable="true" class="hbm">학부모</div>';
        
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        if(cname === p['반']) {
            var el = document.createElement('div');
            el.className = 'parent';
            
            var html = template;
            html = html.replace('%cname%', p['반']);
            html = html.replace('%name%', p['이름']);
            
            el.innerHTML = html;
            if(p['이름'].length > 3) {
                el.querySelector('.name').style['font-size'] = '1.7cm';
                el.querySelector('.name').style['padding-bottom'] = '0.35cm';
            }
            view.appendChild(el);    
        }
    }    
};

var doBuild = function() {
    view.innerHTML = '';

    var i;
    data = [];
    var cname = class_name.value;
    var names = ta_names.value.split(/[\s,]+/).map(x => x.trim()).filter(x => x.length > 0);
    
    for(i = 0; i < names.length; i++) {
        names[i] = names[i].trim();
    }
    
    for(i = 0; i < num_print.value; i++) {
        names.push('');
    }
    
    for(i = 0; i < names.length; i++) {
        var p = {
            '반': class_name.value,
            '이름': names[i],
            //'차량': car_name.value,
            //'전화번호': car_tel.value
        }
        data.push(p);
    }
    
    var ptype = sel_ptype.options[sel_ptype.options.selectedIndex].value;
    
    switch(ptype) {
        case '동그라미차량':
            buildCircleTag(cname); 
            break;
        case '가방라벨':
            buildBagTag(cname); 
            break;
        case '가방라벨2023':
            buildBagTag2023(cname); 
            break;
        case '신발가방장':
            buildShoeTag(cname); 
            break;
        case '편지함':
            buildLetterATag(cname); 
            break;
        case '편지통':
            buildLetterBTag(cname); 
            break;
        case '수건걸이':
            buildTowelTag(cname); 
            break;
        case '어린이명찰':
            buildChildrenTag(cname); 
            break;
        case '학부모명찰':
            buildParentTag(cname); 
            break;
    }   
};

var doPrint = function() {
    ui.style['position'] = 'fixed';
    ui.style['visibility'] = 'hidden';
    window.print();
    ui.style['visibility'] = 'visible';
    ui.style['position'] = '';
};

var init = function() {
    view = document.querySelector('#view');
    ui = document.querySelector('#ui');
    sel_ptype = document.querySelector('#ptype');
    class_name = document.querySelector('#class_name');
    car_name = document.querySelector('#car_name');
    car_tel = document.querySelector('#car_tel');
    bt_build = document.querySelector('#build');
    bt_print = document.querySelector('#print');
    ta_names = document.querySelector('#names');
    
    bt_print.onclick = doPrint;
    bt_build.onclick = doBuild;
};

window.onload = init;