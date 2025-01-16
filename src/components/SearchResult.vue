<template>
  <div class="board_box">
    <div class="board_tit_box">
      <strong class="tit">{{ collectionName }}</strong>
      <span class="num">({{ totalCount }}건)</span>

      <div v-if="collection === 'ALL' && totalCount > totalViewCount">
        <button @click="loadMore">더보기</button>
      </div>

      <div v-if="collection !== 'ALL'" class="board_select_box">
        <!-- Sorting options -->
        <select v-model="sortOption" @change="doSorting">
          <option value="RANK/DESC" selected>정확도순</option>
          <option value="DATE/DESC">최신순</option>
          <option value="DATE/ASC">오래된순</option>
        </select>

        <!-- Result count selection -->
        <select v-model="resultCount" @change="changeResultCount">
          <option value="10" selected>10개</option>
          <option value="20">20개</option>
        </select>
      </div>
    </div>

    <!-- Board items -->
    <div v-for="(item, index) in results" :key="index" class="board_cont_box">
      <div class="tit_box">
        <a :href="'javascript: openBbs(' + item.DOCID + ', K)'" class="tit">{{ highlightKeyword(item.TITLE) }}</a>
      </div>
      <span class="date">{{ item.DATE }}</span>
      <div class="cont">{{ sanitizeContent(item.CONTENTS) }}</div>
      <div class="tit_info">
        <span>{{ item.BRDFULLPATH }}</span>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="collection !== 'ALL' && totalCount > 10" class="page_btn_num" id="pagenum">
      <span v-for="(page, index) in pageLinks" :key="index">
        <a href="javascript:void(0);" @click="changePage(page)">{{ page }}</a>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps } from 'vue';



const collection = ref('board');
const collectionName = ref('');
const totalCount = ref(0);
const totalViewCount = ref(10); // 예시
const sortOption = ref('RANK/DESC');
const resultCount = ref(10);
const results = ref([]);
const pageLinks = reactive([]);
const props = defineProps({
  result: {
    type: Object,  // Object 타입 지정
    required: true // 필수 prop
  }
});


// `result` 값이 바뀔 때마다 반응적으로 데이터를 처리하기 위한 변수

onMounted(() => {
  if (props.result && props.result.length > 0) {
    collectionName.value = '검색 결과';
    results.value = props.result;
    console.log("result:",this.result);

  }
});

watch(() => props.result, (newResult) => {
  if (newResult && newResult.length > 0) {
    collectionName.value = '검색 결과';
    results.value = newResult;
  }
});
const fetchData = async () => {
  // API 호출로 데이터 받아오기
  // try {

  // }
    // 예시 API 호출
    // const response = await fetch(`/api/getData?collection=${collection.value}&sort=${sortOption.value}`);
    // const data = await response.json();

    // 더미 데이터 예시
  //   const data = {
  //     results: [],  // API 데이터로 대체
  //     totalCount: 50,
  //     collectionName: 'Example Collection',
  //     pageLinks: [1, 2, 3, 4, 5]
  //   };
  //
  //   results.splice(0, results.length, ...data.results);
  //   totalCount.value = data.totalCount;
  //   collectionName.value = data.collectionName;
  //   pageLinks.splice(0, pageLinks.length, ...data.pageLinks);
  // } catch (error) {
  //   console.error('Error fetching data:', error);
  // }
};

const highlightKeyword = (text) => {
  return text.replace(/(keyword)/g, '<font color="red">$1</font>'); // 예시로 'keyword' 하이라이트
};

const sanitizeContent = (content) => {
  return content.replace(/[|]+/, "").trim(); // 내용에서 불필요한 부분 제거
};

const loadMore = () => {
  // '더보기' 클릭 시 추가 데이터 로드
  fetchData();
};

const doSorting = () => {
  // Sorting 처리
  fetchData();
};

const changeResultCount = () => {
  // Result count 변경 시 처리
  fetchData();
};

const changePage = (page) => {
  // 페이지 변경 시 처리
  fetchData();
};

</script>

<style scoped>
.board_box {
  padding: 20px;
  border: 1px solid #ccc;
}

.board_tit_box {
  margin-bottom: 20px;
}

.tit {
  font-size: 1.5rem;
  font-weight: bold;
}

.num {
  font-size: 1rem;
}

.board_select_box {
  margin-top: 10px;
}

.board_cont_box {
  margin-top: 20px;
}

.page_btn_num {
  margin-top: 20px;
}

.page_btn_num a {
  margin-right: 10px;
}
</style>
