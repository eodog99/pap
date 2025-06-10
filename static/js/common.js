$(document).ready(function () {

   $("#header").load("layout/header.html", function () {
   });

   $("#nav").load("layout/menu.html", function () {
        highlightCurrentMenu('#nav');
        renderRecentMenus();
  });

   // 최근 클릭 메뉴 저장 로직
    $(document).on('click', '.depth3-wrap li a', function () {
        const menuName = $(this).text().trim();
        saveMenuClickInfo(menuName);
    });

   $("#footer").load("layout/footer.html", function () {
   });
})

// 최근 클릭한 메뉴 저장
function saveMenuClickInfo(menuName) {
    const now = new Date();
    const timestamp = now.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const newEntry = { name: menuName, time: timestamp };
    let menuHistory = JSON.parse(localStorage.getItem('menuHistory')) || [];

    // 중복 제거 후 맨 앞에 추가
    menuHistory = menuHistory.filter(item => item.name !== menuName);
    menuHistory.unshift(newEntry);
    if (menuHistory.length > 3) {
        menuHistory = menuHistory.slice(0, 3);
    }

    localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
    renderRecentMenus();
}


// 최근 클릭 메뉴 표시
function renderRecentMenus() {
    const list = $('#recentMenuList');
    if (!list.length) return;

    const menuHistory = JSON.parse(localStorage.getItem('menuHistory')) || [];
    list.empty();

    menuHistory.forEach(item => {
        const li = $('<li>').text(`${item.name} (${item.time})`);
        list.append(li);
    });
}

// 페이지 이동시 active 유지
function highlightCurrentMenu(containerSelector) {
    const $container = $(containerSelector);
    const currentPath = window.location.pathname;

    console.log("현재 페이지 경로 (currentPath):", currentPath);

    const checkExist = setInterval(() => {
        const $links = $container.find('.depth3-wrap li a');
        if ($links.length === 0) return;

        clearInterval(checkExist); // 요소가 생기면 체크 종료

        $links.each(function () {
            const $link = $(this);
            const href = $link.attr('href');
            if (!href) return;

            const linkPath = new URL(href, window.location.origin).pathname;
            console.log("링크 href:", href, "→ 변환된 linkPath:", linkPath);

            if (linkPath === currentPath) {

                const $depth3Li = $link.closest('li');
                const $depth2Li = $depth3Li.closest('ul.depth3-wrap').closest('li');
                const $menuItem = $depth2Li.closest('ul.depth2-wrap').closest('li.menu-item');

                 // 1Depth 활성화
                  $menuItem.find('> .depth1-wrap').addClass('active');
                  $menuItem.find('> ul.depth2-wrap').addClass('open');

                  // 2Depth만 active, 3Depth는 열지 않음
                  $depth2Li.find('> .depth2-text').addClass('active');

                  // 3Depth는 열지 않음
                  // $depth2Li.find('> ul.depth3-wrap').addClass('open'); ← 주석 또는 제거

                  // 현재 페이지 링크에만 active 스타일
                  $link.addClass('active');
            }
        });
    }, 100);
}

function initTabs(tabNavSelector, tabBodySelector) {
  document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll(`${tabNavSelector} a`)
    // tab-body > div(tab-content)
    //document.querySelectorAll(...) : nodelist라는 형태의 객체를 반환, 배열처럼 인덱스로 접근가능, foreach, length 사용 가능 , map 이나 filter 같은 배열 메서드는 직접 쓸 수 없음
    const tabBodies = document.querySelectorAll(`${tabBodySelector} > div`)

    // 모든 탭 콘텐츠 숨기기
    tabBodies.forEach(div => div.style.display = 'none')
    navLinks.forEach((link, index) => {
    link.addEventListener('click' , function(e) {
        // 클릭해도 이동 안함(기본동작을 막음) 우리가 정의한 동작만 실행된다
        // e.preventDefault(): 모든 DOM 요소에는 기본 동작이 존재하는데 그 기본 동작을 막아주는 메소드.
        e.preventDefault();
        //모든 탭 콘텐츠 숨기기
        tabBodies.forEach(div => div.style.display = 'none');
        //현재 탭 콘텐츠 보이게
        const target = document.querySelector(this.hash); // this.hash: #~ 
        if(target) {
          target.style.display = 'block';
          target.style.opacity = '0';
          target.style.transition = 'opacity 0.3s';
          // requestAnimaitionFrame을 통해 콜백을 실행하면 callback은 자동적으로 디스플레이의 주사율에 맞춰서 실행된다는 것임...
          requestAnimationFrame(() => {
            target.style.opacity = 1;
          });
        }
        navLinks.forEach(link => link.classList.remove('active'));

        //현재 탭에 active 클래스 추가
        this.classList.add('active');
      });
      //첫번째탭 강제 클릭
      if(index === 0) {
        link.click();
      }
    })
  })
}

//============== 일반 탭 초기화 ==============
initTabs('.tabs-nav', '.tab-body');
//============== 모달 탭 초기화 ==============
initTabs('.modal-tabs-nav', '.modal-tab-body');