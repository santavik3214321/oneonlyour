import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Heart, MapPin, ChevronDown,
  UtensilsCrossed, IceCream, Clock, Star,
  Flame, Mountain, Coffee, Volume2, VolumeX,
  Tv, Citrus, Sparkles, ShoppingBag
} from 'lucide-react';

/* ===========================================================
   App.jsx — «Сквозь Километры и Фонтаны»
   Персональная страница ко второму месяцу
   =========================================================== */

// ─── Константы ─────────────────────────────────────────────
const TARGET_DATE = new Date('2026-08-05T21:52:00+07:00'); // 5 Августа 2026, 21:52, по времени Кемерово

// ─── Хук: Intersection Observer для scroll-анимаций ────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

// ─── Хук: Живой таймер (считает ВВЕРХ с 5 августа) ────────
function useTimer(targetDate) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevTime, setPrevTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const diff = Math.max(0, now - targetDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setPrevTime(prev => ({ ...prev, ...time }));
      setTime({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return { time, prevTime };
}

// ─── Компонент: Золотые частицы фона ──────────────────────
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${2 + Math.random() * 3}px`,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

// ─── Компонент: Анимация Салютов (Canvas) ──────────────────
function CanvasFireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        const velocity = Math.random() * 4 + 2;
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.gravity = 0.04;
      }
      update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw(ctx) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    const explode = (x, y) => {
      // Цвета: Золотой, Нежно-розовый, Насыщенно-красный
      const colors = ['255, 215, 0', '255, 105, 180', '220, 20, 60', '255, 230, 150'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particleCount = 60 + Math.random() * 40;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let launchTimer = 0;
    // Первый залп при загрузке
    setTimeout(() => explode(canvas.width / 2, canvas.height / 3), 300);
    
    const loop = () => {
      // Создаем эффект плавного затухания шлейфа
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      launchTimer++;
      // Случайные запуски салютов
      if (launchTimer > 70 + Math.random() * 60) {
        explode(
          Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1),
          Math.random() * (canvas.height * 0.4) + (canvas.height * 0.05)
        );
        launchTimer = 0;
      }
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) particles.splice(i, 1);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60 z-0" />;
}

// ─── Компонент: Экран приветствия ────────────────────────
function WelcomeScreen({ onEnter }) {
  const [isFading, setIsFading] = useState(false);

  const handleClick = () => {
    // В iOS нужно вызывать play() строго синхронно внутри обработчика клика
    if (window.startMusic) {
      window.startMusic();
    }
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 1000); // 1 секунда на плавное исчезновение
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-night transition-opacity duration-1000 cursor-pointer ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={handleClick}
    >
      {/* Фоновый дизайн: Салюты */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CanvasFireworks />
        {/* Градиенты для затемнения, чтобы текст идеально читался */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-night via-deep-night/50 to-deep-night/20" />
      </div>

      {/* Инициалы SV сверху */}
      <div className="absolute top-12 left-0 right-0 text-center animate-fade-down z-10 pointer-events-none">
        <span className="font-heading text-4xl sm:text-5xl text-gold/80 italic font-light tracking-[0.15em] drop-shadow-[0_0_10px_rgba(201,168,76,0.3)]">
          S<span className="text-wendys-red/90 drop-shadow-[0_0_10px_rgba(226,56,63,0.3)]">V</span>
        </span>
      </div>

      <div className="text-center animate-fade-up px-6 relative z-10">
        <Heart className="w-12 h-12 text-wendys-red mx-auto mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(226,56,63,0.5)]" fill="currentColor" />
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-primary font-light mb-12 leading-tight max-w-3xl mx-auto px-4">
          Я тут подумал... сколько бы километров нас ни разделяло сейчас, <br />
          <span className="text-gradient-gold font-medium block mt-2 text-xl sm:text-2xl">
            наше завтра точно того стоит. Улыбнись, я очень скучаю ♥️✈️
          </span>
        </h1>
        <button
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
          className="px-10 py-4 rounded-full glass border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/60 transition-all duration-500 font-body tracking-[0.2em] uppercase text-sm shadow-[0_0_20px_rgba(201,168,76,0.1)] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] relative z-20"
        >
          Открыть
        </button>
      </div>
    </div>
  );
}

// ─── Компонент: Музыкальный плеер (Sting) ──────────────────
function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const readyRef = useRef(false);

  const videoId = 'u910kj9xYSE';

  // Глобальная функция для вызова синхронно из WelcomeScreen и других кнопок
  useEffect(() => {
    window.startMusic = () => {
      if (playerRef.current && readyRef.current && typeof playerRef.current.playVideo === 'function') {
        playerRef.current.setVolume(70);
        playerRef.current.playVideo();
      }
    };
    window.toggleMusic = () => {
      if (playerRef.current && readyRef.current) {
        if (playerRef.current.getPlayerState() === 1) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      }
    };
    return () => {
      delete window.startMusic;
      delete window.toggleMusic;
    };
  }, []);

  // Загружаем YouTube IFrame API и создаём плеер
  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'yt-music-player';
    div.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    document.body.appendChild(div);
    containerRef.current = div;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const createPlayer = () => {
      playerRef.current = new window.YT.Player('yt-music-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          start: 4,
        },
        events: {
          onReady: (event) => {
            readyRef.current = true;
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              setIsPlaying(true);
              window.dispatchEvent(new CustomEvent('music-state', { detail: true }));
            }
            if (event.data === 2) {
              setIsPlaying(false);
              window.dispatchEvent(new CustomEvent('music-state', { detail: false }));
            }
          }
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      if (containerRef.current) {
        containerRef.current.remove();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (!playerRef.current || !readyRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <>
      {/* Кнопка управления музыкой */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 glass p-3 rounded-full cursor-pointer
                   hover:bg-glass-hover transition-all duration-300 group
                   border border-gold/20 hover:border-gold/40
                   shadow-lg shadow-black/20"
        aria-label={isPlaying ? 'Выключить музыку' : 'Включить музыку'}
        title={isPlaying ? 'Frank Sinatra — Fly Me To The Moon 🌙' : 'Включить музыку'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-gold animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-text-muted group-hover:text-gold transition-colors" />
        )}
      </button>

      {/* Название трека при воспроизведении */}
      {isPlaying && (
        <div className="fixed bottom-6 right-20 z-50 glass px-4 py-2 rounded-full
                        border border-gold/10 animate-fade-up">
          <p className="text-[11px] text-gold/70 font-body tracking-wider">
            ♪ Frank Sinatra — Fly Me To The Moon
          </p>
        </div>
      )}
    </>
  );
}

// ─── Компонент: Навигация ──────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#map', label: 'Наша Карта' },
    { href: '#wendys', label: "Wendy's" },
    { href: '#moments', label: 'Будущее' },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 navbar-slide ${
        scrolled
          ? 'glass py-3 shadow-lg shadow-black/30'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Логотип */}
        <a href="#" className="flex items-center gap-2 group">
          <Heart
            className="w-5 h-5 text-wendys-red transition-transform duration-300 group-hover:scale-125"
            fill="currentColor"
          />
          <span className="font-heading text-lg text-gold font-semibold tracking-wide">
            5.08
          </span>
        </a>

        {/* Десктоп-навигация */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-gold text-sm font-light tracking-widest uppercase transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Мобильное меню */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 group"
          aria-label="Меню"
        >
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-gold transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Мобильное выпадающее меню */}
      {menuOpen && (
        <div className="md:hidden glass mt-2 mx-4 rounded-xl p-6 flex flex-col gap-4 navbar-slide">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-text-secondary hover:text-gold text-sm tracking-widest uppercase transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Компонент: Фоновое видео для Hero Section ──────────────
function BackgroundVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-deep-night">
      <video
        src="/videos/bg_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-60"
      />
    </div>
  );
}

// ─── Компонент: Hero Section ──────────────────────────────
function HeroSection() {
  const [ref, isVisible] = useInView();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const handleMusic = (e) => setIsMusicPlaying(e.detail);
    window.addEventListener('music-state', handleMusic);
    return () => window.removeEventListener('music-state', handleMusic);
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Фоновое видео */}
      <div className="absolute inset-0 bg-deep-night">
        <BackgroundVideo />
        <div className="hero-overlay absolute inset-0 z-10" />
      </div>

      {/* Контент */}
      <div
        className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Дата-подзаголовок */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-8 h-px bg-gold/50" />
          <span className="text-gold/80 text-xs tracking-[0.3em] uppercase font-body">
            Ереван · 5 Августа 2026 · 21:52
          </span>
          <span className="w-8 h-px bg-gold/50" />
        </div>

        {/* Заголовок */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6 text-text-primary">
          Сквозь Километры{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient-gold font-medium">и Фонтаны</span>
        </h1>

        {/* Подзаголовок */}
        <p className="font-heading text-xl sm:text-2xl md:text-3xl text-gold/70 italic font-light mb-4">
          Твои Глаза, Твоя Улыбка
        </p>

        <p className="text-text-secondary text-sm sm:text-base font-light max-w-xl mx-auto mb-8 leading-relaxed">
          От поющих фонтанов Еревана до России.
          <br />
          Где началась наша история.
        </p>

        {/* Инлайн-кнопка Музыки */}
        <button
          onClick={() => window.toggleMusic && window.toggleMusic()}
          className="inline-flex items-center justify-center gap-3 px-8 py-3 mb-12 rounded-full glass border border-gold/30 hover:bg-glass-hover hover:border-gold/50 transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.1)] hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] group"
        >
          {isMusicPlaying ? (
            <Volume2 className="w-5 h-5 text-gold animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-text-muted group-hover:text-gold transition-colors" />
          )}
          <span className="text-sm font-body tracking-[0.15em] text-text-secondary group-hover:text-gold/90 transition-colors uppercase">
            {isMusicPlaying ? 'Синатра поет' : 'Включить Синатру'}
          </span>
        </button>

        {/* Стрелка прокрутки */}
        <a href="#timer" className="inline-block animate-float">
          <ChevronDown className="w-6 h-6 text-gold/50" />
        </a>
      </div>

      {/* Декоративная золотая линия снизу */}
      <div className="absolute bottom-0 left-0 right-0 gold-line" />
    </section>
  );
}

// ─── Компонент: Блок таймера «тающие цифры» ────────────────
function TimerDigit({ value, label, prevValue }) {
  const [isMelting, setIsMelting] = useState(false);
  const formatted = String(value).padStart(2, '0');

  useEffect(() => {
    if (value !== prevValue) {
      setIsMelting(true);
      const timeout = setTimeout(() => setIsMelting(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="glass px-4 py-3 sm:px-6 sm:py-5 rounded-2xl min-w-[75px] sm:min-w-[100px] md:min-w-[120px] flex items-center justify-center animate-pulse-gold">
        <span
          className={`font-heading text-4xl sm:text-6xl md:text-7xl font-light leading-none text-gradient-gold block text-center timer-digit ${
            isMelting ? 'melting' : ''
          }`}
        >
          {formatted}
        </span>
      </div>
      <span className="text-text-muted text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-3 font-body">
        {label}
      </span>
    </div>
  );
}

function TimerSection() {
  const { time, prevTime } = useTimer(TARGET_DATE);
  const [ref, isVisible] = useInView();

  return (
    <section
      id="timer"
      ref={ref}
      className={`py-20 sm:py-28 relative section-hidden ${isVisible ? 'section-visible' : ''}`}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Иконка */}
        <div className="flex justify-center mb-6">
          <Clock className="w-6 h-6 text-gold/60" />
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-primary font-light mb-3">
          Мы <span className="text-gradient-gold font-medium">вместе</span> уже
        </h2>
        <p className="text-text-secondary text-sm mb-10 font-light">
          С того самого вечера у фонтанов...
        </p>

        {/* Таймер */}
        <div className="flex items-start justify-center gap-3 sm:gap-5 md:gap-6 flex-wrap">
          <TimerDigit value={time.days} label="Дней" prevValue={prevTime.days} />
          <span className="font-heading text-3xl sm:text-5xl text-gold/40 mt-4 sm:mt-6 animate-glow">:</span>
          <TimerDigit value={time.hours} label="Часов" prevValue={prevTime.hours} />
          <span className="font-heading text-3xl sm:text-5xl text-gold/40 mt-4 sm:mt-6 animate-glow">:</span>
          <TimerDigit value={time.minutes} label="Минут" prevValue={prevTime.minutes} />
          <span className="font-heading text-3xl sm:text-5xl text-gold/40 mt-4 sm:mt-6 animate-glow">:</span>
          <TimerDigit value={time.seconds} label="Секунд" prevValue={prevTime.seconds} />
        </div>
      </div>

      <div className="mt-16 gold-line" />
    </section>
  );
}

// ─── Компонент: Секция «Наша Карта» ──────────────────────
function MapSection() {
  const [ref, isVisible] = useInView();

  return (
    <section
      id="map"
      ref={ref}
      className={`py-20 sm:py-28 relative section-hidden ${isVisible ? 'section-visible' : ''}`}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MapPin className="w-6 h-6 text-gold/60" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary font-light mb-3">
            Сквозь <span className="text-gradient-gold font-medium">Километры</span>
          </h2>
          <p className="text-text-secondary text-sm font-light">Наша карта — от тебя ко мне</p>
        </div>

        {/* Стилизованная карта: Ереван → Кемерово */}
        <div className="glass rounded-3xl p-6 sm:p-10 overflow-hidden relative">
          <svg
            viewBox="0 0 900 420"
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Определения */}
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(201,168,76,0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="cityGlowYerevan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(226,56,63,0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="cityGlowKemerovo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(201,168,76,0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e2383f" />
                <stop offset="30%" stopColor="#c9a84c" />
                <stop offset="70%" stopColor="#e8d08c" />
                <stop offset="100%" stopColor="#c9a84c" />
              </linearGradient>
            </defs>

            <rect width="900" height="420" fill="rgba(10,14,26,0.9)" rx="16" />
            <rect width="900" height="420" fill="url(#mapGlow)" rx="16" />

            {/* Сетка координат */}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={80*(i+1)} y1={0} x2={80*(i+1)} y2={420}
                stroke="rgba(201,168,76,0.04)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={80*(i+1)} x2={900} y2={80*(i+1)}
                stroke="rgba(201,168,76,0.04)" strokeWidth="0.5" />
            ))}

            {/* Контуры: Европа + Средиземноморье */}
            <path
              d="M60,160 Q100,140 140,145 Q180,135 220,140 Q260,130 290,138 Q310,142 330,135"
              fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="35" strokeLinecap="round" opacity="0.5"
            />
            {/* Контуры: Турция / Кавказ */}
            <path
              d="M240,200 Q270,195 300,205 Q320,210 340,205 Q355,198 370,210"
              fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="28" strokeLinecap="round" opacity="0.5"
            />
            {/* Контуры: Россия — огромная полоса */}
            <path
              d="M280,110 Q350,95 420,100 Q500,90 580,95 Q650,88 720,92 Q770,96 820,100 Q860,105 880,110"
              fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="50" strokeLinecap="round" opacity="0.5"
            />
            {/* Россия — южная Сибирь */}
            <path
              d="M500,120 Q560,125 620,118 Q680,112 740,120 Q780,128 810,125"
              fill="none" stroke="rgba(201,168,76,0.07)" strokeWidth="35" strokeLinecap="round" opacity="0.5"
            />
            {/* Казахстан */}
            <path
              d="M400,180 Q460,175 520,185 Q570,190 610,180"
              fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="30" strokeLinecap="round" opacity="0.4"
            />

            {/* Свечение городов */}
            <circle cx="290" cy="250" r="50" fill="url(#cityGlowYerevan)" opacity="0.4" />
            <circle cx="700" cy="145" r="50" fill="url(#cityGlowKemerovo)" opacity="0.4" />

            {/* ═══ Дуга: Ереван → Кемерово ═══ */}
            <path
              d="M290,250 Q490,40 700,145"
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="2.5"
              className="map-arc"
              filter="url(#softGlow)"
              strokeLinecap="round"
            />
            {/* Тень дуги */}
            <path
              d="M290,250 Q490,40 700,145"
              fill="none"
              stroke="rgba(201,168,76,0.08)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* ● Ереван, Армения */}
            <g filter="url(#glow)">
              <circle cx="290" cy="250" r="10" fill="rgba(226,56,63,0.25)" />
              <circle cx="290" cy="250" r="5" fill="#e2383f" />
              <circle cx="290" cy="250" r="14" fill="none" stroke="rgba(226,56,63,0.3)" strokeWidth="1">
                <animate attributeName="r" from="8" to="24" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
            <text x="290" y="280" textAnchor="middle" fill="#e2383f" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="400">
              Ереван
            </text>
            <text x="290" y="296" textAnchor="middle" fill="rgba(201,168,76,0.6)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="300">
              Армения
            </text>

            {/* ● Кемерово, Россия */}
            <g filter="url(#glow)">
              <circle cx="700" cy="145" r="10" fill="rgba(201,168,76,0.25)" />
              <circle cx="700" cy="145" r="5" fill="#c9a84c" />
              <circle cx="700" cy="145" r="14" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1">
                <animate attributeName="r" from="8" to="24" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
            <text x="700" y="175" textAnchor="middle" fill="#c9a84c" fontSize="12" fontFamily="Inter, sans-serif" fontWeight="400">
              Кемерово
            </text>
            <text x="700" y="191" textAnchor="middle" fill="rgba(201,168,76,0.6)" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="300">
              Россия
            </text>

            {/* 💕 Сердце на середине дуги */}
            <text x="490" y="120" textAnchor="middle" fontSize="20">💕</text>

            {/* Расстояние по центру дуги */}
            <text x="490" y="145" textAnchor="middle" fill="rgba(201,168,76,0.5)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="300">
              ~3 700 км
            </text>
          </svg>

          {/* Текст под картой */}
          <p className="text-center text-text-secondary text-sm sm:text-base font-light mt-6 italic font-heading">
            «Расстояние: <span className="text-gold">3 700 километров</span>... но каждая секунда{' '}
            <span className="text-wendys-red">ближе</span>.»
          </p>
        </div>
      </div>

      <div className="mt-16 gold-line" />
    </section>
  );
}

// ─── Компонент: Карточка еды Wendy's ──────────────────────
function FoodCard({ image, title, description, icon: Icon, delay }) {
  return (
    <div
      className="food-card glass rounded-2xl overflow-hidden cursor-default"
      style={{ animationDelay: delay }}
    >
      {/* Изображение */}
      <div className="relative h-48 sm:h-56 overflow-hidden img-glow">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />

        {/* Иконка поверх */}
        <div className="absolute top-4 right-4 glass p-2 rounded-full">
          <Icon className="w-4 h-4 text-gold" />
        </div>
      </div>

      {/* Контент */}
      <div className="p-5 sm:p-6">
        <h3 className="font-heading text-lg sm:text-xl text-text-primary font-medium mb-2">
          {title}
        </h3>
        <p className="text-text-secondary text-sm font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function WendysSection() {
  const [ref, isVisible] = useInView();

  const cards = [
    {
      image: '/images/cheeseburger.png',
      title: 'Двойной Классический Чизбургер',
      description: 'Я знаю, ты ненавидишь лук. Поэтому — без лука, с двойным сыром, идеально.',
      icon: UtensilsCrossed,
      delay: '0.1s',
    },
    {
      image: '/images/french_fries.png',
      title: 'Крупная Картошка Фри с Солью',
      description: 'Идеально хрустящая. Горячая. С морской солью. Как ты любишь.',
      icon: Flame,
      delay: '0.2s',
    },
    {
      image: '/images/frosty_duo.png',
      title: 'Шоколадный + Ванильный Фрости',
      description: 'Да, мы берём оба! Один для тебя, один для меня. А потом меняемся. 🍫🍦',
      icon: IceCream,
      delay: '0.3s',
    },
  ];

  return (
    <section
      id="wendys"
      ref={ref}
      className={`py-20 sm:py-28 relative section-hidden ${isVisible ? 'section-visible' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Заголовок */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <span className="text-2xl">🍔</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary font-light mb-3">
            Твой Идеальный Вечер{' '}
            <span className="text-wendys-red font-medium">Wendy's</span>
          </h2>
          <p className="text-text-secondary text-sm font-light italic font-heading">
            «Я помню всё»
          </p>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cards.map((card, i) => (
            <FoodCard key={i} {...card} />
          ))}
        </div>
      </div>

      <div className="mt-16 gold-line" />
    </section>
  );
}



