<template>
  <div class="wrapper">
    <!-- Hidden Inputs -->
<!--    <div v-for="(value, key) in searchParams" :key="key">-->
<!--      <input type="hidden" :name="key" :value="value"/>-->
<!--    </div>-->

    <!-- Header Section -->

    <div class="header_wrap">
      <div class="header">
        <div class="top">
          <a href="/" class="logo"><img src="../assets/images/logo.png" alt="(주)금양"/></a>
<!--          <ul>-->
<!--            <li class="logo">-->
<!--              <a href="#"><img src="../assets/images/logo.png" alt="(주)금양"/></a>-->
<!--            </li>-->
<!--          </ul>-->
        </div>

        <!-- Search Box -->
        <div class="sch_wrap">
          <div class="sch_word_wrap">
            <!-- Select Box -->
            <div class="select_sch_box1">
              <select v-model="searchParams.collection" class="mainselectpicker" @change="isChangeCollection = true">
                <option value="ALL">전체</option>
                <option value="appr">전자결재</option>
                <option value="board">게시판</option>
              </select>
            </div>

            <input
                v-model.trim="searchParams.query"
                id="query"
                type="text"
                autocomplete="off"
                placeholder="검색어를 입력하세요"
                @keyup.enter="newSearch"
            />

            <a href="#" class="sch_btn"><span class="ico_comm">자동완성 열기</span></a>

            <!-- Search Input -->

            <!--              <div class="sch_box">-->
            <!--              </div>-->
          </div>

          <!-- Search Options -->
          <div class="sch_opt">
            <button type="button" class="btn gray" @click="newSearch">검색</button>
            <button type="button" class="btn blue" @click="toggleAdvancedSearch">상세검색</button>
            <div class="chk_box">
              <input
                  type="checkbox"
                  v-model="searchParams.requery"
                  id="reChk"
                  style="clip: unset; position: unset; width: 20px; height: 15.86px;"
              />
              <label for="reChk"><span class="txt_box">결과 내 재검색</span></label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
