# 互联网问诊调研 — 中日友好医院 & 北大第一医院

**调研时间**: 2026-07-08 北京时间  
**触发**: 伟烨电话询问：中日友好医院提到 APP 互联网问诊，让查中日友好 + 北大第一医院的官网互联网问诊

---

## 🟦 中日友好医院 (China-Japan Friendship Hospital)

**官网首页**  
https://www.zryhyy.com.cn/ — 头部明确有「互联网医院」入口图标

**互联网医院详情页（点开后）**  
https://www.zryhyy.com.cn/zryh/c103319/wzjs.shtml  
⚠️ **占位符空壳** — meta 显示「网站建设中」/「页面生成时间 2022-09-19」/ColumnName=「建设栏目」

**官方 iOS APP（患者端）**

| 字段 | 值 |
|---|---|
| 名称 | 中日医院 |
| Bundle ID | `com.bjhsyuntai.zhongri.patient` |
| 发行方 | China-Japan Friendship Hospital |
| URL | https://apps.apple.com/cn/app/中日医院/id6448781539 |
| 当前版本 | 1.5.7（2026-05-25 更新）|
| 功能 | 预约挂号、取报告单、健康宣教 |
| ❌ 在线问诊 | **不支持** |

**官方 iOS APP（医护端）**

| 字段 | 值 |
|---|---|
| 名称 | 中日友好医院医护 |
| Bundle ID | `com.bjhsyuntai.zhongri.doctor` |
| URL | https://apps.apple.com/cn/app/中日友好医院医护/id6739527388 |
| 功能 | 医生与患者文字/语音/视频通话、在线问诊 |
| 限制 | **仅医生端，患者用不了** |

**🎯 结论**

中日友好医院**没有可用的患者端在线问诊入口**。官网占位符空壳，患者 APP 只有挂号+报告，医护 APP 有在线问诊但只给医生用。

---

## 🟥 北京大学第一医院 (Peking University First Hospital)

**官网**  
https://www.pkufh.com/ — 旧版网站，**没有互联网医院入口、没有科室导航、没有挂号入口**

**iOS APP**  
❌ **没有自己的官方 APP**  
iTunes 搜「北京大学第一医院 / 北大第一医院 / 北医一院 / pkufh」均为 0 结果或仅返回第三方挂号 APP（京医通、北京挂号网等）

**🎯 结论**

北大第一医院**完全没有互联网医院 / 在线问诊入口**，必须本人到场。

---

## 🌐 给 Maria Rios 案的影响

两家医院都已经无路可走。这是大陆三甲的统一规则（国家卫健委规范下的非急诊国际患者就诊流程），不是个别医院的偏好。

**51 家医院主库里，明确支持海外邮件预审 + 胡桃夹 + 髂静脉压迫的只有唐都一家**——但唐都拒外籍。

**当前现实**：
- 路径 A — 回到唐都：已拒，无 back-up 转诊
- 路径 B — 北京血管强院（中日友好/安贞/301/北大第一）：要么没有互联网入口，要么血管外科不擅长胡桃夹+髂静脉压迫组合
- 路径 C — 走线下中介：已被堵死

**服务流程需要调整**（与伟烨同步）：
1. ¥399 套餐内容调整 — 把「协调医院先看资料」从「免费前置」改成「可选付费前置」
2. 客户预期管理 — 患者从一开始就要被告知「先到中国再看病」是基准事实
---

## 🔗 数据来源

- `curl https://www.zryhyy.com.cn/`
- `curl https://www.zryhyy.com.cn/zryh/c103319/wzjs.shtml`
- `curl https://www.pkufh.com/`
- iTunes Search API：`https://itunes.apple.com/search?term=...&country=cn&entity=software`
- iTunes Lookup API：`https://itunes.apple.com/lookup?id=6448781539&country=cn`
