let _qnas = [
    {
        type: '생각'.split(','),
        quiz: '주황색을 만들려면 어떤 색을 섞어야 할까요?',
        answer: '노랑 + 빨강'.split(','),
        example: '노랑 + 파랑,빨강 + 하양,빨강 + 파랑'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
    },
    {
        type: '생각'.split(','),
        quiz: '어린이들이 유치원 놀이 시간에 정리할때 드는 감정은?',
        answer: '슬픈'.split(','),
        example: '기쁜,황당한,편안한'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
    },
    {
        type: '숫자'.split(','),
        quiz: '1000 + 1000 은?',
        answer: '2000'.split(','),
        example: '10000,1000000,99'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
    },
    {
        type: '엉뚱,생각'.split(','),
        quiz: '고양이 얼굴 중에서 가장 화를 많이 내는 얼굴 모양은?',
        answer: '세모 얼굴'.split(','),
        example: '동그라미 얼굴,네모 얼굴,별사탕 얼굴'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
    },
    {
        type: '상식'.split(','),
        quiz: '바다에서 사는 고래 중 제일 큰 고래는?',
        answer: '흰수염고래'.split(','),
        example: '일각고래,향유고래,범고래'.split(','),
        year: 5,
        class: '까치반',
        by: '손승우',
    },
    {
        type: '숫자'.split(','),
        quiz: '5 더하기 4는 몇일까요?',
        answer: '9'.split(','),
        example: '8,7,6'.split(','),
        year: 5,
        class: '까치반',
        by: '류민서',
    },
    {
        type: '숫자'.split(','),
        quiz: '2 더하기 2는 몇일까요?',
        answer: '4'.split(','),
        example: '6,7,5'.split(','),
        year: 5,
        class: '까치반',
        by: '김주이',
    },
    {
        type: '생각'.split(','),
        quiz: '들여다보면 사람마다 다르게 보여지는 것은?',
        answer: '거울'.split(','),
        example: '유리,생각,물'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
    },
    {
        type: '생각'.split(','),
        quiz: '우리의 고향은?',
        answer: '엄마 뱃속',
        example: '아빠 뱃속,하이파크 1단지,고양시'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
    },
    {
        type: '일상'.split(','),
        quiz: '한미유치원 놀이터에 있는 나무에 자라는 꽃 이름은?',
        answer: '벚꽃'.split(','),
        example: '진달래,개나리,장미'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '가장 예쁜 소는?',
        answer: '미소'.split(','),
        example: '황소,젖소,들소'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '세상에서 가장 큰 코는?',
        answer: '멕시코'.split(','),
        example: '코끼리,코딱지'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '자동차가 깜짝 놀라면?',
        answer: '카놀라유'.split(','),
        example: '우유,카레'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '왕이 넘어지면?',
        answer: '킹콩'.split(','),
        example: '땅콩,완두콩'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '나는 노란색 옷을 입어도 파란색 옷을 입어도 빨간색 옷을 입어도 검은색으로 보여요. 나는 무엇일까요?',
        answer: '그림자'.split(','),
        example: '거울,강물'.split(','),
        year: 4,
        class: '참나무반',
        by: '장원',
    },
    {
        type: '생각'.split(','),
        quiz: '1+1 모양인데, 더울 때 우리를 막아주는 것?',
        answer: '창문'.split(','),
        example: '무지개,별똥별,인간'.split(','),
        year: 4,
        class: '소나무반',
        by: '백종윤',
    },
    {
        type: '일상'.split(','),
        quiz: '한미유치원 선생님인데, 안경을 쓰고, 머리가 짧고, 검정 마스크를 썼고, 1층에 있어요.',
        answer: '부원장님'.split(','),
        example: '원장님,이O지 선생님,황O선 선생님'.split(','),
        year: 4,
        class: '소나무반',
        by: '황제인',
    },
    {
        type: '일상'.split(','),
        quiz: '이것은 자동차인데 엄청 커요. 집에 갈 때, 어디 놀러갈 때 타는 차고, 노란색이에요. 한미유치원 차 중에 어린이들이 가장 많이 탈 수 있어요.',
        answer: '백곰차'.split(','),
        example: '고래차,유니콘차,토끼차'.split(','),
        year: 4,
        class: '소나무반',
        by: '어린이들',
    },
    {
        type: '일상'.split(','),
        quiz: '소나무반이 산책 갔던 곳입니다. 초록색이고, 잔디밭이 엄청 넓고, 백곰차를 타고 갔어요.',
        answer: '정발산'.split(','),
        example: '우리 집,아기돼지 삼형제 집,오렌지마트'.split(','),
        year: 4,
        class: '소나무반',
        by: '어린이들',
    },
    {
        type: '상식'.split(','),
        quiz: '하늘색과 노란색 치마를 입고 머리띠를 쓴 공주는?',
        answer: '백설공주'.split(','),
        example: '라푼젤,신데렐라,소피아'.split(','),
        year: 3,
        class: '해바라기반',
        by: '어린이들',
    },
    {
        type: '상식'.split(','),
        quiz: '이빨이 뾰족하고 꼬리를 휙휙 휘두르고 머리 위가 뾰족하고 바다에 사는것은?',
        answer: '상어 🦈'.split(','),
        example: '거북이 🐢,문어 🐙,니모 🐠'.split(','),
        year: 3,
        class: '개나리반',
        by: '어린이들',
    },
    {
        type: '상식'.split(','),
        quiz: '바다 만화이고, 대원들이 나오고, 바다에 도움이 필요하면 바다에 출동하는 애니메이션은?',
        answer: '옥토넛'.split(','),
        example: '뽀로로,카봇,캐치티니핑'.split(','),
        year: 3,
        class: '개나리반',
        by: '어린이들',
    },
    {
        type: '일상'.split(','),
        quiz: '개나리반 친구가 만든 괴물이에요. 올챙이를 닮았어요. 얼마전에 집을 잃어버렸어요.',
        answer: '올챙이 괴물'.split(','),
        example: '미세먼지 괴물,마스크 괴물,개나리반 괴물'.split(','),
        year: 3,
        class: '개나리반',
        by: '어린이들',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 과일이에요. 그리고 색깔은 빨강색이랑 초록색이랑 섞여 있어요. 빨간색에 씨앗이 나와있어요. 이것은 무엇일까요?',
        answer: '딸기 🍓'.split(','),
        example: '사과 🍎,토마토 🍅'.split(','),
        year: 3,
        class: '진달래반',
        by: '임소희',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 동물이에요. 그리고 덩치가 아주 크고 진흙에서 구르기도 해요. 이것은 무엇일까요?',
        answer: '코끼리 🐘'.split(','),
        example: '사자 🦁,토끼 🐇'.split(','),
        year: 3,
        class: '진달래반',
        by: '박준우',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 채소예요. 조금 기다랗고 위에 초록색이 있고 아래에는 하얀색이 있어요. 나뭇잎 같이 생겼어요. 이것은 무엇일까요?',
        answer: '배추'.split(','),
        example: '무,파프리카'.split(','),
        year: 3,
        class: '진달래반',
        by: '임태린',
    },
];