<!--    true false => true-->
<!--    false false => false-->
<!--    true false => false-->
<!--    false false => false-->
    <div class="content_wrap">
      <div class="container">
        <div v-if="showAdvanceSearchArea && searchParams.requery === false" class="layer_pop">
          <!-- 검색어 -->
          <div class="inp_txt_box">
            <strong class="inp_tit">검색어</strong>
            <div
                class="cont_btn_group"
                v-for="(item, index) in searchParams.searchConditions"
                :key="index"
            >
              <div class="select_sch_box">
                <select
                    class="selectpicker1"
                    v-model="item.condition"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
              <input
                  type="text"
                  class="inp_txt"
                  v-model.trim="item.keyword"
                  @keyup.enter="newSearch"
              />
            </div>
          </div>

          <!-- 부서 및 작성자 -->
          <div class="inp_txt_box">
            <strong class="inp_tit">부서</strong>
            <div class="cont_btn_group">
              <input
                  type="text"
                  class="inp_txt"
                  v-model.trim="searchParams.department"
                  @keyup.enter="newSearch"
                  placeholder=""
              />
            </div>
            <strong class="inp_tit" style="margin-top: 15px;">작성자</strong>
            <div class="cont_btn_group">
              <input
                  type="text"
                  class="inp_txt"
                  v-model.trim="searchParams.userName"
                  @keyup.enter="newSearch"
                  placeholder=""
              />
            </div>
          </div>

          <!-- 검색기간 -->
          <div class="inp_txt_box">
            <strong class="inp_tit">검색기간</strong>
            <div class="cont_btn_group terms">
              <div class="terms_area">
                <b-form-radio-group v-model="selectedPeriod"
                                    :options="periods"
                                    class="mb-3"
                                    value-field="value"
                                    text-field="label"
                                    @change="setDirectPeriod">
                </b-form-radio-group>
              </div>

              <div class="search-period-container">
                <!-- 라디오 버튼 -->
                <div class="radio-buttons">
                  <b-form-radio-group
                      v-model="selectedPeriod"
                      :options="direct"
                      value-field="value"
                      text-field="label"
                      inline
                      @click="setDirectModifyFrom"
                  >
                  </b-form-radio-group>
                </div>

                <!-- 달력 영역 -->
                <div class="calendar-area" v-if="selectedPeriod === 'direct'">
                  <div class="inp_calendar">
                    <input
                        name="startDate"
                        v-model="searchParams.modifyFrom"
                        class="inp_txt"
                        type="date"
                    />
                  </div>
                  <span class="calendar-separator">~</span>
                  <div class="inp_calendar">
                    <input
                        name="endDate"
                        v-model="searchParams.modifyTo"
                        class="inp_txt"
                        type="date"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 검색영역 -->
          <div class="inp_txt_box">
            <strong class="inp_tit">검색영역</strong>
            <div class="cont_btn_group terms">
              <div class="terms_area">
                <b-form-checkbox-group
                    :options="searchScopes"
                    v-model="selectedScopes"
                    class="mb-3"
                    value-field="value"
                    text-field="label"
                    @change="changeScopes"
                >
                </b-form-checkbox-group>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="layer_bottom">
            <button type="button" class="btn blue" @click="resetDetailSearchForm">초기화</button>
          </div>
        </div>

        <!-- Search Results -->
        <!-- 검색 결과가 있는 경우 -->
        <div v-show="totalCount > 0">
          <!-- 검색 결과 문구 -->
          <p class="result_txt">
            <span>‘</span>
            <span class="point">{{ requestParams.query }}</span>
            <span class="point" v-for="(item, index) in requestParams.searchConditions" v-show="item && item.keyword !== ''">
              {{ ' ' + item.condition }} {{ item.keyword }}
            </span>
            <span class="point" v-for="(item, index) in requestParams.realquery"> 내 {{ item }}</span>
            <span>’에 대한 검색결과는 </span>
            <span class="point">총 {{ totalCount }}건</span> 입니다.
          </p>

          <!-- 탭 및 결과 렌더링 -->
          <b-card no-body>
            <b-tabs
                v-model="activeTab"
                active-nav-item-class="font-weight-bold text-light bg-primary"
                content-class="mt-3 text-dark"
                fill
            >
              <b-tab title="전체">
                <ResultAppr :result="resultAppr"
                            :showMore="true"
                            @activateTab="activateTab"
                />
                <ResultBoard :result="resultBoard"
                             :showMore="true"
                             @activateTab="activateTab"
                />
              </b-tab>
              <b-tab title="전자결재">
                <ResultAppr :result="resultAppr"
                            :showPageNav="true"
                            @changeSortOption="onChangeSortOption"
                            @changeResultCount="onChangeResultCount"
                            @changePage="changePage"
                />
              </b-tab>
              <b-tab title="게시판">
                <ResultBoard :result="resultBoard"
                             :showPageNav="true"
                             @changeSortOption="onChangeSortOption"
                             @changeResultCount="onChangeResultCount"
                             @changePage="changePage"
                />
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
        <!-- 검색 결과가 없는 경우 -->
        <div v-if="totalCount == 0 && !loading" class="message">
          <div class="no_result" v-show="requestParams.query">
            <span>‘</span>
            <span class="point">{{ requestParams.query }}</span>
            <span class="point" v-for="(item, index) in requestParams.searchConditions" v-show="item && item.keyword !== ''">
              {{ ' ' + item.condition }} {{ item.keyword }}
            </span>
            <span class="point" v-for="(item, index) in requestParams.realquery"> 내 {{ item }}</span>
            <span>’에 대한 검색결과를 찾지 못했습니다.</span>
          </div>

          <div v-if="totalCount == 0  && requestParams.query" class="search-suggestions">
            <ul>
              <li>입력하신 검색어의 철자가 정확한지 확인해 보세요.</li>
              <li>검색어의 단어 수를 줄이거나, 보다 일반적인 단어로 검색해 보세요.</li>
              <li>두 단어 이상의 검색어인 경우, 정확하게 띄어쓰기를 하셨는지 확인해 보세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, watch, onMounted, toRaw} from 'vue';
import ResultAppr from './ResultAppr.vue';
import ResultBoard from './ResultBoard.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

// const pageStarts = reactive({
//   appr: 0,  // 전자결재 탭의 pageStart
//   board: 0, // 게시판 탭의 pageStart
// })

const queryParams = useRoute().query;
const deptId = queryParams.D || '';

const initModifyFrom = () => {
  const yyyy = 1990;
  const mm = '01';
  const dd = '01';
  return `${yyyy}-${mm}-${dd}`;
};

const initModifyTo = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1).toString().padStart(2, '0');
  const dd = today.getDate().toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initSearchCondition = () => {
  return [{ condition: "AND", keyword: "" }, { condition: "AND", keyword: "" }, { condition: "AND", keyword: "" }];
}

