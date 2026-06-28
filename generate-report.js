const fs = require("fs");
const path = require("path");

// ========== DATA ==========
const KEYWORD_TAG_MAP = {
  "心脏":["cardiology","heart-surgery"],"心血管":["cardiology","heart-surgery"],
  "搭桥":["cardiology","heart-surgery"],"支架":["cardiology"],
  "heart":["cardiology","heart-surgery"],"cardiac":["cardiology","heart-surgery"],
  "bypass":["cardiology","heart-surgery"],"stent":["cardiology"],
  "骨科":["orthopedics","joint-replacement","spine-surgery","sports-medicine"],
  "关节":["orthopedics","joint-replacement"],"膝关节":["orthopedics","joint-replacement"],
  "髋关节":["orthopedics","joint-replacement"],"脊柱":["orthopedics","spine-surgery"],
  "orthopedic":["orthopedics","joint-replacement"],"joint":["orthopedics","joint-replacement"],
  "knee":["orthopedics","joint-replacement"],"hip":["orthopedics","joint-replacement"],
  "spine":["orthopedics","spine-surgery"],
  "神经外科":["neurosurgery","neurology"],"脑肿瘤":["neurosurgery"],"脑血管":["neurosurgery","neurology"],
  "neurosurgery":["neurosurgery","neurology"],"brain":["neurosurgery"],"neuro":["neurosurgery","neurology"],
  "肿瘤":["oncology","cancer-surgery","radiotherapy"],"癌症":["oncology","cancer-surgery","radiotherapy"],
  "放疗":["oncology","radiotherapy"],"质子":["oncology","radiotherapy"],
  "cancer":["oncology","cancer-surgery","radiotherapy"],"tumor":["oncology","cancer-surgery"],
  "oncology":["oncology","cancer-surgery"],"proton":["oncology","radiotherapy"],
  "眼科":["ophthalmology","lasik","cataract"],"白内障":["ophthalmology","cataract"],
  "近视":["ophthalmology","lasik"],"eye":["ophthalmology"],"cataract":["ophthalmology","cataract"],
  "lasik":["ophthalmology","lasik"],
  "ivf":["fertility","maternity"],"试管":["fertility","maternity"],"生殖":["fertility","maternity","obstetrics"],
  "妇产":["maternity","obstetrics","prenatal-diagnosis"],"fertility":["fertility","maternity"],
  "血液":["hematology"],"白血病":["hematology"],"骨髓":["hematology"],
  "blood":["hematology"],"leukemia":["hematology"],"hematology":["hematology"],
  "牙科":["dental","oral-surgery","cosmetic-dental"],"种植牙":["dental","oral-surgery"],
  "口腔":["dental","oral-surgery"],"dental":["dental","oral-surgery"],"teeth":["dental","oral-surgery"],
  "肝":["general"],"肝移植":["general"],"liver":["general"],
  "肾":["kidney-disease"],"肾脏":["kidney-disease"],"kidney":["kidney-disease"],
  "消化":["gastroenterology"],"肠胃":["gastroenterology"],"gastroenterology":["gastroenterology"],
  "呼吸":["respiratory"],"肺":["respiratory"],"respiratory":["respiratory"],"lung":["respiratory"],
  "泌尿":["urology"],"urology":["urology"],
  "儿科":["pediatrics","childrens-health"],"儿童":["pediatrics","childrens-health"],
  "pediatric":["pediatrics","childrens-health"],"child":["pediatrics","childrens-health"],
  "整形":["plastic-surgery"],"plastic":["plastic-surgery"],"cosmetic":["plastic-surgery"],
  "中医":["tcm"],"tcm":["tcm"],
  "老年":["geriatrics"],"geriatric":["geriatrics"],"elderly":["geriatrics"],
  "综合":["general","all-specialties"],"全科":["general","all-specialties"],"体检":["general"],
  "general":["general","all-specialties"],"checkup":["general"],
  "胸外科":["thoracic-surgery"],"thoracic":["thoracic-surgery"],"胸":["thoracic-surgery"],
  "胡桃夹":["thoracic-surgery"],"nutcracker":["thoracic-surgery"],
  "ent":["ent"],"耳鼻喉":["ent"],"耳":["ent"],
  "皮肤":["dermatology"],"dermatology":["dermatology"],
  "传染病":["infectious-disease"],"infectious":["infectious-disease"],
};

const PRICE_DB = {
  "膝关节置换":{cn:"$8,000 - $12,000",us:"$35,000 - $50,000",save:"70%"},
  "knee":{cn:"$8,000 - $12,000",us:"$35,000 - $50,000",save:"70%"},
  "髋关节置换":{cn:"$9,000 - $14,000",us:"$50,000+",save:"65%"},
  "hip":{cn:"$9,000 - $14,000",us:"$50,000+",save:"65%"},
  "脊柱":{cn:"$12,000 - $25,000",us:"$80,000+",save:"65%"},
  "spine":{cn:"$12,000 - $25,000",us:"$80,000+",save:"65%"},
  "心脏搭桥":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "bypass":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "心脏瓣膜":{cn:"$18,000 - $30,000",us:"$150,000 - $300,000",save:"80%"},
  "valve":{cn:"$18,000 - $30,000",us:"$150,000 - $300,000",save:"80%"},
  "心脏":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "heart":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "cardiac":{cn:"$15,000 - $25,000",us:"$100,000 - $200,000",save:"80%"},
  "癌症":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "cancer":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "肿瘤":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "tumor":{cn:"$15,000 - $50,000",us:"$100,000 - $300,000",save:"70%"},
  "质子":{cn:"$25,000 - $40,000",us:"$150,000+",save:"75%"},
  "proton":{cn:"$25,000 - $40,000",us:"$150,000+",save:"75%"},
  "脑肿瘤":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "brain":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "神经外科":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "neurosurgery":{cn:"$15,000 - $30,000",us:"$100,000+",save:"75%"},
  "ivf":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "fertility":{cn:"$6,000 - $12,000",us:"$25,000+",save:"65%"},
  "骨髓移植":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "bone marrow":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "leukemia":{cn:"$30,000 - $60,000",us:"$200,000+",save:"75%"},
  "种植牙":{cn:"$8,000 - $25,000 / 颗",us:"$3,000 - $5,000 / 颗",save:"60%"},
  "dental":{cn:"$8,000 - $25,000 / 颗",us:"$3,000 - $5,000 / 颗",save:"60%"},
  "白内障":{cn:"$1,500 - $3,000",us:"$5,000+",save:"60%"},
  "cataract":{cn:"$1,500 - $3,000",us:"$5,000+",save:"60%"},
  "近视":{cn:"$1,000 - $2,000",us:"$4,000+",save:"65%"},
  "lasik":{cn:"$1,000 - $2,000",us:"$4,000+",save:"65%"},
  "肝移植":{cn:"$30,000 - $60,000",us:"$300,000+",save:"80%"},
  "liver":{cn:"$30,000 - $60,000",us:"$300,000+",save:"80%"},
  "肾移植":{cn:"$25,000 - $50,000",us:"$250,000+",save:"80%"},
  "kidney":{cn:"$25,000 - $50,000",us:"$250,000+",save:"80%"},
  "cart":{cn:"$120,000 左右",us:"$500,000+",save:"60%"},
  "胸外科":{cn:"$10,000 - $25,000",us:"$60,000 - $150,000",save:"75%"},
  "thoracic":{cn:"$10,000 - $25,000",us:"$60,000 - $150,000",save:"75%"},
};

