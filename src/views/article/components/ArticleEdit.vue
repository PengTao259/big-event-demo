<script setup>
import ChannelSelect from './ChannelSelect.vue'
import { artGetArticleDetailService, artPublishService, artUpdateService } from '@/api/article'
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { nextTick } from 'vue'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const editorRef = ref('')
const emit = defineEmits(['success'])
const visibleDrawer = ref(false)
const formModel = ref({ ...defaultForm })
const openDrawer = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 编辑文章
    const res = await artGetArticleDetailService(row.id)
    formModel.value = res.data.data
    // 图片回显
    imgUrl.value = baseURL + formModel.value.cover_img
    // 基于axios,将网络图片地址转换成file对象
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
  } else {
    // 添加文章
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    nextTick(() => {
      editorRef.value.setHTML('')
    })
  }
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

const imgUrl = ref('')
const onUploadFile = (file) => {
  imgUrl.value = URL.createObjectURL(file.raw)
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
    const res = await artUpdateService(fd)
    ElMessage.success(res.data.message ? res.data.message : '编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加文章
    const res = await artPublishService(fd)
    ElMessage.success(res.data.message ? res.data.message : '添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
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
        <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false" :on-change="onUploadFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor v-model:content="formModel.content" ref="editorRef" contentType="html" theme="snow"></quill-editor>
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
