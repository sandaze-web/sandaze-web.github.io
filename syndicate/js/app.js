const html = document.documentElement
const body = document.body
const pageWrapper = document.querySelector('.main')
const header = document.querySelector('.header')
const firstScreen = document.querySelector('[data-observ]')
const burgerButton = document.querySelector('.icon-menu')
const menu = document.querySelector('.menu')
const lockPaddingElements = document.querySelectorAll('[data-lp]')


const toggleBodyLock = (isLock) => {
  FLS(`Попап ${isLock ? 'открыт' : 'закрыт'}`)
  const lockPaddingValue = window.innerWidth - pageWrapper.offsetWidth

  setTimeout(() => {
    if (lockPaddingElements) {
      lockPaddingElements.forEach((element) => {
        element.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
      })
    }
  
    body.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
    body.classList.toggle('lock', isLock)
  }, isLock ? 0 : 500)
}
 // logger (Full Logging System) =================================================================================================================
function FLS(message) {
  setTimeout(() => (window.FLS ? console.log(message) : null), 0)
}

// Проверка браузера на поддержку .webp изображений =================================================================================================================
function isWebp() {
  // Проверка поддержки webp
  const testWebp = (callback) => {
    const webP = new Image()

    webP.onload = webP.onerror = () => callback(webP.height === 2)
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }
  // Добавление класса _webp или _no-webp для HTML
  testWebp((support) => {
    const className = support ? 'webp' : 'no-webp'
    html.classList.add(className)

    FLS(support ? 'webp поддерживается' : 'webp не поддерживается')
  })
}

/* Проверка мобильного браузера */
const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any: () =>
    isMobile.Android() ||
    isMobile.BlackBerry() ||
    isMobile.iOS() ||
    isMobile.Opera() ||
    isMobile.Windows(),
}
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
  // Добавление класса _touch для HTML если браузер мобильный
  if (isMobile.any()) {
    html.classList.add('touch')
  }
}

// Добавление loaded для HTML после полной загрузки страницы
function addLoadedClass() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      html.classList.add('loaded')
    }, 0)
  })
}

// Получение хеша в адресе сайта
const getHash = () => {
  if (location.hash) {
    return location.hash.replace('#', '')
  }
}

// Указание хеша в адресе сайта
function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split('#')[0]
  history.pushState('', '', hash)
}

// Функция для фиксированной шапки при скролле =================================================================================================================
function headerFixed() {
  const headerStickyObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('sticky', !entry.isIntersecting)
  })

  if (firstScreen) {
    headerStickyObserver.observe(firstScreen)
  }
}

// Аккордион =================================================================================================================
function initAccordion(toggleClass, contentClass, toggleActiveClass = (item, content) => {}) {
  const toggles = document.querySelectorAll(`.${toggleClass}`);

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.querySelector(`.${contentClass}`);
      if (content.classList.contains(contentClass)) {
        // Проверяем, раскрыт ли контент
        if (content.style.maxHeight) {
          // Скрываем контент
          content.style.maxHeight = null;

          toggleActiveClass(toggle, content)
        } else {
          // Скрываем все остальные контенты
          document.querySelectorAll(`.${contentClass}`).forEach(item => {
            item.style.maxHeight = null;
          });

          // Раскрываем текущий контент
          content.style.maxHeight = content.scrollHeight + "px";

          toggleActiveClass(toggle, content)
        }
      }
    });
  });
}

// Из img.svg в <svg> Все img.svg внутри класса svg конвертируются в svg =======================================================================================================================================================================================================================
function imgToSvg () {
  $('.svg img').each(function () {
    let $img = $(this);
    let imgID = $img.attr('id');
    let imgClass = $img.attr('class');
    let imgURL = $img.attr('src');

    $.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      let $svg = $(data).find('svg');

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
      if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
        $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
      }

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');

  });
}

// Универсальная функция для открытия и закрытия попапо =================================================================================================================
const togglePopupWindows = () => {
  document.addEventListener('click', ({ target }) => {
    if (target.closest('[data-type]')) {
      const popup = document.querySelector(
        `[data-popup="${target.dataset.type}"]`
      )

      if (document.querySelector('._is-open')) {
        document.querySelectorAll('._is-open').forEach((modal) => {
          modal.classList.remove('_is-open')
        })
      }

      popup.classList.add('_is-open')
      toggleBodyLock(true)
    }

    if (
      target.classList.contains('_overlay-bg') ||
      target.closest('.button-close')
    ) {
      const popup = target.closest('._overlay-bg')

      popup.classList.remove('_is-open')
      toggleBodyLock(false)
    }
  })
}

// Модуль работы с меню (бургер) =======================================================================================================================================================================================================================
const menuInit = () => {
  if (burgerButton) {
    document.addEventListener('click', ({ target }) => {
      if (target.closest('.icon-menu')) {
        html.classList.toggle('menu-open')
        toggleBodyLock(html.classList.contains('menu-open'))
      }
    })
  }
}
const menuOpen = () => {
  toggleBodyLock(true)
  html.classList.add('menu-open')
}
const menuClose = () => {
  toggleBodyLock(false)
  html.classList.remove('menu-open')
}

