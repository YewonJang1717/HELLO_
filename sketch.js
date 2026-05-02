// ── 상태 관리 ─────────────────────────────────────────
let state = 'idle';
let inputChar = '';

// ── 커서 깜빡임 ───────────────────────────────────────
let cursorVisible = true;
let lastBlink = 0;
const BLINK_INTERVAL = 530;

// ── 애니메이션 공통 변수 ──────────────────────────────
let t = 0;
const DURATION = 90;

// ── 마침표 색상 ───────────────────────────────────────
const C_DARK = [45,  45,  45];
const C_BLUE = [20,  20, 220];
const C_PURP = [100, 30, 140];
const C_NAVY = [30,  30, 180];

// ── 마침표 막대 정의 ──────────────────────────────────
const BARS = [
  { yRatio:0.46,  hRatio:0.008, xRatio:0.44, wRatio:0.55, color:C_DARK, speed:0.9,  delay:2  },
  { yRatio:0.76,  hRatio:0.006, xRatio:0.52, wRatio:0.47, color:C_DARK, speed:1.1,  delay:5  },
  { yRatio:0.53,  hRatio:0.038, xRatio:0.0,  wRatio:0.52, color:C_BLUE, speed:0.85, delay:8  },
  { yRatio:0.595, hRatio:0.05,  xRatio:0.05, wRatio:0.31, color:C_PURP, speed:0.95, delay:3  },
  { yRatio:0.595, hRatio:0.04,  xRatio:0.53, wRatio:0.25, color:C_PURP, speed:1.05, delay:6  },
  { yRatio:0.665, hRatio:0.065, xRatio:0.3,  wRatio:0.41, color:C_NAVY, speed:0.8,  delay:10 },
];

// ── 파티클 배열 ───────────────────────────────────────
let qParticles = [];
let exParticles = [];

