
let state = 'idle';
let inputChar = '';

let cursorVisible = true;
let lastBlink = 0;
const BLINK_INTERVAL = 530;

let t = 0;
const DURATION = 90;

const C_DARK = [44,  44,  44];
const C_PURP = [75, 0, 130];
const C_NAVY = [0,  0, 205];

const BARS = [
  { yRatio:0.46,  hRatio:0.008, xRatio:0.44, wRatio:0.55, color:C_DARK, speed:0.9,  delay:2  },
  { yRatio:0.76,  hRatio:0.006, xRatio:0.52, wRatio:0.47, color:C_DARK, speed:1.1,  delay:5  },
  { yRatio:0.53,  hRatio:0.038, xRatio:0.0,  wRatio:0.52, color:C_NAVY, speed:0.85, delay:8  },
  { yRatio:0.595, hRatio:0.05,  xRatio:0.05, wRatio:0.31, color:C_PURP, speed:0.95, delay:3  },
  { yRatio:0.595, hRatio:0.04,  xRatio:0.53, wRatio:0.25, color:C_PURP, speed:1.05, delay:6  },
  { yRatio:0.665, hRatio:0.065, xRatio:0.3,  wRatio:0.41, color:C_NAVY, speed:0.8,  delay:10 },
];

let qParticles = [];
let exParticles = [];
let menuSlide = 0;
let menuOpen = false;
let menuTarget = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  document.addEventListener('click', function(e) {
    if (state === 'animating') return;
    
    let panelW   = width * 0.28;
    let itemH    = height * 0.075;
    let bx       = width * 0.02;
    let by       = height * 0.92;
    let fs       = width * 0.018;

    // 좌측 하단 버튼 클릭
    if (e.clientX > bx && e.clientX < bx + fs * 8 &&
        e.clientY > by - fs * 2 && e.clientY < by + fs * 2) {
      menuOpen   = !menuOpen;
      menuTarget = menuOpen ? 1 : 0;
      return;
    }

    // 패널 안 맨 아래 버튼 클릭
    if (menuOpen) {
      let panelX = -panelW + menuSlide * panelW;
      if (e.clientX > panelX && e.clientX < panelX + panelW &&
          e.clientY > height - itemH) {
        menuOpen   = false;
        menuTarget = 0;
      }
    }

    if (menuOpen && menuSlide > 0.9) {
      let panelW  = width * 0.28;
      let panelX  = -panelW + menuSlide * panelW;
      let itemH   = height * 0.075;

      if (e.clientX > panelX && e.clientX < panelX + panelW) {
        let clickedY = e.clientY + menuScrollTarget;
        let itemIndex = Math.floor(clickedY / itemH);

        if (itemIndex >= 0 && itemIndex < MENU_ITEMS.length) {
          let punctuations = ['.','?','!',',','/','()','{}','[]','"',"'",'-',':','~','_','<>'];
          let punct = punctuations[itemIndex];

          if (punct === '()') inputChar = '(';
          else if (punct === '{}') inputChar = '{';
          else if (punct === '[]') inputChar = '[';
          else if (punct === '<>') inputChar = '<';
          else inputChar = punct;

          menuOpen   = false;
          menuTarget = 0;
          let pendingChar = inputChar;
          setTimeout(function() {
            inputChar = pendingChar;
            state = 'animating';
            t = 0;
          }, 450);
        }
      }
    }
  });
}

function draw() {
  background(250,250,248);

  if (state === 'idle') {
    drawIdleScreen();
  } else if (state === 'input') {
    drawInputScreen();
  } else if (state === 'animating') {
    if (inputChar === '.') drawPeriodAnim();
    else if (inputChar === '?') drawQuestionAnim();
    else if (inputChar === '!') drawExclamationAnim();
    else if (inputChar === ',') drawCommaAnim();
    else if (inputChar === '/') drawSlashAnim();
    else if (inputChar === ':') drawColonAnim();
    else if (inputChar === '"') drawQuoteAnim();
    else if (inputChar === "'") drawSingleQuoteAnim();
    else if (inputChar === '-') drawHyphenAnim();
    else if (inputChar === '<' || inputChar === '>') drawAngleAnim();
    else if (inputChar === '(' || inputChar === ')') drawParenAnim();
    else if (inputChar === '{' || inputChar === '}') drawBraceAnim();
    else if (inputChar === '[' || inputChar === ']') drawBracketAnim();
    else if (inputChar === '_') drawUnderscoreAnim();
    else if (inputChar === '~') drawTildeAnim();
  }

   if (state !== 'animating') {
    menuSlide = lerp(menuSlide, menuTarget, 0.20);
    drawMenuButton();
    if (menuSlide > 0.01) drawMenu();
  } else {
    if (menuSlide > 0.01) {
      menuSlide = lerp(menuSlide, menuTarget, 0.12);
      drawMenu();
    }
  }
}

// ─────────────────────────────────────────────────────
//  첫 화면
// ─────────────────────────────────────────────────────
function drawIdleScreen() {
  if (millis() - lastBlink > BLINK_INTERVAL) {
    cursorVisible = !cursorVisible;
    lastBlink = millis();
  }

  drawGuideText();
  drawHello('HELLO');

  if (cursorVisible) {
    push();
    textSize(width * 0.13);
    textFont('Noto Sans KR, sans-serif');
    let helloWidth = textWidth('HELLO');
    pop();
    let startX  = width * 0.5 - helloWidth * 0.5;
    let cursorX = startX + helloWidth + width * 0.012;
    let cursorY = height * 0.5 - width * 0.065 + width * 0.13 * 0.75;
    noStroke();
    fill(44, 44, 44);
    rect(cursorX, cursorY, width * 0.055, width * 0.008);
  }
}

function drawInputScreen() {
  drawGuideText();
  drawHello('HELLO' + inputChar);
}

// ─────────────────────────────────────────────────────
//  마침표
// ─────────────────────────────────────────────────────
function drawPeriodAnim() {
  if (t < DURATION) t++;

  let commonRightEdge = width * (BARS[0].xRatio + BARS[0].wRatio);

  let shrink = constrain(t / (DURATION * 0.18), 0, 1);
  let shrinkEase = shrink * shrink;
  let fontSize = width * 0.13;

  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  let helloW = textWidth('HELLO');
  let helloX = width * 0.07;
  let helloCenterY = height * 0.28 + fontSize * 0.5;

  if (shrinkEase < 1) {
    let scaleY = lerp(1.0, 0.0, shrinkEase);
    noStroke();
    fill(C_DARK[0], C_DARK[1], C_DARK[2]);
    push();
    translate(helloX, helloCenterY);
    scale(1, scaleY);
    text('HELLO', 0, -fontSize * 0.5);
    pop();
  } else {
    let helloBar = {
      xRatio: helloX / width,
      wRatio: helloW / width,
      yRatio: (helloCenterY - fontSize * 0.04) / height,
      hRatio: fontSize * 0.08 / height,
      color: C_DARK,
      speed: 1.0,
      delay: 0
    };

    let localT = max(0, t - DURATION * 0.25);
    let prog  = constrain(localT / (DURATION * 0.6), 0, 1);
    let ease  = prog * prog;
    let moveX = ease * width * 1.5 * helloBar.speed;

    let left      = width * helloBar.xRatio + moveX;
    let right     = width * (helloBar.xRatio + helloBar.wRatio) + moveX;
    let overflow  = right - commonRightEdge;
    let drawLeft  = left + max(0, overflow);
    let drawRight = min(right, commonRightEdge);
    let currentW  = drawRight - drawLeft;

    if (currentW > 0) {
      noStroke();
      fill(helloBar.color[0], helloBar.color[1], helloBar.color[2]);
      rect(drawLeft, height * helloBar.yRatio, currentW, height * helloBar.hRatio);
    }
  }

  for (let bar of BARS) {
    let localT = max(0, t - bar.delay);
    let prog  = constrain(localT / (DURATION * 0.85), 0, 1);
    let ease  = prog * prog;
    let moveX = ease * width * 1.5 * bar.speed;

    let left      = width * bar.xRatio + moveX;
    let right     = width * (bar.xRatio + bar.wRatio) + moveX;
    let overflow  = right - commonRightEdge;
    let drawLeft  = left + max(0, overflow);
    let drawRight = min(right, commonRightEdge);
    let currentW  = drawRight - drawLeft;

    if (currentW > 0) {
      noStroke();
      fill(bar.color[0], bar.color[1], bar.color[2]);
      rect(drawLeft, height * bar.yRatio, currentW, height * bar.hRatio);
    }
  }

  if (t >= DURATION) resetToIdle();
}

