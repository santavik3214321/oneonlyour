import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, MapPin, Heart, Gift, Camera, Plane, Newspaper, Film, Tv, Map } from 'lucide-react';

// ─── Компонент: Летающие Лепестки / Волшебная Пыльца ───────
function MagicParticles() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Генерируем 30 лепестков с разными параметрами
    const newPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${10 + Math.random() * 15}s`,
      animationDelay: `${Math.random() * 10}s`,
      opacity: 0.3 + Math.random() * 0.5,
      scale: 0.5 + Math.random() * 0.8,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animation: `float-petal ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Компонент: Музыкальный плеер ──────────────────────────
function MusicPlayer({ isPlaying, toggleMusic, setMusicState }) {
  const audioRef = useRef(null);
  const hasSeeked = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio playback blocked", err);
          if (setMusicState) setMusicState(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, setMusicState]);

  const handleLoadedMetadata = () => {
    if (audioRef.current && !hasSeeked.current) {
      audioRef.current.currentTime = 111; // Старт с 1:51, как и просили
      hasSeeked.current = true;
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/music/celentano.mp3" 
        loop 
        autoPlay
        onLoadedMetadata={handleLoadedMetadata}
      />
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100] glass px-4 py-2.5 rounded-full flex items-center gap-2 cursor-pointer hover:bg-white/90 transition-all duration-300 border border-white/60 shadow-[0_4px_20px_rgba(244,143,177,0.3)] animate-blur-fade"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-5 h-5 text-rose-500 animate-breathe" />
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Музыка</span>
          </>
        ) : (
          <>
            <VolumeX className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Включить звук</span>
          </>
        )}
      </button>
    </>
  );
}

// ─── Шаг 1: Приглашение ────────────────────────────────────
function Step1({ onNext }) {
  return (
    <div className="quest-container animate-blur-fade text-center">
      <Heart className="w-16 h-16 text-rose-400 mx-auto mb-8 animate-breathe drop-shadow-[0_0_20px_rgba(244,143,177,0.6)]" fill="currentColor" />
      <h1 className="font-heading text-4xl md:text-5xl font-medium mb-6 text-gray-800">
        Привет, моя принцесса.
      </h1>
      <p className="text-gray-500 text-lg mb-12 max-w-xl leading-relaxed">
        Я приготовил для тебя кое-что особенное. Это не просто сайт, это наше личное, нежное путешествие. Готова?
      </p>
      <button onClick={onNext} className="glass-btn px-10 py-4 rounded-full text-rose-500 uppercase tracking-widest text-sm font-bold shadow-[0_10px_30px_rgba(244,143,177,0.3)] hover:scale-105 animate-breathe">
        Начать путь
      </button>
    </div>
  );
}

