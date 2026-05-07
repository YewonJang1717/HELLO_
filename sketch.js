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
const C_PURP = [75, 0, 130];
const C_NAVY = [0,  0, 205];

// ── 마침표 막대 정의 ──────────────────────────────────
const BARS = [
  { yRatio:0.46,  hRatio:0.008, xRatio:0.44, wRatio:0.55, color:C_DARK, speed:0.9,  delay:2  },
  { yRatio:0.76,  hRatio:0.006, xRatio:0.52, wRatio:0.47, color:C_DARK, speed:1.1,  delay:5  },
  { yRatio:0.53,  hRatio:0.038, xRatio:0.0,  wRatio:0.52, color:C_NAVY, speed:0.85, delay:8  },
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
    } else if (inputChar === ':') {
      drawColonAnim();
    } else if (inputChar === '"') {
      drawQuoteAnim();
    } else if (inputChar === "'") {
      drawSingleQuoteAnim();
    } else if (inputChar === '-') {
      drawHyphenAnim();
    } else if (inputChar === '<' || inputChar === '>') {
      drawAngleAnim();
    } else if (inputChar === '(' || inputChar === ')') {
      drawParenAnim();
    } else if (inputChar === '{' || inputChar === '}') {
      drawBraceAnim();
    } else if (inputChar === '[' || inputChar === ']') {
      drawBracketAnim();
    } else if (inputChar === '_') {
      drawUnderscoreAnim();
    } else if (inputChar === '~') {
      drawTildeAnim();
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
      color: [154, 205, 50],
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
      color: [220, 20, 60],
      alpha: 255
    });
    
    // 제일 안쪽 초록 선 레이어 추가
 let outCount = 8; // 원하는 개수로 조절
  for (let i = 0; i < outCount; i++) {
    let angle = (TWO_PI / outCount) * i;
    let innerSpeed = width * 0.008; // 제일 느림
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

  // 제일 바깥쪽 주황 원 레이어 추가
  let outerCount = 20; // 원하는 개수로 조절
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
    let speed = width * 0.006; // 조금만 날아감
    qParticles.push({
      type: 'letter',
      char: letters[i],
      x: lx, y: ly,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      bounceT: 0,
      landed: false,
      landX: lx + cos(angle) * width * 0.06, // 착지 위치
      landY: ly + sin(angle) * width * 0.06,
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
      if (!p.landed) {
        // 착지 위치로 이동
        p.x = lerp(p.x, p.landX, 0.25);
        p.y = lerp(p.y, p.landY, 0.25);
        if (dist(p.x, p.y, p.landX, p.landY) < 2) {
          p.landed = true;
        }
      } else {
        // 착지 후 통통 튀기
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
//  느낌표 애니메이션
// ─────────────────────────────────────────────────────
function initExclamationAnim() {
  exParticles = [];

  let cx = width * 0.5;
  let cy = height * 0.5;

 // 고리 3개 - 각기 다른 랜덤 위치
  let ringColors = [
    [220, 20, 60],
    [45, 45, 45],
    [220, 20, 60],
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
  [173, 216, 230],    // 시안
  [147, 112, 219],  // 보라
  [173, 216, 230],
  [147, 112, 219],
  [173, 216, 230],
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
 let hY = height * 0.15;

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
  { color: [147, 112, 219], dir:  1 }, // 보라 ↗
  { color: [255, 215, 0], dir: -1 }, // 노랑 ↘
  { color: [147, 112, 219], dir:  1 }, // 보라 ↗
  { color: [255, 215, 0], dir: -1 }, // 노랑 ↘
  { color: [147, 112, 219], dir:  1 }, // 보라 ↗
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

  // 글자 목표 위치 
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

   if (t >= pauseEnd + 2 * lineDelay && !slashLetters[3].scattered) {
    slashLetters[3].scattered    = true;
    slashLetters[3].scatterFrame = t;
  }
  if (t >= pauseEnd + 3 * lineDelay && !slashLetters[4].scattered) {
    slashLetters[4].scattered    = true;
    slashLetters[4].scatterFrame = t;
  }

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
   if (i < 3) {
      if (progress >= 0.01 && !slashLetters[i].scattered) {
        slashLetters[i].scattered    = true;
        slashLetters[i].scatterFrame = t;
      }
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
//  쌍점 애니메이션
// ─────────────────────────────────────────────────────
const COLON_DURATION = 120;

let colonParticles = [];

function initColonAnim() {
  colonParticles = [];
  let cx = width * 0.5;
  let cy = height * 0.5;

  // 직선 6개 - 두께와 길이 각각 다르게
  let lines = [
    { angle: -2.4,  color: [147, 112, 219], speed: width * 0.022, len: width * 0.18, thick: width * 0.018 }, // 연보라 (좌상)
    { angle: -0.4,  color: [173, 216, 230], speed: width * 0.025, len: width * 0.10, thick: width * 0.012 }, // 시안 (우상)
    { angle:  0.6,  color: [75, 0, 130],  speed: width * 0.020, len: width * 0.22, thick: width * 0.022 }, // 진보라 (우하 큰 것)
    { angle:  2.0,  color: [75, 0, 130],  speed: width * 0.018, len: width * 0.16, thick: width * 0.018 }, // 진보라 (좌하)
    { angle:  2.6,  color: [154, 205, 50],  speed: width * 0.023, len: width * 0.08, thick: width * 0.030 }, // 초록 (짧고 두꺼운)
    { angle: -1.0,  color: [45,   45, 45],  speed: width * 0.021, len: width * 0.20, thick: width * 0.030 }, // 검정 (두껍고 긴)
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

  // 호 4개 - 크기와 두께 각각 다르게
  let arcs = [
    { angle: -PI * 0.9, span: PI * 0.55, color: [173, 216, 230], speed: width * 0.020, r: width * 0.18, thick: width * 0.012 }, // 시안 큰 호
    { angle: PI * 0.10, span: PI * 0.45, color: [255, 215, 0], speed: width * 0.018, r: width * 0.12, thick: width * 0.035 }, // 주황 두꺼운 호
    { angle:  PI * 0.6, span: PI * 0.40, color: [173, 216, 230], speed: width * 0.022, r: width * 0.14, thick: width * 0.018 }, // 하늘 호
    { angle: -PI * 0.4, span: PI * 0.45, color: [220, 20, 60], speed: width * 0.019, r: width * 0.16, thick: width * 0.012 }, // 빨강 호
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
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  // ── 노란 원 (HELLO보다 먼저 그려서 아래 레이어) ──────
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

      let splitAngle = -PI / 6; // 갈라지는 선 각도

      noStroke();
      fill(255, 215, 0);

      // 왼쪽 조각 → 왼쪽으로 날아감
      push();
      translate(cx - offset, cy); // 순수하게 왼쪽으로만 이동
      arc(0, 0, r * 2, r * 2,
          splitAngle + HALF_PI,
          splitAngle + HALF_PI + PI);
      pop();

      // 오른쪽 조각 → 오른쪽으로 날아감
      push();
      translate(cx + offset, cy); // 순수하게 오른쪽으로만 이동
      arc(0, 0, r * 2, r * 2,
          splitAngle - HALF_PI,
          splitAngle + HALF_PI);
      pop();
    }
  }
   // ── 선들 퍼져나감 ───────────────────
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
  // ── HELLO 그리기 (원보다 위 레이어) ─────────────────
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
    fill(45);
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
//  큰따옴표 애니메이션
// ─────────────────────────────────────────────────────
const QUOTE_DURATION = 130;

// 직선 3개 정의
const QUOTE_BARS = [
  { color: [0, 0, 205], hRatio: 0.022, yOffset: 0.08  }, // 파랑 (두꺼움)
  { color: [45,   45,  45], hRatio: 0.006, yOffset: 0.135 }, // 검정 (얇음)
  { color: [220, 20, 60], hRatio: 0.030, yOffset: 0.185 }, // 빨강 (두꺼움)
];


function drawQuoteAnim() {
  if (t < QUOTE_DURATION) t++;

  let moveEnd    = 25;
  let barEnd     = 60;
  let wedgeStart = 65;

  // ── HELLO 위치 계산 ───────────────────────────────────
  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
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
  let helloBotY = helloY + fontSize * 0.85; // HELLO 바로 아래

  // ── HELLO 그리기 ─────────────────────────────────────
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
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  // ── 직선 3개: HELLO 바로 아래, O 끝 기준으로 오른쪽으로 사라짐 ──
// ── 직선 3개: H보다 왼쪽에서 시작, O 끝에서 사라짐 ──
  if (t >= moveEnd) {
     let bars = [
      { color: [30, 100, 220], h: height * 0.025, y: helloBotY + height * 0.04  },
      { color: [45,  45,  45], h: height * 0.006, y: helloBotY + height * 0.08  },
      { color: [220, 30,  30], h: height * 0.032, y: helloBotY + height * 0.11  },
    ];

    for (let i = 0; i < 3; i++) {
      let bar    = bars[i];
      let delay  = i * 4;
      let localT = max(0, t - moveEnd - delay);
      let prog   = constrain(localT / 35, 0, 1);
      let ease   = prog * prog;
      let moveX  = ease * width * 2.0;

      // 시작점: H보다 왼쪽
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

  // ── 빵빠레: 양옆에서 위→아래 순서로 ────────
 if (t >= wedgeStart) {
    let wedgeT   = t - wedgeStart;
    let wedgeMaxLen = width * 0.6; // 화면 밖까지 충분히 길게
    let lTipX    = centerStartX - width * 0.02;
    let rTipX    = centerStartX + totalW + width * 0.02;
    let tipY     = helloY + fontSize * 0.5;
    let innerH   = height * 0.10; // 안쪽 변 두께
    
    // 3개 동시에, delay 없음
    let prog  = constrain(wedgeT / 18, 0, 1);
    let ease  = 1 - pow(1 - prog, 3);
    let len   = ease * wedgeMaxLen;

    // 3개의 중심 각도 (위/중/아래)
    let angles = [-PI * 0.28, 0, PI * 0.28];
    let spread = 0.28; // 각 사각형의 퍼지는 범위

    noStroke();
    fill(45);

    // 화면 밖으로 클리핑
    drawingContext.save();
for (let i = 0; i < 3; i++) {
      let delay  = i * 10; // 위→아래 순서로
      let localT = max(0, wedgeT - delay);
      let prog   = constrain(localT / 18, 0, 1);
      let ease   = 1 - pow(1 - prog, 3);
      let len    = ease * wedgeMaxLen;

      let a = angles[i];

      // 왼쪽: 안쪽 끝에서 왼쪽 바깥으로 뻗어나감
      // 안쪽 변의 위아래 좌표
      let lInnerTopX = lTipX;
      let lInnerTopY = tipY + sin(a - spread * 0.1) * innerH;
      let lInnerBotX = lTipX;
      let lInnerBotY = tipY + sin(a + spread * 0.1) * innerH;
      // 바깥쪽 변 (화면 밖까지)
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

      // 오른쪽: 안쪽 끝에서 오른쪽 바깥으로 뻗어나감
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
//  작은따옴표 애니메이션
// ─────────────────────────────────────────────────────
const SQ_DURATION = 130;

// 원 4개 정의 (O 오른쪽 기준 위치, 크기)
// 1번 이미지 기준: 작→중→중→대 순서로 대각선 방향 배치
const SQ_BUBBLES = [
  { dx: 0.03, dy:  0.02, r: 0.012, delay: 0  }, // 제일 작은
  { dx: 0.02, dy:  0.09, r: 0.020, delay: 8  }, // 작은
  { dx: 0.09, dy:  0.06, r: 0.032, delay: 16 }, // 중간
  { dx: 0.10, dy: -0.07, r: 0.045, delay: 24 }, // 큰
];


function drawSingleQuoteAnim() {
  if (t < SQ_DURATION) t++;
  
  let SQ_ELLIPSE_ANGLES = [
    PI * 0.65,   // 제일 작은: 아래쪽
    PI * 0.35,   // 작은: 우하향
    PI * 0.1,    // 중간: 거의 수평
    -PI * 0.25,  // 큰: 우상향
  ];

  let fadeEnd    = 30;  // 회색으로 변하는 구간
  let bubbleEnd  = 80;  // 원 등장 완료
  let ellipseStart = 85; // 타원으로 변하기 시작

  // ── HELLO 색상: 진한회색 → 연한회색 ─────────────────
  let grayVal;
  if (t <= fadeEnd) {
    let prog = constrain(t / fadeEnd, 0, 1);
    let ease = prog * prog;
    // 45(진한회색) → 100(중간회색) → 180(연한회색) 두 단계
    if (prog < 0.5) {
      grayVal = lerp(45, 100, prog * 2);
    } else {
      grayVal = lerp(100, 180, (prog - 0.5) * 2);
    }
  } else {
    grayVal = 180;
  }

  // HELLO 위치 (첫 화면 위치 그대로)
  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters     = ['H', 'E', 'L', 'L', 'O'];
  let offsets     = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  let oRightX = width * 0.07 + offsets[4] + textWidth('O');
  let helloCY = height * 0.28 + width * 0.13 * 0.5;
  pop();

  // HELLO 그리기
  noStroke();
  fill(grayVal);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  text('HELLO', width * 0.07, height * 0.28);

  // ── 원들 뿅뿅뿅 등장 ─────────────────────────────────
  if (t >= fadeEnd) {
    for (let i = 0; i < SQ_BUBBLES.length; i++) {
      let b      = SQ_BUBBLES[i];
      let localT = max(0, t - fadeEnd - b.delay);
      if (localT <= 0) continue;

      let bx = oRightX + width  * b.dx;
      let by = helloCY + height * b.dy;
      let r  = width * b.r;

      if (t < ellipseStart) {
        // 원 등장: 크기 0에서 뿅
        let prog = constrain(localT / 12, 0, 1);
        let ease = 1 - pow(1 - prog, 3);
        let cr   = ease * r;
        noStroke();
        fill(180);
        circle(bx, by, cr * 2);

      } else {
        // 타원으로 변하며 퍼짐
        let ellipseT = t - ellipseStart;
        let prog     = constrain(ellipseT / 20, 0, 1);
        let ease     = 1 - pow(1 - prog, 3);

        // 원 → 타원: 가로는 길어지고 세로는 줄어듦
        let rW = lerp(r, r * 3.5, ease); // 가로 반지름
        let rH = lerp(r, r * 0.35, ease); // 세로 반지름

        // 퍼져나가는 거리
        let dist = ease * (width * 0.06 + r * 1.5);

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
//  붙임표 애니메이션
// ─────────────────────────────────────────────────────
const HYPHEN_DURATION = 120;

function drawHyphenAnim() {
  if (t < HYPHEN_DURATION) t++;

  let moveEnd  = 25;
  let pauseEnd = 31;

  // ── HELLO 위치 계산 ───────────────────────────────────
  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
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
  let boxH     = fontSize * 1.1; // 박스 높이 = 글자 높이
  let boxTop   = helloY - fontSize * 0.05; // 박스 상단 y

  // ── 빨간 박스: HELLO보다 먼저 그려서 아래 레이어 ────────
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
      let currentH = ease * boxH; // 클리핑 대신 높이를 키우는 방식

      let bx = centerStartX + offsets[i] + gap * 0.5;
      let bw = charWidths[i] - gap;

      noStroke();
      fill(220, 20, 60);
      rect(bx, boxTop, bw, currentH);
    }
  }

  // ── HELLO 그리기 (박스보다 위 레이어) ───────────────────
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
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= HYPHEN_DURATION) resetToIdle();
}
//  홀화살괄호 애니메이션
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
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
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

  // 이미지 기준 사각형 정의
  // { x, y, w, h, delay } (비율 기준)
 // HELLO의 실제 좌표 계산
  let helloLeft  = centerStartX;
  let helloRight = centerStartX + totalW;
  let helloTop   = helloY;
  let helloBotY  = helloY + fontSize;
  let pad        = fontSize * 0.2; 

  // 이미지 기준으로 HELLO 크기에 비례한 사각형 정의
  let rects = [
    // 가로 막대
    { x: helloLeft  + totalW * 0.1,  y: helloTop  - pad * 4.5, w: totalW * 0.72, h: fontSize * 0.38, delay: 0  }, // 위 큰 가로
    { x: helloLeft  - totalW * 0.05, y: helloTop  - pad * 1.5, w: totalW * 0.80, h: fontSize * 0.06, delay: 15 }, // 위 얇은 가로
    { x: helloLeft  + totalW * 0.04, y: helloBotY + pad * 0.5, w: totalW * 0.55, h: fontSize * 0.38, delay: 5  }, // 아래 큰 가로
    { x: helloLeft  + totalW * 0.28, y: helloBotY + pad * 3.0, w: totalW * 0.38, h: fontSize * 0.05, delay: 20 }, // 아래 얇은 가로

    // 좌측 세로 막대
    { x: helloLeft  - pad * 8.0, y: helloTop  - pad * 3.0, w: fontSize * 0.10, h: fontSize * 2.80, delay: 8  }, // 좌 긴 것
    { x: helloLeft  - pad * 5.0, y: helloTop  - pad * 0.5, w: fontSize * 0.12, h: fontSize * 1.30, delay: 18 }, // 좌 중간
    { x: helloLeft  - pad * 3.2, y: helloTop  + pad * 0.5, w: fontSize * 0.10, h: fontSize * 0.90, delay: 25 }, // 좌 짧은 것

    // 우측 세로 막대
    { x: helloRight + pad * 1.2, y: helloTop  - pad * 1.5, w: fontSize * 0.10, h: fontSize * 1.60, delay: 3  }, // 우 긴 것
    { x: helloRight + pad * 2.8, y: helloTop  - pad * 5.0, w: fontSize * 0.12, h: fontSize * 3.20, delay: 12 }, // 우 중간
    { x: helloRight + pad * 4.5, y: helloTop  + pad * 0.5, w: fontSize * 0.10, h: fontSize * 1.30, delay: 22 }, // 우 짧은 것
  ];
  // ── 사각형들 그리기 (HELLO보다 먼저 → 아래 레이어) ──────
 if (t >= pauseEnd) {
    for (let r of rects) {
      let localT = max(0, t - pauseEnd - r.delay);
      if (localT <= 0) continue;
      let prog = constrain(localT / 12, 0, 1);
      let ease = 1 - pow(1 - prog, 3);

      // r.x, r.y, r.w, r.h는 이미 픽셀값이므로 width/height 곱하지 않음
      let rw = r.w * ease;
      let rh = r.h * ease;

      noStroke();
      fill(45);
      rect(
        r.x + (r.w - rw) * 0.5,
        r.y + (r.h - rh) * 0.5,
        rw, rh
      );
    }
  }
  // ── HELLO 그리기 (위 레이어) ─────────────────────────
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
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= ANGLE_DURATION) resetToIdle();
}// ─────────────────────────────────────────────────────
//  소괄호 애니메이션
// ─────────────────────────────────────────────────────
const PAREN_DURATION = 140;

// 원 정의 (HELLO 중심 기준 상대 위치)
// dx: HELLO 왼쪽/오른쪽 끝에서의 거리 비율, dy: 세로 위치
const PAREN_BUBBLES = [
  // 왼쪽 원들 (dx 음수 = 왼쪽)
  { side: 'L', dx: -0.18, dy: -0.02, r: 0.048, delay: 0  }, // 큰 원
  { side: 'L', dx: -0.10, dy:  0.06, r: 0.032, delay: 8  }, // 중간 원
  { side: 'L', dx: -0.08, dy: -0.08, r: 0.022, delay: 16 }, // 작은 원
  { side: 'L', dx: -0.14, dy: -0.12, r: 0.012, delay: 24 }, // 아주 작은 원
  // 오른쪽 원들 (dx 양수 = 오른쪽)
  { side: 'R', dx:  0.10, dy:  0.06, r: 0.042, delay: 4  }, // 큰 원
  { side: 'R', dx:  0.06, dy: -0.06, r: 0.028, delay: 12 }, // 중간 원
  { side: 'R', dx:  0.14, dy: -0.04, r: 0.018, delay: 20 }, // 작은 원
  { side: 'R', dx:  0.18, dy:  0.00, r: 0.010, delay: 28 }, // 아주 작은 원
];

function drawParenAnim() {
  if (t < PAREN_DURATION) t++;

  let moveEnd    = 25;
  let pauseEnd   = 31;
  let bubbleEnd  = 80;  // 원 등장 완료
  let gatherStart = 85; // 원들이 모여들기 시작

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
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

  // ── 원들 그리기 ───────────────────────────────────────
  if (t >= pauseEnd) {
    for (let b of PAREN_BUBBLES) {
      let localT = max(0, t - pauseEnd - b.delay);
      if (localT <= 0) continue;

      // 원의 기준 위치
      let baseX = b.side === 'L'
        ? helloLeft  + width  * b.dx
        : helloRight + width  * b.dx;
      let baseY = helloCY + height * b.dy;
      let r     = width * b.r;

      let bx, by;

      if (t < gatherStart) {
        // 등장: 크기 0에서 뿅
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

        // 2번 이미지 기준으로 각 원의 목표 위치를 명시적으로 지정
      let targets = {
          // 왼쪽
          'L0': { tx: helloLeft - fontSize * 0.7,  ty: helloCY + fontSize * 0.15 },
          'L1': { tx: helloLeft - fontSize * 0.25, ty: helloCY + fontSize * 0.90 },
          'L2': { tx: helloLeft - fontSize * 0.35, ty: helloCY - fontSize * 0.45 },
          'L3': { tx: helloLeft - fontSize * 0.75, ty: helloCY - fontSize * 0.55 },
          // 오른쪽
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

  // ── HELLO 그리기 ─────────────────────────────────────
  for (let i = 0; i < letters.length; i++) {
    let x, y;
    if (t <= moveEnd) {
      let prog = constrain(t / moveEnd, 0, 1);
      let ease = prog * prog * (3 - 2 * prog);
      x = lerp(helloStartX + offsets[i], centerStartX + offsets[i], ease);
      y = lerp(helloStartY, helloY, ease);
    } else if (t >= gatherStart) {
      // 원이 모여들 때 HELLO도 약간 가운데로 압축
      let gatherT = t - gatherStart;
      let prog    = constrain(gatherT / 30, 0, 1);
      let ease    = prog * prog * (3 - 2 * prog);
      // 각 글자가 중앙으로 살짝 모임
      let targetX = width * 0.5 - textWidth(letters[i]) * 0.5;
      x = lerp(centerStartX + offsets[i], targetX, ease * 0.3);
      y = helloY;
    } else {
      x = centerStartX + offsets[i];
      y = helloY;
    }
    noStroke();
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= PAREN_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  중괄호 애니메이션
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

  let letterEnd  = 50;  // 글자 내려오기 완료
  let shapeStart = 55;  // 요소 뻗어나오기 시작
  let shapeEnd   = 100; // 요소 완료
  let coverStart = 105; // 배경 내려오기 시작
  let coverEnd   = 135; // 배경 완전히 덮음
  let endFrame   = 141; // 0.1초(6프레임) 후 종료

  let letters   = ['H', 'E', 'L', 'L', 'O'];
  let fontSize  = min(width * 0.13, height * 0.16); // 높이 기준으로도 제한
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

  // 요소 시작 x (글자 오른쪽)
  push();
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  let charWidths = letters.map(l => textWidth(l));
  pop();

  let shapeStartX = hX + charWidths[0] + width * 0.03;
  let shapeEndX   = width * 0.83;
  let shapeH      = fontSize * 0.55; // 요소 높이

  // ── 글자 그리기 ───────────────────────────────────────
   for (let i = 0; i < letters.length; i++) {
    let y = i === 0 ? hY : getLetterY(i, t, hY, fontSize, targetYs); // 인자 추가
    if (y < -fontSize) continue;
    noStroke();
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], hX, y);
  }

  // ── 요소들 뻗어나오기 ─────────────────────────────────
  if (t >= shapeStart) {
    for (let i = 0; i < 5; i++) {
      let delay  = i * 6;
      let localT = max(0, t - shapeStart - delay);
      if (localT <= 0) continue;

      let prog = constrain(localT / 15, 0, 1);
      let ease = 1 - pow(1 - prog, 3);
      let cy   = targetYs[i] + fontSize * 0.25; // 각 글자 세로 중앙
      let w    = ease * (shapeEndX - shapeStartX);

      noStroke();

      if (i === 0) {
        // H: 노란 사각형
        fill(255, 215, 0);
        rect(shapeStartX, cy - shapeH * 0.5, w, shapeH);

      } else if (i === 1) {
        // E: 보라색 양끝 둥근 사각형
        fill(147, 112, 219);
        rect(shapeStartX, cy - shapeH * 0.3, w, shapeH * 0.6, shapeH * 0.3);

      } else if (i === 2) {
        // L(위): 검정 직선 2개
        fill(45, 45, 45);
        rect(shapeStartX, cy - shapeH * 0.3, w, shapeH * 0.08);
        rect(shapeStartX, cy + shapeH * 0.1, w, shapeH * 0.08);

      } else if (i === 3) {
        // L(아래): 파란 직선 2개
        fill(0, 0, 205);
        rect(shapeStartX, cy - shapeH * 0.3, w, shapeH * 0.08);
        rect(shapeStartX, cy + shapeH * 0.1, w, shapeH * 0.08);

      } else if (i === 4) {
        // O: 진보라 짧은 사각형 3개
        fill(45, 45, 45);
        let boxW = w * 0.22;
        let gap  = w * 0.12;
        for (let j = 0; j < 3; j++) {
          rect(shapeStartX + j * (boxW + gap), cy - shapeH * 0.4, boxW, shapeH * 0.7);
        }
      }
    }
  }

  // ── 연보라 배경이 위에서 내려옴 ──────────────────────
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
//  대괄호 애니메이션
// ─────────────────────────────────────────────────────
const BRACKET_DURATION = 120;

function drawBracketAnim() {
  if (t < BRACKET_DURATION) t++;

  let moveEnd   = 25;
  let pauseEnd  = 31;
  let mergeEnd  = 80; // 합쳐짐 완료
   let endFrame = mergeEnd + 24;

  push();
  textSize(width * 0.13);
  textFont('Noto Sans KR, sans-serif');
  let letters      = ['H', 'E', 'L', 'L', 'O'];
  let totalW       = textWidth('HELLO');
  let centerStartX = width * 0.5 - totalW * 0.5;
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
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

  // 타원 크기
  let ellipseW = width  * 0.75; // 완성된 타원 가로 반지름
  let ellipseH = height * 0.55; // 완성된 타원 세로 반지름

  // ── HELLO 그리기 (타원보다 아래 레이어) ──────────────
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
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  // ── 타원 그리기 (HELLO보다 위 레이어) ────────────────
  if (t >= pauseEnd) {
    let localT = t - pauseEnd;
    let prog   = constrain(localT / (mergeEnd - pauseEnd), 0, 1);
    // easeInQuad: 처음엔 느리다가 점점 빠르게
    let ease   = prog * prog * prog;

    // 왼쪽 반타원: 화면 왼쪽 끝에서 중앙으로 이동
    // 시작: cx - ellipseW (화면 왼쪽 밖), 끝: cx
    let leftX  = lerp(-ellipseW, cx, ease);
    // 오른쪽 반타원: 화면 오른쪽 끝에서 중앙으로 이동
    let rightX = lerp(width + ellipseW, cx, ease);

    noStroke();
    fill(0, 0, 205); // 파란색

    // 왼쪽 반타원 (오른쪽 절반만 보임 → 왼쪽이 평평)
    push();
    translate(leftX, cy);
    // 클리핑: x <= 0 부분만 그림 (오른쪽 절반)
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(-ellipseW, -ellipseH, ellipseW, ellipseH * 2);
    drawingContext.clip();
    ellipse(0, 0, ellipseW * 2, ellipseH * 2);
    drawingContext.restore();
    pop();

    // 오른쪽 반타원 (왼쪽 절반만 보임 → 오른쪽이 평평)
    push();
    translate(rightX, cy);
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(0, -ellipseH, ellipseW, ellipseH * 2);
    drawingContext.clip();
    ellipse(0, 0, ellipseW * 2, ellipseH * 2);
    drawingContext.restore();
    pop();
  }

  if (t >= endFrame) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  밑줄 애니메이션
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
  let helloStartX  = width * 0.07;
  let helloStartY  = height * 0.28 + width * 0.13 * 0.5;
  let fontSize     = width * 0.13;
  let offsets      = [];
  for (let i = 0; i < letters.length; i++) {
    let ox = 0;
    for (let j = 0; j < i; j++) ox += textWidth(letters[j]);
    offsets.push(ox);
  }
  pop();

  let helloY = height * 0.5 - fontSize * 0.5;

  // 방사형 도형 개수와 회전 속도
  let count     = 6;   // 도형 개수
  let rotSpeed  = 0.025; // 회전 속도 (라디안/프레임)
  let rotation  = t * rotSpeed; // 현재 회전각

  // 도형 크기
  let shapeW1 = width  * 0.06; // 짧은 변
  let shapeW2 = width  * 0.10; // 긴 변
  let shapeH  = height * 0.18; // 높이
  let dist    = width  * 0.22; // 중심에서 도형까지 거리

  let alpha = t > fadeStart
    ? map(t, fadeStart, UNDERSCORE_DURATION, 255, 0)
    : 255;

  // ── 좌측 하단 방사형 ──────────────────────────────────
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
      // 이등변사각형 (위쪽이 좁고 아래쪽이 넓은)
      beginShape();
      vertex(-shapeW1 / 2, -shapeH / 2);
      vertex( shapeW1 / 2, -shapeH / 2);
      vertex( shapeW2 / 2,  shapeH / 2);
      vertex(-shapeW2 / 2,  shapeH / 2);
      endShape(CLOSE);
      pop();
    }
  }

  // ── 우측 상단 방사형 ──────────────────────────────────
  if (t >= pauseEnd) {
    let rx = width  * 0.92;
    let ry = height * 0.15;

    for (let i = 0; i < count; i++) {
      let angle = (TWO_PI / count) * i - rotation; // 반대 방향
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

  // ── HELLO 그리기 ─────────────────────────────────────
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
    fill(45);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(fontSize);
    textFont('Noto Sans KR, sans-serif');
    text(letters[i], x, y);
  }

  if (t >= UNDERSCORE_DURATION) resetToIdle();
}
// ─────────────────────────────────────────────────────
//  물결표 애니메이션
// ─────────────────────────────────────────────────────
const TILDE_DURATION = 180;

function drawTildeAnim() {
  if (t < TILDE_DURATION) t++;

  let lineEnd   = 20;  // 검은 직선 완성
  let fadeStart = 155;

  let fontSize  = width * 0.13;
  let hX        = width * 0.07; // H 고정 위치
  let hY        = height * 0.28;
  let lineY  = height * 0.62; // 0.28+fontSize*1.05 → 더 아래로
  let waveY = hY + fontSize + (lineY - hY - fontSize) * 0.5;
  let circles = [
    { x: width * 0.20, baseY: lineY + height * 0.08, delay: 22 },
    { x: width * 0.33, baseY: lineY + height * 0.14, delay: 38 },
    { x: width * 0.47, baseY: lineY + height * 0.07, delay: 54 },
    { x: width * 0.65, baseY: lineY + height * 0.06, delay: 70 },
  ];
  let circleR = width * 0.025;

  // 각 원이 나타날 때 글자 이동 타이밍
  // 원 1 등장 → ello 이동 (e가 원1 x위치까지)
  // 원 2 등장 → llo 이동 (l이 원2 x위치까지)
  // 원 3 등장 → lo 이동 (l이 원3 x위치까지)
  // 원 4 등장 → o 이동 (o가 원4 x위치까지)

  push();
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  let hW = textWidth('H');
  let eW = textWidth('E');
  let l1W = textWidth('L');
  let l2W = textWidth('L');
  let oW = textWidth('O');
  pop();

  // 각 글자의 초기 x위치
  let initX = {
    H: hX,
    E: hX + hW,
    L1: hX + hW + eW,
    L2: hX + hW + eW + l1W,
    O: hX + hW + eW + l1W + l2W,
  };

  // 각 글자의 목표 x위치 계산
  // 원1: e가 circles[0].x 에 도달
  let eTarget1  = circles[0].x;
  let l1Target1 = eTarget1 + eW;
  let l2Target1 = l1Target1 + l1W;
  let oTarget1  = l2Target1 + l2W;

  // 원2: l1이 circles[1].x 에 도달
  let l1Target2 = circles[1].x;
  let l2Target2 = l1Target2 + l1W;
  let oTarget2  = l2Target2 + l2W;

  // 원3: l2가 circles[2].x 에 도달
  let l2Target3 = circles[2].x;
  let oTarget3  = l2Target3 + l2W;

  // 원4: o가 circles[3].x 에 도달
  let oTarget4 = circles[3].x;

  // 각 글자의 현재 x 위치 계산
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

  // 글자별 y 오프셋 (통통 튀는 효과)
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

  // 물결선 끝 x좌표 = O의 오른쪽 끝
  let waveEndX;
  if (t < circles[0].delay) {
    waveEndX = hX + hW; // H까지
  } else if (t < circles[1].delay) {
    waveEndX = eX + eW; // E까지
  } else if (t < circles[2].delay) {
    waveEndX = l1X + l1W; // L까지
  } else if (t < circles[3].delay) {
    waveEndX = l2X + l2W; // L까지
  } else {
    waveEndX = oX + oW; // O까지
  }

  let alpha = t > fadeStart ? map(t, fadeStart, TILDE_DURATION, 255, 0) : 255;

  // ── 검은 직선 ─────────────────────────────────────────
  let lineProg = constrain(t / lineEnd, 0, 1);
  let lineEase = 1 - pow(1 - lineProg, 3);
  noStroke();
  fill(45, 45, 45, alpha);
  rect(0, lineY, width * lineEase, height * 0.008);

  // ── 빨간 원 (통통 튀는 효과) ─────────────────────────
  for (let i = 0; i < circles.length; i++) {
    let c      = circles[i];
    let localT = max(0, t - c.delay);
    if (localT <= 0) continue;

    // 튀는 효과: sin으로 위아래 진동하다가 안정
   let bounce = sin(localT * 0.25) * exp(-localT * 0.08);
    let cy     = c.baseY - abs(bounce) * height * 0.08;

    noStroke();
    fill(220, 20, 60, alpha);
    circle(c.x, cy, circleR * 2);
  }

  // ── HELLO 글자 ────────────────────────────────────────
  let eBounce  = getBounceY([circles[0].delay]);
  let l1Bounce = getBounceY([circles[0].delay, circles[1].delay]);
  let l2Bounce = getBounceY([circles[0].delay, circles[1].delay, circles[2].delay]);
  let oBounce  = getBounceY([circles[0].delay, circles[1].delay, circles[2].delay, circles[3].delay]);

  noStroke();
  fill(45, 45, 45, alpha);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(fontSize);
  textFont('Noto Sans KR, sans-serif');
  text('H', hX,  hY);
  text('E', eX,  hY + eBounce);
  text('L', l1X, hY + l1Bounce);
  text('L', l2X, hY + l2Bounce);
  text('O', oX,  hY + oBounce);
  // ── 물결선 (HELLO 길이에 맞게) ───────────────────────
  if (t >= lineEnd) {
    let waveStartX = hX;
    let waveAmp  = height * 0.018; // 진폭 작게
    let waveFreq = width  * 0.045; // 주기 길게
    
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
  colonParticles = [];
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