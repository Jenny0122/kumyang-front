<template>
  <div class="search-page">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="대한산업안전협회" />
      </div>
    </header>

    <!-- Search Form -->
    <form @submit.prevent="handleSearch">
      <div class="search-form">
        <!-- 검색어 -->
        <div class="search-keywords">
          <div v-for="(condition, index) in conditions" :key="index" class="keyword-row">
            <select v-model="condition.operator" class="operator">
              <option value="AND">AND</option>
              <option value="OR">OR</option>
              <option value="NOT">NOT</option>
            </select>
            <input
                type="text"
                v-model="condition.keyword"
                class="keyword-input"
                placeholder="검색어를 입력하세요"
            />
          </div>
        </div>

        <!-- 검색 옵션 -->
        <div class="search-options">
          <div class="option-row">
            <label>부서</label>
            <input type="text" v-model="searchOptions.department" class="department-input" />
          </div>
          <div class="option-row">
            <label>작성자</label>
            <input type="text" v-model="searchOptions.writer" class="writer-input" />
          </div>
        </div>

        <!-- 검색 기간 -->
        <div class="search-period">
          <label>검색기간</label>
          <div>
            <input
                type="radio"
                id="all-time"
                value="전체"
                v-model="searchOptions.period"
            />
            <label for="all-time">전체</label>

            <input
                type="radio"
                id="one-day"
                value="1일"
                v-model="searchOptions.period"
            />
            <label for="one-day">1일</label>

            <input
                type="radio"
                id="one-week"
                value="1주일"
                v-model="searchOptions.period"
            />
            <label for="one-week">1주일</label>

            <input
                type="radio"
                id="one-month"
                value="1개월"
                v-model="searchOptions.period"
            />
            <label for="one-month">1개월</label>

            <input
                type="radio"
                id="one-year"
                value="1년"
                v-model="searchOptions.period"
            />
            <label for="one-year">1년</label>

            <input
                type="radio"
                id="custom-period"
                value="직접선택"
                v-model="searchOptions.period"
            />
            <label for="custom-period">직접선택</label>

            <div v-if="searchOptions.period === '직접선택'" class="date-picker">
              <input type="date" v-model="searchOptions.startDate" />
              <span>~</span>
              <input type="date" v-model="searchOptions.endDate" />
            </div>
          </div>
        </div>

        <!-- 검색 영역 -->
        <div class="search-scope">
          <label>검색영역</label>
          <div>
            <input type="checkbox" id="scope-all" v-model="searchOptions.scope" value="전체" />
            <label for="scope-all">전체</label>

            <input type="checkbox" id="scope-title" v-model="searchOptions.scope" value="제목" />
            <label for="scope-title">제목</label>

            <input type="checkbox" id="scope-content" v-model="searchOptions.scope" value="내용" />
            <label for="scope-content">내용</label>

            <input type="checkbox" id="scope-attachment" v-model="searchOptions.scope" value="첨부파일" />
            <label for="scope-attachment">첨부파일</label>
          </div>
        </div>

        <!-- Buttons -->
        <div class="buttons">
          <button type="button" @click="resetForm">초기화</button>
          <button type="submit">적용</button>
        </div>
      </div>
    </form>

    <!-- Search Results -->
    <div class="search-results">
      <p>
        ‘’에 대한 통합 검색결과는 총 <span>{{ totalResults }}</span> 건 입니다.
      </p>
      <div class="tabs">
        <button :class="{ active: activeTab === '전체' }" @click="activeTab = '전체'">전체</button>
        <button :class="{ active: activeTab === '전자결재' }" @click="activeTab = '전자결재'">
          전자결재 ({{ electronicApprovalCount }})
        </button>
        <button :class="{ active: activeTab === '게시판' }" @click="activeTab = '게시판'">게시판</button>
        <button :class="{ active: activeTab === '웹규정' }" @click="activeTab = '웹규정'">웹규정</button>
      </div>

      <div v-if="activeTab === '전자결재'" class="tab-content">
        <div v-for="item in electronicApprovalResults" :key="item.id" class="result-item">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p>{{ item.date }}</p>
        </div>
      </div>

      <!-- 다른 탭 내용도 유사하게 추가 -->
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  name: "SearchPage",
  setup() {
    const conditions = reactive([
      { operator: "AND", keyword: "" },
      { operator: "AND", keyword: "" },
      { operator: "AND", keyword: "" },
    ]);

    const searchOptions = reactive({
      department: "",
      writer: "",
      period: "전체",
      startDate: "",
      endDate: "",
      scope: [],
    });

    const totalResults = ref(1589);
    const activeTab = ref("전체");
    const electronicApprovalCount = ref(130);
    const electronicApprovalResults = ref([
      {
        id: 1,
        title: "결재 테스트",
        description: "New Document 대한산업안전협회의 수신자 내부결재...",
        date: "2024.05.17",
      },
      {
        id: 2,
        title: "협조테스트",
        description: "결재-협조테스트 학습지원금 신청서...",
        date: "2024.10.22",
      },
    ]);

    const handleSearch = () => {
      console.log("Search triggered with options:", conditions, searchOptions);
    };

    const resetForm = () => {
      conditions.forEach((c) => {
        c.keyword = "";
      });
      Object.assign(searchOptions, {
        department: "",
        writer: "",
        period: "전체",
        startDate: "",
        endDate: "",
        scope: [],
      });
    };

    return {
      conditions,
      searchOptions,
      totalResults,
      activeTab,
      electronicApprovalCount,
      electronicApprovalResults,
      handleSearch,
      resetForm,
    };
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  color: #333;
}

/* 헤더 스타일 */
.header {
  background-color: #fff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.header .logo img {
  height: 40px;
}

/* 검색 폼 */
.search-form {
  background-color: #e9f5e6;
  padding: 20px;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 800px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-keywords .keyword-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.operator,
.keyword-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.operator {
  background-color: #fff;
}

.keyword-input {
  flex: 1;
}

/* 검색 옵션 */
.search-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-period,
.search-scope {
  margin-bottom: 20px;
}

.date-picker input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 버튼 */
.buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.buttons button:first-of-type {
  background-color: #f5f5f5;
}

.buttons button:last-of-type {
  background-color: #4caf50;
  color: white;
}

/* 검색 결과 */
.search-results {
  margin: 20px auto;
  max-width: 800px;
}

.tabs button.active {
  background-color: #4caf50;
  color: white;
}
</style>


