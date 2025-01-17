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
          <option value="RANK/DESC">정확도순</option>
          <option value="DATE/DESC">최신순</option>
          <option value="DATE/ASC">오래된순</option>
        </select>

        <!-- Result count selection -->
        <select v-model="resultCount" @change="changeResultCount">
          <option value="10">10개</option>
          <option value="20">20개</option>
        </select>
      </div>
    </div>

    <!-- Board items -->
    <div v-for="(item, index) in results" :key="index" class="board_cont_box">
      <div class="tit_box">
        <a class="tit" v-html="highlightKeyword(item.title)"></a>
      </div>
      <span class="date">{{ item.postDate }}</span>
      <div class="cont" v-html="sanitizeContent(item.contents)"></div>
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

// Props 정의
const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
  activateMore: Boolean
});

const totalViewCount = ref(3);
// 데이터 초기화
const collection = ref('board');
const collectionName = ref('게시판');
const totalCount = ref(0);
const sortOption = ref('RANK/DESC');
const resultCount = ref(10);
const results = ref([]);
const pageLinks = reactive([]);

// Prop 변화 감지 및 데이터 업데이트
onMounted(() => {
  updateData(props.result);
});

watch(
    () => props.result,(newResult) => {
      updateData(newResult);
    },
    { deep: true }
);

// 데이터 업데이트 함수
const updateData = (data) => {
  results.value = data.result || [];
  collectionName.value = data.collection || '게시판';
  totalCount.value = data.totalCount || 0;
  pageLinks.splice(0, pageLinks.length, ...(data.pageLinks || []));
};

// 키워드 하이라이트
const highlightKeyword = (text) => {
  if (!text) return '';
  return text.replace(/(keyword)/gi, '<font color="red">$1</font>');
};

// 컨텐츠 정리
const sanitizeContent = (contents) => {
  if (!contents) return '';
  return contents.replace(/[|]+/g, '').trim();
};

// 이벤트 핸들러
const loadMore = () => {
  console.log('Load more triggered');
};

const doSorting = () => {
  console.log('Sorting option changed:', sortOption.value);
};

const changeResultCount = () => {
  console.log('Result count changed:', resultCount.value);
};

const changePage = (page) => {
  console.log('Page changed to:', page);
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
