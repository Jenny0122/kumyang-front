<template>
  <div class="wrapper">
    <!-- Hidden Inputs -->
    <div v-for="(value, key) in searchParams" :key="key">
      <input type="hidden" :name="key" :value="value"/>
    </div>

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
        <div v-if = "showAdvanceSearchArea" class="layer_pop">
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
                  v-model="department"
                  placeholder="부서를 입력하세요"
              />
            </div>
            <strong class="inp_tit" style="margin-top: 26px;">작성자</strong>
            <div class="cont_btn_group">
              <input
                  type="text"
                  class="inp_txt"
                  v-model="writer"
                  placeholder="작성자를 입력하세요"
              />
            </div>
          </div>

          <!-- 검색기간 -->
          <div class="inp_txt_box">
            <strong class="inp_tit">검색기간</strong>
            <div class="cont_btn_group terms">
              <div class="terms_area">
                <label v-for="(period, index) in periods" :key="index">
                  <input
                      type="radio"
                      class="inp_radio"
                      name="terms1"
                      :value="period.value"
                      v-model="selectedPeriod"
                  />
                  {{ period.label }}
                </label>
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
            ~
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
                <label v-for="(scope, index) in searchScopes" :key="index">
                  <input
                      type="checkbox"
                      class="inp_chk"
                      :value="scope.value"
                      v-model="selectedScopes"
                  />
                  {{ scope.label }}
                </label>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="layer_bottom">
            <button type="button" class="btn blue" @click="resetSearch">초기화</button>
            <button type="button" class="btn gray" @click="applySearch">적용</button>
          </div>
        </div>


        <!-- Search Results -->
        <div v-if="totalCount > 0">
          <p class="result_txt">
            <span class="point">‘{{ searchParams.query }}’</span>에 대한 검색결과는
            <span class="point">총 {{ totalCount }} 건</span> 입니다.
          </p>
        </div>
        <div v-else>
          <div class="no_result">
            <p>입력하신 검색어와 일치하는 정보를 찾지 못했습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, reactive} from "vue";

export default {
  name: "SearchPage",
  setup() {
    let showAdvanceSearchArea = ref(false);
    // Reactive state for search parameters
    const searchParams = reactive({
      startCount: 0,
      sort: "",
      collection: "ALL",
      range: "",
      startDate: "",
      endDate: "",
      searchField: "",
      reChk: false,
      query: "",
      writer: "",
      dept: "",
    });

    const totalCount = ref(0); // Example total count from API

    const submitSearch = () => {
      console.log("Submitting search with parameters:", searchParams);
      // Call your API with searchParams
    };

    const search = () => {
      console.log("Search triggered");
    };

    const toggleAdvancedSearch = () => {
      console.log("Toggle Advanced Search");
      this.showAdvanceSearchArea != this.showAdvanceSearchArea
      console.debug(this.showAdvanceSearchArea)
      return this.showAdvanceSearchArea
    };

    return {
      showAdvanceSearchArea,
      searchParams,
      totalCount,
      submitSearch,
      search,
      toggleAdvancedSearch,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