const setDirectPeriod = () => {

  searchParams.modifyTo = initModifyTo()

  const today = new Date();

  switch(selectedPeriod.value) {
    case 'ALL':
      today.setFullYear(1990);
      today.setMonth(0);
      today.setDate(1);
    case 'day':
      break;
    case 'week':
      today.setDate(today.getDate() + 1);
      today.setDate(today.getDate() - 7);
      break;
    case 'month':
      today.setDate(today.getDate() + 1);
      today.setMonth(today.getMonth() - 1);
      break;
    case 'year':
      today.setDate(today.getDate() + 1);
      today.setFullYear(today.getFullYear() - 1);
      break;
  }

  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1).toString().padStart(2, '0');
  const dd = today.getDate().toString().padStart(2, '0');

  searchParams.modifyFrom = `${yyyy}-${mm}-${dd}`;

  // return `${yyyy}-${mm}-${dd}`;
};

const setDirectModifyFrom = () => { searchParams.modifyFrom=initModifyFrom(); }


const searchParams = reactive({
  query: "",
  collection: "ALL",
  modifyFrom: initModifyFrom(),
  modifyTo: initModifyTo(),
  sortOption: import.meta.env.VITE_SORT_OPTION,
  pageStart: Number(import.meta.env.VITE_PAGE_START),
  count: Number(import.meta.env.VITE_COUNT),
  requery: false,
  realquery: [],
  department: "",
  userName: "",
  title: false,
  content: false,
  file: false,
  searchConditions: initSearchCondition(),
  deptId: deptId,
});
const activeTab = ref(0);
const requestParams = reactive({ ...searchParams })
const isChangeCollection = ref(false);

let isApprOnly = false
let isBoardOnly = false

const onChangeSortOption = (value, index) => {
  searchParams.sortOption = value;
  search(); // 검색 함수 재실행
  activateTab(index);
};

const onChangeResultCount = (value, index) => {
  searchParams.count = value;
  search(); // 검색 함수 재실행
  activateTab(index);
};

const changePage = (pageStart, index) => {
  searchParams.pageStart = pageStart;
  // if (index === 1) {
  //   pageStarts.appr = pageStart;  // 전자결재 탭의 pageStart 업데이트
  // } else if (index === 2) {
  //   pageStarts.board = pageStart;  // 게시판 탭의 pageStart 업데이트
  // }

  if (index === 1)
    isApprOnly = true;  // 전자결재 탭의 pageStart 업데이트
  else
    isBoardOnly = true;  // 전자결재 탭의 pageStart 업데이트


  search(); // 검색 함수 재실행
  activateTab(index);
};

const activateTab = (index) => {
  activeTab.value = index;
};

const newSearch = () => {

  searchParams.sortOption = import.meta.env.VITE_SORT_OPTION;
  searchParams.pageStart = Number(import.meta.env.VITE_PAGE_START);
  searchParams.count = Number(import.meta.env.VITE_COUNT);

  search();
}

const showAdvanceSearchArea = ref(false);
const totalCount = ref(0);
const resultAppr = ref({});
const resultBoard = ref({});
const selectedPeriod = ref('ALL');
const selectedScopes = ref(['ALL']);
const periods = ref([
  { value: "ALL", label: "전체" },
  { value: "day", label: "1일" },
  { value: "week", label: "1주일" },
  { value: "month", label: "1개월" },
  { value: "year", label: "1년" },
]);
const searchScopes = ref([
  { value: "ALL", label: "전체" },
  { value: "title", label: "제목" },
  { value: "content", label: "내용" },
  { value: "file", label: "첨부파일" },
]);
const direct = ref([
  { value: "direct", label: "직접 선택" },
])