const initHeroLenticular = (() => {
  const PARAMS = {
    centerX: .5,
    centerY: .5,
    size: 20 + .03587839126586914 * 980,
    amount: 13 * 10,
    seamlessness: .001,
    frost: 0,
    iorDispersion: .37 * .25,
    patternType: 0,
    wrapMode: 3,
  }

  const VERTEX_SHADER = `#version 300 es
    in vec2 aPosition;
    in vec2 aUv;
    out vec2 vUv;

    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vUv = aUv;
    }
  `

  const FRAGMENT_SHADER = `#version 300 es
    precision highp float;
    precision highp int;

    const float PI = 3.14159265358979323846;

    uniform sampler2D uTexture;
    uniform vec2 uDims;
    uniform vec2 uCenter;
    uniform float uAngle;
    uniform float uSize;
    uniform float uAmount;
    uniform float uSeamlessness;
    uniform float uFrost;
    uniform float uIorDispersion;
    uniform int uPatternType;
    uniform int uWrapMode;

    in vec2 vUv;
    out vec4 outColor;

    float saturateValue(float value) {
      return clamp(value, 0.0, 1.0);
    }

    float wave(float value, float frequency, float amplitude) {
      return sin(value * frequency * 2.0 * PI) * amplitude;
    }

    float zigzag(float value, float frequency, float amplitude) {
      float phase = value * frequency;
      return (abs(fract(phase) * 2.0 - 1.0) * 2.0 - 1.0) * amplitude;
    }

    float hash3(vec3 position) {
      vec3 p = fract(position * .3183099 + vec3(.1));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float valueNoise(vec3 position) {
      vec3 integerPart = floor(position);
      vec3 fractionPart = fract(position);
      vec3 curve = fractionPart * fractionPart * (3.0 - 2.0 * fractionPart);

      return mix(
        mix(
          mix(hash3(integerPart), hash3(integerPart + vec3(1.0, 0.0, 0.0)), curve.x),
          mix(hash3(integerPart + vec3(0.0, 1.0, 0.0)), hash3(integerPart + vec3(1.0, 1.0, 0.0)), curve.x),
          curve.y
        ),
        mix(
          mix(hash3(integerPart + vec3(0.0, 0.0, 1.0)), hash3(integerPart + vec3(1.0, 0.0, 1.0)), curve.x),
          mix(hash3(integerPart + vec3(0.0, 1.0, 1.0)), hash3(integerPart + vec3(1.0, 1.0, 1.0)), curve.x),
          curve.y
        ),
        curve.z
      );
    }

    float patternHeight(vec2 point) {
      float angleCos = cos(uAngle);
      float angleSin = sin(uAngle);
      mat2 patternRotation = mat2(angleCos, angleSin, -angleSin, angleCos);
      vec2 position = patternRotation * (point - uCenter) / uSize;
      float wavePosition = position.y;

      if (uPatternType == 2) {
        position.x += wave(wavePosition, .15, .6);
      } else if (uPatternType == 1) {
        position.x += zigzag(wavePosition, .15, .6);
      }

      vec2 gridPosition = fract(position) * 2.0 - 1.0;
      float height = 1.0;

      if (uPatternType <= 2) {
        height = pow(sin((gridPosition.x * .5 + .5) * PI), .7);
      } else if (uPatternType == 3) {
        height = 1.0 - dot(gridPosition, gridPosition);
      } else if (uPatternType == 4) {
        vec2 absoluteUv = abs(gridPosition);
        height = 1.0 - max(absoluteUv.x, absoluteUv.y) * dot(gridPosition, gridPosition) * .8;
      } else if (uPatternType == 5) {
        vec2 distanceToSquare = abs(gridPosition * 1.125) - vec2(.5);
        height = 1.0 - saturateValue(length(max(distanceToSquare, vec2(0.0))) + max(distanceToSquare.x, distanceToSquare.y));
      }

      height = saturateValue(height);
      height *= pow(height, uSeamlessness);

      if (uFrost > .0001) {
        height += (valueNoise(vec3(point * .5, 1.0)) - .5) * uFrost;
      }

      return height;
    }

    vec3 patternNormal(vec2 point) {
      float height = patternHeight(point);
      vec2 offset = vec2(.125, 0.0);
      float horizontalHeight = patternHeight(point + offset.xy);
      float verticalHeight = patternHeight(point + offset.yx);
      return normalize(vec3(height - vec2(horizontalHeight, verticalHeight), .0125));
    }

    vec4 sampleWithWrap(vec2 pixelPosition) {
      vec2 sampleUv = pixelPosition / uDims;

      if (uWrapMode == 0) {
        if (sampleUv.x < 0.0 || sampleUv.x > 1.0 || sampleUv.y < 0.0 || sampleUv.y > 1.0) {
          return vec4(0.0);
        }
        return textureLod(uTexture, clamp(sampleUv, vec2(0.0), vec2(1.0)), 0.0);
      }

      if (uWrapMode == 1) {
        return textureLod(uTexture, clamp(sampleUv, vec2(0.0), vec2(1.0)), 0.0);
      }

      if (uWrapMode == 2) {
        return textureLod(uTexture, fract(sampleUv), 0.0);
      }

      vec2 mirrorPhase = fract(sampleUv * .5) * 2.0;
      vec2 mirrored = vec2(
        mirrorPhase.x > 1.0 ? 2.0 - mirrorPhase.x : mirrorPhase.x,
        mirrorPhase.y > 1.0 ? 2.0 - mirrorPhase.y : mirrorPhase.y
      );
      return textureLod(uTexture, clamp(mirrored, vec2(0.0), vec2(1.0)), 0.0);
    }

    void main() {
      vec2 localPosition = vUv * uDims;
      vec3 ray = vec3(0.0, 0.0, -1.0);
      float iorRed = 1.333 + uIorDispersion;
      float iorGreen = 1.333;
      float iorBlue = 1.333 - uIorDispersion;
      vec4 accumulated = vec4(0.0);

      for (int x = 0; x < 6; x++) {
        for (int y = 0; y < 6; y++) {
          vec2 offset = vec2(float(x), float(y)) / 6.0 - vec2(5.0 / 12.0);
          vec2 samplePosition = localPosition + offset;
          vec3 normal = patternNormal(samplePosition);
          vec3 redDirection = refract(ray, normal, iorRed);
          vec3 greenDirection = refract(ray, normal, iorGreen);
          vec3 blueDirection = refract(ray, normal, iorBlue);
          vec4 red = sampleWithWrap(localPosition + redDirection.xy * uAmount);
          vec4 green = sampleWithWrap(localPosition + greenDirection.xy * uAmount);
          vec4 blue = sampleWithWrap(localPosition + blueDirection.xy * uAmount);

          accumulated += vec4(red.r, green.g, blue.b, green.a);
        }
      }

      outColor = accumulated / 36.0;
    }
  `

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Lenticular shader compilation failed: ${message}`)
    }

    return shader
  }

  const createProgram = (gl) => {
    const program = gl.createProgram()
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw new Error(`Lenticular shader linking failed: ${message}`)
    }

    return program
  }

  const waitForImage = (image) => {
    if (image.complete && image.naturalWidth) return Promise.resolve()
    if (image.decode) return image.decode().catch(() => undefined)

    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true })
      image.addEventListener('error', resolve, { once: true })
    })
  }

  return function initHeroLenticular() {
    const hero = document.querySelector('.hero')
    const canvas = hero?.querySelector('.hero__lenticular')
    const visual = hero?.querySelector('.hero__visual')
    const images = visual ? [...visual.querySelectorAll('img')] : []

    if (!hero || !canvas || !visual || !images.length) {
      hero?.classList.remove('hero--lenticular-loading')
      return
    }

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    })

    if (!gl) {
      hero.classList.remove('hero--lenticular-loading')
      return
    }

    let program

    try {
      program = createProgram(gl)
    } catch (error) {
      console.warn(error)
      hero.classList.remove('hero--lenticular-loading')
      return
    }

    const sourceCanvas = document.createElement('canvas')
    const sourceContext = sourceCanvas.getContext('2d', { alpha: false })
    const vertexBuffer = gl.createBuffer()
    const texture = gl.createTexture()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frameId = 0
    let lastFrameTime = 0
    let textureReady = false
    let isVisible = true
    let needsResize = true
    let scale = 1

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0,
    ]), gl.STATIC_DRAW)

    gl.useProgram(program)

    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    const uvLocation = gl.getAttribLocation(program, 'aUv')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(uvLocation)
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0)
    gl.uniform1f(gl.getUniformLocation(program, 'uAngle'), 0)
    gl.uniform1f(gl.getUniformLocation(program, 'uSeamlessness'), PARAMS.seamlessness)
    gl.uniform1f(gl.getUniformLocation(program, 'uFrost'), PARAMS.frost)
    gl.uniform1f(gl.getUniformLocation(program, 'uIorDispersion'), PARAMS.iorDispersion)
    gl.uniform1i(gl.getUniformLocation(program, 'uPatternType'), PARAMS.patternType)
    gl.uniform1i(gl.getUniformLocation(program, 'uWrapMode'), PARAMS.wrapMode)

    const resize = () => {
      const width = Math.max(hero.clientWidth, 1)
      const height = Math.max(hero.clientHeight, 1)
      scale = Math.min(1, 1600 / width)
      const renderWidth = Math.max(Math.round(width * scale), 1)
      const renderHeight = Math.max(Math.round(height * scale), 1)

      if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth
        canvas.height = renderHeight
        sourceCanvas.width = renderWidth
        sourceCanvas.height = renderHeight
        textureReady = false
      }

      gl.viewport(0, 0, renderWidth, renderHeight)
      gl.uniform2f(gl.getUniformLocation(program, 'uDims'), renderWidth, renderHeight)
      gl.uniform2f(gl.getUniformLocation(program, 'uCenter'), renderWidth * PARAMS.centerX, renderHeight * PARAMS.centerY)
      gl.uniform1f(gl.getUniformLocation(program, 'uSize'), PARAMS.size * scale)
      gl.uniform1f(gl.getUniformLocation(program, 'uAmount'), PARAMS.amount * scale)
      needsResize = false
    }

    const drawInput = () => {
      const heroRect = hero.getBoundingClientRect()
      const width = sourceCanvas.width
      const height = sourceCanvas.height
      sourceContext.setTransform(1, 0, 0, 1, 0, 0)
      sourceContext.fillStyle = '#000000'
      sourceContext.fillRect(0, 0, width, height)

      images.forEach((image) => {
        if (!image.complete || !image.naturalWidth) return
        const imageRect = image.getBoundingClientRect()
        const x = (imageRect.left - heroRect.left) * scale
        const y = (imageRect.top - heroRect.top) * scale
        const width = imageRect.width * scale
        const height = imageRect.height * scale
        const blur = Number(image.dataset.blur || 0) * scale

        sourceContext.save()
        sourceContext.filter = blur ? `blur(${blur}px)` : 'none'

        if (image.hasAttribute('data-flip-x')) {
          sourceContext.translate(x + width, y)
          sourceContext.scale(-1, 1)
          sourceContext.drawImage(image, 0, 0, width, height)
        } else {
          sourceContext.drawImage(image, x, y, width, height)
        }

        sourceContext.restore()
      })
    }

    const render = (time = 0) => {
      frameId = 0

      if (!isVisible && hero.classList.contains('hero--lenticular-ready')) return
      if (!reducedMotion && time - lastFrameTime < 32) {
        frameId = requestAnimationFrame(render)
        return
      }

      lastFrameTime = time
      if (needsResize) resize()
      drawInput()
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      if (textureReady) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
        textureReady = true
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      hero.classList.add('hero--lenticular-ready')
      hero.classList.remove('hero--lenticular-loading')

      if (!reducedMotion && isVisible) frameId = requestAnimationFrame(render)
    }

    const requestRender = () => {
      if (!frameId) frameId = requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(() => {
      needsResize = true
      requestRender()
    })
    resizeObserver.observe(hero)

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) requestRender()
    })
    visibilityObserver.observe(hero)

    window.addEventListener('pageshow', requestRender)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) requestRender()
    })

    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      if (frameId) cancelAnimationFrame(frameId)
      hero.classList.remove('hero--lenticular-ready')
    })

    Promise.all(images.map(waitForImage)).then(requestRender)
  }
})()

const initTimelineLenticular = (() => {
  const PARAMS = {
    centerX: .5,
    centerY: .5,
    angle: -47.48 * Math.PI / 180,
    size: 20 + .088 * 980,
    amount: 50 * 10,
    seamlessness: .001,
    iorDispersion: .08 * .25,
    sourceBlur: 10,
    sourceOffsetX: -.12,
    sourceOffsetY: .1,
    mobileSourceOffsetX: -.12,
    mobileSourceOffsetY: -.16,
  }

  const VERTEX_SHADER = `#version 300 es
    in vec2 aPosition;
    in vec2 aUv;
    out vec2 vUv;

    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
      vUv = aUv;
    }
  `

  const FRAGMENT_SHADER = `#version 300 es
    precision highp float;

    const float PI = 3.14159265358979323846;

    uniform sampler2D uTexture;
    uniform vec2 uDims;
    uniform vec2 uCenter;
    uniform float uAngle;
    uniform float uSize;
    uniform float uAmount;
    uniform float uSeamlessness;
    uniform float uIorDispersion;

    in vec2 vUv;
    out vec4 outColor;

    float patternHeight(vec2 point) {
      float angleCos = cos(uAngle);
      float angleSin = sin(uAngle);
      mat2 patternRotation = mat2(angleCos, angleSin, -angleSin, angleCos);
      vec2 position = patternRotation * (point - uCenter) / uSize;
      float gridPosition = fract(position.x) * 2.0 - 1.0;
      float height = pow(sin((gridPosition * .5 + .5) * PI), .7);
      height = clamp(height, 0.0, 1.0);
      return height * pow(max(height, .000001), uSeamlessness);
    }

    vec3 patternNormal(vec2 point) {
      float height = patternHeight(point);
      vec2 offset = vec2(.125, 0.0);
      float horizontalHeight = patternHeight(point + offset.xy);
      float verticalHeight = patternHeight(point + offset.yx);
      return normalize(vec3(height - vec2(horizontalHeight, verticalHeight), .0125));
    }

    vec4 sampleMirrored(vec2 pixelPosition) {
      vec2 sampleUv = pixelPosition / uDims;
      vec2 mirrorPhase = fract(sampleUv * .5) * 2.0;
      vec2 mirrored = vec2(
        mirrorPhase.x > 1.0 ? 2.0 - mirrorPhase.x : mirrorPhase.x,
        mirrorPhase.y > 1.0 ? 2.0 - mirrorPhase.y : mirrorPhase.y
      );
      return textureLod(uTexture, clamp(mirrored, vec2(0.0), vec2(1.0)), 0.0);
    }

    void main() {
      vec2 localPosition = vUv * uDims;
      vec3 ray = vec3(0.0, 0.0, -1.0);
      float iorRed = 1.333 + uIorDispersion;
      float iorGreen = 1.333;
      float iorBlue = 1.333 - uIorDispersion;
      vec4 accumulated = vec4(0.0);

      for (int x = 0; x < 6; x++) {
        for (int y = 0; y < 6; y++) {
          vec2 offset = vec2(float(x), float(y)) / 6.0 - vec2(5.0 / 12.0);
          vec2 samplePosition = localPosition + offset;
          vec3 normal = patternNormal(samplePosition);
          vec3 redDirection = refract(ray, normal, iorRed);
          vec3 greenDirection = refract(ray, normal, iorGreen);
          vec3 blueDirection = refract(ray, normal, iorBlue);
          vec4 red = sampleMirrored(localPosition + redDirection.xy * uAmount);
          vec4 green = sampleMirrored(localPosition + greenDirection.xy * uAmount);
          vec4 blue = sampleMirrored(localPosition + blueDirection.xy * uAmount);
          accumulated += vec4(red.r, green.g, blue.b, green.a);
        }
      }

      outColor = accumulated / 36.0;
    }
  `

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Timeline lenticular shader compilation failed: ${message}`)
    }

    return shader
  }

  const createProgram = (gl) => {
    const program = gl.createProgram()
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw new Error(`Timeline lenticular shader linking failed: ${message}`)
    }

    return program
  }

  return function initTimelineLenticular() {
    const timeline = document.querySelector('.timeline')
    const canvas = timeline?.querySelector('.timeline__glass')
    const source = timeline?.querySelector('.timeline__glass-source')

    if (!timeline || !canvas || !source) return

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    timeline.classList.toggle('timeline--ios', isIOS)

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    })

    if (!gl) return

    let program

    try {
      program = createProgram(gl)
    } catch (error) {
      console.warn(error)
      return
    }

    const sourceCanvas = document.createElement('canvas')
    const sourceContext = sourceCanvas.getContext('2d')
    const vertexBuffer = gl.createBuffer()
    const texture = gl.createTexture()
    let textureReady = false
    let frameId = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0,
    ]), gl.STATIC_DRAW)

    gl.useProgram(program)

    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    const uvLocation = gl.getAttribLocation(program, 'aUv')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(uvLocation)
    gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)

    gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0)
    gl.uniform1f(gl.getUniformLocation(program, 'uAngle'), PARAMS.angle)
    gl.uniform1f(gl.getUniformLocation(program, 'uSeamlessness'), PARAMS.seamlessness)
    gl.uniform1f(gl.getUniformLocation(program, 'uIorDispersion'), PARAMS.iorDispersion)

    const render = () => {
      frameId = 0

      if (!source.complete || !source.naturalWidth) return

      const cssWidth = Math.max(canvas.clientWidth, 1)
      const cssHeight = Math.max(canvas.clientHeight, 1)
      // A 1x drawing buffer is visibly pixelated on iPhone Retina displays.
      // Cap the ratio at 2 to retain smooth edges without making the 36-sample
      // fragment shader unnecessarily expensive on mobile GPUs.
      const pixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2)
      const width = Math.max(Math.round(cssWidth * pixelRatio), 1)
      const height = Math.max(Math.round(cssHeight * pixelRatio), 1)

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        sourceCanvas.width = width
        sourceCanvas.height = height
        textureReady = false
      }

      sourceContext.clearRect(0, 0, width, height)
      const sourceScale = Math.max(width / source.naturalWidth, height / source.naturalHeight)
      const sourceWidth = source.naturalWidth * sourceScale
      const sourceHeight = source.naturalHeight * sourceScale
      const isMobile = window.matchMedia('(max-width: 1023px)').matches
      const sourceOffsetX = isMobile ? PARAMS.mobileSourceOffsetX : PARAMS.sourceOffsetX
      const sourceOffsetY = isMobile ? PARAMS.mobileSourceOffsetY : PARAMS.sourceOffsetY
      // The Figma source is a soft light beam. Blur it before refraction so
      // the lenticular pattern keeps its direction without producing hard,
      // paper-like white shards along the displaced edges.
      sourceContext.imageSmoothingEnabled = true
      sourceContext.imageSmoothingQuality = 'high'
      sourceContext.filter = `blur(${PARAMS.sourceBlur * pixelRatio}px)`
      sourceContext.drawImage(
        source,
        (width - sourceWidth) / 2 + width * sourceOffsetX,
        (height - sourceHeight) / 2 + height * sourceOffsetY,
        sourceWidth,
        sourceHeight,
      )
      sourceContext.filter = 'none'

      gl.viewport(0, 0, width, height)
      gl.uniform2f(gl.getUniformLocation(program, 'uDims'), width, height)
      gl.uniform2f(gl.getUniformLocation(program, 'uCenter'), width * PARAMS.centerX, height * PARAMS.centerY)
      gl.uniform1f(gl.getUniformLocation(program, 'uSize'), PARAMS.size * pixelRatio)
      gl.uniform1f(gl.getUniformLocation(program, 'uAmount'), PARAMS.amount * pixelRatio)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      if (textureReady) {
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
        textureReady = true
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      timeline.classList.add('timeline--lenticular-ready')
    }

    const requestRender = () => {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(render)
    }

    new ResizeObserver(requestRender).observe(canvas)
    source.addEventListener('load', requestRender, { once: true })

    if (source.complete && source.naturalWidth) requestRender()
  }
})()

