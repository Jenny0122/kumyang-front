<template>
  <div class="board_box">
    <div class="board_tit_box">
      <strong class="tit">{{ collectionName }}</strong>
      <span class="num">({{ totalCount }}건)</span>

      <div v-if="activateMore && totalCount > totalViewCount">
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
        <a class="tit" v-html="item.title"></a>
      </div>
      <span class="date">{{ item.draftDate }}</span>
      <div class="cont" v-html="sanitizeContent(item.contents)"></div>
      <span class="cont">{{ item.dept }}</span>
      <div class="tit_info">
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

const totalViewCount = ref(3);
const collection = ref('appr');
const collectionName = ref('전자결재');
const totalCount = ref(0);
const sortOption = ref('RANK/DESC');
const resultCount = ref(10);
const results = ref([]);
// const results = ref(props.result);
const pageLinks = reactive([]);
const props = defineProps({
  result: {
    type: Object,  // Object 타입 지정
    required: true // 필수 prop
  },
  activateMore: Boolean
});

onMounted(() => {
    results.value = props.result;
});

watch(() => props.result, (newResult) => {
  results.value = newResult.result;
  collectionName.value = newResult.collection;
  totalCount.value = newResult.totalCount;
  console.log(results.value)
}, { deep: true });







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
  return text.replace(/(keword)/g, '<font color="red">$1</font>'); // 예시로 'keyword' 하이라이트
};

const sanitizeContent = (contents) => {
  return contents.replace(/[|]+/, "").trim(); // 내용에서 불필요한 부분 제거
};

const loadMore = () => {
};

const doSorting = () => {
};

const changeResultCount = () => {
};

const changePage = (page) => {
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