const CITY_MAP = {
  "北京":"Beijing","上海":"Shanghai","广州":"Guangzhou","深圳":"Shenzhen",
  "成都":"Chengdu","杭州":"Hangzhou","天津":"Tianjin","西安":"Xi'an",
  "南京":"Nanjing","济南":"Jinan",
  "beijing":"Beijing","shanghai":"Shanghai","guangzhou":"Guangzhou","shenzhen":"Shenzhen",
  "chengdu":"Chengdu","hangzhou":"Hangzhou","tianjin":"Tianjin","xi'an":"Xi'an",
  "nanjing":"Nanjing","jinan":"Jinan",
};
// ========== HOSPITAL_DESCRIPTIONS ==========
const HOSPITAL_DESCRIPTIONS = {
  "fuwai-hospital": {
    oneLiner: "中国心脏手术的\u201C最高法院\u201D\u2014\u2014别的医院搞不定的心脏病例，最后都转到这里",
    whyRecommend: [
      "中国心血管外科排名第1，是全国心脏外科的最高权威",
      "复杂心脏搭桥、瓣膜手术、先心病矫治均为国内最强",
      "每年心脏手术量全球领先，技术纯熟度极高",
      "北京医疗资源集中，便于多学科协作"
    ],
    watchOut: ["北京生活成本较高，住宿和陪护需额外预算", "门诊量极大，非紧急手术可能需要排队"]
  },
  "anzhen-hospital": {
    oneLiner: "北京心脏外科的\u201C双子星\u201D之一\u2014\u2014与阜外齐名，心肺血管治疗全国顶尖",
    whyRecommend: [
      "心肺血管疾病综合治疗能力全国前列",
      "心脏移植和肺移植领域经验丰富",
      "北京安贞地区交通便利，周边配套成熟"
    ],
    watchOut: ["综合排名不如阜外，非心血管专科相对一般", "国际部规模较小，接待能力有限"]
  },
  "zhongshan-hospital-shanghai": {
    oneLiner: "上海滩的\u201C医学航母\u201D\u2014\u2014心内科全国前三，肿瘤科全国前五，综合实力极其雄厚",
    whyRecommend: [
      "心血管内科全国排名前3，肿瘤科排名前5",
      "复旦大学附属，科研和临床双优",
      "上海国际化程度高，外国患者就医体验好"
    ],
    watchOut: ["上海生活成本全国最高", "门诊人流量极大，就诊环境较拥挤"]
  },
  "jishuitan-hospital": {
    oneLiner: "中国骨科\u201C国家队\u201D\u2014\u2014关节置换手术年量全球领先，膝髋关节置换是王牌",
    whyRecommend: [
      "全中国骨科排名第1，专门做关节置换已有60年历史",
      "每年膝关节置换手术超过5,000例\u2014\u2014每天约15台",
      "该院拥有国际化的关节置换中心"
    ],
    watchOut: ["骨科之外的其他专科实力一般", "医院位于老城区，周边住宿条件有限"]
  },
  "shanghai-sixth-hospital": {
    oneLiner: "上海骨科的\u201C顶梁柱\u201D\u2014\u2014骨科排名全国第2，运动医学和关节外科是强项",
    whyRecommend: [
      "骨科全国排名第2，仅次于积水潭",
      "运动医学科和关节外科实力极强",
      "上海交通便利，国际航班多"
    ],
    watchOut: ["综合实力不如华山、瑞金等上海大医院", "徐汇院区停车和周边住宿较贵"]
  },
  "pku-third-hospital": {
    oneLiner: "北医三院\u2014\u2014妇产全国前4、生殖医学全国第1，骨科也是顶级",
    whyRecommend: [
      "生殖医学（试管婴儿）全国排名第1",
      "妇产科全国排名第4，综合实力强",
      "骨科尤其是运动医学在国内享有盛誉",
      "北京大学附属，学术底蕴深厚"
    ],
    watchOut: ["各专科都很强但号源紧张", "海淀区距机场较远"]
  },
  "fudan-womens-hospital": {
    oneLiner: "\u201C红房子\u201D医院\u2014\u2014上海妇产科的代名词，百年历史，妇产专科全国第2",
    whyRecommend: [
      "妇产科全国排名第2",
      "百年妇产专科医院，技术传承深厚",
      "复旦大学附属，科研实力强"
    ],
    watchOut: ["仅限妇产科，无其他专科", "黄浦院区在市中心，交通拥堵"]
  },
  "zhejiang-womens-hospital": {
    oneLiner: "浙江省妇产科\u201C天花板\u201D\u2014\u2014浙江大学附属，妇产专科实力全国一流",
    whyRecommend: [
      "浙江省最好的妇产科医院",
      "浙大医学院附属，学术和临床双优",
      "杭州城市宜居，生活成本适中"
    ],
    watchOut: ["国际航班需经上海或北京转机", "国际部规模不如北上广"]
  },
  "cams-cancer-hospital": {
    oneLiner: "中国肿瘤治疗的\u201C最高殿堂\u201D\u2014\u2014全国肿瘤专科排名第1，放疗和手术均为顶配",
    whyRecommend: [
      "全国肿瘤专科排名第1，中国医学科学院直属",
      "放疗、化疗、手术综合治疗体系最完整",
      "质子重离子等前沿技术临床经验丰富",
      "北京最好的肿瘤医院，外国患者认可度高"
    ],
    watchOut: ["北京生活成本高", "热门专家号源极其紧张，需提前数月预约"]
  },
  "tiantan-hospital": {
    oneLiner: "中国神外\u201C天花板\u201D\u2014\u2014神经外科全国第1，脑肿瘤和脑血管病手术量全国之最",
    whyRecommend: [
      "神经外科全国排名第1",
      "脑肿瘤、脑血管畸形、癫痫外科均为国内领先",
      "年手术量巨大，技术成熟度极高"
    ],
    watchOut: ["神经外科之外的综合实力一般", "丰台区新院区距市中心较远"]
  },
  "huashan-hospital": {
    oneLiner: "上海神外的\u201C王者\u201D\u2014\u2014神经外科全国第2，皮肤科全国第1，综合实力极为雄厚",
    whyRecommend: [
      "神经外科全国排名第2，仅次于天坛",
      "皮肤科全国第1，综合科室齐全",
      "复旦大学附属，位于上海市中心"
    ],
    watchOut: ["上海生活成本高", "总院在静安区，周边住宿贵"]
  },
  "beijing-childrens-hospital": {
    oneLiner: "中国儿科的\u201C最高学府\u201D\u2014\u2014国家儿童医学中心，儿科全国第1",
    whyRecommend: [
      "儿科全国排名第1，国家儿童医学中心",
      "小儿外科、小儿心脏病、小儿血液病均为国内最强",
      "首都医科大学附属，学术底蕴深"
    ],
    watchOut: ["仅限儿童患者", "北京的生活和住宿成本较高"]
  },
  "pumch": {
    oneLiner: "中国医院\u201C皇冠上的明珠\u201D\u2014\u2014综合排名全国第1，什么病在协和都有最好的方案",
    whyRecommend: [
      "全国综合排名第1，各专科均为国内顶级",
      "多科室会诊能力极强，适合复杂疑难病例",
      "国际部历史悠久，服务外国患者经验最丰富",
      "北京核心地段，交通便利"
    ],
    watchOut: ["国际部费用是中国医院中最高之一", "号源极为紧张，需提前很久预约"]
  },
  "china-japan-friendship-hospital": {
    oneLiner: "北京的国际医疗\u201C窗口\u201D\u2014\u2014国际部全国最成熟，外国患者就医体验最佳",
    whyRecommend: [
      "国际部全国最成熟，服务流程标准化",
      "综合实力中等偏上，科室齐全",
      "朝阳区核心地段，周边配套完善"
    ],
    watchOut: ["综合排名不如协和、北大医院", "国际部费用高于普通门诊"]
  },

  "ruijin-hospital": {
    oneLiner: "上海\u201C老克勒\u201D医院\u2014\u2014百年历史，VIP中心全国闻名，综合实力上海前3",
    whyRecommend: [
      "综合实力上海前3，全国排名前10",
      "VIP中心服务成熟，适合高端患者",
      "位于上海市中心，交通极为便利"
    ],
    watchOut: ["上海生活成本最高", "热门科室号源紧张"]
  },
  "renji-hospital": {
    oneLiner: "上海浦东的\u201C医疗中心\u201D\u2014\u2014消化科全国前5，肝移植全国领先",
    whyRecommend: [
      "消化内科和肝移植全国领先",
      "浦东新区配套好，周边国际化程度高",
      "上海交通大学附属"
    ],
    watchOut: ["浦东距虹桥机场较远", "肝移植需严格匹配"]
  },
  "xijing-hospital": {
    oneLiner: "西部神外的\u201C定海神针\u201D\u2014\u2014神经外科全国前5，军医大学出身能打硬仗",
    whyRecommend: [
      "神经外科全国排名前5",
      "空军军医大学附属，军队医院严谨作风",
      "西安生活成本远低于北上广"
    ],
    watchOut: ["西安国际航班较少，需转机", "综合实力不如华西"]
  },
  "tangdu-hospital": {
    oneLiner: "军队医院出身能打硬仗\u2014\u2014胸外科全军第1，胡桃夹综合征3D支架全国独家",
    whyRecommend: [
      "胸外科全国第6、全军第1，神经外科和骨科也是顶级水准",
      "胡桃夹综合征3D打印支架手术\u2014\u2014全国独家技术之一",
      "费用参考：3D支架植入术\u00A545,000-60,000（约$6,300-8,500）",
      "国际部已接待多位国际患者，服务流程成熟"
    ],
    watchOut: ["国际部接待能力有限，不适合紧急情况", "西安的国际航班比北京/上海少", "如果病情复杂需要多科室会诊，北京可能更合适"]
  },
  "west-china-hospital": {
    oneLiner: "中国西部医疗的\u201C定海神针\u201D\u2014\u2014全国综合排名第2，什么病在华西都有解",
    whyRecommend: [
      "全国综合排名第2，是中国西部地区最权威的医院",
      "什么病都能接，多科室会诊能力极强",
      "神经外科、胸外科、肝胆外科、呼吸内科均为国内顶级",
      "成都生活成本低，市区很安全，可以放心住院"
    ],
    watchOut: ["成都的国际直飞航线有限", "门诊量极大，排队时间较长"]
  },

  "shanghai-changhai-hospital": {
    oneLiner: "海军军医大学附属\u2014\u2014泌尿外科和肾病治疗全国领先，综合实力进全国前10",
    whyRecommend: [
      "综合排名全国前10",
      "泌尿外科和肾内科全国领先",
      "上海国际化就医环境"
    ],
    watchOut: ["杨浦区距市中心较远", "军队医院对外国患者的流程需确认"]
  },
  "sir-run-run-shaw-hospital": {
    oneLiner: "浙大邵逸夫\u2014\u2014JCI认证，国际化程度全国最高之一，生殖医学和心内科为强项",
    whyRecommend: [
      "JCI国际认证，国际化程度全国最高之一",
      "生殖医学和心内科实力突出",
      "杭州生活宜居，成本适中"
    ],
    watchOut: ["杭州国际航线有限", "综合排名不如浙大一院"]
  },
  "shanghai-longhua-hospital": {
    oneLiner: "中国中医的\u201C殿堂\u201D\u2014\u2014全国最好的中医院之一，JCI认证，肿瘤中西医结合是王牌",
    whyRecommend: [
      "全国最顶级的中医院，JCI国际认证",
      "肿瘤中西医结合治疗全国领先",
      "上海中医药大学附属，学术权威"
    ],
    watchOut: ["以中医为主，纯西医需求需慎重", "中医治疗的标准化程度不如西医"]
  },
  "dongzhimen-hospital": {
    oneLiner: "北京中医\u201C门面\u201D\u2014\u2014北京中医药大学附属，中医神经内科和综合调理全国顶尖",
    whyRecommend: [
      "北京中医药大学第一附属医院",
      "中医神经内科全国领先",
      "位于北京东直门核心地段"
    ],
    watchOut: ["以中医为主", "国际部规模有限"]
  },
  "shanghai-shuguang-hospital": {
    oneLiner: "上海中医药大学附属曙光\u2014\u2014中医妇科和生殖调理全国闻名",
    whyRecommend: [
      "中医妇科和生殖调理全国领先",
      "上海中医药大学附属",
      "浦东和浦西双院区"
    ],
    watchOut: ["以中医治疗为主", "国际部规模较小"]
  },
  "nanjing-drum-tower-hospital": {
    oneLiner: "江苏省\u201C扛把子\u201D\u2014\u2014综合实力江苏第1，心血管和肿瘤为强项",
    whyRecommend: [
      "江苏省综合排名第1的医院",
      "心血管内科和肿瘤科实力强",
      "南京生活成本适中，城市宜居"
    ],
    watchOut: ["南京国际直飞航线有限", "综合排名不如北京上海顶级医院"]
  },
  "qilu-hospital": {
    oneLiner: "山东省医疗\u201C大哥大\u201D\u2014\u2014山东大学附属，综合实力全省最强",
    whyRecommend: [
      "山东省综合排名第1",
      "肿瘤科和神经外科为强项",
      "济南生活成本低"
    ],
    watchOut: ["济南国际航线极少", "国际化程度不如一线城市"]
  },

  "beijing-tongren-hospital": {
    oneLiner: "中国眼科的\u201C灯塔\u201D\u2014\u2014眼科全国第1，耳鼻喉科也是顶级",
    whyRecommend: [
      "眼科全国排名第1",
      "耳鼻喉科全国排名前3",
      "位于北京市中心，交通便利"
    ],
    watchOut: ["仅限眼耳鼻喉专科", "东城区周边住宿较贵"]
  },
  "huadong-hospital": {
    oneLiner: "上海\u201C长寿医院\u201D\u2014\u2014老年医学全国顶尖，适合高龄患者的综合诊疗",
    whyRecommend: [
      "老年医学全国排名领先",
      "复旦大学附属，综合实力强",
      "上海静安区核心地段"
    ],
    watchOut: ["偏重老年医学", "国际部规模小于华山等大医院"]
  },
  "shanghai-ninth-hospital": {
    oneLiner: "九院\u2014\u2014整容外科全国第1，口腔颌面外科全国最强",
    whyRecommend: [
      "整形外科全国排名第1",
      "口腔颌面外科全国最强",
      "上海交通大学附属"
    ],
    watchOut: ["以整形和口腔为主", "多个院区分布广，需确认具体科室位置"]
  },
  "guangdong-provincial-peoples-hospital": {
    oneLiner: "华南心脏的\u201C守护神\u201D\u2014\u2014心血管外科华南第一，广东省最好的综合医院之一",
    whyRecommend: [
      "心血管外科华南排名第1",
      "广东省综合实力顶尖",
      "广州国际化程度高"
    ],
    watchOut: ["广州夏季湿热", "国际部规模不如北上广顶级医院"]
  },
  "nanfang-hospital": {
    oneLiner: "南方医的\u201C王牌\u201D\u2014\u2014肾病治疗全国领先，综合实力华南前三",
    whyRecommend: [
      "肾病治疗全国领先",
      "综合实力华南排名前3",
      "广州白云区，距机场近"
    ],
    watchOut: ["白云区距市中心较远", "国际部规模有限"]
  },
  "zhongshan-sixth-hospital": {
    oneLiner: "消化科的\u201C专业户\u201D\u2014\u2014胃肠病全国顶尖，中山大学附属",
    whyRecommend: [
      "消化内科全国排名领先",
      "中山大学附属，学术实力强",
      "广州天河区，配套成熟"
    ],
    watchOut: ["偏重消化专科", "综合实力不如中山一院"]
  },
  "zhujiang-hospital": {
    oneLiner: "华南神外的\u201C利器\u201D\u2014\u2014神经外科华南领先，南方医科大学附属",
    whyRecommend: [
      "神经外科华南排名领先",
      "综合实力强，科室配备齐全",
      "广州海珠区"
    ],
    watchOut: ["国际部知名度不如省医", "距机场约1小时"]
  },
  "first-affiliated-guangzhou-tcm": {
    oneLiner: "华南中医药\u201C最高学府\u201D\u2014\u2014广州中医药大学附属，中医综合实力全国前列",
    whyRecommend: [
      "中医综合实力华南第1",
      "广州中医药大学第一附属",
      "距白云机场仅35-50分钟"
    ],
    watchOut: ["以中医为主", "国际部需提前确认语言服务"]
  },
  "first-affiliated-sun-yat-sen": {
    oneLiner: "广州的\u201C协和\u201D\u2014\u2014中山一院综合实力华南第1，全科室覆盖",
    whyRecommend: [
      "综合实力华南排名第1",
      "各科室配备齐全，多学科会诊能力强",
      "中山大学附属，学术底蕴深厚"
    ],
    watchOut: ["广州夏季炎热潮湿", "号源紧张"]
  },
  "first-affiliated-guangzhou-medical": {
    oneLiner: "呼吸科的\u201C国家队\u201D\u2014\u2014呼吸内科全国顶尖，钟南山院士团队所在",
    whyRecommend: [
      "呼吸内科全国排名第1",
      "钟南山院士团队，学术权威",
      "广州医科大学附属"
    ],
    watchOut: ["以呼吸专科为主", "综合科室不如中山一院"]
  },
  "pku-peoples-hospital": {
    oneLiner: "北大人民\u2014\u2014血液科全国前3，综合实力北京前5",
    whyRecommend: [
      "血液科全国排名前3",
      "综合实力北京前5",
      "北京大学附属，多个院区"
    ],
    watchOut: ["西直门院区交通拥堵", "号源紧张"]
  },
  "beijing-chaoyang-hospital": {
    oneLiner: "北京朝阳\u2014\u2014呼吸内科全国顶尖，朝阳区核心地段",
    whyRecommend: [
      "呼吸内科全国排名领先",
      "综合实力北京前10",
      "朝阳区核心地段，周边配套完善"
    ],
    watchOut: ["综合排名不如协和、北大医院", "国际部规模较小"]
  },
  "301-hospital": {
    oneLiner: "解放军总医院\u2014\u2014中国军队医疗的最高代表，综合实力全国前列",
    whyRecommend: [
      "中国军队最高级别医院",
      "综合实力全国排名前10",
      "海淀区，周边医疗资源丰富"
    ],
    watchOut: ["军队医院对外国患者的流程可能不同", "需确认国际部接待政策"]
  },
  "shenzhen-peoples-hospital": {
    oneLiner: "深圳医疗\u201C一哥\u201D\u2014\u2014深圳市综合实力第1，毗邻香港，国际患者便利",
    whyRecommend: [
      "深圳市综合排名第1",
      "毗邻香港，国际患者出入境便利",
      "深圳国际机场航线丰富"
    ],
    watchOut: ["医疗底蕴不如北上广老牌医院", "综合排名全国不算顶级"]
  },
  "pku-shenzhen-hospital": {
    oneLiner: "北大深圳\u2014\u2014北京大学附属，深圳最好的综合性三甲之一",
    whyRecommend: [
      "北京大学附属，品牌背书",
      "深圳福田核心地段",
      "国际化程度较高"
    ],
    watchOut: ["建院历史较短", "部分专科不如广州顶级医院"]
  },
  "shenzhen-second-peoples-hospital": {
    oneLiner: "深圳骨科\u201C担当\u201D\u2014\u2014骨科深圳最强，综合实力稳步提升",
    whyRecommend: [
      "骨科在深圳排名领先",
      "深圳福田区，交通便利",
      "费用相对低于北上广"
    ],
    watchOut: ["综合实力不如深圳市人民医院", "国际部规模有限"]
  },
  "shenzhen-tcm-hospital": {
    oneLiner: "深圳中医\u201C标杆\u201D\u2014\u2014深圳最好的中医院，中西医结合特色",
    whyRecommend: [
      "深圳最好的中医院",
      "福田和光明双院区",
      "中西医结合特色"
    ],
    watchOut: ["以中医为主", "国际患者服务经验有限"]
  },
  "shenzhen-maternity-child-health": {
    oneLiner: "深圳妇幼\u201C第一品牌\u201D\u2014\u2014深圳最好的妇产和儿科医院",
    whyRecommend: [
      "深圳妇产科和儿科排名第1",
      "福田双院区，覆盖广",
      "服务态度好"
    ],
    watchOut: ["仅限妇产和儿科", "国际部接待能力有限"]
  },
  "fuda-cancer-hospital": {
    oneLiner: "广州复大\u2014\u2014民营肿瘤医院的标杆，JCI认证，冷冻和纳米刀技术全国领先",
    whyRecommend: [
      "JCI国际认证的民营肿瘤医院",
      "冷冻消融和纳米刀技术全国领先",
      "国际患者服务流程成熟"
    ],
    watchOut: ["民营医院，费用可能高于公立", "综合实力不如公立肿瘤医院"]
  },
  "sun-yat-sen-cancer-hospital": {
    oneLiner: "华南肿瘤\u201C最高峰\u201D\u2014\u2014全国肿瘤排名前3，放疗和手术均为顶配",
    whyRecommend: [
      "全国肿瘤专科排名前3",
      "中山大学附属，华南最强肿瘤中心",
      "广州国际化程度高"
    ],
    watchOut: ["广州天气湿热", "号源非常紧张"]
  },
  "tianjin-eye-hospital": {
    oneLiner: "华北眼科\u201C专业户\u201D\u2014\u2014天津最好的眼科医院，白内障和近视手术成熟",
    whyRecommend: [
      "华北地区最好的眼科专科医院之一",
      "白内障和近视激光手术技术成熟",
      "天津生活成本低于北京"
    ],
    watchOut: ["仅限眼科", "天津国际航线有限"]
  },
  "tianjin-medical-university-cancer": {
    oneLiner: "华北肿瘤\u201C重镇\u201D\u2014\u2014天津最好的肿瘤医院，华北肿瘤治疗中心之一",
    whyRecommend: [
      "华北地区最好的肿瘤专科医院之一",
      "放疗和手术综合治疗能力强",
      "天津距北京仅30分钟高铁"
    ],
    watchOut: ["整体规模不如北京肿瘤医院", "天津国际航线少"]
  },
  "aier-eye-hospital": {
    oneLiner: "爱尔眼科\u2014\u2014中国最大的民营眼科连锁，遍布全国，标准化服务",
    whyRecommend: [
      "中国最大的眼科连锁集团",
      "标准化服务流程，全国多地可选",
      "白内障和近视手术性价比高"
    ],
    watchOut: ["民营连锁，各院区水平参差不齐", "高端复杂手术建议去公立三甲"]
  },
  "shanghai-dental-hospital": {
    oneLiner: "上海九院口腔\u2014\u2014中国牙科的最高殿堂，口腔颌面外科全国第1",
    whyRecommend: [
      "口腔科全国排名第1",
      "口腔颌面外科全国最强",
      "上海交通大学附属"
    ],
    watchOut: ["以口腔和颌面为主", "种植牙费用在上海偏高"]
  },
  "guangzhou-dental-hospital": {
    oneLiner: "广州口腔\u2014\u2014华南最好的口腔专科医院，种植牙和正畸为强项",
    whyRecommend: [
      "华南地区最好的口腔医院",
      "种植牙和正畸技术成熟",
      "广州生活成本适中"
    ],
    watchOut: ["综合知名度不如华西口腔", "越秀区老城区交通拥堵"]
  },
};