// ─── Шаг 2: Проверка памяти (Двойной вопрос) ─────────────────
function Step2({ onNext }) {
  const [phase, setPhase] = useState(1);
  const [errorIndex, setErrorIndex] = useState(null);

  const handleAnswer = (index, answerType) => {
    if (phase === 1) {
      if (answerType === 'wendys') {
        setPhase(2);
      } else {
        setErrorIndex(index);
        setTimeout(() => setErrorIndex(null), 500);
      }
    } else if (phase === 2) {
      if (answerType === 'fountains') {
        onNext();
      } else {
        setErrorIndex(index);
        setTimeout(() => setErrorIndex(null), 500);
      }
    }
  };

  const answersPhase1 = [
    { text: "В самолете", type: 'plane' },
    { text: "В Wendy's", type: 'wendys' },
    { text: "У поющих фонтанов Еревана", type: 'fountains' },
  ];

  const answersPhase2 = [
    { text: "В самолете", type: 'plane' },
    { text: "На улице", type: 'street' },
    { text: "У поющих фонтанов Еревана", type: 'fountains' },
  ];

  return (
    <div className="quest-container animate-blur-fade text-center">
      <h2 className="font-heading text-xl text-rose-400 mb-4 tracking-widest uppercase text-sm">Глава 1</h2>
      
      {phase === 1 ? (
        <h3 className="font-heading text-3xl md:text-4xl font-medium mb-12 text-gray-700 animate-blur-fade">
          Помнишь ли ты, где я увидел тебя в самый первый раз?
        </h3>
      ) : (
        <div className="animate-blur-fade">
          <h3 className="font-heading text-3xl md:text-4xl font-medium mb-4 text-gray-700">
            Именно так! Глаз не мог оторвать... 😍
          </h3>
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            Но где мы по-настоящему познакомились и заговорили?
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {(phase === 1 ? answersPhase1 : answersPhase2).map((ans, i) => (
          <button
            key={phase + ans.type} // Меняем ключ, чтобы анимации не пересекались при смене фазы
            onClick={() => handleAnswer(i, ans.type)}
            className={`glass-btn p-5 rounded-2xl text-left pl-6 transition-all text-gray-600 font-medium text-lg shadow-sm hover:shadow-md ${
              errorIndex === i ? 'animate-shake-soft border-rose-300 text-rose-500 bg-rose-50' : ''
            }`}
          >
            {ans.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Шаг 3: Карта (Удержание и Самолетик) ────────────────────
function Step3({ onNext }) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const isDoneRef = useRef(false); // Защита от двойного срабатывания

  const startHold = (e) => {
    if (isDoneRef.current) return;
    
    // Очищаем предыдущий интервал, если он был (защита от touch+mouse одновременно)
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        const nextP = p + 0.5; // ~6 секунд удержания
        if (nextP >= 100) {
          clearInterval(intervalRef.current);
          if (!isDoneRef.current) {
            isDoneRef.current = true;
            setTimeout(onNext, 800); 
          }
          return 100;
        }
        return nextP;
      });
    }, 30);
  };

  const stopHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isDoneRef.current && progress < 100) {
      setProgress(0); 
    }
  };

  const t = progress / 100;
  const p0 = { x: 290, y: 250 }; 
  const p1 = { x: 490, y: 40 };  
  const p2 = { x: 700, y: 145 }; 

  const planeX = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
  const planeY = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
  
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div className="quest-container animate-blur-fade text-center w-full max-w-4xl">
      <h2 className="font-heading text-xl text-rose-400 mb-2 tracking-widest uppercase text-sm">Глава 2</h2>
      <h3 className="font-heading text-3xl md:text-4xl font-medium mb-4 text-gray-700">
        Сквозь километры
      </h3>
      <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed">
        Удерживай кнопку, чтобы наш самолет пролетел эти 3 700 км... Знаешь, что сильнее любого расстояния? Наша любовь.
      </p>
      
      <div className="relative w-full max-w-2xl mx-auto mb-10 bg-white/40 rounded-[2rem] p-6 shadow-sm border border-white/80 backdrop-blur-md">
        <svg viewBox="0 0 900 420" className="w-full h-auto">
          <path d="M290,250 Q490,40 700,145" fill="none" stroke="rgba(244,143,177,0.3)" strokeWidth="4" strokeLinecap="round" strokeDasharray="12 12" />
          <path d="M290,250 Q490,40 700,145" fill="none" stroke="#f48fb1" strokeWidth="6" strokeLinecap="round" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} className="transition-all duration-75 ease-linear" />
          <circle cx="290" cy="250" r="10" fill="rgba(244,143,177,0.4)" className="animate-breathe" />
          <circle cx="290" cy="250" r="5" fill="#f48fb1" />
          <text x="290" y="280" textAnchor="middle" fill="#5a4b56" fontSize="18" fontFamily="Inter" fontWeight="600">Ереван</text>
          <circle cx="700" cy="145" r="10" fill="rgba(255,182,193,0.4)" className="animate-breathe" />
          <circle cx="700" cy="145" r="5" fill="#ffb6c1" />
          <text x="700" y="175" textAnchor="middle" fill="#5a4b56" fontSize="18" fontFamily="Inter" fontWeight="600">Кемерово</text>
          {/* Самолетик */}
          <g transform={`translate(${planeX}, ${planeY}) rotate(${angle})`} className="transition-all duration-75 ease-linear">
            {/* Тень самолета для 3D эффекта */}
            <Plane width="40" height="40" x="-20" y="-20" className="text-rose-900 opacity-10" style={{ filter: 'blur(4px)', transform: 'translate(0px, 10px)' }} />
            {/* Сам самолет */}
            <Plane width="40" height="40" x="-20" y="-20" className="text-rose-500 drop-shadow-lg" fill="currentColor" />
          </g>
        </svg>
      </div>

      <button
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => { e.preventDefault(); startHold(e); }}
        onTouchEnd={(e) => { e.preventDefault(); stopHold(e); }}
        className="glass relative overflow-hidden px-14 py-6 rounded-full text-rose-500 uppercase tracking-widest cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(244,143,177,0.2)]"
      >
        <span className="relative z-10 font-bold">Нажми и удерживай</span>
        <div className="hold-progress-bg" style={{ width: `${progress}%` }} />
      </button>
    </div>
  );
}

