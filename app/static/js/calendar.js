const params = new URLSearchParams(window.location.search);
const committeeKo = params.get("committee");      // 한글명
const committeeEn = params.get("committee_en");   // 영문명
const useName = params.get("use_name") === "true";

window.addEventListener('DOMContentLoaded', () => {
  if (committeeKo) {
    document.getElementById('committeeKo').textContent = committeeKo;
  }
  if (committeeEn) {
    document.getElementById('committeeEn').textContent = committeeEn;
  }
});

async function fetchSchedules(committee, year, month, useName) {
  let url = `/api/schedules/?committee=${encodeURIComponent(committee)}&year=${year}&month=${month}`;
  //console.log(url)
  if (useName) url += "&use_name=true";
  const res = await fetch(url);
  const data=await res.json();
   return Array.isArray(data) ? data : [];
  //return data;
}

  const calendarGrid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");
  const prevBtn = document.getElementById("prevMonthBtn");
  const nextBtn = document.getElementById("nextMonthBtn");
  
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  
  async function renderCalendar(month, year) {
  
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  

    monthYear.textContent = `${year}년 ${month + 1}월`; // 연도와 월 텍스트

const schedules = await fetchSchedules(committeeKo, year, month + 1, useName);

if (!schedules || !Array.isArray(schedules)) {
    console.error("schedules 데이터가 올바르지 않습니다:", schedules);
    return;
}
//console.log(schedules)
calendarGrid.innerHTML = "";  // 그리드 초기화

let scheduleMap = {};  // 변경 가능하도록 let 사용

schedules.forEach(item => {
    if (item.date) {
        const dateParts = item.date.split('-');
        const day = Number(dateParts[2]);

        if (!isNaN(day)) {
            if (!scheduleMap[day]) scheduleMap[day] = [];
            scheduleMap[day].push(item);
        } else {
            console.error("올바르지 않은 날짜 값:", item.date);
        }
    } else {
        console.error("date 값이 없습니다:", item);
    }
});

//console.log("최종 scheduleMap:", scheduleMap);
    
    // 요일 헤더 추가
    weekDays.forEach(day => {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day;
      dayDiv.style.fontWeight = "bold";
      dayDiv.style.backgroundColor = "#e0e0e0";
      calendarGrid.appendChild(dayDiv);
    });
  
    // 첫 번째 날짜가 시작되는 위치를 맞추기 위해 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      calendarGrid.appendChild(emptyDiv);
    }
  
    // 달력에 날짜를 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day-cell");
  
      const dateText = document.createElement("div");
      dateText.textContent = day;
      dayDiv.appendChild(dateText);
  
      

     // 점 표시
        if (scheduleMap[day]) {
          const types = [...new Set(scheduleMap[day].map(e => e.type))];
          const dotWrapper = document.createElement("div");
          dotWrapper.classList.add("calendar-dots");

          types.forEach(type => {
          const dot = document.createElement("div");
          dot.classList.add("calendar-dot", type);  // 색상 추가
          dotWrapper.appendChild(dot);
        });
  
        dayDiv.appendChild(dotWrapper);
        }
      

      // 날짜 클릭 시 일정 표시 및 배경색 변화 (기존 코드 유지)
      dayDiv.addEventListener("click", () => {
        const dateString = `${year}년 ${month + 1}월 ${day}일`;
        document.getElementById("selectedDate").textContent = dateString;
  
        const scheduleList = document.getElementById("scheduleList");
        scheduleList.innerHTML = "";
  
        const agendaDetail = document.getElementById("agendaDetail");
        agendaDetail.textContent = "일정을 선택하면 이곳에 상세 내용이 표시됩니다.";
  
        // 이전에 선택된 날짜 셀에서 선택된 클래스 제거
        const previouslySelected = document.querySelector(".selected");
        if (previouslySelected) {
          previouslySelected.classList.remove("selected");
        }
  
        // 선택된 날짜 셀에 클래스 추가
        dayDiv.classList.add("selected");
  
        if (scheduleMap[day]) {
          scheduleMap[day].forEach(item => {
            const card = document.createElement("div");
            card.classList.add("schedule-card", item.type); // 색상에 따라 클래스 추가
  
            // 일정 카드 내용 추가
            card.innerHTML = `
              <h3>${item.title}</h3>
              <div class="time">${item.time || '시간 미정'}</div>
            `;
            // 일정 클릭 시 안건 상세 내용 표시
            card.addEventListener("click", () => {
              agendaDetail.innerHTML = `${item.agenda}`;
            });
  
            scheduleList.appendChild(card);
          });
        } else {
          const noScheduleCard = document.createElement("div");
          noScheduleCard.classList.add("no-schedule-card");
          noScheduleCard.textContent = "해당 날짜에는 일정이 없습니다"; // 일정이 없을 때 메시지
          scheduleList.appendChild(noScheduleCard);
        }
      });
  
      calendarGrid.appendChild(dayDiv);
    }
  }
  
  // 이전 월, 다음 월 버튼 클릭 시 달력 이동
  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });
  
  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });
  
  // 페이지 로드 시 초기 달력 렌더링
  renderCalendar(currentMonth, currentYear);
