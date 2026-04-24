import { getTranslations } from 'next-intl/server';

import { numberList } from '@/lib/utils/arrayUtils';
import Faq from '@/components/Faq';
import HeroSection from '@/components/home/new-section/HeroSection';
import ExampleSection from '@/components/home/ExampleSection';
import CoreFeaturesCards from '@/components/home/CoreFeaturesCards';
import HomeCarousel from '@/components/home/HomeCarousel';
import type { CarouselCard } from '@/components/home/HomeCarousel';

const exampleImages = [
  {
    src: 'https://cdn.heydream.im/heydream/v3/home_page/example/example1.webp',
    prompt: 'A towering, larger-than-life rectangular perfume bottle with a dark blue body and a prominent "LOEWE" label, positioned diagonally across the frame, adorned with two small white doves perched on its edge a small white bird flying in the upper right corner, with a cylindrical light brown cap intricately embossed with a pattern, in a surreal, distorted aerial city and coastal landscape featuring a winding highway along a coastline, urban buildings extending into the distance, and the sea curving uniquely in the background, under a bright blue sky with faint clouds. Style: Photorealistic, Surrealism, Advertisement Photography Lighting: Bright natural light, enhancing reflections on the bottle. Composition: Low-angle, wide-lens perspective looking up at the colossal bottle, with a dramatic fisheye-like distortion of the background cityscape and coastline. Details: Glossy finish on the bottle, detailed texture on the wooden cap, minute details of the city, clear reflections, tranquil doves, ethereal atmosphere. Quality: High Detail, 8K, Masterpiece, Award-winning photography'
  },
  {
    src: 'https://cdn.heydream.im/heydream/v3/home_page/example/example2.webp',
    prompt: 'Snowboarder soaring mid-air during a stylish jump off a snow ramp, body dynamically twisted, snow particles scattering around. Blue jacket, white pants, white hood, orange-tinted goggles. Snowy mountain peaks under a clear blue sky. Cinematic action frame with dramatic lighting, strong contrast, bright sunlight and defined shadows. Close-up composition with crisp focus on the rider, motion blur on the edges, depth of field enhancing background separation. Detailed textures on clothing, goggles glint, red-accented snowboard base, sharp mountain contours. High detail, 4K, photorealistic, masterpiece quality.'
  },
  {
    src: 'https://cdn.heydream.im/heydream/v3/home_page/example/example3.webp',
    prompt: 'An imaginative double-exposure portrait of a woman in profile, her face serene and elegant as it blends seamlessly with ancient stone ruins and misty cliffs. Her flowing hair transforms into crumbling architecture framed by autumn-colored trees, all wrapped in atmospheric fog. The composition feels both romantic and mysterious, evoking themes of memory, decay, and beauty within ruins. A muted palette of gray-greens and soft earth tones enhances the ethereal mood, while her red lips create a striking contrast, symbolizing life amid history. The portrait is cinematic, poetic, and hauntingly beautiful, as if frozen in time.'
  },
  {
    src: 'https://cdn.heydream.im/heydream/v3/home_page/example/example4.webp',
    prompt: 'A futuristic glass bridge curving through a lush tropical jungle, with people walking along it, a sleek silver futuristic vehicle flying near the bridge, and a traditional wooden house nestled among the trees. Below the bridge, a vibrant turquoise river flows with a powerful waterfall cascading into it, and small orange birds fly around. In the distance, misty mountains are covered in dense vegetation. Style: Photorealistic, Concept Art Lighting: Bright natural light with sun rays filtering through the foliage, brilliant reflections on the glass bridge and water Composition: High angle shot looking down along the length of the bridge and into the canyon Details: Intricate details of the glass bridge structure, lush tropical foliage, sparkling water, a grand waterfall, flying futuristic vehicle, birds in flight, misty atmosphere in the distance, vibrant colors Quality: High Detail, 4K, Masterpiece, Rendered in Octane'
  },
  {
    src: 'https://cdn.heydream.im/heydream/v3/home_page/example/example5.webp',
    prompt: 'A lone astronaut, wearing a beige and blue striped spacesuit, lying peacefully on their back, resting in a vibrant yellow wildflower field, a large white futuristic spaceship is partially obscured behind them in the midground, surrounded by massive jagged dark grey rocky mountains and peaks, with tiny sparse green foliage clinging to them under a bright blue sky with fluffy white clouds, with a large, misty pale blue planet and a smaller moon visible in the distance, and several smaller flying vehicles in the upper distance. Style: Sci-fi Concept Art, Digital Painting Lighting: Bright natural sunlight, casting gentle shadows Composition: Medium shot, slight low angle showcasing the flowers and stretching towards the sky and mountains Details: Intricate detail on the spacesuit and spaceship, individual petals visible on the wildflowers, textured rock faces, subtle atmospheric haze around the distant planet, serene and tranquil atmosphere. Quality: High Detail, 8K, Masterpiece, Award-winning, Breathtaking Composition'
  },
  {
    src: 'https://cdn.heydream.im/heydream/v3/home_page/example/example6.webp',
    prompt: 'A colossal white and blue mechanized Gundam, with intricate details and yellow V-fin, standing tall and partially assembled, surrounded by numerous tiny engineers and maintenance crew working on it, holding various tools and equipment, in a massive, cluttered, and multi-level industrial hangar or maintenance bay. Style: Mecha Anime, Sci-Fi Illustration, Digital Art Lighting: Dynamic, volumetric lighting with strong blue and orange glows emanating from various parts of the hangar and the robot, creating sharp contrasts and highlights. Composition: High-angle wide shot, looking down on the Gundam, emphasizing its immense scale relative to the human workers and the surrounding environment. Details: High level of mechanical and environmental details, cables, pipes, scaffolding, platforms, small vehicles, bustling activity, a sense of awe and industry, grungy textures, futuristic aesthetic. Quality: Ultra-detailed, 8K, Masterpiece, Concept Art, Photorealistic elements.'
  },
]

