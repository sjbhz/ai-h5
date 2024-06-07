import http from "@/libs/http.request";
export default class Nacos {
  static getPlatConfig(
    data = {
      tenant: "xxxxx",
      dataId: "platform.json",
      group: "DEFAULT_GROUP",
    }
  ) {
    return new Promise((resolve, reject) => {
      let { tenant, dataId, group } = data;
      http
        .get(`/attest/api/center/configInfos`, { tenant, dataId, group })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * 验证用户信息
   */
  static getUserInfo(token) {
    return new Promise((resolve, reject) => {
      http
        .get(`/attest/api/order/getUserInfo?token=${token}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
