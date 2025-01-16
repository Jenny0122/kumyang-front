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
                v-model="searchParams.query"
                id="query"
                type="text"
                autocomplete="off"
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
                  v-model="searchParams.reChk"
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
                    @change="onSearchConditionChange(index)"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
              <input
                  type="text"
                  class="inp_txt"
                  v-model="search.keyword"
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
                  v-model="searchParams.dept"
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
                <!-- 두 개의 라디오 그룹을 하나의 selectedPeriod로 바인딩 -->
                <b-form-radio-group v-model="selectedPeriod"
                                    :options="periods"
                                    class="mb-3"
                                    value-field="value"
                                    text-field="label">
                </b-form-radio-group>
              </div>
              <div class="terms_area">
                <b-form-radio-group v-model="selectedPeriod"
                                    :options="direct"
                                    class="3"
                                    value-field="value"
                                    text-field="label">
                </b-form-radio-group>
              </div>
            <div class="terms_area" v-if="selectedPeriod === 'direct'">
            <span class="inp_area calendar">
              <div class="inp_calendar">
              <input
                  name="startDate"
                  v-model="startDate"
                  class="inp_txt"
                  type="date"
              />
            </div>
            <div class="inp_calendar">
              <input
                  name="endDate"
                  v-model="endDate"
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
                    v-model="selectedScopes"
                    :options="searchScopes"
                    class="mb-3"
                    value-field="value"
                    text-field="label"
                ></b-form-checkbox-group>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="layer_bottom">
            <button type="button" class="btn blue" @click="resetSearch">초기화</button>
<!--            <button type="button" class="btn gray" @click="applySearch">적용</button>-->
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="totalCount > 0">
          <p class="result_txt">
            <span class="point">‘{{ searchParams.query }}’</span>에 대한 검색결과는
            <span class="point">총 {{ totalCount }} 건</span> 입니다.
          </p>
          <ul>
            <li v-for="item in searchResults" :key="item.DOCID">
              <strong>{{ item.TITLE }}</strong>
              <p>{{ item.CONTENTS }}</p>
              <span>{{ item.DATE }}</span>
            </li>
          </ul>
        </div>
        <!-- 검색 결과가 없고, 검색이 실행된 경우 -->
        <div v-if="totalCount == 0">
          <div class="no_result">
            <p>입력하신 검색어와 일치하는 정보를 찾지 못했습니다.</p>
          </div>
        </div>
        <b-card no-body>
          <b-tabs active-nav-item-class="font-weight-bold text-light bg-success"
                  content-class="mt-3 text-dark" fill>
            <b-tab title="전체"><SearchResult :result="searchResults"/></b-tab>
            <b-tab title="게시판" v-show=""><SearchResult :result="searchResults"/></b-tab>
            <b-tab title="전자결재"><SearchResult :result="searchResults"/></b-tab>
          </b-tabs>
        </b-card>

      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from 'vue';
import SearchResult from '../components/SearchResult.vue';
import axios from 'axios';

const searchParams = reactive({
  query: "",
  collection: "ALL",
  modifyFrom: "",
  modifyTo: "",
  sortField: "DATE",
  sortDirection: "DESC",
  pageStart: 0,
  count: 10,
  reChk: false,
  dept: "",
  userNm: "",
  title: false,
  content: false,
  file: false,
});

const showAdvanceSearchArea = ref(false);
const totalCount = ref(0);
const searchResults = ref([]);
const searchExecuted = ref(false);
const selectedPeriod = ref('ALL');
const selectedScopes = ref(['ALL']);

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
  searchExecuted.value = false;
  totalCount.value = 0;
  try {
    console.log(selectedPeriods.value)
    const response = await axios.post('/search', searchParams);
    searchResults.value = response.data.board;
    totalCount.value = response.data.totalCount;
  } catch (error) {
    console.log(error.response.data)
    console.error('검색 실패:', error);
  }
};



const resetSearch = () => {
  searchParams.query = '';
  searchParams.collection = 'ALL';
  searchParams.reChk = false;
  searchParams.dept = "";
  searchParams.userNm = '';
  searchExecuted.value = false;
  selectedPeriod.value = 'ALL'
  selectedScopes.value = ['ALL']
};

const toggleAdvancedSearch = () => {
  showAdvanceSearchArea.value = !showAdvanceSearchArea.value;
};
</script>

<style scoped>
.wrapper {
  padding: 20px;
}

</style>
