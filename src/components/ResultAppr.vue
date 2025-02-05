<template>
  <div class="board_box">
    <div class="board_tit_box">
      <strong class="tit">전자결재</strong>
      <span class="num">({{ totalCount }}건)</span>

      <div v-if="showMore" class="board_select_box">
        <button class="btn_more" @click="loadMore">더보기</button>
      </div>

      <div v-if="!showMore" class="board_select_box">
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
    <!-- Appr items -->
    <div v-for="(item, index) in results" :key="index" class="board_cont_box">
      <div class="tit_box">
        <a class="tit" v-html="item.title" @click="openAppr(item.apprId, item.fldrOwnerId)"></a>
      </div>
      <span class="date">{{ item.draftDate }}</span>
      <div class="cont" v-html="item.contents"></div>
      <span class="cont">{{ item.dept }}</span>
      <div class="tit_info">
      </div>
    </div>

    <!-- Pagination -->
    <div v-show="showPageNav" class="page_navigation" id="pagenum">
      <!-- 이전 페이지 버튼 -->
      <button
          class="num"
          v-show="isShowPrevious(currentPage)"
          @click="goPrevious(currentPage)"
      >
        이전
      </button>

      <!-- 페이지 번호 -->
      <button
          @click="changePage(page)"
          class="num"
          :class="{ num_current: page === currentPage }"
          v-for="(page, index) in pageLinks.slice(Math.floor((currentPage - 1) / 5) * 5, Math.ceil((currentPage) / 5) * 5)"
          :key="index"
      >
        {{ page }}
      </button>

      <!-- 다음 페이지 버튼 -->
      <button
          class="num"
          v-show="isShowNext(currentPage)"
          @click="goNext(currentPage)"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, defineProps, defineEmits, computed } from 'vue';

const totalViewCount = import.meta.env.VITE_TOTAL_VIEW_COUNT;
const totalCount = ref(0);
const sortOption = ref('RANK/DESC');
const resultCount = ref(10);
const results = ref([]);
const pageLinks = reactive([]);
const currentPage = ref(1); // 현재 페이지
const totalPages = computed(() => Math.ceil(totalCount.value / resultCount.value)); // 전체 페이지 수
const props = defineProps({
  result: {
    type: Object,  // Object 타입 지정
    required: true // 필수 prop
  },
  showMore: Boolean,
  showPageNav: Boolean,
});

const emits = defineEmits(['activateTab', 'changeSortOption', 'changeResultCount', 'changePage']);

// onMounted(() => {
//     results.value = props.result;
// });

// watch(() => props.result, (newResult) => {
//   results.value = newResult.result;
//   totalCount.value = newResult.totalCount;
// }, { deep: true });

onMounted(() => {
  updateData(props.result);
});

watch(
    () => props.result,(newResult) => {
      if(!newResult) return;
      updateData(newResult);
      generatePageLinks(totalPages.value);
    }, { deep: true }
);


const updateData = (data) => {
  results.value = data.result || [];
  totalCount.value = data.totalCount || 0;
  pageLinks.splice(0, pageLinks.length, ...(data.pageLinks || []));
};

const sanitizeContent = (contents) => { return contents.replace(/[|]+/, "").trim(); };

// 더보기
const loadMore = () => { emits('activateTab', 1); };

// 정렬
const doSorting = () => { emits('changeSortOption', sortOption.value, 1, 'appr'); };

// 한 페이지당 검색 결과 수
const changeResultCount = () => { emits('changeResultCount', resultCount.value, 1); };

watch(
    () => totalPages.value,
    (newTotalPages) => {
      generatePageLinks(newTotalPages);
    }
);
const generatePageLinks = (total) => {
  pageLinks.splice(0, pageLinks.length); // 기존 링크 초기화
  for (let i = 1; i <= total; i++) {
    pageLinks.push(i);
  }
};
const changePage = (page) => {
  console.log(isShowNext(currentPage))
  if (page < 1 || page > totalPages.value) return; // 유효성 검사

  currentPage.value = page; // 현재 페이지 업데이트


  emits('changePage', page - 1, 1); // 부모로 이벤트 전송
};


const isShowPrevious = (currentPage) => { return Math.floor((currentPage - 1) / 5) * 5 > 1; }
const isShowNext = (currentPage) => { return Math.ceil((currentPage) / 5) * 5 + 1 < totalPages.value; }

const goPrevious = (currentPage) => { changePage(Math.floor((currentPage - 1) / 5) * 5) };
const goNext = (currentPage) => { changePage(Math.ceil((currentPage) / 5) * 5 + 1) };

const openAppr = (apprId, fldrOwnerId) => {

  const url = new URL("https://dgw.kyc.co.kr:9080");
  url.pathname += "bms/com/hs/gwweb/appr/retrieveDoccrdInqire.act";
  url.searchParams.append("APPRIDLIST", apprId);
  url.searchParams.append("APPRDEPTID", fldrOwnerId);
  url.searchParams.append("type", "sanc");

  var popWidth = 580;
  var popHeight = 330;
  var popupX = (window.screen.width / 2) - (popWidth / 2);
  var popupY = (window.screen.height / 2) - (popHeight / 2) - 100;

  const target = "openSanc";

  const specs = [
    "width=" + popWidth,
    "height=" + popHeight,
    "left=" + popupX,
    "top=" + popupY,
    "menubar=no",
    "toolbar=no",
    "location=no",
    "status=no"
  ].join(",");

  window.open(url, target, specs)

  // var hostname = "https://dgw.kyc.co.kr";
  // var popWidth = 580;
  // var popHeight = 330;
  // var popupX = (window.screen.width / 2) - (popWidth / 2);
  // var popupY = (window.screen.height / 2) - (popHeight / 2) - 100;
  // var _options = "menubar=no, toolbar=no, location=no, status=no";
  //
  // console.log("openAppr == " + hostname + "/bms/com/hs/gwweb/appr/retrieveDoccrdInqire.act?APPRIDLIST=" + apprId + "&APPRDEPTID=" + fldrOwnerId + "&type=sanc", "openSanc", "width=" + popWidth + ", height=" + popHeight + ", left=" + popupX + ", top=" + popupY + ", " + _options)
  //
  // window.open(hostname + "/bms/com/hs/gwweb/appr/retrieveDoccrdInqire.act?APPRIDLIST=" + apprId + "&APPRDEPTID=" + fldrOwnerId + "&type=sanc", "openSanc", "width=" + popWidth + ", height=" + popHeight + ", left=" + popupX + ", top=" + popupY + ", " + _options);
}

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

.page_navigation {
  margin-top: 20px;
  //width: 5px;
}

</style>
