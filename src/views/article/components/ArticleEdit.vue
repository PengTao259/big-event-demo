<script setup>
import ChannelSelect from './ChannelSelect.vue'
import { artGetArticleDetailService, artPublishService } from '@/api/article'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const visibleDrawer = ref(false)
const formModel = ref({ ...defaultForm })
const openDrawer = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 编辑文章
    const res = await artGetArticleDetailService(row.id)
    formModel.value = res.data.data
  } else {
    // 添加文章
    formModel.value = { ...defaultForm }
  }
}

const imageUrl = ref('')
const onSelectFile = (file) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formModel.value.cover_img = file.raw
}

// 提交文章
const onPublish = async (state) => {
  formModel.value.state = state
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    // 编辑文章
    fd.append('_method', 'put')
    fd.append('id', formModel.value.id)
  } else {
    // 添加文章
    const res = await artPublishService(fd)
    console.log(res, 'resresres')
  }
}

defineExpose({
  openDrawer
})
</script>

<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload class="avatar-uploader" :on-change="onSelectFile" :auto-upload="false" :show-file-list="false">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor v-model:content="formModel.content" contentType="html" theme="snow"></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
