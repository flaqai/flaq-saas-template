'use client';

import { useState, useRef } from 'react';
import { WandSparkles, ArrowRight, Shuffle, Image, Film } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import SingleImageUpload, { SingleImageUploadRef } from '@/components/common/SingleImageUpload';
import MultiImageUpload, { MultiImageUploadRef } from '@/components/common/MultiImageUpload';
import useImageFormDefaultStore from '@/store/form/useImageFormDefaultStore';
import useImageFormStore from '@/store/form/useImageFormStore';
import useVideoFormDefaultStore from '@/store/form/useVideoFormDefaultStore';
import ModelBrandsBar from '@/components/home/ModelBrandsBar';
import useUploadFiles from '@/hooks/use-upload-files';

type GenerationType = 'image' | 'video';

interface PromptItem {
  id: string;
  title: string;
  content: string;
  imageSrc?: string;
}

const IMAGE_PROMPTS: PromptItem[] = [
  {
    id: 'img-1',
    title: 'Girl in a Ferrari at Sunset',
    content:
      'Cinematic wide-angle interior shot, a stylish young woman lounging inside a red Ferrari during golden hour. Early 20s woman, long glossy jet-black hair with slight windblown texture, fair skin with warm golden sunlight, confident alluring gaze into camera, slight pout. Wearing a red satin mini dress with sweetheart or draped neckline, no logos. Reclined across the front passenger seat, one leg extended toward the camera with foreshortened perspective, one knee bent, left hand touching hair or resting on forehead. Luxury Italian sports car interior, black leather seats, carbon fiber and brushed metal details, modern Ferrari steering wheel partially visible in foreground. Natural golden hour sunlight streaming through side window, warm amber tones, strong contrast, deep shadows inside cabin, sunlight highlighting face, hair, legs, and satin fabric sheen. 35mm film photography, cinematic editorial fashion style, luxury indie road trip vibe, Americana meets Italian supercar aesthetic. Kodak Portra 400 color grading, realistic film grain, ultra-realistic textures, shallow depth of field, sharp subject focus, slightly soft background.',
  },
  {
    id: 'img-2',
    title: 'Watching Her Own Portrait',
    content:
      "A cinematic, realistic studio scene of a young woman standing beside an easel, quietly observing an oil portrait of herself. The painting features expressive brushstrokes and warm earthy tones, capturing her likeness with emotional depth. The woman wears a cozy neutral sweater, her short wavy hair softly framing her face. Natural window light enters from the side, creating gentle shadows and a calm, introspective mood. The artist's workspace is visible with paintbrushes, palettes, and textured walls, giving an authentic fine-art atmosphere. Shallow depth of field, painterly realism, soft highlights, warm color grading, high detail, 4K quality, cinematic composition, aspect ratio 1:1.",
  },
  {
    id: 'img-3',
    title: 'Paper Pikachu',
    content:
      'A hyper-detailed paper sculpture of Pikachu, mounted inside a minimalist museum display box. The figure is crafted from layered premium paper with visible folds, edges, and textures. Soft gallery lighting, glass reflections, subtle depth-of-field. High-end collectible art style, photorealistic finish, sharp focus. 1:1 square format.',
  },
  {
    id: 'img-4',
    title: 'Tokyo Rain Street Girl',
    content:
      "hyper-realistic fisheye lens street portrait of a cool young woman squatting low in the rain on a Tokyo night street, extreme low-angle worm's-eye view, barrel distortion. She has a messy platinum blonde bob and wears an oversized black sweatshirt with baggy light-wash denim jeans and white sneakers, looking down at the camera with a confident, defiant expression. Directly behind her is a vintage white '90s JDM sports car with pop-up headlights. The background is a towering vertical cityscape of glowing red and white neon Japanese signs curving inward, heavy rain streaks, and wet asphalt reflections. Lighting is harsh, direct on-camera flash against a dark, moody background, high contrast, 35mm film grain, street racing editorial aesthetic, 8k resolution.",
  },
  {
    id: 'img-5',
    title: 'Kawaii Gamer Selfie',
    content:
      'Kawaii gamer aesthetic, mirror selfie, smartphone photo. A young pale woman with porcelain skin, long black hair and straight bangs, wearing cute cow ears. Sitting on a bed, cow-print crop top, black skirt, white thigh-high socks, holding a purple phone case. Gamer bedroom background: pink gaming chair, PC with blue and purple RGB lights, shelves. Mixed natural window light and neon RGB glow, cool white balance, soft shadows. Clean, cute, cozy gamer cosplay vibe, focus on subject, realistic lighting.',
  },
  {
    id: 'img-6',
    title: 'Camera angles poster',
    content:
      'Create a poster that visually explains the most common camera angles in filmmaking, with clear labels and examples for each angle, cinematic, realistic',
  },
  {
    id: 'img-7',
    title: 'Karakuri Ninja Oboro Setup',
    content:
      "A Famicom game box, cartridge, and manual for the game 'Karakuri Ninja Oboro,' featuring the character from the image as the protagonist, with the game screen displayed on a CRT television.",
  },
  {
    id: 'img-8',
    title: 'Triptych of a Gentleman',
    content:
      'A high-contrast black and white triptych collage with three panels. Hyper-realistic 8K portrait photography of a handsome man wearing a black leather jacket and vintage steampunk aviator sunglasses with leather side shields. Three different poses and angles: front-facing portrait, side profile, and head tilted upward. Each panel shows a distinct expression. Cinematic studio lighting, strong contrast, dramatic rim light highlighting the leather texture. Detailed skin texture, visible pores, masculine facial features. Monochrome, classic black and white film photography style, professional editorial look.',
  },
  {
    id: 'img-9',
    title: 'Different Hairstyles',
    content: 'make a 3x3 grid with different hairstyles',
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/image/different_hairstyles.webp',
  },
  {
    id: 'img-10',
    title: 'Selfie with Luffy',
    content:
      'Place Monkey D. Luffy next to the man, smiling widely with his straw hat tilted. Use a Thousand Sunny deck background with bright blue sky. Keep the selfie composition intact and integrate both characters naturally.',
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/image/selfie_with_luffy.webp',
  },
  {
    id: 'img-11',
    title: 'Facial Aesthetic Report',
    content:
      'Use the provided portrait photo <YOUR PHOTO> as the base.\nDo NOT change the person\'s face, expression, age, skin tone or gender.\nJust overlay a clean, minimal infographic on top.\nCreate a high-resolution vertical "FACIAL AESTHETIC REPORT" poster, studio lighting, soft beige background, premium beauty clinic style.\nThe subject can be MALE or FEMALE – keep them exactly as in the original photo.\nAdd thin white lines and labels pointing to each area of the REAL face, with percentage scores based on global aesthetic ratios, symmetry and proportions (not changing the face):\n1. Eyes:\n   Label near the eyes with a line pointing to them:\n   "Eyes Beauty – 0–100%"\n   Example: "Eyes Beauty – 92%"\n2. Cheeks:\n   Label near the cheekbones:\n   "Cheeks Harmony – 0–100%"\n   Example: "Cheeks Harmony – 85%"\n3. Lips:\n   Label close to the mouth:\n   "Lips Shape – 0–100%"\n   Example: "Lips Shape – 88%"\n4. Eyebrows:\n   Label above or beside the brows:\n   "Eyebrows Design – 0–100%"\n   Example: "Eyebrows Design – 80%"\n5. Jaw & Chin:\n   Label near the jawline and chin:\n   "Jaw & Chin Definition – 0–100%"\n   Example: "Jaw & Chin Definition – 90%"\n6. Overall Facial Symmetry:\n   Label near the center of the face:\n   "Facial Symmetry – 0–100%"\n   Example: "Facial Symmetry – 89%"\nAt the bottom center of the poster, add a BIG, bold number inside a circle or rectangle:\n"OVERALL SCORE: XX%"\nThis is the total facial aesthetic score from 1–100%.\nDesign style:\n– clean, medical-grade, aesthetic-clinic infographic\n– modern thin sans-serif typography\n– white text and lines, subtle drop shadows\n– no logos, no extra graphics, no text other than the labels and scores above.',
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/image/facial_aesthetic_report.webp',
  },
  {
    id: 'img-12',
    title: 'OOTD',
    content:
      'Create an OOTD collage of a stylish. On the left, place a full-body or half-body subject, and on the right, arrange each clothing item on a clean white background with product image, brand name, product name in English, and price in USD. Use bright, natural lighting, realistic clothing textures, modern sans-serif fonts, and a clean, minimal magazine-style layout with spacious, professional composition. The overall style should resemble trendy OOTD collages seen on fashion blogs or social media—youthful, practical, visually appealing, and cohesive in color and branding. Avoid referencing any specific original image details; focus on general style, composition, and presentation.',
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/image/ootd.webp',
  },
];

