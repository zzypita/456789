let backgroundImg;
let sprites = {
    idle: {
        img: null,
        width: 41.6,
        height: 99,
        frames: 12,
        frameRate: 4 // Adjust for desired idle speed
    },
    walk: {
        img: null,
        width: 82.6,
        height: 99,
        frames: 6,
        frameRate: 3 // Adjust for desired walk speed
    },
    jump: {
        img: null,
        width: 71.54,
        height: 136,
        frames: 11,
        frameRate: 3 // Adjust for desired jump speed
    }
};

let sprites2 = {
    idle: {
        img: null,
        width: 232 / 5,
        height: 101,
        frames: 5,
        frameRate: 4
    },
    walk: {
        img: null,
        width: 740 / 11,
        height: 95,
        frames: 11,
        frameRate: 3
    },
    jump: {
        img: null,
        width: 522 / 9,
        height: 105,
        frames: 9,
        frameRate: 3
    }
};

let character = {
    x: 200,
    y: 200,
    speedX: 7, // Reduced movement speed
    speedY: 0,
    gravity: 0.8,
    jumpForce: -15, // Increased jump force a bit
    isJumping: false,
    groundY: 300,
    currentFrame: 0,
    currentAction: 'idle',
    direction: 1,
    animationSpeed: 0
};

let character2 = {
    x: 600,
    y: 200,
    speedX: 3,
    speedY: 0,
    gravity: 0.8,
    jumpForce: -15,
    isJumping: false,
    groundY: 300,
    currentFrame: 0,
    currentAction: 'idle',
    direction: -1,
    animationSpeed: 0
};

function preload() {
    backgroundImg = loadImage('0.png');
    
    // 確保所有圖片都正確載入
    try {
        sprites.idle.img = loadImage('all.png');
        sprites.walk.img = loadImage('all3.png');
        sprites.jump.img = loadImage('all2.png');  // 先使用原有的跳躍圖片
        
        sprites2.idle.img = loadImage('WALKWALK.png');
        sprites2.walk.img = loadImage('RUNRUN.png');
        sprites2.jump.img = loadImage('ATTACK ATTACK.png');
    } catch (e) {
        console.error('圖片載入失敗:', e);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    character.groundY = height - 200;
    character2.groundY = height - 200;
    character.y = character.groundY;
    character2.y = character2.groundY;
}

function draw() {
    image(backgroundImg, 0, 0, width, height);

    updateCharacter(character);
    updateCharacter(character2);
    drawCharacter(character, sprites);
    drawCharacter(character2, sprites2);

    handleKeys();
}

function updateCharacter(char) {
    // 基本移動更新
    if (char.y < char.groundY || char.isJumping) {
        char.speedY += char.gravity;
        char.y += char.speedY;
    }

    // 著地檢測
    if (char.y >= char.groundY) {
        char.y = char.groundY;
        char.speedY = 0;
        char.isJumping = false;
        if (char.currentAction === 'jump') {
            char.currentAction = 'idle';
        }
    }
}

function drawCharacter(char, spriteSet) {
    let sprite = spriteSet[char.currentAction];
    if (!sprite || !sprite.img) {
        console.error('找不到精靈圖片:', char.currentAction);
        return;
    }

    try {
        push();
        translate(char.x + (char.direction === -1 ? sprite.width : 0), char.y);
        scale(char.direction, 1);
        
        // 確保圖片已經載入
        if (sprite.img.width > 0) {
            image(sprite.img,
                0, 0,
                sprite.width, sprite.height,
                char.currentFrame * sprite.width, 0,
                sprite.width, sprite.height
            );
        }
        
        pop();

        char.animationSpeed++;
        if (char.animationSpeed >= sprite.frameRate) {
            char.currentFrame = (char.currentFrame + 1) % sprite.frames;
            char.animationSpeed = 0;
        }
    } catch (e) {
        console.error('繪製角色時發生錯誤:', e);
    }
}

function handleKeys() {
    // 角色1控制
    if (keyIsDown(RIGHT_ARROW)) {
        character.x += character.speedX;
        if (!character.isJumping) character.currentAction = 'walk'; // Only walk if not jumping
        character.direction = 1;
    } else if (keyIsDown(LEFT_ARROW)) {
        character.x -= character.speedX;
        if (!character.isJumping) character.currentAction = 'walk'; // Only walk if not jumping
        character.direction = -1;
    } else if (!character.isJumping) { // Go back to idle only if not jumping
        character.currentAction = 'idle';
    }

    // 角色 2 控制
    if (keyIsDown(68)) { // D
        character2.x += character2.speedX;
        if (!character2.isJumping) character2.currentAction = 'walk';
        character2.direction = 1;
    } else if (keyIsDown(65)) { // A
        character2.x -= character2.speedX;
        if (!character2.isJumping) character2.currentAction = 'walk';
        character2.direction = -1;
    } else if (!character2.isJumping) {
        character2.currentAction = 'idle';
    }

    // 跳躍控制
    if (keyIsDown(UP_ARROW) && !character.isJumping) {
        character.speedY = character.jumpForce;
        character.isJumping = true;
        character.currentAction = 'jump';
    }

    if (keyIsDown(87) && !character2.isJumping) { // W
        character2.speedY = character2.jumpForce;
        character2.isJumping = true;
        character2.currentAction = 'jump';
    }

    
}