function initTimelineScroll() {
  const section = document.querySelector('.timeline')
  const scene = section?.closest('.cases-timeline-scene')
  const sticky = section?.querySelector('.timeline__sticky')
  const track = section?.querySelector('.timeline__track')
  const steps = section?.querySelector('.timeline__steps')
  const gsapInstance = window.gsap
  const scrollTrigger = window.ScrollTrigger

  if (
    !section
    || !scene
    || !sticky
    || !track
    || !steps
    || steps.children.length < 2
    || !gsapInstance
    || !scrollTrigger
  ) return

  gsapInstance.registerPlugin(scrollTrigger)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reducedMotion.matches) return

  section.classList.add('timeline--scroll-ready')

  const getTravel = () => Math.max(
    steps.offsetLeft + steps.scrollWidth - track.clientWidth,
    0,
  )

  const getScrollDistance = () => Math.max(
    getTravel() * (window.innerWidth < 1024 ? 1.15 : 1.25),
    window.innerHeight * .9,
  )

  gsapInstance.set(steps, { x: 0 })

  const media = gsapInstance.matchMedia()

  media.add('(min-width: 1024px)', () => {
    const tween = gsapInstance.to(steps, {
      x: () => -getTravel(),
      ease: 'none',
      scrollTrigger: {
        trigger: scene,
        start: '105% bottom',
        end: () => `+=${getScrollDistance()}`,
        // Freeze the complete visible scene. Pinning only the timeline lets
        // the case block above it keep moving and exposes the pin spacer.
        pin: scene,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        fastScrollEnd: false,
      },
    })

    return () => tween.scrollTrigger?.kill()
  })

}