// ========== CITY_LIFESTYLE_GUIDES ==========
const CITY_LIFESTYLE_GUIDES = {
  "Beijing": {
    accommodation: "医院周边步行5-15分钟有快捷酒店和短租公寓，月租约\u00A53,000-6,000/月。国际患者可选择朝阳区涉外公寓",
    food: "北京美食丰富，清真餐厅集中在牛街，各大商场有西式简餐和日韩料理",
    companion: "陪护家属月租公寓约\u00A53,000-5,000/月，医院附近有经济型酒店约\u00A5200-400/晚",
    communication: "医院和酒店WiFi可正常访问海外网站。建议购买中国SIM卡（中国移动/联通），月费约\u00A550-100",
    tourism: "术后恢复期可游览天安门、故宫、颐和园（建议术后2周以上）。长城需较好体力，建议术后1个月以上"
  },
  "Shanghai": {
    accommodation: "医院周边步行5-15分钟有快捷酒店和短租公寓，月租约\u00A54,000-8,000/月。涉外公寓集中在静安和浦东",
    food: "上海是国际美食之都，清真餐厅、西餐、日料、东南亚菜丰富。各大商场均有国际连锁餐饮",
    companion: "陪护家属月租公寓约\u00A54,000-7,000/月，经济型酒店约\u00A5250-500/晚",
    communication: "医院和酒店WiFi可正常访问海外网站。上海公共场所WiFi覆盖广",
    tourism: "外滩、豫园、上海博物馆适合术后轻度游览。迪士尼建议术后1个月以上"
  },
  "Guangzhou": {
    accommodation: "医院周边有经济型酒店和短租公寓，月租约\u00A52,500-5,000/月",
    food: "广州是美食之都（粤菜），清真餐厅主要分布在越秀区。各大商场有西式简餐",
    companion: "陪护家属月租公寓约\u00A52,500-4,000/月",
    communication: "医院和酒店WiFi可访问海外网站。建议购买中国SIM卡",
    tourism: "陈家祠、沙面、白云山适合术后轻度游览。广州塔和长隆建议术后1个月以上"
  },
  "Shenzhen": {
    accommodation: "医院周边有快捷酒店和短租公寓，月租约\u00A53,000-6,000/月。福田和南山涉外公寓选择多",
    food: "深圳是移民城市，餐饮极为多样。清真餐厅、西餐、东南亚菜丰富",
    companion: "陪护家属月租公寓约\u00A53,000-5,000/月",
    communication: "医院和酒店WiFi可正常访问海外网站。深圳与香港一河之隔，通讯便利",
    tourism: "深圳湾公园、华侨城适合术后轻度游览。世界之窗和欢乐谷建议术后1个月以上"
  },
  "Chengdu": {
    accommodation: "医院周边步行5-15分钟有快捷酒店和短租公寓，月租约\u00A52,000-4,000/月",
    food: "成都川菜闻名世界，但也有很多不辣的选择。清真餐厅在市区有分布",
    companion: "陪护家属月租公寓约\u00A52,000-3,000/月，是全国最低之一",
    communication: "医院和酒店WiFi可正常访问海外网站",
    tourism: "宽窄巷子、锦里、武侯祠适合术后轻度游览。大熊猫基地和青城山建议术后2周以上"
  },
  "Xi'an": {
    accommodation: "医院周边步行5-15分钟有快捷酒店和短租公寓，月租约\u00A52,000-3,500/月",
    food: "西安是美食之都，清真餐厅非常多（回民街），西北风味丰富，也有西式简餐",
    companion: "陪护家属月租公寓约\u00A52,000-3,000/月",
    communication: "医院和酒店WiFi可正常访问海外网站",
    tourism: "大雁塔、城墙、回民街适合术后轻度游览。兵马俑建议术后2周以上（距市区约1小时车程）"
  },
  "Hangzhou": {
    accommodation: "医院周边有快捷酒店和短租公寓，月租约\u00A52,500-4,500/月",
    food: "杭州菜清淡精致，清真餐厅和西餐在市区有分布",
    companion: "陪护家属月租公寓约\u00A52,500-4,000/月",
    communication: "医院和酒店WiFi可正常访问海外网站",
    tourism: "西湖、灵隐寺适合术后轻度游览。千岛湖建议术后2周以上"
  },
  "Tianjin": {
    accommodation: "医院周边有快捷酒店和短租公寓，月租约\u00A52,000-3,500/月",
    food: "天津美食丰富，清真餐厅较多。距北京仅30分钟高铁，可共享北京资源",
    companion: "陪护家属月租公寓约\u00A52,000-3,000/月",
    communication: "医院和酒店WiFi可正常访问海外网站",
    tourism: "五大道、意式风情区、天津之眼适合术后轻度游览"
  },
  "Nanjing": {
    accommodation: "医院周边有快捷酒店和短租公寓，月租约\u00A52,500-4,000/月",
    food: "南京菜（淮扬菜）清淡精致，清真餐厅在市区有分布",
    companion: "陪护家属月租公寓约\u00A52,500-3,500/月",
    communication: "医院和酒店WiFi可正常访问海外网站",
    tourism: "中山陵、夫子庙、玄武湖适合术后轻度游览"
  },
  "Jinan": {
    accommodation: "医院周边有快捷酒店和短租公寓，月租约\u00A52,000-3,000/月",
    food: "济南鲁菜为主，清真餐厅在市区有分布",
    companion: "陪护家属月租公寓约\u00A52,000-3,000/月，全国最低之一",
    communication: "医院和酒店WiFi可正常访问海外网站",
    tourism: "趵突泉、大明湖、千佛山适合术后轻度游览"
  }
};

