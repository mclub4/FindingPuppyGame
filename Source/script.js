var failure = 0;
var enemy = 0;
var random = [];
var success = [];
var time = 0;
var start_time;
var tid1, tid2;
var stage = 0;
var table, weight, can_hint
var restart = false;

//Game Structure
function set(){
    stage ++;
    if(stage <=5){
        enemy = 7 + stage;
        time = 45 - stage*5;
        start_time = 12 - stage*2;
    }
    else{
        enemy = 12;
        time = 20;
        start_time = 1;
    }
    failure = 0;
    random = [];
    success = [];
    can_hint = false;
    var game_start = document.getElementById("game_start");
    game_start.style.visibility = "hidden";
    document.all.win_game.innerHTML = "게임이 진행중!";
    document.all.hint.innerHTML = "힌트 사용 가능!";
    createTable();
    randomimage();
    setbutton();
    tick();
    for (var i = 0; i < weight*8; i++){
        document.images[i].style.visibility = "visible";
        document.images[i].src = "img1.gif";
        document.images[i].border = 0;
        document.images[i].onclick = check_answer;
    }
}

function createTable(){
    if(stage != 1 || restart){
        restart = false;
        document.body.removeChild(table);
    } 
    table = document.createElement("table");
    document.body.appendChild(table);

    if(stage<=3) weight = 3;
    else if(stage<=7) weight = 4;
    else weight = 5;

    for (var i = 0; i < weight; i++){
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var j = 0; j < 8; j++){
            var td = document.createElement("td");
            tr.appendChild(td);
            var vt = document.createElement("img");
            td.appendChild(vt);
        }
    }
}

function tick(){
    tid1=setInterval('display()',500);
    tid2=setInterval('time_go()',1000);
}

//Game Menu
function display(){
    start_time --;
    for(var i = 0; i<random.length-2; i++){
        random[i].src = "img2.gif";
    }
    if(start_time < 0){
        for(var i = 0; i<random.length; i++){
            random[i].src = "img1.gif";
        }
        clearInterval(tid1);
    }
}

function time_go() {
    if(start_time<0){
        var msg = "남은 시간 : " + time;
        document.all.left_time.innerHTML = msg;		
        time--;					
        if (time < 0) {			
            game_over();
        }
    }	
}

function setbutton(){
    document.all.left_enemy.innerHTML= "남은 수 : " + enemy;
    document.all.failure.innerHTML= "실패 수 : " + failure;
    document.all.stage.innerHTML = "스테이지 : " + stage;
}

//Game Play
function randomimage(){
    for(var i = 0; i<enemy+2; i++){
        while(true){
            var n = Math.floor(Math.random() * (weight*8));
            if(!image_same(document.images[n], random)){
                random.push(document.images[n]);
                break;
            }
        }
    }
}

function image_same(n, array = []){
    for(var i = 0; i<array.length; i++){
        if(n == array[i]){
            return true;
        }
    }
    return false;
}

function check_answer(e){
    var failure_limit;
    if(stage<=7) failure_limit = 11 - stage;
    else failure_limit = 1;
    if(start_time<0 && failure<failure_limit && enemy>0){
        var obj = e.currentTarget;
        if(!image_same(obj, success)){
            if(obj == random[random.length-2] || (obj == random[random.length-1] && stage>7)){
                obj.src = "img3.gif";
                document.all.win_game.innerHTML = "폭탄 밟았네!";
                game_over();
            }
            else if(obj == random[random.length-1]){
                obj.src = "img4.gif";
                document.all.win_game.innerHTML = "위기는 기회로!";
                failure = 0;
                setbutton();
            }
            else if(image_same(obj, random)){
                enemy --;
                setbutton();
                obj.src = "img2.gif";
                success.push(obj);
                document.all.win_game.innerHTML = "오,정답!";
                if(enemy == 0){
                    forloser();
                    var game_start = document.getElementById("game_start");
                    game_start.style.visibility = "visible";
                    document.all.game_start.innerHTML = "다음 스테이지?";
                    document.all.win_game.innerHTML = "승리자!";
                    clearInterval(tid2);
                }
            }
            else{
                failure ++;
                setbutton();
                document.all.win_game.innerHTML = "아,틀렸어요!";
                if(failure >= failure_limit){
                    document.all.win_game.innerHTML = "패배자!";
                    game_over();
                }
            }
        }
    }
}

function game_over(){
    forloser();
    clearInterval(tid2);
    alert("게임 오버");
    var game_start = document.getElementById("game_start");
    game_start.style.visibility = "visible";
    document.all.game_start.innerHTML = "재시도?";
    stage = 0;
    restart = true;
}

function forloser(){
    for(var i = 0; i<random.length; i++){
        if(!image_same(random[i], success)){
            if(i==random.length-2 || (stage>7 && i==random.length-1)){
                random[i].src = "img3.gif";
                random[i].border = 5;
            }
            else if(i==random.length-1){
                random[i].src = "img4.gif";
                random[i].border = 5;

            }
            else{
                random[i].src = "img2.gif";
                random[i].border = 5;
            }
        }
    }
}

function hint(){
    if(start_time<0 && failure<100 && enemy>0 && !can_hint){
        for(var i = 0; i<random.length-2; i++){
            if(!image_same(random[i], success)){
                random[i].src = "img2.gif";
                success.push(random[i]);
                break;
            }
        }
        can_hint = true;
        enemy --;
        document.all.hint.innerHTML = "힌트 사용됨";
        setbutton();
        document.all.win_game.innerHTML = "오,정답!";
        if(enemy == 0){
            forloser();
            var game_start = document.getElementById("game_start");
            game_start.style.visibility = "visible";
            document.all.game_start.innerHTML = "다음 스테이지?";
            document.all.win_game.innerHTML = "승리자!";
            clearInterval(tid2);
        }
    }
}