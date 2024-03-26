// 21130604_TranMinhTuong_0847881229_DH21DTD

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let ballRadius = 10;
// vi tri ban dau 
let x = canvas.width/2;
let y = canvas.height - 30;
// toc do di cua ball
let dx = 1; 
let dy = -1;
// Kích thước và vị trí ban đầu của thanh paddle
let paddleHeight = 12;
let paddleWidth = 102; 
// vi tri thanh paddle
let paddleX = (canvas.width-paddleWidth)/2;
// trang thai phim
let rightPressed=false;
let leftPressed=false;
//so hang, so cot
let brickRowCount = 0;
let brickColumnCount = 8;
//kich thuoc cua brick
let brickWidth = 72;
let brickHeight = 24;
let brickPadding = 12;
// khoảng cách so với biên top và left 
let brickOffsetTop = 32;
let brickOffsetLeft = 32;

let score = 0;
let level = 1;
let lives = 3;
let isGamePaused = false;
let isGameStarted = false;
let bricks = [];

// them xu kien xu li phim
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener('keydown', function(event) {
    if (event.key === ' ') { // phim space
        // neu game dang dung thi resume, con khong thi pause lai
        if (isGamePaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
});
document.addEventListener('keydown', function(event) {
    if (event.key === ' ' && !isGameStarted) { // phim space va game chua bat dau thi goi funtion startgame va set trang thai thanh true.
        startGame(); 
        isGameStarted = true;
    }
});

// function mouseMoveHandler(e) {
//     var relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width) {
//         paddleX = relativeX - paddleWidth/2;
//     }
// }


// cac funtion di chuyen bang ban phim
function keyDownHandler(e){
    if(e.keyCode === 39){
        rightPressed = true;
    }
    else if (e.keyCode === 37){
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.keyCode === 39){
        rightPressed = false;
    }
    else if (e.keyCode === 37){
        leftPressed = false;
    }
}
// Khởi tạo mảng bricks ban dau và thiết lập các thuộc tính hard, hitCount ( so lan cham), unbreakable, reward, penalty
function initializeBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            // Đặt giá trị của thuộc tính unbreakable là false cho các viên gạch bình thường
            bricks[c][r] = { x: 0, y: 0, status: 1, hard: false, hitCount: 0, unbreakable: false, reward: false, penalty: false} ;
        }
    }
    // khi can tao cac brick o level1 thi dung
    //  addUnbreakableBricks();
    //  addHardBricks();
    // addRewardBricks;   
}