const counterAnimations = new WeakMap()

const getCounterParts = (element) => {
  if (!element.dataset.counterText) element.dataset.counterText = element.textContent

  const source = element.dataset.counterText
  const pattern = /\d(?:[\d\s\u00a0]*\d)?(?:[.,]\d+)?/g
  const tokens = [...source.matchAll(pattern)]

  return {
    source,
    tokens: tokens.map((match) => {
      const raw = match[0]
      const decimalMark = raw.includes(',') ? ',' : raw.includes('.') ? '.' : ''
      const precision = decimalMark ? raw.split(decimalMark)[1].length : 0
      return {
        index: match.index,
        length: raw.length,
        target: Number(raw.replace(/[\s\u00a0]/g, '').replace(',', '.')),
        precision,
        decimalMark,
        grouped: /[\s\u00a0]/.test(raw),
      }
    }),
  }
}

const formatCounterValue = (value, token) => {
  let result = token.precision
    ? value.toFixed(token.precision)
    : String(Math.round(value))

  if (token.decimalMark === ',') result = result.replace('.', ',')

  if (token.grouped) {
    const parts = result.split(token.decimalMark || '.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    result = token.decimalMark ? parts.join(token.decimalMark) : parts[0]
  }

  return result
}

const renderCounterFrame = (element, parts, progress) => {
  let cursor = 0
  let result = ''

  parts.tokens.forEach((token) => {
    result += parts.source.slice(cursor, token.index)
    result += formatCounterValue(token.target * progress, token)
    cursor = token.index + token.length
  })

  element.textContent = result + parts.source.slice(cursor)
}

const animateCounter = (element, { duration = 1800, force = false } = {}) => {
  if (!element || (!force && element.dataset.counterDone === 'true')) return

  const parts = getCounterParts(element)
  if (!parts.tokens.length) return

  const previousFrame = counterAnimations.get(element)
  if (previousFrame) cancelAnimationFrame(previousFrame)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = parts.source
    element.dataset.counterDone = 'true'
    return
  }

  element.dataset.counterDone = 'false'
  const startedAt = performance.now()

  const tick = (now) => {
    const linearProgress = Math.max(0, Math.min((now - startedAt) / duration, 1))
    const easedProgress = 1 - Math.pow(1 - linearProgress, 3)
    renderCounterFrame(element, parts, easedProgress)

    if (linearProgress < 1) {
      counterAnimations.set(element, requestAnimationFrame(tick))
    } else {
      element.textContent = parts.source
      element.dataset.counterDone = 'true'
      counterAnimations.delete(element)
    }
  }

  renderCounterFrame(element, parts, 0)
  counterAnimations.set(element, requestAnimationFrame(tick))
}

const animateCounters = (root, options = {}) => {
  if (!root) return
  const counters = root.matches?.('[data-counter]')
    ? [root]
    : [...root.querySelectorAll('[data-counter]')]

  counters.forEach((counter) => animateCounter(counter, options))
}

function initCounters() {
  const earlyTargets = [
    document.querySelector('.about'),
    document.querySelector('.cost'),
  ].filter(Boolean)
  const caseMetrics = document.querySelector('.cases [data-case-panel]:not([hidden]) [data-case-metrics]')
  if (!earlyTargets.length && !caseMetrics) return

  if (!('IntersectionObserver' in window)) {
    earlyTargets.forEach((target) => animateCounters(target))
    animateCounters(caseMetrics)
    return
  }

  const earlyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      animateCounters(entry.target)
      earlyObserver.unobserve(entry.target)
    })
  }, { threshold: .25 })

  earlyTargets.forEach((target) => earlyObserver.observe(target))

  if (!caseMetrics) return

  const caseObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    animateCounters(entry.target)
    caseObserver.unobserve(entry.target)
  }, { threshold: .7, rootMargin: '0px 0px -4% 0px' })

  caseObserver.observe(caseMetrics)
}