// ─── Компонент: Будущие моменты ────────────────────────────
function FutureMoments() {
  const [ref, isVisible] = useInView();

  const moments = [
    {
      image: '/images/tsakhkadzor.png',
      title: 'Канатная дорога в Цахкадзоре',
      description: 'Подняться над облаками вдвоём, смотреть на горы и держаться за руки.',
      icon: Mountain,
    },
    {
      image: '/images/cascade_sunset.png',
      title: 'Прогулка в Каскаде на закате',
      description: 'Подняться по ступеням, смотреть на Арарат, держать тебя за руку.',
      icon: Mountain,
    },
    {
      image: '/images/frosty_duo.png',
      title: 'Найти идеальный Фрости вместе',
      description: '...в России или Армении. Неважно где — главное, что рядом с тобой.',
      icon: Coffee,
    },
    {
      image: '/images/clone_series.png',
      title: 'Посмотреть сериал «Клон» вместе',
      description: 'Устроиться поудобнее, обнять тебя и пересмотреть каждую серию. Попкорн обязательно.',
      icon: Tv,
    },
    {
      image: '/images/lemonade.png',
      title: 'Попробовать лимонад с облепихой',
      description: 'Два стакана, два настроения, одна солнечная облепиха. Вместе вкуснее.',
      icon: Citrus,
    },
    {
      image: '/images/fireworks.png',
      title: 'Устроить для тебя прекрасный салют',
      description: 'Небо в огнях — только для тебя. Чтобы ты улыбалась, глядя вверх.',
      icon: Sparkles,
    },
    {
      image: '/images/luxury_bags.png',
      title: 'Купить тебе много сумок',
      description: 'Самые красивые, самые стильные. Столько, сколько захочешь. Ты заслуживаешь.',
      icon: ShoppingBag,
    },
  ];

  return (
    <section
      id="moments"
      ref={ref}
      className={`py-20 sm:py-28 relative section-hidden ${isVisible ? 'section-visible' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Заголовок */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <Star className="w-6 h-6 text-gold/60" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-text-primary font-light mb-3">
            Наши <span className="text-gradient-gold font-medium">Будущие</span> Моменты
          </h2>
          <p className="text-text-secondary text-sm font-light">То, что нас ещё ждёт...</p>
        </div>

        {/* Сетка моментов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {moments.map((moment, i) => (
            <div
              key={i}
              className="future-card glass rounded-2xl overflow-hidden group"
            >
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent" />

                {/* Иконка */}
                <div className="absolute bottom-4 left-4 glass p-2.5 rounded-xl">
                  <moment.icon className="w-5 h-5 text-gold" />
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="font-heading text-lg text-text-primary font-medium mb-2">
                  {moment.title}
                </h3>
                <p className="text-text-secondary text-sm font-light leading-relaxed">
                  {moment.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 gold-line" />
    </section>
  );
}

// ─── Компонент: Footer ─────────────────────────────────────
function Footer() {
  return (
    <footer className="py-16 sm:py-20 relative">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Декоративные элементы */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-2xl">⛲</span>
          <Heart className="w-5 h-5 text-wendys-red animate-pulse" fill="currentColor" />
          <span className="text-2xl">⛲</span>
        </div>

        {/* Основной текст */}
        <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-primary font-light mb-4">
          5 Августа –{' '}
          <span className="text-gradient-gold font-medium">Наш День</span>.
        </h3>
        <p className="font-heading text-xl sm:text-2xl text-wendys-red/80 italic font-light mb-8">
          Моя Радость.
        </p>

        <p className="text-text-muted text-xs tracking-widest uppercase">
          Сделано с{' '}
          <Heart className="w-3 h-3 text-wendys-red inline-block mx-1" fill="currentColor" />
          {' '}для тебя
        </p>

        {/* Тонкая золотая линия */}
        <div className="mt-10 gold-line opacity-50" />

        <p className="mt-6 text-text-muted text-[10px] tracking-wider">
          © 2026 · Наша История
        </p>
      </div>
    </footer>
  );
}

// ─── Компонент: Фото в рамке Hello Kitty ───────────────
function LoveNoteSection() {
  const [ref, isVisible] = useInView();

  return (
    <section
      id="love-note"
      ref={ref}
      className={`py-20 sm:py-28 relative section-hidden ${isVisible ? 'section-visible' : ''}`}
    >
      <div className="max-w-2xl mx-auto px-6">
        {/* Заголовок */}
        <div className="text-center mb-10">
          <p className="text-text-secondary text-sm font-light italic font-heading">
            И напоследок...
          </p>
        </div>

        {/* Рамка Hello Kitty */}
        <div className="relative mx-auto max-w-md">
          {/* Hello Kitty декорации по углам */}
          {/* Верх левый */}
          <div className="absolute -top-6 -left-6 z-10">
            <svg width="50" height="50" viewBox="0 0 100 100" className="drop-shadow-lg">
              {/* Hello Kitty голова */}
              <ellipse cx="50" cy="52" rx="38" ry="34" fill="white"/>
              {/* Ушки */}
              <ellipse cx="22" cy="24" rx="14" ry="18" fill="white"/>
              <ellipse cx="78" cy="24" rx="14" ry="18" fill="white"/>
              <ellipse cx="22" cy="24" rx="9" ry="12" fill="#FFB6C1"/>
              <ellipse cx="78" cy="24" rx="9" ry="12" fill="#FFB6C1"/>
              {/* Глаза */}
              <ellipse cx="36" cy="50" rx="4" ry="5" fill="#333"/>
              <ellipse cx="64" cy="50" rx="4" ry="5" fill="#333"/>
              {/* Нос */}
              <ellipse cx="50" cy="58" rx="4" ry="3" fill="#FFD700"/>
              {/* Усики */}
              <line x1="10" y1="52" x2="30" y2="55" stroke="#333" strokeWidth="1.5"/>
              <line x1="10" y1="58" x2="30" y2="58" stroke="#333" strokeWidth="1.5"/>
              <line x1="10" y1="64" x2="30" y2="61" stroke="#333" strokeWidth="1.5"/>
              <line x1="90" y1="52" x2="70" y2="55" stroke="#333" strokeWidth="1.5"/>
              <line x1="90" y1="58" x2="70" y2="58" stroke="#333" strokeWidth="1.5"/>
              <line x1="90" y1="64" x2="70" y2="61" stroke="#333" strokeWidth="1.5"/>
              {/* Бантик */}
              <circle cx="18" cy="12" r="10" fill="#FF4D6A"/>
              <circle cx="8" cy="8" r="7" fill="#FF4D6A"/>
              <circle cx="26" cy="6" r="7" fill="#FF4D6A"/>
              <circle cx="18" cy="10" r="3" fill="#FFD700"/>
            </svg>
          </div>

          {/* Верх правый — маленький бантик */}
          <div className="absolute -top-4 -right-4 z-10">
            <svg width="36" height="36" viewBox="0 0 60 60" className="drop-shadow-md">
              <circle cx="30" cy="30" r="14" fill="#FF4D6A"/>
              <circle cx="18" cy="24" r="10" fill="#FF4D6A"/>
              <circle cx="42" cy="24" r="10" fill="#FF4D6A"/>
              <circle cx="30" cy="28" r="4" fill="#FFD700"/>
            </svg>
          </div>

          {/* Низ правый — Hello Kitty */}
          <div className="absolute -bottom-6 -right-6 z-10">
            <svg width="50" height="50" viewBox="0 0 100 100" className="drop-shadow-lg" style={{ transform: 'scaleX(-1)' }}>
              <ellipse cx="50" cy="52" rx="38" ry="34" fill="white"/>
              <ellipse cx="22" cy="24" rx="14" ry="18" fill="white"/>
              <ellipse cx="78" cy="24" rx="14" ry="18" fill="white"/>
              <ellipse cx="22" cy="24" rx="9" ry="12" fill="#FFB6C1"/>
              <ellipse cx="78" cy="24" rx="9" ry="12" fill="#FFB6C1"/>
              <ellipse cx="36" cy="50" rx="4" ry="5" fill="#333"/>
              <ellipse cx="64" cy="50" rx="4" ry="5" fill="#333"/>
              <ellipse cx="50" cy="58" rx="4" ry="3" fill="#FFD700"/>
              <line x1="10" y1="52" x2="30" y2="55" stroke="#333" strokeWidth="1.5"/>
              <line x1="10" y1="58" x2="30" y2="58" stroke="#333" strokeWidth="1.5"/>
              <line x1="10" y1="64" x2="30" y2="61" stroke="#333" strokeWidth="1.5"/>
              <line x1="90" y1="52" x2="70" y2="55" stroke="#333" strokeWidth="1.5"/>
              <line x1="90" y1="58" x2="70" y2="58" stroke="#333" strokeWidth="1.5"/>
              <line x1="90" y1="64" x2="70" y2="61" stroke="#333" strokeWidth="1.5"/>
              <circle cx="82" cy="12" r="10" fill="#FF4D6A"/>
              <circle cx="74" cy="6" r="7" fill="#FF4D6A"/>
              <circle cx="92" cy="8" r="7" fill="#FF4D6A"/>
              <circle cx="82" cy="10" r="3" fill="#FFD700"/>
            </svg>
          </div>

          {/* Низ левый — бантик */}
          <div className="absolute -bottom-3 -left-3 z-10">
            <svg width="30" height="30" viewBox="0 0 60 60" className="drop-shadow-md">
              <circle cx="30" cy="30" r="14" fill="#FF4D6A"/>
              <circle cx="18" cy="24" r="10" fill="#FF4D6A"/>
              <circle cx="42" cy="24" r="10" fill="#FF4D6A"/>
              <circle cx="30" cy="28" r="4" fill="#FFD700"/>
            </svg>
          </div>

          {/* Маленькие сердечки вокруг */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-pink-400 text-lg animate-float">♡</div>
          <div className="absolute top-1/4 -right-8 text-pink-300 text-sm" style={{ animationDelay: '1s' }}>♡</div>
          <div className="absolute top-1/3 -left-7 text-pink-300 text-xs animate-float" style={{ animationDelay: '2s' }}>♡</div>
          <div className="absolute bottom-1/4 -right-7 text-pink-400 text-xs animate-float" style={{ animationDelay: '0.5s' }}>♡</div>

          {/* Рамка */}
          <div className="rounded-2xl p-3 sm:p-4
                          bg-gradient-to-br from-pink-200/20 via-pink-100/10 to-pink-200/20
                          border-2 border-pink-300/30
                          shadow-[0_0_30px_rgba(255,182,193,0.15),0_0_60px_rgba(255,77,106,0.08)]
                          transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,182,193,0.25),0_0_80px_rgba(255,77,106,0.12)]
                          hover:border-pink-300/50">
            {/* Фото */}
            <img
              src="/images/love_note.jpg"
              alt="Я люблю Вике"
              className="w-full h-auto rounded-xl shadow-inner"
            />
          </div>
        </div>

        {/* Подпись */}
        <p className="text-center text-text-secondary text-sm font-light mt-8 italic font-heading">
          Навсегда. <span className="text-pink-400">♥</span>
        </p>
      </div>

      <div className="mt-16 gold-line" />
    </section>
  );
}


// ─── Главный компонент приложения ──────────────────────────
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div className="relative min-h-screen bg-deep-night">
      {/* Стартовый экран с приглашением */}
      {!hasEntered && <WelcomeScreen onEnter={() => setHasEntered(true)} />}

      {/* Фоновые частицы */}
      <Particles />

      {/* Музыкальный плеер */}
      <MusicPlayer />

      {/* Навигация */}
      <Navbar />

      {/* Основное содержание */}
      <main>
        <HeroSection />
        <TimerSection />
        <MapSection />
        <WendysSection />

        <FutureMoments />
        <LoveNoteSection />
      </main>

      {/* Подвал */}
      <Footer />
    </div>
  );
}
