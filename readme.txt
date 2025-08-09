//at.alicdn.com/t/font_1280484_g89ljjqt5r.css
     
sudo docker login --username=bingofree crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com

docker build -t keras-mall-cms:latest .


docker tag keras-mall-cms:latest crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-cms:latest

docker push crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-cms:latest



docker pull crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-cms:latest
docker run -d -p 8085:8085 --name keras-mall-cms crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-cms:latest

docker stop keras-mall-cms && docker rm keras-mall-cms

docker run -d -p 8085:8085 --name keras-mall-cms -v /opt/keras-mall/cms/nginx.conf:/etc/nginx/conf.d/default.conf crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-cms:latest
           
           
           
1、拉取镜像（如未本地构建推送过）：
docker pull crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/museum-demo-web:latest
2、启动服务：
docker-compose up -d

3、线上DEMO
http://47.120.1.178:8086/

    
    
crpi-jcsqfc0dscexrb7n.cn-heyuan.personal.cr.aliyuncs.com/bingofree2025/keras-mall-cms:latest            