function initProblemCards() {
  const grid = document.querySelector('.problems__grid')
  if (!grid) return

  const cards = [...grid.querySelectorAll('.problem-card')]
  if (!cards.length) return

  const revealCards = (items) => {
    items.forEach((card) => card.classList.add('is-revealed'))
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealCards(cards)
    return
  }

  const mobileQuery = window.matchMedia('(max-width: 1023px)')
  let desktopRevealed = false
  let frameId = 0

  const checkPosition = () => {
    frameId = 0
    const viewportMiddle = window.innerHeight * .62

    if (mobileQuery.matches) {
      cards.some((card) => {
        if (card.classList.contains('is-revealed')) return false

        const rect = card.getBoundingClientRect()
        const cardMiddle = rect.top + rect.height / 2

        if (cardMiddle <= viewportMiddle && rect.bottom > 0) {
          revealCards([card])
          return true
        }

        return true
      })
      return
    }

    if (desktopRevealed) return

    const rect = grid.getBoundingClientRect()
    const gridMiddle = rect.top + rect.height / 2

    if (gridMiddle <= viewportMiddle && rect.bottom > 0) {
      desktopRevealed = true
      revealCards(cards)
    }
  }

  const requestPositionCheck = () => {
    if (frameId) return
    frameId = requestAnimationFrame(checkPosition)
  }

  window.addEventListener('scroll', requestPositionCheck, { passive: true })
  window.addEventListener('resize', requestPositionCheck)
  mobileQuery.addEventListener?.('change', requestPositionCheck)
  requestPositionCheck()
}

function initSectionReveals() {
  const targets = [
    document.querySelector('.cost__cards'),
    document.querySelector('.reviews__viewport'),
  ].filter(Boolean)

  if (!targets.length) return

  targets.forEach((target) => target.classList.add('is-reveal-ready'))

  const reveal = (target) => target.classList.add('is-revealed')

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || !('IntersectionObserver' in window)
  ) {
    targets.forEach(reveal)
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      reveal(entry.target)
      observer.unobserve(entry.target)
    })
  }, { threshold: .2, rootMargin: '0px 0px -6% 0px' })

  targets.forEach((target) => observer.observe(target))
}

