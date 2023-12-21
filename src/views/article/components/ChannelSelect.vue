<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'

const channelList = ref([])
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}

getChannelList()
</script>
<template>
  <el-select :style="{ width }" :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