// ========== HELPERS ==========
function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

function parseCSVLine(line) {
  const r=[]; let c="", q=false;
  for(let i=0;i<line.length;i++){const ch=line[i];if(ch=='"')q=!q;else if(ch===','&&!q){r.push(c.trim());c="";}else c+=ch;}
  r.push(c.trim()); return r;
}

function loadHospitals(csvPath) {
  const text = fs.readFileSync(csvPath,"utf-8").replace(/^\uFEFF/,"");
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h=>h.trim());
  return lines.slice(1).map(line=>{
    const cols=parseCSVLine(line);
    const obj={};
    headers.forEach((h,i)=>{obj[h]=(cols[i]||"").trim();});
    obj.Tags=obj.Tags?obj.Tags.split(",").map(t=>t.trim().toLowerCase()):[];
    obj.Trust_Score=parseFloat(obj.Trust_Score)||0;
    obj.tagsStr=obj.Tags.join(", ");
    return obj;
  });
}

function splitChineseTokens(keywords) {
  const r=[];
  for(const kw of keywords){r.push(kw);if(/^[\u4e00-\u9fff]+$/.test(kw)&&kw.length>=3){for(let i=0;i<=kw.length-2;i++){const sub=kw.substring(i,i+2);if(KEYWORD_TAG_MAP[sub])r.push(sub);}}}
  return [...new Set(r)];
}

function matchTags(keywords, hospitalTags) {
  let score=0; const matched=[];
  for(const kw of keywords){const kl=kw.toLowerCase();if(KEYWORD_TAG_MAP[kl]){for(const tt of KEYWORD_TAG_MAP[kl]){if(hospitalTags.includes(tt)){score+=2;if(!matched.includes(tt))matched.push(tt);}}}if(hospitalTags.includes(kl)){score+=3;if(!matched.includes(kl))matched.push(kl);}}
  return {score,matched};
}

function findPrice(keywords) {
  for(const kw of keywords){const kl=kw.toLowerCase();for(const [pk,pv] of Object.entries(PRICE_DB)){if(kl.includes(pk.toLowerCase())||pk.toLowerCase().includes(kl))return pv;}}
  return null;
}

function screenHospitals(hospitals, keywords, cityFilter, minTrust) {
  cityFilter = cityFilter || null;
  minTrust = minTrust || 0.75;
  const results=[];
  for(const h of hospitals){if(cityFilter&&h.City.toLowerCase()!==cityFilter.toLowerCase())continue;if(h.Trust_Score<minTrust)continue;const {score,matched}=matchTags(keywords,h.Tags);if(score>0)results.push({hospital:h,score,matched_tags:matched});}
  results.sort((a,b)=>(b.score+b.hospital.Trust_Score*2)-(a.score+a.hospital.Trust_Score*2));
  return results;
}

function getHospitalDesc(id) {
  if (HOSPITAL_DESCRIPTIONS[id]) return HOSPITAL_DESCRIPTIONS[id];
  return { oneLiner: "中国顶级三甲医院，值得信赖", whyRecommend: ["中国三级甲等医院", "国际部可接待外国患者"], watchOut: [] };
}

function getCityGuide(cityName) {
  if (CITY_LIFESTYLE_GUIDES[cityName]) return CITY_LIFESTYLE_GUIDES[cityName];
  return { accommodation: "请联系我们获取详细信息", food: "请联系我们获取详细信息", companion: "请联系我们获取详细信息", communication: "请联系我们获取详细信息", tourism: "请联系我们获取详细信息" };
}

function parseArgs(args) {
  const opts = { name: "", caseStr: "", city: "", mode: "" };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && i+1<args.length) { opts.name = args[++i]; }
    else if (args[i] === "--case" && i+1<args.length) { opts.caseStr = args[++i]; }
    else if (args[i] === "--city" && i+1<args.length) { opts.city = args[++i]; }
    else if (args[i] === "--basic") { opts.mode = "basic"; }
    else if (args[i] === "--premium") { opts.mode = "premium"; }
    else if (args[i] === "--nationality" && i+1<args.length) { opts.nationality = args[++i]; }
    else if (args[i] === "--diagnosis" && i+1<args.length) { opts.diagnosis = args[++i]; }
    else if (args[i] === "--needs" && i+1<args.length) { opts.needs = args[++i]; }
    else if (args[i] === "--budget" && i+1<args.length) { opts.budget = args[++i]; }
    else if (args[i] === "--timeline" && i+1<args.length) { opts.timeline = args[++i]; }
  }
  return opts;
}


// ========== MD TEXT REPORT (download) ==========
function generateBasicMDText(results, keywords, city, opts) {
  city = city || "不限";
  const priceInfo = findPrice(keywords);
  const dateStr = new Date().toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric"});
  const clientName = opts.name || "客户";
  const top3 = results.slice(0,3);
  const medals = ["🥇 首选推荐", "🥈 备选推荐", "🥉 第三选择"];
  let md = "";

  // Title
  md += "# 中国医疗旅游医院推荐报告 · 基础版\n";
  md += "> **China Hospitals Guide** — Hospital Match & Plan (\$49)\n\n---\n\n";

  // Letter
  md += "## 🌿 致客户的一封信\n\n";
  md += "你好，" + clientName + "！\n\n";
  md += "感谢你选择我们的基础版推荐报告。\n\n";
  md += "这份报告帮你做了一件事：从中国51家顶级医院中筛出最适合你的，并让你对它们有一个真实的感受——不只是排名和电话，而是“这家医院是什么性格的”、“适合什么样的患者”。\n\n";
  md += "如果你看完后觉得需要更深入的帮助——比如帮你发病历、跟进回复、翻译协调、接机安排——我们也有完整的协调服务（参见文末的“升级服务”部分）。\n\n";
  md += "祝你早日康复。\n\n";
  md += "*—— China Hospitals Guide 团队*\n\n---\n\n";

  // Hospital recommendations
  md += "## 🏥 推荐医院\n\n";
  top3.forEach(function(r,i){
    var h=r.hospital, desc=getHospitalDesc(h.ID), guide=getCityGuide(h.City);
    md += "### " + h.Name_ZH + "（" + h.Name_EN + "）\n\n";
    md += "> 💬 *" + desc.oneLiner + "*\n\n";
    md += "| | |\n|---|---|\n";
    md += "| **专科优势** | " + esc(h.tagsStr) + " |\n";
    md += "| **排名/评级** | 🏅 " + esc(h.Rank) + " |\n";
    md += "| **地址** | " + esc(h.Address) + " |\n";
    md += "| **电话** | 📞 " + esc(h.Phone) + " |\n";
    md += "| **网站** | " + esc(h.Website) + " |\n";
    md += "| **国际部** | " + (h.International==="True"?"✅ 有（双语协调员）":"❌ 无") + " |\n\n";
    md += "**为什么推荐这家医院：**\n\n";
    desc.whyRecommend.forEach(function(w){ md += "- " + w + "\n"; });
    if (desc.watchOut&&desc.watchOut.length>0) {
      md += "\n**需要注意：**\n\n";
      desc.watchOut.forEach(function(w){ md += "- " + w + "\n"; });
    }
    md += "\n---\n\n";
  });

  // City guide
  if (city !== "不限") {
    md += "## ✈️ 城市交通与生活指南\n\n";
    var uniqueCities = [...new Set(top3.map(function(r){ return r.hospital.City; }))];
    uniqueCities.forEach(function(c){
      var guide=getCityGuide(c);
      md += "### 📍 " + c + "\n\n";
      md += "- **住宿：** " + guide.accommodation + "\n";
      md += "- **饮食：** " + guide.food + "\n";
      md += "- **陪护家属：** " + guide.companion + "\n";
      md += "- **通信：** " + guide.communication + "\n";
      md += "- **旅游：** " + guide.tourism + "\n\n";
    });
    md += "---\n\n";
  }

  // Checklist
  md += "## 📋 行前准备清单\n\n";
  md += "必带的材料：\n\n";
  md += "- 原始病历 + 影像资料（CT/MRI光盘或U盘）\n";
  md += "- 正在服用的药物（带足量 + 英文说明书）\n";
  md += "- 护照（有效期6个月以上）\n";
  md += "- 信用卡（Visa/Mastercard）+ 少量现金\n";
  md += "- 手机开通国际漫游或到达后买中国电话卡\n";
  md += "- 转换插头（中国标准：两脚扁型，220V）\n\n";
  md += "> 📱 **提示：** 下载支付宝App，绑定国际信用卡\n\n---\n\n";

  // Upgrade
  md += "## ⬆️ 升级服务：以下均属「Pre-Arrival Coordination (\$399)」，基础版不包含\n\n";
  md += "| 阶段 | 服务内容 |\n|-------|----------|\n";
  md += "| **需求确认** | 一对一顾问对接、精准匹配 |\n";
  md += "| **医院对接** | 代发病历、翻译、跟进、多院对比 |\n";
  md += "| **行前准备** | 签证指导、预约锁定、住宿建议、接机 |\n";
  md += "| **治疗期间** | 沟通衔接、突发协调、紧急电话 |\n";
  md += "| **出院回国** | 中英文病历、用药说明、复查预约、远程随访 |\n\n";
  md += "> \$49 的费用可以抵扣升级，只需补差价。\n\n---\n\n";

  // FAQ
  md += "## ❓ 常见问题\n\n";
  md += "### Q: 这份报告和 \$399 的升级版有什么区别？\n\n";
  md += "\$49 报告给你精准的医院推荐、交通指南和行前清单。\$399 升级版是我们帮你做一切。\n\n";
  md += "### Q: 我可以先买 \$49，后续再升级吗？\n\n";
  md += "可以。\$49 的费用可以抵扣升级费用，只需补差价。\n\n";
  md += "### Q: 中国医院的卫生条件和水平怎么样？\n\n";
  md += "本报告推荐的医院均为中国三级甲等医院（最高级别），其中多家通过 JCI 国际认证。\n\n---\n\n";

  md += "*感谢你选择 China Hospitals Guide。祝你早日康复。 🌿*\n";
  return md;
}