function initServicesScroll() {

  const section = document.querySelector('.services')
  const list = section?.querySelector('.services__list')
  const rows = list ? [...list.children] : []
  if (!section || !list || rows.length < 2) return

  const desktopQuery = window.matchMedia('(min-width: 1024px)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const scrollDistance = 720
  const collapsedHeight = 64
  let fullHeights = []
  let frameId = 0

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

  const resetRows = () => {
    section.style.removeProperty('--services-follow-offset')
    rows.forEach((row) => {
      row.style.removeProperty('--service-item-progress')
      row.style.removeProperty('--service-row-height')
      row.style.removeProperty('--service-row-margin')
      row.style.removeProperty('--service-row-padding')
      row.style.removeProperty('--service-copy-opacity')
      row.style.removeProperty('--service-copy-shift')
    })
  }

  const measureRows = () => {
    resetRows()
    fullHeights = rows.map((row) => row.getBoundingClientRect().height)

    if (desktopQuery.matches && !reducedMotion.matches) {
      // Reserve the final layout position once instead of changing the
      // document flow on every scroll frame. The old dynamic margin moved
      // Cases and Timeline while ScrollTrigger kept their previous offsets,
      // which caused the visible snap when the page was opened at the top.
      const contentTop = 160
      const requiredGap = 160
      const collapsedRowMargin = 16
      const collapsedListHeight = rows.length * (collapsedHeight + collapsedRowMargin)
      const followOffset = contentTop
        + collapsedListHeight
        + requiredGap
        + scrollDistance
        - section.offsetHeight

      section.style.setProperty(
        '--services-follow-offset',
        `${followOffset.toFixed(2)}px`,
      )
    }
  }

  const render = () => {
    frameId = 0

    if (!desktopQuery.matches || reducedMotion.matches) {
      resetRows()
      return
    }

    const rect = section.getBoundingClientRect()
    const sceneProgress = clamp(-rect.top / scrollDistance)
    const collapsibleRows = rows.length
    rows.forEach((row, index) => {
      const itemProgress = clamp(sceneProgress * collapsibleRows - index)
      const fullHeight = fullHeights[index] || row.scrollHeight
      const rowHeight = fullHeight + (collapsedHeight - fullHeight) * itemProgress
      const rowMargin = 24 - 8 * itemProgress
      const rowPadding = 24 - 8 * itemProgress

      row.style.setProperty('--service-item-progress', itemProgress.toFixed(4))
      row.style.setProperty('--service-row-height', `${rowHeight.toFixed(2)}px`)
      row.style.setProperty('--service-row-margin', `${rowMargin.toFixed(2)}px`)
      row.style.setProperty('--service-row-padding', `${rowPadding.toFixed(2)}px`)
      row.style.setProperty('--service-copy-opacity', (1 - itemProgress).toFixed(4))
      row.style.setProperty('--service-copy-shift', `${(-8 * itemProgress).toFixed(2)}px`)

    })
  }

  const requestRender = () => {
    if (frameId) return
    frameId = requestAnimationFrame(render)
  }

  const refresh = () => {
    measureRows()
    requestRender()
  }

  measureRows()
  window.addEventListener('scroll', requestRender, { passive: true })
  window.addEventListener('resize', refresh)
  desktopQuery.addEventListener?.('change', refresh)
  reducedMotion.addEventListener?.('change', refresh)
  // Apply the current scroll state before dependent ScrollTriggers measure
  // their start positions. This is especially important after a reload above
  // the services section, where its rows still change the document height.
  render()

  // Fonts can change the measured row heights after DOMContentLoaded. Refresh
  // the rows once they are stable; app.js then refreshes dependent triggers.
  document.fonts?.ready.then(refresh)
}

gsap.registerPlugin(ScrollTrigger);
function initServicesScrollMobile() {
    gsap.registerPlugin(ScrollTrigger);

    function initServicesStack() {
        const section = document.querySelector(".services");
        if (!section) return;

        const sticky = section.querySelector(".services__sticky");
        const list = section.querySelector(".services__list");
        const items = gsap.utils.toArray(
            list.querySelectorAll(":scope > li")
        );

        if (items.length < 2) return;

        // Сколько места занимает описание с отступами
        function getDescriptionHeight(item) {
            const p = item.querySelector("p");
            if (!p) return 0;

            const styles = getComputedStyle(p);

            return (
                p.getBoundingClientRect().height +
                parseFloat(styles.marginTop || 0) +
                parseFloat(styles.marginBottom || 0)
            );
        }

        // Суммарная высота описаний до пункта index
        function getOffset(index) {
            let offset = 0;

            for (let i = 0; i < index; i++) {
                offset += getDescriptionHeight(items[i]);
            }

            return offset;
        }

        // Суммарная высота ВСЕХ описаний
        function getTotalOffset() {
            return items.reduce(
                (sum, item) => sum + getDescriptionHeight(item),
                0
            );
        }

        // Следующие пункты перекрывают предыдущие
        items.forEach((item, index) => {
            gsap.set(item, {
                zIndex: index + 1,
                clipPath: "inset(0px 0px 0px 0px)"
            });
        });

        const timeline = gsap.timeline({
            defaults: {
                ease: "none"
            },

            scrollTrigger: {
                trigger: items[0],

                // Фиксируем, когда первый пункт
                // достигнет 18% высоты экрана
                start: "top 2%",

                // Прокрутка равна высоте скрываемого контента
                end: () => "+=" + Math.max(1, getTotalOffset()),

                // Закрепляем весь блок services
                pin: sticky,

                // Без дополнительного пространства
                pinSpacing: false,

                // Привязка анимации к скроллу
                scrub: true,

                anticipatePin: 1,
                invalidateOnRefresh: true,
                markers: false,
                // Для отладки:
                // markers: true
            }
        });

        // Поочерёдное наложение пунктов
        // Высоты всех шести описаний
        const heights = items.map((item) =>
            Math.max(1, getDescriptionHeight(item))
        );

        let position = 0;

        // Теперь 6 отдельных этапов,
        // по одному на каждое описание
        items.forEach((item, index) => {
            const duration = heights[index];
            const followingItems = items.slice(index + 1);
            const description = item.querySelector("p");

            // Все следующие пункты поднимаются
            // на высоту сворачиваемого описания
            if (followingItems.length) {
                timeline.to(
                    followingItems,
                    {
                        y: () => -getOffset(index + 1),
                        duration,
                        ease: "none"
                    },
                    position
                );
            }

            // Предыдущий пункт визуально сворачивается
            timeline.to(
                item,
                {
                    clipPath: () => {
                        const height = getDescriptionHeight(item);

                        return `inset(0px 0px ${height}px 0px)`;
                    },
                    duration,
                    ease: "none"
                },
                position
            );

            // Описание плавно исчезает,
            // прежде чем следующий пункт
            // визуально приблизится к нему
            if (description) {
                timeline.to(
                    description,
                    {
                        opacity: 0,
                        duration: duration * 0.55,
                        ease: "none"
                    },
                    position
                );
            }

            position += duration;
        });
    }

    initServicesStack();
}

function initCases() {
  const root = document.querySelector('[data-cases]')
  if (!root) return

  const tabs = [...root.querySelectorAll('[data-case-tab]')]
  const panels = [...root.querySelectorAll('[data-case-panel]')]
  let activeTab = tabs.findIndex((tab) => tab.classList.contains('is-active'))
  let changeTimer

  if (activeTab < 0) activeTab = 0

  const getSlideParts = (panel) => ({
    track: panel.querySelector('[data-case-track]'),
    pagination: panel.querySelector('[data-case-pagination]'),
    slides: [...panel.querySelectorAll('[data-case-slide]')],
  })

  const collapseDescriptions = (panel) => {
    panel.querySelectorAll('[data-case-info]').forEach((block) => {
      block.classList.remove('is-expanded')
      const button = block.querySelector('button')
      button?.setAttribute('aria-expanded', 'false')
      if (button) button.textContent = 'Читать полностью'
    })
  }

  const syncDescriptionButtons = (panel) => {
    const activeSlide = panel.querySelector('[data-case-slide]:not([hidden])')
    activeSlide?.querySelectorAll('[data-case-info]').forEach((block) => {
      const paragraph = block.querySelector('.case-slide-info__body p')
      const button = block.querySelector('button')
      if (!paragraph || !button) return

      const hasHiddenText = paragraph.scrollHeight > paragraph.clientHeight + 1
      button.hidden = !hasHiddenText
      if (!hasHiddenText) {
        block.classList.remove('is-expanded')
        button.setAttribute('aria-expanded', 'false')
      }
    })
  }

  const setSlide = (panel, index, animate = true) => {
    const { track, pagination, slides } = getSlideParts(panel)
    if (!track || !slides.length) return

    const activeSlide = (index + slides.length) % slides.length
    panel.dataset.activeSlide = String(activeSlide)
    track.style.transitionDuration = animate ? '' : '0s'
    track.style.transform = `translate3d(-${activeSlide * 100}%, 0, 0)`

    ;[...pagination?.children || []].forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === activeSlide)
    })
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeSlide
    })

    collapseDescriptions(panel)
    window.requestAnimationFrame(() => {
      syncDescriptionButtons(panel)
      if (track) track.style.transitionDuration = ''
    })
  }

  const activateTab = (index, focusTab = false) => {
    const nextTab = tabs[index]
    const nextPanel = panels[index]
    if (!nextTab || !nextPanel || index === activeTab) return

    window.clearTimeout(changeTimer)
    panels[activeTab]?.classList.add('is-changing')

    changeTimer = window.setTimeout(() => {
      activeTab = index
      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === activeTab
        tab.classList.toggle('is-active', isActive)
        tab.setAttribute('aria-selected', String(isActive))
        tab.tabIndex = isActive ? 0 : -1
      })
      panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== activeTab
        panel.classList.remove('is-changing')
      })

      setSlide(nextPanel, Number(nextPanel.dataset.activeSlide || 0), false)
      animateCounters(nextPanel.querySelector('[data-case-metrics]'), { force: true })
      nextTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      if (focusTab) nextTab.focus({ preventScroll: true })
    }, 180)
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index))
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return

      event.preventDefault()
      let nextIndex = index
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
      if (event.key === 'Home') nextIndex = 0
      if (event.key === 'End') nextIndex = tabs.length - 1
      activateTab(nextIndex, true)
    })
  })

  panels.forEach((panel) => {
    const previousButton = panel.querySelector('[data-case-prev]')
    const nextButton = panel.querySelector('[data-case-next]')
    const sliderViewport = panel.querySelector('.case-slider__viewport')
    let swipeStartX = 0
    let swipeStartY = 0

    previousButton?.addEventListener('click', () => {
      setSlide(panel, Number(panel.dataset.activeSlide || 0) - 1)
    })
    nextButton?.addEventListener('click', () => {
      setSlide(panel, Number(panel.dataset.activeSlide || 0) + 1)
    })

    sliderViewport?.addEventListener('touchstart', (event) => {
      const touch = event.changedTouches[0]
      swipeStartX = touch.clientX
      swipeStartY = touch.clientY
    }, { passive: true })

    sliderViewport?.addEventListener('touchend', (event) => {
      const touch = event.changedTouches[0]
      const deltaX = touch.clientX - swipeStartX
      const deltaY = touch.clientY - swipeStartY
      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return

      setSlide(panel, Number(panel.dataset.activeSlide || 0) + (deltaX < 0 ? 1 : -1))
    }, { passive: true })

    panel.querySelectorAll('[data-case-info]').forEach((block) => {
      const button = block.querySelector('button')
      button?.addEventListener('click', () => {
        const isExpanded = block.classList.toggle('is-expanded')
        button.setAttribute('aria-expanded', String(isExpanded))
        button.textContent = isExpanded ? 'Свернуть' : 'Читать полностью'
      })
    })

    setSlide(panel, Number(panel.dataset.activeSlide || 0), false)
  })

  window.addEventListener('resize', () => {
    const activePanel = panels[activeTab]
    if (activePanel) syncDescriptionButtons(activePanel)
  })
}


