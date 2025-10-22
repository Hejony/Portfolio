// FIX: Reverted `import * as React from 'react'` to the standard `import React from 'react'`. The `* as React` form can cause issues with JSX type resolution in some TypeScript configurations, leading to errors where standard HTML elements are not recognized. The standard import practice resolves these JSX intrinsic element errors.
import React from 'react';
import { PortfolioData } from './types';

// --- ★ 중요: 이미지 폴더 구조 안내 ★ ---
// 
// 1. 프로젝트 최상위 폴더(index.html과 같은 위치)에 'images' 폴더를 만들어주세요.
// 2. 'images' 폴더 안에, 아래 코드에 명시된 파일명과 정확히 일치하도록
//    이미지 파일들을 넣어주세요.
//
// [올바른 프로젝트 폴더 구조]
// ├── images/
// │   ├── profile-picture.png
// │   ├── mamonde-thumb.jpg
// │   └── ... (모든 이미지 파일)
// │
// ├── index.html
// └── ...

// Simple SVG icons as React components
const PhotoshopIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="48" height="48" rx="8" fill="#000000"/>
    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">Ps</text>
  </svg>
);
const IllustratorIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill="#000000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">Ai</text>
    </svg>
);
const Substance3DIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill="#000000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">Sg</text>
    </svg>
);
const PremiereProIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill="#000000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">Pr</text>
    </svg>
);
const AfterEffectsIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill="#000000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">Ae</text>
    </svg>
);
const Cinema4DIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill="#000000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontFamily="Arial, sans-serif" fontWeight="bold">C4D</text>
    </svg>
);
const LightroomIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="48" height="48" rx="8" fill="#000000"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">Lr</text>
    </svg>
);
const CanonIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="48" height="48" rx="8" fill="#000000"/>
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold">Canon</text>
  </svg>
);