function generatePremiumMDText(results, keywords, city, opts) {
  city = city || "不限";
  const priceInfo = findPrice(keywords);
  const dateStr = new Date().toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric"});
  const clientName = opts.name || "客户";
  const top3 = results.slice(0,3);
  const medals = ["🥇 首选推荐", "🥈 备选推荐", "🥉 第三选择"];
  let md = "";

  md += "# 🏥 中国医疗旅游医院推荐报告\n\n";
  md += "> **致：** " + clientName + "\n";
  md += "> **病症：** " + (opts.diagnosis || opts.caseStr || "待确认") + "\n";
  md += "> **日期：** " + dateStr + "\n";
  md += "> **制作者：** China Hospitals Guide 团队\n\n---\n\n";

  md += "## 🌿 致客户的一封信\n\n";
  md += "你好，" + clientName + "，\n\n";
  md += "感谢你选择 China Hospitals Guide。\n\n";
  md += "这份报告就是为了回答你真正关心的问题而写的。\n\n";
  md += "我们根据你的病情，从全国51家顶级医院中筛选出了 **2-3家最适合你的医院**。\n\n";
  md += "**这不是中介服务，这是有人帮你开路。**\n\n";
  md += "祝你早日康复。\n\n";
  md += "*—— China Hospitals Guide 团队*\n\n---\n\n";

  md += "## 📋 客户情况概要\n\n";
  md += "| 项目 | 内容 |\n|------|------|\n";
  md += "| **姓名** | " + clientName + " |\n";
  md += "| **国籍** | " + (opts.nationality || "待补充") + " |\n";
  md += "| **诊断** | " + (opts.diagnosis || opts.caseStr || "待补充") + " |\n";
  md += "| **偏好城市** | " + city + " |\n";
  md += "| **预算范围** | " + (opts.budget || "待补充") + " |\n";
  md += "| **就诊时间** | " + (opts.timeline || "待补充") + " |\n\n---\n\n";

  md += "## 🏆 推荐医院（共" + top3.length + "家）\n\n";
  top3.forEach(function(r,i){
    var h=r.hospital, desc=getHospitalDesc(h.ID), guide=getCityGuide(h.City);
    md += "### " + medals[i] + " ⭐ " + h.Name_ZH + "（" + h.Name_EN + "）\n\n";
    md += "*" + h.City + " · " + h.Rank + "*\n\n";
    md += "> 💬 *\"" + desc.oneLiner + "\"*\n\n";
    md += "#### 为什么这家医院适合你\n\n";
    desc.whyRecommend.forEach(function(w){ md += "- " + w + "\n"; });
    md += "\n#### 医院概况\n\n";
    md += "| 字段 | 内容 |\n|------|------|\n";
    md += "| **中文全称** | " + h.Name_ZH + " |\n";
    md += "| **英文名称** | " + h.Name_EN + " |\n";
    md += "| **排名** | " + esc(h.Rank) + " |\n";
    md += "| **地址** | " + esc(h.Address) + " |\n";
    md += "| **机场交通** | " + esc(h.Airport_Info) + " |\n\n";
    if (h.International === "True") {
      md += "#### 国际部联系方式\n\n";
      md += "| 方式 | 信息 |\n|------|------|\n";
      md += "| 📞 **电话** | " + h.Phone + " |\n";
      md += "| 🌐 **网站** | " + h.Website + " |\n\n";
    }
    if (priceInfo) {
      md += "#### 费用参考\n\n";
      md += "| 项目 | 价格 |\n|------|------|\n";
      md += "| **中国估计费用** | " + priceInfo.cn + " |\n";
      md += "| **美国典型费用** | " + priceInfo.us + " |\n";
      md += "| **节省** | **" + priceInfo.save + "** |\n\n";
    }
    md += "#### 周边生活指南\n\n";
    md += "- 住宿：" + guide.accommodation + "\n";
    md += "- 饮食：" + guide.food + "\n";
    md += "- 陪护：" + guide.companion + "\n";
    md += "- 通信：" + guide.communication + "\n";
    md += "- 旅游：" + guide.tourism + "\n\n";
    if (desc.watchOut && desc.watchOut.length > 0) {
      md += "#### 需要留意的地方\n\n";
      desc.watchOut.forEach(function(w){ md += "- " + w + "\n"; });
      md += "\n";
    }
    md += "---\n\n";
  });

  if (top3.length >= 2) {
    md += "## 📊 三家医院对比一览表\n\n";
    md += "| 对比项 | " + top3.map(function(r,i){ return medals[i]; }).join(" | ") + " |\n";
    md += "|--------|" + top3.map(function(){ return "------"; }).join("|") + "|\n";
    md += "| **城市** | " + top3.map(function(r){ return r.hospital.City; }).join(" | ") + " |\n";
    md += "| **排名** | " + top3.map(function(r){ return r.hospital.Rank; }).join(" | ") + " |\n";
    md += "| **国际部** | " + top3.map(function(r){ return r.hospital.International==="True"?"✅":"❌"; }).join(" | ") + " |\n\n---\n\n";
  }

  md += "## 🚀 服务流程（6步）\n\n";
  md += "第1步：需求确认 → 第2步：医院对接 → 第3步：行前准备 → 第4步：治疗期间 → 第5步：出院回国 → 第6步：远程随访\n\n---\n\n";

  md += "## 💎 为什么选择我们\n\n";
  md += "| 场景 | 自己联系 | 通过我们 |\n|------|---------|--------|\n";
  md += "| 语言 | 自己发邮件 | 我们翻译跟进 |\n";
  md += "| 选医院 | 网上查 | 51家里筛 |\n";
  md += "| 遇问题 | 自己沟通 | 我们协调 |\n";
  md += "| 回国后 | 医生不记得 | 档案+随访 |\n";
  md += "| 费用 | 标准价 | 确认明细 |\n\n---\n\n";

  md += "## ❓ 常见问题\n\n";
  md += "### Q: 和医院中介有什么区别？\n\n";
  md += "我们不是中介，不赚取医院差价。我们是帮你在中国医疗体系中找到最佳路径。\n\n";
  md += "### Q: \$399包含什么？\n\n";
  md += "需求确认、医院对接、行前准备、治疗期间协调、出院回国全流程。医院治疗费用直接付给医院，不经我们手。\n\n---\n\n";

  md += "## 📄 关于 China Hospitals Guide\n\n";
  md += "| 项目 | 内容 |\n|------|------|\n";
  md += "| **网站** | chinahospitalsguide.com |\n";
  md += "| **覆盖范围** | 10个城市、51家中国顶级医院 |\n\n";
  md += "*感谢你选择 China Hospitals Guide。祝你早日康复。 🌿*\n";
  return md;
}
// ========== SHARED HTML CSS ==========
function generateTextReport(results, keywords, city, opts) {
  city=city||"不限"; const priceInfo=findPrice(keywords);
  const now=new Date().toISOString().slice(0,16).replace("T"," ");
  let out="";
  out+="=".repeat(60)+"\n";
  out+="  China Hospitals Guide \u2014 \u4E2A\u6027\u5316\u533B\u9662\u63A8\u8350\u62A5\u544A\n";
  out+="=".repeat(60)+"\n";
  if(opts.name)out+="  \u60A3\u8005: "+opts.name+"\n";
  out+="  \u751F\u6210\u65F6\u95F4: "+now+"\n  \u5173\u952E\u8BCD: "+keywords.join(", ")+"\n  \u57CE\u5E02: "+city+"\n";
  out+="  \u5339\u914D: "+results.length+" \u5BB6\n\n";
  if(priceInfo){out+="\u3010\u4EF7\u683C\u53C2\u8003\u3011\n  \u4E2D\u56FD: "+priceInfo.cn+"\n  \u7F8E\u56FD: "+priceInfo.us+"\n  \u8282\u7701: "+priceInfo.save+"\n\n";}
  out+="\u3010\u63A8\u8350\u533B\u9662\u3011\n";
  results.forEach((r,i)=>{
    const h=r.hospital; const desc=getHospitalDesc(h.ID);
    out+="\n"+(i+1)+". "+h.Name_ZH+" ("+h.Name_EN+")\n";
    out+="   \u57CE\u5E02: "+h.City+" | "+h.Rank+"\n";
    out+="   \u7535\u8BDD: "+h.Phone+"\n";
    out+="   \u7F51\u7AD9: "+h.Website+"\n";
    out+="   \u5730\u5740: "+h.Address+"\n";
  });
  out+="\n"+"=".repeat(60)+"\n";
  out+="  chinahospitalsguide.com | \u4EF7\u683C\u4EC5\u4F9B\u53C2\u8003\n";
  out+="=".repeat(60)+"\n";
  return out;
}

