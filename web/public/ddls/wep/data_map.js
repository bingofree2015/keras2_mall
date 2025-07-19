window.WEP = window.WEP || {}
/**
 * 地图数据配置
 * @param name 展厅名称
 * @param enterAction 进入这个展厅执行的krpano动作
 * @param main 展厅主要配置
 * @param main.name 前言标题
 * @param main.content 前言正文
 * @param main.mapImg 地图配置 路径 宽 高
 * @param main.miniMapInitRotate 小地图指示器的初始角度
 * @param main.cellSvg 选择单元时覆盖地图的svg 路径 偏移
 * @param cellList[cell] 单元列表
 * @param cell.label 单元名称
 * @param cell.enterAction 选中单元时执行的 krpano 动作
 * @param cell.scene 选中单元时切换的场景
 * @param cell.name 单元介绍标题
 * @param cell.content 单元介绍正文
 * @param cell.points 单元内的场景点
 */
window.WEP.mapData = [
    {
        // 展厅名称
        name: '一层',
        // 切换成展厅一执行的 krpano 动作
        enterAction: '',
        main: {
            // 前言
            name: '前言',
            content: '<p class="">　　海皇挥舞三叉戟劈开爱琴碧波，浪花飞溅处诞育三千岛屿，宛若美神阿芙洛狄忒抛下的璀璨宝石。克里特，正是那永恒生辉的祖母绿。</p><p class="">　　它风光旖旎，被视作众神之王宙斯的故乡。它玄秘莫测，萌生出代达罗斯修建迷宫的奇想。瑰丽神话，驱使考古学家用鹤嘴镐击碎时光岩壁。不懈努力，让失落已久的史前遗迹重见天颜。</p><p class="">　　听啊！闪烁荣光的文明清泉从克里特及周边岛、陆汩汩涌出，汇聚成河，于公元前三千纪冲破青铜时代的闸关。冒险者以舟为箭射穿海上迷雾，为贸易远涉四方，眺望星汉。视野开阔的岛民熔炼外域文化，制作了精美器皿，营建起壮伟宫殿，创造出瑰丽艺术。一个崇尚自然、浪漫多姿、兼收并蓄的文明在欧亚非三洲交汇处绽放绚烂，为古希腊文明结成夏果献上第一波春日芳妍。</p><p class="">　　当神话挣脱虚幻的桎梏，便化作鎏金密钥，去开启尘封已久的历史匣龛。</p><p class="">　　时值故宫博物院百年华诞，我们展示来自希腊伊拉克利翁考古博物馆的珍贵文物，让克诺索斯王宫的柱廊与紫禁城的丹墀互映辉光，向广大观众解读代达罗斯神话背后的古希腊之源，昭示伟大文明间应有的和合之美、交流互鉴。</p>',
            // 地图配置
            mapImg: {
        url: './wep/img/map1.png',
        width: 565,
        height: 147
    }, // 指示图标的初始角度 0 90 180 -90 调试
    miniMapInitRotate: 0,
    // svg覆盖
    cellSvg: {
        url: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="565px" height="147px"><path fill-rule="evenodd" opacity="0.4" fill="rgb(146, 96, 96)" d="M428 98L428 132 143 132 143 51 385 51 385 98z" /><path fill-rule="evenodd" opacity="0.4" fill="rgb(146, 96, 96)" d="M528 15L528 132 428 132 428 98 385 98 385 15z" /><path fill-rule="evenodd" opacity="0.4" fill="rgb(146, 96, 96)" d="M86 15h299v36h-299z" /></svg> ',
        left: 0,
        top: 0,
    }
        },
    // 各个单元数据配置
    cellList: [
        {
            label: '第一单元',
            enterAction: '', // 选中单元时执行的 krpano 动作
            scene: 'scene_a07',
            name: '神话',
            content: '<p class="">　　克里特岛扼守爱琴之南，遥望希腊本土。僻远位置与鸿蒙史迹，让它聚拢神秘气息，引发无限遐想。</p><p class="">　　古希腊人留下各种关于克里特岛的离奇故事和未解谜团。代达罗斯神话尤为突出，那波澜壮阔的神曲，荒诞不经的情节，隐藏着古希腊人意识深处对智慧、勇毅和创造力的崇尚与赞美。故事从零散走向整合，在诸多古典作家的诗篇中汇纂成型，千古传唱，成为西方文化基因里的片段。</p><p class="">　　沧海桑田，斗转星移，神话与史迹重叠，虚构与真实交织。令人捉摸不透的古物，成了耐人寻味的线索。19 世纪末 20 世纪初，敏锐的考古学家们拿起探铲前往克里特岛，众里寻他，冰山破角。代达罗斯营造的“迷宫”竟是客观历史事实的回响，漫长岁月里绕在人们心间的疑问终于有了答案。</p><p class="">一、代代相传</p><p class="">　　古希腊神话中，代达罗斯是一名巧匠，受克里特国王米诺斯之托建造迷宫，关押王后生下的怪物米诺牛。多年后，为制止米诺牛吃人的恶行，雅典英雄忒修斯渡海而来，智闯迷宫将其斩杀。这些奇闻古已有之，在裹挟着各种神话的希腊历史长河中蜿蜒流转。自公元前 8 世纪起，与代达罗斯有关的故事渐趋成熟，从史诗到戏剧，从陶瓶到货币，其零散片段和图像描绘频频可见。尤其罗马帝国时期，维吉尔、奥维德、普鲁塔克等作家将代达罗斯神话汇集整理，使之成为叙事完整的文学作品，在西方家喻户晓、代代相传。</p><p class="">二、寻踪溯源</p><p class="">　　千百年来，实证的缺乏导致人们难以判断代达罗斯与迷宫故事的虚实，神话终归是神话，一切都停留在梦境般的幻想中。直到英国考古学家亚瑟·伊文思等人拉开史前考古大幕，神话的奥秘才逐步破解。尽管我们无法知晓这些传说的最早起点，却能在克里特岛的上古遗物中窥见蛛丝马迹。代达罗斯神殿之名赫然书写在线形文字泥板上，牛头雕塑暗示人们口中的迷宫怪物并非空穴来风，舞蹈陶俑的动感仿佛闪烁出王家庭院的喧嚣残影。诸多证据表明，公元前14 世纪左右的青铜时代末期，代达罗斯神话可能已有轮廓，故事内容也大概来源于现实生活。</p>',
            points: [
                
                

                  
                { left: 85, top: 74, scene: "scene_a01", label: '场景01' },
                { left: 100, top: 118, scene: "scene_a03", label: '场景03' },
                { left: 171, top: 118, scene: "scene_a04", label: '场景04' },
                { left: 171, top: 75, scene: "scene_a05", label: '场景05' },
                { left: 242, top: 75, scene: "scene_a06", label: '场景06' },
                { left: 216, top: 118, scene: "scene_a07", label: '场景07' },
                { left: 256, top: 118, scene: "scene_a08", label: '场景08' },
                { left: 297, top: 118, scene: "scene_a09", label: '场景09' },
                { left: 338, top: 118, scene: "scene_a10", label: '场景10' },
                { left: 377, top: 118, scene: "scene_a11", label: '场景11' },
                { left: 415, top: 118, scene: "scene_a12", label: '场景12' },
                { left: 327, top: 75, scene: "scene_a18", label: '场景18' },
              

            ]
        },
        {
            label: '第二单元',
            enterAction: '', // 选中单元时执行的 krpano 动作
            scene: 'scene_a13',
            name: '迷宫',
            content: '<p class="">　　传说代达罗斯修建的迷宫拥有难以破解的布局。它堪称一座阴森可怖的牢狱，也是一座诡异重重的宫殿。</p><p class="">　　几千年后，英国人伊文思找到的克诺索斯王宫，很可能是代达罗斯故事里那座魔幻迷城的创想来源，神话可谓米诺斯文化建筑成就的文学投射。残垣断壁的王宫废墟，百转千回、纵横交错、曲曲折折，果然如故事描述的一般难以捉摸。旧日的王宫必是光彩照人，红柱、高墙、回廊、中庭，无不诉说本应属于这里的磅礴气象。还有绮丽鲜艳的壁画，用温馨的花花草草、翩跹的长冠王子、曼妙的盛装女人为王宫增添神界乐园般的韵味。</p><p class="">　　多处相似的宫殿遗迹散布克里特岛，各有千秋又具备共性，分属青铜文明不同时代。它们在漫长历史中发展壮大，扮演多重角色，是克里特人民生业立命的核心点，是早期国家初现端倪的标志，是米诺斯文化曾经称霸爱琴海的丰碑，只有具备强盛雄厚的实力才能聚沙成塔，成就如此令人惊叹的伟业。</p>',
            points: [
                { left: 455, top: 118, scene: "scene_a13", label: '场景13' },
                { left: 482, top: 118, scene: "scene_a14", label: '场景14' },
                { left: 509, top: 118, scene: "scene_a15", label: '场景15' },
                { left: 483, top: 70, scene: "scene_a16", label: '场景16' },
                { left: 412, top: 55, scene: "scene_a17", label: '场景17' },
                { left: 468, top: 28, scene: "scene_a19", label: '场景19' },
                { left: 435, top: 28, scene: "scene_a20", label: '场景20' },
                { left: 399, top: 28, scene: "scene_a21", label: '场景21' },
               
            ]
        },
        {
            label: '第三单元',
            enterAction: '', // 选中单元时执行的 krpano 动作
            scene: 'scene_a22',
            name: '青铜',
            content: '<p class="">　　克里特岛古老窑炉中偶然泛起的金属幽光，悄悄点燃人类冶金历史的第一簇星火。当青铜熔液在陶范中流淌，这里便奏响社会巨变的乐章。锻锤敲击出时代强音，把石质工具送入历史帷幕。那些曾被燧石限制的创造力，终于在冷峻光泽中喷薄绽放。</p><p class="">　　米诺斯匠人把金属魔法推向巅峰。他们以铆接技术解锁青铜奥秘，用柔韧板材锻造三足圣釜，让这些与金银争辉的器物，在棱镜中折射出阶级社会的光谱。甲胄流动着大海波纹，剑锋凝结着月华寒芒。神圣双刃斧在祭坛劈开天地通灵之路，那弧线既昭示战争威仪，亦勾描仪轨轮廓。青铜的物理特性完美转化为权力的视觉语法，在克里特岛宫墙残垣间，留下跨越数千年的永恒封印。</p>',
            points: [
                 { left: 365, top: 28, scene: "scene_a22", label: '场景22' },
                 { left: 332, top: 28, scene: "scene_a23", label: '场景23' },
                 { left: 298, top: 28, scene: "scene_a24", label: '场景24' },
                 { left: 258, top: 28, scene: "scene_a25", label: '场景25' },
                 { left: 218, top: 28, scene: "scene_a26", label: '场景26' },
                 { left: 173, top: 28, scene: "scene_a27", label: '场景27' },
                 { left: 100, top: 28, scene: "scene_a28", label: '场景28' },
                 { left: 543, top: 77, scene: "scene_a60", label: '场景60' },
            ]
        },
        ]
    },
    {
        name: '二层',
         // 切换成展厅二执行的 krpano 动作
         enterAction: '',
        main: {
            // 前言
            // name: '游山',
            // content: '<p class="">中国古典园林大多是有“山”的。仙山、洞天的意象，虽居城市而咫尺林泉的追求，都寄托于山。</p><p class="">山水可“宅心”，可“养心”，可“修心”。</p><p class="">一峰则太华千寻，一勺则江湖万里。立一块湖石假山，仿佛见九天云烟；置一方楼台亭榭，便能引明月清风。中国古人游于园中假山，或游于真山真水，都在追求一片超脱于俗世的心灵空间。</p><p class="">在伊斯兰和欧洲的规则式花园中，自然被理想化为完美的几何结构。文艺复兴时期的意大利台地园依山层叠而建，游台地园也成为一种游山之旅。模仿山地洞穴的人工洞窟、隐喻自然之神的独特巨人雕像，使园林成为艺术入主自然的产物。文艺复兴的浪潮让时人在自然与神性之间，于游观中重新觅得人本的光辉。</p><p class="">Many classical Chinese gardens included ‘mountain’. These evoke the imagery of sacred peaks and celestial grottoes, embodying the desire to stay close to nature even within the city. Mountains and waters were believed to ‘settle the heart’, ‘nourish the spirit’, and ‘cultivate the mind’. As the Chinese saying goes, ‘a single peak reflects the grandeur of the highest mountains; a scoop of water captures the vastness of rivers and lakes’. In Chinese gardens, Taihu rockeries evoke heavenly mists, while pavilions and terraces invite the breeze and moonlight. Whether wandering through artificial mountains or exploring real ones, Chinese people of the past sought a realm beyond the ordinary.</p><p class="">Formal gardens of the Islamic and European traditions shaped nature into perfect geometric forms. The terraced gardens of Renaissance Italy were built upon slopes, making a stroll in the gardens akin to a mountain hike. Artificial grottoes mimicking natural caves and monumental statues representing gods of nature symbolized humanity’s artistic mastery over the natural world. Within these landscapes, the Renaissance revived humanism through the interplay of nature and the divine.</p>',
            // 地图配置
            mapImg: {
                url: './wep/img/map2.png',
                width: 557,
                height: 179,
            },
            miniMapInitRotate: 0,
            // svg覆盖
            cellSvg: {
                url: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="545px" height="142px"> <path fill-rule="evenodd"  fill="rgb(146, 96, 97)" d="M0.000,141.000 L142.000,141.000 L180.000,141.000 L251.000,141.000 L251.000,83.000 L349.000,83.000 L349.000,23.000 L0.000,23.000 L0.000,141.000 Z"/><path fill-rule="evenodd"  fill="rgb(146, 96, 97)" d="M251.000,140.000 L392.000,140.000 L392.000,83.000 L251.000,83.000 L251.000,140.000 Z"/><path fill-rule="evenodd"  fill="rgb(146, 96, 97)" d="M392.000,140.000 L498.000,140.000 L498.000,83.000 L392.000,83.000 L392.000,140.000 Z"/><path fill-rule="evenodd"  stroke="rgb(146, 96, 97)" stroke-width="2px" stroke-dasharray="8, 4" stroke-linecap="butt" stroke-linejoin="miter" fill="rgb(146, 96, 97)" d="M498.000,140.000 L543.000,140.000 L543.000,22.000 L388.000,22.000 L388.000,1.000 L355.000,1.000 L355.000,83.000 L498.000,83.000 L498.000,140.000 Z"/></svg>',
                left: 7,
                top: 7,
            }
        },
        // 各个单元数据配置
        cellList: [
            {
                label: '第四单元',
                enterAction: '', // 选中单元时执行的 krpano 动作
                scene: 'scene_b32',
                name: '巧匠 ',
                content: '<p class="">　　代达罗斯为国王米诺斯设计迷宫，为公主阿里阿德涅建造舞池。他是绝无仅有的天才，是智慧机敏的匠师，是发明创造的能手。</p><p class="">　　不管代达罗斯是否确有其人，考古发现的众多精美之器证明克里特岛米诺斯时代果真拥有丰富的物产、高超的技术、出色的审美。陶瓶朴拙，彩色纹饰勾勒奇趣之美；金光灿灿，项饰耳坠闪烁贵人华彩；石皿莹润，天然纹理包罗浩渺苍穹；印章玲珑，微雕细刻凝缩大千世界。</p><p class="">　　杰出工艺让人看到米诺斯文化发达的生产力和旺盛的消费需求，数千年前爱琴海青铜时代的岛民们已经享受了品质卓越的劳动成果。精巧的生产技术当归功于数千载勤劳实践，代达罗斯神话恰是克里特史前经济的文学投射。更有可能，并非代达罗斯造就了工艺，而是百工千艺塑造了大师。</p><p class="">　　一、彩陶绘奇趣</p><p class="">　　新石器时代和青铜时代早期，克里特陶器受小亚细亚、黎凡特与基克拉泽斯群岛同类产品影响，造型与装饰相对简单。随着经济与贸易日趋繁荣，出现了职业化的陶工群体。他们促进了陶器产量与技术进步，陶轮的使用亦带来品质提升与风格创新。到青铜时代中期，一种名为“卡马雷斯”的陶器兴盛起来，及至青铜时代晚期又出现了所谓的王宫风格陶器。这些陶器身上绘有抽象或具象的纹饰，画风奇巧，意趣盎然，表现出鲜明的自然主义和装饰意识，开启了古希腊彩绘陶器艺术的序幕。</p><p class="">　　二、金饰竞辉光</p><p class="">　　跨入青铜时代的克里特上层人士钟爱各种材质的珠宝首饰。早期金饰造型简单，用捶打、切割和压花等工艺制成头冠、发簪、手镯、项链及挂坠等物品。至旧王宫期，工匠们可能受到巴比伦人启发，用造粒技术生产戒指、耳环等金饰，让它们看上去十分细腻精致。在新王宫期及米诺斯文化后期，金饰品更加丰富多样，尤其挂坠的珠子塑造成谷粒、宝石、瓜果、莲花、纸草、石榴等形状。有些单体挂坠则以狮子、山羊、公牛等动物为造型。然而随着宫殿的毁灭，用于制作首饰的贵金属变得稀有，逐渐被廉价材料代替。米诺斯金饰品似乎对后世古希腊的珠宝设计和工艺产生一定影响。</p><p class="">　　三、美石琢巧器</p><p class="">　　石质器皿是米诺斯文化极富特色的一类产品，可能在舶来的古埃及石器影响下发扬光大。最早的克里特自产石器可追溯至公元前 2600 年左右，不断尝试在各种或软或硬的石材上做文章，把大自然的馈赠应用到极致。约公元前1900 年始，随着宫殿的兴起，匠人们青睐颜色迷人、纹理斑驳的石料，如角砾岩和橙色钟乳石，继而又开发黑曜石、水晶石、蛇纹石、雪花石膏，用沙子配合木钻或铜钻把它们雕琢打磨成精巧的日常用具。这些石器散发出奇异光彩，行云流水般的纹理美仑美奂，宛如从浩瀚苍穹中夺来的五彩星云。</p><p class="">　　四、小印钤万方</p><p class="">　　在古代世界，印章并非中国所独有，像埃及、美索不达米亚、印度都曾使用过这种证物。大概受邻近文明的浸透，克里特人也钟爱印章，彰显出本土与外域的文化交融。它们个头不大，有的与金戒指相融合，却在方寸之间微缩了广阔天地，可谓包罗万象、异彩纷呈。青铜文明早期阶段，克里特印章刻画的主要是抽象线条和几何图案，到旧王宫期开始以野羊、公牛、狮子、蜜蜂等动物形象作印面内容。在繁荣的新王宫期，印面图案更加复杂，构思设计和表现手法与壁画息息相关，能够描绘置身于风景当中的人和物，动感十足，复杂多样，来源于刻印工匠对日常生活的细致观察。</p>',
                points: [
                    
                    { left: 24, top: 127, scene: "scene_b32", label: '场景32' },
                    { left: 24, top: 87, scene: "scene_b33", label: '场景33' },
                    { left: 24, top: 45, scene: "scene_b34", label: '场景34' },
                    { left: 62, top: 45, scene: "scene_b35", label: '场景35' },
                    { left: 99, top: 45, scene: "scene_b36", label: '场景36' },
                    { left: 137, top: 45, scene: "scene_b37", label: '场景37' },
                    { left: 173, top: 45, scene: "scene_b38", label: '场景38' },
                    { left: 211, top: 45, scene: "scene_b39", label: '场景39' },
                    { left: 246, top: 45, scene: "scene_b40", label: '场景40' },
                    { left: 290, top: 45, scene: "scene_b41", label: '场景41' },
                    { left: 335, top: 45, scene: "scene_b42", label: '场景42' },
                    { left: 269, top: 82, scene: "scene_b38", label: '场景43' },
                    { left: 215, top: 125, scene: "scene_b39", label: '场景44' },
                    { left: 247, top: 125, scene: "scene_b40", label: '场景45' },
                   
                   
    
                ]
            },
            {
                label: '第五单元',
                enterAction: '', // 选中单元时执行的 krpano 动作
                scene: 'scene_b46',
                name: '雕像',
                content: '<p class="">　　古罗马诗人维吉尔赞叹代达罗斯在神殿之门上的雕刻栩栩如生。不知是克里特人的艺术天赋启迪了代达罗斯，还是代达罗斯影响了克里特人的雕塑技艺。</p><p class="">　　新石器时代和米诺斯文化早期的考古遗址已出现造型抽象的女神雕塑，以及简陋、朴素的舞者和祭祖陶俑。大概在外来艺术和宗教信仰影响下，克里特岛逐渐出现一些带有陶土或石头肢体的大型木雕，尽管如此，米诺斯雕塑家们始终青睐小型作品。到米诺斯文化兴盛阶段，克里特人习惯在宫殿祭所、山顶神殿、山间洞穴、家庭神龛里放置男女全身或四肢、躯干陶塑，虔诚献祭给祖先和神灵。</p><p class="">　　这些雕像融合埃及、近东风格，介于抽象和写实之间，虽然依旧显得粗犷，却表现了克里特雕工对人体结构的掌握，对人物神态的拿捏，对动作姿势的塑造，可谓形神兼备、匠心独运。古希腊雕塑艺术由此肇始，经历古风时代的发展，在古典时代与希腊化时代登上巅峰。</p>',
                points: [
                    { left: 279, top: 125, scene: "scene_b46", label: '场景46' },
                    { left: 315, top: 125, scene: "scene_b47", label: '场景47' },
                    { left: 353, top: 125, scene: "scene_b48", label: '场景48' },
                    { left: 392, top: 125, scene: "scene_b49", label: '场景49' },
                ]
            },
            {
                label: '第六单元',
                enterAction: '', // 选中单元时执行的 krpano 动作
                scene: 'scene_b50',
                name: '远航',
                content: '<p class="">　　米诺斯文化出色的工艺与艺术成就得益于发达的海外贸易。克里特岛四面环海，资源匮乏，定居者被迫去岛外寻觅生产资料，航海成了那里不可或缺的险业。</p><p class="">　　考古证实，早在数万年乃至十万年前的石器时代，已陆续有勇者从小亚细亚沿岸乘小船前往克里特岛。大约公元前 3000 年以降，克里特岛跨入青铜时代，外来移民持续增长，金银、铜锡、象牙、玛瑙、红玉髓、紫水晶等物资需从域外进口，本地产品和艺术风格开始受到周边影响。克里特岛也成为繁忙的出口基地，货船从林立的港口扬帆出发，将彩陶和奢侈品输送到广阔世界，将商品纳入到东地中海的贸易网络。</p><p class="">　　海，是克里特人的第二家园，也是他们的精神寄寓。一些死者墓葬不但用贝壳、鹅卵石铺地，墓门也要面朝大海的方向。他们制作船的模型，刻画船的形象，正是依靠无畏的航海探险，克里特人发展了强大实力，促进了繁荣经济，造就了蓬勃艺术。启程远航，把璀璨的米诺斯文化传播到海那边的远方。</p>',
                points: [
                   
                    { left: 423, top: 125, scene: "scene_b50", label: '场景50' },
                    { left: 462, top: 125, scene: "scene_b51", label: '场景51' },
                    { left: 493, top: 125, scene: "scene_b52", label: '场景52' },
                ]
            },
            {
                label: '第七单元',
                enterAction: '', // 选中单元时执行的 krpano 动作
                scene: 'scene_b53',
                name: '海月同辉:青铜时代的东方回响',
                content: '<p class="">　　当青铜文明的第一缕光芒同时照亮爱琴海与华夏大地，中国先民与米诺斯工匠以铜锡合金为共同介质，在隔绝的地理时空中浇铸出风格迥异却同样璀璨的文明之花。</p><p class="">　　这是代达罗斯：希腊克里特岛的神话特展续章，通过故宫博物院珍藏的夏商周礼器，与克里特岛文物展开一场跨越时空的对谈。</p><p class="">　　这些深藏于文物中的密码，既非文化传播的实证，亦非技术同源的注脚，而是人类文明在相似认知阶段产生的精神共振。</p><p class="">　　黄河长江孕育的农耕文明，与爱琴海滋养的海洋文明，好比音乐厅里的二重奏：各自遵循着不同的文明路径，却在敬畏自然、探索技艺、建构秩序的征程中，共同谱写出人类早期文明的壮丽诗篇。</p><p class="">　　陶器作为最古老的工艺之一，在两地既具共性又呈现出不同的文化表达。龙山黑陶与克里特卡马雷斯彩陶皆以极致工艺实现器物的轻盈透薄，展现高度成熟的制陶技艺。仰韶、马家窑彩陶的漩涡与花卉纹饰，与克里特彩陶的自然主义图案相呼应，二者分别折射出农耕文明与海洋文明对自然景观的抽象表达与直观描绘。</p><p class="">　　玉石的运用分别映照出神权与世俗的不同侧面。良渚玉璧、玉琮以方圆结构承载宇宙观念，代表沟通神灵的信仰，而米诺斯文化的石质器皿则强调实用价值，将自然之材融入日常生活。</p><p class="">　　青铜冶铸的突破标志着社会组织形态的演进。克里特工匠铸造青铜武器，殷商工匠铸造青铜礼器，二者皆彰显权力象征。克里特双刃斧兼具工具、武器与祭祀象征，而殷商青铜钺则主要表现军事威仪与祭祀礼仪；克里特青铜矛拓展了海洋贸易的疆域，而商代的玉刃矛则具有象征性的征伐含义，体现出军事与礼制的发展差异。</p><p class="">　　文字的演进展现出文明治理模式的差异。米诺斯文化的各类文字主要用于行政和经济活动记录，而殷商甲骨文则与占卜体系紧密相连，反映神权统治的权威性。同时，克里特印章偏向经贸和行政用途，而西周铜印则象征贵族身份。</p><p class="">　　饰品不仅彰显个人身份，更折射文明价值观。克里特半宝石项链反映了海洋贸易的繁荣，商代骨簪、西周玉组佩则以其独特使用规范反映礼制社会下的思想秩序。</p>',
                points: [
                   
                    { left: 530, top: 125, scene: "scene_b53", label: '场景53' },
                    { left: 530, top: 88, scene: "scene_b54", label: '场景54' },
                    { left: 530, top: 49, scene: "scene_b55", label: '场景55' },
                    { left: 495, top: 49, scene: "scene_b56", label: '场景56' },
                    { left: 453, top: 79, scene: "scene_b57", label: '场景57' },
                    { left: 410, top: 49, scene: "scene_b58", label: '场景58' },
                    { left: 377, top: 21, scene: "scene_b59", label: '场景59' },
                ]
            },
         ]
    },
]