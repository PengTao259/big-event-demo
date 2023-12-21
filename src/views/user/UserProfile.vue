<script setup>
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { userUpdateInfoService } from '@/api/user'

const formRef = ref(null)
const {
  user: { email, id, username, nickname },
  getUser
} = useUserStore()
const form = ref({
  id,
  email,
  username,
  nickname
})

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称必须是2-10位的非空字符串', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
}

const onSubmit = async () => {
  // 提交表单更新用户信息
  await formRef.value.validate()
  await userUpdateInfoService(form.value)
  // 更新用户信息
  await getUser()
  // 更新成功提示
  ElMessage.success('更新成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="登录名称">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