// ========== SHARED HTML CSS ==========
function sharedCSS() {
  return `
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Segoe UI','PingFang SC','Microsoft YaHei',system-ui,sans-serif;color:#1a1a2e;background:#f0f2f5;line-height:1.7;}
  .report{max-width:960px;margin:0 auto;background:#fff;box-shadow:0 4px 30px rgba(0,0,0,0.08);}

  .hero{background:linear-gradient(135deg,#0a1628 0%,#122647 40%,#1a3a6b 100%);color:#fff;padding:56px 56px 48px;position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:-80px;right:-80px;width:300px;height:300px;border:2px solid rgba(255,255,255,0.06);border-radius:50%;}
  .hero::after{content:'';position:absolute;bottom:-60px;left:40%;width:200px;height:200px;border:2px solid rgba(255,255,255,0.04);border-radius:50%;}
  .hero-badge{display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:8px 20px;border-radius:24px;font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px;}
  .hero h1{font-size:2.2rem;font-weight:800;line-height:1.35;margin-bottom:12px;position:relative;z-index:1;}
  .hero .hero-sub{font-size:1.05rem;opacity:0.7;font-weight:400;position:relative;z-index:1;}
  .hero .hero-meta{display:flex;gap:30px;margin-top:28px;flex-wrap:wrap;position:relative;z-index:1;}
  .hero .hero-meta span{font-size:0.85rem;opacity:0.75;}

  .content{padding:48px 56px;}

  .section{margin-bottom:48px;}
  .section-title{font-size:1.25rem;font-weight:700;color:#1a3a6b;margin-bottom:24px;padding-bottom:14px;border-bottom:2px solid #e8ecf1;}

  .hospital-card{background:#fff;border:1px solid #e8ecf1;border-radius:14px;padding:32px;margin-bottom:20px;position:relative;transition:box-shadow 0.2s;}
  .hospital-card:hover{box-shadow:0 6px 24px rgba(0,0,0,0.07);}
  .card-rank{position:absolute;top:-14px;left:28px;width:36px;height:36px;border-radius:50%;background:#1a3a6b;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1rem;}
  .top-badge{display:inline-block;background:#1a3a6b;color:#fff;padding:4px 14px;border-radius:20px;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;margin-bottom:10px;}
  .top-badge.alt{background:#2d6a4f;}
  .card-header h3{font-size:1.2rem;font-weight:800;color:#1a3a6b;}
  .card-header .card-en{font-size:0.85rem;color:#888;}
  .card-location{font-size:0.85rem;color:#555;margin-top:4px;}
  .card-ranking{font-size:0.9rem;color:#1a3a6b;font-weight:600;margin-top:6px;}
  .card-certs{margin-top:8px;display:flex;gap:10px;flex-wrap:wrap;}
  .cert{font-size:0.78rem;padding:3px 10px;border-radius:12px;font-weight:600;}
  .cert.intl{background:#e3f2fd;color:#1565c0;}
  .cert.jci{background:#e8f5e9;color:#2e7d32;}
  .card-tags{margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;}
  .tag{font-size:0.72rem;background:#f0f2f5;padding:3px 10px;border-radius:10px;color:#555;}
  .card-details{width:100%;border-collapse:collapse;margin-top:16px;font-size:0.85rem;}
  .card-details td{padding:6px 0;border-bottom:1px solid #f5f5f5;}
  .card-details .dl{width:120px;color:#888;font-weight:600;}
  .card-details a{color:#1a3a6b;text-decoration:underline;}

  .one-liner{background:#f8f9fb;border-left:4px solid #1a3a6b;padding:12px 16px;margin:14px 0;font-size:0.9rem;color:#444;font-style:italic;border-radius:0 8px 8px 0;}
  .why-recommend{margin-top:16px;}
  .why-recommend h4{font-size:0.95rem;font-weight:700;color:#1a3a6b;margin-bottom:8px;}
  .why-recommend ul{list-style:none;padding:0;}
  .why-recommend li{padding:4px 0;padding-left:20px;position:relative;font-size:0.87rem;color:#444;}
  .why-recommend li::before{content:'\u2714\\00A0';position:absolute;left:0;color:#27ae60;font-weight:700;}

  .price-section{display:flex;align-items:stretch;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.04);margin-bottom:32px;}
  .price-card{flex:1;padding:36px 28px;text-align:center;}
  .price-card.china{background:linear-gradient(135deg,#e8f5e9,#c8e6c9);}
  .price-card.us{background:linear-gradient(135deg,#fff3e0,#ffe0b2);}
  .price-flag{font-size:2rem;margin-bottom:8px;}
  .price-label{font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;color:#666;margin-bottom:10px;}
  .price-value{font-size:1.6rem;font-weight:800;color:#1a1a2e;margin-bottom:4px;}
  .price-note{font-size:0.78rem;color:#888;}
  .price-save{display:flex;align-items:center;justify-content:center;background:#fff;padding:0 16px;min-width:100px;}
  .save-circle{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#e74c3c,#c0392b);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:0.7rem;line-height:1.3;text-align:center;}
  .save-circle strong{font-size:1.1rem;}

  .info-table{width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:16px;}
  .info-table th{text-align:left;padding:12px 16px;background:#f8f9fb;color:#555;font-weight:600;border-bottom:2px solid #e8ecf1;width:30%;}
  .info-table td{padding:10px 16px;border-bottom:1px solid #f0f2f5;}
  .info-table tr:hover td{background:#fafbfc;}

  .steps-table{width:100%;border-collapse:collapse;font-size:0.87rem;}
  .steps-table th{text-align:left;padding:12px 16px;background:#f8f9fb;color:#555;font-weight:600;border-bottom:2px solid #e8ecf1;}
  .steps-table td{padding:10px 16px;border-bottom:1px solid #f0f2f5;vertical-align:top;}
  .steps-table tr:hover td{background:#fafbfc;}

  .compare-table{width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:16px;}
  .compare-table th{text-align:left;padding:12px 16px;background:#1a3a6b;color:#fff;font-weight:600;}
  .compare-table td{padding:10px 16px;border-bottom:1px solid #e8ecf1;}
  .compare-table tr:hover td{background:#fafbfc;}
  .compare-table .medal{font-size:1.2rem;}

  .why-us-table{width:100%;border-collapse:collapse;font-size:0.87rem;margin-bottom:16px;}
  .why-us-table th{text-align:left;padding:12px 16px;background:#f8f9fb;color:#555;font-weight:600;border-bottom:2px solid #e8ecf1;}
  .why-us-table td{padding:10px 16px;border-bottom:1px solid #f0f2f5;}
  .why-us-table .col-bad{color:#c0392b;}
  .why-us-table .col-good{color:#27ae60;font-weight:600;}

  .download-section{background:#f8f9fb;border-radius:14px;padding:28px 32px;text-align:center;margin-top:48px;border:1px solid #e8ecf1;}
  .download-section p{font-size:0.9rem;color:#666;margin-bottom:12px;}
  .btn-download{display:inline-block;background:#1a3a6b;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.95rem;transition:background 0.2s;cursor:pointer;border:none;}
  .btn-download:hover{background:#244d8a;}

  .report-footer{background:#f8f9fb;border-top:1px solid #e8ecf1;padding:28px 56px;text-align:center;font-size:0.8rem;color:#999;}
  .report-footer a{color:#1a3a6b;text-decoration:none;font-weight:600;}

  .disclaimer{background:#fff8e1;border-left:4px solid #ffc107;padding:16px 20px;border-radius:0 8px 8px 0;font-size:0.82rem;color:#856404;margin-top:32px;}

  .letter{background:#f8f9fb;border-radius:12px;padding:24px 28px;font-size:0.9rem;line-height:1.9;color:#444;margin-bottom:32px;}
  .letter p{margin-bottom:10px;}

  .faq-item{margin-bottom:16px;}
  .faq-item .q{font-weight:700;color:#1a3a6b;font-size:0.92rem;margin-bottom:4px;}
  .faq-item .a{font-size:0.87rem;color:#555;padding-left:16px;}

  .about-card{background:#f8f9fb;border-radius:12px;padding:24px 28px;margin-top:32px;}

  .watch-out{background:#fff3e0;border-left:4px solid #ff9800;padding:14px 18px;border-radius:0 8px 8px 0;font-size:0.85rem;color:#e65100;margin-top:16px;}
  .watch-out strong{display:block;margin-bottom:6px;}

  @media(max-width:640px){
    .hero{padding:36px 24px 32px;}.hero h1{font-size:1.5rem;}
    .content{padding:28px 20px;}
    .price-section{flex-direction:column;}.price-save{padding:16px;}
    .card-details .dl{width:90px;}
    .report-footer{padding:20px;}
  }
  @media print{body{background:#fff;}.report{box-shadow:none;max-width:100%;}.hero{background:#1a3a6b!important;-webkit-print-color-adjust:exact;}.hospital-card{break-inside:avoid;}}
`;
}

