let _qnas = [
    {
        type: '상식'.split(','),
        quiz: '가을에 나무가 겨울을 준비하며 잎을 떨어뜨리기 위해 잎자루와 가지 사이에 만드는 것은?',
        answer: '떨켜'.split(','),
        example: '낙엽,단풍,열매'.split(','),
        year: 5,
        class: '호기심 킁킁',
        by: '최승준',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '영어'.split(','),
        quiz: 'How to say "Apple" in Korean?',
        answer: '사과 🍎'.split(','),
        example: '딸기 🍓,복숭아 🍑,포도 🍇'.split(','),
        year: 5,
        class: '',
        by: 'OOO',
        role: '선생님',
        lang_quiz: 'en',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '이것이 폭발하면 용암, 가스, 화산재가 나와요. 그리고 이것에는 땅속 마그마가 분출되는 분화구가 있어요. 이것은 무엇일까요?',
        answer: '화산'.split(','),
        example: '정발산,고봉산'.split(','),
        year: 4,
        class: '과학실험',
        by: '이연지',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '달에 있는 충돌구도 볼 수 있어요. 멀리 있는 것을 볼 수 있는 거에요. 이것은 무엇일까요?',
        answer: '망원경'.split(','),
        example: '현미경,안경'.split(','),
        year: 3,
        class: '과학실험',
        by: '은미현',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '눈에 보이지 않아요. 손으로 잡을 수 없어요. 숨을 쉴 때 마셔요. 낙하산을 천천히 내려오게 하는 이것은 무엇일까요?',
        answer: '공기'.split(','),
        example: '풍선,중력'.split(','),
        year: 3,
        class: '과학실험',
        by: '은미현',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 전구를 밝힐 수 있어요. 건전지에 전선을 연결하고 전구에 연결하면 이것이 흘러서 불이 들어와요. 이것은 무엇일까요?',
        answer: '전기'.split(','),
        example: '불,바람,빛'.split(','),
        year: 5,
        class: '과학실험',
        by: '오지희',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '산에 갔을 때 벌의 공격을 많이 받게 되는 색은 검정색입니다. 왜 검정색을 보면 벌이 공격을 많이 하는 걸까요?',
        answer: '검정색을 보면 흥분해서'.split(','),
        example: '검정색을 좋아해서,검정색을 싫어해서'.split(','),
        year: 5,
        class: '안전교육',
        by: '오지희',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '배추벌레는 나중에 크면 무엇이 될까요? (힌트: 봄에 볼 수 있고 두개의 날개로 훨훨 날아다녀요)',
        answer: '나비'.split(','),
        example: '배추,잠자리'.split(','),
        year: 4,
        class: '독서',
        by: '이미영',
        role: '선생님',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '생각'.split(','),
        quiz: '주황색을 만들려면 어떤 색을 섞어야 할까요?',
        answer: '노랑 + 빨강'.split(','),
        example: '노랑 + 파랑,빨강 + 하양,빨강 + 파랑'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '생각'.split(','),
        quiz: '어린이들이 유치원 놀이 시간에 정리할때 드는 감정은?',
        answer: '슬픈'.split(','),
        example: '기쁜,황당한,편안한'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '숫자'.split(','),
        quiz: '1000 + 1000 은?',
        answer: '2000'.split(','),
        example: '10000,1000000,99'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '엉뚱,생각'.split(','),
        quiz: '고양이 얼굴 중에서 가장 화를 많이 내는 얼굴 모양은?',
        answer: '세모 얼굴'.split(','),
        example: '동그라미 얼굴,네모 얼굴,별사탕 얼굴'.split(','),
        year: 5,
        class: '까치반',
        by: '김시원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '상식'.split(','),
        quiz: '바다에서 사는 고래 중 제일 큰 고래는?',
        answer: '흰수염고래'.split(','),
        example: '일각고래,향유고래,범고래'.split(','),
        year: 5,
        class: '까치반',
        by: '손승우',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '숫자'.split(','),
        quiz: '5 더하기 4는 몇일까요?',
        answer: '9'.split(','),
        example: '8,7,6'.split(','),
        year: 5,
        class: '까치반',
        by: '류민서',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '숫자'.split(','),
        quiz: '2 더하기 2는 몇일까요?',
        answer: '4'.split(','),
        example: '6,7,5'.split(','),
        year: 5,
        class: '까치반',
        by: '김주이',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '가장 빠른 개는?',
        answer: '번개'.split(','),
        example: '진돗개,안개,똥개'.split(','),
        year: 5,
        class: '까치반',
        by: '조윤근',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '숫자'.split(','),
        quiz: '5 + 5 + 6 + 100 은?',
        answer: '116'.split(','),
        example: '115,1000,123'.split(','),
        year: 5,
        class: '까치반',
        by: '이수현',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '엉뚱,생각'.split(','),
        quiz: '한미유치원은 몇 살일까요?',
        answer: '37'.split(','),
        example: '∞,7,100'.split(','),
        year: 5,
        class: '까치반',
        by: '최지유',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '숫자'.split(','),
        quiz: '100 빼기 1 은?',
        answer: '99'.split(','),
        example: '1,100,999'.split(','),
        year: 5,
        class: '까치반',
        by: '안재준',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '생각'.split(','),
        quiz: '소리가 나도 볼 수 없는 것은?',
        answer: '바람'.split(','),
        example: '천둥,번개,비'.split(','),
        year: 5,
        class: '까치반',
        by: '김민성',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '숫자'.split(','),
        quiz: '1 더하기 3 은?',
        answer: '4'.split(','),
        example: '2,3,5'.split(','),
        year: 5,
        class: '까치반',
        by: '오시헌',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '1 더하기 1이 무엇일까요?',
        answer: '귀요미'.split(','),
        example: '창문,인간'.split(','),
        year: 5,
        class: '까치반',
        by: '손승우',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '일상'.split(','),
        quiz: '이 세상에서 제일 맛있는 밥은 무엇일까요?',
        answer: '한미유치원 밥'.split(','),
        example: '엄마 밥,할머니 밥,외식하는 밥'.split(','),
        year: 5,
        class: '까치반',
        by: '류민서',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '어린이는 왜 키가 자랄까요?',
        answer: '모른다'.split(','),
        example: '밥을 먹어서,잠을 자서,음……'.split(','),
        year: 5,
        class: '까치반',
        by: '손승우',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '숫자'.split(','),
        quiz: '7 더하기 7은?',
        answer: '14'.split(','),
        example: '13,15,10'.split(','),
        year: 5,
        class: '까치반',
        by: '윤채원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-07',
    },
    {
        type: '생각'.split(','),
        quiz: '들여다보면 사람마다 다르게 보여지는 것은?',
        answer: '거울'.split(','),
        example: '유리,생각,물'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '생각'.split(','),
        quiz: '우리의 고향은?',
        answer: '엄마 뱃속',
        example: '아빠 뱃속,하이파크 1단지,고양시'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '일상'.split(','),
        quiz: '한미유치원 놀이터에 있는 나무에 자라는 꽃 이름은?',
        answer: '벚꽃'.split(','),
        example: '진달래,개나리,장미'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '가장 예쁜 소는?',
        answer: '미소'.split(','),
        example: '황소,젖소,들소'.split(','),
        year: 5,
        class: '종달새반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '자꾸 나를 따라하는것은? (우리 집에 있어요, 유치원에도 있어요, 화장실에도 있어요)',
        answer: '거울'.split(','),
        example: '따라큐,메타몽,따라쟁이'.split(','),
        year: 5,
        class: '종달새반',
        by: '김라희',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식,생각'.split(','),
        quiz: '얼룩말의 줄무늬는 무슨 색일까요?',
        answer: '흰색'.split(','),
        example: '검정색,무지개색'.split(','),
        year: 5,
        class: '종달새반',
        by: '전태민',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-07',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '세상에서 가장 큰 코는?',
        answer: '멕시코'.split(','),
        example: '코끼리,코딱지'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '자동차가 깜짝 놀라면?',
        answer: '카놀라유'.split(','),
        example: '우유,카레'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '왕이 넘어지면?',
        answer: '킹콩'.split(','),
        example: '땅콩,완두콩'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '나는 노란색 옷을 입어도 파란색 옷을 입어도 빨간색 옷을 입어도 검은색으로 보여요. 나는 무엇일까요?',
        answer: '그림자'.split(','),
        example: '거울,강물'.split(','),
        year: 4,
        class: '참나무반',
        by: '장원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '세계에서 가장 높은 산은?',
        answer: '에베레스트산'.split(','),
        example: '정발산,백두산,고봉산'.split(','),
        year: 4,
        class: '참나무반',
        by: '장원',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '상식'.split(','),
        quiz: '태양계에서 가장 뜨거운 행성은 무엇일까요?',
        answer: '금성'.split(','),
        example: '토성,목성,수성'.split(','),
        year: 4,
        class: '참나무반',
        by: '김현호',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '생각'.split(','),
        quiz: '제일 빠른 고양이는?',
        answer: '길고양이'.split(','),
        example: '토끼,고양이,코끼리'.split(','),
        year: 4,
        class: '참나무반',
        by: '김수아',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-07',
    },
    {
        type: '상식'.split(','),
        quiz: '하얀 바탕에 빨강 파랑 검정 모양이 있어요. 우리나라를 나타내고 이걸 보면 자랑스러운 기분이 들어요 이것은 무엇일까요?',
        answer: '태극기'.split(','),
        example: '무궁화,한글'.split(','),
        year: 4,
        class: '참나무반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '생각'.split(','),
        quiz: '1+1 모양인데, 더울 때 우리를 막아주는 것?',
        answer: '창문'.split(','),
        example: '무지개,별똥별,인간'.split(','),
        year: 4,
        class: '소나무반',
        by: '백종윤',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '일상'.split(','),
        quiz: '한미유치원 선생님인데, 안경을 쓰고, 머리가 짧고, 검정 마스크를 썼고, 1층에 있어요.',
        answer: '부원장님'.split(','),
        example: '원장님,이O지 선생님,황O선 선생님'.split(','),
        year: 4,
        class: '소나무반',
        by: '황제인',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '일상'.split(','),
        quiz: '이것은 자동차인데 엄청 커요. 집에 갈 때, 어디 놀러갈 때 타는 차고, 노란색이에요. 한미유치원 차 중에 어린이들이 가장 많이 탈 수 있어요.',
        answer: '백곰차'.split(','),
        example: '고래차,유니콘차,토끼차'.split(','),
        year: 4,
        class: '소나무반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '일상'.split(','),
        quiz: '소나무반이 산책 갔던 곳입니다. 초록색이고, 잔디밭이 엄청 넓고, 백곰차를 타고 갔어요.',
        answer: '정발산'.split(','),
        example: '우리 집,아기돼지 삼형제 집,오렌지마트'.split(','),
        year: 4,
        class: '소나무반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 길쭉하고 노란색이고, 안에는 하얀색이에요. 그리고 이것은 먹을수 있는데 맨 끝에는 못먹어요.',
        answer: '바나나'.split(','),
        example: '레몬,참외,애호박'.split(','),
        year: 4,
        class: '소나무반',
        by: '유승우',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '우유가 넘어지면?',
        answer: '아야'.split(','),
        example: '깨짐,밀크러짐'.split(','),
        year: 4,
        class: '소나무반',
        by: '정유준',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '엉뚱'.split(','),
        quiz: '얼음이 죽으면?',
        answer: '다이빙'.split(','),
        example: '물,깨진 얼음,수증기'.split(','),
        year: 4,
        class: '소나무반',
        by: '정유준',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '엉뚱,생각'.split(','),
        quiz: '사슴벌레 빼기 뿔은?',
        answer: '암컷 사슴벌레'.split(','),
        example: '장수풍뎅이,수컷 사슴벌레'.split(','),
        year: 4,
        class: '소나무반',
        by: '경규빈',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 사람이 다닐 때 따라다니고 검정색이에요.',
        answer: '그림자'.split(','),
        example: '프린터,컴퓨터,저녁'.split(','),
        year: 4,
        class: '소나무반',
        by: '박재이',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '이빨이 뾰족하고 꼬리를 휙휙 휘두르고 머리 위가 뾰족하고 바다에 사는것은?',
        answer: '상어 🦈'.split(','),
        example: '거북이 🐢,문어 🐙,니모 🐠'.split(','),
        year: 3,
        class: '개나리반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '바다 만화이고, 대원들이 나오고, 바다에 도움이 필요하면 바다에 출동하는 애니메이션은?',
        answer: '옥토넛'.split(','),
        example: '뽀로로,카봇,캐치티니핑'.split(','),
        year: 3,
        class: '개나리반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '일상'.split(','),
        quiz: '개나리반 친구가 만든 괴물이에요. 올챙이를 닮았어요. 얼마전에 집을 잃어버렸어요.',
        answer: '올챙이 괴물'.split(','),
        example: '미세먼지 괴물,마스크 괴물,개나리반 괴물'.split(','),
        year: 3,
        class: '개나리반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '일상'.split(','),
        quiz: '이거는 자동차예요. 그리고 빨간색이에요. 이름에 아이가 들어가요. 그리고 현대차예요. 엄마가 타고 다니는 차예요. 그리고 뒤엔 제가 타요.',
        answer: '아이썰티'.split(','),
        example: '투싼,볼보,디스커버리'.split(','),
        year: 3,
        class: '개나리반',
        by: '김도경',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-02',
    },
    {
        type: '상식'.split(','),
        quiz: '나는 바다에 살아요. 영리하기도 하고 포악하기도 해요. 무리를 지어 다녀요. 눈에 있는 무늬가 특이해요.',
        answer: '범고래'.split(','),
        example: '상어,돌고래,흰수염고래'.split(','),
        year: 3,
        class: '개나리반',
        by: '조용운',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 과일이에요. 그리고 색깔은 빨강색이랑 초록색이랑 섞여 있어요. 빨간색에 씨앗이 나와있어요. 이것은 무엇일까요?',
        answer: '딸기 🍓'.split(','),
        example: '사과 🍎,토마토 🍅'.split(','),
        year: 3,
        class: '진달래반',
        by: '임소희',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 동물이에요. 그리고 덩치가 아주 크고 진흙에서 구르기도 해요. 이것은 무엇일까요?',
        answer: '코끼리 🐘'.split(','),
        example: '사자 🦁,토끼 🐇'.split(','),
        year: 3,
        class: '진달래반',
        by: '박준우',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 채소예요. 조금 기다랗고 위에 초록색이 있고 아래에는 하얀색이 있어요. 나뭇잎 같이 생겼어요. 이것은 무엇일까요?',
        answer: '배추'.split(','),
        example: '무,파프리카'.split(','),
        year: 3,
        class: '진달래반',
        by: '임태린',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '하늘색과 노란색 치마를 입고 머리띠를 쓴 공주는?',
        answer: '백설공주'.split(','),
        example: '라푼젤,신데렐라,소피아'.split(','),
        year: 3,
        class: '해바라기반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-10-29',
    },
    {
        type: '상식'.split(','),
        quiz: '여름에 많이 볼 수 있고 맴맴맴맴 울어요. 무엇일까요?',
        answer: '매미'.split(','),
        example: '사마귀,무당벌레,모기'.split(','),
        year: 3,
        class: '해바라기반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '녹아내리고 먹을 수 있고 이것을 먹으면 달콤하고 차가워져요. 무엇일까요?',
        answer: '아이스크림'.split(','),
        example: '얼음,수박,눈'.split(','),
        year: 3,
        class: '해바라기반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '제일 느리고 바다에 살아요. 무엇일까요?',
        answer: '거북이'.split(','),
        example: '달팽이,치타,고래'.split(','),
        year: 3,
        class: '해바라기반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '제일 느리고 등에 꼬불꼬불한 공이 있어요. 무엇일까요?',
        answer: '달팽이'.split(','),
        example: '거북이,치타,팬더'.split(','),
        year: 3,
        class: '해바라기반',
        by: '어린이들',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-05',
    },
    {
        type: '상식'.split(','),
        quiz: '이것은 하늘을 날아다니고 날개가 하나, 둘, 셋, 넷 있고 꼬리같은게 있어요. 사람을 태워서 날아다닐수 있어요. 뭘까요?',
        answer: '헬리콥터'.split(','),
        example: '꿀벌,잠자리,비행기'.split(','),
        year: 3,
        class: '해바라기반',
        by: '이시아',
        role: '어린이',
        lang_quiz: 'ko',
        lang_answer: 'ko',
        date: '2021-11-07',
    },
];