// brick cung hon binh thuong
function addHardBricks() {
    switch (level) {
        case 2:
            bricks[0][0].hard = true;
            bricks[7][0].hard = true;
            bricks[3][0].hard = true;
            bricks[4][0].hard = true;
            bricks[2][1].hard = true;
            bricks[5][1].hard = true;           
            break;
        case 3:
            bricks[0][1].hard = true;
            bricks[7][1].hard = true;
            bricks[0][2].hard = true;
            bricks[7][2].hard = true;
            bricks[2][2].hard = true;
            bricks[5][2].hard = true;
            break;  
        case 4:
            bricks[3][0].hard = true;
            bricks[4][0].hard = true;
            bricks[3][3].hard = true;
            bricks[4][3].hard = true;
            bricks[2][1].hard = true;
            bricks[2][2].hard = true;
            bricks[5][1].hard = true;
            bricks[5][2].hard = true;
            break;
        case 5:
            bricks[2][0].hard = true;
            bricks[5][0].hard = true;
            bricks[0][1].hard = true;
            bricks[1][1].hard = true;
            bricks[6][1].hard = true;
            bricks[7][1].hard = true;
            bricks[3][2].hard = true;
            bricks[4][2].hard = true;            
            break;
        case 6:
            bricks[0][4].hard = true;
            bricks[2][1].hard = true;
            bricks[2][2].hard = true;
            bricks[2][4].hard = true;
            bricks[3][3].hard = true;
            bricks[4][3].hard = true;
            bricks[5][1].hard = true;
            bricks[5][2].hard = true;
            bricks[5][4].hard = true;
            bricks[7][4].hard = true;          
            break;
        default:
            break;
    }
}
// brick khong the pha vo
function addUnbreakableBricks() {
    switch (level) {
        case 5:
            bricks[0][4].unbreakable = true;
            bricks[1][4].unbreakable = true;
            bricks[3][4].unbreakable = true;
            bricks[4][4].unbreakable = true;
            bricks[6][4].unbreakable = true;
            bricks[7][4].unbreakable = true;
            bricks[2][2].unbreakable = true;
            bricks[5][2].unbreakable = true;
            break;
        case 6:
            bricks[0][0].unbreakable = true;
            bricks[1][0].unbreakable = true;
            bricks[6][0].unbreakable = true;
            bricks[7][0].unbreakable = true;
            bricks[1][2].unbreakable = true;
            bricks[3][2].unbreakable = true;
            bricks[4][2].unbreakable = true;
            bricks[6][2].unbreakable = true;
            bricks[2][3].unbreakable = true;
            bricks[5][3].unbreakable = true;
            bricks[0][5].unbreakable = true;
            bricks[3][5].unbreakable = true;
            bricks[4][5].unbreakable = true;
            bricks[7][5].unbreakable = true;
            break;
        default:
            break;
    }
}
// brick thuong?
function addRewardBricks() {
    switch (level) {
        case 3:
            bricks[1][1].reward = true;
            bricks[3][1].reward = true;
            bricks[4][1].reward = true;
            bricks[6][1].reward = true;
            bricks[0][0].reward = true;
            bricks[7][0].reward = true;
            bricks[4][0].reward = true;
            bricks[3][0].reward = true;
            bricks[1][0].reward = true;
            bricks[6][0].reward = true;
            break;
        case 4:
            bricks[5][0].reward = true;
            bricks[6][1].reward = true;
            bricks[7][2].reward = true;
            bricks[6][3].reward = true;
            bricks[2][0].reward = true;
            bricks[1][1].reward = true;
            bricks[0][2].reward = true;
            bricks[1][3].reward = true;
            break;
        case 5:
            bricks[0][3].reward = true;
            bricks[1][2].reward = true;
            bricks[2][1].reward = true;
            bricks[3][0].reward = true;
            bricks[4][0].reward = true;
            bricks[5][1].reward = true;
            bricks[6][2].reward = true;
            bricks[7][3].reward = true;
            break;
        case 6:
            bricks[0][1].reward = true;
            bricks[1][4].reward = true;
            bricks[2][0].reward = true;
            bricks[3][5].reward = true;
            bricks[4][5].reward = true;
            bricks[5][0].reward = true;
            bricks[6][4].reward = true;
            bricks[7][1].reward = true;
            break;
        default:
            break;
    }
}
//brick phat
function addPenaltyBricks() {
    switch (level) {
        case 4:
            bricks[1][0].penalty = true;
            bricks[0][1].penalty = true;
            bricks[1][2].penalty = true;
            bricks[2][3].penalty = true;
            bricks[6][0].penalty = true;
            bricks[7][1].penalty = true;
            bricks[6][2].penalty = true;
            bricks[5][3].penalty = true;
            break;
        case 5:
            bricks[0][2].penalty = true;
            bricks[1][3].penalty = true;
            bricks[2][3].penalty = true;
            bricks[3][1].penalty = true;
            bricks[4][1].penalty = true;
            bricks[5][3].penalty = true;
            bricks[6][3].penalty = true;
            bricks[7][2].penalty = true;
            break;
        case 6:
            bricks[0][3].penalty = true;
            bricks[1][1].penalty = true;
            bricks[1][5].penalty = true;
            bricks[3][1].penalty = true;
            bricks[4][1].penalty = true;
            bricks[6][1].penalty = true;
            bricks[6][5].penalty = true;
            bricks[7][3].penalty = true;
            break;
        default:
            break;
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2); // vẽ ở vị trí x,y bán hình ballRadius
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight); // vi tri paddleX,canvas.height-paddleHeight và kích thước ,paddleWidth,paddleHeight
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                /* nếu status's brick = 1 nghĩa là bắt đầu vẽ brick
                    tính brickX ( tọa độ x của viên gạch) với c là index cột. 
                    vd: vẽ viên gạch đầu tiên width 72 height 24 padding 12 brickOffsetLeft, brickOffsetTop 32 thì tọa độ vẽ là (32, 32 )
                */
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                brick.x = brickX;
                brick.y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight); // vẽ hcm bắt đầu ở đoạn độ (32, 32) với kich thước (72 24)
                if (brick.unbreakable) {
                    ctx.fillStyle = "#808080"; // xam
                } else if (brick.hard) {
                    ctx.fillStyle = "#FF0000"; // do 
                } else if (brick.reward) {
                    ctx.fillStyle = "#D5DB2D"; // vang
                } else if (brick.penalty) {
                    ctx.fillStyle = "#08DB28"; // xanh la
                } else {
                    ctx.fillStyle = "#0095DD"; // xanh duong
                }
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font = '20px monospace';
    ctx.fillStyle = 'brown';
    ctx.fillText('Score: '+ score, 60 , 20);
}