// ========== BASIC REPORT ==========
﻿
// ========== BASIC REPORT (Premium-level data, clear upgrade markers) ==========
function renderReport(results, keywords, city, opts) {
  const isBasic = opts.mode === "basic";
  city = city || "不限";
  const priceInfo = findPrice(keywords);
  const dateStr = new Date().toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric"});
  const title = keywords.slice(0,3).join(" / ");
  const top3 = results.slice(0,3);
  const clientName = opts.name || "客户";
  const medals = ["🥇 首选推荐","🥈 备选推荐","🥉 第三选择"];
  const textReport = isBasic ? generateBasicMDText(results, keywords, city, opts) : generatePremiumMDText(results, keywords, city, opts);
  const textEncoded = Buffer.from(textReport).toString("base64");

  // --- Summary ---
  const summaryHtml = "<div class=\"section\">" +
    "<h2 class=\"section-title\">📋 客户情况概要</h2>" +
    "<table class=\"info-table\">" +
    "<tr><th>姓名</th><td>"+esc(opts.name||"待补充")+"</td></tr>" +
    "<tr><th>国籍</th><td>"+esc(opts.nationality||"待补充")+"</td></tr>" +
    "<tr><th>诊断</th><td>"+esc(opts.diagnosis||opts.caseStr||"待补充")+"</td></tr>" +
    "<tr><th>主要需求</th><td>"+esc(opts.needs||"待补充")+"</td></tr>" +
    "<tr><th>偏好城市</th><td>"+esc(city)+"</td></tr>" +
    "<tr><th>预算范围</th><td>"+esc(opts.budget||"待补充")+"</td></tr>" +
    "<tr><th>就诊时间</th><td>"+esc(opts.timeline||"待补充")+"</td></tr>" +
    "</table></div>";

  // --- Price ---
  var priceHtml = "";
  if (priceInfo) priceHtml = "<div class=\"section\">" +
    "<h2 class=\"section-title\">💰 费用对比（中国 vs 美国）</h2>" +
    "<div class=\"price-section\">" +
    "<div class=\"price-card china\"><div class=\"price-flag\">🇨🇳</div><div class=\"price-label\">中国估计费用</div><div class=\"price-value\">"+esc(priceInfo.cn)+"</div><div class=\"price-note\">世界级医院</div></div>" +
    "<div class=\"price-save\"><div class=\"save-circle\">节省<br><strong>"+esc(priceInfo.save)+"</strong></div></div>" +
    "<div class=\"price-card us\"><div class=\"price-flag\">🇺🇸</div><div class=\"price-label\">美国典型费用</div><div class=\"price-value\">"+esc(priceInfo.us)+"</div><div class=\"price-note\">同等质量</div></div>" +
    "</div></div>";

  // --- Hospital cards ---
  var cardsHtml = top3.map(function(r,i){
    var h=r.hospital, desc=getHospitalDesc(h.ID), guide=getCityGuide(h.City);
    var intlParts=[];
    if (h.International==="True") intlParts.push("<h4 style=\"font-size:1rem;color:#1a3a6b;margin-top:20px;\">联系方式</h4><table class=\"info-table\"><tr><th>📞 电话</th><td>"+esc(h.Phone)+"</td></tr><tr><th>🌐 网站</th><td><a href=\""+esc(h.Website)+"\" target=\"_blank\">"+esc(h.Website)+"</a></td></tr><tr><th>✅ 国际患者接待</th><td>有专属国际部</td></tr></table>");
    var priceParts=[];
    if (priceInfo) priceParts.push("<h4 style=\"font-size:1rem;color:#1a3a6b;margin-top:20px;\">费用参考</h4><table class=\"info-table\"><tr><th>中国估计费用</th><td>"+esc(priceInfo.cn)+"</td></tr><tr><th>美国典型费用</th><td>"+esc(priceInfo.us)+"</td></tr><tr><th>节省</th><td><strong style=\"color:#27ae60;\">"+esc(priceInfo.save)+"</strong></td></tr></table><p style=\"font-size:0.78rem;color:#888;\">⚠️ 以上为自费参考价。具体以医院正式报价为准。</p>");
    var watchParts=[];
    if (desc.watchOut&&desc.watchOut.length>0) watchParts.push("<div class=\"watch-out\"><strong>需要留意的地方</strong><p style=\"margin:0;\">我们不说假话——这家医院不是适合所有人：</p><ul style=\"margin:8px 0 0 16px;font-size:0.85rem;\">"+desc.watchOut.map(function(w){return "<li>"+esc(w)+"</li>"}).join("")+"</ul></div>");
    return "<div class=\"section\">" +
      "<h2 class=\"section-title\">"+medals[i]+" ⭐ "+esc(h.Name_ZH)+"</h2>" +
      "<p style=\"color:#888;font-size:0.85rem;\">📍 "+esc(h.City)+" · "+esc(h.Rank)+"</p>" +
      "<div class=\"one-liner\">💬 <em>\""+esc(desc.oneLiner)+"\"</em></div>" +
      "<div class=\"why-recommend\" style=\"margin-bottom:16px;\"><h4>为什么推荐这家医院：</h4><ul>"+desc.whyRecommend.map(function(w){return "<li>"+esc(w)+"</li>"}).join("")+"</ul></div>" +
      "<h4 style=\"font-size:1rem;color:#1a3a6b;margin-top:20px;\">医院概况</h4><table class=\"info-table\">" +
      "<tr><th>中文全称</th><td>"+esc(h.Name_ZH)+"</td></tr>" +
      "<tr><th>英文名称</th><td>"+esc(h.Name_EN)+"</td></tr>" +
      "<tr><th>医院等级</th><td>三级甲等</td></tr>" +
      "<tr><th>排名</th><td>"+esc(h.Rank)+"</td></tr>" +
      "<tr><th>专科优势</th><td>"+esc(h.tagsStr)+"</td></tr>" +
      "<tr><th>地址</th><td>"+esc(h.Address)+"</td></tr>" +
      "<tr><th>机场交通</th><td>"+esc(h.Airport_Info)+"</td></tr>" +
      "</table>" + intlParts.join("") + priceParts.join("") +
      "<h4 style=\"font-size:1rem;color:#1a3a6b;margin-top:20px;\">周边生活指南</h4><table class=\"info-table\">" +
      "<tr><th>附近住宿</th><td>"+esc(guide.accommodation)+"</td></tr>" +
      "<tr><th>饮食</th><td>"+esc(guide.food)+"</td></tr>" +
      "<tr><th>陪护家属</th><td>"+esc(guide.companion)+"</td></tr>" +
      "<tr><th>通信</th><td>"+esc(guide.communication)+"</td></tr>" +
      "<tr><th>旅游</th><td>"+esc(guide.tourism)+"</td></tr>" +
      "</table>" + watchParts.join("") + "</div>";
  }).join("\n");

  // --- Comparison table ---
  var compareHtml = "";
  if (top3.length>=2) compareHtml = "<div class=\"section\"><h2 class=\"section-title\">📊 三家医院对比一览表</h2><table class=\"compare-table\"><tr><th>对比项</th>"+top3.map(function(r,i){return "<th>"+medals[i]+"</th>"}).join("")+"</tr>" +
    "<tr><td><strong>城市</strong></td>"+top3.map(function(r){return "<td>"+esc(r.hospital.City)+"</td>"}).join("")+"</tr>" +
    "<tr><td><strong>定位</strong></td>"+top3.map(function(r){return "<td>"+esc(r.hospital.Rank)+"</td>"}).join("")+"</tr>" +
    "<tr><td><strong>国际部</strong></td>"+top3.map(function(r){return "<td>"+(r.hospital.International==="True"?"✅ 有":"❌ 无")+"</td>"}).join("")+"</tr>" +
    "<tr><td><strong>JCI认证</strong></td>"+top3.map(function(r){return "<td>"+(r.hospital.JCI==="True"?"✅ 有":"❌ 无")+"</td>"}).join("")+"</tr>" +
    "<tr><td><strong>信任度</strong></td>"+top3.map(function(r){return "<td>"+Math.round(r.hospital.Trust_Score*100)+"%</td>"}).join("")+"</tr>" +
    "</table></div>";
  // --- Conditional: letter ---
  var letterHtml;
  if (isBasic) {
    letterHtml = "<div class=\"letter\">" +
      "<p>你好，"+esc(clientName)+"，</p>" +
      "<p>感谢你选择 China Hospitals Guide 的基础版推荐报告。</p>" +
      "<p>这份报告从中国51家顶级医院中为你筛选了<strong>最匹配的2-3家医院</strong>，并提供了<strong>尽可能详尽的资料</strong>——包括医院概况、费用参考、生活指南、甚至每家医院的注意事项。我们没有因为这是基础版就藏着掖着。</p>" +
      "<p>因为对我们来说，<strong>真正的成本在后端</strong>——帮你跟医院沟通、翻译病历、协调就诊、接机安排。那份人工和时间，才是我们值钱的地方。</p>" +
      "<p>所以我们选择把全部信息都摆在你面前。你完全可以拿着这份报告自己去联系医院。如果看完后觉得需要有人帮你搞定后面的事，我们也准备好了——文末有详细的升级服务说明。</p>" +
      "<p>祝你早日康复。</p>" +
      "<p><em>—— China Hospitals Guide 团队</em></p></div>";
  } else {
    letterHtml = "<div class=\"letter\">" +
      "<p>你好，"+esc(clientName)+"，</p>" +
      "<p>感谢你选择 China Hospitals Guide。</p>" +
      "<p>我们知道，读到这份报告的时候，你心里装的不是\u201C\u6392\u540d\u7b2c\u51e0\u201D的问题——而是更真实的那些：</p>" +
      "<ul style=\"margin:8px 0 8px 16px;font-size:0.87rem;line-height:2;\">" +
      "<li><strong>\u201C我去了中国，真的有人接我吗？\u201D</strong></li>" +
      "<li><strong>\u201C医生能跟我直接沟通吗？\u201D</strong></li>" +
      "<li><strong>\u201C如果出了问题，谁帮我协调？\u201D</strong></li>" +
      "<li><strong>\u201C在一个陌生的国家住院几周，我应付得来吗？\u201D</strong></li>" +
      "</ul>" +
      "<p>这份报告，就是为了回答这些真实的问题而写的。</p>" +
      "<p>我们根据你的病情，从全国51家顶级医院中筛选出了 <strong>2-3家最适合你的医院</strong>，每一家都附上了详细的就诊指南。更重要的是——<strong>这不是一份让你自己打电话的资料。</strong>从你确认选择的那一刻起，我们会全程协助你完成每一步。</p>" +
      "<p><strong>这不是中介服务，这是有人帮你开路。</strong></p>" +
      "<p>祝你早日康复。</p>" +
      "<p><em>—— China Hospitals Guide 团队</em></p></div>";
  }
  // --- Conditional: how-to (basic only) ---
  var howToHtml = ""; // removed "how to use" per user request
  // --- Conditional: bottom section ---
  var bottomHtml;
  if (isBasic) {
    bottomHtml = "<div class=\"upgrade-section\">" +
      "<h2 class=\"section-title\" style=\"border-bottom-color:rgba(255,255,255,0.2);\">⬆️ 升级服务：从「资料在手」到「有人帮你开路」</h2>" +
      "<p style=\"font-size:0.9rem;margin-bottom:20px;color:rgba(255,255,255,0.8);\">你现在拿到的这份 <strong>$49</strong> 报告，已经把医院的所有关键资料都展示给你了——你完全可以自己联系医院。<br>如果你希望有人帮你搞定后面所有的事，以下是 <strong>$399</strong> 升级服务的完整内容：</p>" +
      "<table class=\"upgrade-table\"><tr><th>服务阶段</th><th>$49 基础版</th><th>$399 升级版</th></tr>" +
      "<tr><td><strong>📋 医院资料</strong></td><td class=\"included\">✅ 完整资料展示</td><td class=\"included\">✅ 完整资料 + 个性化调整</td></tr>" +
      "<tr><td><strong>📞 医院对接</strong></td><td style=\"color:rgba(255,255,255,0.5);\">自己联系</td><td class=\"premium-only\">⭐ 代发病历 · 翻译 · 跟进回复 · 多院对比报价</td></tr>" +
      "<tr><td><strong>✈️ 行前准备</strong></td><td style=\"color:rgba(255,255,255,0.5);\">自己安排</td><td class=\"premium-only\">⭐ 签证指导 · 预约锁定 · 住宿建议 · 接机安排</td></tr>" +
      "<tr><td><strong>🏥 治疗期间</strong></td><td style=\"color:rgba(255,255,255,0.5);\">自己应对</td><td class=\"premium-only\">⭐ 医院沟通衔接 · 突发协调 · 紧急联系电话</td></tr>" +
      "<tr><td><strong>🏠 出院回国</strong></td><td style=\"color:rgba(255,255,255,0.5);\">自己整理</td><td class=\"premium-only\">⭐ 中英文病历 · 用药说明 · 复查预约 · 远程随访衔接</td></tr>" +
      "</table>" +
      "<div class=\"cta-box\"><p>📦 <strong>$399 Pre-Arrival Coordination</strong> — 从确认选择的那一刻起，全程有人帮你开路。</p><p style=\"font-size:0.85rem;color:rgba(255,255,255,0.7);\">$49 的费用可以抵扣升级，只需补差价。</p></div></div>";
  } else {
    bottomHtml = "<div class=\"section\"><h2 class=\"section-title\">🚀 服务流程</h2>" +
      "<h3 style=\"font-size:1rem;color:#1a3a6b;margin-top:16px;\">第1步：需求确认</h3><table class=\"info-table\"><tr><th>你做什么</th><td>提供病历和需求信息</td></tr><tr><th>我们做什么</th><td>✅ 一对一顾问对接（$399已包含）<br>✅ 精准匹配医院（$399已包含）</td></tr></table>" +
      "<h3 style=\"font-size:1rem;color:#1a3a6b;margin-top:16px;\">第2步：医院对接</h3><table class=\"info-table\"><tr><th>你做什么</th><td>确认选择的医院</td></tr><tr><th>我们做什么</th><td>✅ 代发病历（$399已包含）<br>✅ 翻译协调（$399已包含）<br>✅ 跟进回复（$399已包含）<br>✅ 多院对比报价（$399已包含）</td></tr></table>" +
      "<h3 style=\"font-size:1rem;color:#1a3a6b;margin-top:16px;\">第3步：行前准备</h3><table class=\"info-table\"><tr><th>你做什么</th><td>办理签证、预定机票</td></tr><tr><th>我们做什么</th><td>✅ 签证材料指导（$399已包含）<br>✅ 医院预约锁定（$399已包含）<br>✅ 住宿建议（$399已包含）<br>💰 接机安排（需额外付费）</td></tr></table>" +
      "<h3 style=\"font-size:1rem;color:#1a3a6b;margin-top:16px;\">第4步：治疗期间</h3><table class=\"info-table\"><tr><th>你做什么</th><td>按时就诊、配合治疗</td></tr><tr><th>我们做什么</th><td>✅ 医院沟通衔接（$399已包含）<br>✅ 突发问题协调（$399已包含）<br>✅ 紧急联系电话（$399已包含）</td></tr></table>" +
      "<h3 style=\"font-size:1rem;color:#1a3a6b;margin-top:16px;\">第5步：出院与回国</h3><table class=\"info-table\"><tr><th>你做什么</th><td>办理出院手续、确认回国安排</td></tr><tr><th>我们做什么</th><td>✅ 中英文病历整理（$399已包含）<br>✅ 用药说明（$399已包含）<br>✅ 复查预约（$399已包含）<br>💰 回国航旅协助（需额外付费）</td></tr></table>" +
      "<h3 style=\"font-size:1rem;color:#1a3a6b;margin-top:16px;\">第6步：远程随访</h3><table class=\"info-table\"><tr><th>你做什么</th><td>按时复查、提供反馈</td></tr><tr><th>我们做什么</th><td>✅ 远程随访衔接（$399已包含）<br>💰 长期健康档案（需额外付费）<br>💰 复查资料传递（需额外付费）</td></tr></table>" +
      "</div>";
  }
  // --- FAQ (different for basic) ---
  var faqHtml;
  if (isBasic) {
    faqHtml = "<div class=\"faq-item\"><p class=\"q\">Q: 这份报告和$399的升级版有什么区别？</p><p class=\"a\">这份 $49 报告给你精准的医院推荐、交通指南和行前清单。你拿到后可以自己联系医院、自己安排行程。$399 升级版是我们帮你做这一切——代发病历、跟进回复、翻译、接机、治疗期间协调、出院文件整理、回国后随访衔接。</p></div>" +
    "<div class=\"faq-item\"><p class=\"q\">Q: 我可以先买$49，后续再升级吗？</p><p class=\"a\">可以。$49 的费用可以抵扣升级费用，你只需补差价即可。</p></div>" +
    "<div class=\"faq-item\"><p class=\"q\">Q: 中国医院的卫生条件和水平怎么样？</p><p class=\"a\">本报告推荐的医院均为中国三级甲等医院（最高级别），其中多家通过 JCI 国际认证。北京协和医院、华西医院在中国的地位相当于梅奥诊所和克利夫兰诊所在美国的地位。</p></div>";
  } else {
    faqHtml = "<div class=\"faq-item\"><p class=\"q\">Q: 我们的服务和医院中介有什么区别？</p><p class=\"a\"><strong>A:</strong> 我们不是中介，不赚取医院差价，也不替医院招揽患者。我们的价值在于：<strong>帮你在复杂的中国医疗体系中找到最佳路径。</strong></p></div>" +
    "<div class=\"faq-item\"><p class=\"q\">Q: 如果推荐的医院不适合我，怎么办？</p><p class=\"a\"><strong>A:</strong> 我们会根据你的反馈重新匹配。我们的数据库涵盖51家中国顶级医院，可以覆盖绝大多数专科需求。</p></div>" +
    "<div class=\"faq-item\"><p class=\"q\">Q: 付款方式是怎样的？$399包含什么？额外费用有哪些？</p><p class=\"a\"><strong>$399包含：</strong>需求确认、医院对接、行前准备、治疗期间协调、出院回国全流程。<strong>需额外付费：</strong>接机、回国航旅协助、回国后远程随访。<strong>医院治疗费用直接付给医院，不经我们手。</strong></p></div>" +
    "<div class=\"faq-item\"><p class=\"q\">Q: 如果治疗过程中出现问题，我们承担什么责任？</p><p class=\"a\"><strong>A:</strong> 我们是医疗咨询服务提供者，不直接提供医疗服务。我们承诺：①信息的准确性和及时性；②对接和服务响应的及时性；③协助协调医院沟通。医疗行为本身的风险由医院和患者按医疗合同约定承担。</p></div>";
  }
  // --- Why us (different for basic) ---
  var whyUsHtml;
  if (isBasic) {
    whyUsHtml = "<div class=\"section\"><h2 class=\"section-title\">💎 为什么选择我们，而不是自己联系医院？</h2>" +
    "<p style=\"font-size:0.9rem;color:#666;margin-bottom:16px;\">下面的对比表展示了 <span class=\"tag-premium\" style=\"margin:0 2px;\">$399</span> 升级版的服务价值：</p>" +
    "<table class=\"why-us-table\"><tr><th>场景</th><th>自己联系医院</th><th>通过我们 <span class=\"tag-premium\">$399</span></th></tr>" +
    "<tr><td><strong>语言沟通</strong></td><td class=\"col-bad\">自己发英文邮件，可能被忽略</td><td class=\"col-good\">我们帮你翻译、跟进，确保有人回复</td></tr>" +
    "<tr><td><strong>选哪家医院</strong></td><td class=\"col-bad\">自己网上查，信息真假难辨</td><td class=\"col-good\">我们从51家里筛出最适合你的</td></tr>" +
    "<tr><td><strong>遇到问题</strong></td><td class=\"col-bad\">自己想办法沟通</td><td class=\"col-good\">我们有人帮你协调</td></tr>" +
    "<tr><td><strong>回国后</strong></td><td class=\"col-bad\">医生可能不记得你是谁</td><td class=\"col-good\">我们有完整的档案和随访通道</td></tr>" +
    "<tr><td><strong>费用</strong></td><td class=\"col-bad\">直接按标准价收费</td><td class=\"col-good\">我们帮你确认费用明细，避免隐形收费</td></tr>" +
    "</table></div>";
  } else {
    whyUsHtml = "<div class=\"section\"><h2 class=\"section-title\">💎 为什么选择我们，而不是自己联系医院？</h2>" +
    "<table class=\"why-us-table\"><tr><th>场景</th><th>自己联系医院</th><th>通过我们</th></tr>" +
    "<tr><td><strong>语言沟通</strong></td><td class=\"col-bad\">自己发英文邮件，可能被忽略</td><td class=\"col-good\">我们帮你翻译、跟进，确保有人回复</td></tr>" +
    "<tr><td><strong>选哪家医院</strong></td><td class=\"col-bad\">自己网上查，信息真假难辨</td><td class=\"col-good\">我们从51家里筛出最适合你的</td></tr>" +
    "<tr><td><strong>遇到问题</strong></td><td class=\"col-bad\">自己想办法沟通</td><td class=\"col-good\">我们有人帮你协调</td></tr>" +
    "<tr><td><strong>回国后</strong></td><td class=\"col-bad\">医生可能不记得你是谁</td><td class=\"col-good\">我们有完整的档案和随访通道</td></tr>" +
    "<tr><td><strong>费用</strong></td><td class=\"col-bad\">直接按标准价收费</td><td class=\"col-good\">我们帮你确认费用明细，避免隐形收费</td></tr>" +
    "</table><p style=\"font-size:0.9rem;color:#1a3a6b;font-weight:700;\">一句话总结：你不需要学会怎么跟中国医院打交道——我们来搞定。你只需要专注一件事：<strong>来治病，然后康复回家。</strong></p></div>";
  }
  // --- RETURN HTML ---
  var badge = isBasic ? "中国医疗旅游医院推荐报告 · 基础版 ($49)" : "中国医疗旅游医院推荐报告 · 升级版";
  var titlePrefix = isBasic ? "中国医疗旅游医院推荐报告 · 基础版" : "🏥 中国医疗旅游医院推荐报告";
  var dlSuffix = isBasic ? "basic" : "premium";

  return "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>"+titlePrefix+" — "+esc(clientName)+"</title>\n<style>"+sharedCSS()+"\n  .upgrade-section{background:linear-gradient(135deg,#1a3a6b,#244d8a);border-radius:16px;padding:36px;color:#fff;margin-top:48px;}\n  .upgrade-section h2{color:#fff;border-bottom-color:rgba(255,255,255,0.2);}\n  .upgrade-table{width:100%;border-collapse:collapse;font-size:0.87rem;margin-top:16px;}\n  .upgrade-table th{text-align:left;padding:12px 16px;background:rgba(255,255,255,0.1);color:#fff;font-weight:600;}\n  .upgrade-table td{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.9);}\n  .upgrade-table .included{color:#4caf50;font-weight:600;}\n  .upgrade-table .premium-only{color:#ffc107;font-weight:600;}\n  .tag-included{display:inline-block;background:rgba(76,175,80,0.2);color:#4caf50;padding:2px 10px;border-radius:10px;font-size:0.75rem;font-weight:700;margin-left:6px;}\n  .tag-premium{display:inline-block;background:rgba(255,193,7,0.2);color:#ffc107;padding:2px 10px;border-radius:10px;font-size:0.75rem;font-weight:700;margin-left:6px;}\n  .cta-box{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:24px;text-align:center;margin-top:24px;}\n  .cta-box p{font-size:0.95rem;margin-bottom:16px;}\n</style>\n</head>\n<body>\n<div class=\"report\">\n" +

    "  <div class=\"hero\">\n" +
    "    <div class=\"hero-badge\">"+badge+"</div>\n" +
    "    <h1>"+esc(title)+"</h1>\n" +
    "    <div class=\"hero-sub\">致："+esc(clientName)+" | 病症："+esc(opts.diagnosis||opts.caseStr||"待确认")+" | 日期："+dateStr+"</div>\n" +
    "    <div class=\"hero-meta\">\n" +
    "      <span>👤 患者 | "+esc(clientName)+"</span>\n" +
    "      <span>🏥 病症 | "+esc(keywords.join(", "))+"</span>\n" +
    "      <span>📍 城市 | "+esc(city)+"</span>\n" +
    "      <span>🏥 匹配数 | "+results.length+" 家</span>\n" +
    "      <span>📅 报告日期 | "+dateStr+"</span>\n" +
    "    </div>\n" +
    "  </div>\n" +

    "  <div class=\"content\">\n" +
    letterHtml + "\n" +
    howToHtml + "\n" +
    summaryHtml + "\n" +
    priceHtml + "\n" +

    "    <div class=\"section\">\n" +
    "      <h2 class=\"section-title\">🏆 推荐医院（共"+top3.length+"家）</h2>\n" +
    "    </div>\n" +
    cardsHtml + "\n" +
    compareHtml + "\n" +

    whyUsHtml + "\n" +
    bottomHtml + "\n" +

    "    <div class=\"section\">\n" +
    "      <h2 class=\"section-title\">❓ 常见问题</h2>\n" +
    faqHtml + "\n" +
    "    </div>\n" +

    "    <div class=\"about-card\">\n" +
    "      <h3 style=\"font-size:1.1rem;color:#1a3a6b;margin-bottom:12px;\">📄 关于 China Hospitals Guide</h3>\n" +
    "      <table class=\"info-table\">\n" +
    "        <tr><th>网站</th><td><a href=\"https://chinahospitalsguide.com\">chinahospitalsguide.com</a></td></tr>\n" +
    "        <tr><th>覆盖范围</th><td>10个城市、51家中国顶级医院</td></tr>\n" +
    "        <tr><th>服务内容</th><td>医院推荐、就诊协调、行前指导、远程随访等一站式医疗旅游咨询</td></tr>\n" +
    "      </table>\n" +
    "    </div>\n" +

    "    <div class=\"download-section\">\n" +
    "      <p>📥 下载纯文本摘要供离线参考</p>\n" +
    "      <a class=\"btn-download\" download=\"report-"+esc(keywords.slice(0,3).join("-"))+"-"+dlSuffix+".txt\" href=\"data:text/markdown;charset=utf-8,"+encodeURIComponent(textReport)+"\">⬇ 下载完整报告 (.md)</a>\n" +
    "    </div>\n" +

    "    <div class=\"disclaimer\">\n" +
    "      <strong>📋 重要提示：</strong> 价格为典型病例的估计值，基于已发布数据。实际费用因诊断、医院和个体治疗方案而异。请直接联系医院获取个性化报价。本报告仅供参考，不构成医疗建议。\n" +
    "    </div>\n" +

    "  </div>\n" +
    "  <div class=\"report-footer\">\n" +
    "    <p>感谢你选择 <a href=\"https://chinahospitalsguide.com\">China Hospitals Guide</a>。祝你早日康复。 🌿</p>\n" +
    "  </div>\n" +
    "</div>\n</body>\n</html>";
}

