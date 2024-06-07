<template>
  <div class="header_top">
    <NavBar :title="'AI'" @click-left="onClickLeft">
      <template #title>
        <span class="header">AI机器人助手</span>
      </template>
      <template #left>
        <Icon name="arrow-left" class="left_icon" size="16" />
      </template>
    </NavBar>
  </div>
</template>

<script setup name="headerTop">
import { NavBar, Icon } from '@haloe/mobile'

const onClickLeft = () => history.back();

</script>

<style lang="scss" scoped>
.header_top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  // z-index: 100;

  .van-nav-bar {
    height: 55px;
    // line-height: 36px;
    background:#eaf2ff ;
  }

  .header {
    font-family: 'PingFang SC';
    padding: 15px 10px 10px;
    font-size: 18px;
    text-align: center;
    font-weight: 700;
    color: #333;
  }

  .left_icon {
    color: #646464 !important;
  }

  .van-nav-bar__title {
    font-size: 16px;
    color: #323232;
  }

  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
}
</style>