// ─────────────────────────────────────────────────────
//  물음표
// ─────────────────────────────────────────────────────
function initQuestionAnim() {
  qParticles = [];

  let cx = width * 0.05;
  let cy = height * 0.95;
  let directions = 12;

  for (let i = 0; i < directions; i++) {
    let angle = (TWO_PI / directions) * i;
  
    let lineSpeed = width * 0.018;
    qParticles.push({
      type: 'line',
      x: cx, y: cy,
      vx: cos(angle) * lineSpeed,
      vy: sin(angle) * lineSpeed,
      len: width * 0.05,
      lineAngle: angle,
      color: [154, 205, 50],
      alpha: 255
    });

    let smallSpeed = width * 0.013;
    qParticles.push({
      type: 'circle',
      x: cx, y: cy,
      vx: cos(angle) * smallSpeed,
      vy: sin(angle) * smallSpeed,
      r: width * 0.010,
      color: [220, 20, 60],
      alpha: 255
    });
    
 let outCount = 8; 
  for (let i = 0; i < outCount; i++) {
    let angle = (TWO_PI / outCount) * i;
    let innerSpeed = width * 0.008; 
    qParticles.push({
      type: 'line',
      x: cx, y: cy,
      vx: cos(angle) * innerSpeed,
      vy: sin(angle) * innerSpeed,
      len: width * 0.04,
      lineAngle: angle,
      color: [154, 205, 50],
      alpha: 255
    });
  }

  let outerCount = 20; 
  for (let i = 0; i < outerCount; i++) {
    let angle = (TWO_PI / outerCount) * i;
    let outerSpeed = width * 0.022;
    qParticles.push({
      type: 'circle',
      x: cx, y: cy,
      vx: cos(angle) * outerSpeed,
      vy: sin(angle) * outerSpeed,
      r: width * 0.008,
      color: [220, 20, 60],
      alpha: 255
    });
  }

    if (i % 3 === 0) {
      let bigSpeed = width * 0.008;
      qParticles.push({
        type: 'circle',
        x: cx, y: cy,
        vx: cos(angle) * bigSpeed,
        vy: sin(angle) * bigSpeed,
        r: width * 0.038,
        color: [255, 220, 0],
        alpha: 255
      });
    }
  }

  let letters = ['H', 'E', 'L', 'L', 'O'];
  let fontSize = width * 0.13;
  
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX  = width * 0.5 - totalW * 0.5;
  let helloStartY  = height * 0.5 - fontSize * 0.5;
let offsets = [];
  for (let i = 0; i < letters.length; i++) {
    offsets.push(textWidth(letters.slice(0, i).join('')));
  }

  for (let i = 0; i < letters.length; i++) {
    let offsetX = 0;
    for (let j = 0; j < i; j++) {
      offsetX += textWidth(letters[j]);
    }
    let lx = helloStartX + offsetX;
    let ly = helloStartY;
    let angle = atan2(ly - cy, lx - cx);
    let speed = width * 0.006; 
    qParticles.push({
      type: 'letter',
      char: letters[i],
      x: lx, y: ly,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      bounceT: 0,
      landed: false,
      landX: lx + cos(angle) * width * 0.06, 
      landY: ly + sin(angle) * width * 0.06,
      rotate: random(-0.03, 0.03),
      currentAngle: random(-0.2, 0.2),
      size: width * 0.13,
      color: [44, 44, 44],
      alpha: 255
    });
  }
}

function drawQuestionAnim() {
  if (t === 0) initQuestionAnim();
  if (t < DURATION) t++;

  let fadeStart = DURATION * 0.55;

  for (let p of qParticles) {
    p.x += p.vx;
    p.y += p.vy;

    if (t > fadeStart) {
      p.alpha = map(t, fadeStart, DURATION, 255, 0);
    }

    if (p.type === 'line') {
      stroke(p.color[0], p.color[1], p.color[2], p.alpha);
      strokeWeight(6);
      noFill();
      push();
      translate(p.x, p.y);
      rotate(p.lineAngle);
      line(0, 0, p.len, 0);
      pop();
    }

    if (p.type === 'circle') {
      noStroke();
      fill(p.color[0], p.color[1], p.color[2], p.alpha);
      circle(p.x, p.y, p.r * 2);
    }

    if (p.type === 'letter') {
      if (!p.landed) {
        p.x = lerp(p.x, p.landX, 0.25);
        p.y = lerp(p.y, p.landY, 0.25);
        if (dist(p.x, p.y, p.landX, p.landY) < 2) {
          p.landed = true;
        }
      } else {
        p.bounceT += 1;
        let bounceY = sin(p.bounceT * 0.60) * exp(-p.bounceT * 0.06) * height * 0.06;
        p.y = p.landY + bounceY;
      }
      noStroke();
      fill(p.color[0], p.color[1], p.color[2], p.alpha);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      textSize(p.size);
      textFont('Noto Sans KR, sans-serif');
      push();
      translate(p.x, p.y);
      rotate(p.currentAngle);
      text(p.char, 0, 0);
      pop();
    }
  }

  if (t >= DURATION) resetToIdle();
}


// ─────────────────────────────────────────────────────
//  느낌표
// ─────────────────────────────────────────────────────
function initExclamationAnim() {
  exParticles = [];

  let cx = width * 0.5;
  let cy = height * 0.5;

  let ringColors = [
    [220, 20, 60],
    [44, 44, 44],
    [220, 20, 60],
  ];
  for (let i = 0; i < 3; i++) {
    exParticles.push({
      type: 'ring',
      x: width  * random(0.3, 0.7),
      y: height * random(0.3, 0.7),
      outerR: width * 0.06,  
      innerR: 0,             
      outerSpeed: width * 0.014, 
      innerSpeed: width * 0.019,
      color: ringColors[i],
      alpha: 255
    });
  }
  
  let triColors = [
    [220, 20,  60],
    [220, 20,  60],
    [255, 215, 0],
    [255, 215, 0],
    [220, 20,  60],
    [255, 215, 0],
    [220, 20,  60],
    [255, 215, 0],
  ];
  for (let i = 0; i < 8; i++) {
    let baseAngle = (TWO_PI / 8) * i;
    let angle = baseAngle + random(-0.3, 0.3); 
    let speed = random(width * 0.025, width * 0.038); 
    exParticles.push({
      type: 'triangle',
      x: cx, y: cy,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      angle: angle,
      size: random(width * 0.05, width * 0.09),
      color: triColors[i],
      alpha: 255
    });
  }
  let letters = ['H', 'E', 'L', 'L', 'O'];
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX  = width * 0.5 - totalW * 0.5;
  let helloStartY  = height * 0.5 - width * 0.065;

  let offsets = [];
  for (let i = 0; i < letters.length; i++) {
    offsets.push(textWidth(letters.slice(0, i).join('')));
  }

  for (let i = 0; i < letters.length; i++) {
    let startX  = helloStartX + offsets[i];
    let startY  = helloStartY;
    let targetX = width * 0.5 - totalW * 0.5 + textWidth(letters.slice(0, i).join(''));
    let targetY = height * 0.5;

    exParticles.push({
      type: 'letter',
      char: letters[i],
      x: startX, y: startY,
      startX: startX, startY: startY,
      targetX: targetX, targetY: targetY,
      vx: 0, vy: 0,
     burstAngle: atan2(targetY - height * 0.5, targetX - width * 0.5) + random(-1.2, 1.2),
      burstSpeed: width * 0.022,
      rotate: random(-0.04, 0.04),
      currentAngle: 0,
      size: width * 0.13,
      color: [44, 44, 44],
      alpha: 255
    });
  }
}