function generateBasicReport(results, keywords, city, opts) {
  opts.mode = "basic";
  return renderReport(results, keywords, city, opts);
}

function generatePremiumReport(results, keywords, city, opts) {
  opts.mode = "premium";
  return renderReport(results, keywords, city, opts);
}

// ========== CLI ==========
const args = process.argv.slice(2);
const opts = parseArgs(args);

if (!opts.mode || (!opts.caseStr && args.length < 2)) {
  console.log("Usage: node generate-report.js --name <name> --case <keywords> [--city <city>] --basic|--premium");
  console.log("");
  console.log("Examples:");
  console.log('  node generate-report.js --name "Carlos Mendoza" --case "knee replacement" --city Beijing --basic');
  console.log('  node generate-report.js --name "Carlos Mendoza" --case "knee replacement" --city Beijing --premium');
  process.exit(0);
}

const csvPath = path.join(__dirname, "hospital-directory-51.csv");
const hospitals = loadHospitals(csvPath);

let keywords = opts.caseStr.replace(/[,，]/g, " ").split(/\s+/).filter(Boolean);
keywords = splitChineseTokens(keywords);

let city = opts.city || null;
if (city) {
  city = CITY_MAP[city] || city;
  if (city && CITY_MAP[city.toLowerCase()]) city = CITY_MAP[city.toLowerCase()];
}

let results = screenHospitals(hospitals, keywords, city);
if (results.length === 0) {
  results = screenHospitals(hospitals, keywords, null, 0.7);
}

if (results.length > 0) {
  const html = opts.mode === "basic"
    ? generateBasicReport(results, keywords, city || "不限", opts)
    : generatePremiumReport(results, keywords, city || "不限", opts);

  const safeName = (opts.name || "report").replace(/[\/\\s]/g, "-");
  const suffix = opts.mode === "basic" ? "basic" : "premium";
  const htmlFile = "report-" + safeName + "-" + suffix + ".html";
  fs.writeFileSync(path.join(__dirname, htmlFile), html, "utf8");
  console.log("✅ HTML报告: " + htmlFile);
  console.log("   模式: " + (opts.mode==="basic"?"基础版 ($49)":"升级版 ($399)"));
  console.log("   匹配: " + results.length + " 家医院");
  console.log("   城市: " + (city||"不限"));
} else {
  console.log("❌ 未找到匹配医院。请尝试其他关键词。");
}
