<template>
  <div class="main-wrapper">

    <div class="header">AI机器人助手</div>
    <div class="image_Q" @click="click_Q">
      <!-- <img src="@/assets/images/image5.jpg" class="img_Q"> -->
    </div>

    <div class="main">
      <div class="box" id="box">
        <div id="content" class="content" :style="contentHeightAll">
          <div v-for="(item, index) in info" :key="index">
            <!-- 左侧 -->
            <div class="info_r info_default" v-if="item.type == 'leftinfo'">
              <div class="con_r con_text">
                <div class="chat-bubble transform" v-if="showTyping && index === info.length - 1">
                  <div v-html="item.content"></div>
                </div>
                <div class="chat-bubble" v-else>
                  <div v-html="item.content"> </div>
                </div>

                <div v-for="(item2, index) in item.question" :key="index">
                  <div class="con_que" @click="clickRobotFirst(item2.content, item2.index)">
                    <div class="czkj-question-msg">
                      {{ item2.index }}
                      {{ item2.content }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 右侧 -->
            <div class="info_l" v-if="item.type == 'rightinfo'">
              <div class="con_r con_text">
                <span class="con_l" v-html="item.content"></span>
              </div>
            </div>
            <!-- 中间分割线提示 -->
            <div class="info_l" v-if="item.type == 'middleinfo'">
              <van-divider style="font-size:12px">{{ item.content }}</van-divider>
            </div>
          </div>
        </div>
        <div class="footer-bottom" ref="footerB" id="footerB">
          <van-cell-group inset class="group-wrapper">
            <van-field border size="small" v-model="customerText" label="" type="textarea" rows="1" autosize
              placeholder="请输入您的问题">
              <template #label>
              </template>
              <template #left-icon>
                <van-icon name="replay" class="img_refresh" @click="refreshTalk" />
              </template>
              <template #button>
                <img src="@/assets/images/send.png" class="img_send" @click="sendMsgFirst">
              </template>
            </van-field>
          </van-cell-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/libs/util'
import HeaderTop from '@/components/headerTop/Index.vue'
import { defineComponent, ref, reactive } from 'vue'
// import { CellGroup, Field } from '@haloe/mobile'
import { CellGroup, Field, Button, showToast } from 'vant';
import Request from "@/libs/http.request.js";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import fetchStream from './fetchStream'
import 'vant/es/toast/style'
// import 'vant/es/toast/style/index'

export default defineComponent({
  name: "homePage",
  components: { HeaderTop },

  data() {
    return {
      sendLock: false,
      VFieldHeight: '60px',
      contentHeightAll: {
        // border: '1px solid red',
        // height: 'calc(100vh - 60px)'
      },
      checked: true,
      info: [
        {
          type: "leftinfo",
          name: "robot",
          content:
            "您好，欢迎使用xxx，为保证信息安全，请勿在会话过程中透露账号密码等敏感信息",
          question: []
        },

      ],
      middleInfo: {
        type: "middleinfo",
        content: "我们来聊点新的内容吧"
      },
      robotQuestion: [
        {
          content: "问题1问题1问题1问题1问题1",
          index: 1
        },
        {
          content: "问题2问题2问题2问题2问题2问题2",
          index: 2
        },
        {
          content: "问题3问题3问题3问题3问题3？",
          index: 3
        },
        {
          content: "问题4问题4问题4问题4问题4问题4问题4",
          index: 4
        },
        {
          content: "问题5问题5问题5问题5问题5问题5问题5？",
          index: 5
        }
      ],
      showTyping: false,
      customerText: "",
      stream: true,
      token: '', //云空间的token
      user_id: '',
      user_token: '', //后端生成的token
      errmessage: null,
    }
  },
  watch: {
    customerText: {
      handler(val, oldVal) {
        console.log('val----', val, oldVal)
        this.VFieldHeight = this.$refs.footerB.clientHeight
        console.log(' this.VFieldHeight---', this.VFieldHeight)
        // this.contentHeightAll.height = 'calc(100% + 57px - ' + this.VFieldHeight + 'px )'
      },
    },
    VFieldHeight: {
      handler(val, oldVal) {
        console.log('val----VFieldHeight', val)

      },
    }
  },
  created() {
    if (window.location.href) {
      if (window.location.href.split('?token=').length > 1) {
        this.token = window.location.href.split('?token=')[1]
      }
    }
    // this.token = localStorage.getItem('_token')
    this.handleCheckToken()
    let answerText = "您可能想问：";
    let obj = {
      type: "leftinfo",
      name: "robot",
      content: answerText,
      question: this.robotQuestion
    };
    this.info.push(obj);

  },
  mounted() {
    this.VFieldHeight = this.$refs.footerB.clientHeight;
  },
  destroyed() { },
  methods: {
    // token鉴权
    handleCheckToken() {
      let data = { token: this.token }
      Request.post(`/robotweb/cs/auth`, data).then(res => {
        if (res.code == 20000) {
          this.user_id = res.data && res.data.user_id
          this.user_token = res.data && res.data.token

          setToken(this.user_token)
        } else {
          if (res.message && typeof res.message == 'string') {
            showToast({
              message: res.message,
              position: 'bottom',
            });

            // 本地联调测试用
            if (window.location.href.includes('localhost')) {
              // 此处可用utp平台的token
              this.user_token = 'xxxx'
              setToken(this.user_token)
            }

            return;
          } else {
            showToast({
              message: '用户所在企业未订阅或超时, 请重新访问',
              position: 'bottom',
            });
          }
        }
      })
    },
    //页面位置定位到最底部
    setLastScrollHeight() {
      this.$nextTick(() => {
        var contentHeight = document.getElementById("content");
        contentHeight.scrollTop = contentHeight.scrollHeight;
      });
    },
    // 右边的问题push进去
    appendRightInfo(content) {
      // 处理xss
      let text = content.trim().replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("&lt;br/&gt;", "<br />")
      let obj_r = {
        type: "rightinfo",
        content: text,
        // question: []
      };
      this.info.push(obj_r);
      this.setLastScrollHeight();
    },
    // 点击快捷问题
    clickRobotFirst(val, index) {
      // this.getMode(val).then(response => {

      // ============================mock 
      let response = {
        code: 20000,
        data: {
          mode: 1
        }
      }
      // =============================mock

      if (response && response.code == 20000) {
        if (response.data) {
          if (this.sendLock) return; // 锁住时忽略 
          this.appendRightInfo(val)
          let mode = response.data.mode //根据问题获取mode
          if (mode == 1) { //文本流式 
            this.appendRobotMsg(val);
            this.sendLock = true;
          } else if (mode == 2) { //图文JSON 
            this.appendRobotMsgJSON(val);
          }
        }
      } else {
        showToast({
          message: response.message,
          position: 'bottom',
        });
      }
      // })
    },

    // (文本流式)发送
    sendMsg() {
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>');
      if (text != "") {
        this.appendRightInfo(text)
        this.appendRobotMsg(this.customerText);
        this.customerText = "";
        this.sendLock = true // 发送信息之后开启锁
      }

    },
    // （文本流式）机器人回答消息
    appendRobotMsg(text) {
      text = text.trim();
      if (this.stream) {
        // sse
        this.getHistroyListStream(text);
      }
    },
    // sse
    handleStreamSse(res) {
      // let result = JSON.parase(res.data);
      console.log('resres=======1111', typeof res, res)
      let result = this.setParase(res);
      this.$nextTick(() => {
        console.log('result===', typeof result, result)
        if (!result || result.code != 20000) {
          this.showTyping = false;
          this.sendLock = false;
          this.errmessage = result
          let jsonResult = JSON.parse(result)
          if (jsonResult.code == 20001) {
            showToast({
              message: jsonResult.message,
              position: 'bottom',
            });
            return;
          }
          showToast({
            message: '操作太频繁了，请等一下',
            position: 'bottom',
          });
          return;
        }

        if (result.data.answer) {
          console.log("answer---", result.data.answer);
          this.answerPage = this.answerPage + result.data.answer;
          let obj_r = {
            type: "leftinfo",
            name: "robot",
            content: this.answerPage,
            question: []
          };

          this.info.pop(); //删除最后一个obj_r_0，重新添加满值
          this.info.push(obj_r);

          this.setLastScrollHeight();
        }

        if (result.data.end) {
          this.showTyping = false;
          this.sendLock = false;
        }
      })
    },
    /**
     * 将服务端格返回字符串尝试格式化为json
     * @param {String} str
     * @returns
     */
    setParase(str) {
      if (typeof str != 'string') {
        return str;
      }
      try {
        return JSON.parse(str.substring(6));
      } catch (error) {
        return str;
      }
    },

    // 获取机器人答复 // sse  
    async getHistroyListStream(input) {
      let _this = this;
      let dataInput = {
        query: input,
        project_name: "cs-app",
        stream: this.stream, //响应输出是否为流式
        user_id: this.user_id
      };
      // 这个接口单独处理
      let urlDev = '/robotweb/chat/qa_chat'
      let urlProd = '/qrobot/robotwebchat/chat/qa_chat'
      let url = import.meta.env.VITE_NODE_ENV == 'development' ? urlDev : urlProd

      // 空值填入
      this.answerPage = "";
      let obj_r_0 = {
        type: "leftinfo",
        name: "robot",
        content: " ",
        question: []
      };
      this.info.push(obj_r_0);
      //使光标闪烁
      this.showTyping = true;

      await fetchStream(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/event-stream",
          "token": this.user_token
        },
        body: JSON.stringify(dataInput),
        async onmessage(event) {
          _this.handleStreamSse(event);
        },
        async onerror(event) {
          showToast({
            message: '用户所在企业未订阅或超时, 请退出重新访问',
            position: 'bottom',
          });
          return;
        }
      });
    },
    refreshTalk() {
      if (this.sendLock) return; //正在回答问题时，不能刷新不然会多次渲染
      let data = {
        user_id: this.user_id,
        project_name: "cs-app",
      };
      Request.post(`/robotweb/knowledge_base/clear_historys`, data).then(res => {
        if (res.code == 20000) {
          showToast({
            message: res.message,
            position: 'bottom',
          });
          console.log(this.info)

          this.$nextTick(() => {
            // 初始化不Push、避免重复push
            if (this.info.length > 2 && this.info[this.info.length - 1].type != 'middleinfo') {
              this.info.push(this.middleInfo);
              this.setLastScrollHeight();
            }
          })

        } else {
          showToast({
            message: res.message,
            position: 'bottom',
          });
        }
      })
    },
    // 点击小图标
    click_Q() {
      console.log('cccc')
    },
    ToBreak(val) {
      val = val && val.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;").replaceAll("\n", "<br />");
      return val
    },
    // （json格式）AI回复
    sendMsgJSON() {
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>');
      if (text != "") {
        this.appendRightInfo(text)
        this.appendRobotMsgJSON(this.customerText);
        this.customerText = "";
      }

    },
    // 2个数组交叉合并为新数组
    aryJoinAry(ary1, ary2) {
      let itemAry = [];
      let minLength;
      if (ary1.length > ary2.length) {
        minLength = ary2.length;
      } else {
        minLength = ary1.length;
      }
      //将两个数组中较长的数组记录下来
      let longAry = arguments[0].length > arguments[1].length ? arguments[0] : arguments[1];
      //循环范围为较短的那个数组的长度
      for (let i = 0; i < minLength; i++) {
        //将数组放入临时数组中
        itemAry.push(this.ToBreak(ary1[i]));
        itemAry.push("<img width=93% src=" + ary2[i] + "/>" + "<br />")
      }
      let leftContent = longAry.slice(minLength)
      let leftContentNew = []
      for (let j = 0; j < leftContent.length; j++) {
        leftContentNew.push(this.ToBreak(leftContent[j])); //剩下的内容也需要对特殊字符处理
      }
      return itemAry.concat(leftContentNew);//itemAry和多余的新数组拼接起来并返回。
    },

    // （json格式）机器人直接回复消息
    appendRobotMsgJSON(text) {
      text = text.trim();
      let data = {
        query: text,
        project_name: "cs-app",
        user_id: this.user_id
      };

      // Request.post(`/robotweb/chat/qa_ops_chat`, data).then(result => {
      // ====================mock,后端约定：图片在行文本中交替穿插
      let result = {
        code: 20000,
        data: {
          answers: ["\n1、通过物理机找到虚机，consloe到虚机上，查看虚机的内存，cpu，和磁盘大小\n",
            "\n",
            "\n2、在物理机上查看查看kvm虚机的磁盘目录  \nvirsh domblklist wxjd-psc-p9f2-tpod2-vm-os01-k8sv16-node-102\n"
          ],
          image_paths: ["http://127.0.0.1/images_robot/ops/ops_18-1.png", "http://127.0.0.1/images_robot/ops/ops_18-2.png"]
        },
      }

      // ====================mock

      if (result && result.code == 20000) {
        if (!result.data) return
        this.answerPage = ""; //文本和图片交叉展示
        let answertemp = result.data.answers  // 文本
        let imagepathstemp = result.data.image_paths // 图片
        if (!answertemp) answertemp = []
        if (!imagepathstemp) imagepathstemp = []
        let totaltemp = this.aryJoinAry(answertemp, imagepathstemp) //合并为新的
        console.log('totaltemp--', totaltemp)
        totaltemp.forEach(item => { this.answerPage = this.answerPage + item })
        let obj_r = {
          type: "leftinfo",
          name: "robot",
          content: this.answerPage,
          question: []
        };

        this.info.push(obj_r);
        this.setLastScrollHeight();

      } else {
        showToast({
          message: result.message,
          position: 'bottom',
        });
      }
      // });

    },
    // 后端确认回复方式
    getMode(input) {
      if (input) {
        let data = {
          query: input,
          project_name: "cs-app",
        };
        return Request.post(`/robotweb/knowledge_base/get_mode`, data)
      }
    },
    // 点击发送后先判断回复模式
    sendMsgFirst() {
      console.log('this.customerText---', this.customerText)
      if (this.sendLock) return
      let text = this.customerText.trim().replace(/\n/g, '<br/>');
      if (text == "") return
      // this.getMode(text).then(response => {

      // ============================mock 
      let response = {
        code: 20000,
        data: {
          mode: 2
        }
      }
      // =============================mock

      if (response && response.code == 20000) {
        if (response.data) {
          let mode = response.data.mode //根据问题获取mode
          if (mode == 1) { //文本流式
            this.sendMsg()
          } else if (mode == 2) { //图文JSON
            this.sendMsgJSON()
          }
        }
      } else {
        showToast({
          message: response.message,
          position: 'bottom',
        });
      }
      // })
    },
  }
})
</script>
<style scoped lang="scss">
.main-wrapper {
  font-family: 'PingFang SC';

  display: flex;
  height: 100vh;
  flex-direction: column;
  background: #eaf2ff;

  // header 
  .header {
    padding: 15px 10px 10px;
    font-size: 17px;
    // line-height: 30px;
    line-height: 0.8rem;
    text-align: center;
    font-weight: 500;
    color: #333;
  }



  .image_Q {
    z-index: 111;
    position: fixed;
    right: 0px;
    top: 0px;

    .img_Q {
      width: 2.4rem;

    }
  }

  // 内容区
  .main {
    flex: auto;
    background-color: #fff;
    border-radius: 0.7rem 0.7rem 0 0;
    // overflow-y: scroll;
    // height: calc(100vh - 0.8rem);
    // width: 100%; 

    .box {
      // overflow-y: auto;
      // border: 1px solid blue;
      height: calc(100vh - 60px);
      position: relative;

      #content {
        // border:1px solid red;
        height: calc(100vh - 120px);
        overflow-y: scroll;
        font-size: 14px;

        .con_left {
          ::after {
            content: "|";
            animation: blink 1s infinite;
            overflow: hidden;
          }

          @keyframes blink {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }
        }

        .con_text {
          color: #333;
          margin-top: 4px;
          margin-bottom: 2px;
          display: inline-block;
        }

        .con_que {
          color: #1c88ff;
          height: 29px;
          line-height: 29px;
          cursor: pointer;
        }

        .info_r {
          position: relative;

          .con_r {
            display: inline-block;
            background: #f6f7f7;
            border-radius: 0.4rem;
            padding: 10px;
            margin: 8px 12px;

            /* 最大宽度限定内容输入到百分61换行 */
            max-width: 91%;
            /* 忽略多余的空白，只保留一个空白 */
            white-space: normal;
            /* 换行显示全部字符 */
            word-break: break-all;

            .chat-bubble {
              border-radius: 10px;
              color: #333;
              display: inline-block;
              word-break: break-word;
            }

            .transform ::after {
              content: "|";
              animation: blink 1s infinite;
              overflow: hidden;
            }

            @keyframes blink {
              from {
                opacity: 0;
              }

              to {
                opacity: 1;
              }
            }
          }

        }

        .info_l {
          text-align: right;
          color: #ffffff;
          color: #3163c5;
          margin-top: 10px;

          .pic_l {
            width: 13px;
            height: 17px;
            margin: 8px 10px;
          }

          .con_l {
            display: inline-block;
            background-color: #4195ff;
            color: #fff;
            border-radius: 0.4rem;
            padding: 10px;
            text-align: left;
            margin: 0 12px;

            /* 最大宽度限定内容输入到百分61换行 */
            max-width: 91%;
            /* 忽略多余的空白，只保留一个空白 */
            white-space: normal;
            /* 换行显示全部字符 */
            word-break: break-all;
          }
        }

        #question {
          cursor: pointer;
        }
      }

      // 底部输入
      .footer-bottom {
        // border: 1px solid blue;
        width: 100%;
        // min-height:50px;
        position: fixed;
        bottom: 2px;

        .group-wrapper {
          height: 100%;
          padding: 1px;
          margin: 1px 0;
          border-radius: 0.4rem;
          vertical-align: middle;
          align-items: center;
          box-shadow:
            0 0 0 2px rgb(255, 255, 255),
            0.3em 0.3em 1em rgba(0, 0, 0, 0.3);

          :deep(.van-field) {
            padding: 0.2rem;
          }

          :deep(.van-field__left-icon) {
            position: relative;
            width: 1rem;
          }

          :deep(.van-field__label) {
            display: none;
          }

          :deep(.van-field__value) {
            margin: 0;
            margin-left: 2px;
            padding: 0
          }

          :deep(.van-field__body) {
            align-items: none;
            position: relative;
          }

          :deep(.van-field__button) {
            // border: 1px solid red;
            height: 38px;
            position: absolute;
            bottom: 0;
            right: 0;
          }

          :deep(.van-field__control) {
            width: calc(100% - 45px);
            padding: 8px 10px;
            border-radius: 0.8rem;
            background: #f6f7f7;
            max-height: 120px !important; // 设置最大高度 超出滚动
            overflow-y: auto;
          }

          .img_refresh {
            border: 1px solid #f6f7f7;
            height: 20px;
            font-size: 20px;
            background: #f6f7f7;
            border-radius: 50%;
            padding: 6px 8px 8px 8px;
            // 固定在底部
            position: absolute;
            bottom: 0
          }

          .img_send {
            height: 38px;
            padding: 1px;

          }

        }
      }
    }

  }

}
</style>
