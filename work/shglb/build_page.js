function build_page(cols, infos) {
    let html = `
<h2>유치원생활기록부</h2>
<div class="control">
    <button class="go-up">⤒</button>
    <button class="go-down">⤓</button>
    <button class="download">hml 다운로드</button>
    <span style="margin-left: 20px; color: gray;">|</span>
    <button class="remove" style="margin-left: 20px">삭제</button>
</div>
<div class="section-1">
    <h3>1. 기본사항 
        <span a class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/6a815b2d7fd04e1982edeb51a3a569bf">기재 예시</a> )
        </span>
        <input type="checkbox" class="focus-1">
    </h3>
    <table>
        <thead>
            <tr>
                <td>구분 | 연령</td>
                <td style="width: 120px;">3세</td>
                <td style="width: 120px;">4세</td>
                <td style="width: 120px;">5세</td>
                <td>사진</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>수료ㆍ졸업대장번호</td>
                <td contenteditable="true" spellcheck="false" class="대장3세">-</td>
                <td contenteditable="true" spellcheck="false" class="대장4세">-</td>
                <td contenteditable="true" spellcheck="false" class="대장5세">-</td>
                <td rowspan="3" contenteditable="true" spellcheck="false" class="사진파일명"></td>
            </tr>
            <tr>
                <td>반</td>
                <td contenteditable="true" spellcheck="false" class="반3세"></td>
                <td contenteditable="true" spellcheck="false" class="반4세"></td>
                <td contenteditable="true" spellcheck="false" class="반5세"></td>
            </tr>
            <tr>
                <td>담임 성명</td>
                <td contenteditable="true" spellcheck="false" class="담임3세"></td>
                <td contenteditable="true" spellcheck="false" class="담임4세"></td>
                <td contenteditable="true" spellcheck="false" class="담임5세"></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="section-2">
    <h3>2. 인적사항 
        <span a class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/7eb6cb73c8da4759971bc95743286bab">기재 예시</a> )
        </span>
        <input type="checkbox" class="focus-2">
    </h3>
    <table>
        <thead>
            <tr>
                <td>성명</td>
                <td style="width: 120px;"contenteditable="true" spellcheck="false" class="어린이이름">...</td>
                <td>성별</td>
                <td style="width: 50px;"contenteditable="true" spellcheck="false" class="어린이성별">남여</td>
                <td>주민등록번호</td>
                <td style="width: 200px;" contenteditable="true" spellcheck="false" class="주민등록번호">000000-0000000</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="4">주소</td>
                <td colspan="5" contenteditable="true" spellcheck="false" class="주소1" style="text-align: left;">...</td>
            </tr>
            <tr>
                <td colspan="5" contenteditable="true" spellcheck="false" class="주소2" style="text-align: left;"></td>
            </tr>
            <tr>
                <td colspan="5" contenteditable="true" spellcheck="false" class="주소3" style="text-align: left;"></td>
            </tr>
            <tr>
                <td colspan="5" contenteditable="true" spellcheck="false" class="주소4" style="text-align: left;"></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="section-3">
    <h3>3. 학적사항 
        <span a class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/c4effe7f4a6b4e46af5172e438e07b3a">기재 예시</a> )
        </span>
        <input type="checkbox" class="focus-3">
    </h3>
    <table>
        <thead>
            <tr>
                <td>연.월.일. | 구분</td>
                <td style="width: 400px;">내용</td>
                <td>특기사항</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td contenteditable="true" spellcheck="false" class="학적날짜1">0000. 0. 0.</td>
                <td contenteditable="true" spellcheck="false" class="학적내용1" style="text-align: right;"></td>
                <td contenteditable="true" spellcheck="false" class="학적특기1"></td>
            </tr>
            <tr>
                <td contenteditable="true" spellcheck="false" class="학적날짜2"></td>
                <td contenteditable="true" spellcheck="false" class="학적내용2" style="text-align: right;"></td>
                <td contenteditable="true" spellcheck="false" class="학적특기2"></td>
            </tr>
            <tr>
                <td contenteditable="true" spellcheck="false" class="학적날짜3"></td>
                <td contenteditable="true" spellcheck="false" class="학적내용3" style="text-align: right;"></td>
                <td contenteditable="true" spellcheck="false" class="학적특기3"></td>
            </tr>
            <tr>
                <td contenteditable="true" spellcheck="false" class="학적날짜4"></td>
                <td contenteditable="true" spellcheck="false" class="학적내용4" style="text-align: right;"></td>
                <td contenteditable="true" spellcheck="false" class="학적특기4"></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="section-4">
    <h3>4. 출결상황 
        <span a class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/ad5b727bf80c4292b5c65790ec448c14">기재 예시</a> )
        </span>
        <input type="checkbox" class="focus-4">
    </h3>
    <table>
        <thead>
            <tr>
                <td rowspan="2">연령 | 구분</td>
                <td rowspan="2">수업일수</td>
                <td rowspan="2">출석일수</td>
                <td colspan="4">결석일수</td>
                <td rowspan="2">특기사항</td>
            </tr>
            <tr>
                <td style="width: 80px;">질병</td>
                <td style="width: 80px;">기타</td>
                <td style="width: 80px;">미인정</td>
                <td style="width: 80px;">소계</td>
            </tr>
        </thead>
        <tbody>
            <tr class="age-3">
                <td>3세</td>
                <td contenteditable="true" spellcheck="false" class="수업일3세"></td>
                <td contenteditable="true" spellcheck="false" class="출석일3세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일질병3세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일기타3세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일미인정3세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일소계3세"></td>
                <td contenteditable="true" spellcheck="false" class="출결특기3세"></td>
            </tr>
            <tr class="age-4">
                <td>4세</td>
                <td contenteditable="true" spellcheck="false" class="수업일4세"></td>
                <td contenteditable="true" spellcheck="false" class="출석일4세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일질병4세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일기타4세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일미인정4세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일소계4세"></td>
                <td contenteditable="true" spellcheck="false" class="출결특기4세"></td>
            </tr>
            <tr class="age-5">
                <td>5세</td>
                <td contenteditable="true" spellcheck="false" class="수업일5세"></td>
                <td contenteditable="true" spellcheck="false" class="출석일5세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일질병5세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일기타5세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일미인정5세"></td>
                <td contenteditable="true" spellcheck="false" class="결석일소계5세"></td>
                <td contenteditable="true" spellcheck="false" class="출결특기5세"></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="section-5">
    <h3>5. 신체발달상황 
        <span a class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/098cd591bfb54202b61dd0023c9b5293">기재 예시</a> )
        </span>
        <input type="checkbox" class="focus-5">
    </h3>
    <table>
        <thead>
            <tr>
                <td>연령 | 구분</td>
                <td>검사일</td>
                <td style="width: 200px;">키(cm)</td>
                <td style="width: 200px;">몸무게(kg)</td>
            </tr>
        </thead>
        <tbody>
            <tr class="age-3">
                <td>3세</td>
                <td contenteditable="true" spellcheck="false" class="검사일3세">0000. 0. 0.</td>
                <td contenteditable="true" spellcheck="false" class="키3세"></td>
                <td contenteditable="true" spellcheck="false" class="몸무게3세"></td>
            </tr>
            <tr class="age-4">
                <td>4세</td>
                <td contenteditable="true" spellcheck="false" class="검사일4세"></td>
                <td contenteditable="true" spellcheck="false" class="키4세"></td>
                <td contenteditable="true" spellcheck="false" class="몸무게4세"></td>
            </tr>
            <tr class="age-5">
                <td>5세</td>
                <td contenteditable="true" spellcheck="false" class="검사일5세"></td>
                <td contenteditable="true" spellcheck="false" class="키5세"></td>
                <td contenteditable="true" spellcheck="false" class="몸무게5세"></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="section-6">
    <h3>6. 건강검진 
        <span a class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/77f8ba98c6c446daa8daca0fa43b76f2">기재 예시</a> )
        </span>
        <input type="checkbox" class="focus-6">
    </h3>
    <table>
        <thead>
            <tr>
                <td>연령 | 구분</td>
                <td>검진일</td>
                <td>검진기관</td>
                <td>특기사항</td>
            </tr>
        </thead>
        <tbody>
            <tr class="age-3">
                <td>3세</td>
                <td contenteditable="true" spellcheck="false" class="검진일3세">0000. 0. 0.</td>
                <td contenteditable="true" spellcheck="false" class="검진기관3세"></td>
                <td contenteditable="true" spellcheck="false" class="검진특기3세"></td>
            </tr>
            <tr class="age-4">
                <td>4세</td>
                <td contenteditable="true" spellcheck="false" class="검진일4세"></td>
                <td contenteditable="true" spellcheck="false" class="검진기관4세"></td>
                <td contenteditable="true" spellcheck="false" class="검진특기4세"></td>
            </tr>
            <tr class="age-5">
                <td>5세</td>
                <td contenteditable="true" spellcheck="false" class="검진일5세"></td>
                <td contenteditable="true" spellcheck="false" class="검진기관5세"></td>
                <td contenteditable="true" spellcheck="false" class="검진특기5세"></td>
            </tr>
        </tbody>
    </table>
</div>
<div class="section-7">
    <h3>7. 유아발달상황 
        <span class="small">
            ( <a target="_blank" href="https://good-pike-738.notion.site/232aafc0cbf04bcfbcc0cbc5d870e310">기재 예시</a>, 
            <a target="_blank" href="http://speller.cs.pusan.ac.kr">맞춤법 검사</a>,
            <a target="_blank" href="https://www.notion.so/ChatGPT-dc455d67167f4f3abdbb87c7dcfb5fcb">GPT 도움</a> )
        </span>
        <input type="checkbox" class="focus-7">
    </h3>
    <table>
        <thead>
            <tr>
                <td>연령</td>
                <td>발달상황<span class="small" style="margin-bottom: 5px;"> : 5문장 내외, 500자 이하 (430 ~ 500)</span></td>
            </tr>
        </thead>
        <tbody>
            <tr class="age-3">
                <td>3세<span class="small"><span></td>
                <td contenteditable="true" spellcheck="false" class="발달상황3세" style="text-align: left;"></td>
            </tr>
            <tr class="age-4">
                <td>4세<span class="small"><span></td>
                <td contenteditable="true" spellcheck="false" class="발달상황4세" style="text-align: left;"></td>
            </tr>
            <tr class="age-5">
                <td>5세<span class="small"><span></td>
                <td contenteditable="true" spellcheck="false" class="발달상황5세" style="text-align: left;"></td>
            </tr>
        </tbody>
    </table>
</div>
    `;
    
    let el_page = document.createElement('div');
    el_page.className = 'page';
    el_page.innerHTML = html;
    
    //let infos = line.split('\t').map(x => x.trim());
    if(cols.length === infos.length) {
        for(let i = 0; i < cols.length; i++) {
            let query = cols[i];
            if(query) {
                let el_field = el_page.querySelector(`.${query}`);
                if(el_field) {
                    el_field.textContent = infos[i];
                    check_all(el_field);
                }  
            }
        }
    }
    
    let name = el_page.querySelector('.어린이이름').textContent;
    el_page.querySelector('.download').textContent = `${name} hml 다운로드`;
    el_page.querySelector('.remove').textContent = `${name} 삭제`;
    
    el_page.querySelector('h2').textContent = `${name} 유치원생활기록부`;

    document.querySelector('#pages').appendChild(el_page);
}