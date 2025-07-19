window.WEP = window.WEP || {}
/**
 * 手动浏览的数据配置
 * @param image 底部缩略图
 * @param name 底部标题
 * @param scene 场景名称
 * @param type 直接点击缩略图时调用的方法索引 取自typeMap 默认2
 * @param nextType 前进调用的方法索引 取自typeMap 默认1
 * @param prevType 后退调用的方法索引 取自typeMap 默认1
 * @param point[] 一个场景中的不同视角
 * @param point.h 进入这个场景时的水平视角
 * @param point.v 进入这个场景时的垂直视角 不传使用默认值
 * @param point.fov 进入这个场景时的缩放视角 不传则使用默认值
 */
window.WEP.manualView = [
  
    /*{
        image: './panos/b01.tiles/thumb.jpg',
        name: '孔子衣镜2',
        scene: 'scene_02',
        prevType: 1, // 后退 通过后退进入到该场景时使用的方法
        nextType: 1, // 前进 通过前进进入到该场景时使用的方法
        type: 2, // 直接点击缩略图
        points: [
            { h: 180, v: 0, fov: 120 }
        ]
    },*/
   {
        image: './panos/a01.tiles/thumb.jpg',
        name: '',
        scene: 'scene_a01',
        nextType: 2, // 前进
        prevType: 1, // 后退        
        points: [
           { h: 90, },
           { h: 180, },
        ]
   },
   {
       image: './panos/a03.tiles/thumb.jpg',
       name: '',
       scene: 'scene_a03',
       nextType: 1, // 前进
       prevType: 1, // 后退        
       points: [
          { h: 180, },
          { h: 90, },
       ]
  },
  {
     image: './panos/a04.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a04',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
        { h: 0, },
     ]
  },
  {
     image: './panos/a05.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a05',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: -90, },
        { h: 180, },
     ]
  },
  
   {
      image: './panos/a07.tiles/thumb.jpg',
      name: '',
      scene: 'scene_a07',
      nextType: 1, // 前进
      prevType: 1, // 后退        
      points: [
         { h: 180, },
         { h: 30, },
      ]
   },
   {
      image: './panos/a06.tiles/thumb.jpg',
      name: '',
      scene: 'scene_a06',
      nextType: 1, // 前进
      prevType: 1, // 后退        
      points: [
         { h: 90, },
         { h: 180, },
      ]
   },
   {
      image: './panos/a08.tiles/thumb.jpg',
      name: '',
      scene: 'scene_a08',
      nextType: 1, // 前进
      prevType: 1, // 后退        
      points: [
         { h: 180, },
      ]
   },
  {
     image: './panos/a09.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a09',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
        { h: 30, },
     ]
  },
    {
     image: './panos/a18.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a18',
     nextType: 1, 
     prevType: 1,      
     points: [
        { h: 90, },
        { h: 180, },
     ]
  },
  {
     image: './panos/a10.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a10',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
     ]
  },
  {
     image: './panos/a11.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a11',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
     ]
  },
  {
     image: './panos/a12.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a12',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
     ]
  },
  {
     image: './panos/a13.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a13',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
     ]
  },
  {
     image: './panos/a14.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a14',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 180, },
     ]
  },
  {
     image: './panos/a15.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a15',
     nextType: 1, // 前进
     prevType: 2, // 后退        
     points: [
        { h: 180, },
        { h: -90, },
     ]
  },
  {
     image: './panos/a16.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a16',
     nextType: 2, // 前进
     prevType: 2, // 后退        
     points: [
        { h: -90, },
     ]
  },
  {
     image: './panos/a17.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a17',
     nextType: 2, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 90, },
     ]
  },
  {
     image: './panos/a19.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a19',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
        { h: -90, },
     ]
  },
  {
     image: './panos/a20.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a20',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a21.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a21',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a22.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a22',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a23.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a23',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a24.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a24',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a25.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a25',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a26.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a26',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a27.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a27',
     nextType: 1, // 前进
     prevType: 1, // 后退        
     points: [
        { h: 0, },
     ]
  },
  {
     image: './panos/a28.tiles/thumb.jpg',
     name: '',
     scene: 'scene_a28',
     nextType: 1, // 前进
     prevType: 2, // 后退        
     points: [
        { h: 0, },
        { h: 180, },
     ]
  },
  {
   image: './panos/b01.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b01',
   nextType: 2, // 前进
   prevType: 1, // 后退        
   points: [
      { h: 90, },
      { h: 0, },
   ]
   },
   {
   image: './panos/b30.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b30',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
      { h: 0, },
      { h: -90, },
   ]
   },
   {
   image: './panos/b31.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b31',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b32.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b32',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   { h: -90, },
   ]
   },
   {
   image: './panos/b33.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b33',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: -90, },
   ]
   },
   {
   image: './panos/b34.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b34',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: -90, },
   { h: 0, },
   ]
   },
   {
   image: './panos/b35.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b35',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b36.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b36',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b37.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b37',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b38.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b38',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b39.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b39',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b40.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b40',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b41.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b41',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b42.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b42',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   { h: -90, },
   ]
   },
   {
   image: './panos/b43.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b43',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: -90, },
   ]
   },
   {
   image: './panos/b44.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b44',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: -90, },
   { h: 180, },
   ]
   },
   {
   image: './panos/b45.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b45',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b46.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b46',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b47.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b47',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b48.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b48',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b49.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b49',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b50.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b50',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b51.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b51',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b52.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b52',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   ]
   },
   {
   image: './panos/b53.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b53',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 180, },
   { h: 90, },
   ]
   },
   {
   image: './panos/b54.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b54',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 90, },
   ]
   },
   {
   image: './panos/b55.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b55',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 90, },
   { h: 0, },
   ]
   },
   {
   image: './panos/b56.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b56',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b57.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b57',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   ]
   },
   {
   image: './panos/b58.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b58',
   nextType: 1, // 前进
   prevType: 1, // 后退        
   points: [
   { h: 0, },
   { h: -90, },
   ]
   },
   {
   image: './panos/b59.tiles/thumb.jpg',
   name: '',
   scene: 'scene_b59',
   nextType: 1, // 前进
   prevType: 2, // 后退        
   points: [
   { h: -90, },
   { h: 90, },
   ]
   },
   {
      image: './panos/a60.tiles/thumb.jpg',
      name: '',
      scene: 'scene_a60',
      nextType: 2, // 前进
      prevType: 2, // 后退        
      points: [
      { h: 90, },
      ]
   },
 
   
]

