function build_page(cols, infos) {
  let html = `
  <h2>유치원생활기록부</h2>
  <button class="download">hml 다운로드</button>
  <table>
    <thead>
      <tr>
        <td>구분 | 연령</td>
        <td>3세</td>
        <td>4세</td>
        <td>5세</td>
        <td>사진</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>수료ㆍ졸업대장번호</td>
        <td contenteditable="true" spellcheck="false" class="대장3세">0000-0</td>
        <td contenteditable="true" spellcheck="false" class="대장4세">0000-0</td>
        <td contenteditable="true" spellcheck="false" class="대장5세">0000-0</td>
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
  <h3>1. 인적사항</h3>
  <table>
    <thead>
      <tr>
        <td>성명</td>
        <td contenteditable="true" spellcheck="false" class="어린이이름">...</td>
        <td>성별</td>
        <td contenteditable="true" spellcheck="false" class="어린이성별">O</td>
        <td>생년월일</td>
        <td contenteditable="true" spellcheck="false" class="어린이생년월일">0000.00.00.</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="3">주소</td>
        <td colspan="5" contenteditable="true" spellcheck="false" class="주소1">...</td>
      </tr>
      <tr>
        <td colspan="5" contenteditable="true" spellcheck="false" class="주소2"></td>
      </tr>
      <tr>
        <td colspan="5" contenteditable="true" spellcheck="false" class="주소3"></td>
      </tr>
      <tr>
        <td rowspan="3">가족<br>상황</td>
        <td>구분 | 관계</td>
        <td colspan="2">부</td>
        <td colspan="2">모</td>
      </tr>
      <tr>
        <td>성명</td>
        <td colspan="2" contenteditable="true" spellcheck="false" class="부성명">OOO</td>
        <td colspan="2" contenteditable="true" spellcheck="false" class="모성명">OOO</td>
      </tr>
      <tr>
        <td>생년월일</td>
        <td colspan="2" contenteditable="true" spellcheck="false" class="부생년월일">0000.00.00.</td>
        <td colspan="2" contenteditable="true" spellcheck="false" class="모생년월일">0000.00.00.</td>
      </tr>
    </tbody>
  </table>
  <h3>2. 학적사항</h3>
  <table>
    <thead>
      <tr>
        <td>연.월.일. | 구분</td>
        <td>내용</td>
        <td>특기사항</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td contenteditable="true" spellcheck="false" class="학적날짜1">0000.00.00.</td>
        <td contenteditable="true" spellcheck="false" class="학적내용1"></td>
        <td contenteditable="true" spellcheck="false" class="학적특기1"></td>
      </tr>
      <tr>
        <td contenteditable="true" spellcheck="false" class="학적날짜2"></td>
        <td contenteditable="true" spellcheck="false" class="학적내용2"></td>
        <td contenteditable="true" spellcheck="false" class="학적특기2"></td>
      </tr>
      <tr>
        <td contenteditable="true" spellcheck="false" class="학적날짜3"></td>
        <td contenteditable="true" spellcheck="false" class="학적내용3"></td>
        <td contenteditable="true" spellcheck="false" class="학적특기3"></td>
      </tr>
      <tr>
        <td contenteditable="true" spellcheck="false" class="학적날짜4"></td>
        <td contenteditable="true" spellcheck="false" class="학적내용4"></td>
        <td contenteditable="true" spellcheck="false" class="학적특기4"></td>
      </tr>
      <tr>
        <td contenteditable="true" spellcheck="false" class="학적날짜5"></td>
        <td contenteditable="true" spellcheck="false" class="학적내용5"></td>
        <td contenteditable="true" spellcheck="false" class="학적특기5"></td>
      </tr>
      <tr>
        <td contenteditable="true" spellcheck="false" class="학적날짜6"></td>
        <td contenteditable="true" spellcheck="false" class="학적내용6"></td>
        <td contenteditable="true" spellcheck="false" class="학적특기6"></td>
      </tr>
      <tr>
        <td>졸업 후의 상황</td>
        <td colspan="2" contenteditable="true" spellcheck="false" class="졸업후의상황"></td>
      </tr>
    </tbody>
  </table>
  <h3>3. 출결상황</h3>
  <table>
    <thead>
      <tr>
        <td>연령 | 구분</td>
        <td>수업일수</td>
        <td>출석일수</td>
        <td>결석일수</td>
        <td>특기사항</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>3세</td>
        <td contenteditable="true" spellcheck="false" class="수업일3세"></td>
        <td contenteditable="true" spellcheck="false" class="출석일3세"></td>
        <td contenteditable="true" spellcheck="false" class="결석일3세"></td>
        <td contenteditable="true" spellcheck="false" class="출결특기3"></td>
      </tr>
      <tr>
        <td>4세</td>
        <td contenteditable="true" spellcheck="false" class="수업일4세"></td>
        <td contenteditable="true" spellcheck="false" class="출석일4세"></td>
        <td contenteditable="true" spellcheck="false" class="결석일4세"></td>
        <td contenteditable="true" spellcheck="false" class="출결특기4"></td>
      </tr>
      <tr>
        <td>5세</td>
        <td contenteditable="true" spellcheck="false" class="수업일5세"></td>
        <td contenteditable="true" spellcheck="false" class="출석일5세"></td>
        <td contenteditable="true" spellcheck="false" class="결석일5세"></td>
        <td contenteditable="true" spellcheck="false" class="출결특기5"></td>
      </tr>
    </tbody>
  </table>
  <h3>4. 신체발달상황</h3>
  <table>
    <thead>
      <tr>
        <td>연령 | 구분</td>
        <td>검사일</td>
        <td>키(cm)</td>
        <td>몸무게(kg)</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>3세</td>
        <td contenteditable="true" spellcheck="false" class="검사일3세">0000.00.00.</td>
        <td contenteditable="true" spellcheck="false" class="키3세"></td>
        <td contenteditable="true" spellcheck="false" class="몸무게3세"></td>
      </tr>
      <tr>
        <td>4세</td>
        <td contenteditable="true" spellcheck="false" class="검사일4세"></td>
        <td contenteditable="true" spellcheck="false" class="키4세"></td>
        <td contenteditable="true" spellcheck="false" class="몸무게4세"></td>
      </tr>
      <tr>
        <td>5세</td>
        <td contenteditable="true" spellcheck="false" class="검사일5세"></td>
        <td contenteditable="true" spellcheck="false" class="키5세"></td>
        <td contenteditable="true" spellcheck="false" class="몸무게5세"></td>
      </tr>
    </tbody>
  </table>
  <h3>5. 건강검진</h3>
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
      <tr>
        <td>3세</td>
        <td contenteditable="true" spellcheck="false" class="검진일3세">0000.00.00.</td>
        <td contenteditable="true" spellcheck="false" class="검진기관3세"></td>
        <td contenteditable="true" spellcheck="false" class="검진특기3세"></td>
      </tr>
      <tr>
        <td>4세</td>
        <td contenteditable="true" spellcheck="false" class="검진일4세"></td>
        <td contenteditable="true" spellcheck="false" class="검진기관4세"></td>
        <td contenteditable="true" spellcheck="false" class="검진특기4세"></td>
      </tr>
      <tr>
        <td>5세</td>
        <td contenteditable="true" spellcheck="false" class="검진일5세"></td>
        <td contenteditable="true" spellcheck="false" class="검진기관5세"></td>
        <td contenteditable="true" spellcheck="false" class="검진특기5세"></td>
      </tr>
    </tbody>
  </table>
  <h3>6. 유아발달상황</h3>
  <table>
    <thead>
      <tr>
        <td>연령</td>
        <td>발달상황</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>3세</td>
        <td contenteditable="true" spellcheck="false" class="발달상황3세"></td>
      </tr>
      <tr>
        <td>4세</td>
        <td contenteditable="true" spellcheck="false" class="발달상황4세"></td>
      </tr>
      <tr>
        <td>5세</td>
        <td contenteditable="true" spellcheck="false" class="발달상황5세"></td>
      </tr>
    </tbody>
  </table>`;

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
  let bt_downlaod = el_page.querySelector('.download');
  bt_downlaod.textContent = `${name} hml 다운로드`;

  el_page.querySelector('h2').textContent = `${name} 유치원생활기록부`;

  document.body.appendChild(el_page);
}