const loading = ref(false);
const search = async (collection) => {
  console.log('search function...')

  loading.value = true;

  // 검색 버튼 클릭 시, collection 값에 따라 탭 전환
  // if(isChangeCollection.value) {
    switch (searchParams.collection) {
      case 'ALL':
        activeTab.value = 0;
        break;
      case 'appr':
        activeTab.value = 1;
        break;
      case 'board':
        activeTab.value = 2;
        break;
    }
  // }

  if(searchParams.query === '' || searchParams.query === undefined) {
    alert('검색어를 입력하세요.')
    return
  }

  searchParams.title = selectedScopes.value.includes('title')
  searchParams.content = selectedScopes.value.includes('content')
  searchParams.file = selectedScopes.value.includes('file')

  totalCount.value = 0;
  // resultAppr.value = [];
  // resultBoard.value = [];

  if(searchParams.requery === true) {
    console.log('set realquery')
    searchParams.realquery.push(searchParams.query)
    searchParams.query = requestParams.query
  } else {
    searchParams.realquery = []
  }

  Object.assign(requestParams, JSON.parse(JSON.stringify(searchParams)));

  console.log('request params: ', requestParams)

  try {
    const response = await axios.post('/search', requestParams);

    if(response.data.appr != null && (isApprOnly || (isApprOnly == isBoardOnly))) {
      console.log('전자결재 update')
      resultAppr.value = response.data.appr
      totalCount.value += resultAppr.value.totalCount;
      isApprOnly = false;
    }

    if(response.data.board != null && (isBoardOnly || (isApprOnly == isBoardOnly))) {
      console.log('게시판 update')
      resultBoard.value = response.data.board
      totalCount.value += resultBoard.value.totalCount;
      isBoardOnly = false;
    }

    resetDetailSearchForm();

  } catch (error) {

    if (error.response) {
      let errorMessage = error.response.data;
      alert(errorMessage);
      console.error('검색 실패:', errorMessage);
    } else {
      console.error(error)
    }

  } finally {
    loading.value = false;
    isChangeCollection.value = false;
    console.log('search function end...')
  }
};

let previousSelectedScopes = ['ALL']
const changeScopes = (currentSelectedScopes) => {
  console.log('changeScopes function...')

  let selectedValue = ''
  let isSelect = previousSelectedScopes.length  < currentSelectedScopes.length

  if(isSelect)
    selectedValue = currentSelectedScopes.filter(item => !previousSelectedScopes.includes(item)).join()
  else
    selectedValue = previousSelectedScopes.filter(item => !currentSelectedScopes.includes(item)).join()
  previousSelectedScopes = currentSelectedScopes;

  if(selectedValue === 'ALL' && isSelect)
    selectedScopes.value = ['ALL'];

  if(selectedValue !== 'ALL' && currentSelectedScopes.includes('ALL'))
    selectedScopes.value = selectedScopes.value.filter(item => item !== 'ALL');

  if(!currentSelectedScopes.includes('ALL') && currentSelectedScopes.length === 3)
    selectedScopes.value = ['ALL'];

  console.log('changeScopes function end...')
}


const resetDetailSearchForm = () => {
  searchParams.department = "";
  searchParams.userName = '';
  // selectedPeriod.value = 'ALL';
  // selectedScopes.value = ['ALL'];
  selectedScopes.modifyFrom = initModifyFrom();
  selectedScopes.modifyTo = initModifyTo();
  searchParams.searchConditions = initSearchCondition();
};

const toggleAdvancedSearch = () => { showAdvanceSearchArea.value = !showAdvanceSearchArea.value; };

onMounted(() => {
  // const allowedReferer = "https://your-allowed-domain.com"; // 허용할 referrer
  const referer = document.referrer;

  // referer 체크 여부
  // 운영환경에서만 체크
  const checkReferer = import.meta.env.VITE_REFERER_CHECK === 'true';
  // if (!referer || !referer.startsWith(allowedReferer)) {
  //   // 허용되지 않은 경우 리다이렉트
  //   alert('직접 접근이 허용되지 않습니다.');
  //   router.push('/not-allowed'); // 허용되지 않은 페이지로 이동
  // }
});

watch(
    () => route.query,
    (queryParams) => {
      searchParams.query = queryParams.query;
      search();
    }
);


</script>

<style scoped>
.wrapper {
  padding: 20px;
}

/* 테두리 제거 */
.no-border-tabs .nav-tabs {
  border-bottom: none !important;
}

.card, .board_box{
  border: none !important;
  //box-shadow: none !important;
}

.search-period-container {
  display: flex; /* 한 줄로 배치 */
  align-items: center; /* 수직 가운데 정렬 */
  gap: 1px; /* 라디오 버튼과 달력 사이 간격 */
}

/* 라디오 버튼 영역 */
.radio-buttons {
  display: flex;
  align-items: center;
}

/* 달력 영역 */
.calendar-area {
  display: flex; /* 한 줄로 배치 */
  align-items: center; /* 수직 가운데 정렬 */
  gap: 5px; /* 입력 칸 사이 간격 */
}

/* 달력 입력 칸 */
.inp_calendar input {
  width: 120px; /* 입력 칸 너비 */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* 달력 구분자(~) 스타일 */
.calendar-separator {
  font-size: 1rem;
  padding: 0 5px;
}
</style>