function initFaq() {
    const items = [...document.querySelectorAll('.faq__list details')];

    const animations = new WeakMap();
    const textAnimations = new WeakMap();

    const duration = 420;
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';

    // Инициализация
    let hasOpen = false;

    items.forEach(item => {
        if (item.open) {
            if (hasOpen) item.open = false;
            else hasOpen = true;
        }

        item.dataset.expanded = String(item.open);
        item.classList.toggle('is-open', item.open);
    });

    function animateItem(item, expand) {
        const text = item.querySelector('p');

        // Текущая высота, даже если анимация ещё идёт
        const startHeight = item.getBoundingClientRect().height;

        // Сохраняем текущее состояние текста
        const wasVisible = item.open;

        const startOpacity = text && wasVisible
            ? parseFloat(getComputedStyle(text).opacity)
            : 0;

        const startTransform = text && wasVisible
            ? getComputedStyle(text).transform
            : 'translateY(10px)';

        // Отменяем предыдущие анимации
        animations.get(item)?.cancel();
        textAnimations.get(item)?.cancel();

        // Измеряем конечную высоту
        item.style.height = '';
        item.style.overflow = '';

        item.open = expand;
        item.classList.toggle('is-open', expand);

        const endHeight = item.getBoundingClientRect().height;

        // Оставляем содержимое в DOM во время закрытия
        item.open = true;
        item.style.height = `${startHeight}px`;
        item.style.overflow = 'hidden';

        // При закрытии сначала даём тексту исчезнуть
        const heightFrames = expand
            ? [
                { height: `${startHeight}px` },
                { height: `${endHeight}px` }
            ]
            : [
                { height: `${startHeight}px`, offset: 0 },
                { height: `${startHeight}px`, offset: 0.32 },
                { height: `${endHeight}px`, offset: 1 }
            ];

        const animation = item.animate(heightFrames, {
            duration,
            easing,
            fill: 'forwards'
        });

        animations.set(item, animation);

        // Анимация появления и исчезновения текста
        if (text) {
            const textAnimation = text.animate(
                [
                    {
                        opacity: startOpacity,
                        transform: startTransform
                    },
                    {
                        opacity: expand ? 1 : 0,
                        transform: expand
                            ? 'translateY(0px)'
                            : 'translateY(-6px)'
                    }
                ],
                {
                    duration: expand ? 300 : 120,
                    delay: expand ? 100 : 0,
                    easing: 'ease-out',
                    fill: 'both'
                }
            );

            textAnimations.set(item, textAnimation);
        }

        animation.onfinish = () => {
            if (animations.get(item) !== animation) return;

            item.open = expand;

            // Убираем временные стили
            animation.cancel();
            item.style.height = '';
            item.style.overflow = '';

            textAnimations.get(item)?.cancel();

            animations.delete(item);
            textAnimations.delete(item);
        };
    }

    items.forEach(item => {
        const summary = item.querySelector('summary');
        if (!summary) return;

        summary.addEventListener('click', event => {
            event.preventDefault();

            const expand = item.dataset.expanded !== 'true';

            // Закрываем предыдущий вопрос
            // if (expand) {
            //     items.forEach(other => {
            //         if (
            //             other !== item &&
            //             other.dataset.expanded === 'true'
            //         ) {
            //             other.dataset.expanded = 'false';
            //             animateItem(other, false);
            //         }
            //     });
            // }

            item.dataset.expanded = String(expand);
            animateItem(item, expand);
        });
    });
}

function initAccentReveals() {
  const accents = Array.from(document.querySelectorAll('.section-title > span, .about__accent'))

  if (!accents.length) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  accents.forEach((accent) => {
    if (accent.dataset.accentRevealReady === 'true') return

    let label = accent.matches('.about__accent')
      ? accent.querySelector(':scope > span')
      : null

    if (!label) {
      label = document.createElement('span')
      label.textContent = accent.textContent
      accent.textContent = ''
      accent.append(label)
    }

    const fill = document.createElement('span')
    fill.className = 'accent-reveal__fill'
    fill.setAttribute('aria-hidden', 'true')

    label.classList.add('accent-reveal__label')
    label.dataset.accentText = label.textContent.trim()
    accent.prepend(fill)
    accent.classList.add('accent-reveal')
    accent.dataset.accentRevealReady = 'true'
    accent.style.setProperty('--accent-progress', '0%')
  })

  const reveal = (accent) => {
    if (accent.classList.contains('is-accent-revealed')) return

    accent.classList.add('is-accent-revealing')

    if (reduceMotion || !window.gsap) {
      accent.style.setProperty('--accent-progress', '100%')
      accent.classList.add('is-accent-revealed')
      return
    }

    window.gsap.to(accent, {
      '--accent-progress': '100%',
      duration: 1.15,
      ease: 'power2.inOut',
      onComplete: () => accent.classList.add('is-accent-revealed'),
    })
  }

  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    window.gsap.registerPlugin(window.ScrollTrigger)

    accents.forEach((accent) => {
      window.ScrollTrigger.create({
        trigger: accent.closest('h1, h2, h3') || accent,
        start: 'top 84%',
        once: true,
        onEnter: () => reveal(accent),
      })
    })

    // Anchor navigation can open the page below several headings. Those
    // accents have already crossed their start point, so finish them
    // immediately instead of leaving only the white text layer visible.
    requestAnimationFrame(() => {
      accents.forEach((accent) => {
        const trigger = accent.closest('h1, h2, h3') || accent
        if (trigger.getBoundingClientRect().top <= window.innerHeight * .84) {
          reveal(accent)
        }
      })
    })
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      reveal(entry.target)
      observer.unobserve(entry.target)
    })
  }, { threshold: .2 })

  accents.forEach((accent) => observer.observe(accent))
}

function initContactForm() {
  const form = document.querySelector('.contact form')

  if (!form) return

  const fields = [...form.querySelectorAll('.contact__field')]
  const messageField = form.querySelector('textarea')
  const messageCount = form.querySelector('[data-message-count]')

  const hasValue = (input) => input.value.trim().length > 0

  const isValid = (input) => {
    if (!hasValue(input)) return false

    if (input.type === 'tel') {
      return input.value.replace(/\D/g, '').length === 11
    }

    return true
  }

  const setError = (field, showError) => {
    const input = field.querySelector('input, textarea')
    field.classList.toggle('contact__field--error', showError)
    input?.setAttribute('aria-invalid', String(showError))
  }

  const syncField = (field) => {
    const input = field.querySelector('input, textarea')

    if (!input) return

    field.classList.toggle('contact__field--filled', hasValue(input))

    if (field.classList.contains('contact__field--error') && isValid(input)) {
      setError(field, false)
    }
  }

  fields.forEach((field) => {
    const input = field.querySelector('input, textarea')
    const clearButton = field.querySelector('.contact__clear')

    if (!input) return

    input.addEventListener('input', () => syncField(field))
    input.addEventListener('blur', () => {
      if (field.classList.contains('contact__field--error')) {
        setError(field, !isValid(input))
      }
    })

    clearButton?.addEventListener('click', () => {
      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.focus()
    })

    syncField(field)
  })

  if (messageField && messageCount) {
    const updateMessageCount = () => {
      messageCount.textContent = String(messageField.value.length)
    }

    messageField.addEventListener('input', updateMessageCount)
    updateMessageCount()
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    let firstInvalidInput = null

    fields.forEach((field) => {
      const input = field.querySelector('input, textarea')
      const invalid = !input || !isValid(input)
      setError(field, invalid)

      if (invalid && !firstInvalidInput) firstInvalidInput = input
    })

    firstInvalidInput?.focus()
  })
}