function collisionDetection() {
    let totalBricks = brickRowCount * brickColumnCount; // tổng số brick
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            // check sự va chạm giữa ball và brick
            if (brick.status === 1) {
                /* 
                 x + ballRadius > brick.x 
                 Cạnh phải nhất của ball > cạnh trái của bricks? . Nếu có ball đang chạm vào brick từ bên phải.
                 vd tọa độ brick.x của brick đầu tiên là 32, x ball là 30 thì x +ballRadius = 40 thì ball đang chạm vào brick từ bên phải
                
                 x - ballRadius < brick.x + brickWidth : trái ball < phải brick, chạm từ bên trái. 

                 y + ballRadius > brick.y : dưới ball > trên brick, chạm từ phía dưới 

                 y - ballRadius < brick.y + brickHeight: trên ball < dưới brick, chạm từ phía trên 
                */
                if (x + ballRadius > brick.x && x - ballRadius < brick.x + brickWidth && y + ballRadius > brick.y && y - ballRadius < brick.y + brickHeight) {
                    // nếu là unbreakable thì đổi hướng ball
                    if (brick.unbreakable) {
                        dy = -dy;
                    // nếu là hard thì set số lần chạm để phá vỡ
                    } else if (brick.hard) { 
                        brick.hitCount++; 
                        if (brick.hitCount >= 2) { 
                            brick.status = 0; 
                            score++;
                        }
                        dy = -dy; 
                    // nếu là reward thì xét các điều kiện phá vỡ, phần thưởng khi phá là score, paddlewwidth, speed
                    } else if (brick.reward) { 
                        brick.hitCount++; 
                        if (brick.hitCount >= 5) { 
                            brick.status = 0; 
                            score += 10; 
                            paddleWidth += 20;
                        }
                        dy = -dy;
                    
                    // nếu là penalty thì xét các điều kiện phá vỡ, hình phạt khi phá là score, paddlewwidth, speed
                    } else if (brick.penalty) { 
                        brick.hitCount++; 
                        if (brick.hitCount >= 5) { 
                            brick.status = 0;
                            score -= 5; 
                            paddleWidth -=20;
                        }
                        dy = -dy; 
                    // nếu là viên thường thì chỉ + điểm
                    } else { 
                        brick.status = 0;
                        score++; 
                        dy = -dy; 
                    }
                }
            }
        }
    }
    /* kiểm tra có hứng được ball hay không, nếu có thì đổi hướng bóng, nếu không thì bị giảm số lives ( mạng), khi lives=0 thì trò chơi kết thúc
        nếu tọa độ của ball > biên y canvas - ballRadius thì ball đang nằm ở biên của canvas, kiểm tra tiếp tục liệu paddle có đang ở đó không
        ( tọa độ x nằm giữa kích thước từ biên trái đến biên phải theo kích thước của paddle)
        nếu có thì đổi hướng ball đi lên, không thì -1 mạng ( lives) 
    */
    if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {

            lives--; 
            if (lives === 0) {
                alert('GAME OVER!! Thử lại...');
                document.location.reload();
            } else {
                // cập nhật lại vị trí ball 
                x = canvas.width / 2;
                y = canvas.height - 30;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    // đếm số lượng gạch tồn tại
    let remainingBricks = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // nếu còn viên gạch status 1 ( đang tồn tại) và viên gạch đó không phải là unbreakble( không đếm viên có thuộc tính unbreakable) thì tăng số brick còn tồn tại 
            if (bricks[c][r].status === 1 && !bricks[c][r].unbreakable) {
                remainingBricks++;
            }
        }
    }
    // kiem tra remainingBricks 
        if (remainingBricks === 0  ) {

        if (level === 6) {
            alert('Chức mừng! Bạn đã chiến thắng toàn bộ trò chơi!');
            level = 1;
            isGameStarted = false; 
        } else {
            alert('Chúc mừng! Bạn đã hoàn thành level ' + level + '!');
            level++;
            nextLevel();
        }
    }
}

