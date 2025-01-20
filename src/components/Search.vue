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
          <ul>
            <li class="logo">
              <a href="#"><img src="../assets/images/logo.png" alt="(주)금양"/></a>
            </li>
          </ul>
        </div>

        <!-- Search Box -->
        <div class="sch_wrap">
          <div class="sch_word_wrap">
            <!-- Select Box -->
            <div class="select_sch_box1">
              <select v-model="searchParams.collection" class="mainselectpicker">
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
            />

            <a href="#" class="sch_btn"><span class="ico_comm">자동완성 열기</span></a>

            <!-- Search Input -->

            <!--              <div class="sch_box">-->
            <!--              </div>-->
          </div>

          <!-- Search Options -->
          <div class="sch_opt">
            <button type="button" class="btn gray" @click="search">검색</button>
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
    <div class="content_wrap">
      <div class="container">
        <div v-if="showAdvanceSearchArea" class="layer_pop">
          <!-- 검색어 -->
          <div class="inp_txt_box">
            <strong class="inp_tit">검색어</strong>
            <div
                class="cont_btn_group"
                v-for="(search, index) in searchConditions"
                :key="index"
            >
              <div class="select_sch_box">
                <select
                    class="selectpicker1"
                    v-model="search.condition"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
              <input
                  type="text"
                  class="inp_txt"
                  v-model.trim="search.keyword"
                  :placeholder="'검색어 입력 ' + (index + 1)"
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
                  v-model.trim="searchParams.dept"
                  placeholder="부서를 입력하세요"
              />
            </div>
            <strong class="inp_tit" style="margin-top: 15px;">작성자</strong>
            <div class="cont_btn_group">
              <input
                  type="text"
                  class="inp_txt"
                  v-model="searchParams.userNm"
                  placeholder="작성자를 입력하세요"
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

              <b-form-radio-group v-model="selectedPeriod"
                                  :options="direct"
                                  class="form-check-inline"
                                  value-field="value"
                                  text-field="label" inline>
              </b-form-radio-group>
              <div class="terms_area" v-if="selectedPeriod === 'direct'">
                <span class="inp_area calendar">
                  <div class="inp_calendar">
                  <input
                      name="startDate"
                      v-model="searchParams.modifyFrom"
                      class="inp_txt"
                      type="date"
                  />
                  </div>
                  <div class="inp_calendar">
                    <input
                        name="endDate"
                        v-model="searchParams.modifyTo"
                        class="inp_txt"
                        type="date"
                    />
                  </div>
                </span>
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
                    v-model="searchParams.selectedScopes"
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
            <button type="button" class="btn blue" @click="resetSearch">초기화</button>
          </div>
        </div>

        <!-- Search Results -->
        <!-- 검색 결과가 있는 경우 -->
        <div v-show="totalCount > 0">
          <p class="result_txt">
            <span class="point">‘{{ searchParams.query }}’</span>에 대한 검색결과는
            <span class="point">총 {{ totalCount }} 건</span> 입니다.
          </p>
          <b-card no-body>
            <b-tabs
                v-model="activeTab"
                active-nav-item-class="font-weight-bold text-light bg-primary"
                content-class="mt-3 text-dark" fill
            >
              <b-tab title="전체">
                <ResultAppr :result="resultAppr" @activateTab="activateTab" :activeMore="true"/>
                <ResultBoard :result="resultBoard" @activateTab="activateTab" :activeMore="true"/>
              </b-tab>
              <b-tab title="전자결재">
                <ResultAppr :result="resultAppr"/>
              </b-tab>
              <b-tab title="게시판">
                <ResultBoard :result="resultBoard"/>
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
        <!-- 검색 결과가 없는 경우 -->
        <div v-if="totalCount == 0">
          <div class="no_result">
            <p>입력하신 검색어와 일치하는 정보를 찾지 못했습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, watch} from 'vue';
import ResultAppr from './ResultAppr.vue';
import ResultBoard from '../components/ResultBoard.vue';
import axios from 'axios';

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