function initConsultationPopup() {
  const popup = document.querySelector('.consultation-popup')
  const openButton = document.querySelector('[data-popup-open]')

  if (!popup || !openButton) return

  const closeButtons = popup.querySelectorAll('[data-popup-close]')
  const dialog = popup.querySelector('.consultation-popup__dialog')
  const form = popup.querySelector('form')
  const fields = [...popup.querySelectorAll('.consultation-popup__field')]
  let lastFocusedElement = null
  let closeTimer = null

  const setFieldError = (field, hasError) => {
    const input = field.querySelector('input')
    field.classList.toggle('consultation-popup__field--error', hasError)
    input?.setAttribute('aria-invalid', String(hasError))
  }

  const isValid = (input) => {
    if (!input.value.trim()) return false
    return input.type !== 'tel' || input.value.replace(/\D/g, '').length === 11
  }

  const openPopup = () => {
    if (popup.classList.contains('is-open')) return

    window.clearTimeout(closeTimer)
    lastFocusedElement = document.activeElement
    popup.classList.add('is-open')
    popup.setAttribute('aria-hidden', 'false')
    openButton.setAttribute('aria-expanded', 'true')
    document.body.classList.add('lock', 'popup-open')
    popup.querySelector('.consultation-popup__close')?.focus({ preventScroll: true })
  }

  const closePopup = () => {
    if (!popup.classList.contains('is-open')) return

    popup.classList.remove('is-open')
    popup.setAttribute('aria-hidden', 'true')
    openButton.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('lock', 'popup-open')
    closeTimer = window.setTimeout(() => lastFocusedElement?.focus({ preventScroll: true }), 300)
  }

  const autoOpenTimer = window.setTimeout(openPopup, 20000)

  openButton.addEventListener('click', () => {
    window.clearTimeout(autoOpenTimer)
    openPopup()
  })

  closeButtons.forEach((button) => button.addEventListener('click', closePopup))

  popup.addEventListener('click', ({ target }) => {
    if (target === popup) closePopup()
  })

  document.addEventListener('keydown', (event) => {
    if (!popup.classList.contains('is-open')) return

    if (event.key === 'Escape') {
      closePopup()
      return
    }

    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button, a, input')].filter((element) => !element.disabled)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  })

  fields.forEach((field) => {
    const input = field.querySelector('input')
    input?.addEventListener('input', () => {
      if (field.classList.contains('consultation-popup__field--error') && isValid(input)) {
        setFieldError(field, false)
      }
    })
  })

  form?.addEventListener('submit', (event) => {
    event.preventDefault()
    let firstInvalidInput = null

    fields.forEach((field) => {
      const input = field.querySelector('input')
      const hasError = !input || !isValid(input)
      setFieldError(field, hasError)
      if (hasError && !firstInvalidInput) firstInvalidInput = input
    })

    firstInvalidInput?.focus()
  })
}

function initAnchorScroll() {
  const header = document.querySelector('.header')
  const navigation = document.querySelector('.header__nav')
  const menuButton = document.querySelector('.header__menu')
  let initialHashScheduled = false

  const getHeaderOffset = () => {
    if (!header) return 20

    return header.getBoundingClientRect().height + 40
  }

  const alignTarget = (target, behavior = 'smooth') => {
    let top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset()

    if (target.id === 'top') top = 0

    if (target.id === 'process') {
      const processTrigger = window.ScrollTrigger?.getAll().find((instance) => (
        instance.pin
        && instance.trigger
        && (target.contains(instance.trigger) || instance.trigger.contains(target))
      ))

      if (processTrigger) top = processTrigger.start
    }

    window.scrollTo({
      top: Math.max(0, top),
      behavior,
    })
  }

  const alignInitialHash = () => {
    if (initialHashScheduled || !location.hash || location.hash === '#') return

    let target

    try {
      target = document.querySelector(location.hash)
    } catch (error) {
      return
    }

    if (!target) return

    initialHashScheduled = true

    // Chromium restores the native hash position after `load`. Wait until
    // that pass is complete, then make one authoritative alignment.
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' })
      window.ScrollTrigger?.refresh()
      requestAnimationFrame(() => alignTarget(target, 'auto'))
    }, 120)
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]')
    if (!link) return

    const hash = link.getAttribute('href')
    if (!hash || hash === '#') return

    let target

    try {
      target = document.querySelector(hash)
    } catch (error) {
      return
    }

    if (!target) return

    event.preventDefault()
    navigation?.classList.remove('_open')
    menuButton?.setAttribute('aria-expanded', 'false')

    // Pin-spacer elements participate in the document height. Refresh them
    // before measuring an anchor so desktop and mobile land at the same place.
    window.ScrollTrigger?.refresh()

    requestAnimationFrame(() => {
      alignTarget(target)
      history.pushState(null, '', hash)

      // Correct the final few pixels after native smooth scrolling has crossed
      // a pinned scene and ScrollTrigger has updated its internal state.
      let correctionTimer
      const correctPosition = () => {
        clearTimeout(correctionTimer)
        correctionTimer = setTimeout(() => {
          const expectedTop = target.id === 'top' ? 0 : getHeaderOffset()
          if (target.id === 'process') return
          const difference = target.getBoundingClientRect().top - expectedTop

          if (Math.abs(difference) > 4) alignTarget(target, 'auto')
        }, 80)
      }

      if ('onscrollend' in window) {
        window.addEventListener('scrollend', correctPosition, { once: true })
      } else {
        correctionTimer = setTimeout(correctPosition, 900)
      }
    })
  })

  if (document.readyState === 'complete') {
    alignInitialHash()
  } else {
    window.addEventListener('load', alignInitialHash, { once: true })
  }

  document.fonts?.ready.then(alignInitialHash)
}

document.addEventListener('DOMContentLoaded', function(){
  // Native hash restoration may place the page inside a pin range before
  // ScrollTrigger has measured it. Measure every pinned scene from the same
  // stable origin; anchorScroll restores the requested hash afterwards.
  if (location.hash) window.scrollTo({ top: 0, behavior: 'auto' })

  initHeroLenticular()
  // initTimelineLenticular()
  // Services changes its own height while the page is scrolled. Initialise it
  // first so Timeline measures the final, current document geometry and does
  // not snap into its pin before the user actually reaches the section.
  if(window.innerWidth > 768) initServicesScroll()
  if(window.innerWidth < 768) initServicesScrollMobile()
  initTimelineScroll()
  initCases()
  initCounters()
  initProblemCards()
  initSectionReveals()
  initFaq()
  initAccentReveals()
  initContactForm()
  initConsultationPopup()
  initAnchorScroll()

  // ScrollTrigger measures pin start/end positions at creation time. Local
  // images and web fonts can still change the Cases height after
  // DOMContentLoaded, so make one coordinated refresh only after the complete
  // layout is available. This prevents Timeline from snapping to an outdated
  // start position when the page was refreshed near the top.
  const refreshScrollTriggers = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.ScrollTrigger?.refresh())
    })
  }

  if (document.readyState === 'complete') {
    refreshScrollTriggers()
  } else {
    window.addEventListener('load', refreshScrollTriggers, { once: true })
  }
  document.fonts?.ready.then(refreshScrollTriggers)

  const menuButton = document.querySelector('.header__menu')
  const navigation = document.querySelector('.header__nav')
  const siteHeader = document.querySelector('.header')
  let previousScroll = window.scrollY

  const setMenuState = (isOpen) => {
    navigation?.classList.toggle('_open', isOpen)
    siteHeader?.classList.toggle('_menu-open', isOpen)
    menuButton?.setAttribute('aria-expanded', String(isOpen))
    const accessibleLabel = menuButton?.querySelector('.visually-hidden')
    if (accessibleLabel) accessibleLabel.textContent = isOpen ? 'Закрыть меню' : 'Открыть меню'
  }

  menuButton?.addEventListener('click', () => {
    setMenuState(!navigation.classList.contains('_open'))
  })

  navigation?.addEventListener('click', ({ target }) => {
    if (target.closest('a')) {
      setMenuState(false)
    }
  })

  document.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape') setMenuState(false)
  })

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY
    siteHeader?.classList.toggle('_hidden', !siteHeader.classList.contains('_menu-open') && currentScroll > previousScroll && currentScroll > 160)
    previousScroll = currentScroll
  }, { passive: true })

$('img.svg').each(function () {
    let $img = $(this);
    let imgID = $img.attr('id');
    let imgClass = $img.attr('class');
    let imgURL = $img.attr('src');

    $.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        let $svg = $(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

    $('.phone-mask').mask('+7 (999) 999-99-99');

});
});


// Паралакс мышей ========================================================================================
// const mousePrlx = new MousePRLX({})
// =======================================================================================================

// Фиксированный header ==================================================================================
headerFixed()
// =======================================================================================================

// Использование аккордиона ==================================================================================
// initAccordion('faq__item', 'faq__item-answer', (item, content) => {
//     item.classList.toggle('active')
//     content.classList.toggle('active')
// })

// img.svg в <svg> ==================================================================================
// imgToSvg()
// =======================================================================================================


// togglePopupWindows()
// =======================================================================================================
