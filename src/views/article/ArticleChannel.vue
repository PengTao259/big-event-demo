<script setup>
import { ref } from 'vue'
import { artGetChannelsService, artDelChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import PopupDialog from './components/PopupDialog.vue'

const channelList = ref([])
const isLoading = ref(false)
const popup = ref(null)

const getChannelList = async () => {
  isLoading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  isLoading.value = false
}
getChannelList()
const onEditChannel = (row) => {
  popup.value.open(row)
}
const onDelChannel = async (id) => {
  await ElMessageBox.confirm('你确认删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(async () => {
    await artDelChannelsService(id)
    ElMessage({ type: 'success', message: '删除成功' })
    getChannelList()
  })
}

const onAddChannel = () => {
  popup.value.open({})
}

const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel"> 添加分类 </el-button>
    </template>
    <el-table v-loading="isLoading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row.id)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <popup-dialog ref="popup" @success="onSuccess"></popup-dialog>
  </page-container>
</template>

<style lang="scss" scoped></style>