const setDirectPeriod = () => {

  searchParams.modifyTo = initModifyTo()

  // let minusDay = 0;
  // let minusMonth = 0;
  // let minusYear = 0;
  //
  // console.log(selectedPeriod.value)
  // switch(selectedPeriod.value) {
  //   case 'day':
  //     minusDay = 1;
  //     break;
  //   case 'week':
  //     minusDay = 7;
  //     break;
  //   case 'month':
  //     minusMonth = 1;
  //     break;
  //   case 'year':
  //     minusYear = 1;
  //     break;
  // }
  //
  // const today = new Date();
  // const yyyy = today.getFullYear() - minusYear;
  // const mm = (today.getMonth() + 1 - minusMonth).toString().padStart(2, '0');
  // const dd = (today.getDate() - minusDay).toString().padStart(2, '0');
  //
  // console.log(`${yyyy}-${mm}-${dd}`, ' ~ ', searchParams.modifyTo)
  return `${yyyy}-${mm}-${dd}`;
};

const searchParams = reactive({
  query: "",
  collection: "ALL",
  modifyFrom: initModifyFrom(),
  modifyTo: initModifyTo(),
  sortOption: "RANK/DESC",
  pageStart: 0,
  count: 10,
  requery: false,
  realquery: '',
  dept: "",
  userNm: "",
  title: false,
  content: false,
  file: false,
  selectedScopes: ['ALL'],
});
const activeTab = ref(0);


let previousQuery = ''

const activateTab = (index) => {
  console.log('activateTab')
  activeTab.value = index;
};

const showAdvanceSearchArea = ref(false);
const totalCount = ref(0);
const resultAppr = ref({});
const resultBoard = ref({});
const selectedPeriod = ref('ALL');
// const selectedScopes = ref(['ALL']);

const searchConditions = ref([
  { condition: "AND", keyword: "" },
  { condition: "AND", keyword: "" },
  { condition: "AND", keyword: "" },
]);

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

const search = async () => {
  console.log('search function...')

  if(searchParams.query === '') {
    alert('검색어를 입력하세요.')
    // this.$refs.query.focus(); // focus 코드 작동 안됨. 수정 필요
    return
  }

  totalCount.value = 0;
  resultAppr.value = [];
  resultBoard.value = [];

  previousQuery = searchParams.query;


  let searchParamsCopy = searchParams

  for(var i in searchConditions.value){
    let checkCondition= searchConditions.value[i];

    if(checkCondition.keyword !== '')
      searchParamsCopy.query += (checkCondition.condition  === 'AND' ? ' ' : '|') + checkCondition.keyword;
  }

  searchParamsCopy.query = searchParamsCopy.query.trim()

  try {
    console.log('search params: ', searchParamsCopy)
    const response = await axios.post('/search', searchParamsCopy);

    if(response.data.appr != null){
      resultAppr.value = response.data.appr
      totalCount.value += resultAppr.value.totalCount;
    }

    if(response.data.board != null){
      resultBoard.value = response.data.board
      totalCount.value += resultBoard.value.totalCount;
    }
  } catch (error) {

    let errorMessage = '';
    for(var i in error.response.data)
      errorMessage += error.response.data[i] + '\n\n'

    alert(errorMessage);
    console.error('검색 실패:', errorMessage);
  } finally {
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
    searchParams.selectedScopes = ['ALL'];

  if(selectedValue !== 'ALL' && currentSelectedScopes.includes('ALL'))
    searchParams.selectedScopes = searchParams.selectedScopes.filter(item => item !== 'ALL');

  if(!currentSelectedScopes.includes('ALL') && currentSelectedScopes.length == 3)
    searchParams.selectedScopes = ['ALL'];

  console.log('changeScopes function end...')
}

watch(
    () => searchParams.selectedScopes, (newValues, oldValues) => {
      console.log(`old value: ${oldValues}   new value: ${newValues}`)
    }
);

const resetSearch = () => {
  searchParams.query = '';
  searchParams.collection = 'ALL';
  searchParams.reChk = false;
  searchParams.dept = "";
  searchParams.userNm = '';
  selectedPeriod.value = 'ALL'
  searchParams.selectedScopes.value = ['ALL']
};

const toggleAdvancedSearch = () => {
  showAdvanceSearchArea.value = !showAdvanceSearchArea.value;
};
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
</style>