// ─── Шаг 4: Ужин (Выбор еды) ────────────────────────────────────────
function Step4({ onNext }) {
  const [errorIndex, setErrorIndex] = useState(null);
  
  const items = [
    { id: 'sushi', name: 'Роллы', img: '/images/sushi.png', correct: false },
    { id: 'pizza', name: 'Пиццу', img: '/images/pizza.png', correct: false },
    { id: 'sweets', name: 'Вкусняшки', img: '/images/sweets.png', correct: false },
    { id: 'wendys', name: 'Комбо Wendy\'s', img: '/images/wendys_combo.png', correct: true },
  ];

  const handleAnswer = (index, isCorrect) => {
    if (isCorrect) {
      onNext();
    } else {
      setErrorIndex(index);
      setTimeout(() => setErrorIndex(null), 500);
    }
  };

  return (
    <div className="quest-container animate-blur-fade text-center">
      <h2 className="font-heading text-xl text-rose-400 mb-4 tracking-widest uppercase text-sm">Глава 3</h2>
      <h3 className="font-heading text-3xl md:text-4xl font-medium mb-6 text-gray-700">
        Идеальный ужин
      </h3>
      <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed">
        Мы долго летели, и пора бы перекусить! Как думаешь, что именно мы закажем на наш идеальный вечер?
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-md w-full mx-auto mb-12">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleAnswer(i, item.correct)}
            className={`glass-btn p-4 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 shadow-sm hover:shadow-md ${
              errorIndex === i ? 'animate-shake-soft border-rose-300 bg-rose-50' : 'hover:scale-105'
            }`}
          >
            <img src={item.img} alt={item.name} className="w-24 h-24 object-contain drop-shadow-md" />
            <span className="text-sm font-medium text-gray-600">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Шаг 5: Сериал Клон (НОВОЕ) ─────────────────────────────
function Step5({ onNext, pauseMusic }) {
  const [errorIndex, setErrorIndex] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

  const handleAnswer = (index, isCorrect) => {
    if (isCorrect) {
      setShowVideo(true); 
    } else {
      setErrorIndex(index);
      setTimeout(() => setErrorIndex(null), 500);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 14; // Запускаем строго с 0:14
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const answers = [
    { text: "Скучные новости", correct: false, icon: <Newspaper className="w-8 h-8" /> },
    { text: "Какой-то новый фильм", correct: false, icon: <Film className="w-8 h-8" /> },
    { text: "Сериал «Клон»", correct: true, icon: <Tv className="w-8 h-8" /> },
  ];

  if (showVideo) {
    return (
      <div className="quest-container animate-blur-fade text-center w-full max-w-4xl">
        <h2 className="font-heading text-xl text-rose-400 mb-6 tracking-widest uppercase text-sm">Тот самый момент</h2>
        
        <div className="w-full max-w-2xl mx-auto bg-white/40 p-4 rounded-3xl shadow-sm border border-white/80 backdrop-blur-md mb-10">
          <div className="relative w-full overflow-hidden rounded-2xl bg-black/5 shadow-inner flex items-center justify-center min-h-[300px]">
            {/* Локальное видео. Controls удалены, чтобы нельзя было мотать */}
            <video 
              ref={videoRef}
              className="w-full h-auto max-h-[60vh] object-contain cursor-pointer"
              src="/videos/sa.mp4#t=14" 
              playsInline
              muted={isVideoMuted}
              onEnded={() => setIsPlaying(false)}
              onClick={() => {
                if (videoRef.current && isPlaying) {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }}
            >
              Ваш браузер не поддерживает воспроизведение видео.
            </video>

            {/* Кнопка включения звука видео */}
            {isPlaying && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (isVideoMuted) {
                    setIsVideoMuted(false);
                    pauseMusic();
                  } else {
                    setIsVideoMuted(true);
                  }
                }}
                className="absolute bottom-4 right-4 bg-black/40 p-3 rounded-full text-white backdrop-blur-md hover:bg-black/60 transition-colors z-20 shadow-lg"
              >
                {isVideoMuted ? <VolumeX className="w-5 h-5 text-gray-300" /> : <Volume2 className="w-5 h-5 text-rose-400" />}
              </button>
            )}

            {/* Кастомная кнопка Play */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/30 transition-colors"
                onClick={handlePlay}
              >
                <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center text-rose-500 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-breathe">
                  <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onNext} 
          className="glass-btn px-14 py-5 rounded-full text-rose-500 uppercase tracking-widest text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(244,143,177,0.2)]"
        >
          Продолжить ♥️
        </button>
      </div>
    );
  }

  return (
    <div className="quest-container animate-blur-fade text-center">
      <h2 className="font-heading text-xl text-rose-400 mb-4 tracking-widest uppercase text-sm">Глава 4</h2>
      <h3 className="font-heading text-3xl md:text-4xl font-medium mb-6 text-gray-700">
        Уютный вечер
      </h3>
      <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed">
        Ужин из Wendy's готов! Но что мы будем смотреть, уютно устроившись рядышком под пледом?
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i, ans.correct)}
            className={`glass-btn p-5 rounded-2xl flex items-center justify-center gap-4 transition-all text-gray-600 font-medium text-lg shadow-sm hover:shadow-md ${
              errorIndex === i ? 'animate-shake-soft border-rose-300 text-rose-500 bg-rose-50' : ''
            }`}
          >
            <span className="text-rose-400 drop-shadow-sm">{ans.icon}</span>
            <span>{ans.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Шаг 6: Каскад и Цахкадзор (НОВОЕ) ──────────────────────
function Step6({ onNext }) {
  const [selected, setSelected] = useState([]);
  
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const checkAnswer = () => {
    if (selected.length === 2) {
      onNext();
    } else {
      alert("Подумай хорошенько... А зачем нам выбирать что-то одно? 😉");
    }
  };

  return (
    <div className="quest-container animate-blur-fade text-center">
      <h2 className="font-heading text-xl text-rose-400 mb-4 tracking-widest uppercase text-sm">Глава 5</h2>
      <h3 className="font-heading text-3xl md:text-4xl font-medium mb-6 text-gray-700">
        Планы на будущее
      </h3>
      <p className="text-lg text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed">
        Куда мы отправимся первым делом, когда наконец будем вместе?
      </p>
      
      <div className="grid grid-cols-2 gap-6 max-w-lg w-full mx-auto mb-12">
        <button
          onClick={() => toggleSelect('cascade')}
          className={`glass-btn p-4 rounded-3xl flex flex-col items-center gap-4 transition-all duration-300 ${
            selected.includes('cascade') ? 'border-rose-300 bg-white/90 scale-105 shadow-[0_15px_30px_rgba(244,143,177,0.3)] animate-pop' : ''
          }`}
        >
          <img src="/images/cascade.png" alt="Закаты на Каскаде" className="w-full aspect-square object-cover rounded-2xl shadow-sm border border-white/50" />
          <span className="text-sm font-medium text-gray-600">Закаты на Каскаде</span>
        </button>

        <button
          onClick={() => toggleSelect('ropeway')}
          className={`glass-btn p-4 rounded-3xl flex flex-col items-center gap-4 transition-all duration-300 ${
            selected.includes('ropeway') ? 'border-rose-300 bg-white/90 scale-105 shadow-[0_15px_30px_rgba(244,143,177,0.3)] animate-pop' : ''
          }`}
        >
          <img src="/images/ropeway.png" alt="Канатка в Цахкадзоре" className="w-full aspect-square object-cover rounded-2xl shadow-sm border border-white/50" />
          <span className="text-sm font-medium text-gray-600">Канатка в Цахкадзоре</span>
        </button>
      </div>

      <button 
        onClick={checkAnswer} 
        className={`glass-btn px-12 py-4 rounded-full text-rose-500 uppercase tracking-widest text-sm font-bold transition-all duration-500 ${selected.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        Подтвердить выбор
      </button>
    </div>
  );
}

// ─── Шаг 7: Предфинал ──────────────────────────────────────
function Step7({ onNext }) {
  return (
    <div className="quest-container animate-blur-fade text-center">
      <h2 className="font-heading text-xl text-rose-400 mb-4 tracking-widest uppercase text-sm">Глава 6</h2>
      <h3 className="font-heading text-4xl md:text-5xl font-medium mb-8 text-gray-700">
        Наше Будущее
      </h3>
      <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto leading-relaxed">
        Впереди нас ждет еще множество вечеров с сериалом, долгих прогулок и целая вечность вместе... <br/><br/>
        Готова увидеть самое главное?
      </p>
      <button onClick={onNext} className="glass px-16 py-6 rounded-full text-rose-500 uppercase tracking-widest font-bold transition-transform animate-breathe bg-white/80">
        Да, готова ♥️
      </button>
    </div>
  );
}

// ─── Финал: Подарок и Фото ─────────────────────────────────
function Step8() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="quest-container animate-blur-fade text-center">
      <h2 className="font-heading text-5xl md:text-7xl font-medium mb-16 text-gradient-rose drop-shadow-sm">
        Я люблю Вику
      </h2>
      
      {!opened ? (
        <div className="cursor-pointer group mt-10" onClick={() => setOpened(true)}>
          <div className="animate-gift-bounce">
            <Gift className="w-32 h-32 text-rose-400 mx-auto drop-shadow-[0_20px_40px_rgba(244,143,177,0.6)] group-hover:scale-110 transition-transform" />
          </div>
          <p className="mt-12 text-rose-400 tracking-widest uppercase text-sm animate-breathe font-bold">Нажми на подарок</p>
        </div>
      ) : (
        <div className="relative animate-photo-3d mt-4">
          {/* Полароидная рамка для фото (теперь адаптируется под размер фотки) */}
          <div className="bg-white p-5 pb-20 rounded-sm shadow-[0_30px_60px_rgba(156,142,152,0.3)] inline-block mx-auto border border-gray-100 max-w-sm w-full">
            <div className="w-full bg-gray-100 overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
              {/* Фотография (us.jpg) - h-auto позволяет рамке подстроиться под высоту фото */}
              <img 
                src="/images/us.jpg" 
                alt="Мы" 
                className="w-full h-auto object-contain z-10 relative" 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-0 opacity-50">
                <Camera className="w-12 h-12 text-rose-200 mb-3" />
                <p className="text-gray-400 text-xs text-center px-6 font-body">
                  Закинь вашу реальную фотографию сюда:<br/><br/>
                  <code className="bg-gray-200 px-2 py-1 rounded text-gray-600">public/images/us.jpg</code>
                </p>
              </div>
            </div>
            {/* Подпись на полароиде */}
            <p className="absolute bottom-5 left-0 right-0 text-center text-gray-700 font-hand text-3xl font-bold">
              Моя принцесса
            </p>
          </div>
          <p className="mt-16 text-rose-400 font-heading italic text-2xl drop-shadow-sm">Ты — моё самое большое счастье.</p>
        </div>
      )}
    </div>
  );
}

// ─── Главное Приложение ────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const nextStep = () => {
    if (step === 1 && !isMusicPlaying) {
      setIsMusicPlaying(true);
    }
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen text-text-main overflow-x-hidden relative font-body selection:bg-rose-200 flex flex-col">
      <div className="magic-bg fixed inset-0 z-0" />
      <div className="fixed inset-0 z-0 pointer-events-none"><MagicParticles /></div>
      
      <main className="relative z-10 w-full flex-grow flex items-center justify-center py-10 px-4 sm:px-8">
        {step === 1 && <Step1 onNext={nextStep} />}
        {step === 2 && <Step2 onNext={nextStep} />}
        {step === 3 && <Step3 onNext={nextStep} />}
        {step === 4 && <Step4 onNext={nextStep} />}
        {step === 5 && <Step5 onNext={nextStep} pauseMusic={() => setIsMusicPlaying(false)} />}
        {step === 6 && <Step6 onNext={nextStep} />}
        {step === 7 && <Step7 onNext={nextStep} />}
        {step === 8 && <Step8 />}
      </main>

      <div className="opacity-100 transition-opacity duration-1000 z-50">
        <MusicPlayer 
          isPlaying={isMusicPlaying} 
          toggleMusic={() => setIsMusicPlaying(!isMusicPlaying)} 
          setMusicState={setIsMusicPlaying}
        />
      </div>
    </div>
  );
}