function drawExclamationAnim() {
  if (t === 0) initExclamationAnim();
  if (t < DURATION) t++;

  let moveEnd   = 25; 
  let pauseEnd  = 31; 
  let fadeStart = DURATION * 0.65;

  for (let p of exParticles) {
    if (t > fadeStart) {
      p.alpha = map(t, fadeStart, DURATION, 255, 0);
    }

   if (p.type === 'ring' && t > pauseEnd) {
      p.outerR += p.outerSpeed;
      p.innerR += p.innerSpeed;

      let thickness = p.outerR - p.innerR;

      if (thickness > 0) {
        noFill();
        stroke(p.color[0], p.color[1], p.color[2], p.alpha);
        strokeWeight(thickness);
        let midR = (p.outerR + p.innerR) / 2;
        circle(p.x, p.y, midR * 2);
      }
    }
    if (p.type === 'triangle' && t > pauseEnd) {
      p.x += p.vx;
      p.y += p.vy;
      noStroke();
      fill(p.color[0], p.color[1], p.color[2], p.alpha);
      push();
      translate(p.x, p.y);
      rotate(p.angle);
      triangle(
        0,            -p.size,
        p.size * 0.8,  p.size * 0.5,
        -p.size * 0.8, p.size * 0.5
      );
      pop();
    }

    if (p.type === 'letter') {
      if (t <= moveEnd) {
        let prog = constrain(t / moveEnd, 0, 1);
        let ease = prog * prog * (3 - 2 * prog);
        p.x = lerp(p.startX, p.targetX, ease);
        p.y = lerp(p.startY, p.targetY, ease);
      } else if (t <= pauseEnd) {
        p.x = p.targetX;
        p.y = p.targetY;
      } else {
        if (p.vx === 0 && p.vy === 0) {
          p.vx = cos(p.burstAngle) * p.burstSpeed;
          p.vy = sin(p.burstAngle) * p.burstSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.currentAngle += p.rotate;
      }

      // 이동 중(t <= pauseEnd)에는 HELLO 전체를 한 번에 그림
      if (p.char === 'H' && t <= pauseEnd) {
        noStroke();
        fill(44, 44, 44, p.alpha);
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        textSize(p.size);
        textFont('Noto Sans KR, sans-serif');
        text('HELLO', p.x, p.y);
      } else if (t > pauseEnd) {
        // 터진 후에는 개별 글자로 그림
        noStroke();
        fill(44, 44, 44, p.alpha);
        textAlign(CENTER, CENTER);
        textStyle(BOLD);
        textSize(p.size);
        textFont('Noto Sans KR, sans-serif');
        push();
        translate(p.x, p.y);
        rotate(p.currentAngle);
        text(p.char, 0, 0);
        pop();
      }
    }
  }

  if (t >= DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  쉼표
// ─────────────────────────────────────────────────────
const COMMA_DURATION = 170;

const RING_X = [0.25, 0.39, 0.59, 0.70, 0.92];
const BAR_COLORS = [
  [173, 216, 230],   
  [147, 112, 219],  
  [173, 216, 230],
  [147, 112, 219],
  [173, 216, 230],
];
const RING_Y    = 0.08;  
const RING_R    = 0.04;  
const BAR_W     = 0.025; 
const BAR_MAX_H = 0.82;  

const BAR_DELAYS = [0, 12, 24, 34, 42]; 

function drawCommaAnim() {
  if (t < COMMA_DURATION) t++;

  let ringR     = width * RING_R;
  let barW      = ringR * 2;              
  let strokeW   = width * 0.008;         
  let ringCY    = height * RING_Y + ringR;

  let helloEndFrame = 60;
  let letters    = ['H', 'E', 'L', 'L', 'O'];
  let letterSize = height * 0.14;
  let hX         = width * 0.07;
 let hY = height * 0.15;

  noStroke();
  fill(44, 44, 44);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(letterSize);
  textFont('Noto Sans KR, sans-serif');
  text('H', hX, hY);

 for (let i = 1; i < letters.length; i++) {
    let appearFrame = i * 12;
    if (t < appearFrame) continue;
    let localT   = t - appearFrame;
    let progress = constrain(localT / 25, 0, 1);
    let ease     = 1 - (1 - progress) * (1 - progress);
    let targetY  = hY + letterSize * i;
    let startY   = height * 0.28; 
    let y        = lerp(startY, targetY, ease);
    let xOffset  = (i === 4) ? -width * 0.005 : 0;

    noStroke();
    fill(44, 44, 44);
    text(letters[i], hX + xOffset, y);
  }
  if (t < helloEndFrame) {
  let lastBarEnd = helloEndFrame + BAR_DELAYS[4] + 35 + 6;
  if (t >= lastBarEnd) resetToIdle();
    return;
  }

  let shapeT = t - helloEndFrame; 

  let maxBarH = height * BAR_MAX_H;

  for (let i = 0; i < 5; i++) {
    let cx    = width * RING_X[i];
    let delay = BAR_DELAYS[i];

    if (shapeT >= delay) {
      let localT   = shapeT - delay;
      let progress = constrain(localT / 35, 0, 1);
      let ease     = 1 - (1 - progress) * (1 - progress);
      let barH     = ease * maxBarH;

      fill(BAR_COLORS[i][0], BAR_COLORS[i][1], BAR_COLORS[i][2]);
      stroke(44, 44, 44);
      strokeWeight(strokeW);
      rect(cx - barW / 2 + strokeW / 2, ringCY, barW - strokeW, barH, barW / 2);
    }
  }

  for (let i = 0; i < 5; i++) {
    let cx = width * RING_X[i];
    fill(255);
    stroke(44, 44, 44);
    strokeWeight(strokeW);
    circle(cx, ringCY, ringR * 2);
  }

  if (t >= COMMA_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  빗금
// ─────────────────────────────────────────────────────
const SLASH_DURATION = 130;

const SLASH_LINES = [
  { color: [147, 112, 219], dir:  1 }, 
  { color: [255, 215, 0], dir: -1 }, 
  { color: [147, 112, 219], dir:  1 }, 
  { color: [255, 215, 0], dir: -1 }, 
  { color: [147, 112, 219], dir:  1 }, 
];

let slashLetters = []; 

function initSlashAnim() {
  slashLetters = [];

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;

  let offsets = [];
  for (let i = 0; i < letters.length; i++) {
    offsets.push(textWidth(letters.slice(0, i).join('')));
  }
  pop();
 
  let targets = [
    { x: width * 0.08, y: height * 0.35 }, 
    { x: width * 0.28, y: height * 0.58 }, 
    { x: width * 0.42, y: height * 0.24 }, 
    { x: width * 0.57, y: height * 0.65 }, 
    { x: width * 0.70, y: height * 0.22 }, 
  ];

  let letters2 = ['H', 'E', 'L', 'L', 'O'];
  for (let i = 0; i < letters2.length; i++) {
    slashLetters.push({
    char: letters[i],
    centerX: centerStartX + offsets[i],
    centerY: height * 0.5 - width * 0.065,
    targetX: targets[i].x,
    targetY: targets[i].y,
    midX: i === 3 ? width * 0.55 : i === 4 ? width * 0.67 : undefined,
    midY: i === 3 ? height * 0.50 : i === 4 ? height * 0.20 : undefined,
    scattered: false,
    scatterFrame: 0
  });
  }
}

function drawSlashAnim() {
  if (t === 0) initSlashAnim();
  if (t < SLASH_DURATION) t++;

  let moveEnd  = 25;
  let pauseEnd = 31;
  let lineDelay = 18;
  let lineThick = width * 0.055;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let totalWTemp = textWidth('HELLO');
  let helloStartX = width * 0.5 - totalWTemp * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;

  let offsets = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  let nodes = [
    { x: width * 0.18, y: height * 0.72 },
    { x: width * 0.32, y: height * 0.22 },
    { x: width * 0.46, y: height * 0.72 },
    { x: width * 0.60, y: height * 0.22 },
    { x: width * 0.74, y: height * 0.72 },
    { x: width * 0.88, y: height * 0.22 },
  ];

   if (t >= pauseEnd + 2 * lineDelay && !slashLetters[3].scattered) {
    slashLetters[3].scattered    = true;
    slashLetters[3].scatterFrame = t;
  }
  if (t >= pauseEnd + 3 * lineDelay && !slashLetters[4].scattered) {
    slashLetters[4].scattered    = true;
    slashLetters[4].scatterFrame = t;
  }

  for (let i = 0; i < 5; i++) {
    let startTime = pauseEnd + i * lineDelay;
    if (t < startTime) break;

    let sl       = SLASH_LINES[i];
    let p1       = nodes[i];
    let p2       = nodes[i + 1];
    let localT   = t - startTime;
    let progress = constrain(localT / 18, 0, 1);
    let ease     = 1 - (1 - progress) * (1 - progress);

    let ex = lerp(p1.x, p2.x, ease);
    let ey = lerp(p1.y, p2.y, ease);

    stroke(sl.color[0], sl.color[1], sl.color[2]);
    strokeWeight(lineThick);
    strokeCap(ROUND);
    noFill();
    line(p1.x, p1.y, ex, ey);

   if (i < 3) {
      if (progress >= 0.01 && !slashLetters[i].scattered) {
        slashLetters[i].scattered    = true;
        slashLetters[i].scatterFrame = t;
      }
    }
  }

  for (let i = 0; i < letters.length; i++) {
    let sl = slashLetters[i];
    let x, y;

    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], sl.centerX, ease);
      y = lerp(helloStartY, sl.centerY, ease);

    } else if (sl.scattered) {
      let localT = t - sl.scatterFrame;
      let prog   = constrain(localT / 15, 0, 1);
      let ease   = 1 - (1 - prog) * (1 - prog);
      x = lerp(sl.centerX, sl.targetX, ease);
      y = lerp(sl.centerY, sl.targetY, ease);

    } else {
      x = sl.centerX;
      y = sl.centerY;
    }

    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(width * 0.13);
    textFont('Noto Sans KR, sans-serif');
    text(sl.char, x, y);
  }

  if (t >= SLASH_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  쌍점
// ─────────────────────────────────────────────────────
const COLON_DURATION = 120;

let colonParticles = [];

function initColonAnim() {
  colonParticles = [];
  let cx = width * 0.5;
  let cy = height * 0.5;

  let lines = [
    { angle: -2.4,  color: [147, 112, 219], speed: width * 0.022, len: width * 0.18, thick: width * 0.018 }, 
    { angle: -0.4,  color: [173, 216, 230], speed: width * 0.025, len: width * 0.10, thick: width * 0.012 }, 
    { angle:  0.6,  color: [75, 0, 130],  speed: width * 0.020, len: width * 0.22, thick: width * 0.022 }, 
    { angle:  2.0,  color: [75, 0, 130],  speed: width * 0.018, len: width * 0.16, thick: width * 0.018 }, 
    { angle:  2.6,  color: [154, 205, 50],  speed: width * 0.023, len: width * 0.08, thick: width * 0.030 }, 
    { angle: -1.0,  color: [44, 44, 44],  speed: width * 0.021, len: width * 0.20, thick: width * 0.030 },
  ];
  for (let l of lines) {
    colonParticles.push({
      type: 'line',
      x: cx, y: cy,
      vx: cos(l.angle) * l.speed,
      vy: sin(l.angle) * l.speed,
      len: l.len,
      thick: l.thick,
      angle: l.angle,
      color: l.color,
      alpha: 255
    });
  }

  let arcs = [
    { angle: -PI * 0.9, span: PI * 0.55, color: [173, 216, 230], speed: width * 0.020, r: width * 0.18, thick: width * 0.012 },
    { angle: PI * 0.10, span: PI * 0.45, color: [255, 215, 0], speed: width * 0.018, r: width * 0.12, thick: width * 0.035 }, 
    { angle:  PI * 0.6, span: PI * 0.40, color: [173, 216, 230], speed: width * 0.022, r: width * 0.14, thick: width * 0.018 },
    { angle: -PI * 0.4, span: PI * 0.45, color: [220, 20, 60], speed: width * 0.019, r: width * 0.16, thick: width * 0.012 }, 
  ];
  for (let a of arcs) {
    colonParticles.push({
      type: 'arc',
      x: cx, y: cy,
      vx: cos(a.angle + a.span * 0.5) * a.speed,
      vy: sin(a.angle + a.span * 0.5) * a.speed,
      r: a.r,
      thick: a.thick,
      startAngle: a.angle,
      endAngle: a.angle + a.span,
      color: a.color,
      alpha: 255
    });
  }
}

function drawColonAnim() {
  if (t === 0) initColonAnim();
  if (t < COLON_DURATION) t++;

  let moveEnd   = 25;
  let pauseEnd  = 31;
  let circleEnd = 48;
  let splitEnd  = 62;
  let fadeStart = 88;

  let cx = width * 0.5;
  let cy = height * 0.5;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  if (t >= pauseEnd) {
    let circleProgress = constrain((t - pauseEnd) / (circleEnd - pauseEnd), 0, 1);
    let ease = 1 - pow(1 - circleProgress, 3);
    let r    = ease * width * 0.15;

    if (t < splitEnd) {
      noStroke();
      fill(255, 215, 0);
      circle(cx, cy, r * 2);
 } else {
     let splitProgress = constrain((t - circleEnd) / (COLON_DURATION * 0.3), 0, 1); 
      let splitEase     = splitProgress * splitProgress;
      let offset        = splitEase * width * 1.2;

      let splitAngle = -PI / 6;

      noStroke();
      fill(255, 215, 0);

      push();
      translate(cx - offset, cy); 
      arc(0, 0, r * 2, r * 2,
          splitAngle + HALF_PI,
          splitAngle + HALF_PI + PI);
      pop();

      push();
      translate(cx + offset, cy); 
      arc(0, 0, r * 2, r * 2,
          splitAngle - HALF_PI,
          splitAngle + HALF_PI);
      pop();
    }
  }
  
  if (t >= splitEnd) {
    let alpha = t > fadeStart ? map(t, fadeStart, COLON_DURATION, 255, 0) : 255;

    for (let p of colonParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = alpha;

      if (p.type === 'line') {
        stroke(p.color[0], p.color[1], p.color[2], p.alpha);
        strokeWeight(p.thick);
        strokeCap(ROUND);
        noFill();
        push();
        translate(p.x, p.y);
        rotate(p.angle);
        line(-p.len / 2, 0, p.len / 2, 0);
        pop();
      }

      if (p.type === 'arc') {
        stroke(p.color[0], p.color[1], p.color[2], p.alpha);
        strokeWeight(p.thick);
        strokeCap(ROUND);
        noFill();
        arc(p.x, p.y, p.r * 2, p.r * 2, p.startAngle, p.endAngle);
      }
    }
  }
  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, height * 0.5 - width * 0.065, ease);
    } else {
      x = centerStartX + offsets[i];
      y = height * 0.5 - width * 0.065;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(width * 0.13);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }



  if (t >= COLON_DURATION) {
    colonParticles = [];
    resetToIdle();
  }
}
// ─────────────────────────────────────────────────────
//  큰따옴표 
// ─────────────────────────────────────────────────────
const QUOTE_DURATION = 130;

const QUOTE_BARS = [
  { color: [0, 0, 205], hRatio: 0.022, yOffset: 0.08  }, // 파랑 (두꺼움)
  { color: [44,   44,  44], hRatio: 0.006, yOffset: 0.135 }, // 검정 (얇음)
  { color: [220, 20, 60], hRatio: 0.030, yOffset: 0.185 }, // 빨강 (두꺼움)
];


function drawQuoteAnim() {
  if (t < QUOTE_DURATION) t++;

  let moveEnd    = 25;
  let barEnd     = 60;
  let wedgeStart = 65;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  let oRightEdge = centerStartX + offsets[4] + textWidth('O');
  let fontSize   = width * 0.13;
  pop();

  let helloY   = height * 0.5 - fontSize * 0.5;
  let helloBotY = helloY + fontSize * 0.85; 

  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= moveEnd) {
     let bars = [
      { color: [30, 100, 220], h: height * 0.025, y: helloBotY + height * 0.04  },
      { color: [44,  44,  44], h: height * 0.006, y: helloBotY + height * 0.08  },
      { color: [220, 30,  30], h: height * 0.032, y: helloBotY + height * 0.11  },
    ];

    for (let i = 0; i < 3; i++) {
      let bar    = bars[i];
      let delay  = i * 4;
      let localT = max(0, t - moveEnd - delay);
      let prog   = constrain(localT / 35, 0, 1);
      let ease   = prog * prog;
      let moveX  = ease * width * 2.0;

      let startX = centerStartX - width * 0.05;
      let left   = startX + moveX;
      let currentW = oRightEdge - left;

      if (currentW > 0 && left < oRightEdge) {
        noStroke();
        fill(bar.color[0], bar.color[1], bar.color[2]);
        rect(left, bar.y, currentW, bar.h);
      }
    }
  }

 if (t >= wedgeStart) {
    let wedgeT   = t - wedgeStart;
    let wedgeMaxLen = width * 0.6; 
    let lTipX    = centerStartX - width * 0.02;
    let rTipX    = centerStartX + totalW + width * 0.02;
    let tipY     = helloY + fontSize * 0.5;
    let innerH   = height * 0.10; 

    let prog  = constrain(wedgeT / 18, 0, 1);
    let ease  = 1 - pow(1 - prog, 3);
    let len   = ease * wedgeMaxLen;

    let angles = [-PI * 0.28, 0, PI * 0.28];
    let spread = 0.28; 

    noStroke();
    fill(44, 44, 44);

    drawingContext.save();
for (let i = 0; i < 3; i++) {
      let delay  = i * 10; 
      let localT = max(0, wedgeT - delay);
      let prog   = constrain(localT / 18, 0, 1);
      let ease   = 1 - pow(1 - prog, 3);
      let len    = ease * wedgeMaxLen;

      let a = angles[i];

      let lInnerTopX = lTipX;
      let lInnerTopY = tipY + sin(a - spread * 0.1) * innerH;
      let lInnerBotX = lTipX;
      let lInnerBotY = tipY + sin(a + spread * 0.1) * innerH;
     
      let lOuterTopX = lTipX - cos(a - spread) * len;
      let lOuterTopY = tipY  + sin(a - spread) * len;
      let lOuterBotX = lTipX - cos(a + spread) * len;
      let lOuterBotY = tipY  + sin(a + spread) * len;

      beginShape();
      vertex(lInnerTopX, lInnerTopY);
      vertex(lOuterTopX, lOuterTopY);
      vertex(lOuterBotX, lOuterBotY);
      vertex(lInnerBotX, lInnerBotY);
      endShape(CLOSE);

      let rInnerTopX = rTipX;
      let rInnerTopY = tipY + sin(a - spread * 0.1) * innerH;
      let rInnerBotX = rTipX;
      let rInnerBotY = tipY + sin(a + spread * 0.1) * innerH;
      let rOuterTopX = rTipX + cos(a - spread) * len;
      let rOuterTopY = tipY  + sin(a - spread) * len;
      let rOuterBotX = rTipX + cos(a + spread) * len;
      let rOuterBotY = tipY  + sin(a + spread) * len;

      beginShape();
      vertex(rInnerTopX, rInnerTopY);
      vertex(rOuterTopX, rOuterTopY);
      vertex(rOuterBotX, rOuterBotY);
      vertex(rInnerBotX, rInnerBotY);
      endShape(CLOSE);
    }

    drawingContext.restore();

  }

  if (t >= QUOTE_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  작은따옴표 
// ─────────────────────────────────────────────────────
const SQ_DURATION = 130;

const SQ_BUBBLES = [
  { dx: 0.01, dy:  0.04, r: 0.012, delay: 0  }, 
  { dx: 0.04, dy:  0.11, r: 0.020, delay: 8  }, 
  { dx: 0.12, dy:  0.08, r: 0.032, delay: 16 }, 
  { dx: 0.10, dy: -0.07, r: 0.045, delay: 24 }, 
];


function drawSingleQuoteAnim() {
  if (t < SQ_DURATION) t++;
  
  let SQ_ELLIPSE_ANGLES = [
    PI * 0.65,  
    PI * 0.35,  
    PI * 0.1,    
    -PI * 0.25, 
  ];

  let fadeEnd    = 30; 
  let bubbleEnd  = 80;  
  let ellipseStart = 85; 

  let grayVal;
  if (t <= fadeEnd) {
    let prog = constrain(t / fadeEnd, 0, 1);
    let ease = prog * prog;
    if (prog < 0.5) {
      grayVal = lerp(45, 100, prog * 2);
    } else {
      grayVal = lerp(100, 180, (prog - 0.5) * 2);
    }
  } else {
    grayVal = 180;
  }

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters     = ['H', 'E', 'L', 'L', 'O']; // 이 줄 추가
  let totalW      = textWidth('HELLO');
  let helloStartX = width * 0.5 - totalW * 0.5;
  let offsets     = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  let oRightX = helloStartX + offsets[4] + textWidth('O');
  let helloCY = height * 0.5;
  pop();

  noStroke();
  fill(grayVal);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  text('HELLO', helloStartX, height * 0.5 - width * 0.065);

  if (t >= fadeEnd) {
    for (let i = 0; i < SQ_BUBBLES.length; i++) {
      let b      = SQ_BUBBLES[i];
      let localT = max(0, t - fadeEnd - b.delay);
      if (localT <= 0) continue;

      let bx = oRightX + width  * b.dx;
      let by = helloCY + height * b.dy;
      let r  = width * b.r;

      if (t < ellipseStart) {
        let prog = constrain(localT / 12, 0, 1);
        let ease = 1 - pow(1 - prog, 3);
        let cr   = ease * r;
        noStroke();
        fill(180);
        circle(bx, by, cr * 2);

      } else {
        let ellipseT = t - ellipseStart;
        let prog     = constrain(ellipseT / 20, 0, 1);
        let ease     = 1 - pow(1 - prog, 3);

        let rW = lerp(r, r * 3.0, ease); 
        let rH = lerp(r, r * 0.5, ease); 

        let dist = ease * (width * 0.03 + r * 1.0);

        let angle = SQ_ELLIPSE_ANGLES[i];

        noStroke();
        fill(180);
        push();
        translate(bx + cos(angle) * dist, by + sin(angle) * dist);
        rotate(angle);
        ellipse(0, 0, rW * 2, rH * 2);
        pop();
      }
    }
  }

  if (t >= SQ_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//붙임표
// ─────────────────────────────────────────────────────
const HYPHEN_DURATION = 120;

function drawHyphenAnim() {
  if (t < HYPHEN_DURATION) t++;

  let moveEnd  = 25;
  let pauseEnd = 31;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let fontSize     = width * 0.13;
  let offsets      = [];
  let charWidths   = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
    charWidths.push(textWidth(letters[i]));
  }
  pop();

  let helloY   = height * 0.5 - fontSize * 0.5;
  let boxH     = fontSize * 1.1; 
  let boxTop   = helloY - fontSize * 0.05; 

  if (t >= pauseEnd) {
    let gap = width * 0.004;

    for (let i = 0; i < 5; i++) {
      let delay    = i * 8;
      let localT   = max(0, t - pauseEnd - delay);
      if (localT <= 0) continue;

      let prog     = constrain(localT / 15, 0, 1);
      let ease     = 1 - pow(1 - prog, 3);
      let targetY  = boxTop;
      let startY   = boxTop - boxH;
      let currentH = ease * boxH; 

      let bx = centerStartX + offsets[i] + gap * 0.5;
      let bw = charWidths[i] - gap;

      noStroke();
      fill(220, 20, 60);
      rect(bx, boxTop, bw, currentH);
    }
  }

  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= HYPHEN_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
// 홀화살괄호
// ─────────────────────────────────────────────────────
const ANGLE_DURATION = 130;

function drawAngleAnim() {
  if (t < ANGLE_DURATION) t++;

  let moveEnd  = 25;
  let pauseEnd = 31;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let fontSize     = width * 0.13;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  let helloY  = height * 0.5 - fontSize * 0.5;
  let helloCX = width * 0.5;
  let helloCY = height * 0.5;

  let helloLeft  = centerStartX;
  let helloRight = centerStartX + totalW;
  let helloTop   = helloY;
  let helloBotY  = helloY + fontSize;
  let pad        = fontSize * 0.2; 

  let rects = [
    { x: helloLeft  + totalW * 0.1,  y: helloTop  - pad * 4.5, w: totalW * 0.72, h: fontSize * 0.38, delay: 0  }, 
    { x: helloLeft  - totalW * 0.05, y: helloTop  - pad * 1.5, w: totalW * 0.80, h: fontSize * 0.06, delay: 15 }, 
    { x: helloLeft  + totalW * 0.04, y: helloBotY + pad * 0.5, w: totalW * 0.55, h: fontSize * 0.38, delay: 5  }, 
    { x: helloLeft  + totalW * 0.28, y: helloBotY + pad * 3.0, w: totalW * 0.38, h: fontSize * 0.05, delay: 20 }, 

    { x: helloLeft  - pad * 8.0, y: helloTop  - pad * 3.0, w: fontSize * 0.10, h: fontSize * 2.80, delay: 8  }, 
    { x: helloLeft  - pad * 5.0, y: helloTop  - pad * 0.5, w: fontSize * 0.12, h: fontSize * 1.30, delay: 18 }, 
    { x: helloLeft  - pad * 3.2, y: helloTop  + pad * 0.5, w: fontSize * 0.10, h: fontSize * 0.90, delay: 25 }, 

    { x: helloRight + pad * 1.2, y: helloTop  - pad * 1.5, w: fontSize * 0.10, h: fontSize * 1.60, delay: 3  }, 
    { x: helloRight + pad * 2.8, y: helloTop  - pad * 5.0, w: fontSize * 0.12, h: fontSize * 3.20, delay: 12 }, 
    { x: helloRight + pad * 4.5, y: helloTop  + pad * 0.5, w: fontSize * 0.10, h: fontSize * 1.30, delay: 22 }, 
  ];

 if (t >= pauseEnd) {
    for (let r of rects) {
      let localT = max(0, t - pauseEnd - r.delay);
      if (localT <= 0) continue;
      let prog = constrain(localT / 12, 0, 1);
      let ease = 1 - pow(1 - prog, 3);

      let rw = r.w * ease;
      let rh = r.h * ease;

      noStroke();
      fill(44, 44, 44);
      rect(
        r.x + (r.w - rw) * 0.5,
        r.y + (r.h - rh) * 0.5,
        rw, rh
      );
    }
  }

  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= ANGLE_DURATION) resetToIdle();
}// ─────────────────────────────────────────────────────
//  소괄호
// ─────────────────────────────────────────────────────
const PAREN_DURATION = 140;

const PAREN_BUBBLES = [
  { side: 'L', dx: -0.18, dy: -0.02, r: 0.048, delay: 0  },
  { side: 'L', dx: -0.10, dy:  0.06, r: 0.032, delay: 8  }, 
  { side: 'L', dx: -0.08, dy: -0.08, r: 0.022, delay: 16 },
  { side: 'L', dx: -0.14, dy: -0.12, r: 0.012, delay: 24 }, 

  { side: 'R', dx:  0.10, dy:  0.06, r: 0.042, delay: 4  }, 
  { side: 'R', dx:  0.06, dy: -0.06, r: 0.028, delay: 12 }, 
  { side: 'R', dx:  0.14, dy: -0.04, r: 0.018, delay: 20 }, 
  { side: 'R', dx:  0.18, dy:  0.00, r: 0.010, delay: 28 }, 
];

function drawParenAnim() {
  if (t < PAREN_DURATION) t++;

  let moveEnd    = 25;
  let pauseEnd   = 31;
  let bubbleEnd  = 80;
  let gatherStart = 85; 

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let fontSize     = width * 0.13;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  let helloY    = height * 0.5 - fontSize * 0.5;
  let helloCY   = height * 0.5;
  let helloLeft = centerStartX;
  let helloRight = centerStartX + totalW;

  if (t >= pauseEnd) {
    for (let b of PAREN_BUBBLES) {
      let localT = max(0, t - pauseEnd - b.delay);
      if (localT <= 0) continue;

      let baseX = b.side === 'L'
        ? helloLeft  + width  * b.dx
        : helloRight + width  * b.dx;
      let baseY = helloCY + height * b.dy;
      let r     = width * b.r;

      let bx, by;

      if (t < gatherStart) {
        let prog = constrain(localT / 12, 0, 1);
        let ease = 1 - pow(1 - prog, 3);
        bx = baseX;
        by = baseY;

        noStroke();
        fill(173, 216, 230);
        circle(bx, by, r * 2 * ease);

     } else {
        let gatherT = t - gatherStart;
        let prog    = constrain(gatherT / 30, 0, 1);
        let ease    = prog * prog * (3 - 2 * prog);

      let targets = {
          'L0': { tx: helloLeft - fontSize * 0.7,  ty: helloCY + fontSize * 0.15 },
          'L1': { tx: helloLeft - fontSize * 0.25, ty: helloCY + fontSize * 0.90 },
          'L2': { tx: helloLeft - fontSize * 0.35, ty: helloCY - fontSize * 0.45 },
          'L3': { tx: helloLeft - fontSize * 0.75, ty: helloCY - fontSize * 0.55 },
          'R0': { tx: helloRight + fontSize * 0.35, ty: helloCY + fontSize * 0.45 },
          'R1': { tx: helloRight + fontSize * 0.10, ty: helloCY - fontSize * 0.45 },
          'R2': { tx: helloRight + fontSize * 0.55, ty: helloCY - fontSize * 0.55 },
          'R3': { tx: helloRight + fontSize * 0.70, ty: helloCY + fontSize * 0.05 },
        };
        let idx = PAREN_BUBBLES.indexOf(b);
        let sideIdx = b.side === 'L' ? idx : idx - 4;
        let key = b.side + sideIdx;
        let target = targets[key];

        bx = lerp(baseX, target.tx, ease);
        by = lerp(baseY, target.ty, ease);

        noStroke();
        fill(173, 216, 230);
        circle(bx, by, r * 2);
      }
    }
  }

  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else if (t >= gatherStart) {
      let gatherT = t - gatherStart;
      let prog    = constrain(gatherT / 30, 0, 1);
      let ease    = prog * prog * (3 - 2 * prog);
      let targetX = width * 0.5 - textWidth(letters[i]) * 0.5;
      x = lerp(centerStartX + offsets[i], targetX, ease * 0.3);
      y = helloY;
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= PAREN_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  중괄호
// ─────────────────────────────────────────────────────
const BRACE_DURATION = 150;

function getLetterY(i, t, hY, fontSize, targetYs) {
  let appearFrame = i * 7;
  let localT = max(0, t - appearFrame);
  if (localT <= 0) return -fontSize * 2;
  let prog = constrain(localT / 12, 0, 1);
  let ease = 1 - pow(1 - prog, 2);
  return lerp(hY - fontSize, targetYs[i], ease);
}

function drawBraceAnim() {
  if (t < BRACE_DURATION) t++;

  let letterEnd  = 50;  
  let shapeStart = 55;  
  let shapeEnd   = 100; 
  let coverStart = 105; 
  let coverEnd   = 135; 
  let endFrame   = 150;

  let letters   = ['H', 'E', 'L', 'L', 'O'];
  let fontSize  = min(width * 0.13, height * 0.16); 
  let hX        = width * 0.07;
  let hY        = height * 0.05;
  let letterGap = (height * 0.88) / 5;

  let targetYs = [
    hY,
    hY + letterGap,
    hY + letterGap * 2,
    hY + letterGap * 3,
    hY + letterGap * 4,
  ];

  push();
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  let charWidths = letters.map(l => textWidth(l));
  pop();

  let shapeStartX = hX + charWidths[0] + width * 0.03;
  let shapeEndX   = width * 0.83;
  let shapeH      = fontSize * 0.55; 

   for (let i = 0; i < letters.length; i++) {
    let y = i === 0 ? hY : getLetterY(i, t, hY, fontSize, targetYs); 
    if (y < -fontSize) continue;
    let xOffset = (i === 4) ? -width * 0.005 : 0;
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], hX + xOffset, y);
  }

  if (t >= shapeStart) {
    for (let i = 0; i < 5; i++) {
      let delay  = i * 6;
      let localT = max(0, t - shapeStart - delay);
      if (localT <= 0) continue;

      let prog = constrain(localT / 15, 0, 1);
      let ease = 1 - pow(1 - prog, 3);
      let cy   = targetYs[i] + fontSize * 0.50; 
      let w    = ease * (shapeEndX - shapeStartX);

      noStroke();

      if (i === 0) {
        fill(255, 215, 0);
        rect(shapeStartX, cy - shapeH * 0.5, w, shapeH);

      } else if (i === 1) {
        fill(147, 112, 219);
        rect(shapeStartX, cy - shapeH * 0.3, w, shapeH * 0.6, shapeH * 0.3);

      } else if (i === 2) {
        fill(44, 44, 44);
        rect(shapeStartX, cy - shapeH * 0.3, w, shapeH * 0.08);
        rect(shapeStartX, cy + shapeH * 0.1, w, shapeH * 0.08);

      } else if (i === 3) {
        fill(0, 0, 205);
        rect(shapeStartX, cy - shapeH * 0.3, w, shapeH * 0.08);
        rect(shapeStartX, cy + shapeH * 0.1, w, shapeH * 0.08);

      } else if (i === 4) {
        fill(44, 44, 44);
        let boxW = w * 0.28;
        let gap  = w * 0.08;
        for (let j = 0; j < 3; j++) {
          rect(shapeStartX + j * (boxW + gap), cy - shapeH * 0.4, boxW, shapeH * 0.7);
        }
      }
    }
  }

  if (t >= coverStart) {
    let prog    = constrain((t - coverStart) / (coverEnd - coverStart), 0, 1);
    let ease    = prog * prog * (3 - 2 * prog);
    let coverH  = ease * height;

    noStroke();
    fill(75, 0, 130);
    rect(0, 0, width, coverH);
  }

  if (t >= endFrame) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  대괄호
// ─────────────────────────────────────────────────────
const BRACKET_DURATION = 120;

function drawBracketAnim() {
  if (t < BRACKET_DURATION) t++;

  let moveEnd   = 25;
  let pauseEnd  = 14;
  let mergeEnd  = 80; 
   let endFrame = mergeEnd + 30;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let fontSize     = width * 0.13;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  let helloY = height * 0.5 - fontSize * 0.5;
  let cx     = width * 0.5;
  let cy     = height * 0.5;

  let ellipseW = width  * 0.75; 
  let ellipseH = height * 0.55; 

  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= pauseEnd) {
    let localT = t - pauseEnd;
    let prog   = constrain(localT / (mergeEnd - pauseEnd), 0, 1);
    let ease   = prog * prog * prog;

    let leftX  = lerp(-ellipseW, cx, ease);
    let rightX = lerp(width + ellipseW, cx, ease);

    // 합쳐진 후 퍼져나가며 사라짐
    let expandProg  = constrain((t - mergeEnd) / 20, 0, 1);
    let expandEase  = expandProg * expandProg;
    let expandW     = ellipseW * (1 + expandEase * 0.5);
    let expandH     = ellipseH * (1 + expandEase * 0.5);
    let alpha       = t > mergeEnd ? map(t, mergeEnd, mergeEnd + 20, 255, 0) : 255;

    noStroke();
    fill(0, 0, 205, alpha);

    if (t < mergeEnd) {
      // 합쳐지는 단계
      push();
      translate(leftX, cy);
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(-ellipseW, -ellipseH, ellipseW, ellipseH * 2);
      drawingContext.clip();
      ellipse(0, 0, ellipseW * 2, ellipseH * 2);
      drawingContext.restore();
      pop();

      push();
      translate(rightX, cy);
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(0, -ellipseH, ellipseW, ellipseH * 2);
      drawingContext.clip();
      ellipse(0, 0, ellipseW * 2, ellipseH * 2);
      drawingContext.restore();
      pop();

    } else {
      ellipse(cx, cy, expandW * 2, expandH * 2);
    }
  }

  if (t >= endFrame) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  밑줄
// ─────────────────────────────────────────────────────
const UNDERSCORE_DURATION = 130;

function drawUnderscoreAnim() {
  if (t < UNDERSCORE_DURATION) t++;

  let moveEnd   = 25;
  let pauseEnd  = 31;
  let fadeStart = 100;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX = width * 0.5 - totalW * 0.5;
  let helloStartY = height * 0.5 - width * 0.065;
  let fontSize     = width * 0.13;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  let helloY = height * 0.5 - fontSize * 0.5;

  let count     = 6;  
  let rotSpeed  = 0.025; 
  let rotation  = t * rotSpeed; 

  let shapeW1 = width  * 0.06;
  let shapeW2 = width  * 0.10; 
  let shapeH  = height * 0.18; 
  let dist    = width  * 0.22; 

  let alpha = t > fadeStart
    ? map(t, fadeStart, UNDERSCORE_DURATION, 255, 0)
    : 255;

  if (t >= pauseEnd) {
    let lx = width  * 0.08;
    let ly = height * 0.85;

    for (let i = 0; i < count; i++) {
      let angle = (TWO_PI / count) * i + rotation;
      push();
      translate(lx + cos(angle) * dist, ly + sin(angle) * dist);
      rotate(angle + HALF_PI);
      noStroke();
      fill(220, 20, 60, alpha);
      beginShape();
      vertex(-shapeW1 / 2, -shapeH / 2);
      vertex( shapeW1 / 2, -shapeH / 2);
      vertex( shapeW2 / 2,  shapeH / 2);
      vertex(-shapeW2 / 2,  shapeH / 2);
      endShape(CLOSE);
      pop();
    }
  }

  if (t >= pauseEnd) {
    let rx = width  * 0.92;
    let ry = height * 0.15;

    for (let i = 0; i < count; i++) {
      let angle = (TWO_PI / count) * i - rotation; 
      push();
      translate(rx + cos(angle) * dist, ry + sin(angle) * dist);
      rotate(angle + HALF_PI);
      noStroke();
      fill(220, 20, 60, alpha);
      beginShape();
      vertex(-shapeW1 / 2, -shapeH / 2);
      vertex( shapeW1 / 2, -shapeH / 2);
      vertex( shapeW2 / 2,  shapeH / 2);
      vertex(-shapeW2 / 2,  shapeH / 2);
      endShape(CLOSE);
      pop();
    }
  }

  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= UNDERSCORE_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  물결표
// ─────────────────────────────────────────────────────
const TILDE_DURATION = 180;

function drawTildeAnim() {
  if (t < TILDE_DURATION) t++;

  let lineEnd   = 20; 
  let fadeStart = 155;

  let fontSize  = width * 0.13;
  let hX        = width * 0.07; 
  let hY        = height * 0.28;
  let lineY  = height * 0.62; 
  let waveY = hY + fontSize + (lineY - hY - fontSize) * 0.5;
  let circles = [
    { x: width * 0.20, baseY: lineY + height * 0.08, delay: 22 },
    { x: width * 0.33, baseY: lineY + height * 0.14, delay: 38 },
    { x: width * 0.47, baseY: lineY + height * 0.07, delay: 54 },
    { x: width * 0.65, baseY: lineY + height * 0.06, delay: 70 },
  ];
  let circleR = width * 0.025;

  push();
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  let hW = textWidth('H');
  let eW = textWidth('E');
  let l1W = textWidth('L');
  let l2W = textWidth('L');
  let oW = textWidth('O');
  pop();

  let initX = {
    H: hX,
    E: hX + hW,
    L1: hX + hW + eW,
    L2: hX + hW + eW + l1W,
    O: hX + hW + eW + l1W + l2W,
  };

  let eTarget1  = circles[0].x;
  let l1Target1 = eTarget1 + eW;
  let l2Target1 = l1Target1 + l1W;
  let oTarget1  = l2Target1 + l2W;

  let l1Target2 = circles[1].x;
  let l2Target2 = l1Target2 + l1W;
  let oTarget2  = l2Target2 + l2W;

  let l2Target3 = circles[2].x;
  let oTarget3  = l2Target3 + l2W;

  let oTarget4 = circles[3].x;

  function getLetterX(initPos, targets, delays) {
    let x    = initPos;
    let from = initPos;
    for (let i = 0; i < targets.length; i++) {
      let localT = max(0, t - delays[i]);
      let prog   = constrain(localT / 15, 0, 1);
      let ease   = 1 - pow(1 - prog, 3);
      x = lerp(from, targets[i], ease);
      if (prog >= 1) {
        from = targets[i];
        continue;
      }
      break;
    }
    return x;
  }

  function getBounceY(delays) {
    let bounceY = 0;
    for (let i = 0; i < delays.length; i++) {
      let localT = max(0, t - delays[i]);
      if (localT <= 0) continue;
      let bounce = sin(localT * 0.35) * exp(-localT * 0.1);
      bounceY = -abs(bounce) * height * 0.04;
    }
    return bounceY;
  }

  let eX  = getLetterX(initX.E,  [eTarget1],  [circles[0].delay]);
  let l1X = getLetterX(initX.L1, [l1Target1, l1Target2], [circles[0].delay, circles[1].delay]);
  let l2X = getLetterX(initX.L2, [l2Target1, l2Target2, l2Target3], [circles[0].delay, circles[1].delay, circles[2].delay]);
  let oX  = getLetterX(initX.O,  [oTarget1, oTarget2, oTarget3, oTarget4], [circles[0].delay, circles[1].delay, circles[2].delay, circles[3].delay]);

  let waveEndX;
  if (t < circles[0].delay) {
    waveEndX = hX + hW; 
  } else if (t < circles[1].delay) {
    waveEndX = eX + eW; 
  } else if (t < circles[2].delay) {
    waveEndX = l1X + l1W; 
  } else if (t < circles[3].delay) {
    waveEndX = l2X + l2W; 
  } else {
    waveEndX = oX + oW; 
  }

  let alpha = t > fadeStart ? map(t, fadeStart, TILDE_DURATION, 255, 0) : 255;

  let lineProg = constrain(t / lineEnd, 0, 1);
  let lineEase = 1 - pow(1 - lineProg, 3);
  noStroke();
  fill(44, 44, 44, alpha);
  rect(0, lineY, width * lineEase, height * 0.008);

  for (let i = 0; i < circles.length; i++) {
    let c      = circles[i];
    let localT = max(0, t - c.delay);
    if (localT <= 0) continue;

   let bounce = sin(localT * 0.25) * exp(-localT * 0.08);
    let cy     = c.baseY - abs(bounce) * height * 0.08;

    noStroke();
    fill(220, 20, 60, alpha);
    circle(c.x, cy, circleR * 2);
  }

  let eBounce  = getBounceY([circles[0].delay]);
  let l1Bounce = getBounceY([circles[0].delay, circles[1].delay]);
  let l2Bounce = getBounceY([circles[0].delay, circles[1].delay, circles[2].delay]);
  let oBounce  = getBounceY([circles[0].delay, circles[1].delay, circles[2].delay, circles[3].delay]);

  noStroke();
  fill(44, 44, 44, alpha);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  text('H', hX,  hY);
  text('E', eX,  hY + eBounce);
  text('L', l1X, hY + l1Bounce);
  text('L', l2X, hY + l2Bounce);
  text('O', oX,  hY + oBounce);

  if (t >= lineEnd) {
    let waveStartX = hX;
    let waveAmp  = height * 0.018; 
    let waveFreq = width  * 0.045; 
    
    stroke(255, 215, 0, alpha);
    strokeWeight(width * 0.006);
    noFill();
    beginShape();
    for (let x = waveStartX; x <= waveEndX; x += 2) {
      let y = waveY + sin((x / waveFreq) * TWO_PI) * waveAmp;
      vertex(x, y);
    }
    endShape();
  }

  if (t >= TILDE_DURATION) resetToIdle();
}

function drawGuideText() {
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(width * 0.018);
  fill(180);
  noStroke();
  textFont('Noto Sans KR, sans-serif');
  text('문장 부호를 입력하고 Enter키를 누르세요.', width / 2, height * 0.09);
}

function drawHello(str) {
  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let totalW = textWidth(str);
  pop();
  
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(width * 0.13);
  fill(44, 44, 44);
  noStroke();
  textFont('Noto Sans KR, sans-serif');
  let startX = width * 0.5 - totalW * 0.5;
  text(str, startX, height * 0.5 - width * 0.065);
}

function resetToIdle() {
  state = 'idle';
  inputChar = '';
  t = 0;
  cursorVisible = true;
  lastBlink = millis();
  qParticles = [];
  exParticles = [];
  colonParticles = [];
}

function keyPressed() {
  if (state === 'animating') return;

  if (key === '.') {
    inputChar = '.';
    state = 'input';
  } else if (key === '?') {
    inputChar = '?';
    state = 'input';
  } else if (key === '!') {
    inputChar = '!';
    state = 'input';
    } else if (key === ',') {
    inputChar = ',';
    state = 'input';
    } else if (key === '/') {
    inputChar = '/';
    state = 'input';
    } else if (key === ':') {
    inputChar = ':';
    state = 'input';
      } else if (key === '"') {
    inputChar = '"';
    state = 'input';
      } else if (key === "'") {
    inputChar = "'";
    state = 'input';
     } else if (key === '-') {
    inputChar = '-';
    state = 'input';
     } else if (key === '<' || key === '>') {
    inputChar = key;
    state = 'input';
     } else if (key === '(' || key === ')') {
    inputChar = key;
    state = 'input';
      } else if (key === '{' || key === '}') {
    inputChar = key;
    state = 'input';
      } else if (key === '[' || key === ']') {
    inputChar = key;
    state = 'input';
      } else if (key === '_') {
    inputChar = '_';
    state = 'input';
      } else if (key === '~') {
    inputChar = '~';
    state = 'input';
  } else if (keyCode === ENTER) {
    if (state === 'input') {
      menuOpen   = false;
      menuTarget = 0;
      setTimeout(function() {
        state = 'animating';
        t = 0;
      }, 450); 
    }
  }
}

// ─────────────────────────────────────────────────────
//  목록
// ─────────────────────────────────────────────────────
const MENU_ITEMS = [
  '. 마침표', '? 물음표', '! 느낌표', ', 쉼표',
  '/ 빗금', '() 소괄호', '{} 중괄호', '[] 대괄호',
  '" 큰따옴표', "' 작은따옴표", '– 붙임표',
  ': 쌍점', '~ 물결표', '_ 밑줄', '< > 홀화살괄호'
];
let menuScrollY  = 0;
let menuScrollTarget = 0;

function drawMenu() {
  let panelW = width * 0.28;
  let panelH = height;

  let panelX = -panelW + menuSlide * panelW;

  noStroke();
  fill(255);
  rect(panelX, 0, panelW, panelH);

  stroke(44, 44, 44);
  strokeWeight(1.5);
  line(panelX + panelW, 0, panelX + panelW, panelH);

  let itemH    = panelH * 0.075;
  let fontSize = width * 0.022;
  let visibleH = panelH - itemH;

  menuScrollY = lerp(menuScrollY, menuScrollTarget, 0.15);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(panelX, 0, panelW, visibleH);
  drawingContext.clip();

  for (let i = 0; i < MENU_ITEMS.length; i++) {
    let itemY = i * itemH - menuScrollY;
    if (itemY + itemH < 0 || itemY > visibleH) continue;

    stroke(200);
    strokeWeight(1);
    line(panelX, itemY + itemH, panelX + panelW, itemY + itemH);

    noStroke();
    fill(44, 44, 44);
    textAlign(LEFT, CENTER);
    textStyle(NORMAL);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(MENU_ITEMS[i], panelX + panelW * 0.08, itemY + itemH * 0.5);
  }

  drawingContext.restore();

  noStroke();
  fill(255);
  rect(panelX, panelH - itemH, panelW, itemH);
  stroke(200);
  strokeWeight(1);
  line(panelX, panelH - itemH, panelX + panelW, panelH - itemH);

  drawMenuIcon(panelX + panelW * 0.65, panelH - itemH * 0.5, fontSize);
  noStroke();
  fill(44, 44, 44);
  textAlign(RIGHT, CENTER);
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  text('목록', panelX + panelW * 0.92, panelH - itemH * 0.5);
}

function drawMenuIcon(x, y, size) {
  noStroke();
  fill(44, 44, 44);
  let lineW = size * 1.8;
  let lineH = size * 0.18;
  let gap   = size * 0.5;
  rect(x - lineW * 0.5, y - gap - lineH * 0.5,   lineW, lineH);
  rect(x - lineW * 0.5, y - lineH * 0.5,          lineW, lineH);
  rect(x - lineW * 0.5, y + gap - lineH * 0.5,    lineW, lineH);
}

function drawMenuButton() {
  let bx      = width * 0.02;
  let by      = height * 0.92;
  let fontSize = width * 0.025;

  drawMenuIcon(bx + fontSize * 0.5, by, fontSize);
  noStroke();
  fill(44, 44, 44);
  textAlign(LEFT, CENTER);
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  text('목록', bx + fontSize * 2.2, by);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseWheel(event) {
  if (!menuOpen) return;
  let panelW   = width * 0.28;
  let itemH    = height * 0.075;
  let maxScroll = MENU_ITEMS.length * itemH - (height - itemH);
  menuScrollTarget = constrain(menuScrollTarget + event.delta, 0, maxScroll);
  return false;
}