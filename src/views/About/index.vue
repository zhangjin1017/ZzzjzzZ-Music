<template>
  <div class="About">
    <div class="content">
      <LogoBox :size="100" />
      <h1>{{ title }}</h1>
      <p>
        {{
          title
        }}是一款在线音乐播放器，提供歌曲搜索、免费歌曲在线试听、MV播放等功能。
      </p>
      <p>
        <a
          class="url"
          v-for="(item, index) in aboutUrls"
          :key="index"
          :href="item.value"
          target="_blank"
          >{{ item.text }}</a
        >
      </p>
    </div>
    <p class="tips1">
      版权说明：本站所有歌曲均来自互联网，仅供学习交流使用，版权归原作者所有，如有侵权请联系删除。
    </p>
    <p class="tips">作者：ZzzjzzZ</p>
    <button @click="playVoice">播放语音</button>
  </div>
</template>

<script>
const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();
import { title, aboutUrls } from "@/config";
import LogoBox from "@/components/Layout/LogoBox";

export default {
  name: "About",
  components: {
    LogoBox,
  },
  data() {
    return {
      title,
      aboutUrls,
    };
  },
  methods: {
    playVoice() {
      this.handleSpeak("小朋友，你是否有很多问号"); // 传入需要播放的文字
    },
    // 语音播报的函数
    handleSpeak(text) {
      msg.text = text; // 文字内容: 小朋友，你是否有很多问号
      msg.lang = "zh-CN"; // 使用的语言:中文
      msg.volume = 1; // 声音音量：1
      msg.rate = 1; // 语速：1
      msg.pitch = 1; // 音高：1
      synth.speak(msg); // 播放
    },
    // 语音停止
    handleStop(e) {
      msg.text = e;
      msg.lang = "zh-CN";
      synth.cancel(msg);
    },
  },
};
</script>

<style scoped lang="scss">
.About {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 35%;
    text-align: center;
    h1 {
      margin: 10px 0;
    }
    .url {
      margin-right: 5px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .tips {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 0.8rem;
    color: #999;
    text-align: center;
  }
  .tips1 {
    position: absolute;
    bottom: 20px;
    width: 100%;
    font-size: 0.8rem;
    color: #999;
    text-align: center;
  }
}
</style>
