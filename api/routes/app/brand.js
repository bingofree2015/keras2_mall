/**
 * Created by bingofree.
 */
const _ = require('lodash');
const Router = require('@koa/router');
const advertPositionRepos = require('../../repository/advert/advert_position_repos');
const advertisementRepos = require('../../repository/advert/advertisement_repos');

const router = Router({ prefix: '/brand' });

router.get('/', async (ctx) => {
  ctx.body = '品牌相关接口';
});
/**
 * 获取品牌列表
 */
router.post('/get_brand_list', async (ctx) => {
  const { searchKey, offset, limit } = ctx.request.body;
  let _result = null;

  _result = await brandRepo.list(searchKey, offset, limit);
  ctx.body = _result;
});

module.exports = router;
