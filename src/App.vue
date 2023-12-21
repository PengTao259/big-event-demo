<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
// import en from 'element-plus/es/locale/lang/en.mjs'
</script>

<template>
  <!-- 国际化 -->
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>
</template>