function startGame() {
    nextLevel();
}
// thiet ke cac thuoc tinh cho cac level 
function nextLevel() {
    switch (level) {
        case 1:
            dx = 1;
            dy = -1;
            brickRowCount = 1;
            paddleWidth = 150;
            initializeBricks();
            break;
        case 2:
            dx = 1;
            dy = -1;
            brickRowCount = 2;
            paddleWidth = 150;
            initializeBricks();
            addHardBricks();
            break;
        case 3:
            dx = 1;
            dy = -1;
            brickRowCount = 3;
            paddleWidth = 150;
            initializeBricks();
            addHardBricks();
            addRewardBricks();
            // addPenaltyBricks();
            break;

        case 4:
              dx = 1;
              dy = -1;
            brickRowCount = 4;
            paddleWidth = 150;
            initializeBricks();
            addHardBricks();
           addRewardBricks();
           addPenaltyBricks();
            break;
        case 5:
              dx = 1;
              dy = -1;
            brickRowCount = 5;
            paddleWidth = 150;
            initializeBricks();
            addHardBricks();
           addRewardBricks();
           addPenaltyBricks();
           addUnbreakableBricks();

            break;
        case 6:
            dx = 1;
            dy = -1;
            brickRowCount = 6;
            paddleWidth = 150;
            initializeBricks();
            addHardBricks();
           addRewardBricks();
           addPenaltyBricks();
           addUnbreakableBricks();
            break;
        default:
            break;
    }

    // khoi tao lai vi tri ball
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
}
function drawLevel() {
    ctx.font = '20px Arial'; 
    ctx.fillStyle = 'black'; 
    ctx.fillText('Level: ' + level, canvas.width - 100, 20); 
}

function drawLives() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black'; 
    ctx.fillText('Lives: ' + lives, 200, 20);
}


function draw(){
    if (!isGameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Nhấn Space để bắt đầu trò chơi', canvas.width / 2, canvas.height / 2);
        return; // Kết thúc hàm draw ở đây nếu trò chơi chưa bắt đầu
    } else {
        if (!isGamePaused) {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        drawScore();
        drawBricks();
        drawBall();
        drawPaddle();
        drawLevel();
        collisionDetection();
        drawLives();
        // điều chỉnh hướng di chuyển của ball
        // 2 biên trái phải
        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        //biên trên 
        if(y + dy < ballRadius){
            dy = -dy;
        }
        // paddle hứng được ball 
        else if (y + dy > canvas.height-ballRadius){
            if(x > paddleX && x < paddleX + paddleWidth){
                dy=-dy;
            }
            else {
                alert('GAME OVER!! Thử lại..');
                document.location.reload();
            }
        }
        //di chuyển thanh padđle, nếu paddle chưa chạm biên thì cứ di chuyển sang trái hoặc phải 7dv     
        if(rightPressed && paddleX <canvas.width-paddleWidth){
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0){
            paddleX -= 7;
        }
        
        x +=dx; 
        y +=dy; 
            }
        }
}
function pauseGame() {
    isGamePaused = true;
}
function resumeGame() {
    isGamePaused = false;
}
//tan suat ve lai khung hinh. cang be cang nhanh 
setInterval(draw, 1) 