export default async function Page() {
  const t = await getTranslations('Home');
  const tCarousel = await getTranslations('Home.carousel');
  const tExampleSection = await getTranslations('Home.exampleSection');

  const carouselData: CarouselCard[] = [
    {
      type: tCarousel('video.type'),
      media: {
        type: 'video',
        src: 'https://cdn.heydream.im/heydream/v3/home_page/tools/ai_video_generator_video.mp4',
        poster: 'https://cdn.heydream.im/heydream/v3/home_page/tools/ai_video_generator.webp'
      },
      href: '/image-to-video'
    },
    {
      type: tCarousel('image.type'),
      media: {
        type: 'image',
        src: 'https://cdn.heydream.im/heydream/v3/home_page/tools/ai_image_generator.webp'
      },
      href: '/text-to-image'
    },
    {
      type: tCarousel('tryon.type'),
      media: {
        type: 'image',
        src: 'https://cdn.heydream.im/heydream/v3/virtual_try_on/feature/1_1.webp'
      },
      href: '/virtual-try-on'
    }
  ];

  return (
    <div className='relative w-full'>
      <div className='absolute -top-[70px] left-0 -z-10 flex hidden h-screen w-full items-center justify-center lg:block'>
        <img
          alt='bg'
          width={1920}
          height={1134}
          src='https://cdn.flaq.ai/flaq/home_page/background/background_web.webp'
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
            objectPosition: 'center',
          }}
        />
      </div>
      <img
        className='absolute -top-[70px] left-0 -z-10 block h-[150vh] w-full lg:hidden'
        alt='bg-mobile'
        width={375}
        height={428}
        src='https://cdn.flaq.ai/flaq/home_page/background/background_phone.webp'
        style={{
          objectFit: 'cover',
          objectPosition: 'top',
        }}
      />
      <HeroSection />
      <HomeCarousel data={carouselData} title={t('carousel.title')} description={t('carousel.description')} className='mb-12 lg:mb-20' />
      <CoreFeaturesCards
        title={t('unique-features.title')}
        description={t('unique-features.description')}
        buttonText={t('unique-features.button-text')}
        buttonHref='/image-to-video'
        features={numberList(4).map((num) => ({
          title: t(`unique-features.${num}.title`),
          description: t(`unique-features.${num}.description`),
        }))}
      />
      <ExampleSection
        autoPlay={false}
        title={tExampleSection('title')}
        description={tExampleSection('description')}
        imageExamplesTitle={tExampleSection('imageExamples.title')}
        imageExamplesDescription={tExampleSection('imageExamples.description')}
        videoExamplesTitle={tExampleSection('videoExamples.title')}
        videoExamplesDescription={tExampleSection('videoExamples.description')}
        promptLabel={tExampleSection('videoExamples.promptLabel')}
        images={exampleImages}
        videos={[
          {
            src: 'https://youtu.be/icZrOIAAgZ0?si=8mJ3KpKFcksTltdr',
            prompt: tExampleSection('videos.0.prompt'),
          },
          {
            src: 'https://youtu.be/SpcBjq_GpUA?si=391HXbKwMvtuXkOx',
            prompt: tExampleSection('videos.1.prompt'),
          },
        ]}
      />
      <CoreFeaturesCards
        title={t('use-cases.title')}
        description={t('use-cases.description')}
        buttonText={t('use-cases.button-text')}
        buttonHref='/image-to-video'
        features={numberList(4).map((num) => ({
          title: t(`use-cases.${num}.title`),
          description: t(`use-cases.${num}.description`),
        }))}
      />
      <Faq
        title={t('faq.title')}
        faqList={numberList(8).map((num) => ({
          id: num,
          question: t(`faq.${num}.question`),
          answer: t(`faq.${num}.answer`),
        }))}
        className='py-[60px] lg:py-[120px]'
      />
    </div>
  );
}