const VIDEO_PROMPTS: PromptItem[] = [
  {
    id: 'vid-1',
    title: '80s Corporate Worker Late Night',
    content:
      'Medium shot, a tired corporate worker in rolled-up sleeves and loosened tie, rubbing his temples in exhaustion while staring at a bulky beige 1980s computer in a cluttered office late at night. Stacks of paper and coffee cups surround him. The scene is lit by harsh fluorescent overhead lights and the green phosphor glow of the monochrome CRT monitor. Retro 1980s aesthetic, shot as if on period-accurate color film stock, slightly grainy with warm color temperature, nostalgic and weary mood.',
  },
  {
    id: 'vid-2',
    title: 'Prism Light',
    content:
      'A close-up cinematic shot of a transparent glass prism rotating slowly on a velvet black surface. A beam of spectral light hits the prism, scattering vibrant rainbows across the frame. High-end product photography style, 8k resolution, smooth 60fps. Audio: A deep, crystalline shimmer sound, minimal ambient synth pad.',
  },
  {
    id: 'vid-3',
    title: 'Master Craftsman',
    content:
      "Extreme close-up of an elderly craftsman's weathered hands carving a delicate wooden bird. Tiny wood shavings fall in slow motion. Warm sunlight streaming through a dusty workshop window. Shallow depth of field, focus on the texture of the skin and wood. Audio: The rhythmic scraping of a metal blade on dry wood, soft breathing, distant birds chirping.",
  },
  {
    id: 'vid-4',
    title: 'Gourmet Chocolate Dessert Pour',
    content:
      'A macro shot from above shows a chocolate lava cake on a delicate wooden platter atop a rustic wooden table. Melted dark chocolate sauce slowly pours over the enticing chocolate lava cake, steaming hot as it cascades down, forming pools around the dessert on the wooden platter. Fresh mint leaves and gold leaf garnishes catch the light. Warm ambient light from the side creates rich highlights and shadows. The beauty of food photography, captured with an f/2.8 macro lens, is mouth-watering and captivating. The special effect: the gentle pouring sound, the soft restaurant atmosphere.',
  },
  {
    id: 'vid-5',
    title: 'Victorian Era Street Scene',
    content:
      'Wide establishing shot, a bustling Victorian-era London street in 1890, with horse-drawn carriages clattering over cobblestones, ladies in elaborate dresses and gentlemen in top hats walking past gas-lit storefronts. Fog rolls through creating atmospheric haze. A newspaper boy shouts headlines. Period drama aesthetic, shot on 35mm film with soft focus, historical and atmospheric mood, sepia-toned color grading with muted earth tones. SFX: horse hooves on cobblestones, distant street vendors calling, carriage wheels creaking.',
  },
  {
    id: 'vid-6',
    title: 'Walking Toward the Sea',
    content:
      'In rural Ireland, circa 1860s, two women, their long, modest dresses of homespun fabric whipping gently in the strong coastal wind, walk with determined strides across a windswept cliff top. The ground is carpeted with hardy wildflowers in muted hues. They move steadily towards the precipitous edge, where the vast, turbulent grey-green ocean roars and crashes against the sheer rock face far below, sending plumes of white spray into the air.',
  },
  {
    id: 'vid-7',
    title: 'Midnight Metropolis',
    content:
      'A drone FPV shot flying through a neon-drenched futuristic city at night during a heavy rainstorm. Massive holographic advertisements reflect on the wet asphalt. Flying vehicles zip past the camera with light trails. High contrast, cinematic teal and orange color grading. Audio: Heavy rain pattering, low-frequency hum of anti-gravity engines, muffled city sirens.',
  },
  {
    id: 'vid-8',
    title: 'Macro Nature',
    content:
      'A macro shot of a single dewdrop hanging from the tip of a vibrant green leaf. Inside the dewdrop, the entire forest is reflected in perfect detail. A ladybug crawls slowly toward the drop. Soft morning bokeh, hyper-realistic textures. Audio: Distant forest ambience, soft water drip sound, high-pitched cicada chirps.',
  },
  {
    id: 'vid-9',
    title: 'The Old Sailor and the Sea',
    content:
      'A medium shot frames an old sailor, his knitted blue sailor hat casting a shadow over his eyes, a thick grey beard obscuring his chin. He holds his pipe in one hand, gesturing with it towards the churning, grey sea beyond the ship\'s railing. "This ocean, it\'s a force, a wild, untamed might. And she commands your awe, with every breaking light"',
  },
  {
    id: 'vid-10',
    title: 'Covert at the Station',
    content:
      'A close up of spies exchanging information in a crowded train station with uniformed guards patrolling nearby "The microfilm is in your ticket" he murmured pretending to check his watch "They\'re watching the north exit" she warned casually adjusting her scarf "Use the service tunnel" Commuters rush past oblivious to the covert exchange happening amid announcements of arrivals and departures',
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/video/covert_at_the_station.webp',
  },
  {
    id: 'vid-11',
    title: 'Beverage Commercial',
    content:
      'A hyper-slow motion cinematic transition. The camera orbits 360 degrees around the floating neon-orange "VOLT PULSE" can. The electric orange liquid splashes elegantly, with individual droplets and sliced lemons rotating slowly in mid-air. Soft golden light catches the condensation on the aluminum, creating a shimmering effect. Smooth, fluid movement, high-end commercial aesthetic, 120fps feel.',
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/video/beverage_commercial.webp',
  },
  {
    id: 'vid-12',
    title: 'Girl on a Night Bus',
    content:
      "Close-up with very shallow depth of field, a young woman's face, looking out a bus window at the passing city lights with her reflection faintly visible on the glass, inside a bus at night during a rainstorm, melancholic mood with cool blue tones, moody, cinematic.",
    imageSrc: 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/hints/video/girl_on_a_night_bus.webp',
  },
];

