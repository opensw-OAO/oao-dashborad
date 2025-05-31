
const parentElement = document.querySelectorAll(".committe_baseset") // 부모 요소 선택

parentElement.forEach(element => {
    const koEl = element.querySelector(".committe_name_ko");
    const enEl = element.querySelector(".committe_name_en");
    const koName = koEl.textContent.replace(/\s+/g, ' ').trim();
    const enName = enEl.textContent.replace(/\s+/g, ' ').trim();

    element.innerHTML += `<span class="button_info" onclick="committee_goto_info('${koName}')"><p>위원회 소개</p></span>`;
    element.innerHTML += `<span class="button_date" onclick="committee_goto_date('${koName}','${enName}')"><p>일정 보기</p></span>`;
});

function committee_goto_info(koName){
    window.location.href=`/committee?committee=${koName}`;
}                                                            

function committee_goto_date(koName, enName){
    window.location.href = `/calendar?committee=${encodeURIComponent(koName)}&committee_en=${encodeURIComponent(enName)}&use_name=true`;
}