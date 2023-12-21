<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from '../article/components/ChannelSelect.vue'
import ArticleEdit from '../article/components/ArticleEdit.vue'
import { artGetArticlesService, artDelService } from '@/api/article'
import { forMatDate } from '@/utils/format.js'

// 定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
// 数据
const articleList = ref([])
const total = ref(0)
const isLoading = ref(false)

const getArticleList = async () => {
  isLoading.value = true
  const res = await artGetArticlesService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  isLoading.value = false
}
getArticleList()

// 处理分页逻辑
const handleSizeChange = (val) => {
  console.log(val, '当前每页条数')
  params.value.pagenum = 1
  params.value.pagesize = val
  getArticleList()
}
// 页码变化
const handleCurrentChange = (val) => {
  console.log(val, '当前页码')
  params.value.pagenum = val
  getArticleList()
}

// 搜索功能
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

// 重置功能
const onReset = () => {
  params.value.pagenum = 1
  params.value = {
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  }
  getArticleList()
}

const drawer = ref(null)

// 添加文章
const onAddArticle = () => {
  drawer.value.openDrawer({})
}

//  编辑文章
const onEditArticle = (row) => {
  drawer.value.openDrawer(row)
}
// 删除文章
const onDeleteArticle = async (row) => {
  // 添加提示
  await ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 用户点击了确认按钮，你可以在这里删除数据
      const res = await artDelService(row.id)
      ElMessage.success(res.message ? `${res.message}` : '删除成功')
      getArticleList()
    })
    .catch(() => {
      // 用户点击了取消按钮，你可以在这里处理取消操作
      // 由于我们已经捕获了这个被拒绝的 Promise，所以浏览器不会显示警告
    })
}
</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary"> 添加文章 </el-button>
    </template>
    <!-- 主体部分是表格 + 分页 -->
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- vue3的v-model是:modelValue和:@update:modelValue的简写 -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="isLoading" :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ forMatDate(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉组件 -->
    <article-edit ref="drawer"></article-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