export default function HeroFormSection() {
  const t = useTranslations('components.hero-form');
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const setImagePrompt = useImageFormDefaultStore((state) => state.setPrompt);
  const setVideoFormImageSrc = useImageFormStore((state) => state.setVideoFormImageSrc);
  const setVideoPrompt = useVideoFormDefaultStore((state) => state.setPrompt);
  const uploadFilesToStorageThroughBackEnd = useUploadFiles();
  const [generationType, setGenerationType] = useState<GenerationType>('image');
  const [prompt, setPrompt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 随机选择初始提示词的辅助函数
  const getRandomPrompts = (prompts: PromptItem[]) => {
    const promptsWithImage = prompts.filter((p) => p.imageSrc);

    let selected: PromptItem[] = [];

    // 确保至少有一个带图片的提示词
    if (promptsWithImage.length > 0) {
      // 随机选择1个带图片的
      const shuffledWithImage = [...promptsWithImage].sort(() => Math.random() - 0.5);
      selected.push(shuffledWithImage[0]);

      // 从剩余的提示词中随机选择2个
      const remaining = prompts.filter((p) => p.id !== selected[0].id);
      const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5);
      selected.push(...shuffledRemaining.slice(0, 2));
    } else {
      // 如果没有带图片的提示词，就随机选择3个
      const shuffled = [...prompts].sort(() => Math.random() - 0.5);
      selected = shuffled.slice(0, 3);
    }

    return selected;
  };

  const [displayedPrompts, setDisplayedPrompts] = useState<PromptItem[]>(() => getRandomPrompts(IMAGE_PROMPTS));
  const [usedPromptIds, setUsedPromptIds] = useState<Set<string>>(
    () => new Set(getRandomPrompts(IMAGE_PROMPTS).map((p) => p.id)),
  );

  const multiImageUploadRef = useRef<MultiImageUploadRef>(null);
  const singleImageUploadRef = useRef<SingleImageUploadRef>(null);

  const handleRandomize = () => {
    const allPrompts = generationType === 'image' ? IMAGE_PROMPTS : VIDEO_PROMPTS;

    // 获取未使用的提示词
    let availablePrompts = allPrompts.filter((p) => !usedPromptIds.has(p.id));

    // 如果剩余提示词不足3个，重置已使用池
    if (availablePrompts.length < 3) {
      setUsedPromptIds(new Set());
      availablePrompts = allPrompts;
    }

    // 使用辅助函数随机选择
    const selected = getRandomPrompts(availablePrompts);

    // 更新已使用的提示词ID
    setUsedPromptIds((prev) => {
      const newSet = new Set(prev);
      selected.forEach((p) => newSet.add(p.id));
      return newSet;
    });

    setDisplayedPrompts(selected);
  };

  const handlePromptClick = (promptItem: PromptItem) => {
    setPrompt(promptItem.content);

    // 根据提示词是否有图片，更新上传组件
    if (generationType === 'image') {
      if (promptItem.imageSrc) {
        // 有图片：替换为提示词的图片
        multiImageUploadRef.current?.setImageUrls([promptItem.imageSrc]);
      } else {
        // 没图片：清空图片
        multiImageUploadRef.current?.removeAllImages();
      }
    } else if (promptItem.imageSrc) {
      // 视频生成且有图片：设置图片 URL
      singleImageUploadRef.current?.setImageUrl(promptItem.imageSrc);
    } else {
      // 视频生成且没图片：清空图片
      singleImageUploadRef.current?.removeImage();
    }
  };

  const handleGenerationTypeChange = (type: GenerationType) => {
    setGenerationType(type);
    const prompts = type === 'image' ? IMAGE_PROMPTS : VIDEO_PROMPTS;
    const selected = getRandomPrompts(prompts);
    setDisplayedPrompts(selected);
    setUsedPromptIds(new Set(selected.map((p) => p.id)));
  };

  const handleGenerate = async () => {
    if (isUploading) return;

    if (generationType === 'image') {
      setImagePrompt(prompt || '');
      router.push('/text-to-image/');
    } else {
      // AI Video: 传递提示词和图片
      setVideoPrompt(prompt || '');

      // 获取当前图片（可能是用户上传的或提示词的图片）
      const currentImage = singleImageUploadRef.current?.getImage();

      // 处理图片上传
      if (currentImage) {
        if (currentImage instanceof File) {
          setIsUploading(true);
          try {
            const uploadedUrls = await uploadFilesToStorageThroughBackEnd([
              { data: currentImage, type: currentImage.type },
            ]);
            if (uploadedUrls.length > 0) {
              setVideoFormImageSrc(uploadedUrls[0]);
            }
          } catch (error) {
            console.error('Upload failed:', error);
            toast.error(tCommon('upload-failed'));
            setIsUploading(false);
            return;
          } finally {
            setIsUploading(false);
          }
        } else if (typeof currentImage === 'string') {
          setVideoFormImageSrc(currentImage);
        }
      }

      router.push('/image-to-video/');
    }
  };

  const leftImage = 'https://cdn.heydream.im/heydream/v3/home_page/generator/ai_image_video/default.png';

  return (
    <div className='container-gap flex flex-col items-center overflow-x-hidden py-5 mb-10 lg:pb-20 lg:pt-5'>
      {/* Title and Description */}
      <div className='flex w-full max-w-5xl flex-col items-center gap-3 text-center'>
        <h1 className='text-white text-[32px] font-semibold leading-tight lg:text-[64px]'>
          {tHome('heading.title')}
        </h1>
        <p className='text-sm opacity-70 lg:text-lg'>{tHome('heading.description')}</p>
      </div>

      {/* Tab Switcher */}
      <div className='flex items-center gap-1.5 rounded-xl bg-white/50 p-1'>
        <div className='flex items-center justify-center gap-1.5 lg:gap-2 rounded-xl px-3 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium text-color-main bg-white shadow-sm whitespace-nowrap'>
          <WandSparkles className='size-5 lg:size-6 icon-gradient-purple' />
          <span className='text-color-main'>{t('tab.image-video')}</span>
        </div>
      </div>

      {/* SVG Gradient Definition */}
      <svg width='0' height='0' style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id='gradient-purple' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' style={{ stopColor: '#6E51FF', stopOpacity: 1 }} />
            <stop offset='100%' style={{ stopColor: '#E75DF1', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Content Area */}
      <div className='flex w-full max-w-[1400px] flex-col gap-3 lg:flex-row'>
        {/* Left: Display Image - Hidden on mobile */}
        <div className='hidden lg:flex w-auto items-center justify-center'>
          <div className='flex h-[500px] w-auto items-center justify-center overflow-hidden rounded-2xl'>
            <img src={leftImage} alt='Preview' className='h-full w-auto object-contain' />
          </div>
        </div>

        {/* Right: Form Area */}
        <div className='flex flex-1 flex-col'>
          <div className='flex h-[600px] lg:h-[500px] flex-col gap-3 rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md p-4 lg:p-6'>
            {/* AI Image/Video Form */}
            <>
                {/* Image/Video Upload */}
                <div className='shrink-0'>
                  {generationType === 'image' ? (
                    <MultiImageUpload ref={multiImageUploadRef} maxImages={5} />
                  ) : (
                    <SingleImageUpload
                      ref={singleImageUploadRef}
                      className='h-[150px]'
                      label={t('image-video.video-upload-hint')}
                    />
                  )}
                </div>

                {/* Prompt Input Area */}
                <div className='flex flex-1 min-h-[280px] md:min-h-0 flex-col rounded-xl bg-white/40 p-3'>
                  {/* Generation Type Tabs - Mobile: inside prompt area at top */}
                  <div className='flex lg:hidden items-center justify-center gap-2 rounded-lg bg-[#F1EEFF] p-1 mb-3'>
                    <button
                      type='button'
                      onClick={() => handleGenerationTypeChange('image')}
                      className={cn(
                        'flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors',
                        generationType === 'image'
                          ? 'bg-white shadow-sm'
                          : 'text-[#595959]',
                      )}
                    >
                      <Image
                        className={cn('size-4', generationType === 'image' ? 'text-color-main' : 'text-[#595959]')}
                      />
                      <span className={cn(generationType === 'image' && 'text-color-main')}>
                        {t('image-video.type.image')}
                      </span>
                    </button>
                    <button
                      type='button'
                      onClick={() => handleGenerationTypeChange('video')}
                      className={cn(
                        'flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors',
                        generationType === 'video'
                          ? 'bg-white shadow-sm'
                          : 'text-[#595959]',
                      )}
                    >
                      <Film
                        className={cn('size-4', generationType === 'video' ? 'text-color-main' : 'text-[#595959]')}
                      />
                      <span className={cn(generationType === 'video' && 'text-color-main')}>
                        {t('image-video.type.video')}
                      </span>
                    </button>
                  </div>

                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('image-video.prompt-placeholder')}
                    className='flex-1 resize-none bg-transparent text-sm text-[#1F1F1F] caret-[#1F1F1F] placeholder:text-black/60 focus:outline-none custom-scrollbar'
                  />

                  {/* Bottom Controls - Desktop only shows type tabs */}
                  <div className='flex items-center justify-between pt-3'>
                    {/* Generation Type Tabs - Desktop: at bottom */}
                    <div className='hidden lg:flex items-center gap-2 rounded-lg bg-[#F1EEFF] p-1'>
                      <button
                        type='button'
                        onClick={() => handleGenerationTypeChange('image')}
                        className={cn(
                          'flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors',
                          generationType === 'image'
                            ? 'bg-white shadow-sm'
                            : 'text-[#595959]',
                        )}
                      >
                        <Image
                          className={cn('size-4', generationType === 'image' ? 'text-color-main' : 'text-[#595959]')}
                        />
                        <span className={cn(generationType === 'image' && 'text-color-main')}>
                          {t('image-video.type.image')}
                        </span>
                      </button>
                      <button
                        type='button'
                        onClick={() => handleGenerationTypeChange('video')}
                        className={cn(
                          'flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors',
                          generationType === 'video'
                            ? 'bg-white shadow-sm'
                            : 'text-[#595959]',
                        )}
                      >
                        <Film
                          className={cn('size-4', generationType === 'video' ? 'text-color-main' : 'text-[#595959]')}
                        />
                        <span className={cn(generationType === 'video' && 'text-color-main')}>
                          {t('image-video.type.video')}
                        </span>
                      </button>
                    </div>

                    {/* Generate Button - Always visible */}
                    <button
                      type='button'
                      onClick={handleGenerate}
                      disabled={isUploading}
                      className={cn(
                        'flex size-10 lg:size-12 items-center justify-center rounded-lg bg-[#E8E3FF] hover:bg-[#DFD7FF] transition-colors ml-auto',
                        isUploading && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      {isUploading ? (
                        <div className='size-5 lg:size-6 animate-spin rounded-full border-2 border-[#6E51FF] border-t-transparent' />
                      ) : (
                        <ArrowRight className='size-6 lg:size-8 text-color-main' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Prompt Suggestions */}
                <div className='flex flex-col md:flex-row md:items-center gap-2 shrink-0'>
                  {/* Mobile: 3 rows layout with shuffle button at top-left */}
                  <div className='flex md:hidden flex-col gap-2 w-full'>
                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={handleRandomize}
                        className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E8E3FF] hover:bg-[#DFD7FF] transition-colors'
                      >
                        <Shuffle className='size-4 text-[#595959]' />
                      </button>
                      {displayedPrompts[0] && (
                        <button
                          type='button'
                          onClick={() => handlePromptClick(displayedPrompts[0])}
                          className='min-h-8 h-8 rounded-lg border border-[#E0E0E0] bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#595959] px-3 py-1 text-xs transition-colors flex items-center justify-center'
                        >
                          <span className='flex items-center gap-1 whitespace-nowrap'>
                            {displayedPrompts[0].title}
                            {displayedPrompts[0].imageSrc && <Image className='size-4 shrink-0' />}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='size-8 shrink-0' />
                      {displayedPrompts[1] && (
                        <button
                          type='button'
                          onClick={() => handlePromptClick(displayedPrompts[1])}
                          className='min-h-8 h-8 rounded-lg border border-[#E0E0E0] bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#595959] px-3 py-1 text-xs transition-colors flex items-center justify-center'
                        >
                          <span className='flex items-center gap-1 whitespace-nowrap'>
                            {displayedPrompts[1].title}
                            {displayedPrompts[1].imageSrc && <Image className='size-4 shrink-0' />}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='size-8 shrink-0' />
                      {displayedPrompts[2] && (
                        <button
                          type='button'
                          onClick={() => handlePromptClick(displayedPrompts[2])}
                          className='min-h-8 h-8 rounded-lg border border-[#E0E0E0] bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#595959] px-3 py-1 text-xs transition-colors flex items-center justify-center'
                        >
                          <span className='flex items-center gap-1 whitespace-nowrap'>
                            {displayedPrompts[2].title}
                            {displayedPrompts[2].imageSrc && <Image className='size-4 shrink-0' />}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Desktop: original horizontal layout */}
                  <button
                    type='button'
                    onClick={handleRandomize}
                    className='hidden md:flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#E8E3FF] hover:bg-[#DFD7FF] transition-colors'
                  >
                    <Shuffle className='size-4 text-[#595959]' />
                  </button>
                  <div className='hidden md:flex flex-1 flex-wrap gap-2'>
                    {displayedPrompts.map((promptItem) => (
                      <button
                        key={promptItem.id}
                        type='button'
                        onClick={() => handlePromptClick(promptItem)}
                        className='min-h-8 h-8 rounded-lg border border-[#E0E0E0] bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#595959] px-3 py-1 text-xs transition-colors flex items-center justify-center max-w-[200px]'
                      >
                        <span className='mx-auto flex items-center gap-1 truncate'>
                          {promptItem.title}
                          {promptItem.imageSrc && <Image className='size-4 shrink-0' />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
            </>
          </div>
        </div>
      </div>

      {/* Model Brands Bar */}
      <div
        style={{
          marginLeft: 'calc(-1 * clamp(0.75rem, 4vw, 60px))',
          marginRight: 'calc(-1 * clamp(0.75rem, 4vw, 60px))',
        }}
      >
        <ModelBrandsBar className='mt-0 md:-mt-1 -mb-5' />
      </div>
    </div>
  );
}