// ─────────────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// ─────────────────────────────────────────────────────
function draw() {
  background(255);

  if (state === 'idle') {
    drawIdleScreen();
  } else if (state === 'input') {
    drawInputScreen();
  } else if (state === 'animating') {
    if (inputChar === '.') {
      drawPeriodAnim();
    } else if (inputChar === '?') {
      drawQuestionAnim();
    } else if (inputChar === '!') {
      drawExclamationAnim();
    } else if (inputChar === ',') {
      drawCommaAnim();
    } else if (inputChar === '/') {
      drawSlashAnim();
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
    textSize(width * 0.13);
    textFont('Noto Sans KR, sans-serif');
    let helloWidth = textWidth('HELLO');
    let cursorX = width * 0.07 + helloWidth + width * 0.012;
    let cursorY = height * 0.28 + width * 0.13 * 0.75;
    noStroke();
    fill(45);
    rect(cursorX, cursorY, width * 0.055, width * 0.008);
  }
}

// ─────────────────────────────────────────────────────
//  입력 화면
// ─────────────────────────────────────────────────────
function drawInputScreen() {
  drawGuideText();
  drawHello('HELLO' + inputChar);
}

// ─────────────────────────────────────────────────────
//  마침표 애니메이션
// ─────────────────────────────────────────────────────
function drawPeriodAnim() {
  if (t < DURATION) t++;

  let commonRightEdge = width * (BARS[0].xRatio + BARS[0].wRatio);

  let shrink = constrain(t / (DURATION * 0.25), 0, 1);
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
//  물음표 애니메이션
// ─────────────────────────────────────────────────────
function initQuestionAnim() {
  qParticles = [];

  let cx = width * 0.05;
  let cy = height * 0.95;
  let directions = 12;

  for (let i = 0; i < directions; i++) {
    let angle = (TWO_PI / directions) * i;

    // 초록 선
    let lineSpeed = width * 0.018;
    qParticles.push({
      type: 'line',
      x: cx, y: cy,
      vx: cos(angle) * lineSpeed,
      vy: sin(angle) * lineSpeed,
      len: width * 0.05,
      lineAngle: angle,
      color: [30, 180, 80],
      alpha: 255
    });

    // 주황 작은 원
    let smallSpeed = width * 0.013;
    qParticles.push({
      type: 'circle',
      x: cx, y: cy,
      vx: cos(angle) * smallSpeed,
      vy: sin(angle) * smallSpeed,
      r: width * 0.010,
      color: [230, 130, 0],
      alpha: 255
    });

    // 노란 큰 원 (3방향마다)
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

  // H, E, L, L, O
  let letters = ['H', 'E', 'L', 'L', 'O'];
 push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let helloStartX = width * 0.07;
  let helloStartY = height * 0.28 + width * 0.13 * 0.5;

  for (let i = 0; i < letters.length; i++) {
    let offsetX = 0;
    for (let j = 0; j < i; j++) {
      offsetX += textWidth(letters[j]);
    }
    let lx = helloStartX + offsetX;
    let ly = helloStartY;
    let angle = atan2(ly - cy, lx - cx);
    let speed = width * 0.008;
    qParticles.push({
      type: 'letter',
      char: letters[i],
      x: lx, y: ly,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      rotate: random(-0.03, 0.03),
      currentAngle: random(-0.2, 0.2),
      size: width * 0.09,
      color: [45, 45, 45],
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
      p.currentAngle += p.rotate * 0.05;
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
//  느낌표 애니메이션
// ─────────────────────────────────────────────────────
function initExclamationAnim() {
  exParticles = [];

  let cx = width * 0.5;
  let cy = height * 0.5;

 // 고리 3개 - 각기 다른 랜덤 위치
  let ringColors = [
    [220, 30, 30],
    [45, 45, 45],
    [220, 30, 30],
  ];
  for (let i = 0; i < 3; i++) {
    exParticles.push({
      type: 'ring',
      x: width  * random(0.3, 0.7),
      y: height * random(0.3, 0.7),
      outerR: width * 0.06,   // 바깥 반지름 시작값
      innerR: 0,              // 안쪽 투명 영역 시작값
      outerSpeed: width * 0.014, // 바깥 팽창 속도
      innerSpeed: width * 0.019, // 안쪽이 더 빠름 → 얇아지다 사라짐
      color: ringColors[i],
      alpha: 255
    });
  }
  
  // 삼각형 8개 - 랜덤 방향, 크고 박력있게
  let triColors = [
    [220, 30,  30],
    [220, 30,  30],
    [230, 130,  0],
    [230, 130,  0],
    [100, 60,   0],
    [100, 60,   0],
    [220, 30,  30],
    [230, 130,  0],
  ];
  for (let i = 0; i < 8; i++) {
    // 8등분 각도 기준으로 랜덤성 추가 (같은 방향 방지)
    let baseAngle = (TWO_PI / 8) * i;
    let angle = baseAngle + random(-0.3, 0.3); // 살짝만 랜덤
    let speed = random(width * 0.025, width * 0.038); // 더 빠르게
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
  // H, E, L, L, O
  let letters = ['H', 'E', 'L', 'L', 'O'];
  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let helloStartX = width * 0.07;
  let helloStartY = height * 0.28 + width * 0.13 * 0.5;
  let totalW = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  

  for (let i = 0; i < letters.length; i++) {
    let offsetX = 0;
    for (let j = 0; j < i; j++) {
      offsetX += textWidth(letters[j]);
    }
    let startX = helloStartX + offsetX;
    let startY = helloStartY;
    let targetX = centerStartX + offsetX;
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
      size: width * 0.09,
      color: [45, 45, 45],
      alpha: 255
    });
  }
}

function drawExclamationAnim() {
  if (t === 0) initExclamationAnim();
  if (t < DURATION) t++;

  let moveEnd   = 25; // HELLO 이동 완료 프레임
  let pauseEnd  = 31; // 잠깐 멈춤 끝 프레임 (약 0.1초)
  let fadeStart = DURATION * 0.65;

  for (let p of exParticles) {
    // 페이드아웃
    if (t > fadeStart) {
      p.alpha = map(t, fadeStart, DURATION, 255, 0);
    }

    // ── 고리 ──────────────────────────────────────
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
    // ── 삼각형 ────────────────────────────────────
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

    // ── HELLO 글자 ────────────────────────────────
    if (p.type === 'letter') {
      if (t <= moveEnd) {
        // 1단계: 원래 위치 → 중앙으로 이동
        let prog = constrain(t / moveEnd, 0, 1);
        let ease = prog * prog * (3 - 2 * prog);
        p.x = lerp(p.startX, p.targetX, ease);
        p.y = lerp(p.startY, p.targetY, ease);
      } else if (t <= pauseEnd) {
        // 2단계: 잠깐 멈춤
        p.x = p.targetX;
        p.y = p.targetY;
      } else {
        // 3단계: 터짐
        if (p.vx === 0 && p.vy === 0) {
          p.vx = cos(p.burstAngle) * p.burstSpeed;
          p.vy = sin(p.burstAngle) * p.burstSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.currentAngle += p.rotate;
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
//  쉼표 애니메이션
// ─────────────────────────────────────────────────────
const COMMA_DURATION = 170;

// 고리 x 위치 비율 (이미지 간격 참고)
const RING_X = [0.25, 0.39, 0.59, 0.70, 0.92];
// 선 색상 (시안, 보라 번갈아)
const BAR_COLORS = [
  [0, 230, 230],    // 시안
  [130, 100, 220],  // 보라
  [0, 230, 230],
  [130, 100, 220],
  [0, 230, 230],
];
const RING_Y    = 0.08;  // 고리 y 위치 비율
const RING_R    = 0.04;  // 고리 반지름 비율
const BAR_W     = 0.025; // 선 너비 비율
const BAR_MAX_H = 0.82;  // 선 최대 높이 비율

// 각 선이 내려오기 시작하는 딜레이
// 간격에 비례: 왼쪽 두 개는 넓으니까 딜레이 크게
const BAR_DELAYS = [0, 12, 24, 34, 42]; // 프레임 단위

function drawCommaAnim() {
  if (t < COMMA_DURATION) t++;

  let ringR     = width * RING_R;
  let barW      = ringR * 2;              // 직선 너비 = 원 지름
  let strokeW   = width * 0.008;          // 외곽선 두께 (원과 직선 동일)
  let ringCY    = height * RING_Y + ringR;

  // ── 1단계: HELLO 세로로 내려옴 (t: 0 ~ 60) ──────────
  let helloEndFrame = 60;
  let letters    = ['H', 'E', 'L', 'L', 'O'];
  let letterSize = height * 0.14;
  let hX         = width * 0.07;
  // H의 고정 위치
 let hY = height * 0.28;

  // H는 항상 제자리
  noStroke();
  fill(45);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(letterSize);
  textFont('Noto Sans KR, sans-serif');
  text('H', hX, hY);

  // E, L, L, O 차례로 H 아래에 붙음 (10프레임 간격)
 for (let i = 1; i < letters.length; i++) {
    let appearFrame = i * 12;
    if (t < appearFrame) continue;

    let localT   = t - appearFrame;
    let progress = constrain(localT / 25, 0, 1);
    let ease     = 1 - (1 - progress) * (1 - progress);
    let targetY  = hY + letterSize * i;
    let startY   = height * 0.28; // 첫 화면 HELLO와 동일한 위치에서 시작
    let y        = lerp(startY, targetY, ease);

    noStroke();
    fill(45);
    text(letters[i], hX, y);
  }
  // 글자 다 내려오기 전엔 도형 그리지 않음
  if (t < helloEndFrame) {
  let lastBarEnd = helloEndFrame + BAR_DELAYS[4] + 35 + 6;
  if (t >= lastBarEnd) resetToIdle();
    return;
  }

  // ── 2단계: 도형 애니메이션 ────────────────────────────
  let shapeT = t - helloEndFrame; // 도형 시작 기준 시간

 // 첫 번째 선의 최종 높이를 기준으로 설정
  let maxBarH = height * BAR_MAX_H;

  for (let i = 0; i < 5; i++) {
    let cx    = width * RING_X[i];
    let delay = BAR_DELAYS[i];

    if (shapeT >= delay) {
      let localT   = shapeT - delay;
      let progress = constrain(localT / 35, 0, 1);
      let ease     = 1 - (1 - progress) * (1 - progress);
      // 모든 선이 동일한 maxBarH까지 내려옴
      let barH     = ease * maxBarH;

      fill(BAR_COLORS[i][0], BAR_COLORS[i][1], BAR_COLORS[i][2]);
      stroke(45);
      strokeWeight(strokeW);
      rect(cx - barW / 2 + strokeW / 2, ringCY, barW - strokeW, barH, barW / 2);
    }
  }

  // 원 나중에 그리기 (직선 위 레이어)
  for (let i = 0; i < 5; i++) {
    let cx = width * RING_X[i];
    fill(255);
    stroke(45);
    strokeWeight(strokeW);
    circle(cx, ringCY, ringR * 2);
  }

  if (t >= COMMA_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  빗금 애니메이션
// ─────────────────────────────────────────────────────
const SLASH_DURATION = 130;

// 선 5개 정의 (방향: 1=우상향, -1=우하향)
const SLASH_LINES = [
  { color: [180, 0, 255], dir:  1 }, // 보라 ↗
  { color: [255, 210, 0], dir: -1 }, // 노랑 ↘
  { color: [180, 0, 255], dir:  1 }, // 보라 ↗
  { color: [255, 210, 0], dir: -1 }, // 노랑 ↘
  { color: [180, 0, 255], dir:  1 }, // 보라 ↗
];

let slashLetters = []; // 흩어지는 HELLO 글자 상태

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
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  // 글자 목표 위치 (선과 겹치지 않게)
  let targets = [
    { x: width * 0.08, y: height * 0.35 }, // H
    { x: width * 0.28, y: height * 0.58 }, // E
    { x: width * 0.42, y: height * 0.24 }, // L
    { x: width * 0.57, y: height * 0.65 }, // L
    { x: width * 0.70, y: height * 0.22 }, // O
  ];

  let letters2 = ['H', 'E', 'L', 'L', 'O'];
  for (let i = 0; i < letters2.length; i++) {
    slashLetters.push({
      char: letters2[i],
      centerX: centerStartX + offsets[i],
      centerY: height * 0.5 - width * 0.065,
      targetX: targets[i].x,
      targetY: targets[i].y,
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
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;

  let offsets = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  // 지그재그 연결점 정의
  // 각 선의 시작점 = 이전 선의 끝점
  let nodes = [
    { x: width * 0.18, y: height * 0.72 },
    { x: width * 0.32, y: height * 0.22 },
    { x: width * 0.46, y: height * 0.72 },
    { x: width * 0.60, y: height * 0.22 },
    { x: width * 0.74, y: height * 0.72 },
    { x: width * 0.88, y: height * 0.22 },
  ];
  // ── 선 그리기 ────────────────────────────────────────
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

    // 선이 글자에 가까워지면 미리 글자 흩어짐
   if (progress >= 0.1 && !slashLetters[i].scattered) {
      slashLetters[i].scattered  = true;
      slashLetters[i].scatterFrame = t;
    }
  }

  // ── HELLO 글자 그리기 ────────────────────────────────
  for (let i = 0; i < letters.length; i++) {
    let sl = slashLetters[i];
    let x, y;

    if (t <= moveEnd) {
      // 원래 위치 → 중앙으로 이동
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], sl.centerX, ease);
      y = lerp(helloStartY, sl.centerY, ease);

    } else if (sl.scattered) {
      // 흩어짐
      let localT = t - sl.scatterFrame;
      let prog   = constrain(localT / 15, 0, 1);
      let ease   = 1 - (1 - prog) * (1 - prog);
      x = lerp(sl.centerX, sl.targetX, ease);
      y = lerp(sl.centerY, sl.targetY, ease);

    } else {
      // 중앙 대기
      x = sl.centerX;
      y = sl.centerY;
    }

    noStroke();
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(width * 0.09);
    textFont('Noto Sans KR, sans-serif');
    text(sl.char, x, y);
  }

  if (t >= SLASH_DURATION) resetToIdle();
}

// ─────────────────────────────────────────────────────
//  공통 함수들
// ─────────────────────────────────────────────────────
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
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(width * 0.13);
  fill(45);
  noStroke();
  textFont('Noto Sans KR, sans-serif');
  text(str, width * 0.07, height * 0.28);
}

function resetToIdle() {
  state = 'idle';
  inputChar = '';
  t = 0;
  cursorVisible = true;
  lastBlink = millis();
  qParticles = [];
  exParticles = [];
}

// ─────────────────────────────────────────────────────
//  키보드 입력
// ─────────────────────────────────────────────────────
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
  } else if (keyCode === ENTER) {
    if (state === 'input') {
      state = 'animating';
      t = 0;
    }
  } else if (keyCode === BACKSPACE) {
    resetToIdle();
  }
}

// ─────────────────────────────────────────────────────
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}