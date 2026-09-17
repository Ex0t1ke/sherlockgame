import React, { useState } from 'react';
import { VictorianItemSvg } from './VictorianItemSvg';
import { X, ZoomIn, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface ItemInspectorModalProps {
  itemType: string;
  itemName: string;
  onClose: () => void;
}

export const ItemInspectorModal: React.FC<ItemInspectorModalProps> = ({
  itemType,
  itemName,
  onClose,
}) => {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isShining, setIsShining] = useState<boolean>(true);

  // Antique Victorian Catalog Descriptions for each 2D model
  const getItemDossier = (type: string) => {
    switch (type) {
      case 'handcuffs':
        return {
          title: 'Шеффилдские шарнирные наручники',
          origin: 'Шеффилд, Йоркшир • ок. 1882 г.',
          material: 'Кованая закаленная сталь с никелированным покрытием',
          lore: 'Оснащены двухпозиционным храповым механизмом с патентом Ричардса. Такие наручники состояли на вооружении инспекторов Скотланд-Ярда во время расследования дела в Уайтчепеле.',
        };
      case 'train':
        return {
          title: 'Модель паровоза системы Стефенсона',
          origin: 'Бирмингем • ок. 1878 г.',
          material: 'Латунь, медь и листовое железо',
          lore: 'Точная действующая миниатюрная копия паровоза Great Western Railway с работающим латунным котлом, спицованными колесами и поршневым шатуном.',
        };
      case 'toy_soldier':
        return {
          title: 'Гвардеец Колдстримского полка',
          origin: 'Лондон • Уильям Бриттен, 1893 г.',
          material: 'Оловянный сплав, ручная роспись эмалью',
          lore: 'Классический солдатик в парадном красном мундире и медвежьей шапке, вооруженный нарезным мушкетом Энфилд. Игрушка принадлежала аристократическому семейству.',
        };
      case 'toy_horse':
        return {
          title: 'Викторианская лошадка-качалка',
          origin: 'Кент • Фабрика Дж. Лайнса, 1885 г.',
          material: 'Резной массив ясеня, натуральная кожа, конский волос',
          lore: 'Расписана под яблочную масть с тисненым сафьяновым седлом и латунными стременами. Традиционный подарок на Рождество в викторианских особняках.',
        };
      case 'necklace':
        return {
          title: 'Жемчужное колье с цейлонским сапфиром',
          origin: 'Мейфэр, Бонд-стрит • 1876 г.',
          material: 'Морской натуральный жемчуг, золото 750 пробы, сапфир 8 карат',
          lore: 'Искусная филигранная оправа с каплевидным цейлонским сапфиром глубокого василькового оттенка. Ценный фамильный артефакт.',
        };
      case 'womans_hat':
        return {
          title: 'Бархатная шляпа-капор с пером страуса',
          origin: 'Париж — Лондон • Модный дом Уорта, 1888 г.',
          material: 'Шелковый бордовый бархат, страусовый плюмаж, гагат',
          lore: 'Элегантный головной убор для прогулок по Риджентс-парку. Скреплен антикварной булавкой из черного чешского гагата.',
        };
      case 'victoria_picture':
        return {
          title: 'Камея с профилем королевы Виктории',
          origin: 'Виндзор • Юбилейный выпуск 1887 г.',
          material: 'Резная слоновая кость, позолоченная бронза, бархат',
          lore: 'Парадный миниатюрный барельеф в раме стиля рококо, созданный в честь Золотого юбилея правления Ее Величества.',
        };
      case 'key':
        return {
          title: 'Готический ключарь хранилища',
          origin: 'Лондонский Тауэр • ок. 1845 г.',
          material: 'Кованое железо с резной бородкой',
          lore: 'Тройной трилистник на рукояти символизирует надежность замка. Зубцы бородки выточены вручную для защиты от отмычек.',
        };
      case 'grapes':
        return {
          title: 'Гроздь мускатного винограда',
          origin: 'Оранжерея Кью-Гарденс • Сорт Muscat of Alexandria',
          material: 'Органический образец',
          lore: 'Свежесрезанная гроздь из отапливаемой оранжереи. Была оставлена незваным гостем в погребе всего несколько часов назад!',
        };
      case 'pocket_watch':
        return {
          title: 'Хронометр Артура с открытым балансом',
          origin: 'Женева — Лондон • Patek & Czapek, 1872 г.',
          material: 'Трехкрышечный корпус из золота 18 карат, рубиновые камни',
          lore: 'Главная улика следствия! На внутренней крышке выгравирован герб владельца и монограмма, указывающая на тайного наследника.',
        };
      case 'pipe':
        return {
          title: 'Пеньковая трубка Шерлока Холмса',
          origin: 'Вена • Морская пенка (Meerschaum), янтарь, серебро',
          material: 'Эшмика (сепиолит), вишневое дерево, стерлинговое серебро',
          lore: 'Трубка, незаменимая в делах "на две или три трубки". Заправлена крепким табаком shag из персидской туфли на Бейкер-стрит 221B.',
        };
      default:
        return {
          title: itemName,
          origin: 'Лондон • Викторианская эпоха',
          material: 'Антикварный предмет',
          lore: 'Важная деталь викторианского обихода, несущая следы преступного замысла.',
        };
    }
  };

  const dossier = getItemDossier(itemType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      
      {/* Victorian Mahogany Showcase Case */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#2e180d] via-[#1e0f08] to-[#120804] rounded-3xl border-4 sm:border-8 border-[#78350f] shadow-[0_0_60px_rgba(0,0,0,0.95)] p-4 sm:p-7 overflow-hidden flex flex-col">
        
        {/* Gold Filigree Inlay Border */}
        <div className="absolute inset-2 border-2 border-amber-500/50 rounded-2xl pointer-events-none" />
        
        {/* Corner Brass Studs */}
        <div className="absolute top-4 left-4 w-3.5 h-3.5 rounded-full bg-amber-400 border border-stone-900 shadow" />
        <div className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full bg-amber-400 border border-stone-900 shadow" />
        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 rounded-full bg-amber-400 border border-stone-900 shadow" />
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 rounded-full bg-amber-400 border border-stone-900 shadow" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-amber-800/80 pb-3 mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-300">
              <ZoomIn className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-serif tracking-widest text-amber-400 uppercase font-black">
                МУЗЕЙНЫЙ ОСМОТР 2D-МОДЕЛИ
              </div>
              <h2 className="text-base sm:text-xl font-serif font-black text-amber-100 drop-shadow">
                {dossier.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playItemFoundBell();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-700/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2D Model Display Pod & Dossier Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
          
          {/* Left: 2D Model Pedestal Stage with Velvet Backing */}
          <div className="relative h-60 sm:h-72 rounded-2xl bg-gradient-to-b from-[#081812] via-[#0d2a1f] to-[#06140e] border-2 border-amber-600/70 p-4 shadow-inner flex flex-col items-center justify-center overflow-hidden">
            {/* Velvet Damask Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

            {/* Brass Magnifying Rim */}
            <div className="absolute inset-4 rounded-full border-2 border-amber-500/40 pointer-events-none" />

            {/* 2D Model Render with Dynamic Rotation and Specular Glare */}
            <div
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.4s ease-out',
              }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
            >
              <VictorianItemSvg type={itemType} isInspecting={true} />
              
              {/* Dynamic Specular Lens Flare */}
              {isShining && (
                <div className="absolute -inset-2 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full pointer-events-none animate-pulse" />
              )}
            </div>

            {/* Model Controls (Rotate & Shine) */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setRotationAngle((a) => a - 45)}
                className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-600/40 text-[11px] font-serif transition-colors cursor-pointer"
              >
                ⟲ -45°
              </button>
              <button
                onClick={() => setRotationAngle((a) => a + 45)}
                className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-600/40 text-[11px] font-serif transition-colors cursor-pointer"
              >
                ⟳ +45°
              </button>
              <button
                onClick={() => setIsShining(!isShining)}
                className="px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-600/40 text-[11px] font-serif transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Блик
              </button>
            </div>
          </div>

          {/* Right: Antique Dossier Information */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="space-y-2.5 p-3.5 rounded-xl bg-[#160f09] border border-amber-800/60 shadow-md">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-400 border-b border-amber-900/60 pb-1">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>ПРОИСХОЖДЕНИЕ И МАТЕРИАЛЫ</span>
              </div>
              <p className="text-xs text-amber-200/90 font-serif">
                <strong className="text-amber-400">Происхождение:</strong> {dossier.origin}
              </p>
              <p className="text-xs text-amber-200/90 font-serif">
                <strong className="text-amber-400">Материалы:</strong> {dossier.material}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#160f09] border border-amber-800/60 shadow-md flex-1">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-400 border-b border-amber-900/60 pb-1 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ДЕТЕКТИВНЫЙ АНАЛИЗ</span>
              </div>
              <p className="text-xs text-amber-100/90 font-serif leading-relaxed italic">
                "{dossier.lore}"
              </p>
            </div>

            <button
              onClick={() => {
                soundEngine.playItemFoundBell();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-stone-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Вернуться к поиску в погребе
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
