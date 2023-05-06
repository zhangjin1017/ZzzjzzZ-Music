<template>
  <div class="personal-center">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto" max-width="344">
          <v-img
            height="300px"
            :src="
              $store.getters.userInfo.img
                ? 'http://www.zzzjzzz.top:81/prod-api' +
                  $store.getters.userInfo.img
                : defaultAvatar
            "
            @error="setDefaultAvatar"
          />
          <v-card-title>
            {{ $store.getters.userInfo.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ $store.getters.userInfo.email }}
          </v-card-subtitle>

          <v-card-text>
            {{ $store.getters.userInfo.introduction }}
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="green lighten-2"
              dark
              @click="modifyPasswordDialog = true"
            >
              修改密码
            </v-btn>
            <v-btn
              color="green lighten-2"
              dark
              @click="modifyInfoDialog = true"
            >
              修改信息
            </v-btn>
            <v-btn color="green lighten-2" dark @click="modifyImgDialog = true">
              修改头像
            </v-btn>
            <v-btn
              color="red lighten-2"
              dark
              @click="dialog = true"
              style="margin-left: 10%;"
            >
              退出登录
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent width="300">
      <v-card>
        <v-card-title class="headline">提示</v-card-title>

        <v-card-text style="font-size: 1rem;">
          确定要退出登录吗？
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="'#333'" text @click="!loading && (dialog = false)">
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            :loading="loading"
            text
            @click="logout"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modifyPasswordDialog" persistent width="300">
      <v-card>
        <v-card-title class="headline">修改密码</v-card-title>

        <span class="sp">原密码：</span
        ><el-input
          class="pass"
          placeholder="请输入原密码"
          v-model="oldpass"
          show-password
        ></el-input>
        <br />
        <span class="sp">新密码：</span
        ><el-input
          class="pass"
          placeholder="请输入新密码"
          v-model="newpass"
          show-password
        ></el-input>
        <br />
        <span class="sp">确认密码：</span
        ><el-input
          class="pass"
          placeholder="确认密码"
          v-model="repass"
          show-password
        ></el-input>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="!modifyPasswordLoading && (modifyPasswordDialog = false)"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            :loading="modifyPasswordLoading"
            text
            @click="modifyPassword"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modifyInfoDialog" persistent width="300">
      <v-card>
        <v-card-title class="headline">修改信息</v-card-title>

        <el-input
          style="margin-left: 10%;width: 80%;"
          placeholder="请输入昵称"
          v-model="newName"
          clearable
        >
        </el-input>

        <br />
        <el-input
          style="margin-left: 10%;width: 80%;"
          type="textarea"
          :rows="2"
          placeholder="请输入简介"
          v-model="newIntroduction"
        >
        </el-input>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="!modifyInfoLoading && (modifyInfoDialog = false)"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            :loading="modifyInfoLoading"
            text
            @click="modifyInfo"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modifyImgDialog" persistent width="300">
      <v-card>
        <v-card-title class="headline">上传头像</v-card-title>

        <el-upload
          class="avatar-uploader"
          action="http://43.140.252.215:8080/music/info/uploadAvatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="'#333'"
            text
            @click="!modifyImgLoading && (modifyImgDialog = false)"
          >
            取消
          </v-btn>
          <v-btn
            :color="$store.getters.mainColor"
            :loading="modifyImgLoading"
            text
            @click="modifyImg"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "My",
  data() {
    return {
      defaultAvatar: require("@/assets/images/defaultAvatar.svg"),
      dialog: false,
      loading: false,
      modifyPasswordDialog: false,
      modifyPasswordLoading: false,
      oldpass: "",
      newpass: "",
      repass: "",
      modifyInfoDialog: false,
      modifyInfoLoading: false,
      newName: "",
      newIntroduction: "",
      modifyImgDialog: false,
      modifyImgLoading: false,
      imageUrl: "",
      Img: "",
    };
  },
  mounted() {
    this.newName = this.$store.getters.userInfo.name;
    this.newIntroduction = this.$store.getters.userInfo.introduction;
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res != "error") {
        this.$message({
          content: "上传成功!",
          type: "success",
        });
        this.Img = res;
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message({
          content: "上传头像图片只能是 JPG 格式!",
          type: "warning",
        });
      }
      if (!isLt2M) {
        this.$message({
          content: "上传头像图片大小不能超过 2MB!",
          type: "warning",
        });
      }
      return isJPG && isLt2M;
    },
    modifyImg() {
      axios
        .post(
          `http://43.140.252.215:8080/music/info/modifyImg?userId=${
            JSON.parse(localStorage.getItem("userInfo")).userId
          }&img=${this.Img}`
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$store.commit("user/setUserInfo", {
              userId: JSON.parse(localStorage.getItem("userInfo")).userId,
              name: JSON.parse(localStorage.getItem("userInfo")).name,
              introduction: JSON.parse(localStorage.getItem("userInfo"))
                .introduction,
              age: JSON.parse(localStorage.getItem("userInfo")).age,
              cookie: JSON.parse(localStorage.getItem("userInfo")).cookie,
              createBy: JSON.parse(localStorage.getItem("userInfo")).createBy,
              createTime: JSON.parse(localStorage.getItem("userInfo"))
                .createTime,
              email: JSON.parse(localStorage.getItem("userInfo")).email,
              gender: JSON.parse(localStorage.getItem("userInfo")).gender,
              img: this.Img,
              listenTime: JSON.parse(localStorage.getItem("userInfo"))
                .listenTime,
              remark: JSON.parse(localStorage.getItem("userInfo")).remark,
              updateBy: JSON.parse(localStorage.getItem("userInfo")).updateBy,
              updateTime: JSON.parse(localStorage.getItem("userInfo"))
                .updateTime,
              vipType: JSON.parse(localStorage.getItem("userInfo")).vipType,
            });
            this.$message({
              content: "修改成功",
              type: "success",
            });
            this.modifyImgDialog = false;
          } else {
            this.$message({
              content: res.data.msg,
              type: "error",
            });
          }
        })
        .finally(() => {
          this.modifyImgLoading = false;
        });
    },
    setDefaultAvatar() {
      this.avatar = this.defaultAvatar;
    },
    logout() {
      this.loading = true;
      this.$api.login
        .logout()
        .then((res) => {
          if (res.code == 200) {
            this.dialog = false;
            this.$store.commit("user/setUserInfo", {});
            this.$router.replace({
              name: "Home",
            });
            location.reload();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    modifyPassword() {
      if (this.oldpass == "") {
        this.$message({
          content: "请输入原密码",
          type: "error",
        });
        return;
      }
      if (this.newpass == "") {
        this.$message({
          content: "请输入新密码",
          type: "error",
        });
        return;
      }
      if (this.oldpass == this.newpass) {
        this.$message({
          content: "新密码不能与原密码相同",
          type: "error",
        });
        return;
      }
      if (this.newpass != this.repass) {
        this.$message({
          content: "两次输入的密码不一致",
          type: "error",
        });
        return;
      }
      this.modifyPasswordLoading = true;
      axios
        .post(
          "http://43.140.252.215:8080/music/info/modifyPassword/" +
            JSON.parse(localStorage.getItem("userInfo")).userId +
            "/" +
            this.oldpass +
            "/" +
            this.newpass
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              content: res.data.msg,
              type: "success",
            });
            this.modifyPasswordDialog = false;
          } else {
            this.$message({
              content: res.data.msg,
              type: "error",
            });
          }
        })
        .finally(() => {
          this.modifyPasswordLoading = false;
        });
    },
    modifyInfo() {
      this.modifyInfoLoading = true;
      axios
        .post(
          "http://43.140.252.215:8080/music/info/modifyInfo/" +
            JSON.parse(localStorage.getItem("userInfo")).userId +
            "/" +
            this.newName +
            "/" +
            this.newIntroduction
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$store.commit("user/setUserInfo", {
              userId: JSON.parse(localStorage.getItem("userInfo")).userId,
              name: this.newName,
              introduction: this.newIntroduction,
              age: JSON.parse(localStorage.getItem("userInfo")).age,
              cookie: JSON.parse(localStorage.getItem("userInfo")).cookie,
              createBy: JSON.parse(localStorage.getItem("userInfo")).createBy,
              createTime: JSON.parse(localStorage.getItem("userInfo"))
                .createTime,
              email: JSON.parse(localStorage.getItem("userInfo")).email,
              gender: JSON.parse(localStorage.getItem("userInfo")).gender,
              img: JSON.parse(localStorage.getItem("userInfo")).img,
              listenTime: JSON.parse(localStorage.getItem("userInfo"))
                .listenTime,
              remark: JSON.parse(localStorage.getItem("userInfo")).remark,
              updateBy: JSON.parse(localStorage.getItem("userInfo")).updateBy,
              updateTime: JSON.parse(localStorage.getItem("userInfo"))
                .updateTime,
              vipType: JSON.parse(localStorage.getItem("userInfo")).vipType,
            });

            this.$message({
              content: res.data.msg,
              type: "success",
            });
            this.modifyInfoDialog = false;
          } else {
            this.$message({
              content: res.data.msg,
              type: "error",
            });
          }
        })
        .finally(() => {
          this.modifyInfoLoading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  margin-left: 37%;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.sp {
  margin-left: 10%;
  margin-bottom: 5%;
}

.pass {
  margin-right: 10%;
  margin-bottom: 5%;
  width: 50%;
}
</style>
