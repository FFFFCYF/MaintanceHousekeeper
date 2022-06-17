/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入维护订单列表
  1 先绑定点击事件
  2 获取缓存中的维护订单数据 数组格式 
  3 先判断 当前的订单是否已经存在于 维护订单列表
  4 已经存在 修改订单数据  执行维护订单数量++ 重新把维护订单数组 填充回缓存中
  5 不存在于维护订单列表的数组中 直接给维护订单数组添加一个新元素 新元素 带上 购买数量属性 num  重新把维护订单数组 填充回缓存中
  6 弹出提示
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    
  },
  // 订单对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);


  },
  // 获取订单详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;
    
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 1 先构造要预览的图片数组 
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });

  },
  // 点击 加入维护订单列表
  handleCartAdd() {
    // 1 获取缓存中的维护订单 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断 订单对象是否存在于维护订单数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      //3  不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4 已经存在维护订单数据 执行 num++
      cart[index].num++;
    }
    // 5 把维护订单列表重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户 手抖 疯狂点击按钮 
      mask: true
    });



  },
 
      
      
  }

)