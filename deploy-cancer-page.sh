#!/bin/bash
# 部署脚本 - 癌症治疗页面
# 使用方法: 在本地有GitHub权限的环境中运行

echo "🚀 部署癌症治疗页面到网站仓库..."

# 克隆仓库
cd /tmp
rm -rf chinahospitalsguide-deploy
git clone https://github.com/qzw-alt/chinahospitalsguide.git chinahospitalsguide-deploy

# 复制更新文件
cp /root/.openclaw/workspace/treatments/cancer.html chinahospitalsguide-deploy/treatments/

# 提交并推送
cd chinahospitalsguide-deploy
git add -A
git commit -m "Update: Expand cancer treatment page with comprehensive content (2500+ words, Schema markup, FAQ)"
git push origin master

echo "✅ 部署完成！"
echo "⏳ 等待2-5分钟后访问: https://chinahospitalsguide.com/treatments/cancer.html"