export const portfolioData: PortfolioData = {
  hero: {
    title: 'Portfolio',
    subtitle: 'Hye Jeong Lee',
  },
  about: {
    name: '이혜정',
    dob: '2000. 02. 07',
    profileImage: 'images/profile-picture.png',
    introduction: [
      '안녕하세요, 콘텐츠 디자이너 이혜정입니다.',
      '브랜드의 가치를 발견하고, 매력적인 스토리와 디자인으로 소비자에게 특별한 경험을 선사하는 일에 열정을 가지고 있습니다. 3D, 모션 그래픽, AI 등 최신 기술을 활용하여 기존에 없던 새로운 콘텐츠를 만드는 것을 즐깁니다.',
    ],
    skills: [
      {
        category: 'Graphic Design',
        tools: [
          { name: 'Photoshop', icon: PhotoshopIcon, description: '디지털 이미지 편집 및 합성을 통한 정교한 비주얼 제작' },
          { name: 'Illustrator', icon: IllustratorIcon, description: '벡터 기반 로고, 아이콘 등 확장성 높은 그래픽 디자인' },
          { name: 'Substance 3D', icon: Substance3DIcon, description: '사실적인 3D 텍스처링 및 재질 표현으로 몰입감 높은 비주얼 구현' },
        ],
      },
      {
        category: 'Video Making',
        tools: [
          { name: 'Premiere Pro', icon: PremiereProIcon, description: '영상 편집, 컬러 그레이딩, 사운드 디자인을 통한 전문적인 영상 콘텐츠 제작' },
          { name: 'After Effects', icon: AfterEffectsIcon, description: '모션 그래픽 및 시각 효과(VFX)를 활용한 다이내믹한 영상 제작' },
          { name: 'Cinema 4D', icon: Cinema4DIcon, description: '직관적인 3D 모델링, 애니메이션, 렌더링으로 입체적인 비주얼 구현' },
        ],
      },
      {
        category: 'Photo & Film',
        tools: [
          { name: 'Canon EOS 650D', icon: CanonIcon, description: '고품질 사진 및 영상 촬영을 위한 DSLR 카메라 활용' },
          { name: 'Lightroom', icon: LightroomIcon, description: '디지털 사진 보정 및 색감 조정을 통한 전문적인 사진 편집' },
        ],
      },
    ],
    certifications: [
      {
        title: 'GTQ 그래픽 기술 자격 1급',
        description: 'KPC 한국생산성본부',
        date: '2011.12.16',
      },
      {
        title: 'AI 프롬프트 활용 능력 2급',
        description: 'KPC 한국생산성본부',
        date: '2025.05.29',
      },
    ],
    experience: [
      {
        period: '2022.03 - 2022.12',
        title: '디자인컨버전스학부 학과 대표',
        description: '교내 축제 & 과제전 기획 및 운영',
      },
      {
        period: '2023.06 - 2024.01',
        title: '컴투스 플레이어 10기',
        description: '컴투스 영상 및 그래픽 콘텐츠 디자인',
      },
      {
        period: '2024.01 - 2025.03',
        title: '아모레퍼시픽 콘텐츠 디자이너',
        description: '마몽드 브랜디드 콘텐츠 기획 및 제작',
      },
      {
        period: '2025.03 - 2025.09',
        title: 'LG생활건강 디지털 크루',
        description: '생성형 AI 기술 활용 자체 콘텐츠 제작',
      },
      {
        period: '2025.08 - 2025.11',
        title: 'KIA 크리에이터 8기',
        description: '기아 자동차 PBV, EV 관련 콘텐츠 제작',
      },
    ],
    awards: [
      {
        title: '대학혁신지원사업 선정 및 포상',
        date: '2022.12',
        details: 'AR 인포그래픽 포스터 디자인',
      },
      {
        title: '경남 K-디자인 어워드 수상',
        date: '2023.11',
        details: '디지털 미디어 3D 영상 디자인',
      },
      {
        title: '부산 국제 디자인 어워드 수상',
        date: '2024.10',
        details: '커뮤니케이션 브랜딩 디자인',
      },
    ],
  },
  projects: [
    {
      id: 'amorepacific-mamonde',
      title: '아모레퍼시픽 MAMONDE',
      subtitle: '나만의 자연스러움을 만드는 스킨케어 브랜드',
      overview: '하이퍼 플로라 기술력과 경계 없는 혁신성을 통해 자신만의 자연스러움을 만드는 아모레퍼시픽의 뷰티 브랜드, 마몽드의 브랜디드 콘텐츠를 제작했습니다.',
      thumbnail: 'images/mamonde-thumb.jpg',
      tags: ['Contents', 'Product', 'Film & Motion'],
      type: '그룹',
      role: '콘텐츠 기획 및 제작',
      challengesAndSolutions: {
        challenge: "다양한 미디어(3D, 2D 애니메이션, 실사)를 아우르면서 젊은 타겟층에게 어필할 수 있는 일관된 브랜드 톤앤매너를 유지하는 것이 중요했습니다. 특히 신제품의 경우, 실물 샘플 없이 독특한 질감과 장점을 효과적으로 전달해야 하는 어려움이 있었습니다.",
        solution: "모든 디지털 콘텐츠에 적용할 통일된 비주얼 가이드라인을 수립했습니다. 특정 컬러 팔레트, 모션 원칙, 타이포그래피 규칙을 정의하여 일관성을 확보했습니다. 신제품의 경우, 3D 모션 그래픽을 활용해 세럼의 질감과 광채를 사실적이고 매력적으로 구현하여 출시 전부터 핵심 특징을 효과적으로 전달하고 기대감을 높였습니다."
      },
      details: [
        {
          title: '온드미디어 콘텐츠 제작',
          subtitle: '브랜드 아이덴티티 강화',
          description: '모션, 3D, AI 등 여러 제작 방식을 콘텐츠에 적용하여 브랜드 무드를 효과적으로 드러내며 디자인적 다양성을 높였습니다.',
          image: 'images/mamonde-01.jpg',
        },
        {
          title: '3D 모션 티징 영상',
          subtitle: '신제품 기대감 증폭',
          description: '기존에 촬영된 제품 연출컷을 기반으로, 제품 런칭 전 활용될 3D 그래픽 티징 영상을 직접 제작했습니다. (플로라 글로우 로즈 틴티드 선세럼)',
          image: 'images/mamonde-02.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        },
        {
          title: '2D/3D 모션 프로모션 영상',
          subtitle: "모델 '윈터' 포토카드 이벤트",
          description: '마몽드 브랜드 공식 모델인 에스파의 윈터와 관련된 포토카드 이벤트 프로모션 필름을 개별 캠페인 컨셉에 맞춰 직접 기획하고 제작했습니다.',
          image: 'images/mamonde-03.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        },
        {
          title: '2D 애니메이션 콜라보 영상',
          subtitle: "'톰과제리' 캐릭터 콜라보",
          description: '톰과제리 캐릭터 콜라보레이션을 진행한 메인 제품 3종의 특성을 반영하여 직접 스토리를 기획하고 애니메이션 영상 콘텐츠로 제작했습니다.',
          image: 'images/mamonde-04.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        },
        {
          title: '웹사이트 콘텐츠 디자인',
          subtitle: '다양한 유통 채널 최적화',
          description: '브랜드 웹사이트와 올리브영 등 다양한 유통 채널에 게시되는 상세페이지 및 배너 이미지 일부를 브랜드 무드와 플랫폼 특성에 맞게 제작했습니다.',
          image: 'images/mamonde-05.jpg',
        },
        {
          title: '광고 크리에이티브 제작',
          subtitle: '멀티 플랫폼 광고 소재',
          description: 'DA/FGA 광고 소재, 상세페이지, SNS 등 다양한 브랜디드 콘텐츠에 활용되는 소재들을 직접 촬영하고 제작했습니다.',
          image: 'images/mamonde-06.jpg',
        },
        {
          title: '캐릭터 콘텐츠 기획 및 제작',
          subtitle: "'민초몬' 캠페인 캐릭터",
          description: "'마몽드 어메이징 딥 민트 클렌징밤'의 마케팅 캠페인 소재로 기획된 '민초몬' 캐릭터의 기획 및 제작 전 과정에 참여하였습니다.",
          image: 'images/mamonde-07.jpg',
        },
        {
          title: '캐릭터 굿즈 제작 참여',
          subtitle: "'민초몬' 키링 판촉물",
          description: '브랜드 제품 캐릭터 키링 인형 판촉물 제작을 위한 도안 제작 및 업체 핸들링, 업체 컨택 등의 과정에 직접 참여하였습니다.',
          image: 'images/mamonde-08.jpg',
        },
      ],
    },
    {
      id: 'lg-hnh',
      title: 'LG생활건강',
      subtitle: '아름다움과 건강을 위한 소비자 마케팅 기업',
      overview: '복합 생활문화 기업 LG 생활건강의 디지털 전략 Project 소속 소셜 - 디지털 크루 인턴으로 재직하며 사내 다양한 브랜드의 브랜디드 콘텐츠를 제작했습니다.',
      thumbnail: 'images/lghnh-thumb.jpg',
      tags: ['Contents', 'Film & Motion'],
      type: '그룹',
      role: '디지털 크루 인턴',
      challengesAndSolutions: {
        challenge: "AI 생성 비주얼(모델, 제품 컷)이 일반적이거나 '불쾌한 골짜기'에 빠지지 않으면서, 각 브랜드의 정체성과 부합하는 사실적인 결과물을 만드는 것이 핵심 과제였습니다. 또한, 촉박한 마감 기한 내에 다양한 캠페인 시안을 신속하게 제작해야 했습니다.",
        solution: "광범위한 컨셉으로 시작하여 특정 프롬프트와 인페인팅 기술로 점진적으로 구체화하는 다단계 AI 생성 프로세스를 도입했습니다. AI 생성 요소와 3D 모델링, 전통적인 그래픽 디자인을 결합하여 세련되고 독창적인 비주얼을 완성했으며, 이를 통해 아이데이션 및 제작 시간을 크게 단축하고 빠른 반복 작업을 가능하게 했습니다."
      },
      details: [
        {
          title: 'AI 촬영 시안 제작 (belif)',
          subtitle: '3D 모델링 및 AI 활용',
          description: '얼음, 과일 등 짧은 기간내에 실제 촬영이 어려운 요소가 포함된 요소를 3D 모델링과 AI를 활용하여 보완한 촬영 시안들을 제작했습니다.',
          image: 'images/lghnh-01.jpg',
        },
        {
          title: 'AI 촬영 시안 제작 (THE FACE SHOP)',
          subtitle: '액체 요소 시각화',
          description: '석류, 우유 등 실제 촬영이 어려운 액체 요소를 3D 모델링과 AI를 활용하여 보완한 촬영 시안들을 제작했습니다.',
          image: 'images/lghnh-02.jpg',
        },
        {
          title: 'AI 가상 모델 제작',
          subtitle: '브랜드 맞춤형 AI 모델',
          description: '여러 브랜드의 개별 요청에 맞춰, 브랜드 무드에 어울리는 다양한 인종, 성별, 연령대의 AI 모델 이미지를 제작했습니다.',
          image: 'images/lghnh-03.jpg',
        },
        {
          title: 'FIJI AI 커머셜 필름 참여',
          subtitle: '프리 프로덕션 참여',
          description: "AI 프로덕션 '스튜디오 프리윌루전'이 제작한 FIJI 브랜드 공식 모델 활용 AI 커머셜 필름 영상의 프리 프로덕션 과정에 참여하였습니다.",
          image: 'images/lghnh-04.jpg',
        },
        {
          title: 'FIJI AI 스타일 프레임 제작',
          subtitle: "'신유빈' 선수 얼굴 일관성 유지",
          description: '주요 등장인물인 신유빈 선수의 얼굴을 일관성 있게 적용하고 모락셀라 균을 캐릭터 형태로 형상화하여 스토리보드 및 스타일 프레임을 작성하였습니다.',
          image: 'images/lghnh-05.jpg',
        },
        {
          title: 'CNP AI 숏폼 콘텐츠 (ONE-SWIPE)',
          subtitle: '팝 & 비비드 숏폼',
          description: '한 손가락으로 립세린을 가볍게 바르는 동작을 바탕으로 CNP 프로폴리스 립세린의 팝하고 비비드한 분위기를 AI와 모션 그래픽 효과로 극대화한 숏폼 콘텐츠 영상을 제작했습니다.',
          image: 'images/lghnh-06.jpg',
        },
        {
          title: 'CNP ASMR 숏폼 콘텐츠',
          subtitle: '제형 및 사용감 시각화',
          description: 'AI를 활용한 ASMR 콘텐츠 포맷을 CNP 프로폴리스 립세린에 접목하여 제품의 제형과 사용감을 비주얼적으로 극대화한 숏폼 콘텐츠를 제작했습니다.',
          image: 'images/lghnh-07.jpg',
        },
        {
          title: 'CNP 3D 오브젝트 활용 콘텐츠',
          subtitle: '제품 특징 기반 3D 오브젝트',
          description: '각 제품의 특징을 살린 오브젝트와 제품 이미지를 3D로 제작한 뒤 이를 활용하여 숏폼 형태의 AI 콘텐츠 영상으로 제작했습니다.',
          image: 'images/lghnh-08.jpg',
        },
        {
          title: 'PRA.L AI 숏폼 콘텐츠 (공항 검색대)',
          subtitle: '제품 컬러 각인 효과',
          description: "프라엘의 수퍼폼 갈바닉 부스터 제품의 다양한 컬러 플레이 디자인을 활용하여 공항 검색대 구도를 차용해 제품 컬러와 디자인을 효과적으로 각인시키는 숏폼 콘텐츠를 제작하였습니다.",
          image: 'images/lghnh-09.jpg',
        },
        {
          title: 'PLA.L AI 콘텐츠 제작 (동물 모델)',
          subtitle: 'AI 동물 모델 구현',
          description: '실제 동물 모델로는 촬영하기 어려운 장면을 AI 기술로 구현하고 이에 3D 그래픽을 결합하여 제품 사용 모습을 더 친근하고 재미있게 연출했습니다.',
          image: 'images/lghnh-10.jpg',
        },
        {
          title: 'PLA.L 초현실주의 콘텐츠',
          subtitle: '3D & AI 초현실 그래픽',
          description: '현실에서는 불가능한 초현실적이고 상상력 넘치는 상황을 3D와 AI 그래픽으로 제작하여 제품에 대한 흥미와 주목도를 극대화했습니다.',
          image: 'images/lghnh-11.jpg',
        },
      ],
    },
     {
      id: 'swayn',
      title: 'Swayn',
      subtitle: '편안한 수면을 위한 나이트 리추얼 브랜드',
      overview: "세안과 수면이라는 일상적 행위를 통해 삶의 균형을 되찾도록 돕는 감성 스킨케어 브랜드 '스웨이엔'의 브랜딩 프로젝트입니다. '포근함', '감싸줌', '밝음'이라는 핵심 가치를 바탕으로 로고타입부터 제품, 패키지, 캐릭터, 브랜드 모델에 이르기까지 일관된 브랜드 경험을 설계했습니다.",
      thumbnail: 'images/swayn-thumb.jpg',
      tags: ['Branding', 'Package', 'Product', 'Film & Motion'],
      type: '개인',
      role: '총괄 브랜딩 디자인',
      challengesAndSolutions: {
        challenge: "'편안함', '치유', '리추얼'과 같은 추상적인 개념을 사용자에게 감성적으로 다가갈 수 있는 구체적인 브랜드 아이덴티티, 제품 디자인, 패키지로 번역하는 것이 가장 큰 도전이었습니다. 단순한 제품 판매를 넘어, 총체적인 브랜드 경험을 설계해야 했습니다.",
        solution: "'영혼을 위한 집'이라는 메타포를 중심으로 브랜드 세계관을 구축했습니다. 각 제품 라인을 침실, 욕실 등 집 안의 공간에 대응시켜 서사적인 여정을 만들었습니다. 제품 용기는 구름과 비누 거품에서 영감을 받은 부드러운 유기적 형태로 디자인했으며, 패키지 개봉 과정 자체를 하나의 '리추얼'처럼 설계하여 사용자가 브랜드 스토리에 몰입하도록 유도했습니다."
      },
      details: [
        {
          title: 'Brand Identity',
          subtitle: '기획부터 핵심 가치까지',
          description: [
            {
                title: '기획의도',
                description: '현대 사회의 과도한 스트레스와 수면 부족 문제에 주목했습니다. 단순한 스킨케어를 넘어, 잠들기 전 \'나를 돌보는 의식\'을 통해 하루의 긴장을 풀고 온전한 휴식을 선사하는 나이트 리추얼 브랜드를 기획했습니다.',
                image: 'images/swayn-bi-01.jpg',
            },
            {
                title: '브랜드 에센스',
                description: '\'포근함\', \'감싸줌\', \'밝음\'을 핵심 가치로, 지친 마음을 부드럽게 안아주고 스스로 빛나는 내일을 맞이할 힘을 주는 것이 스웨이엔의 브랜드 본질입니다.',
                image: 'images/swayn-bi-02.jpg',
            },
            {
                title: '브랜드 네이밍',
                description: "Sway(흔들리다) + in(안으로). 감정의 흐름을 따라 내면의 평온에 이르는 과정을 의미합니다.",
                image: 'images/swayn-bi-03.jpg',
            },
            {
                title: '로고',
                description: "천사의 날개짓에서 영감을 받은 유연한 곡선으로, 브랜드의 포용적인 이미지를 시각적으로 전달합니다.",
                image: 'images/swayn-bi-04.jpg',
            },
            {
                title: '슬로건',
                description: "Feel / Swear / Sway. 감정을 자각하고, 내면과 연결되며, 편안하게 물드는 3단계의 나이트 리추얼을 제안합니다.",
                image: 'images/swayn-bi-05.jpg',
            },
          ],
          image: 'images/swayn-bi-main.jpg',
        },
        {
            title: 'Package Design',
            subtitle: "'집'을 모티프로 한 힐링 경험 설계",
            description: [
                {
                    title: '테마틱 프리킷',
                    description: "현실의 스트레스를 잠시 내려놓고 치유받는 설정에 맞춰 '집에서 느끼는 편안함'을 테마로 한 테마틱 프리킷을 디자인하였습니다. 패키지를 여는 순간, 각 공간에 해당하는 제품들이 나타나며 특별한 경험을 선사합니다.",
                    image: 'images/swayn-package-01.jpg',
                },
                {
                    title: '공간별 맞춤 제품 구성',
                    description: "고객의 스트레스 민감도를 4단계로 나누어 각 단계별로 적합한 공간 테마를 설정하고, 이에 맞춘 제품을 기획하여 배치했습니다. 1단계 침실부터 4단계 욕실까지, 점진적인 힐링 리추얼을 경험할 수 있습니다.",
                    image: 'images/swayn-package-02.jpg',
                },
                {
                    title: '단품 패키지 디자인',
                    description: "테마틱 프리킷과 별개의 단품 패키지는 은은한 펄지로 인쇄하여 부드러운 촉감을 주는 동시에, 집을 연상시키는 그래픽을 통해 통일감을 더했습니다. 로고와 텍스트에는 박 코팅을 적용하여 시각적, 촉각적 재미를 더했습니다.",
                    image: 'images/swayn-package-03.jpg',
                },
                {
                    title: '패키지 전개도',
                    description: "제품의 정보를 담은 패키지 전개도입니다. 브랜드의 시그니처 블루 컬러를 메인으로 사용하여 아이덴티티를 강조했으며, 소비자가 제품 정보를 쉽게 인지할 수 있도록 명확한 레이아웃으로 디자인했습니다.",
                    image: 'images/swayn-package-04.jpg',
                },
                {
                    title: '미니 리플렛',
                    description: "각 공간 테마에 해당하는 카테고리 정보 및 제품 설명을 적은 엽서 형태의 미니 리플렛을 제작하여 테마틱 패키지 내부에 비치했습니다. 이를 통해 사용자는 각 제품의 사용법과 스토리를 더 깊이 이해할 수 있습니다.",
                    image: 'images/swayn-package-05.jpg',
                }
            ],
            image: 'images/swayn-package-main.jpg',
        },
        {
          title: 'Product Design',
          subtitle: '구름과 비누 거품 모티프',
          description: {
            introTitle: 'PRODUCT',
            slides: [
              {
                title: 'PRODUCT',
                description: "'폭신폭신한 이불 느낌의 구름'과 '부드러운 비누 거품'의 형태에서 착안한 금형 디자인으로 제품 라인업 전체에 통일감을 부여하고, '편안한 회복'을 강조했습니다. 침실, 드레스룸, 거실, 욕실 각 공간별 컨셉에 맞춰 2종씩, 총 8개의 제품과 1개의 패키지를 디자인 및 모델링했습니다.",
                image: 'images/swayn-product-01.jpg',
              },
              {
                title: '침실',
                description: '안정과 숙면의 공간 (제품 2종)',
                image: 'images/swayn-product-02.jpg',
              },
              {
                title: '드레스룸',
                description: '자기관리와 안심의 공간 (제품 2종)',
                image: 'images/swayn-product-03.jpg',
              },
              {
                title: '거실',
                description: '휴식과 전환의 공간 (제품 2종)',
                image: 'images/swayn-product-04.jpg',
              },
              {
                title: '욕실',
                description: '정화와 이완의 공간 (제품 2종)',
                image: 'images/swayn-product-05.jpg',
              },
            ]
          },
          image: 'images/swayn-product-main.jpg',
        },
        {
          title: 'Brand Model',
          subtitle: "가상 모델 '슈슈'",
          description: [
            {
              title: '모델 기획',
              description: '브랜드 일관성을 강화하고 매력도를 높이기 위해, 타겟 고객들에게 친숙함과 선망성을 동시에 줄 수 있는 전용 모델을 제작하여 프로모션 콘텐츠에 적용했습니다.',
              image: 'images/swayn-model-01.jpg',
            },
            {
              title: '모델 설정',
              description: "**Name** 슈슈 [ʃu.ʃu] '소중한 사람'이라는 의미의 프랑스어\n**Goal** 고객 라포 형성 및 브랜드 충성도 제고\n**Overview** 감정의 해상도에 따라 형태를 달리하여 지친 이들을 편안한 꿈으로 인도하는 꿈의 정령. 수면 스트레스를 겪는 이들을 따뜻하게 감싸주는 존재라는 고유 스토리를 가진 가상 모델을 활용해 감성적인 접근을 시도했습니다.",
              image: 'images/swayn-model-02.jpg',
            },
          ],
          image: 'images/swayn-model-main.jpg',
        },
        {
          title: 'Brand Contents',
          subtitle: "브랜드 필름 'Feel Your Sway'n'",
          description: "**Title** Feel Your Sway'n\n**Link** Vimeo\n**Duration** 30 sec\n\n**Overview**\n브랜드의 핵심 정체성인 '나이트 리추얼'을 통한 내면의 회복을 모델 슈슈가 보내는 일상을 통해 시각적으로 구현한 브랜드 무드 필름을 제작했습니다. 브랜드 정신을 녹여낸 무드 필름으로, 수면 전 감정과 스트레스를 정리하는 장면들을 통해 나이트 리추얼의 회복성을 전달하고자 합니다.",
          image: 'images/swayn-contents-main.jpg',
          videoUrl: 'https://player.vimeo.com/video/933033575?h=b30f5f742f',
        },
        {
          title: 'Brand Character',
          subtitle: "브랜드 페르소나 '슈슈'",
          description: [
            {
              title: '캐릭터 기획',
              description: '제품 구성의 다양성을 더하고 브랜드 경험을 강화하고자 브랜드 페르소나 모델을 타겟에게 친숙한 순정만화풍의 캐릭터로 제작하여 다양한 제품 판촉에 적용했습니다.',
              image: 'images/swayn-character-01.jpg',
            },
            {
              title: 'LD ver.',
              description: '타겟 고객이 향수를 느낄 수 있는 고전 마법소녀 작품들에서 영감을 받아, 레트로 순정만화 스타일의 LD(Light Deformation) 캐릭터를 디자인했습니다.',
              image: 'images/swayn-character-02.jpg',
            },
            {
              title: 'SD ver.',
              description: 'LD 캐릭터를 기반으로 형태를 단순화한 SD(Super Deformation) 캐릭터를 추가로 디자인함으로써, 활용 가능한 구성 요소를 다양화했습니다.',
              image: 'images/swayn-character-03.jpg',
            }
          ],
          image: 'images/swayn-character-main.jpg',
        },
        {
          title: 'Application',
          subtitle: '브랜드 경험의 확장',
          description: [
            {
              title: '캐릭터 일러스트',
              description: '캐릭터를 활용한 일러스트를 제작하여 브랜드의 감성적인 스토리를 전달하고, 다양한 굿즈에 적용하여 팬덤을 형성할 수 있도록 했습니다.',
              image: 'images/swayn-application-01.jpg',
            },
            {
              title: '캐릭터 굿즈: 인형 & 손거울',
              description: '브랜드 경험을 일상으로 확장하기 위해 캐릭터 \'슈슈\'를 활용한 봉제 인형과 손거울 등 소장 가치가 높은 아이템을 통해 고객과의 유대감을 형성하고 브랜드 매력도를 높였습니다.',
              image: 'images/swayn-application-02.jpg',
            },
            {
              title: '캐릭터 굿즈: 아크릴 스탠드 & 스티커',
              description: '다양한 형태의 굿즈를 통해 고객이 브랜드를 더 자주 접하고 긍정적인 관계를 맺을 수 있도록 아크릴 스탠드와 스티커를 제작했습니다.',
              image: 'images/swayn-application-03.jpg',
            },
            {
              title: '브랜드 의류',
              description: '브랜드 캐릭터와 로고를 활용한 후드 티셔츠를 제작하여, 팬들이 일상 속에서 브랜드를 표현하고 소속감을 느낄 수 있도록 했습니다.',
              image: 'images/swayn-application-04.jpg',
            },
            {
              title: '모델 프로모션',
              description: '브랜드 모델과 제품을 활용한 감성적인 비주얼의 프로모션 콘텐츠를 제작하여 온라인 채널에서 브랜드 매력도를 높였습니다.',
              image: 'images/swayn-application-05.jpg',
            }
          ],
          image: 'images/swayn-application-main.jpg',
        },
      ],
    },
    {
      id: 'navi-fandom',
      title: 'NAVI',
      subtitle: '버추얼 아티스트 nævis 팬덤 NAVI 브랜딩',
      overview: "레트로 게임 콘셉트를 차용해 팬들을 nævis 세계의 플레이어로 초대하여, nævis와 팬덤 'NAVi'가 함께 성장하는 컨셉을 지닌 팬덤 및 팬키트 브랜딩을 진행하였습니다.",
      thumbnail: 'images/navi-thumb.jpg',
      tags: ['Branding', 'Product', 'Package'],
      type: '개인',
      role: '총괄 브랜딩 디자인',
      challengesAndSolutions: {
        challenge: "가상 아티스트의 팬덤 키트가 팬들에게 실질적이고 가치 있게 느껴지도록 디자인하는 것이 중요했습니다. 아티스트의 디지털 세계와 팬의 물리적 세계 사이의 간극을 좁히는 디자인이 필요했습니다.",
        solution: "레트로 게임을 테마로 한 '피지털(Phygital)' 접근법을 채택했습니다. 팬 키트 자체를 '게임 콘솔' 형태로 디자인하고, 내부 굿즈들을 게임 공략집, 플레이어 ID 카드 등 스토리텔링이 담긴 구성품으로 기획했습니다. 이를 통해 팬들이 아티스트의 가상 세계에 적극적으로 참여하는 플레이어가 된 듯한 상호작용적 경험을 제공했습니다."
      },
      details: [
        {
          title: 'Fan Kit Overview',
          subtitle: "'게임 디바이스' 콘셉트",
          description: "'게임 디바이스' 형태의 패키지 속에 게임 공략서, 플레이어 카드 등 스토리텔링을 담은 굿즈들을 팬 키트에 담아 구성했습니다.",
          image: 'images/navi-01.jpg',
        },
        {
          title: 'Package Design',
          subtitle: '레트로 게임기 & 사이버펑크 감성',
          description: '2000년대 레트로 게임기와 사이버펑크 감성을 결합하여, nævis의 독특한 정체성을 시각적으로 구현했습니다.',
          image: 'images/navi-02.jpg',
        },
        {
          title: 'Package Detail',
          subtitle: '휴대용 게임기 모양 홀더',
          description: "팬들이 nævis의 세계로 접속하는 디바이스로써, 2000년대 휴대용 게임기 모양의 폴더블 홀더로 디자인했습니다.",
          image: 'images/navi-03.jpg',
        },
        {
          title: 'Photo Book (Guide Book)',
          subtitle: "'공식 게임 가이드' 콘셉트",
          description: "nævis 세계관의 스토리를 담은 '공식 게임 가이드' 콘셉트로 제작된 아티스트 포토북입니다.",
          image: 'images/navi-04.jpg',
        },
        {
          title: 'Player ID Card',
          subtitle: "'광야' 접속 플레이어 ID",
          description: "팬들이 버추얼 월드, 광야에 접속할 수 있는 '플레이어 ID'를 콘셉트로 제작되었습니다.",
          image: 'images/navi-05.jpg',
        },
        {
          title: 'Plush Toy',
          subtitle: '아티스트 비주얼 봉제인형',
          description: 'nævis의 버추얼 비주얼을 그대로 담아낸 디테일한 봉제인형으로, 옷을 탈착할 수 있는 기능을 더해 팬들과의 상호작용을 유도했습니다.',
          image: 'images/navi-06.jpg',
        },
      ],
    },
    {
      id: 'daonhyang',
      title: 'Daonhyang',
      subtitle: '감정을 담은 아트 프래그런스 브랜드',
      overview: '향기로 일상 속 감각적 기억을 담아내, 개인의 정서와 감성을 예술적으로 전달하는 프래그런스 브랜드 다온향의 브랜딩을 진행했습니다.',
      thumbnail: 'images/daonhyang-thumb.jpg',
      tags: ['Branding', 'Product', 'Package'],
      type: '개인',
      role: '총괄 브랜딩 디자인',
      challengesAndSolutions: {
        challenge: "포화 상태인 향수 시장에서 눈에 띄는 브랜드 아이덴티티를 구축하는 것이 목표였습니다. 향기라는 무형적이고 개인적인 경험을 시각적으로 표현해야 하는 어려움이 있었습니다.",
        solution: "'예술로서의 향기'라는 컨셉에 집중했습니다. 난초의 형태와 향이 퍼져나가는 파동을 추상화하여 브랜드 심볼을 개발했습니다. 제품 용기는 그 자체로 하나의 조각적인 오브제처럼 보이도록 디자인했으며, 패키지는 미니멀한 디자인에 질감이 느껴지는 종이와 음각 로고 등 촉각적 요소를 더해, 제품을 열기 전부터 감각적인 연결을 유도하고 조용한 럭셔리함을 전달했습니다."
      },
      details: [
        {
          title: 'Brand Application',
          subtitle: '난초 모티프 심볼 디자인',
          description: '난초의 중심부를 모티프로 향의 파동이 위로 퍼지는 확산 구조를 기호화하여 심볼에 적용하고 다양한 애플리케이션으로 제작했습니다.',
          image: 'images/daonhyang-01.jpg',
        },
        {
          title: 'Product Design',
          subtitle: '난초 꽃잎 & 향의 파동',
          description: '다온향의 용기는 난초의 꽃잎과 향의 파동에서 착안하여 제품의 향이 지닌 섬세하고 아름다운 이미지를 시각적으로 전달하도록 디자인되었습니다.',
          image: 'images/daonhyang-02.jpg',
        },
        {
          title: 'Product Application',
          subtitle: '조각적 오브제로서의 용기',
          description: '향과 원료를 고려한 디자인으로 용기가 하나의 조각적인 오브제로 기능하게끔 제작했습니다.',
          image: 'images/daonhyang-03.jpg',
        },
        {
          title: 'Package Design',
          subtitle: '음각 로고를 통한 촉각적 경험',
          description: '부드럽고 정제된 질감을 지닌 모조지에 로고와 패턴을 음각으로 처리하여 손끝으로 느껴지는 촉각적 경험을 강조한 단품 패키지를 제작했습니다.',
          image: 'images/daonhyang-04.jpg',
        },
      ],
    },
  ],
  footer: {},
};